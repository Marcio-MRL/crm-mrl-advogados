
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

## Passo 4: Configurar Domínio Personalizado

1. No Vercel, vá em **Settings > Domains**
2. Adicione `crm.mrladvogados.com.br`
3. Configure DNS conforme instruções
4. Aguarde propagação do DNS

## Passo 5: Atualizar Supabase URLs

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard/project/ncficjpokmmsugykmtdu)
2. Vá em **Authentication > URL Configuration**
3. Configure:
   - **Site URL**: `https://crm.mrladvogados.com.br`
   - **Redirect URLs**: 
     - `https://crm.mrladvogados.com.br`
     - `https://crm.mrladvogados.com.br/auth/google/callback`

## Passo 6: Configurar Google OAuth

No [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

1. **Authorized JavaScript origins**:
   - `https://crm.mrladvogados.com.br`

2. **Authorized redirect URLs**:
   - `https://crm.mrladvogados.com.br/auth/google/callback`

## Passo 7: Testar Funcionalidades

Teste estas funcionalidades após o deploy:
- [ ] Login/Registro de usuários
- [ ] Criação e edição de tarefas
- [ ] Kanban de leads
- [ ] Navegação entre páginas
- [ ] Integrações Google OAuth

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

## URLs Finais

- **Produção**: https://crm.mrladvogados.com.br
- **GitHub**: [REPO_URL]
- **Supabase**: https://ncficjpokmmsugykmtdu.supabase.co

## Suporte

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **GitHub Integration**: [docs.github.com](https://docs.github.com)
