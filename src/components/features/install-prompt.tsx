"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X, Share } from "lucide-react";

type BeforeInstallEvent = Event & {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "biblia-install-dismissed-v1";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [show, setShow] = useState(false);
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = localStorage.getItem(DISMISS_KEY);
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as Window & { MSStream?: unknown }).MSStream;
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsIOS(ios);
    setStandalone(isStandalone);

    if (!isStandalone && !dismissed) {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferred(e as BeforeInstallEvent);
        setShow(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      if (ios) setTimeout(() => setShow(true), 3000);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  if (!show || standalone) return null;

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setShow(false);
  }

  async function install() {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    setShow(false);
  }

  return (
    <div className="fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 mx-auto w-full max-w-xl px-4">
      <Card className="border-primary/30 shadow-xl">
        <CardContent className="flex items-start gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Download className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">Instale o Manhã Nova</p>
            {isIOS ? (
              <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                Toque em
                <span className="inline-flex items-center gap-0.5 rounded border border-border px-1">
                  <Share className="h-3 w-3" />
                  Compartilhar
                </span>
                e depois em <b>&ldquo;Adicionar à Tela de Início&rdquo;</b>.
              </p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                Acesso rápido, notificações e offline.
              </p>
            )}
          </div>
          {!isIOS && deferred && (
            <Button size="sm" onClick={install}>
              Instalar
            </Button>
          )}
          <button
            type="button"
            onClick={dismiss}
            aria-label="Fechar"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
