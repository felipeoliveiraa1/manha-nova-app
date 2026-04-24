"use client";

import { create } from "zustand";

export type PlayerTrack = {
  id: string;
  titulo: string;
  tipo: "devocional" | "oracao" | "ambiente" | "biblia";
  duracao_seg: number | null;
  url: string;
  capa_url: string | null;
};

type State = {
  track: PlayerTrack | null;
  playing: boolean;
  playTrack: (t: PlayerTrack) => void;
  toggle: () => void;
  stop: () => void;
};

export const usePlayer = create<State>((set) => ({
  track: null,
  playing: false,
  playTrack: (t) => set({ track: t, playing: true }),
  toggle: () => set((s) => ({ playing: !s.playing })),
  stop: () => set({ track: null, playing: false }),
}));
