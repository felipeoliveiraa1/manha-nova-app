import Link from "next/link";
import { listDevocionais } from "@/lib/repo/devocionais";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminDevocionaisPage() {
  const devos = await listDevocionais();
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold">Devocionais</h1>
        <Link
          href="/admin/devocionais/novo"
          className={buttonVariants({ size: "sm" })}
        >
          <Plus className="h-4 w-4" /> Novo
        </Link>
      </div>
      <div className="grid gap-2">
        {devos.map((d) => (
          <Card key={d.id}>
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium">{d.titulo}</p>
                <p className="text-xs text-muted-foreground">
                  {d.versiculo_ref} · {d.tempo_min} min
                  {d.publicado ? "" : " · rascunho"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
