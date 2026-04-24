"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Trash2, Play, Pause } from "lucide-react";
import { salvarOracaoAction } from "@/lib/auth/actions-app";
import { toast } from "sonner";

export function OracaoForm() {
  const [texto, setTexto] = useState("");
  const [pending, startTransition] = useTransition();

  // Estado de gravacao
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  async function iniciarGravacao() {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Seu navegador não suporta gravação de áudio.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      mediaRecRef.current = rec;
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } catch {
      toast.error("Permissão de microfone negada.");
    }
  }

  function pararGravacao() {
    mediaRecRef.current?.stop();
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function descartarAudio() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setElapsed(0);
    setPlaying(false);
  }

  function tocarPausar() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!texto.trim() && !audioUrl) return;
    const fd = new FormData();
    fd.set("texto", texto || "(áudio gravado)");
    // Nota: o arquivo de áudio ainda não é enviado pro Supabase Storage nesta versão
    // — salva só o texto. Upload virá quando houver Storage bucket configurado.
    startTransition(async () => {
      const res = await salvarOracaoAction(fd);
      if (res.ok) {
        toast.success(
          res.preview ? "Oração salva (preview)" : "Oração salva",
        );
        setTexto("");
        descartarAudio();
      } else {
        toast.error(res.error ?? "Erro ao salvar.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <textarea
        name="texto"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder={recording ? "Gravando..." : "Fale com Deus..."}
        disabled={recording}
        className="min-h-[72px] w-full resize-none rounded-md border border-input bg-background p-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
      />

      {audioUrl && (
        <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 p-2">
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setPlaying(false)}
            className="hidden"
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={tocarPausar}
            aria-label={playing ? "Pausar" : "Tocar"}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <span className="flex-1 text-xs text-muted-foreground">
            Áudio gravado ({formatTime(elapsed)})
          </span>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={descartarAudio}
            aria-label="Descartar"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        {recording ? (
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={pararGravacao}
          >
            <Square className="h-4 w-4" /> Parar ({formatTime(elapsed)})
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={iniciarGravacao}
            disabled={!!audioUrl}
          >
            <Mic className="h-4 w-4" /> Gravar áudio
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={pending || (!texto.trim() && !audioUrl) || recording}
        >
          {pending ? "Salvando..." : "Salvar oração"}
        </Button>
      </div>
    </form>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}
