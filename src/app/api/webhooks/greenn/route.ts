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

type GreennPayload = Record<string, unknown> & {
  event?: string;
  token?: string;
  webhook_token?: string;
  data?: Record<string, unknown>;
};

// Greenn varia o formato do payload entre eventos/integrações.
// Estes helpers tentam caminhos comuns ate achar o valor.
type AnyObj = Record<string, unknown> | undefined | null;

function pickString(obj: unknown, paths: string[]): string | null {
  if (!obj || typeof obj !== "object") return null;
  for (const path of paths) {
    const parts = path.split(".");
    let cur: unknown = obj;
    for (const p of parts) {
      if (cur && typeof cur === "object" && p in (cur as AnyObj)!) {
        cur = (cur as Record<string, unknown>)[p];
      } else {
        cur = undefined;
        break;
      }
    }
    if (typeof cur === "string" && cur.trim()) return cur.trim();
  }
  return null;
}

function resolveEmail(p: GreennPayload): string | null {
  return pickString(p, [
    "data.buyer.email",
    "buyer.email",
    "data.customer.email",
    "customer.email",
    "data.user.email",
    "user.email",
    "data.client.email",
    "client.email",
    "data.email",
    "email",
  ])?.toLowerCase() ?? null;
}

function resolveName(p: GreennPayload): string | null {
  return pickString(p, [
    "data.buyer.name",
    "buyer.name",
    "data.customer.name",
    "customer.name",
    "data.user.name",
    "user.name",
    "data.client.name",
    "client.name",
    "data.name",
    "name",
  ]);
}

function resolveStatus(p: GreennPayload): string | null {
  return pickString(p, [
    "data.subscription.status",
    "subscription.status",
    "data.status",
    "status",
    "event",
  ]);
}

function resolveExternalId(p: GreennPayload): string | null {
  return pickString(p, [
    "data.subscription.id",
    "subscription.id",
    "data.transaction_id",
    "transaction_id",
    "data.id",
    "id",
  ]);
}

function resolvePlanName(p: GreennPayload): string | null {
  return pickString(p, [
    "data.product.name",
    "product.name",
    "data.plan.name",
    "plan.name",
    "data.offer.name",
    "offer.name",
  ]);
}

function resolveNextBilling(p: GreennPayload): string | null {
  return pickString(p, [
    "data.subscription.next_billing_at",
    "subscription.next_billing_at",
    "data.next_billing_at",
    "next_billing_at",
    "data.subscription.expires_at",
    "subscription.expires_at",
  ]);
}

function sanitizeForLog(p: unknown): unknown {
  if (!p || typeof p !== "object") return p;
  const clone = JSON.parse(JSON.stringify(p)) as Record<string, unknown>;
  // remove tokens/secrets do log
  for (const key of ["token", "webhook_token", "Authorization", "authorization"]) {
    if (key in clone) delete clone[key];
    if (clone.data && typeof clone.data === "object" && clone.data !== null) {
      delete (clone.data as Record<string, unknown>)[key];
    }
  }
  return clone;
}

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
  const tokenFromBody = pickString(payload, [
    "token",
    "webhook_token",
    "data.token",
    "data.webhook_token",
  ]);
  const candidates: (string | null | undefined)[] = [
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, ""),
    req.headers.get("x-webhook-token"),
    req.headers.get("x-greenn-token"),
    req.headers.get("x-greenn-signature"),
    req.headers.get("token"),
    url.searchParams.get("token"),
    tokenFromBody,
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

  const email = resolveEmail(payload);
  if (!email) {
    console.warn(
      "[greenn] missing email — payload recebido:",
      JSON.stringify(sanitizeForLog(payload)).slice(0, 2000),
    );
    return NextResponse.json({ error: "missing email" }, { status: 400 });
  }

  const externalId = resolveExternalId(payload) ?? email;
  const status = statusFromGreenn(resolveStatus(payload) ?? undefined);
  const currentPeriodEnd = resolveNextBilling(payload);
  const planName = resolvePlanName(payload);

  const admin = createAdminClient();
  const nome = resolveName(payload) ?? email.split("@")[0];

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
