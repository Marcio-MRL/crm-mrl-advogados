
# Script Pós-Deploy

Execute estes comandos após o deploy bem-sucedido:

## 1. Atualizar URLs no Supabase

```bash
# Substitua YOUR_VERCEL_URL pela URL real gerada
export VERCEL_URL="https://mrl-advogados.vercel.app"

echo "Atualize no Supabase Dashboard:"
echo "Authentication > URL Configuration"
echo "Site URL: $VERCEL_URL"
echo "Redirect URLs: $VERCEL_URL"
```

## 2. Teste Automático das APIs

```bash
# Teste básico de conectividade
curl -I $VERCEL_URL

# Teste se Supabase está respondendo
curl -I "https://ncficjpokmmsugykmtdu.supabase.co/rest/v1/"
```

## 3. Validação Manual

Acesse cada página e teste:
- [ ] `/` - Dashboard
- [ ] `/leads` - Kanban funcionando
- [ ] `/tarefas` - CRUD de tarefas
- [ ] `/agenda` - Integrações
- [ ] `/auth` - Login/Registro

## 4. Configurar Monitoramento

No dashboard Vercel:
- Ativar Analytics
- Configurar alertas
- Revisar métricas de performance

## 5. Documentar URLs Finais

Atualize este arquivo com as URLs reais:
- **Produção**: [URL_FINAL]
- **Preview**: [URL_PREVIEW]
- **GitHub**: [REPO_URL]
