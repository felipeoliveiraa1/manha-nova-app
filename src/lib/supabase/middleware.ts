import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./types";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Modo preview: sem Supabase configurado, libera geral para facilitar o desenvolvimento visual.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  // /nova-senha NAO eh auth route porque o user JA esta logado via recovery link
  // e precisa ficar la pra definir a senha.
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/esqueci-senha") ||
    pathname.startsWith("/cadastro");
  // App em modo guest: a maioria das rotas eh livre pra explorar sem login.
  // So bloqueia rotas que so fazem sentido pra um user logado (perfil, config,
  // admin, upgrade) ou que sao premium-restritas (audio, no futuro webinarios).
  const isProtected =
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/configuracoes") ||
    pathname.startsWith("/upgrade") ||
    pathname.startsWith("/admin");

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  // Gating por subscription agora eh por-rota via requirePremium() nas pages.
  // Middleware so garante que tem login pras rotas protegidas.

  return supabaseResponse;
}
