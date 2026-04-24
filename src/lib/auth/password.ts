import crypto from "crypto";

/**
 * Gera senha legivel e segura para envio por email.
 * Evita caracteres ambiguos (0/O/1/l/I) e usa alfabeto A-Z, a-z, 2-9.
 *
 * 10 chars no alfabeto de 58 = ~58 bits de entropia — forte o bastante
 * pra acesso inicial. Usuario pode trocar em /configuracoes depois.
 */
export function generateReadablePassword(length = 10): string {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = crypto.randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}
