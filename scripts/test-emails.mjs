/**
 * Testa os 4 tipos de email via Resend.
 * Uso: node scripts/test-emails.mjs [email]
 */
import { readFileSync } from "fs";
import { Resend } from "resend";

const env = {};
readFileSync(".env.local", "utf-8")
  .split("\n")
  .forEach((line) => {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2];
  });

const TO = process.argv[2] ?? "felipeoliveiraa1@hotmail.com";

if (!env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY nao encontrada em .env.local");
  process.exit(1);
}

function wrap(inner) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Manhã Nova</title></head>
<body style="background:#0f1117;margin:0;padding:40px 0;font-family:Inter,-apple-system,sans-serif">
  <div style="background:#1a1f2e;border:1px solid #2a2f3e;border-radius:12px;max-width:560px;margin:0 auto;padding:40px;color:#f5e5cc">
    <h1 style="color:#e8b968;font-size:28px;font-family:Georgia,serif;font-weight:600;margin:0;letter-spacing:-0.02em">Manhã Nova</h1>
    <p style="color:#8a8a8a;font-size:13px;margin:4px 0 0 0">Sua rotina com Deus, todo dia.</p>
    <hr style="border:0;border-top:1px solid #2a2f3e;margin:24px 0"/>
    ${inner}
    <p style="color:#5a5a5a;font-size:11px;margin:24px 0 0 0">© ${new Date().getFullYear()} Manhã Nova</p>
  </div>
</body></html>`;
}
const btn = (url, text) => `
  <div style="text-align:center;margin:32px 0">
    <a href="${url}" style="background:#e8b968;color:#0f1117;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;display:inline-block">${text}</a>
  </div>`;

const tplWelcome = ({ nome, email, senha, loginUrl }) => wrap(`
  <p style="color:#f5e5cc;font-size:16px;font-weight:600;margin:0 0 12px 0">Oi, ${nome}!</p>
  <p style="color:#d4c5b0;font-size:15px;line-height:24px;margin:0 0 16px 0">
    Obrigado por assinar o <strong>Manhã Nova</strong>. Seu acesso já está liberado. Abaixo seus dados:
  </p>
  <div style="background:#0f1117;border:1px solid #2a2f3e;border-radius:8px;padding:20px 24px;margin:20px 0">
    <p style="color:#8a8a8a;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px 0">Email</p>
    <p style="color:#f5e5cc;font-size:16px;font-family:Menlo,monospace;margin:0 0 16px 0">${email}</p>
    <p style="color:#8a8a8a;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 4px 0">Senha</p>
    <p style="color:#f5e5cc;font-size:16px;font-family:Menlo,monospace;margin:0 0 16px 0">${senha}</p>
  </div>
  ${btn(loginUrl, "Entrar no Manhã Nova")}
  <p style="color:#8a8a8a;font-size:13px;line-height:20px;margin:8px 0">
    Recomendamos trocar a senha no primeiro acesso. Use "Esqueci minha senha" na tela de login.
  </p>
`);

const tplReset = ({ nome, resetUrl }) => wrap(`
  <p style="color:#f5e5cc;font-size:16px;font-weight:600;margin:0 0 12px 0">Oi, ${nome}.</p>
  <p style="color:#d4c5b0;font-size:15px;line-height:24px;margin:0 0 16px 0">
    Recebemos uma solicitação pra redefinir sua senha. O link abaixo vale por 1 hora:
  </p>
  ${btn(resetUrl, "Redefinir senha")}
  <p style="color:#8a8a8a;font-size:13px;line-height:20px;margin:8px 0">
    Se não foi você, pode ignorar — sua senha continua a mesma.
  </p>
`);

const tplCanceled = ({ nome, checkoutUrl }) => wrap(`
  <p style="color:#f5e5cc;font-size:16px;font-weight:600;margin:0 0 12px 0">Oi, ${nome}.</p>
  <p style="color:#d4c5b0;font-size:15px;line-height:24px;margin:0 0 16px 0">
    Sua assinatura foi cancelada. Seus dados ficam salvos caso queira voltar depois.
  </p>
  ${btn(checkoutUrl, "Reativar assinatura")}
  <p style="color:#8a8a8a;font-size:13px;font-style:italic;line-height:20px;margin:8px 0">
    "As misericórdias do Senhor são novas cada manhã" — Lamentações 3:22-23
  </p>
`);

const tplPastDue = ({ nome, checkoutUrl }) => wrap(`
  <p style="color:#f5e5cc;font-size:16px;font-weight:600;margin:0 0 12px 0">Oi, ${nome}.</p>
  <p style="color:#d4c5b0;font-size:15px;line-height:24px;margin:0 0 16px 0">
    Não conseguimos processar seu último pagamento. Seu acesso ainda está ativo, mas atualize seus dados pra não interromper:
  </p>
  ${btn(checkoutUrl, "Atualizar pagamento")}
`);

const resend = new Resend(env.RESEND_API_KEY);
const from = env.RESEND_FROM_EMAIL || "Manhã Nova <onboarding@resend.dev>";

console.log(`\n→ Enviando 4 emails de ${from} para ${TO}\n`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const templates = [
  { label: "1/4 Welcome", subject: "Seu acesso ao Manhã Nova está pronto",
    html: tplWelcome({ nome: "Felipe", email: TO, senha: "ManhaNova2026!",
      loginUrl: "https://manha-nova-app.vercel.app/login" }) },
  { label: "2/4 Password reset", subject: "Redefina sua senha do Manhã Nova",
    html: tplReset({ nome: "Felipe",
      resetUrl: "https://manha-nova-app.vercel.app/auth/callback?code=test&next=/nova-senha" }) },
  { label: "3/4 Subscription canceled", subject: "Sua assinatura do Manhã Nova foi cancelada",
    html: tplCanceled({ nome: "Felipe",
      checkoutUrl: "https://payfast.greenn.com.br/8xzuymm/offer/poAj31" }) },
  { label: "4/4 Payment failed", subject: "Problema no pagamento do Manhã Nova",
    html: tplPastDue({ nome: "Felipe",
      checkoutUrl: "https://payfast.greenn.com.br/8xzuymm/offer/poAj31" }) },
];

for (const t of templates) {
  try {
    const res = await resend.emails.send({ from, to: TO, subject: t.subject, html: t.html });
    if (res.error) {
      console.log(`  ❌ ${t.label}: ${JSON.stringify(res.error)}`);
    } else {
      console.log(`  ✓ ${t.label} enviado (id: ${res.data?.id})`);
    }
  } catch (e) {
    console.log(`  ❌ ${t.label}: ${e.message ?? e}`);
  }
  await sleep(600);
}

console.log(`\n✅ Verifique ${TO}\n`);
