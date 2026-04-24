# Manhã Nova

Webapp instalável (PWA) de rotina espiritual — devocionais, bíblia, missões, trilhas, IA e diário.
**Next.js 16 + TypeScript + Tailwind 4 + Supabase + OpenAI + Kiwify/Greenn.**

> Briefing original em [docs/](docs/).

---

## Status atual ✅

**~50 rotas** implementadas. Build de produção passa limpo.

### Páginas do usuário (autenticado)

| Rota | Descrição |
|---|---|
| `/` | Landing pública com CTA de assinatura |
| `/login`, `/register` | Auth via Supabase |
| `/home` | Central diária — versículo, devocional, missão, oração, progresso, mensagem do dia |
| `/biblia` | Lista dos 66 livros AT/NT (ACF) |
| `/biblia/[livro]/[capitulo]` | Leitor com navegação |
| `/biblia/busca?q=...` | Busca textual (trgm) com highlight |
| `/devocionais` | Lista + séries temáticas |
| `/devocionais/[slug]` | Leitor + concluir + anotação |
| `/devocionais/series/[slug]` | Série completa |
| `/missoes` | Diárias / Semanais / Desafios + stats |
| `/quiz` | Gameplay de quiz bíblico |
| `/quiz/ranking` | Ranking semanal com medalhas |
| `/trilhas` | Lista de jornadas |
| `/trilhas/[slug]` | Dias da trilha |
| `/trilhas/[slug]/[dia]` | Leitura do dia + avançar |
| `/audio` | Orações guiadas + devocionais narrados + ambiente |
| `/ia` | Chat com IA espiritual (OpenAI + guardrails) |
| `/diario`, `/diario/novo` | Diário com emoção e evolução |
| `/oracao` | Histórico de orações + nova |
| `/explorar` | Hub de recursos |
| `/explorar/dicionario` | Dicionário bíblico (15 termos) |
| `/explorar/temas`, `/temas/[slug]` | 8 temas com versículos |
| `/explorar/historias`, `/historias/[slug]` | 10 histórias bíblicas |
| `/explorar/mapas` | Lugares bíblicos |
| `/explorar/blog`, `/explorar/faq` | Conteúdo |
| `/igrejas` | Lista com geolocalização e distância |
| `/perfil` | Dashboard, stats, assinatura, logout |
| `/configuracoes` | Tema, horário de notificação, versão da Bíblia |

### Admin (`/admin` — role=admin)

- Dashboard com contadores por tabela
- CRUD forms para: devocionais, missões, quiz, trilhas, mensagens do dia, igrejas

### API / Webhooks

- `POST /api/webhooks/kiwify` — HMAC + cria usuário + atualiza subscription
- `POST /api/webhooks/greenn` — idem Greenn
- `POST /api/ai/chat` — proxy OpenAI com rate limit (30 msgs/dia) + system prompt pastoral
- `POST /api/push/subscribe`, `/api/push/unsubscribe` — Web Push VAPID

---

## Stack

- **Next.js 16** (App Router, Turbopack, Server Actions, `proxy.ts` auth gating)
- **TypeScript** + **Tailwind 4**
- Componentes estilo **shadcn/ui** (Button, Card, Input, Label, Textarea) manuais
- **Supabase** (Auth + Postgres com RLS + Storage + Edge Functions)
- **TanStack Query** + **Zustand** (player global)
- **motion** (ex-Framer Motion) + **lucide-react**
- **OpenAI** (IA Espiritual, via Route Handler)
- **Kiwify / Greenn** (assinatura externa via webhook)
- **Resend** (email transacional — próxima sprint)
- **Web Push** com VAPID
- **PWA nativo** (manifest + service worker) com install prompt iOS/Android

---

## Arquitetura de dados

Schema completo em [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql). Seed de conteúdo em [supabase/migrations/0002_seed_content.sql](supabase/migrations/0002_seed_content.sql).

Todas as tabelas de usuário com **RLS** ativa. Trigger `handle_new_user` cria `profiles` automaticamente no signup.

### Modo preview (sem Supabase)

O app **renderiza 100% sem Supabase configurado**. Dados vêm de seeds em [src/lib/seed/](src/lib/seed/):

- 40 versículos do dia
- 7 devocionais + 4 séries
- 13 missões (diárias/semanais/desafios)
- 12 perguntas de quiz
- 3 trilhas (7 e 21 dias)
- 8 áudios
- 66 livros da Bíblia + 15 capítulos ACF seedados
- 15 termos de dicionário
- 8 temas
- 10 histórias bíblicas
- 3 igrejas

