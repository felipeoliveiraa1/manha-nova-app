import { unstable_cache } from "next/cache";
import { createClientOrNull } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";
import { BIBLE_BOOKS, findBookByAbbrev } from "@/lib/seed/bible-books";
import {
  CAPITULOS_ACF,
  findChapter as seedFindChapter,
} from "@/lib/seed/bible-chapters";
import type { BibleBook } from "@/lib/supabase/types";

export type VerseRow = {
  versiculo: number;
  texto: string;
  id?: string | number;
};

export type BibleSearchResult = {
  book_abbrev: string;
  book_nome: string;
  capitulo: number;
  versiculo: number;
  texto: string;
  similarity?: number;
};

const DEFAULT_VERSION = "ACF";
const EMBED_MODEL = "text-embedding-3-small";
const EMBED_DIM = 1536;

// -----------------------------------------------------------------
// Leitura PUBLICA (sem auth, cacheavel)
// -----------------------------------------------------------------

export async function listBooks(
  versionId = DEFAULT_VERSION,
): Promise<Omit<BibleBook, "version_id">[]> {
  // Metadados dos livros nao mudam. Usamos sempre o seed local —
  // zero round-trip ao banco.
  void versionId;
  return BIBLE_BOOKS;
}

export async function getBook(abbrev: string) {
  return findBookByAbbrev(abbrev);
}

/**
 * Busca os versiculos de um capitulo. Cacheado por 24h via unstable_cache
 * (Next.js data cache). Bible data e imutavel, caching e seguro.
 */
const _fetchCapitulo = async (
  bookAbbrev: string,
  capitulo: number,
  versionId: string,
): Promise<VerseRow[]> => {
  const book = findBookByAbbrev(bookAbbrev);
  if (!book) return [];

  const pub = createPublicClient();
  if (pub) {
    const { data } = await pub
      .from("bible_verses")
      .select("id,versiculo,texto")
      .eq("version_id", versionId)
      .eq("book_id", book.id)
      .eq("capitulo", capitulo)
      .order("versiculo", { ascending: true });
    if (data && data.length > 0) {
      return (data as VerseRow[]).map((v) => ({
        id: v.id,
        versiculo: v.versiculo,
        texto: v.texto,
      }));
    }
  }

  // Fallback para seed local (modo preview sem Supabase).
  const seeded = seedFindChapter(bookAbbrev, capitulo);
  if (seeded) return seeded.versos.map((v) => ({ versiculo: v.v, texto: v.t }));
  return [];
};

const fetchCapituloCached = unstable_cache(
  _fetchCapitulo,
  ["bible_capitulo_v2"],
  { revalidate: 86400, tags: ["bible"] },
);

export async function getCapitulo(
  bookAbbrev: string,
  capitulo: number,
  versionId = DEFAULT_VERSION,
): Promise<{
  book: Omit<BibleBook, "version_id"> | undefined;
  versos: VerseRow[];
  fromSeed: boolean;
}> {
  const book = findBookByAbbrev(bookAbbrev);
  if (!book) return { book: undefined, versos: [], fromSeed: true };

  const versos = await fetchCapituloCached(bookAbbrev, capitulo, versionId);

  // Se veio do Supabase, geralmente tera mais versos do que o seed demo.
  // Usamos um heuristico: se o numero de versos >= o seed ou nao tem seed, e db.
  const seeded = seedFindChapter(bookAbbrev, capitulo);
  const fromSeed =
    versos.length > 0 && seeded !== undefined && versos.length === seeded.versos.length;

  return { book, versos, fromSeed };
}

// -----------------------------------------------------------------
// BUSCA TEXTUAL (trigrama)
// -----------------------------------------------------------------

export async function buscarNaBiblia(
  query: string,
  versionId = DEFAULT_VERSION,
  limit = 30,
): Promise<BibleSearchResult[]> {
  const q = query.trim();
  if (!q) return [];

  const pub = createPublicClient();
  if (pub) {
    const { data } = await pub
      .from("bible_verses")
      .select("capitulo,versiculo,texto,book_id,bible_books(abbrev,nome)")
      .eq("version_id", versionId)
      .textSearch("texto", q, { type: "websearch" })
      .limit(limit);
    if (data && data.length > 0) {
      return (data as unknown as Array<{
        capitulo: number;
        versiculo: number;
        texto: string;
        bible_books: { abbrev: string; nome: string } | { abbrev: string; nome: string }[];
      }>).map((r) => {
        const b = Array.isArray(r.bible_books) ? r.bible_books[0] : r.bible_books;
        return {
          book_abbrev: b.abbrev,
          book_nome: b.nome,
          capitulo: r.capitulo,
          versiculo: r.versiculo,
          texto: r.texto,
        };
      });
    }
  }

  // Fallback: seed (dev)
  const norm = (s: string) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const qn = norm(q);
  const out: BibleSearchResult[] = [];
  for (const cap of CAPITULOS_ACF) {
    for (const v of cap.versos) {
      if (norm(v.t).includes(qn)) {
        const b = findBookByAbbrev(cap.book_abbrev);
        if (!b) continue;
        out.push({
          book_abbrev: cap.book_abbrev,
          book_nome: b.nome,
          capitulo: cap.capitulo,
          versiculo: v.v,
          texto: v.t,
        });
        if (out.length >= limit) return out;
      }
    }
  }
  return out;
}

// -----------------------------------------------------------------
// BUSCA SEMANTICA (embeddings)
// -----------------------------------------------------------------

async function gerarEmbedding(query: string): Promise<number[] | null> {
  if (!process.env.OPENAI_API_KEY) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: EMBED_MODEL,
        input: query,
        dimensions: EMBED_DIM,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { data: { embedding: number[] }[] };
    return data.data[0]?.embedding ?? null;
  } catch {
    return null;
  }
}

export async function buscarSemantica(
  query: string,
  versionId = DEFAULT_VERSION,
  limit = 20,
): Promise<BibleSearchResult[]> {
  const q = query.trim();
  if (!q) return [];

  const embedding = await gerarEmbedding(q);
  if (!embedding) return buscarNaBiblia(query, versionId, limit);

  // Usa admin client no servidor pra evitar statement_timeout do anon
  // enquanto o indice HNSW nao esta criado. Server-side only — seguro.
  let client;
  try {
    client = createAdminClient();
  } catch {
    const pub = createPublicClient();
    if (!pub) return buscarNaBiblia(query, versionId, limit);
    client = pub;
  }

  const { data, error } = await client.rpc("match_bible_verses", {
    query_embedding: embedding,
    match_threshold: 0.3,
    match_count: limit,
    version: versionId,
  });

  if (error || !data || (data as unknown[]).length === 0) {
    return buscarNaBiblia(query, versionId, limit);
  }

  const bookById = new Map(BIBLE_BOOKS.map((b) => [b.id, b]));
  return (
    data as Array<{
      id: number;
      book_id: number;
      capitulo: number;
      versiculo: number;
      texto: string;
      similarity: number;
    }>
  ).map((r) => {
    const b = bookById.get(r.book_id);
    return {
      book_abbrev: b?.abbrev ?? "",
      book_nome: b?.nome ?? "",
      capitulo: r.capitulo,
      versiculo: r.versiculo,
      texto: r.texto,
      similarity: r.similarity,
    };
  });
}

export async function buscarVersiculosRelevantes(
  query: string,
  limit = 3,
): Promise<BibleSearchResult[]> {
  return buscarSemantica(query, DEFAULT_VERSION, limit);
}

// Mantemos a importacao do server client pra compat (destaques, notas do usuario).
void createClientOrNull;
