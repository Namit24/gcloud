-- Create RLS policies for portfolio_data table

-- Policy for authenticated users to read their own portfolio data
CREATE POLICY "Users can view own portfolio data" ON portfolio_data
FOR SELECT USING (auth.uid() = user_id::uuid);

-- Policy for authenticated users to update their own portfolio data
CREATE POLICY "Users can update own portfolio data" ON portfolio_data
FOR UPDATE USING (auth.uid() = user_id::uuid);

-- Policy for authenticated users to delete their own portfolio data
CREATE POLICY "Users can delete own portfolio data" ON portfolio_data
FOR DELETE USING (auth.uid() = user_id::uuid);

-- Policy for service role to manage all portfolio data (for sync operations)
CREATE POLICY "Service role can manage portfolio data" ON portfolio_data
FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Policy for authenticated users to insert their own portfolio data
CREATE POLICY "Users can insert own portfolio data" ON portfolio_data
FOR INSERT WITH CHECK (auth.uid() = user_id::uuid);

-- Enable RLS on the table
ALTER TABLE portfolio_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sync_jobs table

-- Policy for authenticated users to read their own sync jobs
CREATE POLICY "Users can view own sync jobs" ON sync_jobs
FOR SELECT USING (auth.uid() = user_id::uuid);

-- Policy for authenticated users to update their own sync jobs
CREATE POLICY "Users can update own sync jobs" ON sync_jobs
FOR UPDATE USING (auth.uid() = user_id::uuid);

-- Policy for authenticated users to delete their own sync jobs
CREATE POLICY "Users can delete own sync jobs" ON sync_jobs
FOR DELETE USING (auth.uid() = user_id::uuid);

-- Policy for service role to manage all sync jobs (for automated sync)
CREATE POLICY "Service role can manage sync jobs" ON sync_jobs
FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Policy for authenticated users to insert their own sync jobs
CREATE POLICY "Users can insert own sync jobs" ON sync_jobs
FOR INSERT WITH CHECK (auth.uid() = user_id::uuid);

-- Enable RLS on the table
ALTER TABLE sync_jobs ENABLE ROW LEVEL SECURITY;
