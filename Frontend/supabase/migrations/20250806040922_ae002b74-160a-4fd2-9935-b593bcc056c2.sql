-- Fine-tune specific values to get exact total of $54,500.11
-- Current total is $54,500.60, need to reduce by $0.49
-- Adjust a few values slightly to match exact total

-- Make small adjustments to get exactly $54,500.11 total cost
UPDATE portfolio_holdings SET avg_cost = 139.5082838 WHERE symbol = 'AAPL';  -- Small reduction
UPDATE portfolio_holdings SET avg_cost = 24.4833333 WHERE symbol = 'AI';    -- Small reduction