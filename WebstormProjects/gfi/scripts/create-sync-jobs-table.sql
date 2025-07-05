-- Create sync_jobs table for automated data synchronization
CREATE TABLE IF NOT EXISTS sync_jobs (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('hourly', 'daily', 'weekly')),
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,
  
  -- Ensure one sync job per user per provider
  UNIQUE(user_id, provider_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sync_jobs_user_id ON sync_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_jobs_provider ON sync_jobs(provider_id);
CREATE INDEX IF NOT EXISTS idx_sync_jobs_status ON sync_jobs(status);
CREATE INDEX IF NOT EXISTS idx_sync_jobs_next_run ON sync_jobs(next_run);

-- Create updated_at trigger
CREATE TRIGGER update_sync_jobs_updated_at 
    BEFORE UPDATE ON sync_jobs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
