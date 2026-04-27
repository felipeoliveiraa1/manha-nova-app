import { unstable_cache } from "next/cache";
import { createClientOrNull } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import {
  MISSOES_DIARIAS_SEED,
  MISSOES_SEMANAIS_SEED,
  MISSOES_DESAFIOS_SEED,
  missaoDoDia as seedMissaoDoDia,
} from "@/lib/seed/missoes";
import type { Missao } from "@/lib/supabase/types";

const _fetchMissoesDiarias = async (): Promise<Missao[]> => {
  const pub = createPublicClient();
  if (!pub) return MISSOES_DIARIAS_SEED;
  const { data } = await pub
    .from("missoes")
    .select("*")
    .eq("tipo", "diaria")
    .eq("publicado", true)
    .order("ordem", { ascending: true })
    .limit(200);
  if (!data || data.length === 0) return MISSOES_DIARIAS_SEED;
  return data as Missao[];
};
const fetchMissoesDiariasCached = unstable_cache(
  _fetchMissoesDiarias,
  ["missoes_diarias_v1"],
  { revalidate: 86400, tags: ["missoes"] },
);

function dayOfYear(): number {
  const now = new Date();
  return Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
}

export async function getMissaoDoDia(): Promise<Missao> {
  // 1. Se houver missao com data fixa pra hoje, usa (curadoria manual).
  const supabase = await createClientOrNull();
  if (supabase) {
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from("missoes")
      .select("*")
      .eq("tipo", "diaria")
      .eq("publicado", true)
      .eq("data", today)
      .maybeSingle();
    if (data) return data as Missao;
  }
  // 2. Senao, rotaciona pelo dia do ano sobre as publicadas (cache 24h).
  const lista = await fetchMissoesDiariasCached();
  if (lista.length === 0) return seedMissaoDoDia();
  return lista[dayOfYear() % lista.length];
}

export async function listMissoesPorTipo(
  tipo: "diaria" | "semanal" | "desafio",
): Promise<Missao[]> {
  const supabase = await createClientOrNull();
  if (supabase) {
    const { data } = await supabase
      .from("missoes")
      .select("*")
      .eq("tipo", tipo)
      .eq("publicado", true)
      .order("ordem", { ascending: true })
      .limit(100);
    if (data && data.length > 0) return data as Missao[];
  }
  const map = {
    diaria: MISSOES_DIARIAS_SEED,
    semanal: MISSOES_SEMANAIS_SEED,
    desafio: MISSOES_DESAFIOS_SEED,
  };
  return map[tipo];
}

export async function listMissoesConcluidasHoje(
  userId: string,
): Promise<Set<string>> {
  const supabase = await createClientOrNull();
  if (!supabase) return new Set();
  const { data } = await supabase
    .from("user_missoes")
    .select("missao_id,concluido_em")
    .eq("user_id", userId)
    .gte(
      "concluido_em",
      new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
    );
  return new Set(
    ((data as { missao_id: string }[] | null) ?? []).map((r) => r.missao_id),
  );
}
