import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Callback pra magic link e password recovery.
 * Supabase redireciona pra ca com ?code=... apos verificacao.
 * Trocamos o code por sessao (seta cookies) e mandamos pro ?next=...
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/home";
  const origin = url.origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    // Se falhou, manda pro login com erro
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(
        "Link expirado ou inválido. Solicite novo email.",
      )}`,
    );
  }

  // Sem code, redireciona pro login
  return NextResponse.redirect(`${origin}/login`);
}
