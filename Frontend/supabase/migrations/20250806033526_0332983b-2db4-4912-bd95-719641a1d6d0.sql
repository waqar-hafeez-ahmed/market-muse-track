-- Update UiPath ticker from Path to PATH
UPDATE portfolio_holdings 
SET symbol = 'PATH' 
WHERE symbol = 'Path';

-- Insert missing ARQQ holding
INSERT INTO portfolio_holdings (portfolio_id, symbol, name, shares, avg_cost)
VALUES (1, 'ARQQ', 'Arqit Quantum', 10, 34.178);