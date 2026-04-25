import Link from "next/link";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/lib/auth/actions";

const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL ?? "#";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Entrar</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Use o email e senha que você recebeu após a compra.
      </p>

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
          <div className="flex items-baseline justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link
              href="/esqueci-senha"
              className="text-[11px] text-primary hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>
          <PasswordInput
            id="password"
            name="password"
            required
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" size="lg" className="mt-2">
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ainda não é assinante?{" "}
        <a href={CHECKOUT_URL} className="text-primary hover:underline">
          Assinar agora
        </a>
      </p>
    </div>
  );
}
