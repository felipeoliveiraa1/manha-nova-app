import { createClientOrNull } from "@/lib/supabase/server";
import type { Oracao } from "@/lib/supabase/types";

const PREVIEW_ORACOES: Oracao[] = [
  {
    id: "o-preview-1",
    user_id: "00000000-0000-0000-0000-000000000000",
    texto:
      "Senhor, te entrego essa semana de trabalho. Me da sabedoria nas reunioes e paz nos relacionamentos.",
    audio_url: null,
    respondida_em: null,
    created_at: new Date(Date.now() - 86_400_000).toISOString(),
  },
  {
    id: "o-preview-2",
    user_id: "00000000-0000-0000-0000-000000000000",
    texto:
      "Obrigado, Pai, pela conversa com meu irmao ontem. Voce respondeu antes mesmo de eu pedir.",
    audio_url: null,
    respondida_em: new Date().toISOString(),
    created_at: new Date(Date.now() - 3 * 86_400_000).toISOString(),
  },
];

export async function listOracoes(userId: string): Promise<Oracao[]> {
  const supabase = await createClientOrNull();
  if (supabase) {
    const { data } = await supabase
      .from("oracoes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    return (data as Oracao[] | null) ?? [];
  }
  return PREVIEW_ORACOES;
}
