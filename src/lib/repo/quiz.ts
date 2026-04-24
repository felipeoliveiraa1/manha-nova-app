import { createClientOrNull } from "@/lib/supabase/server";
import { QUIZ_SEED } from "@/lib/seed/quiz";
import type { QuizPergunta } from "@/lib/supabase/types";

export async function listQuizPerguntas(n = 5): Promise<QuizPergunta[]> {
  const supabase = await createClientOrNull();
  if (supabase) {
    const { data } = await supabase
      .from("quiz_perguntas")
      .select("*")
      .eq("publicado", true)
      .limit(n * 3);
    if (data && data.length > 0) {
      return (data as QuizPergunta[])
        .sort(() => Math.random() - 0.5)
        .slice(0, n);
    }
  }
  return [...QUIZ_SEED].sort(() => Math.random() - 0.5).slice(0, n);
}

export async function getRankingSemanal(): Promise<
  Array<{ nome: string; pontos: number }>
> {
  const supabase = await createClientOrNull();
  if (supabase) {
    // Semana: de domingo 00:00 ate agora.
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    const { data } = await supabase
      .from("user_quiz_tentativas")
      .select("user_id,acertou,profiles(nome)")
      .gte("created_at", start.toISOString())
      .eq("acertou", true);
    if (data && data.length > 0) {
      const agg = new Map<string, { nome: string; pontos: number }>();
      for (const row of data as unknown as Array<{
        user_id: string;
        profiles: { nome: string | null } | { nome: string | null }[] | null;
      }>) {
        const key = row.user_id;
        const profileObj = Array.isArray(row.profiles)
          ? row.profiles[0]
          : row.profiles;
        const nome = profileObj?.nome ?? "anônimo";
        const cur = agg.get(key) ?? { nome, pontos: 0 };
        cur.pontos += 10;
        agg.set(key, cur);
      }
      return [...agg.values()]
        .sort((a, b) => b.pontos - a.pontos)
        .slice(0, 50);
    }
  }
  // Ranking mock para preview
  return [
    { nome: "Mariana", pontos: 340 },
    { nome: "Felipe", pontos: 280 },
    { nome: "Ana", pontos: 210 },
    { nome: "Yan", pontos: 180 },
    { nome: "João", pontos: 120 },
  ];
}
