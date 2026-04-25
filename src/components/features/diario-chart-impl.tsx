"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

const EMOCAO_SCORE: Record<string, number> = {
  paz: 5,
  gratidao: 5,
  alegria: 5,
  esperanca: 4,
  ansiedade: 2,
  tristeza: 2,
  raiva: 1,
  medo: 1,
};

export function DiarioEvolucaoChart({
  entradas,
}: {
  entradas: { data: string; emocao: string | null }[];
}) {
  if (entradas.length < 2) return null;

  const data = entradas
    .filter((e) => e.emocao && EMOCAO_SCORE[e.emocao] !== undefined)
    .map((e) => ({
      dia: new Date(e.data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
      estado: EMOCAO_SCORE[e.emocao!],
      emocao: e.emocao,
    }))
    .reverse();

  if (data.length < 2) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-1 text-[11px] uppercase tracking-wider text-muted-foreground">
        Seu estado emocional nos últimos dias
      </p>
      <p className="mb-3 text-xs text-muted-foreground">
        5 = muita paz · 1 = medo/raiva
      </p>
      <div className="h-40 w-full">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="dia"
              fontSize={10}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              domain={[0, 5]}
              ticks={[1, 3, 5]}
              fontSize={10}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={((v: unknown, _n: unknown, item: unknown) => {
                const emocao =
                  ((item as { payload?: { emocao?: string } })?.payload
                    ?.emocao) ?? "";
                return [`${v} (${emocao})`, "estado"];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              }) as any}
            />
            <Line
              type="monotone"
              dataKey="estado"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3, fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
