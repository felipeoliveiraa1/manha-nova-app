import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/lib/auth/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; just_registered?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Entrar</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Bem-vindo de volta. Continue sua jornada.
      </p>

      {params.just_registered && (
        <p className="mt-4 rounded-md border border-primary/30 bg-primary/10 p-3 text-xs text-primary">
          Cadastro realizado. Confirme seu email e faça login.
        </p>
      )}
      {params.error && (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          {params.error}
        </p>
      )}

      <form action={loginAction} className="mt-6 flex flex-col gap-4">
        <input type="hidden" name="next" value={params.next ?? "/home"} />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" name="password" type="password" required autoComplete="current-password" />
        </div>
        <Button type="submit" size="lg" className="mt-2">
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
