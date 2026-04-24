import Link from "next/link";
import {
  buscarNaBiblia,
  buscarSemantica,
  type BibleSearchResult,
} from "@/lib/repo/biblia";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search, Sparkles, TextSearch } from "lucide-react";
import { cn } from "@/lib/utils";

type Modo = "texto" | "semantica";

export default async function BuscaBibliaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; modo?: Modo }>;
}) {
  const { q = "", modo: modoParam } = await searchParams;
  const query = q.trim();
  const modo: Modo = (modoParam === "texto" || modoParam === "semantica")
    ? modoParam
    : autoDetectMode(query);

  let results: BibleSearchResult[] = [];
  if (query) {
    results =
      modo === "semantica"
        ? await buscarSemantica(query, "ACF", 30)
        : await buscarNaBiblia(query, "ACF", 30);
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
          Digite uma palavra, expressão ou até sentimento.
        </p>
      </header>

      <form method="get" className="mb-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 focus-within:border-primary/40">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Ex: paz, ansiedade, perdão, força..."
            className="w-full bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
          <input type="hidden" name="modo" value={modo} />
        </div>
      </form>

      <div className="mb-6 flex gap-2">
        <ModoLink modo="semantica" atual={modo} q={query} label="Significado" icon={<Sparkles className="h-3.5 w-3.5" />} />
        <ModoLink modo="texto" atual={modo} q={query} label="Palavra" icon={<TextSearch className="h-3.5 w-3.5" />} />
      </div>

      {query && (
        <p className="mb-3 text-xs text-muted-foreground">
          {results.length} resultado{results.length === 1 ? "" : "s"} para
          &ldquo;{query}&rdquo; · modo{" "}
          <span className="text-primary">
            {modo === "semantica" ? "significado" : "palavra"}
          </span>
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
                  {modo === "texto"
                    ? highlightMatches(r.texto, query)
                    : r.texto}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {query && results.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-sm text-muted-foreground">
            Nenhum resultado. Tente outra palavra ou mude o modo de busca.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function autoDetectMode(query: string): Modo {
  // Query com 3+ palavras OU com pontuação de sentimento → semântica por padrão.
  const words = query.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 3) return "semantica";
  // Se a query é só uma palavra curta tipo "amor", "paz", a busca semântica
  // tende a ser mais útil também. Default: semantica.
  return "semantica";
}

function ModoLink({
  modo,
  atual,
  q,
  label,
  icon,
}: {
  modo: Modo;
  atual: Modo;
  q: string;
  label: string;
  icon: React.ReactNode;
}) {
  const active = atual === modo;
  const href = `/biblia/busca?q=${encodeURIComponent(q)}&modo=${modo}`;
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </Link>
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
