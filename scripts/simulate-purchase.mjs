import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const envContent = readFileSync(".env.local", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
});

const EMAIL = process.argv[2] ?? "felipeoliveiraa1@hotmail.com";
const NOME = process.argv[3] ?? "Felipe";
const PASSWORD = process.argv[4] ?? "ManhaNova2026!";

const sb = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

console.log(`\n→ Simulando compra Greenn para ${EMAIL}\n`);

// 1. Cria user ou atualiza senha
const { data: userList } = await sb.auth.admin.listUsers();
const existing = userList.users.find(
  (u) => u.email?.toLowerCase() === EMAIL.toLowerCase(),
);

let userId;
if (existing) {
  console.log(`  Usuário já existe (${existing.id}). Atualizando senha...`);
  const { error } = await sb.auth.admin.updateUserById(existing.id, {
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { ...existing.user_metadata, nome: NOME },
  });
  if (error) {
    console.error("  ❌ falha:", error.message);
    process.exit(1);
  }
  userId = existing.id;
} else {
  console.log(`  Criando novo usuário...`);
  const { data: created, error } = await sb.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { nome: NOME, provisioned_via: "manual-test" },
  });
  if (error) {
    console.error("  ❌ falha:", error.message);
    process.exit(1);
  }
  userId = created.user.id;
}

// 2. Inserir/atualizar assinatura ATIVA
const { error: subErr } = await sb.from("subscriptions").upsert(
  {
    user_id: userId,
    email: EMAIL.toLowerCase(),
    provider: "manual",
    external_id: `manual-test-${userId}`,
    plan_name: "Manhã Nova — Mensal (Teste)",
    status: "active",
    current_period_end: new Date(
      Date.now() + 365 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    updated_at: new Date().toISOString(),
  },
  { onConflict: "provider,external_id" },
);

if (subErr) {
  console.error("  ❌ falha ao criar subscription:", subErr.message);
  process.exit(1);
}

console.log(`\n✅ Compra simulada com sucesso!\n`);
console.log(`  URL:       https://manha-nova-app.vercel.app/login`);
console.log(`  Email:     ${EMAIL}`);
console.log(`  Senha:     ${PASSWORD}`);
console.log(`  User ID:   ${userId}`);
console.log(`  Subscription ativa por 1 ano\n`);
