
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
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
        .eq('user_id', user.id);

      if (error) throw error;
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

      // Por enquanto, mostrar mensagem de que precisa ser configurado
      toast.info('Integração Google OAuth em configuração. Entre em contato com o administrador.');
      
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
      
      await fetchTokens();
      toast.success('Token OAuth armazenado com sucesso');
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
        .eq('id', tokenId);

      if (error) throw error;
      
      await fetchTokens();
      toast.success('Token OAuth revogado com sucesso');
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
