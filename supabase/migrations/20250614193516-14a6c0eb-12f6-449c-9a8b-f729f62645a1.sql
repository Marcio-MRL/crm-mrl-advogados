
-- Inserir o perfil do usuário que está tentando fazer login
INSERT INTO public.profiles (id, email, first_name, last_name, role, status)
VALUES (
  '5115d206-a6ae-4d60-a734-5faccb3f9850',
  'mraposo@mrladvogados.com.br',
  'MR',
  'Advogados',
  'admin',
  'active'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  status = EXCLUDED.status;

-- Verificar se o trigger para criar perfis automaticamente está funcionando
-- Se não estiver, vamos criar/atualizar ele
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'first_name', 
    NEW.raw_user_meta_data->>'last_name', 
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Criar o trigger se não existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
