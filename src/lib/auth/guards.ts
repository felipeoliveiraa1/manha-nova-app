import { cache } from "react";
import { redirect } from "next/navigation";
import { createClientOrNull } from "@/lib/supabase/server";
import { getCurrentUser, type CurrentUser } from "@/lib/auth/user";

const getSubscriptionActive = cache(async (user: CurrentUser): Promise<boolean> => {
  if (user.isPreview) return true;
  if (user.profile.role === "admin") return true;

  const supabase = await createClientOrNull();
  if (!supabase) return false;

  const filter = user.email
    ? `user_id.eq.${user.id},email.eq.${user.email}`
    : `user_id.eq.${user.id}`;

  const { data } = await supabase
    .from("subscriptions")
    .select("status,current_period_end")
    .or(filter)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const row = data as
    | { status: string; current_period_end: string | null }
    | null;

  return (
    !!row &&
    (row.status === "active" || row.status === "trialing") &&
    (!row.current_period_end ||
      new Date(row.current_period_end) > new Date())
  );
});

/**
 * Apenas exige login. Nao exige pagar — qualquer user cadastrado passa.
 * Se nao tiver sessao, redireciona pra /login.
 *
 * Uso pra rotas FREE (qualquer cadastrado): home, devocionais (texto),
 * missoes, biblia (notas/highlights), diario, oracao, etc.
 */
export async function requireAuth(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (user.isPreview) {
    // Sem Supabase configurado ou sem sessao real — redireciona pra login
    redirect("/login");
  }
  return user;
}

/**
 * Exige assinatura premium ativa. Se nao tiver, redireciona pra /upgrade.
 * Admin e modo preview passam direto.
 *
 * Uso pra rotas PREMIUM (Yan): audio, webinars, estudos teologicos.
 */
export async function requirePremium(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  const ativa = await getSubscriptionActive(user);
  if (!ativa) redirect("/upgrade");
  return user;
}

/**
 * @deprecated Use requirePremium() (mesma logica, redirect novo).
 * Mantido pra compat com rotas que ainda nao migraram.
 */
export async function requireActiveSubscription(): Promise<CurrentUser> {
  return requirePremium();
}

/**
 * Verifica assinatura sem redirecionar (pra UIs que querem saber o status).
 */
export async function hasActiveSubscription(): Promise<boolean> {
  const user = await getCurrentUser();
  return getSubscriptionActive(user);
}

/**
 * Tier do user pra UI: 'free' ou 'premium'.
 * Derivado da subscription — sem coluna nova no DB.
 */
export const getUserTier = cache(
  async (): Promise<"free" | "premium" | "guest"> => {
    const user = await getCurrentUser();
    if (user.isPreview) return "guest";
    if (user.profile.role === "admin") return "premium";
    const ativa = await getSubscriptionActive(user);
    return ativa ? "premium" : "free";
  },
);
