export function listingScore(liqUsd: number, ageMin: number, nameLen: number): number {
  const liq = Math.min(1, liqUsd / 200_000);
  const age = Math.min(1, ageMin / 60);
  const name = nameLen >= 3 && nameLen <= 12 ? 1 : 0.5;
  return liq * 0.5 + age * 0.3 + name * 0.2;
}
