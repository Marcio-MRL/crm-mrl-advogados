
-- Primeiro, vamos verificar se o perfil existe
SELECT id, email, first_name, last_name, role, status 
FROM public.profiles 
WHERE id = '5115d206-a6ae-4d60-a734-5faccb3f9850';

-- Se não existir, vamos criar/atualizar o perfil com o nome correto 'MRL'
INSERT INTO public.profiles (id, email, first_name, last_name, role, status)
VALUES (
  '5115d206-a6ae-4d60-a734-5faccb3f9850',
  'mraposo@mrladvogados.com.br',
  'MRL',
  'Advogados',
  'admin',
  'active'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  status = EXCLUDED.status;

-- Verificar novamente se foi criado com o nome correto
SELECT id, email, first_name, last_name, role, status 
FROM public.profiles 
WHERE id = '5115d206-a6ae-4d60-a734-5faccb3f9850';

-- Verificar também se as políticas RLS estão ativas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'profiles' AND schemaname = 'public';
