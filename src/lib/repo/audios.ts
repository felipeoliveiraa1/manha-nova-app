import { createClientOrNull } from "@/lib/supabase/server";
import { AUDIOS_SEED } from "@/lib/seed/audios";
import type { Audio } from "@/lib/supabase/types";

export async function listAudios(tipo?: Audio["tipo"]): Promise<Audio[]> {
  const supabase = await createClientOrNull();
  if (supabase) {
    const q = supabase
      .from("audios")
      .select("*")
      .eq("publicado", true)
      .order("created_at", { ascending: false });
    const { data } = tipo ? await q.eq("tipo", tipo) : await q;
    if (data && data.length > 0) return data as Audio[];
  }
  return tipo ? AUDIOS_SEED.filter((a) => a.tipo === tipo) : AUDIOS_SEED;
}
