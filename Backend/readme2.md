Awesome — I get your concept. Here’s a crisp, phase-by-phase plan to ship the **Growth Portfolio** first (dynamic table + dynamic top stats, real-time, MongoDB-backed). I’ll also include Phase-1 deliverables (API/data contract) right here so we can start immediately.

# Phases (step-by-step)

**Phase 1 — Contract & Data Model (today’s target)**

* Finalize API responses for the Growth Portfolio (summary + holdings).
* Define WebSocket/SSE event shapes for real-time price/summary updates.
* Lock calculation formulas, rounding, and currencies.

**Phase 2 — UI Scaffolding**

* Build page layout: sidebar → “\$60k Growth Portfolio”.
* Add top stat cards: **Total Value**, **Today’s Change**, **Total Gain/Loss**, **Performance**.
* Add dynamic holdings table (sortable, sticky header, zebra rows, positive/negative coloring, skeleton loaders).

**Phase 3 — Wire to Backend**

* Fetch portfolio summary + holdings from your backend (React Query/SWR).
* Map data to table columns and stat cards.
* Robust loading/empty/error states.

**Phase 4 — Real-Time Updates**

* Connect Socket.IO (or SSE). Live-patch rows + top stats.
* Throttle/merge bursts, animate subtle value changes, flash on updates.

**Phase 5 — MongoDB Storage & History**

* Persist holdings, transactions (if any), and price snapshots.
* Add “last updated” + health indicator; optional intraday chart (mini-sparkline).

**Phase 6 — Polishing**

* Column show/hide, sorting, search, CSV export.
* Mobile responsive, accessibility pass, and performance tweaks.

**Phase 7 — QA & Observability**

* Edge cases (suspended ticker, no prev close, crypto decimals).
* Metrics/logging: API latency, WS drops, cache hits.

---

# Phase 1: API/Data Contract (ready to implement)

## 1) REST Endpoints (from your backend to the frontend)

**GET `/api/portfolios/:id`** → portfolio summary + basic meta

```json
{
  "_id": "growth-60k",
  "name": "Growth Portfolio",
  "baseCurrency": "USD",
  "summary": {
    "totalValue": 6242.03976,
    "todaysChange": -27.72,
    "totalPnL": 3842.03976,
    "performancePct": 160.16832,
    "updatedAt": "2025-08-16T17:10:00Z"
  }
}
```

**GET `/api/portfolios/:id/holdings`** → full table dataset

```json
{
  "holdings": [
    {
      "id": "MSFT",
      "symbol": "MSFT",
      "name": "Microsoft Corp.",
      "type": "equity",
      "quantity": 12,
      "avgCost": 200,
      "cost": 2400,
      "currentPrice": 520.16998,
      "previousClose": 522.47,
      "currentValue": 6242.03976,
      "totalPnL": 3842.03976,
      "totalPnLPct": 160.16832,
      "todaysChange": -27.72,
      "currency": "USD",
      "updatedAt": "2025-08-16T17:10:00Z"
    },
    {
      "id": "SOL",
      "symbol": "SOL",
      "name": "Solana",
      "type": "crypto",
      "quantity": 1.2,
      "avgCost": 150,
      "cost": 180,
      "currentPrice": 150.00,
      "previousClose": 152.31,
      "currentValue": 180.00,
      "totalPnL": 0.00,
      "totalPnLPct": 0.00,
      "todaysChange": -2.77,
      "currency": "USD",
      "updatedAt": "2025-08-16T17:10:00Z"
    }
  ]
}
```

> Notes
> • The backend should already unify Twelve Data (equities) + CoinGecko (crypto).
> • Frontend **does not** call external APIs directly; it only uses your backend.
> • All money values in **USD** (we can add FX later if needed).

## 2) Real-Time Channel (WebSocket/SSE)

**Connect:** `wss://<your-api>/ws` (Socket.IO recommended)

**Events we’ll listen to on the frontend:**

* `price.tick`

```json
{
  "symbol": "MSFT",
  "currentPrice": 519.90,
  "previousClose": 522.47,
  "timestamp": "2025-08-16T17:10:05Z"
}
```

* `holding.update` (server may precompute derived fields for less FE work)

```json
{
  "symbol": "MSFT",
  "currentPrice": 519.90,
  "currentValue": 6238.80,
  "todaysChange": -31.87,
  "totalPnL": 3838.80,
  "totalPnLPct": 159.95,
  "timestamp": "2025-08-16T17:10:05Z"
}
```

* `portfolio.summary` (debounced—e.g., every 1–3s)

```json
{
  "portfolioId": "growth-60k",
  "totalValue": 64210.33,
  "todaysChange": -187.42,
  "totalPnL": 9210.33,
  "performancePct": 16.78,
  "timestamp": "2025-08-16T17:10:05Z"
}
```

> Server strategy:
> • Use Twelve Data WebSocket for stocks.
> • Poll CoinGecko for crypto (e.g., 2–5s), then push merged updates to clients.
> • Throttle/merge updates server-side to avoid spamming the UI.

## 3) Table Columns (FE uses these keys)

* **Investment (name)** → `name`
* **Ticker** → `symbol`
* **Current Price** → `currentPrice`
* **Current Value** → `currentValue`
* **Total gain/loss (\$)** → `totalPnL`
* **Total gain/loss (%)** → `totalPnLPct`
* **Quantity** → `quantity`
* **Cost** → `cost`
* **Average Cost/Price** → `avgCost`

## 4) Calculations (server-side truths)

* `cost = avgCost * quantity`
* `currentValue = currentPrice * quantity`
* `totalPnL = currentValue - cost`
* `totalPnLPct = (avgCost > 0) ? (totalPnL / cost) * 100 : 0`
* `todaysChange = (currentPrice - previousClose) * quantity`
* **Top cards:**

  * `totalValue = Σ currentValue`
  * `todaysChange = Σ todaysChange`
  * `totalPnL = Σ totalPnL`
  * `performancePct = (totalValue - Σ cost) / Σ cost * 100` (guard divide-by-zero)

**Rounding/UI**

* Money: 2 decimals; Crypto prices allow 4–6 if < \$1.
* Percent: 2 decimals with sign.
* Color: green for `> 0`, red for `< 0`, neutral for `0`.

## 5) Frontend stack (recommended)

* **React/Next.js**, **Tailwind + shadcn/ui**, **TanStack Table** for the grid.
* **React Query** for data fetching/caching.
* **Socket.IO client** for live updates.
* Animation on change (small flash/pulse), skeleton loaders, optimistic row patch.

## 6) MongoDB (backing model)

* `portfolios` (meta, owner, baseCurrency).
* `holdings` (portfolioId, symbol, type, quantity, avgCost, cost).
* `price_snapshots` (symbol, price, source, timestamp) — optional for charts.
* Server computes derived fields and emits via WS.

---

If this plan looks good, we can jump straight into **Phase 2 (UI scaffolding)** next: I’ll give you a clean React component layout (stat cards + dynamic table skeleton) wired to these endpoints, ready to plug in real-time.
