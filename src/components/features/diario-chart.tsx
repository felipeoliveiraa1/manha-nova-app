"use client";

import dynamic from "next/dynamic";

const DiarioEvolucaoChartImpl = dynamic(
  () => import("./diario-chart-impl").then((m) => m.DiarioEvolucaoChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-52 animate-pulse rounded-xl border border-border bg-muted/20" />
    ),
  },
);

export function DiarioEvolucaoChart(
  props: React.ComponentProps<typeof DiarioEvolucaoChartImpl>,
) {
  return <DiarioEvolucaoChartImpl {...props} />;
}
