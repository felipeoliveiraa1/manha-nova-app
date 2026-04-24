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
  "Modo preview: Supabase ainda não está configurado. Preencha .env.local para habilitar login.";

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

export async function registerAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nome = String(formData.get("nome") ?? "").trim();

  if (!hasSupabase()) {
    redirect(`/register?error=${encodeURIComponent(NOT_CONFIGURED_MSG)}`);
  }
  if (!email || !password || !nome) {
    redirect(`/register?error=${encodeURIComponent("Preencha todos os campos.")}`);
  }
  if (password.length < 8) {
    redirect(
      `/register?error=${encodeURIComponent(
        "A senha precisa ter pelo menos 8 caracteres.",
      )}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nome } },
  });
  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?just_registered=1");
}

export async function logoutAction() {
  if (!hasSupabase()) redirect("/");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
