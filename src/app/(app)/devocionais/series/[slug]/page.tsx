import Link from "next/link";
import { notFound } from "next/navigation";
import { getSerie, listDevocionaisBySerie } from "@/lib/repo/devocionais";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Flame } from "lucide-react";

export default async function SeriePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const serie = await getSerie(slug);
  if (!serie) notFound();
  const devos = await listDevocionaisBySerie(serie.id);

  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        href="/devocionais"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <header className="mt-4 mb-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-primary">
          Série
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold leading-tight">
          {serie.titulo}
        </h1>
        {serie.descricao && (
          <p className="mt-2 text-sm text-muted-foreground">{serie.descricao}</p>
        )}
      </header>

      <div className="grid gap-3">
        {devos.length === 0 && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Mais devocionais desta série serão adicionados em breve.
            </CardContent>
          </Card>
        )}
        {devos.map((d, idx) => (
          <Link key={d.id} href={`/devocionais/${d.slug}`}>
            <Card className="transition hover:border-primary/40">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 font-serif text-primary">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-base font-semibold">
                    {d.titulo}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {d.versiculo_ref} · {d.tempo_min} min
                  </p>
                </div>
                <Flame className="h-4 w-4 text-primary/60" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
