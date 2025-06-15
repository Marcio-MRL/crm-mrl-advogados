
import { useState, useEffect } from 'react';
import { useGoogleOAuth } from '@/hooks/useGoogleOAuth';
import { useGoogleOAuthConfigs } from '@/hooks/useGoogleOAuthConfigs';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface GoogleOAuthService {
  type: 'calendar' | 'sheets' | 'drive';
  name: string;
  description: string;
  scope: string;
  icon: string;
  color: string;
}

export function useGoogleOAuthComplete() {
  const { user } = useAuth();
  const { tokens, loading, revokeOAuthToken, revokeAllTokens, refetch } = useGoogleOAuth();
  const { configs } = useGoogleOAuthConfigs();
  
  const [clientId, setClientId] = useState<string | null>(null);

  const services: GoogleOAuthService[] = [
    {
      type: 'calendar',
      name: 'Google Calendar',
      description: 'Sincronize suas audiências e compromissos',
      scope: 'https://www.googleapis.com/auth/calendar',
      icon: 'Calendar',
      color: 'blue'
    },
    {
      type: 'sheets',
      name: 'Google Sheets',
      description: 'Acesse e sincronize planilhas financeiras',
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      icon: 'Sheet',
      color: 'green'
    },
    {
      type: 'drive',
      name: 'Google Drive',
      description: 'Acesse arquivos e liste planilhas automaticamente',
      scope: 'https://www.googleapis.com/auth/drive.file',
      icon: 'HardDrive',
      color: 'yellow'
    }
  ];

  useEffect(() => {
    // Buscar client_id das configurações
    const sheetsConfig = configs.sheets;
    if (sheetsConfig?.client_id) {
      setClientId(sheetsConfig.client_id);
    }
  }, [configs]);

  const isServiceConnected = (serviceType: 'calendar' | 'sheets' | 'drive'): boolean => {
    const service = services.find(s => s.type === serviceType);
    if (!service) return false;

    // Verificar se existe um token válido para o escopo específico
    const hasValidToken = tokens.some(token => 
      token.scope?.includes(service.scope) && token.access_token
    );

    return hasValidToken;
  };

  const handleOAuthCallback = async (code: string, state: string) => {
    console.log('Handling OAuth callback...', { code, state });
    try {
      const parsedState = JSON.parse(state);
      const storedStateKey = `oauth_state_${parsedState.service}`;
      const storedState = sessionStorage.getItem(storedStateKey);

      if (!storedState || storedState !== parsedState.state) {
        throw new Error('Parâmetro de estado inválido. Possível ataque CSRF.');
      }
      sessionStorage.removeItem(storedStateKey);

      toast.info('Processando autenticação...');
      const { data, error } = await supabase.functions.invoke('google-oauth', {
        body: { code, service: parsedState.service },
      });

      if (error) {
        throw new Error(`Erro ao finalizar autenticação: ${error.message}`);
      }
      
      toast.success(`Integração com ${parsedState.service} concluída!`);
      await refetch();

      return { success: true, service: parsedState.service };
    } catch (error) {
      console.error('Erro no callback OAuth:', error);
      toast.error(error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.');
      throw error;
    }
  };

  const initiateOAuth = async (serviceType: 'calendar' | 'sheets' | 'drive') => {
    if (!user?.email?.endsWith('@mrladvogados.com.br')) {
      toast.error('Integração disponível apenas para emails @mrladvogados.com.br');
      return;
    }

    if (!clientId) {
      toast.error('Configure as credenciais OAuth nas configurações primeiro');
      return;
    }

    try {
      console.log('🔐 Iniciando OAuth para:', serviceType);
      
      const service = services.find(s => s.type === serviceType);
      if (!service) {
        toast.error('Serviço de integração não encontrado.');
        return;
      }
      
      const redirectUri = `${window.location.origin}/google-oauth-callback`;
      
      const stateValue = Math.random().toString(36).substring(2);
      const stateObject = { state: stateValue, service: serviceType };
      sessionStorage.setItem(`oauth_state_${serviceType}`, stateValue);

      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', clientId);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', service.scope);
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');
      authUrl.searchParams.set('state', JSON.stringify(stateObject));
      
      window.open(authUrl.toString(), 'google-auth', 'width=600,height=700,resizable,scrollbars');
      
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
          return;
        }
        
        const { type, service: returnedService, error } = event.data;
        
        if (type === 'GOOGLE_OAUTH_SUCCESS' && returnedService === serviceType) {
          toast.success(`Serviço ${service.name} conectado com sucesso!`);
          refetch();
        } else if (type === 'GOOGLE_OAUTH_ERROR') {
          toast.error(`Erro ao conectar ${service.name}: ${error}`);
        }
        
        window.removeEventListener('message', handleMessage);
      };

      window.addEventListener('message', handleMessage, false);

    } catch (error) {
      console.error('❌ Erro ao iniciar OAuth:', error);
      toast.error('Erro ao iniciar autenticação Google');
    }
  };

  const revokeToken = async (tokenId: string) => {
    try {
      console.log('🗑️ Revogando token:', tokenId);
      await revokeOAuthToken(tokenId);
      
      setTimeout(() => {
        refetch();
      }, 1000);
      
    } catch (error) {
      console.error('❌ Erro ao revogar token:', error);
      toast.error('Erro ao revogar token');
    }
  };

  const revokeAllUserTokens = async () => {
    try {
      console.log('🗑️ Revogando todos os tokens...');
      await revokeAllTokens();
      
      setTimeout(() => {
        refetch();
      }, 1000);
      
    } catch (error) {
      console.error('❌ Erro ao revogar todos os tokens:', error);
      toast.error('Erro ao revogar tokens');
    }
  };

  return {
    tokens,
    loading,
    clientId,
    services,
    initiateOAuth,
    revokeToken,
    revokeAllUserTokens,
    isServiceConnected,
    refetch,
    handleOAuthCallback,
  };
}
