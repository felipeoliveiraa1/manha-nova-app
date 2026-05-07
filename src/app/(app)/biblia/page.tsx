import Link from "next/link";
import { listBooks } from "@/lib/repo/biblia";
import { versiculoDoDia } from "@/lib/seed/versiculos";
import { parseRef } from "@/lib/seed/bible-books";
import { Search, Calendar, BookOpen, Download } from "lucide-react";

export const revalidate = 86400;

export default async function BibliaPage() {
  const books = await listBooks();
  const at = books.filter((b) => b.testamento === "AT");
  const nt = books.filter((b) => b.testamento === "NT");

  const versiculo = versiculoDoDia();
  const refParsed = parseRef(versiculo.ref);
  const meditarHref = refParsed
    ? `/biblia/${refParsed.abbrev}/${refParsed.capitulo}#v${refParsed.versiculo}`
    : "/biblia";

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="mb-1 font-serif text-2xl font-semibold">Bíblia</h1>
      <p className="mb-5 text-sm text-muted-foreground">
        Almeida Corrigida Fiel (ACF)
      </p>

      {/* Versículo do dia — público */}
      <section className="mb-6 rounded-2xl border border-primary/20 bg-linear-to-br from-card to-primary/5 p-6">
        <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-primary">
          Versículo do dia
        </p>
        <p className="mb-3 font-serif text-lg leading-snug">
          &ldquo;{versiculo.texto}&rdquo;
        </p>
        <p className="mb-4 text-xs text-muted-foreground">{versiculo.ref}</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href={meditarHref}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/15"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Ler no contexto
          </Link>
          <a
            href={`/api/og/versiculo?texto=${encodeURIComponent(versiculo.texto)}&ref=${encodeURIComponent(versiculo.ref)}`}
            download={`versiculo-${versiculo.ref.replace(/[\s:]+/g, "-")}.png`}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-foreground"
          >
            <Download className="h-3.5 w-3.5" />
            Baixar imagem
          </a>
        </div>
      </section>

      <div className="mb-6 flex gap-2">
        <Link
          href="/biblia/busca"
          className="flex flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground hover:border-primary/40"
        >
          <Search className="h-4 w-4" />
          Buscar na Bíblia
        </Link>
        <Link
          href="/biblia/planos"
          className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground hover:border-primary/40"
          aria-label="Planos de leitura"
        >
          <Calendar className="h-4 w-4" />
          Planos
        </Link>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
          Antigo Testamento
        </h2>
        <BookGrid books={at} />
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
          Novo Testamento
        </h2>
        <BookGrid books={nt} />
      </section>

    </div>
  );
}

function BookGrid({
  books,
}: {
  books: Awaited<ReturnType<typeof listBooks>>;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {books.map((b) => (
        <Link
          key={b.id}
          href={`/biblia/${b.abbrev}/1`}
          className="rounded-lg border border-border bg-card px-3 py-3 text-sm transition hover:border-primary/40 hover:bg-card/80"
        >
          <span className="block truncate font-medium">{b.nome}</span>
          <span className="text-[10px] text-muted-foreground">
            {b.total_capitulos} cap.
          </span>
        </Link>
      ))}
    </div>
  );
}
