import { createClientOrNull } from "@/lib/supabase/server";

export type HighlightRow = { verse_id: string; cor: string };
export type NoteRow = { id: string; verse_id: string; texto: string };
export type BookmarkRow = { verse_id: string };

/**
 * Busca highlights, notas e bookmarks do usuario para um conjunto de versos.
 * Usado no leitor pra mostrar marcacoes.
 */
export async function getMarcacoesDoCapitulo(
  userId: string,
  verseIds: number[],
): Promise<{
  highlights: Map<string, string>;
  notes: Map<string, NoteRow[]>;
  bookmarks: Set<string>;
}> {
  const empty = {
    highlights: new Map<string, string>(),
    notes: new Map<string, NoteRow[]>(),
    bookmarks: new Set<string>(),
  };
  if (verseIds.length === 0) return empty;

  const supabase = await createClientOrNull();
  if (!supabase) return empty;

  const [hi, no, bm] = await Promise.all([
    supabase
      .from("user_highlights")
      .select("verse_id,cor")
      .eq("user_id", userId)
      .in("verse_id", verseIds),
    supabase
      .from("user_notes")
      .select("id,verse_id,texto")
      .eq("user_id", userId)
      .in("verse_id", verseIds)
      .order("created_at", { ascending: true }),
    supabase
      .from("user_bookmarks")
      .select("verse_id")
      .eq("user_id", userId)
      .in("verse_id", verseIds),
  ]);

  const highlights = new Map<string, string>();
  const notes = new Map<string, NoteRow[]>();
  const bookmarks = new Set<string>();

  for (const h of (hi.data as HighlightRow[] | null) ?? []) {
    highlights.set(String(h.verse_id), h.cor);
  }
  for (const n of (no.data as NoteRow[] | null) ?? []) {
    const list = notes.get(String(n.verse_id)) ?? [];
    list.push(n);
    notes.set(String(n.verse_id), list);
  }
  for (const b of (bm.data as BookmarkRow[] | null) ?? []) {
    bookmarks.add(String(b.verse_id));
  }

  return { highlights, notes, bookmarks };
}
