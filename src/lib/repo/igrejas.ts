import { createClientOrNull } from "@/lib/supabase/server";
import { IGREJAS_SEED } from "@/lib/seed/igrejas";
import type { Igreja } from "@/lib/supabase/types";

export async function listIgrejas(lat?: number, lng?: number): Promise<Igreja[]> {
  const supabase = await createClientOrNull();
  let rows: Igreja[] = IGREJAS_SEED;
  if (supabase) {
    const { data } = await supabase
      .from("igrejas")
      .select("*")
      .order("nome", { ascending: true });
    if (data && data.length > 0) rows = data as Igreja[];
  }
  if (lat == null || lng == null) return rows;
  return rows
    .map((r) => ({ ...r, _dist: haversineKm(lat, lng, r.lat, r.lng) }))
    .sort((a, b) => (a._dist ?? Infinity) - (b._dist ?? Infinity));
}

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number | null,
  lng2: number | null,
): number | null {
  if (lat2 == null || lng2 == null) return null;
  const R = 6371;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) *
      Math.cos(rad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
const rad = (d: number) => (d * Math.PI) / 180;
