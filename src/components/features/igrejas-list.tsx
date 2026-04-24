"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import type { Igreja } from "@/lib/supabase/types";

export function IgrejasList({ igrejas }: { igrejas: Igreja[] }) {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [pending, setPending] = useState(false);

  const ordered = useMemo(() => {
    if (!pos) return igrejas;
    const rad = (d: number) => (d * Math.PI) / 180;
    const R = 6371;
    const hav = (a: Igreja) => {
      if (a.lat == null || a.lng == null) return Infinity;
      const dLat = rad(a.lat - pos.lat);
      const dLng = rad(a.lng - pos.lng);
      const x =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(rad(pos.lat)) *
          Math.cos(rad(a.lat)) *
          Math.sin(dLng / 2) ** 2;
      return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    };
    return [...igrejas]
      .map((i) => ({ ...i, _dist: hav(i) }))
      .sort((a, b) => (a._dist ?? Infinity) - (b._dist ?? Infinity));
  }, [pos, igrejas]);

  function getLocation() {
    if (!("geolocation" in navigator)) return;
    setPending(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
        setPending(false);
      },
      () => setPending(false),
      { timeout: 10_000 },
    );
  }

  return (
    <>
      {!pos && (
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col items-start gap-3 p-5">
            <div className="flex items-center gap-2 text-primary">
              <Navigation className="h-4 w-4" />
              <p className="text-sm font-medium">Ative sua localização</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Ordena a lista por distância a partir de onde você está.
            </p>
            <Button onClick={getLocation} disabled={pending} size="sm">
              {pending ? "Localizando..." : "Compartilhar localização"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {ordered.map((i) => (
          <Card key={i.id}>
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-serif text-base font-semibold">
                    {i.nome}
                  </h3>
                  {i.denominacao && (
                    <p className="text-[11px] text-muted-foreground">
                      {i.denominacao}
                    </p>
                  )}
                </div>
                {(i as Igreja & { _dist?: number })._dist !== undefined &&
                  (i as Igreja & { _dist?: number })._dist !== Infinity && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                      {(i as Igreja & { _dist?: number })._dist!.toFixed(1)} km
                    </span>
                  )}
              </div>
              {i.endereco && (
                <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                  {i.endereco}
                  {i.cidade && `, ${i.cidade}`}
                  {i.estado && ` — ${i.estado}`}
                </p>
              )}
              {i.website && (
                <a
                  href={i.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Site <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
