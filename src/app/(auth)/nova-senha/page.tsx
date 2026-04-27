import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { novaSenhaAction } from "@/lib/auth/actions";
import { createClient } from "@/lib/supabase/server";

export default async function NovaSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  // Verifica que tem sessao (usuario chegou via link de recuperacao)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div>
        <h1 className="font-serif text-2xl font-semibold">Link inválido</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Seu link expirou ou já foi usado. Solicite um novo.
        </p>
        <Link
          href="/esqueci-senha"
          className="mt-6 inline-block text-sm text-primary hover:underline"
        >
          ← Solicitar novo link
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Nova senha</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Defina uma senha pra continuar acessando o Manhã Nova.
      </p>

      {params.error && (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          {params.error}
        </p>
      )}

      <form action={novaSenhaAction} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="senha">Nova senha</Label>
          <PasswordInput
            id="senha"
            name="senha"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <span className="text-[11px] text-muted-foreground">
            Mínimo de 8 caracteres.
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmar">Confirmar nova senha</Label>
          <PasswordInput
            id="confirmar"
            name="confirmar"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>
        <SubmitButton size="lg" className="mt-2" pendingLabel="Salvando...">
          Salvar senha
        </SubmitButton>
      </form>
    </div>
  );
}
