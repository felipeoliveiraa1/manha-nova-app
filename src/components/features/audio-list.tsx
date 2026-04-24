"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import { usePlayer, type PlayerTrack } from "@/lib/stores/player";
import type { Audio } from "@/lib/supabase/types";

export function AudioList({
  sections,
}: {
  sections: { titulo: string; itens: Audio[] }[];
}) {
  const playTrack = usePlayer((s) => s.playTrack);

  function onPlay(a: Audio) {
    const t: PlayerTrack = {
      id: a.id,
      titulo: a.titulo,
      tipo: a.tipo,
      duracao_seg: a.duracao_seg,
      url: a.url,
      capa_url: a.capa_url,
    };
    playTrack(t);
  }

  return (
    <>
      {sections.map((section) => (
        <section key={section.titulo} className="mb-8">
          <h2 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
            {section.titulo}
          </h2>
          <div className="grid gap-3">
            {section.itens.length === 0 && (
              <Card>
                <CardContent className="p-4 text-xs text-muted-foreground">
                  Em breve.
                </CardContent>
              </Card>
            )}
            {section.itens.map((a) => (
              <Card key={a.id}>
                <CardContent className="flex items-center gap-3 p-4">
                  <button
                    type="button"
                    onClick={() => onPlay(a)}
                    aria-label={`Tocar ${a.titulo}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.titulo}</p>
                    {a.descricao && (
                      <p className="text-[11px] text-muted-foreground">
                        {a.descricao}
                      </p>
                    )}
                  </div>
                  {a.duracao_seg && (
                    <span className="text-[11px] text-muted-foreground">
                      {formatDuration(a.duracao_seg)}
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  return `${m} min`;
}
