export function estSlippageBps(orderUsd: number, liqUsd: number): number {
  if (liqUsd <= 0) return 10_000;
  return Math.min(500, (orderUsd / liqUsd) * 10_000);
}
