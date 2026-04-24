import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/user";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants, Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/auth/actions";
import { Lock, CreditCard, LogOut } from "lucide-react";

const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL ?? "#";

export default async function AssinaturaExpiradaPage() {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 px-6 py-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Lock className="h-8 w-8" />
      </div>
      <header>
        <h1 className="font-serif text-3xl font-semibold">
          Assinatura inativa
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {user.email ?? ""} — seu acesso ao Manhã Nova está pausado. Reative
          sua assinatura pra continuar sua rotina.
        </p>
      </header>

      <Card className="w-full border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col gap-3 p-5">
          <p className="text-[11px] uppercase tracking-wider text-primary">
            R$29,90 / mês
          </p>
          <p className="text-sm">
            Acesso completo: devocionais, bíblia, IA espiritual, missões,
            trilhas, diário.
          </p>
          <a href={CHECKOUT_URL} className={buttonVariants({ size: "lg" })}>
            <CreditCard className="h-4 w-4" /> Reativar assinatura
          </a>
        </CardContent>
      </Card>

      <div className="flex w-full flex-col gap-2">
        <Link
          href="/perfil"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          Ver meu perfil
        </Link>
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="sm" className="w-full">
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </form>
      </div>
    </div>
  );
}
