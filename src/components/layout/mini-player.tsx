"use client";

import { usePlayer } from "@/lib/stores/player";
import { Play, Pause, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function MiniPlayer() {
  const { track, playing, toggle, stop } = usePlayer();
  if (!track) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-30 mx-auto w-full max-w-xl px-4",
      )}
    >
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card/95 p-3 shadow-lg backdrop-blur">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-sm font-medium">{track.titulo}</p>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {track.tipo}
          </p>
        </div>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pausar" : "Tocar"}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-primary/40"
        >
          {playing ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </button>
        <button
          type="button"
          onClick={stop}
          aria-label="Fechar player"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:border-destructive/40 hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
