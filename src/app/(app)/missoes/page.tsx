import {
  listMissoesPorTipo,
  listMissoesConcluidasHoje,
} from "@/lib/repo/missoes";
import { getCurrentUser } from "@/lib/auth/user";
import { Card, CardContent } from "@/components/ui/card";
import { MissionConcluirButton } from "@/components/features/mission-concluir-button";
import { Flame, Target, Trophy } from "lucide-react";

export default async function MissoesPage() {
  const user = await getCurrentUser();
  const [diarias, semanais, desafios, concluidas] = await Promise.all([
    listMissoesPorTipo("diaria"),
    listMissoesPorTipo("semanal"),
    listMissoesPorTipo("desafio"),
    user.isPreview
      ? Promise.resolve(new Set<string>())
      : listMissoesConcluidasHoje(user.id),
  ]);

  return (
    <div className="px-4 pt-6 pb-8">
      <h1 className="mb-1 font-serif text-2xl font-semibold">Missões</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Pequenos atos que constroem hábito e caráter.
      </p>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <Stat
          icon={<Flame className="h-4 w-4" />}
          label="Streak"
          value={user.profile.streak_dias}
        />
        <Stat
          icon={<Target className="h-4 w-4" />}
          label="Pontos"
          value={user.profile.pontos}
        />
        <Stat
          icon={<Trophy className="h-4 w-4" />}
          label="Nível"
          value={user.profile.nivel}
        />
      </div>

      <Section titulo="Diárias" itens={diarias} concluidas={concluidas} />
      <Section titulo="Semanais" itens={semanais} concluidas={concluidas} />
      <Section
        titulo="Desafios"
        itens={desafios}
        concluidas={concluidas}
        desafio
      />
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-1 p-3 text-center">
        <span className="text-primary">{icon}</span>
        <span className="font-serif text-xl font-semibold">{value}</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </CardContent>
    </Card>
  );
}

function Section({
  titulo,
  itens,
  concluidas,
  desafio = false,
}: {
  titulo: string;
  itens: Awaited<ReturnType<typeof listMissoesPorTipo>>;
  concluidas: Set<string>;
  desafio?: boolean;
}) {
  return (
    <section className="mb-6">
      <h2 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
        {titulo}
      </h2>
      <div className="grid gap-3">
        {itens.map((m) => (
          <Card key={m.id}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold">{m.titulo}</h3>
                {m.descricao && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {m.descricao}
                  </p>
                )}
                <p className="mt-1 text-[11px] text-primary">
                  +{m.pontos} pts
                  {desafio && m.duracao_dias ? ` · ${m.duracao_dias} dias` : ""}
                </p>
              </div>
              <MissionConcluirButton
                missaoId={m.id}
                initiallyDone={concluidas.has(m.id)}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
