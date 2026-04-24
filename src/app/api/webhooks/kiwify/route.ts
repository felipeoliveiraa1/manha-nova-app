import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  sendWelcomeEmail,
  sendSubscriptionCanceledEmail,
  sendPaymentFailedEmail,
} from "@/lib/email/send";

// Kiwify envia um token HMAC no header `X-Kiwify-Signature` (ou campo `signature`
// dependendo da versao). Aqui fazemos verificacao HMAC SHA256 do corpo cru.
// Configure o secret em KIWIFY_WEBHOOK_SECRET (mesmo que o painel Kiwify).

type KiwifyPayload = {
  order_id?: string;
  order_status?: string; // 'paid' | 'refunded' | 'canceled' | 'chargedback'
  Customer?: { email?: string; full_name?: string };
  customer?: { email?: string; full_name?: string };
  Product?: { product_id?: string; product_name?: string };
  product?: { product_id?: string; product_name?: string };
  subscription_id?: string;
  Subscription?: { id?: string; next_payment?: string; status?: string };
  subscription?: { id?: string; next_payment?: string; status?: string };
  webhook_event_type?: string;
};

function verifySignature(body: string, signature: string | null) {
  if (!process.env.KIWIFY_WEBHOOK_SECRET) return true; // em dev, deixa passar
  if (!signature) return false;
  const hmac = crypto
    .createHmac("sha1", process.env.KIWIFY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(hmac),
    Buffer.from(signature),
  );
}

function statusFromKiwify(
  orderStatus: string | undefined,
): "active" | "refunded" | "canceled" | "past_due" | "expired" {
  const s = (orderStatus ?? "").toLowerCase();
  if (s === "paid" || s === "approved") return "active";
  if (s === "refunded") return "refunded";
  if (s === "canceled" || s === "cancelled") return "canceled";
  if (s === "past_due") return "past_due";
  return "expired";
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature =
    req.headers.get("x-kiwify-signature") ??
    new URL(req.url).searchParams.get("signature");
  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let payload: KiwifyPayload;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const customer = payload.Customer ?? payload.customer;
  const email = customer?.email?.toLowerCase().trim();
  if (!email) {
    return NextResponse.json({ error: "missing email" }, { status: 400 });
  }

  const subObj = payload.Subscription ?? payload.subscription;
  const externalId =
    subObj?.id ?? payload.subscription_id ?? payload.order_id ?? email;
  const status = statusFromKiwify(payload.order_status);
  const currentPeriodEnd = subObj?.next_payment ?? null;
  const planName =
    payload.Product?.product_name ?? payload.product?.product_name ?? null;

  const admin = createAdminClient();
  const nome = customer?.full_name ?? email.split("@")[0];

  // Acha user pelo email
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
        user_metadata: { nome, provisioned_via: "kiwify" },
      });
    if (createErr) {
      console.error("[kiwify] createUser failed:", createErr);
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
        provider: "kiwify",
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

  try {
    if (isNewUser && status === "active") {
      const { data: link } = await admin.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/auth/callback?next=/home`,
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
    console.error("[kiwify] email dispatch failed:", e);
  }

  return NextResponse.json({ ok: true });
}
