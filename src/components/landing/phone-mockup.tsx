"use client";

import { motion } from "motion/react";
import { Flame, BookOpen, Target, CheckCircle2 } from "lucide-react";

/**
 * Mockup de iPhone em CSS puro, mostrando uma versao simplificada da home
 * do app. Sem imagens externas — tudo SVG + divs.
 */
export function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="relative mx-auto w-full max-w-[320px]"
    >
      {/* Glow background breathing */}
      <motion.div
        aria-hidden
        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -inset-12 rounded-full bg-primary/30 blur-3xl"
      />

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Phone frame */}
        <div className="relative aspect-[9/19] rounded-[44px] border-[10px] border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/60 ring-1 ring-white/5">
          {/* Notch */}
          <div className="absolute top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-zinc-950" />

          {/* Screen */}
          <div className="flex h-full flex-col overflow-hidden rounded-[32px] bg-linear-to-br from-[#0f1117] via-[#1a1f2e] to-[#1f1b13]">
            <div className="h-10 shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-3 pb-3">
              <div>
                <p className="text-[9px] text-zinc-500">Bom dia,</p>
                <p className="font-serif text-sm font-semibold text-zinc-100">
                  Yan
                </p>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[9px] font-medium text-amber-400">
                <Flame className="h-2.5 w-2.5" />7 dias
              </div>
            </div>

            {/* Cards area */}
            <div className="flex-1 space-y-2 overflow-hidden px-4 pb-4">
              {/* Versiculo */}
              <div className="rounded-lg border border-amber-500/20 bg-linear-to-br from-zinc-900 to-amber-900/10 p-3">
                <p className="mb-1 text-[7px] uppercase tracking-wider text-amber-400">
                  Versículo do dia
                </p>
                <p className="font-serif text-[10px] leading-tight text-zinc-200">
                  &ldquo;O Senhor é o meu pastor, nada me faltará.&rdquo;
                </p>
                <p className="mt-1 text-[7px] text-zinc-500">Salmos 23:1</p>
              </div>

              {/* Devocional */}
              <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500/15 text-amber-400">
                  <Flame className="h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[7px] uppercase text-zinc-500">
                    Devocional
                  </p>
                  <p className="truncate text-[9px] font-semibold text-zinc-200">
                    O privilégio da oração
                  </p>
                </div>
                <div className="rounded bg-amber-500 px-2 py-1 text-[7px] font-semibold text-zinc-900">
                  Ler
                </div>
              </div>

              {/* Missao */}
              <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[7px] uppercase text-zinc-500">
                    Missão do dia
                  </p>
                  <p className="truncate text-[9px] text-zinc-200">
                    Envie gratidão
                  </p>
                </div>
                <div className="h-5 w-5 rounded-full border border-zinc-700" />
              </div>

              {/* Oracao box */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5">
                <p className="text-[7px] uppercase text-zinc-500">Oração</p>
                <p className="mt-1 text-[8px] italic text-zinc-500">
                  Fale com Deus...
                </p>
              </div>

              {/* Progresso */}
              <div className="grid grid-cols-3 divide-x divide-zinc-800 rounded-lg border border-zinc-800 bg-zinc-900/60 py-2">
                {[
                  { v: "7", l: "Dias" },
                  { v: "3", l: "Missões" },
                  { v: "142", l: "Min" },
                ].map((s) => (
                  <div key={s.l} className="text-center">
                    <p className="font-serif text-[11px] font-semibold text-amber-400">
                      {s.v}
                    </p>
                    <p className="text-[7px] uppercase tracking-wider text-zinc-500">
                      {s.l}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom nav */}
            <div className="flex items-center justify-around border-t border-zinc-800 bg-zinc-950/80 px-2 py-2 backdrop-blur">
              {[
                { I: Flame, active: true, l: "Hoje" },
                { I: BookOpen, active: false, l: "Bíblia" },
                { I: Target, active: false, l: "Missões" },
              ].map(({ I, active, l }) => (
                <div key={l} className="flex flex-col items-center gap-0.5">
                  <I
                    className={
                      active
                        ? "h-3 w-3 text-amber-400"
                        : "h-3 w-3 text-zinc-500"
                    }
                  />
                  <span
                    className={
                      active
                        ? "text-[7px] text-amber-400"
                        : "text-[7px] text-zinc-500"
                    }
                  >
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lateral button highlights (silence/volume) */}
        <div className="absolute -left-[14px] top-28 h-16 w-1 rounded-l-sm bg-zinc-800" />
        <div className="absolute -left-[14px] top-52 h-10 w-1 rounded-l-sm bg-zinc-800" />
        <div className="absolute -right-[14px] top-36 h-20 w-1 rounded-r-sm bg-zinc-800" />
      </motion.div>
    </motion.div>
  );
}
