import { createClientOrNull } from "@/lib/supabase/server";
import type { Conquista } from "@/lib/supabase/types";

const CONQUISTAS_SEED: Conquista[] = [
  {
    id: "streak-7",
    slug: "streak-7",
    titulo: "Constante",
    descricao: "7 dias seguidos com Deus.",
    icone: "flame",
    criterio: { type: "streak", dias: 7 },
  },
  {
    id: "streak-21",
    slug: "streak-21",
    titulo: "Disciplinado",
    descricao: "21 dias seguidos com Deus.",
    icone: "flame",
    criterio: { type: "streak", dias: 21 },
  },
  {
    id: "streak-100",
    slug: "streak-100",
    titulo: "Inflexível",
    descricao: "100 dias seguidos.",
    icone: "crown",
    criterio: { type: "streak", dias: 100 },
  },
  {
    id: "primeiro-devocional",
    slug: "primeiro-devocional",
    titulo: "Primeiro passo",
    descricao: "Concluiu seu primeiro devocional.",
    icone: "book",
    criterio: { type: "devocionais", n: 1 },
  },
  {
    id: "10-devocionais",
    slug: "10-devocionais",
    titulo: "Leitor assíduo",
    descricao: "Concluiu 10 devocionais.",
    icone: "book",
    criterio: { type: "devocionais", n: 10 },
  },
  {
    id: "50-missoes",
    slug: "50-missoes",
    titulo: "Fazedor",
    descricao: "Concluiu 50 missões.",
    icone: "target",
    criterio: { type: "missoes", n: 50 },
  },
];

export async function listConquistas(): Promise<Conquista[]> {
  const supabase = await createClientOrNull();
  if (supabase) {
    const { data } = await supabase
      .from("conquistas")
      .select("*")
      .order("slug", { ascending: true });
    if (data && data.length > 0) return data as Conquista[];
  }
  return CONQUISTAS_SEED;
}

export async function listUserConquistas(
  userId: string,
): Promise<Set<string>> {
  const supabase = await createClientOrNull();
  if (!supabase) return new Set();
  const { data } = await supabase
    .from("user_conquistas")
    .select("conquista_id,conquistas(slug)")
    .eq("user_id", userId);
  return new Set(
    ((data as Array<{ conquistas: { slug: string } | { slug: string }[] }> | null) ?? []).map(
      (r) => {
        const c = Array.isArray(r.conquistas) ? r.conquistas[0] : r.conquistas;
        return c?.slug ?? "";
      },
    ),
  );
}

/**
 * Avalia os criterios e desbloqueia conquistas que ainda nao foram.
 * Chamado depois de missoes/devocionais concluidos.
 */
export async function avaliarConquistas(userId: string): Promise<string[]> {
  const supabase = await createClientOrNull();
  if (!supabase) return [];

  const [profile, missoesCount, devosCount, jaTem] = await Promise.all([
    supabase
      .from("profiles")
      .select("streak_dias,streak_maior")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("user_missoes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("user_devocional_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    listUserConquistas(userId),
  ]);

  const streakMaior =
    ((profile.data as { streak_maior?: number } | null)?.streak_maior ?? 0) ||
    0;
  const streakAtual =
    ((profile.data as { streak_dias?: number } | null)?.streak_dias ?? 0) || 0;
  const maiorStreak = Math.max(streakAtual, streakMaior);

  const totalMissoes = missoesCount.count ?? 0;
  const totalDevos = devosCount.count ?? 0;

  const todas = await listConquistas();
  const desbloqueadas: string[] = [];

  for (const c of todas) {
    if (jaTem.has(c.slug)) continue;
    const crit = c.criterio as {
      type?: "streak" | "devocionais" | "missoes";
      dias?: number;
      n?: number;
    };
    let atinge = false;
    if (crit.type === "streak" && crit.dias) {
      atinge = maiorStreak >= crit.dias;
    } else if (crit.type === "devocionais" && crit.n) {
      atinge = totalDevos >= crit.n;
    } else if (crit.type === "missoes" && crit.n) {
      atinge = totalMissoes >= crit.n;
    }
    if (atinge) {
      await supabase
        .from("user_conquistas")
        .insert({ user_id: userId, conquista_id: c.id })
        .select()
        .maybeSingle();
      desbloqueadas.push(c.slug);
    }
  }
  return desbloqueadas;
}
