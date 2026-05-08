import Link from "next/link";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import { signupAction } from "@/lib/auth/actions";
import { Mail } from "lucide-react";

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; confirme?: string }>;
}) {
  const params = await searchParams;

  // Estado pos-signup: aguardando confirmacao de email
  if (params.confirme) {
    return (
      <div>
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Mail className="h-7 w-7" />
        </div>
        <h1 className="font-serif text-2xl font-semibold">
          Confirme seu email
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enviamos um link de confirmação pra{" "}
          <strong className="text-foreground">{params.confirme}</strong>.
          Clique no link pra ativar sua conta e entrar no app.
        </p>
        <p className="mt-4 rounded-md border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
          Não chegou? Olha a caixa de spam. Se ainda assim não vier em alguns
          minutos, tenta cadastrar de novo.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm text-primary hover:underline"
        >
          ← Voltar pra tela de login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold">Criar conta grátis</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Acesso à Bíblia, devocionais texto, anotações e mais. Cadastro em 30
        segundos.
      </p>

      {params.error && (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          {params.error}
        </p>
      )}

      <form action={signupAction} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            name="nome"
            type="text"
            required
            autoComplete="name"
            placeholder="Como você quer ser chamado?"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Senha</Label>
          <PasswordInput
            id="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <span className="text-[11px] text-muted-foreground">
            Mínimo 8 caracteres.
          </span>
        </div>
        <SubmitButton size="lg" className="mt-2" pendingLabel="Criando...">
          Criar conta grátis
        </SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
