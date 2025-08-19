-- Clear existing holdings and insert exact data
DELETE FROM portfolio_holdings;

-- Insert exact holdings data with precise values
INSERT INTO portfolio_holdings (portfolio_id, symbol, name, shares, avg_cost) VALUES
(1, 'NVDA', 'Nvidia', 38.00561, 141.8585309),
(1, 'META', 'Meta', 7.07912, 368.2986021),
(1, 'QTUM', 'Quantum ETF', 53, 93.98),
(1, 'GOOG', 'Google', 24.92907, 121.1545397),
(1, 'MSFT', 'Microsoft', 6, 512.885),
(1, 'TSLA', 'Tesla', 10, 316.28),
(1, 'IBM', 'IBM', 12, 259.8641667),
(1, 'AMZN', 'Amazon', 14, 181.45),
(1, 'ARKQ', 'Automation Tech Robotics ETF', 25, 97.6444),
(1, 'AAPL', 'Apple', 11.88519, 139.5122838),
(1, 'AVGO', 'Broadcom', 8, 288.21),
(1, 'RGTI', 'Rigetti', 130, 14.45653846),
(1, 'PLTR', 'Palantir', 12, 158.1833333),
(1, 'ZYX', 'Block XYZ', 26, 77.78923077),
(1, 'TSM', 'Taiwan Semiconductor', 8, 242.9525),
(1, 'AMD', 'AMD', 10, 179.03),
(1, 'IONQ', 'IONQ', 40, 40.212),
(1, 'GLD', 'SPDR Gold', 5, 303.012),
(1, 'COIN', 'Coinbase', 5, 303.526),
(1, 'CRWV', 'Coreweave', 11, 105.1263636),
(1, 'QUBT', 'Quantum Computing', 65, 15.25507692),
(1, 'QBTS', 'D Wave Quantum', 56, 17.88982143),
(1, 'AI', 'C3 Ai', 30, 24.49333333),
(1, 'PATH', 'UiPath', 50, 12.02),
(1, 'DJT', 'Trump Media', 30, 17.73766667),
(1, 'SNOW', 'Snowflake Inc', 2, 220.62),
(1, 'ARQQ', 'Arqit Quantum', 10, 34.178),
(1, 'CASH', 'Cash', 1, 220.64);