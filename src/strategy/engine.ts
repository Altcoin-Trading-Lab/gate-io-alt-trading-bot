import type { Settings } from "../config/schema.js";
import type { Broker } from "../broker/types.js";
import { scanPaperListings } from "../listings/newListingScanner.js";
import { liquidityOk } from "../liquidity/guards.js";
import { exitReason } from "../exits/tpSl.js";

export type LoopResult = { action: string; reason: string; pnlUsd: number };

export function createStrategy(settings: Settings, broker: Broker) {
  const st = settings.strategy as {
    maxBuyUsd: number; minLiquidityUsd: number; maxHoldLoops: number; takeProfitPct: number; stopLossPct: number; blacklist: string[];
  };
  let open: { symbol: string; entry: number; held: number } | null = null;

  return {
    async step(): Promise<LoopResult> {
      if (open) {
        const mid = await broker.getMid(settings.symbol);
        open.held += 1;
        const why = exitReason(open.entry, mid, st.takeProfitPct, st.stopLossPct, open.held, st.maxHoldLoops);
        if (why) {
          const fill = await broker.place({ symbol: settings.symbol, side: "sell", amountUsd: st.maxBuyUsd, tag: why, reduceOnly: true });
          const pnl = ((mid - open.entry) / open.entry) * st.maxBuyUsd - fill.feeUsd;
          open = null;
          return { action: "sell", reason: `exit_${why}`, pnlUsd: pnl };
        }
        return { action: "hold", reason: "position_open", pnlUsd: 0 };
      }
      const cands = scanPaperListings(st.blacklist ?? []);
      const pick = cands.find((c) => liquidityOk(c.liquidityUsd, st.minLiquidityUsd));
      if (!pick) return { action: "hold", reason: "no_listing", pnlUsd: 0 };
      const mid = await broker.getMid(settings.symbol);
      const fill = await broker.place({ symbol: settings.symbol, side: "buy", amountUsd: st.maxBuyUsd, tag: pick.symbol });
      open = { symbol: pick.symbol, entry: mid, held: 0 };
      return { action: "buy", reason: `listing:${pick.symbol}`, pnlUsd: -fill.feeUsd };
    },
  };
}
