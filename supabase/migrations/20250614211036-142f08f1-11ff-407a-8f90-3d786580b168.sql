
-- Primeiro, vamos atualizar a tabela de processos existente para ter todos os campos necessários
ALTER TABLE public.processes 
ADD COLUMN IF NOT EXISTS forum TEXT,
ADD COLUMN IF NOT EXISTS start_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS responsible TEXT,
ADD COLUMN IF NOT EXISTS client_name TEXT;

-- Renomear algumas colunas para ficar consistente com o sistema atual (só se não existir)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'processes' AND column_name = 'number') THEN
        ALTER TABLE public.processes RENAME COLUMN number TO process_number;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'processes' AND column_name = 'area') THEN
        ALTER TABLE public.processes RENAME COLUMN area TO process_type;
    END IF;
END $$;

-- Criar tabela para andamentos processuais
CREATE TABLE IF NOT EXISTS public.process_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id UUID NOT NULL REFERENCES public.processes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  responsible TEXT,
  deadline DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS nas tabelas (se ainda não estiver habilitado)
ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_movements ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes e recriar
DROP POLICY IF EXISTS "Users can view processes" ON public.processes;
DROP POLICY IF EXISTS "Users can create processes" ON public.processes;
DROP POLICY IF EXISTS "Users can update processes" ON public.processes;
DROP POLICY IF EXISTS "Users can delete processes" ON public.processes;

-- Criar políticas RLS para processes
CREATE POLICY "Users can view processes" ON public.processes
  FOR SELECT USING (true);

CREATE POLICY "Users can create processes" ON public.processes
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update processes" ON public.processes
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete processes" ON public.processes
  FOR DELETE USING (user_id = auth.uid());

-- Políticas RLS para process_movements
CREATE POLICY "Users can view process movements" ON public.process_movements
  FOR SELECT USING (true);

CREATE POLICY "Users can create process movements" ON public.process_movements
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update process movements" ON public.process_movements
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete process movements" ON public.process_movements
  FOR DELETE USING (user_id = auth.uid());

-- Criar função para atualizar updated_at (se não existir)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers (removendo primeiro se existirem)
DROP TRIGGER IF EXISTS update_processes_updated_at ON public.processes;
DROP TRIGGER IF EXISTS update_process_movements_updated_at ON public.process_movements;

CREATE TRIGGER update_processes_updated_at 
  BEFORE UPDATE ON public.processes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_process_movements_updated_at 
  BEFORE UPDATE ON public.process_movements 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
