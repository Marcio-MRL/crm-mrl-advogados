
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

export function useGoogleOAuth() {
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
        // Fallback para dados vazios se a tabela ainda não está disponível
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

  const initiateGoogleAuth = async (service: 'calendar' | 'sheets' | 'drive') => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    // Verificar se o usuário tem domínio autorizado
    if (!user.email?.endsWith('@mrladvogados.com.br')) {
      toast.error('Integração disponível apenas para emails @mrladvogados.com.br');
      return;
    }

    try {
      // URLs de redirecionamento para produção
      const redirectUrl = `${window.location.origin}/auth/callback`;
      
      // Definir escopos baseados no serviço
      let scopes = '';
      switch (service) {
        case 'calendar':
          scopes = 'https://www.googleapis.com/auth/calendar';
          break;
        case 'sheets':
          scopes = 'https://www.googleapis.com/auth/spreadsheets';
          break;
        case 'drive':
          scopes = 'https://www.googleapis.com/auth/drive.file';
          break;
      }

      // ⚠️ INTERVENÇÃO MANUAL NECESSÁRIA:
      // Será implementado quando você configurar as credenciais OAuth no Google Cloud Console
      toast.info(`Integração Google OAuth para ${service} será ativada após configuração das credenciais no Google Cloud Console.`);
      
    } catch (error) {
      console.error('Erro ao iniciar OAuth:', error);
      toast.error('Erro ao iniciar autenticação Google');
    }
  };

  const storeOAuthToken = async (tokenData: Partial<GoogleOAuthToken>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('google_oauth_tokens')
        .insert({
          user_id: user.id,
          ...tokenData
        });

      if (error) throw error;

      toast.success('Token OAuth armazenado com sucesso');
      await fetchTokens();
    } catch (error) {
      console.error('Erro ao armazenar token:', error);
      toast.error('Erro ao armazenar token OAuth');
    }
  };

  const revokeOAuthToken = async (tokenId: string) => {
    try {
      const { error } = await supabase
        .from('google_oauth_tokens')
        .delete()
        .eq('id', tokenId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success('Token OAuth revogado com sucesso');
      await fetchTokens();
    } catch (error) {
      console.error('Erro ao revogar token:', error);
      toast.error('Erro ao revogar token OAuth');
    }
  };

  useEffect(() => {
    fetchTokens();
  }, [user]);

  return {
    tokens,
    loading,
    initiateGoogleAuth,
    storeOAuthToken,
    revokeOAuthToken,
    refetch: fetchTokens
  };
}
