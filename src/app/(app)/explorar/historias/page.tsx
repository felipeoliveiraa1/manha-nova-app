import Link from "next/link";
import { HISTORIAS } from "@/lib/seed/historias";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Scroll } from "lucide-react";

export default function HistoriasPage() {
  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        href="/explorar"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <h1 className="mt-4 mb-6 font-serif text-2xl font-semibold">
        Histórias bíblicas
      </h1>

      <div className="grid gap-3">
        {HISTORIAS.map((h) => (
          <Link key={h.slug} href={`/explorar/historias/${h.slug}`}>
            <Card className="transition hover:border-primary/40">
              <CardContent className="flex items-center gap-3 p-4">
                <Scroll className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <h3 className="font-serif text-base font-semibold">
                    {h.titulo}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {h.personagens.join(", ")} · {h.ref}
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
