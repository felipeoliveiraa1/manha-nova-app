import Link from "next/link";
import { listQuizPerguntas } from "@/lib/repo/quiz";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminQuizPage() {
  const perguntas = await listQuizPerguntas(30);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold">Quiz</h1>
        <Link href="/admin/quiz/novo" className={buttonVariants({ size: "sm" })}>
          <Plus className="h-4 w-4" /> Nova
        </Link>
      </div>
      <div className="grid gap-2">
        {perguntas.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-4">
              <p className="text-sm font-medium">{p.pergunta}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Nível {p.nivel} · {p.categoria ?? "Geral"} · Correta: {p.correta}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
