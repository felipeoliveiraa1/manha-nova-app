import type { MensagemDia } from "@/lib/supabase/types";

export const VIDEOS_SEED: MensagemDia[] = [
  {
    id: "v-001",
    titulo: "Como vencer a ansiedade com fé",
    descricao: "Uma mensagem curta sobre como lidar com a ansiedade à luz da Palavra.",
    thumbnail_url: "",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duracao_seg: 342,
    publicado_em: new Date().toISOString().slice(0, 10),
    created_at: new Date().toISOString(),
  },
  {
    id: "v-002",
    titulo: "O segredo da intimidade com Deus",
    descricao: "Como construir uma rotina que transforma.",
    thumbnail_url: "",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duracao_seg: 480,
    publicado_em: new Date(Date.now() - 86_400_000).toISOString().slice(0, 10),
    created_at: new Date().toISOString(),
  },
  {
    id: "v-003",
    titulo: "Quando Deus parece silencioso",
    descricao: "O que fazer nas temporadas em que o céu parece fechado.",
    thumbnail_url: "",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duracao_seg: 540,
    publicado_em: new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10),
    created_at: new Date().toISOString(),
  },
];

export function mensagemDoDia(): MensagemDia {
  return VIDEOS_SEED[0];
}
