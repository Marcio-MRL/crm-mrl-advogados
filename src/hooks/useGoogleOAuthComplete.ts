import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GoogleOAuthToken {
  id: string;
  user_id: string;
  access_token?: string;
  refresh_token?: string;
  token_type: string;
  expires_at?: string;
  scope?: string;
  created_at: string;
  updated_at: string;
}

export interface OAuthService {
  type: 'calendar' | 'sheets' | 'drive';
  name: string;
  description: string;
  scope: string;
  icon: string;
  color: string;
}

export const OAUTH_SERVICES: OAuthService[] = [
  {
    type: 'calendar',
    name: 'Google Calendar',
    description: 'Sincronize audiências e compromissos',
    scope: 'https://www.googleapis.com/auth/calendar',
    icon: 'Calendar',
    color: 'blue'
  },
  {
    type: 'sheets',
    name: 'Google Sheets',
    description: 'Exporte relatórios e dados',
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    icon: 'Sheet',
    color: 'green'
  },
  {
    type: 'drive',
    name: 'Google Drive',
    description: 'Armazene e compartilhe documentos',
    scope: 'https://www.googleapis.com/auth/drive.file',
    icon: 'HardDrive',
    color: 'yellow'
  }
];

export function useGoogleOAuthComplete() {
  const [tokens, setTokens] = useState<GoogleOAuthToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchClientId = async () => {
    if (!user) return null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const response = await fetch(
        `https://ncficjpokmmsugykmtdu.supabase.co/rest/v1/google_oauth_configs?user_id=eq.${user.id}&service_type=eq.calendar&select=client_id`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZmljanBva21tc3VneWttdGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzY3NjQsImV4cCI6MjA2MjExMjc2NH0.qibulCIaQ-eLTJH3L-Z5nsfBGVj-CGlQsYCY3--uWOs',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Configurações OAuth encontradas:', data);
        
        if (data && data.length > 0 && data[0].client_id) {
          return data[0].client_id;
        }
      }
    } catch (error) {
      console.warn('Erro ao buscar Client ID:', error);
    }
    return null;
  };

  const fetchTokens = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('google_oauth_tokens')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar tokens:', error);
        setTokens([]);
        return;
      }

      console.log('Tokens OAuth encontrados:', data);
      setTokens(data || []);
    } catch (error) {
      console.error('Erro ao buscar tokens OAuth:', error);
      toast.error('Erro ao carregar tokens OAuth');
    } finally {
      setLoading(false);
    }
  };

  const getOAuthUrl = (service: 'calendar' | 'sheets' | 'drive'): string => {
    if (!clientId) {
      throw new Error('Client ID não configurado. Configure as credenciais OAuth primeiro.');
    }

    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const serviceConfig = OAUTH_SERVICES.find(s => s.type === service);
    
    if (!serviceConfig) {
      throw new Error('Serviço não encontrado');
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: serviceConfig.scope,
      access_type: 'offline',
      prompt: 'consent',
      state: JSON.stringify({ service, timestamp: Date.now() })
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  const initiateOAuth = async (service: 'calendar' | 'sheets' | 'drive') => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    if (!user.email?.endsWith('@mrladvogados.com.br')) {
      toast.error('OAuth disponível apenas para emails @mrladvogados.com.br');
      return;
    }

    if (!clientId) {
      toast.error('OAuth não configurado. Configure as credenciais primeiro na seção de configurações.');
      return;
    }

    try {
      const oauthUrl = getOAuthUrl(service);
      console.log('Iniciando OAuth para:', service, 'URL:', oauthUrl);
      
      const popup = window.open(
        oauthUrl,
        'google-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        toast.error('Por favor, permita popups para este site');
        return;
      }

      const handleMessage = (event: MessageEvent) => {
        console.log('Mensagem recebida no popup:', event.data);
        
        if (event.origin !== window.location.origin) {
          console.warn('Origem inválida da mensagem:', event.origin);
          return;
        }

        if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
          popup.close();
          toast.success(`${OAUTH_SERVICES.find(s => s.type === service)?.name} conectado com sucesso!`);
          fetchTokens();
          window.removeEventListener('message', handleMessage);
        } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
          popup.close();
          toast.error(`Erro ao conectar: ${event.data.error}`);
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);

      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          console.log('Popup fechado pelo usuário');
        }
      }, 1000);

    } catch (error) {
      console.error('Erro ao iniciar OAuth:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao iniciar autenticação Google');
    }
  };

  const handleOAuthCallback = async (code: string, state: string) => {
    try {
      console.log('handleOAuthCallback: Iniciando processamento...', { code: code.substring(0, 10) + '...', state });
      
      const stateData = JSON.parse(state);
      const service = stateData.service;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      console.log('handleOAuthCallback: Chamando edge function...');

      const response = await fetch('/functions/v1/google-oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          code,
          service,
          redirectUri: `${window.location.origin}/auth/google/callback`
        }),
      });

      console.log('handleOAuthCallback: Resposta da edge function:', response.status, response.statusText);

      if (!response.ok) {
        const responseText = await response.text();
        console.error('handleOAuthCallback: Erro na resposta:', responseText);
        
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.error || 'Erro na autenticação');
        } catch (parseError) {
          throw new Error(`Erro HTTP ${response.status}: ${responseText || 'Resposta inválida do servidor'}`);
        }
      }

      const responseText = await response.text();
      console.log('handleOAuthCallback: Resposta raw:', responseText);
      
      if (!responseText.trim()) {
        throw new Error('Resposta vazia do servidor');
      }

      const result = JSON.parse(responseText);
      console.log('handleOAuthCallback: Resultado parseado:', result);
      
      return result;

    } catch (error) {
      console.error('handleOAuthCallback: Erro completo:', error);
      throw error;
    }
  };

  const revokeToken = async (tokenId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      const response = await fetch(`/functions/v1/google-oauth?tokenId=${tokenId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao revogar token');
      }

      toast.success('Token revogado com sucesso');
      fetchTokens();

    } catch (error) {
      console.error('Erro ao revogar token:', error);
      toast.error('Erro ao revogar token OAuth');
    }
  };

  const isServiceConnected = (service: 'calendar' | 'sheets' | 'drive'): boolean => {
    const serviceConfig = OAUTH_SERVICES.find(s => s.type === service);
    if (!serviceConfig) return false;

    return tokens.some(token => 
      token.scope?.includes(serviceConfig.scope) && 
      (!token.expires_at || new Date(token.expires_at) > new Date())
    );
  };

  const getServiceToken = (service: 'calendar' | 'sheets' | 'drive'): GoogleOAuthToken | null => {
    const serviceConfig = OAUTH_SERVICES.find(s => s.type === service);
    if (!serviceConfig) return null;

    return tokens.find(token => 
      token.scope?.includes(serviceConfig.scope) && 
      (!token.expires_at || new Date(token.expires_at) > new Date())
    ) || null;
  };

  useEffect(() => {
    const initialize = async () => {
      if (user) {
        const id = await fetchClientId();
        console.log('Client ID carregado:', id);
        setClientId(id);
        await fetchTokens();
      }
    };
    
    initialize();
  }, [user]);

  return {
    tokens,
    loading,
    clientId,
    initiateOAuth,
    handleOAuthCallback,
    revokeToken,
    isServiceConnected,
    getServiceToken,
    refetch: fetchTokens,
    services: OAUTH_SERVICES
  };
}
