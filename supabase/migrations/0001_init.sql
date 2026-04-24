-- =============================================================
-- App Biblia - Schema inicial
-- Tudo por user_id com RLS habilitado.
-- =============================================================

create extension if not exists "pg_trgm";
create extension if not exists "unaccent";

-- ------------------------------------------------------------
-- profiles: 1:1 com auth.users
-- ------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  foto_url text,
  timezone text not null default 'America/Sao_Paulo',
  role text not null default 'user' check (role in ('user','admin')),
  onboarding_done boolean not null default false,
  streak_dias int not null default 0,
  streak_maior int not null default 0,
  ultimo_acesso_dia date,
  tempo_com_deus_min int not null default 0,
  pontos int not null default 0,
  nivel int not null default 1,
  preferencia_tema text not null default 'dark' check (preferencia_tema in ('dark','light')),
  preferencia_versao_biblia text not null default 'ACF',
  horario_notificacao time,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, nome) values (new.id, coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)));
  return new;
end $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- subscriptions: vem do webhook Kiwify/Greenn
-- ------------------------------------------------------------
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  provider text not null check (provider in ('kiwify','greenn','manual')),
  external_id text not null,
  plan_name text,
  status text not null check (status in ('active','trialing','past_due','canceled','refunded','expired')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, external_id)
);

create index subscriptions_email_idx on public.subscriptions (email);
create index subscriptions_user_id_idx on public.subscriptions (user_id);

alter table public.subscriptions enable row level security;
create policy "subscriptions_select_own" on public.subscriptions for select
using (auth.uid() = user_id or auth.jwt()->>'email' = email);

-- ------------------------------------------------------------
-- Biblia
-- ------------------------------------------------------------
create table public.bible_versions (
  id text primary key,           -- 'ACF', 'NVI', 'ARA'
  nome text not null,
  idioma text not null default 'pt-BR',
  dominio_publico boolean not null default false,
  ordem int not null default 0
);

create table public.bible_books (
  id serial primary key,
  version_id text references public.bible_versions(id) on delete cascade,
  abbrev text not null,
  nome text not null,
  testamento text not null check (testamento in ('AT','NT')),
  ordem int not null,
  total_capitulos int not null
);
create index bible_books_version_idx on public.bible_books (version_id, ordem);

create table public.bible_verses (
  id bigserial primary key,
  version_id text not null references public.bible_versions(id) on delete cascade,
  book_id int not null references public.bible_books(id) on delete cascade,
  capitulo int not null,
  versiculo int not null,
  texto text not null,
  unique (version_id, book_id, capitulo, versiculo)
);
create index bible_verses_lookup_idx on public.bible_verses (version_id, book_id, capitulo);
create index bible_verses_trgm_idx on public.bible_verses using gin (texto gin_trgm_ops);

-- ------------------------------------------------------------
-- Marcacoes, notas, favoritos
-- ------------------------------------------------------------
create table public.user_highlights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  verse_id bigint not null references public.bible_verses(id) on delete cascade,
  cor text not null default 'gold',
  created_at timestamptz not null default now(),
  unique (user_id, verse_id)
);
alter table public.user_highlights enable row level security;
create policy "user_highlights_all_own" on public.user_highlights for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.user_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  verse_id bigint not null references public.bible_verses(id) on delete cascade,
  texto text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.user_notes enable row level security;
create policy "user_notes_all_own" on public.user_notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.user_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  verse_id bigint not null references public.bible_verses(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, verse_id)
);
alter table public.user_bookmarks enable row level security;
create policy "user_bookmarks_all_own" on public.user_bookmarks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Planos de leitura
-- ------------------------------------------------------------
create table public.reading_plans (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titulo text not null,
  descricao text,
  duracao_dias int not null,
  capa_url text,
  publicado boolean not null default false
);

create table public.reading_plan_days (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.reading_plans(id) on delete cascade,
  dia int not null,
  referencias jsonb not null,  -- [{book_abbrev, capitulo}]
  unique (plan_id, dia)
);

create table public.user_reading_plan_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.reading_plans(id) on delete cascade,
  dia_atual int not null default 1,
  ultimo_concluido_em timestamptz,
  unique (user_id, plan_id)
);
alter table public.user_reading_plan_progress enable row level security;
create policy "urpp_all_own" on public.user_reading_plan_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Devocionais
-- ------------------------------------------------------------
create table public.devocional_series (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titulo text not null,
  descricao text,
  capa_url text,
  ordem int not null default 0,
  publicado boolean not null default false
);

create table public.devocionais (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  serie_id uuid references public.devocional_series(id) on delete set null,
  titulo text not null,
  versiculo_ref text not null,
  versiculo_texto text not null,
  explicacao text not null,
  aplicacao text not null,
  oracao text not null,
  pergunta text,
  tempo_min int not null default 3,
  data date,
  ordem int not null default 0,
  publicado boolean not null default false,
  created_at timestamptz not null default now()
);
create index devocionais_data_idx on public.devocionais (data);
create index devocionais_serie_idx on public.devocionais (serie_id, ordem);

