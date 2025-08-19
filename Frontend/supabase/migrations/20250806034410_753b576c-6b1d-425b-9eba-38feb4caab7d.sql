-- Update ARQQ with correct average cost from user data
UPDATE portfolio_holdings SET avg_cost = 34.178 WHERE symbol = 'ARQQ';

-- Add cash holding to portfolio
INSERT INTO portfolio_holdings (portfolio_id, symbol, name, shares, avg_cost)
VALUES (1, 'CASH', 'Cash', 1, 220.64);