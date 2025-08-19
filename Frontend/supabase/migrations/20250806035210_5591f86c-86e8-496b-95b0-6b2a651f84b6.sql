-- Create portfolios table
CREATE TABLE public.portfolios (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio_holdings table
CREATE TABLE public.portfolio_holdings (
  id SERIAL PRIMARY KEY,
  portfolio_id INTEGER REFERENCES public.portfolios(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  shares DECIMAL(15,6) NOT NULL,
  avg_cost DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;

-- Create policies (public access for now - you can add authentication later)
CREATE POLICY "Allow all operations on portfolios" 
ON public.portfolios 
FOR ALL 
USING (true);

CREATE POLICY "Allow all operations on portfolio_holdings" 
ON public.portfolio_holdings 
FOR ALL 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_holdings_updated_at
  BEFORE UPDATE ON public.portfolio_holdings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create a default portfolio
INSERT INTO public.portfolios (name, description) 
VALUES ('My Portfolio', 'Primary investment portfolio');