
# Deploy no Vercel - Guia Passo a Passo

## Pré-requisitos
- ✅ Projeto conectado ao GitHub via Lovable
- ✅ Supabase configurado e funcionando
- ✅ Conta no Vercel

## Passo 1: Conectar ao Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Selecione o repositório: `mrl-advogados` (ou nome do seu repo)

## Passo 2: Configurar o Projeto

### Configurações Automáticas (já configuradas)
- **Framework Preset**: Vite (detectado automaticamente)
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Não adicione variáveis de ambiente
As credenciais do Supabase estão hardcoded no cliente (seguro para frontend público).

## Passo 3: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build terminar (2-5 minutos)
3. Anote a URL gerada (ex: `https://mrl-advogados.vercel.app`)

## Passo 4: Atualizar Supabase URLs

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard/project/ncficjpokmmsugykmtdu)
2. Vá em **Authentication > URL Configuration**
3. Configure:
   - **Site URL**: `https://SEU-DOMINIO.vercel.app`
   - **Redirect URLs**: Adicione a URL do Vercel

## Passo 5: Testar Funcionalidades

Teste estas funcionalidades após o deploy:
- [ ] Login/Registro de usuários
- [ ] Criação e edição de tarefas
- [ ] Kanban de leads
- [ ] Navegação entre páginas
- [ ] Integrações (placeholder)

## Passo 6: Configurar Domínio Personalizado (Opcional)

1. No Vercel, vá em **Settings > Domains**
2. Adicione `mrladvogados.com.br`
3. Configure DNS conforme instruções
4. Atualize URLs no Supabase novamente

## Workflow de Desenvolvimento

### Desenvolvimento Contínuo
1. **Lovable** → Editar código
2. **GitHub** → Sincronização automática
3. **Vercel** → Deploy automático na branch main

### Preview Deployments
- Cada Pull Request gera preview automático
- Teste features antes do merge
- URLs temporárias para validação

## Monitoramento

- **Analytics**: Disponível no dashboard Vercel
- **Logs**: Real-time no Vercel
- **Performance**: Core Web Vitals automático

## Rollback

Em caso de problemas:
1. Acesse Vercel dashboard
2. Vá em **Deployments**
3. Clique em **"Promote to Production"** na versão anterior

## Próximos Passos

Após deploy bem-sucedido:
1. Configurar Google OAuth para produção
2. Implementar notificações
3. Adicionar validações robustas
4. Otimizar performance
5. Configurar CI/CD avançado

## Suporte

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **GitHub Integration**: [docs.github.com](https://docs.github.com)
