import Link from "next/link";
import { listMensagens } from "@/lib/repo/mensagens";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminVideosPage() {
  const mensagens = await listMensagens();
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold">Mensagens do dia</h1>
        <Link
          href="/admin/videos/novo"
          className={buttonVariants({ size: "sm" })}
        >
          <Plus className="h-4 w-4" /> Nova
        </Link>
      </div>
      <div className="grid gap-2">
        {mensagens.map((m) => (
          <Card key={m.id}>
            <CardContent className="p-4">
              <p className="font-medium">{m.titulo}</p>
              <p className="text-xs text-muted-foreground">
                Publicado em{" "}
                {new Date(m.publicado_em).toLocaleDateString("pt-BR")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
