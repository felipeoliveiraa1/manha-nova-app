"use client";

import { useState, useTransition } from "react";
import {
  toggleHighlightAction,
  toggleBookmarkAction,
  salvarNotaAction,
} from "@/lib/auth/actions-app";
import { toast } from "sonner";
import {
  Highlighter,
  Bookmark,
  BookmarkCheck,
  Pencil,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CORES: { id: string; label: string; className: string }[] = [
  { id: "gold", label: "Dourado", className: "bg-amber-400/70" },
  { id: "blue", label: "Azul", className: "bg-blue-400/70" },
  { id: "green", label: "Verde", className: "bg-emerald-400/70" },
  { id: "pink", label: "Rosa", className: "bg-pink-400/70" },
  { id: "purple", label: "Roxo", className: "bg-purple-400/70" },
];

export function VerseItem({
  verseId,
  versiculo,
  texto,
  initialCor,
  initialBookmarked,
  initialNotes,
}: {
  verseId: string;
  versiculo: number;
  texto: string;
  initialCor?: string;
  initialBookmarked: boolean;
  initialNotes: { id: string; texto: string }[];
}) {
  const [cor, setCor] = useState<string | undefined>(initialCor);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [notes, setNotes] = useState(initialNotes);
  const [menu, setMenu] = useState(false);
  const [writing, setWriting] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [pending, startTransition] = useTransition();

  const corClass =
    cor === "gold"
      ? "bg-amber-400/20"
      : cor === "blue"
        ? "bg-blue-400/20"
        : cor === "green"
          ? "bg-emerald-400/20"
          : cor === "pink"
            ? "bg-pink-400/20"
            : cor === "purple"
              ? "bg-purple-400/20"
              : "";

  function marcar(novaCor: string) {
    const previa = cor;
    setCor(cor === novaCor ? undefined : novaCor);
    const fd = new FormData();
    fd.set("verse_id", verseId);
    fd.set("cor", novaCor);
    startTransition(async () => {
      const res = await toggleHighlightAction(fd);
      if (!res.ok) {
        setCor(previa);
        toast.error(res.error ?? "Erro ao marcar.");
      }
    });
    setMenu(false);
  }

  function favoritar() {
    const prev = bookmarked;
    setBookmarked(!prev);
    const fd = new FormData();
    fd.set("verse_id", verseId);
    startTransition(async () => {
      const res = await toggleBookmarkAction(fd);
      if (!res.ok) {
        setBookmarked(prev);
        toast.error(res.error ?? "Erro.");
      }
    });
    setMenu(false);
  }

  function salvarNota(e: React.FormEvent) {
    e.preventDefault();
    if (!noteText.trim()) return;
    const fd = new FormData();
    fd.set("verse_id", verseId);
    fd.set("texto", noteText);
    startTransition(async () => {
      const res = await salvarNotaAction(fd);
      if (res.ok) {
        setNotes([...notes, { id: crypto.randomUUID(), texto: noteText }]);
        setNoteText("");
        setWriting(false);
        toast.success(res.preview ? "Nota salva (preview)" : "Nota salva");
      } else {
        toast.error(res.error ?? "Erro.");
      }
    });
  }

  return (
    <div className="group relative" id={`v${versiculo}`}>
      <p
        onClick={() => setMenu((m) => !m)}
        className={cn(
          "flex cursor-pointer gap-2 rounded-md px-1 py-0.5 transition",
          corClass,
        )}
      >
        <sup className="mt-0.5 shrink-0 font-sans text-[10px] font-semibold text-primary">
          {versiculo}
          {bookmarked && (
            <BookmarkCheck className="ml-0.5 inline h-3 w-3 text-primary" />
          )}
        </sup>
        <span>{texto}</span>
      </p>

      {/* Inline notes */}
      {notes.length > 0 && (
        <div className="mt-1 ml-4 space-y-1 border-l-2 border-primary/30 pl-3">
          {notes.map((n) => (
            <p
              key={n.id}
              className="font-sans text-[12px] italic text-muted-foreground"
            >
              {n.texto}
            </p>
          ))}
        </div>
      )}

      {/* Action menu */}
      {menu && (
        <div className="relative mt-1 flex flex-wrap items-center gap-1 rounded-lg border border-border bg-card p-2 shadow-md">
          <span className="mr-1 pl-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            <Highlighter className="inline h-3 w-3" /> Cor:
          </span>
          {CORES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => marcar(c.id)}
              aria-label={c.label}
              className={cn(
                "h-5 w-5 rounded-full border border-white/20 transition hover:scale-110",
                c.className,
                cor === c.id && "ring-2 ring-primary ring-offset-1 ring-offset-background",
              )}
            />
          ))}
          <span className="mx-1 h-4 border-r border-border" />
          <button
            type="button"
            onClick={favoritar}
            aria-label="Favoritar"
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] hover:bg-accent"
          >
            {bookmarked ? (
              <BookmarkCheck className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Bookmark className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setWriting((w) => !w)}
            aria-label="Nota"
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] hover:bg-accent"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setMenu(false)}
            aria-label="Fechar"
            className="ml-auto flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {writing && (
        <form onSubmit={salvarNota} className="mt-2 flex flex-col gap-2">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Escreva sua nota sobre esse versículo..."
            autoFocus
            className="min-h-[72px] w-full resize-none rounded-md border border-input bg-background p-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setWriting(false);
                setNoteText("");
              }}
              className="rounded-md px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending || !noteText.trim()}
              className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground disabled:opacity-60"
            >
              {pending ? "Salvando..." : "Salvar nota"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
