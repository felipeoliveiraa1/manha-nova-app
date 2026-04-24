export type PlanoLeitura = {
  slug: string;
  titulo: string;
  descricao: string;
  dias: Array<{ dia: number; referencias: { abbrev: string; capitulo: number }[] }>;
};

export const PLANOS_SEED: PlanoLeitura[] = [
  {
    slug: "biblia-em-um-ano",
    titulo: "Bíblia em 1 ano",
    descricao: "3-4 capítulos por dia. Metade AT + meio NT, pra manter ritmo.",
    dias: Array.from({ length: 30 }).map((_, i) => ({
      dia: i + 1,
      referencias: [
        { abbrev: "gn", capitulo: i + 1 },
        { abbrev: "sl", capitulo: i + 1 },
        { abbrev: "mt", capitulo: ((i + 1) % 28) + 1 },
      ],
    })),
  },
  {
    slug: "novo-testamento-90-dias",
    titulo: "Novo Testamento em 90 dias",
    descricao: "Leia o NT em 3 meses — 3 capítulos por dia.",
    dias: [
      { dia: 1, referencias: [{ abbrev: "mt", capitulo: 1 }, { abbrev: "mt", capitulo: 2 }, { abbrev: "mt", capitulo: 3 }] },
      { dia: 2, referencias: [{ abbrev: "mt", capitulo: 4 }, { abbrev: "mt", capitulo: 5 }] },
      { dia: 3, referencias: [{ abbrev: "mt", capitulo: 6 }, { abbrev: "mt", capitulo: 7 }] },
      { dia: 4, referencias: [{ abbrev: "mt", capitulo: 8 }, { abbrev: "mt", capitulo: 9 }] },
      { dia: 5, referencias: [{ abbrev: "mt", capitulo: 10 }, { abbrev: "mt", capitulo: 11 }] },
    ],
  },
  {
    slug: "provérbios-em-um-mes",
    titulo: "Provérbios em 31 dias",
    descricao: "Um capítulo de Provérbios por dia. Sabedoria para o mês.",
    dias: Array.from({ length: 31 }).map((_, i) => ({
      dia: i + 1,
      referencias: [{ abbrev: "pv", capitulo: i + 1 }],
    })),
  },
  {
    slug: "salmos-para-dormir",
    titulo: "Salmos para dormir em paz",
    descricao: "30 dias lendo Salmos antes de dormir.",
    dias: [
      { dia: 1, referencias: [{ abbrev: "sl", capitulo: 1 }] },
      { dia: 2, referencias: [{ abbrev: "sl", capitulo: 4 }] },
      { dia: 3, referencias: [{ abbrev: "sl", capitulo: 23 }] },
      { dia: 4, referencias: [{ abbrev: "sl", capitulo: 91 }] },
      { dia: 5, referencias: [{ abbrev: "sl", capitulo: 121 }] },
    ],
  },
];

export function findPlano(slug: string) {
  return PLANOS_SEED.find((p) => p.slug === slug);
}
