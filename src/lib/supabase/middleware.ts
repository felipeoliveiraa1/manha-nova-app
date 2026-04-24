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
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  // /biblia e /explorar sao conteudo publico (cacheaveis, sem auth na borda).
  const isProtected =
    pathname.startsWith("/home") ||
    pathname.startsWith("/devocionais") ||
    pathname.startsWith("/missoes") ||
    pathname.startsWith("/quiz") ||
    pathname.startsWith("/trilhas") ||
    pathname.startsWith("/audio") ||
    pathname.startsWith("/ia") ||
    pathname.startsWith("/diario") ||
    pathname.startsWith("/oracao") ||
    pathname.startsWith("/igrejas") ||
    pathname.startsWith("/perfil") ||
    pathname.startsWith("/configuracoes") ||
    pathname.startsWith("/conquistas") ||
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

  // Gating por assinatura: rotas pagas exigem subscription ativa.
  // Usuario pode acessar /perfil, /assinatura-expirada e /configuracoes mesmo sem sub.
  const needsSubscription =
    user &&
    isProtected &&
    !pathname.startsWith("/perfil") &&
    !pathname.startsWith("/assinatura-expirada") &&
    !pathname.startsWith("/configuracoes") &&
    !pathname.startsWith("/admin");

  if (needsSubscription) {
    // Admin bypassa o gate
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    const isAdminUser = (profile as { role?: string } | null)?.role === "admin";

    if (!isAdminUser) {
      // Query robusta: so inclui filter de email se ele existir
      const filter = user.email
        ? `user_id.eq.${user.id},email.eq.${user.email}`
        : `user_id.eq.${user.id}`;

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status,current_period_end")
        .or(filter)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const subRow = sub as
        | { status: string; current_period_end: string | null }
        | null;

      const ativa =
        !!subRow &&
        (subRow.status === "active" || subRow.status === "trialing") &&
        (!subRow.current_period_end ||
          new Date(subRow.current_period_end) > new Date());

      if (!ativa) {
        const url = request.nextUrl.clone();
        url.pathname = "/assinatura-expirada";
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
