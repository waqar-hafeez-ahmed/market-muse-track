-- Migrate existing data from table "1" to portfolio_holdings table
INSERT INTO portfolio_holdings (portfolio_id, symbol, name, shares, avg_cost, created_at, updated_at)
SELECT 
  1 as portfolio_id, -- Assign to Growth Portfolio
  "Security" as symbol,
  "Security" as name,
  "Quantity" as shares,
  "Average Cost/Price" as avg_cost,
  now() as created_at,
  now() as updated_at
FROM "1"
WHERE "Security" IS NOT NULL 
  AND "Quantity" IS NOT NULL 
  AND "Average Cost/Price" IS NOT NULL;