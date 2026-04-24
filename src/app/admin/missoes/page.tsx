import Link from "next/link";
import { listMissoesPorTipo } from "@/lib/repo/missoes";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminMissoesPage() {
  const [d, s, x] = await Promise.all([
    listMissoesPorTipo("diaria"),
    listMissoesPorTipo("semanal"),
    listMissoesPorTipo("desafio"),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold">Missões</h1>
        <Link
          href="/admin/missoes/novo"
          className={buttonVariants({ size: "sm" })}
        >
          <Plus className="h-4 w-4" /> Nova
        </Link>
      </div>
      {[
        ["Diárias", d],
        ["Semanais", s],
        ["Desafios", x],
      ].map(([titulo, arr]) => {
        const items = arr as typeof d;
        return (
          <section key={titulo as string} className="mb-6">
            <h2 className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
              {titulo as string}
            </h2>
            <div className="grid gap-2">
              {items.map((m) => (
                <Card key={m.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{m.titulo}</p>
                      <p className="text-xs text-muted-foreground">
                        +{m.pontos} pts
                        {m.duracao_dias ? ` · ${m.duracao_dias} dias` : ""}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
