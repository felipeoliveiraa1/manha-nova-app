import Link from "next/link";
import { PLANOS_SEED } from "@/lib/seed/planos-leitura";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar } from "lucide-react";

export const revalidate = 86400;

export default function PlanosPage() {
  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        href="/biblia"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <header className="mt-4 mb-6">
        <h1 className="font-serif text-2xl font-semibold">Planos de leitura</h1>
        <p className="text-sm text-muted-foreground">
          Jornadas diárias pra você não largar a leitura.
        </p>
      </header>

      <div className="grid gap-3">
        {PLANOS_SEED.map((p) => (
          <Link key={p.slug} href={`/biblia/planos/${p.slug}`}>
            <Card className="transition hover:border-primary/40">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-base font-semibold">
                    {p.titulo}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {p.descricao}
                  </p>
                  <p className="mt-1 text-[11px] text-primary">
                    {p.dias.length} dias disponíveis
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
