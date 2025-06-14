
-- Criar tabela para armazenar tokens OAuth do Google
CREATE TABLE IF NOT EXISTS public.google_oauth_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  token_type TEXT NOT NULL DEFAULT 'Bearer',
  expires_at TIMESTAMP WITH TIME ZONE,
  scope TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, scope)
);

-- Habilitar RLS na tabela
ALTER TABLE public.google_oauth_tokens ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para que usuários vejam apenas seus próprios tokens
CREATE POLICY IF NOT EXISTS "Users can view their own oauth tokens" 
  ON public.google_oauth_tokens 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create their own oauth tokens" 
  ON public.google_oauth_tokens 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own oauth tokens" 
  ON public.google_oauth_tokens 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own oauth tokens" 
  ON public.google_oauth_tokens 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE TRIGGER set_timestamp_google_oauth_tokens
  BEFORE UPDATE ON public.google_oauth_tokens
  FOR EACH ROW
  EXECUTE PROCEDURE public.trigger_set_timestamp();
