import { unstable_cache } from "next/cache";
import { createClientOrNull } from "@/lib/supabase/server";
import {
  DEVOCIONAIS_SEED,
  SERIES_SEED,
  devocionalDoDia as seedDevocionalDoDia,
} from "@/lib/seed/devocionais";
import type { Devocional, DevocionalSerie } from "@/lib/supabase/types";

const _fetchPublicados = async (): Promise<Devocional[]> => {
  const supabase = await createClientOrNull();
  if (!supabase) return DEVOCIONAIS_SEED;
  const { data } = await supabase
    .from("devocionais")
    .select("*")
    .eq("publicado", true)
    .order("ordem", { ascending: true })
    .limit(500);
  if (!data || data.length === 0) return DEVOCIONAIS_SEED;
  return data as Devocional[];
};
const fetchPublicadosCached = unstable_cache(
  _fetchPublicados,
  ["devocionais_publicados_v1"],
  { revalidate: 86400, tags: ["devocionais"] },
);

function dayOfYear(): number {
  const now = new Date();
  return Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
}

export async function getDevocionalDoDia(): Promise<Devocional> {
  // 1. Se houver devocional com data fixa pra hoje, usa (curadoria manual).
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
  // 2. Senao, rotaciona pelo dia do ano sobre os publicados (cache 24h).
  const lista = await fetchPublicadosCached();
  if (lista.length === 0) return seedDevocionalDoDia();
  return lista[dayOfYear() % lista.length];
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
      .order("ordem", { ascending: true })
      .limit(500);
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
      .order("ordem", { ascending: true })
      .limit(50);
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
