"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ActionResult = {
  ok?: boolean;
  needsAuth?: boolean;
  error?: string;
  preview?: boolean;
};

/**
 * Hook pra lidar com retornos de server actions de forma uniforme.
 * Se a action retornar { needsAuth: true } (guest tentando salvar),
 * mostra toast e redireciona pra /cadastro.
 *
 * Uso no client:
 *   const handle = useActionHandler();
 *   const res = await minhaAction(fd);
 *   if (handle(res, "Concluído!")) { ... }
 */
export function useActionHandler() {
  const router = useRouter();

  return function handle(res: ActionResult, successMessage?: string): boolean {
    if (res.needsAuth) {
      toast.info("Crie sua conta grátis pra salvar e ganhar pontos.", {
        action: {
          label: "Cadastrar",
          onClick: () => router.push("/cadastro"),
        },
      });
      router.push("/cadastro");
      return false;
    }
    if (res.ok === false) {
      toast.error(res.error ?? "Erro inesperado.");
      return false;
    }
    if (successMessage) {
      toast.success(successMessage);
    }
    return true;
  };
}
