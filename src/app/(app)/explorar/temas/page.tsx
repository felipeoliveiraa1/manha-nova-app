import Link from "next/link";
import { TEMAS } from "@/lib/seed/temas";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Tag } from "lucide-react";

export default function TemasPage() {
  return (
    <div className="px-4 pt-4 pb-8">
      <Link
        href="/explorar"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <h1 className="mt-4 mb-6 font-serif text-2xl font-semibold">
        Temas da Bíblia
      </h1>

      <div className="grid gap-3">
        {TEMAS.map((t) => (
          <Link key={t.slug} href={`/explorar/temas/${t.slug}`}>
            <Card className="transition hover:border-primary/40">
              <CardContent className="flex items-center gap-3 p-4">
                <Tag className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <h3 className="font-serif text-base font-semibold">
                    {t.titulo}
                  </h3>
                  <p className="text-xs text-muted-foreground">{t.descricao}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
