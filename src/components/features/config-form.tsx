"use client";

import { useState, useTransition, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { salvarConfigAction } from "@/lib/auth/actions-app";
import { toast } from "sonner";
import { Moon, Sun, Bell, BookOpen } from "lucide-react";
import { PushToggle } from "@/components/features/push-toggle";

const VERSOES = [
  { id: "ACF", nome: "ACF — Almeida Corrigida Fiel" },
];

export function ConfigForm({
  initial,
}: {
  initial: {
    tema: "dark" | "light";
    horario: string | null;
    versao: string;
  };
}) {
  const { setTheme, theme } = useTheme();
  const [tema, setTema] = useState<"dark" | "light">(initial.tema);
  const [horario, setHorario] = useState(initial.horario ?? "");
  const [versao, setVersao] = useState(initial.versao);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    // sincroniza tema local se mudou no sistema
    if (theme && (theme === "dark" || theme === "light")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTema(theme as "dark" | "light");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function aplicarTema(t: "dark" | "light") {
    setTema(t);
    setTheme(t);
  }

  function onSave() {
    const fd = new FormData();
    fd.set("tema", tema);
    fd.set("horario", horario);
    fd.set("versao", versao);
    startTransition(async () => {
      const res = await salvarConfigAction(fd);
      if (res.ok) {
        toast.success(
          res.preview ? "Salvo (preview — não persiste)" : "Configurações salvas",
        );
      } else {
        toast.error(res.error ?? "Erro ao salvar.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Tema
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => aplicarTema("dark")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-md border py-3 text-sm transition",
                tema === "dark"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/40",
              )}
            >
              <Moon className="h-4 w-4" /> Dark
            </button>
            <button
              type="button"
              onClick={() => aplicarTema("light")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-md border py-3 text-sm transition",
                tema === "light"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-primary/40",
              )}
            >
              <Sun className="h-4 w-4" /> Light
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Bell className="h-3.5 w-3.5" />
            Lembrete diário
          </div>
          <p className="text-xs text-muted-foreground">
            Horário em que você quer receber a notificação do devocional.
          </p>
          <Input
            type="time"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
          />
          <div className="pt-2">
            <PushToggle />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            Versão da Bíblia preferida
          </div>
          <div className="flex flex-col gap-2">
            {VERSOES.map((v) => (
              <label
                key={v.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition",
                  versao === v.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/40",
                )}
              >
                <input
                  type="radio"
                  name="versao"
                  checked={versao === v.id}
                  onChange={() => setVersao(v.id)}
                  className="accent-primary"
                />
                {v.nome}
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button size="lg" onClick={onSave} disabled={pending}>
        {pending ? "Salvando..." : "Salvar configurações"}
      </Button>
    </div>
  );
}
