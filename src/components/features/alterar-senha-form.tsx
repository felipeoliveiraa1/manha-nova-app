"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { alterarSenhaAction } from "@/lib/auth/actions";
import { toast } from "sonner";
import { KeyRound, Loader2 } from "lucide-react";

export function AlterarSenhaForm() {
  const [aberto, setAberto] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [pending, startTransition] = useTransition();

  function reset() {
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmar("");
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("senha_atual", senhaAtual);
    fd.set("nova_senha", novaSenha);
    fd.set("confirmar", confirmar);
    startTransition(async () => {
      const res = await alterarSenhaAction(fd);
      if (res.ok) {
        toast.success("Senha alterada com sucesso");
        reset();
        setAberto(false);
      } else {
        toast.error(res.error ?? "Erro ao alterar senha.");
      }
    });
  }

  if (!aberto) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <KeyRound className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Senha</p>
            <p className="text-xs text-muted-foreground">
              Trocar a senha de acesso
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAberto(true)}
            className="text-xs text-primary hover:underline"
          >
            Alterar
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <KeyRound className="h-3.5 w-3.5" />
          Alterar senha
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="senha_atual">Senha atual</Label>
            <PasswordInput
              id="senha_atual"
              name="senha_atual"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nova_senha">Nova senha</Label>
            <PasswordInput
              id="nova_senha"
              name="nova_senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
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
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <div className="mt-2 flex gap-2">
            <Button type="submit" disabled={pending} size="sm">
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar nova senha"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pending}
              onClick={() => {
                reset();
                setAberto(false);
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
