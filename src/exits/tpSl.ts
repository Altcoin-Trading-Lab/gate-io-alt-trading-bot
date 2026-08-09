export function exitReason(entry: number, mid: number, tpPct: number, slPct: number, held: number, maxHold: number): "tp" | "sl" | "time" | null {
  const ret = ((mid - entry) / entry) * 100;
  if (ret >= tpPct) return "tp";
  if (ret <= -slPct) return "sl";
  if (held >= maxHold) return "time";
  return null;
}
