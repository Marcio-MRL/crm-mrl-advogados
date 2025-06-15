
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
        setTokens([]);
        return;
      }

      console.log('📋 Tokens encontrados:', data?.map(t => ({
        id: t.id.substring(0, 8),
        scope: t.scope,
        hasAccess: !!t.access_token
      })));

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

    if (!user.email?.endsWith('@mrladvogados.com.br')) {
      toast.error('Integração disponível apenas para emails @mrladvogados.com.br');
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      
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
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      console.log('🗑️ Iniciando revogação do token:', tokenId);

      // Buscar token antes de revogar para validação
      const { data: tokenData, error: fetchError } = await supabase
        .from('google_oauth_tokens')
        .select('*')
        .eq('id', tokenId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('❌ Erro ao buscar token para revogação:', fetchError);
        
        // Se for erro de "not found" ou similar, tentar deletar mesmo assim
        if (fetchError.code === 'PGRST116' || fetchError.message.includes('No rows found')) {
          console.log('🔄 Token não encontrado, tentando deletar diretamente...');
          
          const { error: directDeleteError } = await supabase
            .from('google_oauth_tokens')
            .delete()
            .eq('id', tokenId)
            .eq('user_id', user.id);

          if (directDeleteError) {
            console.error('❌ Erro na deleção direta:', directDeleteError);
            toast.error('Erro ao revogar token');
            return;
          }

          console.log('✅ Token removido diretamente');
          toast.success('Token OAuth revogado com sucesso');
          await fetchTokens();
          return;
        }
        
        toast.error('Token não encontrado ou sem permissão para revogá-lo');
        return;
      }

      if (!tokenData) {
        toast.error('Token não encontrado');
        return;
      }

      console.log('🔍 Token encontrado:', {
        id: tokenData.id,
        scope: tokenData.scope,
        hasAccessToken: !!tokenData.access_token
      });

      // Tentar revogar token no Google se existir access_token
      if (tokenData.access_token) {
        try {
          console.log('🔐 Tentando revogar token no Google...');
          const revokeResponse = await fetch(`https://oauth2.googleapis.com/revoke?token=${tokenData.access_token}`, {
            method: 'POST',
          });
          
          if (revokeResponse.ok) {
            console.log('✅ Token revogado no Google com sucesso');
          } else {
            const responseText = await revokeResponse.text();
            console.warn('⚠️ Resposta da revogação:', revokeResponse.status, responseText);
            // Continuar mesmo se a revogação no Google falhar
          }
        } catch (revokeError) {
          console.warn('⚠️ Erro ao revogar token no Google:', revokeError);
          // Continuar mesmo se a revogação no Google falhar
        }
      }

      // Remover token do banco local
      console.log('🗑️ Removendo token do banco de dados...');
      const { error: deleteError } = await supabase
        .from('google_oauth_tokens')
        .delete()
        .eq('id', tokenId)
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('❌ Erro ao deletar token do banco:', deleteError);
        toast.error(`Erro ao remover token: ${deleteError.message}`);
        return;
      }

      console.log('✅ Token removido do banco com sucesso');
      toast.success('Token OAuth revogado com sucesso');
      
      // Atualizar lista de tokens
      await fetchTokens();
      
    } catch (error) {
      console.error('❌ Erro completo na revogação:', error);
      
      if (error instanceof Error) {
        toast.error(`Erro ao revogar token: ${error.message}`);
      } else {
        toast.error('Erro desconhecido ao revogar token');
      }
    }
  };

  // Função para revogar TODOS os tokens de uma vez (útil para reset completo)
  const revokeAllTokens = async () => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      console.log('🗑️ Revogando todos os tokens...');

      // Buscar todos os tokens do usuário
      const { data: allTokens, error: fetchError } = await supabase
        .from('google_oauth_tokens')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) {
        console.error('❌ Erro ao buscar tokens:', fetchError);
        toast.error('Erro ao buscar tokens para revogação');
        return;
      }

      if (!allTokens || allTokens.length === 0) {
        toast.info('Nenhum token encontrado para revogar');
        return;
      }

      // Revogar cada token no Google
      for (const token of allTokens) {
        if (token.access_token) {
          try {
            await fetch(`https://oauth2.googleapis.com/revoke?token=${token.access_token}`, {
              method: 'POST',
            });
            console.log(`✅ Token ${token.id.substring(0, 8)} revogado no Google`);
          } catch (error) {
            console.warn(`⚠️ Erro ao revogar token ${token.id.substring(0, 8)} no Google:`, error);
          }
        }
      }

      // Remover todos os tokens do banco
      const { error: deleteError } = await supabase
        .from('google_oauth_tokens')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('❌ Erro ao deletar tokens do banco:', deleteError);
        toast.error('Erro ao remover tokens do banco');
        return;
      }

      console.log('✅ Todos os tokens removidos com sucesso');
      toast.success('Todos os tokens OAuth foram revogados com sucesso');
      await fetchTokens();

    } catch (error) {
      console.error('❌ Erro ao revogar todos os tokens:', error);
      toast.error('Erro ao revogar tokens OAuth');
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
    revokeAllTokens,
    refetch: fetchTokens
  };
}
