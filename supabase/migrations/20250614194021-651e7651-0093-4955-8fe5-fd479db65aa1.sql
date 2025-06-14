
-- Primeiro, vamos ver todas as políticas existentes na tabela profiles e removê-las
DO $$ 
DECLARE
    policy_name text;
BEGIN
    -- Buscar e remover todas as políticas da tabela profiles
    FOR policy_name IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_name || '" ON profiles';
    END LOOP;
END $$;

-- Criar função security definer para evitar recursão
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Criar políticas RLS corretas e simples para a tabela profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles  
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para permitir que administradores vejam todos os perfis (usando função security definer)
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (public.get_current_user_role() = 'admin');
