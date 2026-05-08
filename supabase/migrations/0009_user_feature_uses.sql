-- =============================================================
-- Tabela generica pra rastrear uso de features com limite por
-- periodo (ex: devocional video 2x/semana, IA 10/dia free).
--
-- Cada linha = 1 uso de uma feature por um user num timestamp.
-- Conta as linhas dentro do periodo pra saber se atingiu limite.
-- =============================================================

create table if not exists public.user_feature_uses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feature text not null,
  used_at timestamptz not null default now(),
  meta jsonb
);

-- Indice principal pra contar usos no periodo
create index if not exists user_feature_uses_lookup_idx
  on public.user_feature_uses (user_id, feature, used_at desc);

alter table public.user_feature_uses enable row level security;

create policy "ufu_select_own"
  on public.user_feature_uses for select
  using (auth.uid() = user_id);

create policy "ufu_insert_own"
  on public.user_feature_uses for insert
  with check (auth.uid() = user_id);

-- Sem update/delete via cliente. Service role pode tudo.
