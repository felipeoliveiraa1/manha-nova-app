-- =============================================================
-- Policies de leitura PUBLICA para tabelas de conteudo.
-- Sem isso, anon fica bloqueado pelo RLS e o leitor mostra tabela vazia.
-- =============================================================

-- Biblia: texto, livros, versoes (todos publicos)
alter table public.bible_versions enable row level security;
alter table public.bible_books enable row level security;
alter table public.bible_verses enable row level security;

drop policy if exists "bible_versions_public_read" on public.bible_versions;
drop policy if exists "bible_books_public_read" on public.bible_books;
drop policy if exists "bible_verses_public_read" on public.bible_verses;

create policy "bible_versions_public_read" on public.bible_versions
  for select to anon, authenticated using (true);

create policy "bible_books_public_read" on public.bible_books
  for select to anon, authenticated using (true);

create policy "bible_verses_public_read" on public.bible_verses
  for select to anon, authenticated using (true);

-- Devocionais publicados: acessiveis pra qualquer pessoa.
alter table public.devocional_series enable row level security;
alter table public.devocionais enable row level security;

drop policy if exists "devocional_series_public_read" on public.devocional_series;
drop policy if exists "devocionais_public_read" on public.devocionais;

create policy "devocional_series_public_read" on public.devocional_series
  for select to anon, authenticated using (publicado = true);

create policy "devocionais_public_read" on public.devocionais
  for select to anon, authenticated using (publicado = true);

-- Missoes, quiz, trilhas, audios: conteudo publicado é publico.
alter table public.missoes enable row level security;
alter table public.quiz_perguntas enable row level security;
alter table public.trilhas enable row level security;
alter table public.trilha_dias enable row level security;
alter table public.audios enable row level security;
alter table public.mensagens_dia enable row level security;
alter table public.igrejas enable row level security;
alter table public.reading_plans enable row level security;
alter table public.reading_plan_days enable row level security;
alter table public.conquistas enable row level security;

drop policy if exists "missoes_public_read" on public.missoes;
create policy "missoes_public_read" on public.missoes
  for select to anon, authenticated using (publicado = true);

drop policy if exists "quiz_public_read" on public.quiz_perguntas;
create policy "quiz_public_read" on public.quiz_perguntas
  for select to anon, authenticated using (publicado = true);

drop policy if exists "trilhas_public_read" on public.trilhas;
create policy "trilhas_public_read" on public.trilhas
  for select to anon, authenticated using (publicado = true);

drop policy if exists "trilha_dias_public_read" on public.trilha_dias;
create policy "trilha_dias_public_read" on public.trilha_dias
  for select to anon, authenticated using (true);

drop policy if exists "audios_public_read" on public.audios;
create policy "audios_public_read" on public.audios
  for select to anon, authenticated using (publicado = true);

drop policy if exists "mensagens_dia_public_read" on public.mensagens_dia;
create policy "mensagens_dia_public_read" on public.mensagens_dia
  for select to anon, authenticated using (true);

drop policy if exists "igrejas_public_read" on public.igrejas;
create policy "igrejas_public_read" on public.igrejas
  for select to anon, authenticated using (true);

drop policy if exists "reading_plans_public_read" on public.reading_plans;
create policy "reading_plans_public_read" on public.reading_plans
  for select to anon, authenticated using (publicado = true);

drop policy if exists "reading_plan_days_public_read" on public.reading_plan_days;
create policy "reading_plan_days_public_read" on public.reading_plan_days
  for select to anon, authenticated using (true);

drop policy if exists "conquistas_public_read" on public.conquistas;
create policy "conquistas_public_read" on public.conquistas
  for select to anon, authenticated using (true);
