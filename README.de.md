<p align="center">
  <img src="docs/banner.jpg" alt="Gate.io Alt Trading Bot" width="100%" />
</p>

# Gate.io Alt Trading Bot

<p align="center">
  <strong>Alt breadth with spot/futures dual-mode execution</strong><br/>
  gate · paper + live · risk-gated · MIT
</p>

<p align="center">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" />
  <img alt="CCXT" src="https://img.shields.io/badge/Execution-CCXT-111111" />
  <img alt="Modes" src="https://img.shields.io/badge/Paper%20%2B%20Live-ready-success" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
</p>

<p align="center">
  Sprachen: [English](README.md) · [中文](README.zh.md) · **Deutsch** · [Español](README.es.md)
</p>

> **Suchbegriffe:** gate.io trading bot · gateio bot · gate.io futures · altcoin trading bot

---

## Performance-Snapshot

Demo-Analytics aus dem statischen Dashboard (`npm run dashboard`). Banner und Strategie-Diagramme bleiben erhalten.

<p align="center">
  <img src="docs/dashboard.jpg" alt="Gate AltDesk — Performance-Dashboard" width="100%" />
</p>

<p align="center">
  <img src="docs/pnl.jpg" alt="Gate AltDesk — PnL- / Equity-Ansicht" width="100%" />
</p>

<p align="center">
  <img src="docs/analytics.jpg" alt="Gate AltDesk — Analytics-Streifen" width="100%" />
</p>

---

## Projekt-Workflow

Klonen → konfigurieren → Paper → Credentials → Live. Risk immer an.

```mermaid
flowchart LR
  A[Repo klonen] --> B[npm install]
  B --> C[settings.json]
  C --> D[typecheck + test]
  D --> E[npm run paper]
  E --> F{Paper OK?}
  F -->|Ja| G[.env füllen]
  F -->|Tunen| C
  G --> H[npm run live --confirm-live]
  H --> I[Monitor / Risk]
  I -->|Limit| J[Halt]
```

| | |
|--|--|
| `npm run paper` | Zuerst Paper — keine API-Keys |
| `npm run dashboard` | Lokales Analytics-Dashboard öffnen (statisch) |
| `npm run live` | Benötigt `--confirm-live` + API-Credentials |

---

## Platform-Fit

| | |
|--|--|
| Venue | gate |
| Märkte | both |
| Edge | Alt breadth with spot/futures dual-mode execution |
| Execution | CCXT Live (Sandbox) + Paper |

---

## Handelsstrategie

MEXC/Gate.io stehen für **Alt-Breadth & Early Listings**. Der Bot scannt, filtert dünne Books/Blacklists, kauft winzig und exit’t mechanisch (TP/SL/Zeit). Kontrolliertes Lotterieticket — kein Core-Portfolio.

### So funktioniert es
- **Listing-Scanner** mit Liquidität/Alter.
- **Liquidity Guard** (`minLiquidityUsd`).
- **Blacklist**.
- **Tiny Entry** (`maxBuyUsd`).
- **Mechanische Exits**.
- **Gate Dual-Mode** Helper für Spot/Swap.

### Wann der Edge erscheint
**Bestes Regime:** hohe Listing-Velocity; nur Risikokapital.

### Wann es scheitert
**Scheitert bei:** Rugs, Wash-Liquidity, Spreads > TP.

### Schlüsselparameter (`settings.json`)
- `maxBuyUsd`/`minLiquidityUsd`
- TP/SL/Hold
- `blacklist`

### Strategiespezifische Risiken
- Die meisten Listing-Trades verlieren.
- Keine Withdraw-Rechte am API-Key.


---

## Strategie-Diagramm

```mermaid
flowchart TD
  S[Listing Scanner] --> L{Liquidität OK?}
  L -->|Nein| R[Reject]
  L -->|Ja| B[Tiny Buy]
  B --> E{TP / SL / Zeit}
  E --> X[Exit]
  X --> Risk[Risk]
```

---

## Architektur

```
src/
  config/     Zod settings + env loader
  strategy/   venue-specific engine
  broker/     paper + CCXT live adapters
  risk/       daily loss / drawdown / caps
  app/        runtime loop
  alts/
  dual/
  liquidity/
```

---

## Schnellstart

```bash
cd gate-io-alt-trading-bot
npm install
npm run typecheck
npm test
npm run paper
```

### Live

```bash
cp .env.example .env
# set GATE_API_KEY + GATE_API_SECRET
# optional GATE_PASSWORD / PASSPHRASE
npm run live
```

---

## Konfiguration

`settings.json` — strategy + risk + paper/live flags.  
`.env` — secrets only (see `.env.example`).

---

## Risiko & Sicherheit

- Live refuses without `--confirm-live` and API credentials
- Prefer `live.sandbox: true` until proven
- Disable withdrawals on exchange API keys
- Daily loss / drawdown / notional caps + kill switch

---

## Haftungsausschluss

MIT-Bildungssoftware — **keine Finanzberatung**. CEX-Trading kann Totalverlust bedeuten.

## Lizenz

MIT — siehe [LICENSE](LICENSE).
