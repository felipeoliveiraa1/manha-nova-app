import { getCurrentUser } from "@/lib/auth/user";
import { listOracoes } from "@/lib/repo/oracoes";
import { Card, CardContent } from "@/components/ui/card";
import { OracaoForm } from "@/components/features/oracao-form";
import { Sparkles } from "lucide-react";

export default async function OracaoPage() {
  const user = await getCurrentUser();
  const oracoes = await listOracoes(user.id);

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="mb-1 font-serif text-2xl font-semibold">Orações</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Suas conversas registradas com Deus.
      </p>

      <Card className="mb-6 border-primary/20">
        <CardContent className="p-5">
          <p className="mb-3 text-[11px] uppercase tracking-wider text-primary">
            Nova oração
          </p>
          <OracaoForm />
        </CardContent>
      </Card>

      <h2 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
        Histórico
      </h2>
      <div className="grid gap-3">
        {oracoes.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
              <Sparkles className="h-8 w-8 text-muted-foreground/60" />
              <p className="text-sm text-muted-foreground">
                Suas orações aparecerão aqui para você lembrar das respostas.
              </p>
            </CardContent>
          </Card>
        )}
        {oracoes.map((o) => (
          <Card key={o.id}>
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  {new Date(o.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                {o.respondida_em && (
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                    Respondida
                  </span>
                )}
              </div>
              {o.texto && <p className="text-sm leading-relaxed">{o.texto}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
