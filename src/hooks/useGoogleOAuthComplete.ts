
import { useState, useEffect } from 'react';
import { useGoogleOAuth } from '@/hooks/useGoogleOAuth';
import { useGoogleOAuthConfigs } from '@/hooks/useGoogleOAuthConfigs';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

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
  const { tokens, loading, initiateGoogleAuth, revokeOAuthToken, revokeAllTokens, refetch } = useGoogleOAuth();
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

    console.log(`🔍 Verificando conexão ${serviceType}:`, {
      scope: service.scope,
      hasValidToken,
      tokensCount: tokens.length,
      tokensWithScope: tokens.filter(t => t.scope?.includes(service.scope)).length
    });

    return hasValidToken;
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
      await initiateGoogleAuth(serviceType);
    } catch (error) {
      console.error('❌ Erro ao iniciar OAuth:', error);
      toast.error('Erro ao iniciar autenticação Google');
    }
  };

  const revokeToken = async (tokenId: string) => {
    try {
      console.log('🗑️ Revogando token:', tokenId);
      await revokeOAuthToken(tokenId);
      
      // Forçar atualização dos tokens após revogação
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
      
      // Forçar atualização dos tokens após revogação
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
    refetch
  };
}
