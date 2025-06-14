
# ✅ Checklist de Deploy - MRL Advogados

## Pré-Deploy
- [ ] Projeto sincronizado com GitHub
- [ ] Todas as funcionalidades testadas localmente
- [ ] Credenciais do Supabase verificadas
- [ ] Build local funcionando (`npm run build`)

## Durante o Deploy
- [ ] Conta Vercel conectada ao GitHub
- [ ] Projeto importado no Vercel
- [ ] Configurações automáticas verificadas
- [ ] Deploy executado com sucesso
- [ ] Domínio personalizado configurado: **crm.mrladvogados.com.br**

## Configurações de Produção
- [ ] **Supabase URLs atualizadas**:
  - Site URL: `https://crm.mrladvogados.com.br`
  - Redirect URLs: `https://crm.mrladvogados.com.br/auth/google/callback`
- [ ] **Google Cloud Console configurado**:
  - Authorized JavaScript origins: `https://crm.mrladvogados.com.br`
  - Authorized redirect URLs: `https://crm.mrladvogados.com.br/auth/google/callback`
- [ ] **Supabase Secrets configurados**:
  - GOOGLE_OAUTH_CLIENT_ID
  - GOOGLE_OAUTH_CLIENT_SECRET

## Pós-Deploy
- [ ] Login/Registro testado
- [ ] CRUD de tarefas funcionando
- [ ] Kanban de leads operacional
- [ ] **Integrações Google OAuth testadas**
- [ ] Navegação testada
- [ ] Performance verificada

## Desenvolvimento Contínuo
- [ ] Workflow Git → Vercel testado
- [ ] Preview deployments funcionando
- [ ] Equipe orientada sobre processo
- [ ] Documentação atualizada

## Melhorias Futuras
- [ ] Sistema de notificações
- [ ] Validações robustas
- [ ] Testes automatizados
- [ ] SEO otimizado

---

**Status Atual**: ✅ Configurado para crm.mrladvogados.com.br
**Responsável**: Equipe MRL Advogados
**Data**: ${new Date().toLocaleDateString('pt-BR')}
**URL de Produção**: https://crm.mrladvogados.com.br
