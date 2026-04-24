-- =============================================================
-- pgvector + embeddings para bible_verses
-- Habilita busca semantica (find by meaning, not keywords)
-- =============================================================

create extension if not exists vector;

-- Coluna de embedding. 1536 dim = text-embedding-3-small da OpenAI.
alter table public.bible_verses
  add column if not exists embedding vector(1536);

-- Indice HNSW para busca por similaridade (cosseno).
-- HNSW e rapido e nao precisa de reindex apos insercoes.
create index if not exists bible_verses_embedding_idx
  on public.bible_verses
  using hnsw (embedding vector_cosine_ops);

-- Funcao RPC para busca semantica.
-- Uso: select * from match_bible_verses(<vector>, 0.3, 20, 'ACF');
create or replace function public.match_bible_verses(
  query_embedding vector(1536),
  match_threshold float default 0.3,
  match_count int default 20,
  version text default 'ACF'
)
returns table (
  id bigint,
  version_id text,
  book_id int,
  capitulo int,
  versiculo int,
  texto text,
  similarity float
)
language sql stable
as $$
  select
    v.id,
    v.version_id,
    v.book_id,
    v.capitulo,
    v.versiculo,
    v.texto,
    1 - (v.embedding <=> query_embedding) as similarity
  from public.bible_verses v
  where v.version_id = version
    and v.embedding is not null
    and 1 - (v.embedding <=> query_embedding) > match_threshold
  order by v.embedding <=> query_embedding
  limit match_count
$$;

-- Permissao: a funcao usa security invoker (default). Versículos sao publicos, sem RLS.
