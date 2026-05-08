/**
 * Aplica a migration 0009_user_feature_uses.sql no Supabase em prod.
 * Roda: `npx tsx scripts/apply-migration-0009.ts`
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("env ausente");
  process.exit(1);
}

const SQL_PATH = path.join(
  process.cwd(),
  "supabase",
  "migrations",
  "0009_user_feature_uses.sql",
);

async function main() {
  const sql = readFileSync(SQL_PATH, "utf-8");
  console.log(`Aplicando migration de ${SQL_PATH}...`);

  // supabase-js nao tem .raw() direto. Usa a REST PostgreSQL via fetch.
  const res = await fetch(`${url}/rest/v1/rpc/exec`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey!,
      Authorization: `Bearer ${serviceKey!}`,
    },
    body: JSON.stringify({ sql }),
  });

  if (!res.ok) {
    console.error(`Falha (${res.status}): ${await res.text()}`);
    console.log(
      "\n→ FALLBACK: copie o SQL abaixo e cole no Supabase Dashboard → SQL Editor:\n",
    );
    console.log(sql);
    process.exit(1);
  }

  console.log("✓ Migration aplicada");
  void createClient(url!, serviceKey!);
}

main().catch((e) => {
  console.error("Erro:", e);
  process.exit(1);
});
