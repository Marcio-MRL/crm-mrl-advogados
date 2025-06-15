
-- Create table for Google Sheet mappings
CREATE TABLE public.google_sheet_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  "type" TEXT NOT NULL CHECK ("type" IN ('financial', 'clients', 'processes')),
  last_synced_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'connected' CHECK (status IN ('connected', 'error', 'syncing')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, url)
);

-- Enable RLS
ALTER TABLE public.google_sheet_mappings ENABLE ROW LEVEL SECURITY;

-- Policies for google_sheet_mappings
CREATE POLICY "Users can view their own sheet mappings"
  ON public.google_sheet_mappings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sheet mappings"
  ON public.google_sheet_mappings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sheet mappings"
  ON public.google_sheet_mappings
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sheet mappings"
  ON public.google_sheet_mappings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger to update 'updated_at' timestamp
CREATE TRIGGER set_timestamp_google_sheet_mappings
  BEFORE UPDATE ON public.google_sheet_mappings
  FOR EACH ROW
  EXECUTE PROCEDURE public.trigger_set_timestamp();
