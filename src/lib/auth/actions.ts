"use server";

import { createClient } from "@/lib/supabase/server";
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

  if (!hasSupabase()) {
    redirect(`/login?error=${encodeURIComponent(NOT_CONFIGURED_MSG)}`);
  }
  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("Preencha email e senha.")}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

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

  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseUrl}/auth/callback?next=/nova-senha`,
  });
  // Sempre responde "enviado" (evita enumeration — não revela se email existe)
  if (error) {
    console.warn("[esqueci-senha] erro:", error.message);
  }
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
