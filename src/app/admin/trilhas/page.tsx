import Link from "next/link";
import { listTrilhas } from "@/lib/repo/trilhas";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminTrilhasPage() {
  const trilhas = await listTrilhas();
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold">Trilhas</h1>
        <Link
          href="/admin/trilhas/novo"
          className={buttonVariants({ size: "sm" })}
        >
          <Plus className="h-4 w-4" /> Nova
        </Link>
      </div>
      <div className="grid gap-2">
        {trilhas.map((t) => (
          <Card key={t.id}>
            <CardContent className="p-4">
              <p className="font-medium">{t.titulo}</p>
              <p className="text-xs text-muted-foreground">
                {t.duracao_dias} dias · {t.publicado ? "publicada" : "rascunho"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
