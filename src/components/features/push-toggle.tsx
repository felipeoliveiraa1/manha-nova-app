"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) out[i] = raw.charCodeAt(i);
  return out;
}

export function PushToggle() {
  const [supported, setSupported] = useState(false);
  const [subbed, setSubbed] = useState<PushSubscription | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(true);
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((s) => setSubbed(s));
  }, []);

  async function subscribe() {
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
      toast.error("VAPID public key não configurada.");
      return;
    }
    setPending(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        ),
      });
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      if (!res.ok) {
        toast.error("Falha ao registrar no servidor.");
        return;
      }
      setSubbed(sub);
      toast.success("Notificações ativadas.");
    } catch {
      toast.error("Permissão negada ou erro.");
    } finally {
      setPending(false);
    }
  }

  async function unsubscribe() {
    if (!subbed) return;
    setPending(true);
    try {
      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subbed.endpoint }),
      });
      await subbed.unsubscribe();
      setSubbed(null);
      toast.success("Notificações desativadas.");
    } finally {
      setPending(false);
    }
  }

  if (!supported) {
    return (
      <p className="text-xs text-muted-foreground">
        Seu navegador não suporta notificações push. No iOS, instale o app na
        tela inicial.
      </p>
    );
  }

  return subbed ? (
    <Button onClick={unsubscribe} variant="outline" disabled={pending}>
      <BellOff className="h-4 w-4" /> Desativar notificações
    </Button>
  ) : (
    <Button onClick={subscribe} disabled={pending}>
      <Bell className="h-4 w-4" /> Ativar notificações
    </Button>
  );
}
