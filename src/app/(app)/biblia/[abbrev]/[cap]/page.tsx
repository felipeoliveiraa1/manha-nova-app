import Link from "next/link";
import { notFound } from "next/navigation";
import { getCapitulo } from "@/lib/repo/biblia";
import { getMarcacoesDoCapitulo } from "@/lib/repo/marcacoes";
import { getCurrentUser } from "@/lib/auth/user";
import { BIBLE_BOOKS } from "@/lib/seed/bible-books";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { VerseItem } from "@/components/features/verse-actions";

export default async function CapituloPage({
  params,
}: {
  params: Promise<{ abbrev: string; cap: string }>;
}) {
  const { abbrev, cap } = await params;
  const capitulo = parseInt(cap, 10);
  if (Number.isNaN(capitulo)) notFound();

  const [{ book, versos, fromSeed }, user] = await Promise.all([
    getCapitulo(abbrev, capitulo),
    getCurrentUser(),
  ]);
  if (!book) notFound();

  // Marcacoes do usuario (highlights, notas, bookmarks) pros versos carregados.
  const verseIdsNumericas = versos
    .map((v) => (typeof v.id === "number" ? v.id : Number(v.id)))
    .filter((n): n is number => !Number.isNaN(n) && n > 0);
  const { highlights, notes, bookmarks } = user.isPreview
    ? {
        highlights: new Map<string, string>(),
        notes: new Map<string, { id: string; verse_id: string; texto: string }[]>(),
        bookmarks: new Set<string>(),
      }
    : await getMarcacoesDoCapitulo(user.id, verseIdsNumericas);

  const prevCap = capitulo > 1 ? capitulo - 1 : null;
  const nextCap = capitulo < book.total_capitulos ? capitulo + 1 : null;
  const bookIdx = BIBLE_BOOKS.findIndex((b) => b.abbrev === book.abbrev);
  const prevBook = prevCap
    ? null
    : bookIdx > 0
      ? BIBLE_BOOKS[bookIdx - 1]
      : null;
  const nextBook = nextCap
    ? null
    : bookIdx < BIBLE_BOOKS.length - 1
      ? BIBLE_BOOKS[bookIdx + 1]
      : null;

  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        href="/biblia"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Bíblia
      </Link>

      <header className="mt-4 mb-4 flex items-baseline justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold">
            {book.nome} {capitulo}
          </h1>
          <p className="text-xs text-muted-foreground">
            ACF · toque no versículo pra marcar/anotar
          </p>
        </div>
        <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] text-muted-foreground">
          Cap {capitulo} / {book.total_capitulos}
        </span>
      </header>

      {versos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 p-6 text-center text-sm text-muted-foreground">
            <BookOpen className="h-8 w-8 text-muted-foreground/60" />
            Este capítulo ainda não foi carregado na base. Rode o script de
            ingestão pra ter todos os 66 livros disponíveis.
          </CardContent>
        </Card>
      ) : (
        <article className="flex flex-col gap-3 font-serif text-[17px] leading-relaxed text-foreground/95">
          {versos.map((v) => {
            const vid = String(v.id ?? "");
            if (!vid) {
              return (
                <p
                  key={v.versiculo}
                  id={`v${v.versiculo}`}
                  className="flex gap-2"
                >
                  <sup className="mt-0.5 shrink-0 font-sans text-[10px] font-semibold text-primary">
                    {v.versiculo}
                  </sup>
                  <span>{v.texto}</span>
                </p>
              );
            }
            return (
              <VerseItem
                key={v.versiculo}
                verseId={vid}
                versiculo={v.versiculo}
                texto={v.texto}
                initialCor={highlights.get(vid)}
                initialBookmarked={bookmarks.has(vid)}
                initialNotes={(notes.get(vid) ?? []).map((n) => ({
                  id: String(n.id),
                  texto: n.texto,
                }))}
              />
            );
          })}
        </article>
      )}

      {fromSeed && versos.length > 0 && (
        <p className="mt-6 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <BookOpen className="h-3 w-3" />
          Dados parciais — marcações só persistem no modo com Supabase.
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-2">
        {prevCap ? (
          <Link
            href={`/biblia/${book.abbrev}/${prevCap}`}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm hover:border-primary/40"
          >
            <ChevronLeft className="h-4 w-4" /> Cap {prevCap}
          </Link>
        ) : prevBook ? (
          <Link
            href={`/biblia/${prevBook.abbrev}/${prevBook.total_capitulos}`}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm hover:border-primary/40"
          >
            <ChevronLeft className="h-4 w-4" /> {prevBook.nome}
          </Link>
        ) : (
          <span />
        )}
        {nextCap ? (
          <Link
            href={`/biblia/${book.abbrev}/${nextCap}`}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm hover:border-primary/40"
          >
            Cap {nextCap} <ChevronRight className="h-4 w-4" />
          </Link>
        ) : nextBook ? (
          <Link
            href={`/biblia/${nextBook.abbrev}/1`}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm hover:border-primary/40"
          >
            {nextBook.nome} <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
