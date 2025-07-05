-- Create portfolio_data table for storing synced financial data
CREATE TABLE IF NOT EXISTS portfolio_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_id UUID NOT NULL REFERENCES user_connections(id) ON DELETE CASCADE,
  data_type TEXT NOT NULL CHECK (data_type IN ('holdings', 'positions', 'funds', 'profile', 'portfolio', 'accounts', 'mutual_funds', 'transactions')),
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one record per connection per data type (upsert behavior)
  UNIQUE(connection_id, data_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_data_user_id ON portfolio_data(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_data_connection_id ON portfolio_data(connection_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_data_type ON portfolio_data(data_type);
CREATE INDEX IF NOT EXISTS idx_portfolio_data_created_at ON portfolio_data(created_at);

-- Create updated_at trigger
CREATE TRIGGER update_portfolio_data_updated_at 
    BEFORE UPDATE ON portfolio_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
