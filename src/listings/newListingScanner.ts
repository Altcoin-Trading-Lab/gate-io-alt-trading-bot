export type ListingCandidate = { symbol: string; liquidityUsd: number; name: string; ageMin: number };

export function scanPaperListings(blacklist: string[]): ListingCandidate[] {
  const pool = [
    { symbol: "PEPE2/USDT", liquidityUsd: 120000, name: "PEPE2", ageMin: 12 },
    { symbol: "SCAM/USDT", liquidityUsd: 500000, name: "SCAM", ageMin: 3 },
    { symbol: "AI100/USDT", liquidityUsd: 95000, name: "AI100", ageMin: 40 },
    { symbol: "THIN/USDT", liquidityUsd: 12000, name: "THIN", ageMin: 8 },
  ];
  return pool.filter((c) => !blacklist.some((b) => c.name.includes(b)));
}
