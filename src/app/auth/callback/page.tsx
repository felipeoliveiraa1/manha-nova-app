"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ERROR_MSG = "Link expirado ou inválido. Solicite novo email.";

function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/home";
  return raw;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const next = safeNext(searchParams.get("next"));
    const code = searchParams.get("code");

    async function process() {
      const supabase = createClient();

      const hashRaw = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(hashRaw);
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error: setErr } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (setErr) {
          setError(ERROR_MSG);
          window.location.replace(`/login?error=${encodeURIComponent(ERROR_MSG)}`);
          return;
        }
        window.location.replace(next);
        return;
      }

      if (code) {
        const { error: exErr } = await supabase.auth.exchangeCodeForSession(code);
        if (exErr) {
          setError(ERROR_MSG);
          window.location.replace(`/login?error=${encodeURIComponent(ERROR_MSG)}`);
          return;
        }
        window.location.replace(next);
        return;
      }

      router.replace("/login");
    }

    process();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">
        {error ?? "Validando link..."}
      </p>
    </div>
  );
}
