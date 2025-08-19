-- Create portfolio_holdings table with correct structure
CREATE TABLE IF NOT EXISTS public.portfolio_holdings (
  id SERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  shares DECIMAL(15,4) NOT NULL CHECK (shares > 0),
  avg_cost DECIMAL(15,2) NOT NULL CHECK (avg_cost > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_portfolio_holdings_updated_at 
    BEFORE UPDATE ON public.portfolio_holdings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can restrict this later with authentication)
CREATE POLICY "Allow all operations on portfolio_holdings" ON public.portfolio_holdings
FOR ALL USING (true) WITH CHECK (true);