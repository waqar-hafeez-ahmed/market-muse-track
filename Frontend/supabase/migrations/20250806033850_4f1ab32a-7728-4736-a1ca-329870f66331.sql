-- Fix ARQQ to have 10 shares, not 1
UPDATE portfolio_holdings SET shares = 10 WHERE symbol = 'ARQQ';