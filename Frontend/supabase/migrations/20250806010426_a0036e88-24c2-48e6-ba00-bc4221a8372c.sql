-- Create portfolios table to manage multiple portfolios
CREATE TABLE IF NOT EXISTS public.portfolios (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add portfolio_id to portfolio_holdings table
ALTER TABLE public.portfolio_holdings 
ADD COLUMN IF NOT EXISTS portfolio_id INTEGER REFERENCES public.portfolios(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_portfolio_id ON public.portfolio_holdings(portfolio_id);

-- Enable RLS on portfolios table
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Create policy for portfolios table
CREATE POLICY "Allow all operations on portfolios" ON public.portfolios
FOR ALL USING (true) WITH CHECK (true);

-- Create trigger for portfolios updated_at
CREATE TRIGGER update_portfolios_updated_at
    BEFORE UPDATE ON public.portfolios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert 4 default portfolios
INSERT INTO public.portfolios (name, description) VALUES
('Growth Portfolio', 'High-growth technology and emerging market stocks'),
('Value Portfolio', 'Undervalued dividend-paying stocks and blue chips'),
('International Portfolio', 'Global diversification with international markets'),
('Crypto Portfolio', 'Cryptocurrency and blockchain-related investments')
ON CONFLICT DO NOTHING;