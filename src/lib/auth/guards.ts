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
 * Guard server-side: exige assinatura ativa ou role=admin.
 * Se nao tiver, redireciona pra /assinatura-expirada.
 *
 * Uso nas pages:
 *   const user = await requireActiveSubscription();
 *
 * Eh defense-in-depth: mesmo que o middleware falhe, a pagina em si bloqueia.
 * Admin e modo preview passam direto.
 */
export async function requireActiveSubscription(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  const ativa = await getSubscriptionActive(user);
  if (!ativa) redirect("/assinatura-expirada");
  return user;
}

/**
 * Verifica assinatura sem redirecionar (para UIs que querem saber o status).
 */
export async function hasActiveSubscription(): Promise<boolean> {
  const user = await getCurrentUser();
  return getSubscriptionActive(user);
}
