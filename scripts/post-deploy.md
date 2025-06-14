
# Script Pós-Deploy

Execute estes comandos após o deploy bem-sucedido:

## 1. Atualizar URLs no Supabase

```bash
# URL de produção configurada
export PRODUCTION_URL="https://crm.mrladvogados.com.br"

echo "Atualize no Supabase Dashboard:"
echo "Authentication > URL Configuration"
echo "Site URL: $PRODUCTION_URL"
echo "Redirect URLs: $PRODUCTION_URL/auth/google/callback"
```

## 2. Configurar Google OAuth

```bash
echo "Configure no Google Cloud Console:"
echo "Authorized JavaScript origins: $PRODUCTION_URL"
echo "Authorized redirect URLs: $PRODUCTION_URL/auth/google/callback"
```

## 3. Teste Automático das APIs

```bash
# Teste básico de conectividade
curl -I https://crm.mrladvogados.com.br

# Teste se Supabase está respondendo
curl -I "https://ncficjpokmmsugykmtdu.supabase.co/rest/v1/"
```

## 4. Validação Manual

Acesse cada página e teste:
- [ ] `/` - Dashboard
- [ ] `/leads` - Kanban funcionando
- [ ] `/tarefas` - CRUD de tarefas
- [ ] `/agenda` - Integrações Google
- [ ] `/auth` - Login/Registro

## 5. Configurar Monitoramento

No dashboard Vercel:
- Ativar Analytics
- Configurar alertas
- Revisar métricas de performance

## 6. URLs Finais Configuradas

- **Produção**: https://crm.mrladvogados.com.br
- **Supabase**: https://ncficjpokmmsugykmtdu.supabase.co
- **Google OAuth Callback**: https://crm.mrladvogados.com.br/auth/google/callback
