import Link from "next/link";
import { DICIONARIO } from "@/lib/seed/dicionario";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default async function DicionarioPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const items = query
    ? DICIONARIO.filter(
        (t) =>
          t.termo.toLowerCase().includes(query) ||
          t.definicao.toLowerCase().includes(query),
      )
    : DICIONARIO;

  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        href="/explorar"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <header className="mt-4 mb-4">
        <h1 className="font-serif text-2xl font-semibold">Dicionário bíblico</h1>
      </header>

      <form method="get" className="mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar termo..."
          className="w-full rounded-full border border-border bg-card px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none"
        />
      </form>

      <div className="flex flex-col gap-3">
        {items.map((t) => (
          <Card key={t.termo}>
            <CardContent className="flex flex-col gap-2 p-4">
              <h3 className="font-serif text-lg font-semibold">{t.termo}</h3>
              <p className="text-sm leading-relaxed text-foreground/90">
                {t.definicao}
              </p>
              {t.referencias && (
                <p className="text-[11px] text-primary">
                  {t.referencias.join(" · ")}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
