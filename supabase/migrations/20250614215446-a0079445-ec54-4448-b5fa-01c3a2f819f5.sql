
-- Criar tabela de documentos para armazenar metadados dos arquivos do Google Drive
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drive_file_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id),
  process_id UUID REFERENCES public.processes(id),
  user_id UUID NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX documents_user_id_idx ON public.documents(user_id);
CREATE INDEX documents_client_id_idx ON public.documents(client_id);
CREATE INDEX documents_process_id_idx ON public.documents(process_id);
CREATE INDEX documents_category_idx ON public.documents(category);
CREATE INDEX documents_drive_file_id_idx ON public.documents(drive_file_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para garantir que usuários só vejam seus próprios documentos
CREATE POLICY "Usuários podem ver seus próprios documentos" ON public.documents
  FOR SELECT USING (auth.uid()::text = user_id::text);
  
CREATE POLICY "Usuários podem inserir seus próprios documentos" ON public.documents
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
  
CREATE POLICY "Usuários podem atualizar seus próprios documentos" ON public.documents
  FOR UPDATE USING (auth.uid()::text = user_id::text);
  
CREATE POLICY "Usuários podem excluir seus próprios documentos" ON public.documents
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
