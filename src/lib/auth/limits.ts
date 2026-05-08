import { createClientOrNull } from "@/lib/supabase/server";

/**
 * Limites do plano FREE por feature. Premium = sem limite (ou limite alto).
 * periodDays: janela de contagem (1 = diario, 7 = semanal).
 */
export const FREE_LIMITS = {
  ia_message: { count: 5, periodDays: 1, label: "5 mensagens por dia" },
  devocional: {
    count: 2,
    periodDays: 7,
    label: "2 devocionais por semana",
  },
} as const;

export const PREMIUM_LIMITS = {
  ia_message: { count: 30, periodDays: 1, label: "30 mensagens por dia" },
  devocional: { count: 999, periodDays: 7, label: "Ilimitado" },
} as const;

export type Feature = keyof typeof FREE_LIMITS;

/**
 * Verifica se o user JA acessou um devocional especifico no periodo.
 * Se sim, ele pode reabrir sem consumir nova quota.
 */
export async function hasViewedDevocional(
  userId: string,
  slug: string,
): Promise<boolean> {
  const { createClientOrNull: makeClient } = await import("@/lib/supabase/server");
  const supabase = await makeClient();
  if (!supabase) return false;
  const since = new Date(Date.now() - FREE_LIMITS.devocional.periodDays * 86400_000);
  const { count } = await supabase
    .from("user_feature_uses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("feature", "devocional")
    .eq("meta->>slug", slug)
    .gte("used_at", since.toISOString());
  return (count ?? 0) > 0;
}

/**
 * Conta quantos devocionais DISTINTOS o user ja abriu no periodo.
 */
export async function countDistinctDevocionais(
  userId: string,
): Promise<number> {
  const { createClientOrNull: makeClient } = await import("@/lib/supabase/server");
  const supabase = await makeClient();
  if (!supabase) return 0;
  const since = new Date(Date.now() - FREE_LIMITS.devocional.periodDays * 86400_000);
  const { data } = await supabase
    .from("user_feature_uses")
    .select("meta")
    .eq("user_id", userId)
    .eq("feature", "devocional")
    .gte("used_at", since.toISOString());
  const slugs = new Set(
    (data as { meta: { slug?: string } | null }[] | null)
      ?.map((r) => r.meta?.slug)
      .filter((s): s is string => !!s) ?? [],
  );
  return slugs.size;
}

/**
 * Conta quantas vezes o user usou a feature no periodo. Usa user_feature_uses.
 */
export async function countFeatureUses(
  userId: string,
  feature: Feature,
  periodDays: number,
): Promise<number> {
  const supabase = await createClientOrNull();
  if (!supabase) return 0;
  const since = new Date(Date.now() - periodDays * 86400_000);
  const { count } = await supabase
    .from("user_feature_uses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("feature", feature)
    .gte("used_at", since.toISOString());
  return count ?? 0;
}

/**
 * Registra um uso da feature pelo user. Best-effort — falha silenciosa
 * pra nao quebrar a UX da feature em si.
 */
export async function recordFeatureUse(
  userId: string,
  feature: Feature,
  meta?: Record<string, unknown>,
): Promise<void> {
  const supabase = await createClientOrNull();
  if (!supabase) return;
  await supabase
    .from("user_feature_uses")
    .insert({
      user_id: userId,
      feature,
      meta: meta ?? null,
    });
}

/**
 * Retorna { remaining, limit, periodDays } com a quota pro tier do user.
 * Premium ja tem limite mais generoso (ou ilimitado).
 */
export async function getQuota(
  userId: string,
  feature: Feature,
  tier: "free" | "premium",
): Promise<{ remaining: number; limit: number; periodDays: number; usedPercent: number }> {
  const config = tier === "premium" ? PREMIUM_LIMITS[feature] : FREE_LIMITS[feature];
  const used = await countFeatureUses(userId, feature, config.periodDays);
  const remaining = Math.max(0, config.count - used);
  return {
    remaining,
    limit: config.count,
    periodDays: config.periodDays,
    usedPercent: Math.min(100, Math.round((used / config.count) * 100)),
  };
}
