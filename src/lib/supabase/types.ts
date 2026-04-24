// Tipos gerados via: npx supabase gen types typescript --project-id <id> > types.ts
// Enquanto nao rodamos isso, usamos um shape permissivo.
export type Database = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public: any;
};

// ------------------------------------------------------------
// Tipos manuais (para rows que usamos no codigo).
// ------------------------------------------------------------
export type Profile = {
  id: string;
  nome: string | null;
  foto_url: string | null;
  timezone: string;
  role: "user" | "admin";
  onboarding_done: boolean;
  streak_dias: number;
  streak_maior: number;
  ultimo_acesso_dia: string | null;
  tempo_com_deus_min: number;
  pontos: number;
  nivel: number;
  preferencia_tema: "dark" | "light";
  preferencia_versao_biblia: string;
  horario_notificacao: string | null;
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string | null;
  email: string;
  provider: "kiwify" | "greenn" | "manual";
  external_id: string;
  plan_name: string | null;
  status:
    | "active"
    | "trialing"
    | "past_due"
    | "canceled"
    | "refunded"
    | "expired";
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

export type Devocional = {
  id: string;
  slug: string;
  serie_id: string | null;
  titulo: string;
  versiculo_ref: string;
  versiculo_texto: string;
  explicacao: string;
  aplicacao: string;
  oracao: string;
  pergunta: string | null;
  tempo_min: number;
  data: string | null;
  ordem: number;
  publicado: boolean;
  created_at: string;
};

export type DevocionalSerie = {
  id: string;
  slug: string;
  titulo: string;
  descricao: string | null;
  capa_url: string | null;
  ordem: number;
  publicado: boolean;
};

export type Missao = {
  id: string;
  titulo: string;
  descricao: string | null;
  tipo: "diaria" | "semanal" | "desafio";
  duracao_dias: number | null;
  pontos: number;
  data: string | null;
  ordem: number;
  publicado: boolean;
  created_at: string;
};

export type QuizPergunta = {
  id: string;
  pergunta: string;
  alternativas: Array<{ id: string; texto: string }>;
  correta: string;
  explicacao: string | null;
  categoria: string | null;
  nivel: number;
  publicado: boolean;
  created_at: string;
};

export type Trilha = {
  id: string;
  slug: string;
  titulo: string;
  descricao: string | null;
  capa_url: string | null;
  duracao_dias: number;
  publicado: boolean;
  created_at: string;
};

export type TrilhaDia = {
  id: string;
  trilha_id: string;
  dia: number;
  titulo: string;
  conteudo: string;
  pratica: string | null;
  versiculo_ref: string | null;
  versiculo_texto: string | null;
  audio_url: string | null;
};

export type Audio = {
  id: string;
  tipo: "devocional" | "oracao" | "ambiente" | "biblia";
  titulo: string;
  descricao: string | null;
  duracao_seg: number | null;
  url: string;
  capa_url: string | null;
  publicado: boolean;
  created_at: string;
};

export type Oracao = {
  id: string;
  user_id: string;
  texto: string | null;
  audio_url: string | null;
  respondida_em: string | null;
  created_at: string;
};

export type DiarioEntrada = {
  id: string;
  user_id: string;
  data: string;
  emocao: string | null;
  texto: string;
  created_at: string;
};

export type AiConversa = {
  id: string;
  user_id: string;
  titulo: string | null;
  created_at: string;
};

export type AiMensagem = {
  id: string;
  conversa_id: string;
  user_id: string;
  role: "user" | "assistant" | "system";
  conteudo: string;
  tokens: number | null;
  created_at: string;
};

export type Igreja = {
  id: string;
  nome: string;
  denominacao: string | null;
  endereco: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  telefone: string | null;
  email: string | null;
  website: string | null;
  lat: number | null;
  lng: number | null;
  horarios: unknown | null;
  created_at: string;
};

export type MensagemDia = {
  id: string;
  titulo: string;
  descricao: string | null;
  thumbnail_url: string;
  video_url: string;
  duracao_seg: number | null;
  publicado_em: string;
  created_at: string;
};

export type BibleVersion = {
  id: string;
  nome: string;
  idioma: string;
  dominio_publico: boolean;
  ordem: number;
};

export type BibleBook = {
  id: number;
  version_id: string;
  abbrev: string;
  nome: string;
  testamento: "AT" | "NT";
  ordem: number;
  total_capitulos: number;
};

export type BibleVerse = {
  id: number;
  version_id: string;
  book_id: number;
  capitulo: number;
  versiculo: number;
  texto: string;
};

export type Conquista = {
  id: string;
  slug: string;
  titulo: string;
  descricao: string | null;
  icone: string | null;
  criterio: unknown;
};