---

## Rodando localmente

### 1. Configurar env

```bash
cp .env.example .env.local
```

### 2. Rodar em modo preview (sem Supabase)

```bash
npm run dev
```

Abra http://localhost:3000. Todas as 50+ rotas funcionam — salvar/login exigem Supabase.

### 3. Conectar Supabase (opcional para testar persistência)

1. Crie projeto em https://supabase.com/dashboard
2. Copie `Project URL`, `anon key`, `service_role key` para `.env.local`
3. Aplique `supabase/migrations/0001_init.sql` no SQL Editor
4. (Opcional) Aplique `0002_seed_content.sql` para popular o banco
5. Restart `npm run dev`

### 4. Ativar IA Espiritual

Preencha `OPENAI_API_KEY` no `.env.local`. Modelo padrão: `gpt-4o-mini`.

### 5. Ativar Push

```bash
npx web-push generate-vapid-keys
```

Cole o público em `NEXT_PUBLIC_VAPID_PUBLIC_KEY` e o privado em `VAPID_PRIVATE_KEY`.

### 6. Kiwify / Greenn

- Configure o produto (assinatura R$29,90)
- URL do webhook: `https://<seu-dominio>/api/webhooks/kiwify` (ou `/greenn`)
- Cole o secret em `KIWIFY_WEBHOOK_SECRET` / `GREENN_WEBHOOK_SECRET`

---

## Estrutura

```
src/
├─ app/
│  ├─ (public)/           landing
│  ├─ (auth)/             login, register
│  ├─ (app)/              rotas autenticadas (home, biblia, devocionais, ...)
│  │  └─ layout.tsx       bottom nav + mini-player + install prompt + SW
│  ├─ admin/              CMS
│  ├─ api/
│  │  ├─ ai/chat/         proxy OpenAI
│  │  ├─ push/            subscribe/unsubscribe
│  │  └─ webhooks/        kiwify, greenn
│  ├─ manifest.ts         PWA manifest
│  └─ globals.css         tema dark grafite + dourado
├─ components/
│  ├─ ui/                 button, card, input, label, textarea
│  ├─ layout/             bottom-nav, top-header, mini-player
│  └─ features/           chat, oracao-form, quiz-game, etc
├─ lib/
│  ├─ supabase/           client / server / admin / middleware
│  ├─ auth/               actions-app, actions-admin, user
│  ├─ seed/               dados estáticos (fallback)
│  ├─ repo/               acesso unificado (Supabase OU seed)
│  └─ stores/             player global (Zustand)
└─ proxy.ts               auth gating (Next 16 renomeou middleware)
```

---

## PWA

- `app/manifest.ts` com theme_color grafite + ícone SVG
- `public/sw.js` com precache do shell + push handler + notification click
- `<ServiceWorkerRegister>` registra em produção
- `<InstallPrompt>` mostra botão Android + instruções iOS

**No iOS**: instalação via Safari → Compartilhar → "Adicionar à Tela de Início". Notificações push funcionam a partir do iOS 16.4+ para PWAs instalados.

---

## Deploy

### Frontend (Vercel)

```bash
vercel
```

Espelhe todas as envs do `.env.local` no projeto Vercel.

### Backend (Supabase Cloud)

Aplicar migrations via dashboard ou CLI:

```bash
npx supabase link --project-ref <ref>
npx supabase db push
```

---

## Pendências conhecidas para beta

- [ ] Substituir `public/icons/icon.svg` por PNGs (192/512/maskable) com a marca final
- [ ] Ingestão completa ACF (~31k versículos) — script separado a escrever
- [ ] Licenciar NVI/ARA (contatar SBB/editoras) — opcional, ACF cobre v1
- [ ] Áudio real da Bíblia (faithcomesbyhearing ou TTS)
- [ ] Integração Google Places pra lista dinâmica de igrejas
- [ ] Resend pra emails de boas-vindas/recovery
- [ ] Cron Supabase: reset diário (streak/missões)
- [ ] Revisão pastoral do system prompt da IA
- [ ] Termos de uso + política LGPD (oração/diário = dado sensível)

---

## Scripts

```bash
npm run dev     # dev server com Turbopack
npm run build   # build de produção
npm start       # rodar build
npm run lint    # ESLint
```
