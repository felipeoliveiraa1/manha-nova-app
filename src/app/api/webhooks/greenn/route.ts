import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  sendWelcomeEmail,
  sendSubscriptionCanceledEmail,
  sendPaymentFailedEmail,
} from "@/lib/email/send";

// Greenn webhook (Hotmart-like). HMAC SHA256 via header `X-Greenn-Signature`.

type GreennPayload = {
  event?: string;
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
  };
};

function verifySignature(body: string, signature: string | null) {
  if (!process.env.GREENN_WEBHOOK_SECRET) return true;
  if (!signature) return false;
  const hmac = crypto
    .createHmac("sha256", process.env.GREENN_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(hmac),
    Buffer.from(signature),
  );
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
  const signature = req.headers.get("x-greenn-signature");
  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let payload: GreennPayload;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
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

  if (!userId && status === "active") {
    const { data: created, error: createErr } =
      await admin.auth.admin.createUser({
        email,
        password: crypto.randomBytes(16).toString("hex"),
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

  // Dispara emails transacionais (best-effort, não bloqueia resposta)
  try {
    if (isNewUser && status === "active") {
      const { data: link } = await admin.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/home`,
        },
      });
      const loginUrl =
        link?.properties?.action_link ??
        `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/login`;
      await sendWelcomeEmail({ email, nome, loginUrl });
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
