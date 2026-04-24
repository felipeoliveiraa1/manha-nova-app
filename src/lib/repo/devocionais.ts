import { createClientOrNull } from "@/lib/supabase/server";
import {
  DEVOCIONAIS_SEED,
  SERIES_SEED,
  devocionalDoDia as seedDevocionalDoDia,
} from "@/lib/seed/devocionais";
import type { Devocional, DevocionalSerie } from "@/lib/supabase/types";

export async function getDevocionalDoDia(): Promise<Devocional> {
  const supabase = await createClientOrNull();
  if (supabase) {
    const { data } = await supabase
      .from("devocionais")
      .select("*")
      .eq("publicado", true)
      .eq("data", new Date().toISOString().slice(0, 10))
      .maybeSingle();
    if (data) return data as Devocional;
  }
  return seedDevocionalDoDia();
}

export async function getDevocional(slug: string): Promise<Devocional | null> {
  const supabase = await createClientOrNull();
  if (supabase) {
    const { data } = await supabase
      .from("devocionais")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (data) return data as Devocional;
  }
  return DEVOCIONAIS_SEED.find((d) => d.slug === slug) ?? null;
}

export async function listDevocionais(): Promise<Devocional[]> {
  const supabase = await createClientOrNull();
  if (supabase) {
    const { data } = await supabase
      .from("devocionais")
      .select("*")
      .eq("publicado", true)
      .order("ordem", { ascending: true });
    if (data && data.length > 0) return data as Devocional[];
  }
  return DEVOCIONAIS_SEED;
}

export async function listSeries(): Promise<DevocionalSerie[]> {
  const supabase = await createClientOrNull();
  if (supabase) {
    const { data } = await supabase
      .from("devocional_series")
      .select("*")
      .eq("publicado", true)
      .order("ordem", { ascending: true });
    if (data && data.length > 0) return data as DevocionalSerie[];
  }
  return SERIES_SEED;
}

export async function getSerie(slug: string): Promise<DevocionalSerie | null> {
  const supabase = await createClientOrNull();
  if (supabase) {
    const { data } = await supabase
      .from("devocional_series")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (data) return data as DevocionalSerie;
  }
  return SERIES_SEED.find((s) => s.slug === slug) ?? null;
}

export async function listDevocionaisBySerie(
  serieId: string,
): Promise<Devocional[]> {
  const supabase = await createClientOrNull();
  if (supabase) {
    const { data } = await supabase
      .from("devocionais")
      .select("*")
      .eq("serie_id", serieId)
      .eq("publicado", true)
      .order("ordem", { ascending: true });
    if (data) return data as Devocional[];
  }
  return DEVOCIONAIS_SEED.filter((d) => d.serie_id === serieId).sort(
    (a, b) => a.ordem - b.ordem,
  );
}
