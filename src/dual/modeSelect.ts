export function pickMarketMode(vol: number): "spot" | "swap" {
  return vol > 0.02 ? "swap" : "spot";
}
