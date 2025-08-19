## **Phase 1 – Backend Foundations**

1. **Install dependencies & set up `.env`**

   * You already did: `MONGODB_URI`, `TWELVEDATA_API_KEY`, `NEWS_PROVIDER=yahoo`, `BASE_CURRENCY=USD`.
   * ✅ **Done**

2. **Run the backend server**

   * `npm run dev`
   * Fix any `import`/`module` issues (you did that by adding `"type": "module"` in `package.json`).
   * ✅ **Done** (your server logs “MongoDB connected”)

---

## **Phase 2 – Database Seeding**

3. **Seed Portfolios**

   * Run `npm run seed`
   * Check `GET http://localhost:4000/api/portfolios` — should return 5 portfolios.
   * ✅ **You did this and can see them**

4. **Seed Transactions** (next step)

   * Create a `transactionsSeed.js` with realistic BUY/SELL data (AAPL, NVDA, BTC, etc.).
   * Run `node seeds/transactionsSeed.js` to load them into MongoDB.
   * Test `GET http://localhost:4000/api/portfolios/:id/holdings` — should return positions with qty & cost.
   * ✅ **You did this and can see them**

---

## **Phase 3 – Pricing & Math**

5. **Integrate Price Services**

   * Stocks → Twelve Data batching (`tdQuoteBatch`)
   * Crypto → CoinGecko (`cgSimplePrice`)
   * Cache results (60–90s) to save API credits.

6. **Portfolio Math on Server**

   * For each holding:

     ```
     positionQty = sum(BUY qty) - sum(SELL qty)
     costBasis = sum(qty * price)
     currentValue = positionQty * latestPrice
     PnL = currentValue - costBasis
     ```
   * Add “today’s change” using previous close.
   * ✅ **You did this and can see them**
---

## **Phase 4 – API Endpoints**

7. **Build the following routes**

   ```
   GET /api/portfolios              → list all
   GET /api/portfolios/:id/summary  → KPIs (value, PnL, today change)
   GET /api/portfolios/:id/holdings → holdings table
   GET /api/quotes?symbols=AAPL,BTC → debug quotes
   GET /api/news?symbol=AAPL        → Yahoo/MarketAux
   ```

   * Test with Postman or browser.

---

## **Phase 5 – Frontend Wiring**

8. **Connect Frontend to Backend APIs**

   * Replace hardcoded table data with `/api/portfolios/:id/holdings` response.
   * Replace KPIs with `/api/portfolios/:id/summary` data.
   * Replace news with `/api/news`.

9. **Enable Live Updates**

   * Backend: `/api/sse` route to push updates every 30–60s.
   * Frontend: Listen to SSE and update state.

---

## **Phase 6 – Extra Features**

10. **Performance Chart API**

    * `GET /api/portfolios/:id/performance?period=1M` returns price history.
    * Backend pulls from Twelve Data (stocks) & CoinGecko (crypto).

11. **Dashboard Aggregation**

    * Combine all portfolios into one set of KPIs & chart.

12. **Final Testing**

    * Seed data for multiple portfolios.
    * Check frontend matches backend calculations.
    * Simulate API downtime to confirm caching works.

---

✅ **Where you are right now**: Step **3** is done (portfolios seeded).
🔜 **Next step**: Step **4** — seed transactions so your holdings table has *real, dynamic* data.

---

Do you want me to **write the `transactionsSeed.js` file** for Step 4 so you can run it immediately? That will make the frontend start showing numbers from your database instead of hardcoded ones.

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/3c847e73-f9ae-450f-9f56-4dea477b0d71

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3c847e73-f9ae-450f-9f56-4dea477b0d71) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3c847e73-f9ae-450f-9f56-4dea477b0d71) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
--


Alright — I’ll break this whole thing into **clear, numbered steps** so you’ll always know *exactly* where you are and what comes next.
Think of it like a **checklist from zero to working frontend**.

---

