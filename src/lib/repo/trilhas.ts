import { createClientOrNull } from "@/lib/supabase/server";
import { TRILHAS_SEED, TRILHA_DIAS_SEED } from "@/lib/seed/trilhas";
import type { Trilha, TrilhaDia } from "@/lib/supabase/types";

export async function listTrilhas(): Promise<Trilha[]> {
  const supabase = await createClientOrNull();
  if (supabase) {
    const { data } = await supabase
      .from("trilhas")
      .select("*")
      .eq("publicado", true)
      .order("created_at", { ascending: true });
    if (data && data.length > 0) return data as Trilha[];
  }
  return TRILHAS_SEED;
}

export async function getTrilha(slug: string): Promise<Trilha | null> {
  const supabase = await createClientOrNull();
  if (supabase) {
    const { data } = await supabase
      .from("trilhas")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (data) return data as Trilha;
  }
  return TRILHAS_SEED.find((t) => t.slug === slug) ?? null;
}

export async function listDiasDaTrilha(trilhaId: string): Promise<TrilhaDia[]> {
  const supabase = await createClientOrNull();
  if (supabase) {
    const { data } = await supabase
      .from("trilha_dias")
      .select("*")
      .eq("trilha_id", trilhaId)
      .order("dia", { ascending: true });
    if (data && data.length > 0) return data as TrilhaDia[];
  }
  return TRILHA_DIAS_SEED.filter((d) => d.trilha_id === trilhaId).sort(
    (a, b) => a.dia - b.dia,
  );
}

export async function getDiaDaTrilha(
  trilhaId: string,
  dia: number,
): Promise<TrilhaDia | null> {
  const dias = await listDiasDaTrilha(trilhaId);
  return dias.find((d) => d.dia === dia) ?? null;
}
