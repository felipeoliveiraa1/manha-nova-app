import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { esqueciSenhaAction } from "@/lib/auth/actions";

export default async function EsqueciSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const params = await searchParams;

  if (params.sent) {
    return (
      <div>
        <h1 className="font-serif text-2xl font-semibold">Verifique seu email</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Se o email estiver cadastrado, você receberá um link pra redefinir
          sua senha em instantes.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm text-primary hover:underline"
        >
          ← Voltar ao login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Esqueci minha senha</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Informe seu email — vamos enviar um link pra você redefinir.
      </p>

      {params.error && (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          {params.error}
        </p>
      )}

      <form action={esqueciSenhaAction} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <Button type="submit" size="lg" className="mt-2">
          Enviar link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">
          ← Voltar ao login
        </Link>
      </p>
    </div>
  );
}
