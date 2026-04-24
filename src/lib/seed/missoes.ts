import type { Missao } from "@/lib/supabase/types";

export const MISSOES_DIARIAS_SEED: Missao[] = [
  {
    id: "m-d-001",
    titulo: "Envie gratidão",
    descricao:
      "Envie uma mensagem de gratidão para alguém que tem sido importante na sua vida.",
    tipo: "diaria",
    duracao_dias: null,
    pontos: 10,
    data: null,
    ordem: 1,
    publicado: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "m-d-002",
    titulo: "10 minutos em silêncio",
    descricao: "Fique 10 minutos em silêncio, só ouvindo Deus.",
    tipo: "diaria",
    duracao_dias: null,
    pontos: 10,
    data: null,
    ordem: 2,
    publicado: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "m-d-003",
    titulo: "Ore por 3 pessoas",
    descricao: "Pare e ore especificamente por 3 pessoas diferentes hoje.",
    tipo: "diaria",
    duracao_dias: null,
    pontos: 10,
    data: null,
    ordem: 3,
    publicado: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "m-d-004",
    titulo: "Leia um capítulo",
    descricao: "Leia um capítulo inteiro da Bíblia, sem pressa.",
    tipo: "diaria",
    duracao_dias: null,
    pontos: 10,
    data: null,
    ordem: 4,
    publicado: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "m-d-005",
    titulo: "Memorize um versículo",
    descricao: "Escolha 1 versículo e decore-o ao longo do dia.",
    tipo: "diaria",
    duracao_dias: null,
    pontos: 10,
    data: null,
    ordem: 5,
    publicado: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "m-d-006",
    titulo: "Peça perdão",
    descricao: "Peça perdão a alguém por algo que você fez ou deixou de fazer.",
    tipo: "diaria",
    duracao_dias: null,
    pontos: 15,
    data: null,
    ordem: 6,
    publicado: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "m-d-007",
    titulo: "Encoraje alguém",
    descricao:
      "Envie uma palavra de encorajamento baseada num versículo para alguém.",
    tipo: "diaria",
    duracao_dias: null,
    pontos: 10,
    data: null,
    ordem: 7,
    publicado: true,
    created_at: new Date().toISOString(),
  },
];

export const MISSOES_SEMANAIS_SEED: Missao[] = [
  {
    id: "m-s-001",
    titulo: "Jejum de uma refeição",
    descricao: "Pule uma refeição esta semana e dedique o tempo à oração.",
    tipo: "semanal",
    duracao_dias: null,
    pontos: 40,
    data: null,
    ordem: 1,
    publicado: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "m-s-002",
    titulo: "Vá a um culto",
    descricao: "Participe de um culto ou reunião presencial esta semana.",
    tipo: "semanal",
    duracao_dias: null,
    pontos: 30,
    data: null,
    ordem: 2,
    publicado: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "m-s-003",
    titulo: "Ofertar",
    descricao:
      "Ofereça algo (dinheiro, tempo, recurso) a uma pessoa ou ministério esta semana.",
    tipo: "semanal",
    duracao_dias: null,
    pontos: 30,
    data: null,
    ordem: 3,
    publicado: true,
    created_at: new Date().toISOString(),
  },
];

export const MISSOES_DESAFIOS_SEED: Missao[] = [
  {
    id: "m-x-001",
    titulo: "7 dias sem reclamar",
    descricao:
      "Um desafio de 7 dias sem fazer reclamações. Toda vez que perceber, reinicie.",
    tipo: "desafio",
    duracao_dias: 7,
    pontos: 100,
    data: null,
    ordem: 1,
    publicado: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "m-x-002",
    titulo: "21 dias de oração matinal",
    descricao: "21 dias orando antes de tocar no celular pela manhã.",
    tipo: "desafio",
    duracao_dias: 21,
    pontos: 300,
    data: null,
    ordem: 2,
    publicado: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "m-x-003",
    titulo: "14 dias de gratidão",
    descricao:
      "Por 14 dias, registre 3 coisas pelas quais você é grato, antes de dormir.",
    tipo: "desafio",
    duracao_dias: 14,
    pontos: 200,
    data: null,
    ordem: 3,
    publicado: true,
    created_at: new Date().toISOString(),
  },
];

export function missaoDoDia(): Missao {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86_400_000,
  );
  return MISSOES_DIARIAS_SEED[dayOfYear % MISSOES_DIARIAS_SEED.length];
}
