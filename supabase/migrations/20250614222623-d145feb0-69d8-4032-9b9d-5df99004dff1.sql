
-- Criar tabela para armazenar configurações OAuth do Google
CREATE TABLE public.google_oauth_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('calendar', 'sheets', 'drive')),
  client_id TEXT NOT NULL,
  client_secret TEXT,
  redirect_uri TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, service_type)
);

-- Habilitar RLS na tabela
ALTER TABLE public.google_oauth_configs ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para que usuários vejam apenas suas próprias configurações
CREATE POLICY "Users can view their own oauth configs" 
  ON public.google_oauth_configs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own oauth configs" 
  ON public.google_oauth_configs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own oauth configs" 
  ON public.google_oauth_configs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own oauth configs" 
  ON public.google_oauth_configs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar trigger para atualizar updated_at automaticamente
CREATE TRIGGER set_timestamp_google_oauth_configs
  BEFORE UPDATE ON public.google_oauth_configs
  FOR EACH ROW
  EXECUTE PROCEDURE public.trigger_set_timestamp();