create table public.user_devocional_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  devocional_id uuid not null references public.devocionais(id) on delete cascade,
  anotacao text,
  concluido_em timestamptz not null default now(),
  unique (user_id, devocional_id)
);
alter table public.user_devocional_progress enable row level security;
create policy "udp_all_own" on public.user_devocional_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Missoes e gamificacao
-- ------------------------------------------------------------
create table public.missoes (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  tipo text not null check (tipo in ('diaria','semanal','desafio')),
  duracao_dias int,        -- so para desafios
  pontos int not null default 10,
  data date,               -- diaria
  ordem int not null default 0,
  publicado boolean not null default true,
  created_at timestamptz not null default now()
);
create index missoes_tipo_data_idx on public.missoes (tipo, data);

create table public.user_missoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  missao_id uuid not null references public.missoes(id) on delete cascade,
  concluido_em timestamptz not null default now(),
  unique (user_id, missao_id)
);
alter table public.user_missoes enable row level security;
create policy "user_missoes_all_own" on public.user_missoes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.conquistas (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titulo text not null,
  descricao text,
  icone text,
  criterio jsonb not null    -- ex: {"type":"streak","dias":7}
);

create table public.user_conquistas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conquista_id uuid not null references public.conquistas(id) on delete cascade,
  desbloqueado_em timestamptz not null default now(),
  unique (user_id, conquista_id)
);
alter table public.user_conquistas enable row level security;
create policy "user_conquistas_all_own" on public.user_conquistas for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Quiz
-- ------------------------------------------------------------
create table public.quiz_perguntas (
  id uuid primary key default gen_random_uuid(),
  pergunta text not null,
  alternativas jsonb not null,     -- [{id, texto}]
  correta text not null,
  explicacao text,
  categoria text,
  nivel int not null default 1 check (nivel between 1 and 5),
  publicado boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.user_quiz_tentativas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pergunta_id uuid not null references public.quiz_perguntas(id) on delete cascade,
  resposta text,
  acertou boolean not null,
  created_at timestamptz not null default now()
);
alter table public.user_quiz_tentativas enable row level security;
create policy "uqt_all_own" on public.user_quiz_tentativas for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Trilhas
-- ------------------------------------------------------------
create table public.trilhas (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titulo text not null,
  descricao text,
  capa_url text,
  duracao_dias int not null,
  publicado boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.trilha_dias (
  id uuid primary key default gen_random_uuid(),
  trilha_id uuid not null references public.trilhas(id) on delete cascade,
  dia int not null,
  titulo text not null,
  conteudo text not null,
  pratica text,
  versiculo_ref text,
  versiculo_texto text,
  audio_url text,
  unique (trilha_id, dia)
);

create table public.user_trilha_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trilha_id uuid not null references public.trilhas(id) on delete cascade,
  dia_atual int not null default 1,
  ultimo_concluido_em timestamptz,
  unique (user_id, trilha_id)
);
alter table public.user_trilha_progress enable row level security;
create policy "utp_all_own" on public.user_trilha_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Audio
-- ------------------------------------------------------------
create table public.audios (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('devocional','oracao','ambiente','biblia')),
  titulo text not null,
  descricao text,
  duracao_seg int,
  url text not null,
  capa_url text,
  publicado boolean not null default false,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Oracoes e diario
-- ------------------------------------------------------------
create table public.oracoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  texto text,
  audio_url text,
  respondida_em timestamptz,
  created_at timestamptz not null default now()
);
alter table public.oracoes enable row level security;
create policy "oracoes_all_own" on public.oracoes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.diario_entradas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data date not null default current_date,
  emocao text,           -- ex: 'paz','ansiedade','gratidao'
  texto text not null,
  created_at timestamptz not null default now(),
  unique (user_id, data)
);
alter table public.diario_entradas enable row level security;
create policy "diario_all_own" on public.diario_entradas for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- IA Espiritual
-- ------------------------------------------------------------
create table public.ai_conversas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  titulo text,
  created_at timestamptz not null default now()
);
alter table public.ai_conversas enable row level security;
create policy "ai_conversas_all_own" on public.ai_conversas for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.ai_mensagens (
  id uuid primary key default gen_random_uuid(),
  conversa_id uuid not null references public.ai_conversas(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  conteudo text not null,
  tokens int,
  created_at timestamptz not null default now()
);
create index ai_mensagens_user_created_idx on public.ai_mensagens (user_id, created_at desc);
alter table public.ai_mensagens enable row level security;
create policy "ai_msg_all_own" on public.ai_mensagens for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Igrejas proximas
-- ------------------------------------------------------------
create table public.igrejas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  denominacao text,
  endereco text,
  cidade text,
  estado text,
  cep text,
  telefone text,
  email text,
  website text,
  lat double precision,
  lng double precision,
  horarios jsonb,
  created_at timestamptz not null default now()
);
create index igrejas_geo_idx on public.igrejas (lat, lng);

-- ------------------------------------------------------------
-- Videos / mensagens do dia
-- ------------------------------------------------------------
create table public.mensagens_dia (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  thumbnail_url text not null,
  video_url text not null,           -- ex: https://www.youtube.com/watch?v=...
  duracao_seg int,
  publicado_em date not null default current_date,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- Web Push subscriptions
-- ------------------------------------------------------------
create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  ua text,
  created_at timestamptz not null default now()
);
alter table public.push_subscriptions enable row level security;
create policy "push_sub_all_own" on public.push_subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
