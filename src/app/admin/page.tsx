import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { createClientOrNull } from "@/lib/supabase/server";

async function counts() {
  const supabase = await createClientOrNull();
  if (!supabase) return null;
  const tables = ["profiles", "devocionais", "missoes", "quiz_perguntas", "trilhas", "subscriptions"];
  const out: Record<string, number> = {};
  for (const t of tables) {
    const { count } = await supabase
      .from(t)
      .select("id", { count: "exact", head: true });
    out[t] = count ?? 0;
  }
  return out;
}

export default async function AdminDashboardPage() {
  const c = await counts();

  return (
    <div>
      <h1 className="mb-1 font-serif text-3xl font-semibold">Dashboard</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Gerencie conteúdo e veja métricas do app.
      </p>

      {!c && (
        <Card className="mb-6 border-dashed">
          <CardContent className="p-5 text-sm text-muted-foreground">
            Sem Supabase configurado. Preencha <code>.env.local</code> pra ver
            métricas reais.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {c &&
          Object.entries(c).map(([t, n]) => (
            <Card key={t}>
              <CardContent className="p-5">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {t}
                </p>
                <p className="mt-1 font-serif text-3xl font-semibold text-primary">
                  {n}
                </p>
              </CardContent>
            </Card>
          ))}
      </div>

      <h2 className="mt-10 mb-3 text-xs uppercase tracking-wider text-muted-foreground">
        Atalhos
      </h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {[
          ["/admin/devocionais/novo", "Novo devocional"],
          ["/admin/missoes/novo", "Nova missão"],
          ["/admin/quiz/novo", "Nova pergunta de quiz"],
          ["/admin/trilhas/novo", "Nova trilha"],
          ["/admin/videos/novo", "Nova mensagem do dia"],
        ].map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl border border-border bg-card p-4 text-sm transition hover:border-primary/40"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
