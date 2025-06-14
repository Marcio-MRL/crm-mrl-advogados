
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
  const { user } = useAuth();

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

      setTokens(data || []);
    } catch (error) {
      console.error('Erro ao buscar tokens OAuth:', error);
      toast.error('Erro ao carregar tokens OAuth');
    } finally {
      setLoading(false);
    }
  };

  const getOAuthUrl = (service: 'calendar' | 'sheets' | 'drive'): string => {
    const clientId = 'YOUR_GOOGLE_CLIENT_ID'; // Será configurado via secrets
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

    try {
      const oauthUrl = getOAuthUrl(service);
      
      // Abrir popup para OAuth
      const popup = window.open(
        oauthUrl,
        'google-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        toast.error('Por favor, permita popups para este site');
        return;
      }

      // Escutar mensagem do popup
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

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

    } catch (error) {
      console.error('Erro ao iniciar OAuth:', error);
      toast.error('Erro ao iniciar autenticação Google');
    }
  };

  const handleOAuthCallback = async (code: string, state: string) => {
    try {
      const stateData = JSON.parse(state);
      const service = stateData.service;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro na autenticação');
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Erro no callback OAuth:', error);
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
    fetchTokens();
  }, [user]);

  return {
    tokens,
    loading,
    initiateOAuth,
    handleOAuthCallback,
    revokeToken,
    isServiceConnected,
    getServiceToken,
    refetch: fetchTokens,
    services: OAUTH_SERVICES
  };
}
