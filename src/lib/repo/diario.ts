import { createClientOrNull } from "@/lib/supabase/server";
import type { DiarioEntrada } from "@/lib/supabase/types";

const PREVIEW_ENTRADAS: DiarioEntrada[] = [
  {
    id: "de-1",
    user_id: "00000000-0000-0000-0000-000000000000",
    data: new Date(Date.now() - 86_400_000).toISOString().slice(0, 10),
    emocao: "paz",
    texto:
      "Hoje foi um dia pesado no trabalho, mas senti uma calma quando parei pra orar a tarde.",
    created_at: new Date(Date.now() - 86_400_000).toISOString(),
  },
  {
    id: "de-2",
    user_id: "00000000-0000-0000-0000-000000000000",
    data: new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10),
    emocao: "gratidao",
    texto:
      "Gratidao pela saude da minha mae. Deus tem sido fiel em cada passo dessa recuperacao.",
    created_at: new Date(Date.now() - 2 * 86_400_000).toISOString(),
  },
  {
    id: "de-3",
    user_id: "00000000-0000-0000-0000-000000000000",
    data: new Date(Date.now() - 4 * 86_400_000).toISOString().slice(0, 10),
    emocao: "ansiedade",
    texto:
      "Acordei ansioso com o projeto novo. Filipenses 4 me sustentou hoje.",
    created_at: new Date(Date.now() - 4 * 86_400_000).toISOString(),
  },
];

export async function listDiarioEntradas(
  userId: string,
  limit = 60,
): Promise<DiarioEntrada[]> {
  const supabase = await createClientOrNull();
  if (supabase) {
    const { data } = await supabase
      .from("diario_entradas")
      .select("*")
      .eq("user_id", userId)
      .order("data", { ascending: false })
      .limit(limit);
    return (data as DiarioEntrada[] | null) ?? [];
  }
  return PREVIEW_ENTRADAS;
}

export async function getDiarioEntrada(
  userId: string,
  data: string,
): Promise<DiarioEntrada | null> {
  const supabase = await createClientOrNull();
  if (supabase) {
    const { data: row } = await supabase
      .from("diario_entradas")
      .select("*")
      .eq("user_id", userId)
      .eq("data", data)
      .maybeSingle();
    return (row as DiarioEntrada | null) ?? null;
  }
  return PREVIEW_ENTRADAS.find((e) => e.data === data) ?? null;
}
