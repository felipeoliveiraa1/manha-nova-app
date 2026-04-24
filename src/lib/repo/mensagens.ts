import { createClientOrNull } from "@/lib/supabase/server";
import { VIDEOS_SEED, mensagemDoDia as seedMensagem } from "@/lib/seed/videos";
import type { MensagemDia } from "@/lib/supabase/types";

export async function getMensagemDoDia(): Promise<MensagemDia> {
  const supabase = await createClientOrNull();
  if (supabase) {
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from("mensagens_dia")
      .select("*")
      .lte("publicado_em", today)
      .order("publicado_em", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) return data as MensagemDia;
  }
  return seedMensagem();
}

export async function listMensagens(): Promise<MensagemDia[]> {
  const supabase = await createClientOrNull();
  if (supabase) {
    const { data } = await supabase
      .from("mensagens_dia")
      .select("*")
      .order("publicado_em", { ascending: false })
      .limit(20);
    if (data && data.length > 0) return data as MensagemDia[];
  }
  return VIDEOS_SEED;
}
