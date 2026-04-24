import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateReadablePassword } from "@/lib/auth/password";
import {
  sendWelcomeEmail,
  sendSubscriptionCanceledEmail,
  sendPaymentFailedEmail,
} from "@/lib/email/send";

// Greenn webhook. Valida via "Webhook Token" estatico (Greenn manda o token
// no request — nao usa HMAC). v2.

type GreennPayload = {
  event?: string;
  token?: string;
  webhook_token?: string;
  data?: {
    buyer?: { email?: string; name?: string };
    product?: { id?: string; name?: string };
    subscription?: {
      id?: string;
      status?: string;
      next_billing_at?: string;
    };
    status?: string;
    transaction_id?: string;
    token?: string;
  };
};

function timingSafeEq(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function verifyToken(req: Request, body: string, payload: GreennPayload) {
  const expected = process.env.GREENN_WEBHOOK_SECRET;
  if (!expected) return true; // fail-open se nao configurado (dev)

  const url = new URL(req.url);
  const candidates: (string | null | undefined)[] = [
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, ""),
    req.headers.get("x-webhook-token"),
    req.headers.get("x-greenn-token"),
    req.headers.get("x-greenn-signature"),
    req.headers.get("token"),
    url.searchParams.get("token"),
    payload.token,
    payload.webhook_token,
    payload.data?.token,
  ];

  // Ultimo recurso: token aparece em algum lugar no body cru
  if (body.includes(expected)) return true;

  return candidates.some((c) => c && timingSafeEq(c, expected));
}

function statusFromGreenn(
  s: string | undefined,
): "active" | "refunded" | "canceled" | "past_due" | "expired" {
  const v = (s ?? "").toLowerCase();
  if (v === "paid" || v === "approved" || v === "active") return "active";
  if (v === "refunded") return "refunded";
  if (v === "canceled" || v === "cancelled") return "canceled";
  if (v === "overdue" || v === "past_due") return "past_due";
  return "expired";
}

export async function POST(req: Request) {
  const body = await req.text();

  let payload: GreennPayload;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!verifyToken(req, body, payload)) {
    console.warn("[greenn] token invalido");
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }

  const email = payload.data?.buyer?.email?.toLowerCase().trim();
  if (!email) {
    return NextResponse.json({ error: "missing email" }, { status: 400 });
  }

  const externalId =
    payload.data?.subscription?.id ??
    payload.data?.transaction_id ??
    email;
  const status = statusFromGreenn(
    payload.data?.subscription?.status ?? payload.data?.status,
  );
  const currentPeriodEnd = payload.data?.subscription?.next_billing_at ?? null;
  const planName = payload.data?.product?.name ?? null;

  const admin = createAdminClient();
  const nome = payload.data?.buyer?.name ?? email.split("@")[0];

  const existingUser = (await admin.auth.admin.listUsers()).data.users.find(
    (u) => u.email?.toLowerCase() === email,
  );
  let userId = existingUser?.id ?? null;
  let isNewUser = false;
  let senhaGerada: string | null = null;

  if (!userId && status === "active") {
    senhaGerada = generateReadablePassword(10);
    const { data: created, error: createErr } =
      await admin.auth.admin.createUser({
        email,
        password: senhaGerada,
        email_confirm: true,
        user_metadata: { nome, provisioned_via: "greenn" },
      });
    if (createErr) {
      console.error("[greenn] createUser failed:", createErr);
    }
    userId = created?.user?.id ?? null;
    isNewUser = !!userId;
  }

  const { error } = await admin
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        email,
        provider: "greenn",
        external_id: externalId,
        plan_name: planName,
        status,
        current_period_end: currentPeriodEnd,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "provider,external_id" },
    );
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Emails transacionais via Resend (best-effort, nao bloqueia resposta)
  try {
    if (isNewUser && status === "active" && senhaGerada) {
      const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/login`;
      await sendWelcomeEmail({ email, nome, senha: senhaGerada, loginUrl });
    } else if (status === "canceled" || status === "refunded") {
      await sendSubscriptionCanceledEmail({ email, nome });
    } else if (status === "past_due") {
      await sendPaymentFailedEmail({ email, nome });
    }
  } catch (e) {
    console.error("[greenn] email dispatch failed:", e);
  }

  return NextResponse.json({ ok: true });
}
