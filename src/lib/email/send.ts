import { Resend } from "resend";
import { WelcomeEmail } from "@/emails/welcome";
import { SubscriptionCanceledEmail } from "@/emails/subscription-canceled";
import { PaymentFailedEmail } from "@/emails/payment-failed";
import { PasswordResetEmail } from "@/emails/password-reset";

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

function fromAddress() {
  return (
    process.env.RESEND_FROM_EMAIL ||
    "Manhã Nova <onboarding@resend.dev>"
  );
}

function checkoutUrl() {
  return process.env.NEXT_PUBLIC_CHECKOUT_URL ?? "#";
}

export async function sendWelcomeEmail(params: {
  email: string;
  nome: string;
  loginUrl: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set, skipping welcome");
    return { ok: false, skipped: true };
  }
  try {
    await resend.emails.send({
      from: fromAddress(),
      to: params.email,
      subject: "Seu acesso ao Manhã Nova está pronto",
      react: WelcomeEmail({ nome: params.nome, loginUrl: params.loginUrl }),
    });
    return { ok: true };
  } catch (e) {
    console.error("[email] welcome failed:", e);
    return { ok: false, error: String(e) };
  }
}

export async function sendSubscriptionCanceledEmail(params: {
  email: string;
  nome: string;
}) {
  const resend = getResend();
  if (!resend) return { ok: false, skipped: true };
  try {
    await resend.emails.send({
      from: fromAddress(),
      to: params.email,
      subject: "Sua assinatura do Manhã Nova foi cancelada",
      react: SubscriptionCanceledEmail({
        nome: params.nome,
        checkoutUrl: checkoutUrl(),
      }),
    });
    return { ok: true };
  } catch (e) {
    console.error("[email] canceled failed:", e);
    return { ok: false, error: String(e) };
  }
}

export async function sendPasswordResetEmail(params: {
  email: string;
  nome: string;
  resetUrl: string;
}) {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set, skipping password reset");
    return { ok: false, skipped: true };
  }
  try {
    await resend.emails.send({
      from: fromAddress(),
      to: params.email,
      subject: "Redefina sua senha do Manhã Nova",
      react: PasswordResetEmail({
        nome: params.nome,
        resetUrl: params.resetUrl,
      }),
    });
    return { ok: true };
  } catch (e) {
    console.error("[email] password reset failed:", e);
    return { ok: false, error: String(e) };
  }
}

export async function sendPaymentFailedEmail(params: {
  email: string;
  nome: string;
}) {
  const resend = getResend();
  if (!resend) return { ok: false, skipped: true };
  try {
    await resend.emails.send({
      from: fromAddress(),
      to: params.email,
      subject: "Problema no pagamento do Manhã Nova",
      react: PaymentFailedEmail({
        nome: params.nome,
        checkoutUrl: checkoutUrl(),
      }),
    });
    return { ok: true };
  } catch (e) {
    console.error("[email] payment failed email failed:", e);
    return { ok: false, error: String(e) };
  }
}
