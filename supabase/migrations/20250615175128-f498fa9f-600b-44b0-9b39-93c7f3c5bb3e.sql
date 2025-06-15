
-- Criar tipos enum para consistência dos dados do relatório
CREATE TYPE public.report_format AS ENUM ('pdf', 'xlsx', 'docx', 'csv');
CREATE TYPE public.report_type AS ENUM ('financeiro', 'processual', 'clientes', 'contratos', 'desempenho', 'personalizado');
CREATE TYPE public.report_status AS ENUM ('gerando', 'concluido', 'falhou');

-- Criar a tabela para armazenar os relatórios gerados
CREATE TABLE public.reports (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type public.report_type NOT NULL,
    format public.report_format NOT NULL,
    date_range TEXT NOT NULL,
    include_charts BOOLEAN NOT NULL DEFAULT FALSE,
    include_details BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT,
    status public.report_status NOT NULL DEFAULT 'concluido',
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Comentários para clareza
COMMENT ON TABLE public.reports IS 'Armazena os metadados dos relatórios gerados pelos usuários.';
COMMENT ON COLUMN public.reports.created_by IS 'Nome do usuário que gerou o relatório.';

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para que usuários possam gerenciar apenas seus próprios relatórios
CREATE POLICY "Users can view their own reports"
ON public.reports FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports"
ON public.reports FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports"
ON public.reports FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports"
ON public.reports FOR DELETE
USING (auth.uid() = user_id);

-- Trigger para atualizar o campo updated_at automaticamente
CREATE TRIGGER handle_reports_updated_at
BEFORE UPDATE ON public.reports
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_timestamp();
