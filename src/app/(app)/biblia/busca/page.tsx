import Link from "next/link";
import {
  buscarNaBiblia,
  type BibleSearchResult,
} from "@/lib/repo/biblia";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search } from "lucide-react";

export default async function BuscaBibliaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  let results: BibleSearchResult[] = [];
  if (query) {
    results = await buscarNaBiblia(query, "ACF", 30);
  }

  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        href="/biblia"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <header className="mt-4 mb-4">
        <h1 className="font-serif text-2xl font-semibold">Buscar na Bíblia</h1>
        <p className="text-xs text-muted-foreground">
          Digite uma palavra ou expressão.
        </p>
      </header>

      <form method="get" className="mb-6">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 focus-within:border-primary/40">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Ex: paz, ansiedade, perdão, força..."
            className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </form>

      {query && (
        <p className="mb-3 text-xs text-muted-foreground">
          {results.length} resultado{results.length === 1 ? "" : "s"} para
          &ldquo;{query}&rdquo;
        </p>
      )}

      <div className="flex flex-col gap-3">
        {results.map((r, idx) => (
          <Link
            key={`${r.book_abbrev}-${r.capitulo}-${r.versiculo}-${idx}`}
            href={`/biblia/${r.book_abbrev}/${r.capitulo}#v${r.versiculo}`}
          >
            <Card className="transition hover:border-primary/40">
              <CardContent className="flex flex-col gap-1.5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {r.book_nome} {r.capitulo}:{r.versiculo}
                  </span>
                  {r.similarity !== undefined && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                      {(r.similarity * 100).toFixed(0)}% match
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {highlightMatches(r.texto, query)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {query && results.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            Nenhum resultado. Tente outra palavra.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function highlightMatches(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-primary/25 text-foreground">
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}
function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
