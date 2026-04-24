import Link from "next/link";
import { listIgrejas } from "@/lib/repo/igrejas";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminIgrejasPage() {
  const igrejas = await listIgrejas();
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold">Igrejas</h1>
        <Link
          href="/admin/igrejas/novo"
          className={buttonVariants({ size: "sm" })}
        >
          <Plus className="h-4 w-4" /> Nova
        </Link>
      </div>
      <div className="grid gap-2">
        {igrejas.map((i) => (
          <Card key={i.id}>
            <CardContent className="p-4">
              <p className="font-medium">{i.nome}</p>
              <p className="text-xs text-muted-foreground">
                {[i.denominacao, i.cidade, i.estado].filter(Boolean).join(" · ")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
