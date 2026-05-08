import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/user";
import { listDiarioEntradas } from "@/lib/repo/diario";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { DiarioEvolucaoChart } from "@/components/features/diario-chart";
import {
  PenLine,
  Plus,
  Wind,
  HandHeart,
  Smile,
  Frown,
  Angry,
  CloudDrizzle,
  AlertCircle,
  Sparkles,
  BookOpen,
} from "lucide-react";

const ICON_BY_EMOCAO: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  paz: Wind,
  gratidao: HandHeart,
  alegria: Smile,
  esperanca: Sparkles,
  ansiedade: AlertCircle,
  tristeza: Frown,
  raiva: Angry,
  medo: CloudDrizzle,
};

export default async function DiarioPage() {
  const user = await getCurrentUser();
  const entradas = await listDiarioEntradas(user.id);

  const byMonth = groupByMonth(entradas);

  return (
    <div className="px-4 pt-6 pb-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold">Diário espiritual</h1>
          <p className="text-sm text-muted-foreground">
            O que Deus tem falado ao seu coração.
          </p>
        </div>
        <Link href="/diario/novo" className={buttonVariants({ size: "sm" })}>
          <Plus className="h-4 w-4" /> Nova
        </Link>
      </div>

      {entradas.length >= 2 && (
        <div className="mb-6">
          <DiarioEvolucaoChart entradas={entradas} />
        </div>
      )}

      {entradas.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <PenLine className="h-10 w-10 text-muted-foreground/60" />
            <p className="text-sm text-muted-foreground">
              Comece seu diário registrando o que você viveu com Deus hoje.
            </p>
            <Link href="/diario/novo" className={buttonVariants()}>
              Escrever primeira entrada
            </Link>
          </CardContent>
        </Card>
      )}

      {Object.entries(byMonth).map(([monthKey, items]) => (
        <section key={monthKey} className="mb-8">
          <h2 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
            {monthKey}
          </h2>
          <div className="grid gap-3">
            {items.map((e) => {
              const Icon = ICON_BY_EMOCAO[e.emocao ?? ""] ?? BookOpen;
              return (
                <Card key={e.id}>
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className="flex w-14 shrink-0 flex-col items-center gap-1">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatDay(e.data)}
                      </span>
                    </div>
                    <div className="flex-1">
                      {e.emocao && (
                        <p className="mb-1 text-[11px] uppercase tracking-wider text-primary">
                          {e.emocao}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed">{e.texto}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function groupByMonth(entradas: Awaited<ReturnType<typeof listDiarioEntradas>>) {
  const out: Record<string, typeof entradas> = {};
  for (const e of entradas) {
    const d = new Date(e.data);
    const key = d.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
    (out[key] ??= []).push(e);
  }
  return out;
}
function formatDay(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
