"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPasswordResetEmail } from "@/lib/email/send";
import { redirect } from "next/navigation";

function hasSupabase() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

const NOT_CONFIGURED_MSG =
  "Modo preview: Supabase ainda não está configurado.";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/home");

  console.log("[login] attempt", { email, passwordLength: password.length, next });

  if (!hasSupabase()) {
    redirect(`/login?error=${encodeURIComponent(NOT_CONFIGURED_MSG)}`);
  }
  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("Preencha email e senha.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.warn("[login] signInWithPassword error:", {
      email,
      code: error.code,
      message: error.message,
    });
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  console.log("[login] success, redirecting to", next);
  redirect(next);
}

export async function esqueciSenhaAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!hasSupabase()) {
    redirect(`/esqueci-senha?error=${encodeURIComponent(NOT_CONFIGURED_MSG)}`);
  }
  if (!email) {
    redirect(
      `/esqueci-senha?error=${encodeURIComponent("Informe seu email.")}`,
    );
  }

  // Gera link de recovery via admin (nao dispara email do Supabase) + envia via Resend.
  try {
    const admin = createAdminClient();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
    const { data, error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${baseUrl}/auth/callback?next=/nova-senha`,
      },
    });
    if (error) {
      console.warn("[esqueci-senha] generateLink erro:", error.message);
    } else if (data?.properties?.action_link) {
      await sendPasswordResetEmail({
        email,
        nome: email.split("@")[0],
        resetUrl: data.properties.action_link,
      });
    }
  } catch (e) {
    console.error("[esqueci-senha] falha:", e);
  }

  // Sempre responde "enviado" (evita enumeration — não revela se email existe)
  redirect("/esqueci-senha?sent=1");
}

export async function novaSenhaAction(formData: FormData) {
  const senha = String(formData.get("senha") ?? "");
  const confirmar = String(formData.get("confirmar") ?? "");

  if (!hasSupabase()) {
    redirect(`/nova-senha?error=${encodeURIComponent(NOT_CONFIGURED_MSG)}`);
  }
  if (senha.length < 8) {
    redirect(
      `/nova-senha?error=${encodeURIComponent("Mínimo de 8 caracteres.")}`,
    );
  }
  if (senha !== confirmar) {
    redirect(
      `/nova-senha?error=${encodeURIComponent("As senhas não coincidem.")}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: senha });
  if (error) {
    redirect(`/nova-senha?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/home?senha_definida=1");
}

export async function logoutAction() {
  if (!hasSupabase()) redirect("/");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
