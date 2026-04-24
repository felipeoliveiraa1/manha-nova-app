-- =============================================================
-- Suporte a bulk ingest de embeddings:
-- 1) Sobe statement_timeout do service_role (bulk loads precisam).
-- 2) RPCs pra drop/create do indice HNSW (bulk pattern).
-- 3) RPCs de update (por id unico e em batch).
-- =============================================================

-- 1) Statement_timeout ilimitado para service_role.
--    Afeta apenas ele; anon/authenticated continuam com os defaults.
alter role service_role set statement_timeout to '0';

-- 2) Index helpers.
create or replace function public.drop_bible_embedding_index()
returns void
language sql
security definer
set search_path = public
as $$
  drop index if exists public.bible_verses_embedding_idx;
$$;

create or replace function public.create_bible_embedding_index()
returns void
language sql
security definer
set search_path = public
as $$
  create index if not exists bible_verses_embedding_idx
    on public.bible_verses
    using hnsw (embedding vector_cosine_ops);
$$;

-- 3) Update helpers.
create or replace function public.update_verse_embedding(
  verse_id bigint,
  new_embedding vector(1536)
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.bible_verses
     set embedding = new_embedding
   where id = verse_id;
end;
$$;

create or replace function public.update_verse_embeddings_batch(
  ids bigint[],
  embeddings text[]
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  i int;
begin
  if array_length(ids, 1) is null then return; end if;
  for i in 1..array_length(ids, 1) loop
    update public.bible_verses
       set embedding = embeddings[i]::vector
     where id = ids[i];
  end loop;
end;
$$;
