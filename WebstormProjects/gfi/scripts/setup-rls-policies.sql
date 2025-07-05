-- Create RLS policies for user_connections table

-- Policy for authenticated users to read their own connections
CREATE POLICY "Users can view own connections" ON user_connections
FOR SELECT USING (auth.uid() = user_id::uuid);

-- Policy for authenticated users to update their own connections
CREATE POLICY "Users can update own connections" ON user_connections
FOR UPDATE USING (auth.uid() = user_id::uuid);

-- Policy for authenticated users to delete their own connections
CREATE POLICY "Users can delete own connections" ON user_connections
FOR DELETE USING (auth.uid() = user_id::uuid);

-- Policy for service role to manage all connections (for OAuth callbacks)
CREATE POLICY "Service role can manage connections" ON user_connections
FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Policy for authenticated users to insert their own connections
CREATE POLICY "Users can insert own connections" ON user_connections
FOR INSERT WITH CHECK (auth.uid() = user_id::uuid);

-- Enable RLS on the table
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;
