import { createClientOrNull } from "@/lib/supabase/server";

/**
 * Conta missoes concluidas pelo usuario no dia de hoje (UTC local).
 */
export async function missoesConcluidasHoje(userId: string): Promise<number> {
  const supabase = await createClientOrNull();
  if (!supabase) return 0;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("user_missoes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("concluido_em", start.toISOString());
  return count ?? 0;
}

export async function missoesConcluidasTotal(userId: string): Promise<number> {
  const supabase = await createClientOrNull();
  if (!supabase) return 0;
  const { count } = await supabase
    .from("user_missoes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  return count ?? 0;
}

export async function devocionaisConcluidosTotal(
  userId: string,
): Promise<number> {
  const supabase = await createClientOrNull();
  if (!supabase) return 0;
  const { count } = await supabase
    .from("user_devocional_progress")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  return count ?? 0;
}
