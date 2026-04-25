"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayCircle, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function youtubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return m ? m[1] : null;
}

export function VideoPlayer({
  url,
  titulo,
  thumbnail,
  duracao,
  className,
}: {
  url: string;
  titulo: string;
  thumbnail?: string | null;
  duracao?: number | null;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ytId = youtubeId(url);

  return (
    <>
      <div className={cn("overflow-hidden rounded-xl border border-border bg-card", className)}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Assistir ${titulo}`}
          className="group relative block aspect-video w-full bg-linear-to-br from-zinc-900 to-zinc-800"
        >
          {thumbnail && (
            <Image
              src={thumbnail}
              alt={titulo}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              className="object-cover opacity-80"
              unoptimized
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/10">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl">
              <PlayCircle className="h-8 w-8" />
            </span>
          </div>
          {duracao && (
            <span className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-0.5 text-[11px] text-white">
              {formatDuration(duracao)}
            </span>
          )}
        </button>
        <div className="p-5">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Mensagem do dia
          </p>
          <h3 className="font-serif text-base font-semibold leading-tight">
            {titulo}
          </h3>
          <div className="mt-3 flex items-center gap-2">
            <Button size="sm" onClick={() => setOpen(true)}>
              <PlayCircle className="h-4 w-4" /> Assistir
            </Button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Ver no YouTube <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            aria-label="Fechar"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-[calc(1rem+env(safe-area-inset-top))] flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="aspect-video w-full max-w-3xl overflow-hidden rounded-xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            {ytId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
                title={titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            ) : (
              <video
                src={url}
                controls
                autoPlay
                playsInline
                className="h-full w-full"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function formatDuration(seg: number) {
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
