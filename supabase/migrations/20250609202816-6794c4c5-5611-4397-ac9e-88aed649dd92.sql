
-- Habilitar RLS na tabela leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Adicionar coluna user_id na tabela leads se não existir
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Criar política para permitir que usuários vejam apenas seus próprios leads
CREATE POLICY "Users can view their own leads" 
ON public.leads 
FOR SELECT 
USING (auth.uid() = user_id);

-- Criar política para permitir que usuários insiram seus próprios leads
CREATE POLICY "Users can create their own leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Criar política para permitir que usuários atualizem seus próprios leads
CREATE POLICY "Users can update their own leads" 
ON public.leads 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Criar política para permitir que usuários excluam seus próprios leads
CREATE POLICY "Users can delete their own leads" 
ON public.leads 
FOR DELETE 
USING (auth.uid() = user_id);

-- Atualizar leads existentes para associá-los a um usuário (opcional - apenas para dados de teste)
-- Esta linha pode ser removida se você preferir começar com uma tabela limpa
UPDATE public.leads SET user_id = (SELECT id FROM auth.users LIMIT 1) WHERE user_id IS NULL;
