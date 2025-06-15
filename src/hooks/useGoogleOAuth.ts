
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

    setLoading(true);
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

  const revokeOAuthToken = async (tokenId: string) => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      console.log('🗑️ Iniciando revogação do token:', tokenId);

      const { data: tokenData, error: fetchError } = await supabase
        .from('google_oauth_tokens')
        .select('access_token')
        .eq('id', tokenId)
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // Ignore "No rows found"
        console.error('❌ Erro ao buscar token para revogação:', fetchError);
        toast.error('Token não encontrado ou sem permissão para revogá-lo');
        return;
      }
      
      if (tokenData?.access_token) {
        try {
          console.log('🔐 Tentando revogar token no Google...');
          await fetch(`https://oauth2.googleapis.com/revoke?token=${tokenData.access_token}`, {
            method: 'POST',
          });
        } catch (revokeError) {
          console.warn('⚠️ Erro ao revogar token no Google:', revokeError);
        }
      }

      console.log('🗑️ Removendo token do banco de dados...');
      const { error: deleteError } = await supabase
        .from('google_oauth_tokens')
        .delete()
        .eq('id', tokenId)
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      console.log('✅ Token removido do banco com sucesso');
      toast.success('Token OAuth revogado com sucesso');
      await fetchTokens();
      
    } catch (error) {
      console.error('❌ Erro completo na revogação:', error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido ao revogar token';
      toast.error(`Erro ao revogar token: ${message}`);
      throw error;
    }
  };

  const revokeAllTokens = async () => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      console.log('🗑️ Revogando todos os tokens do usuário...');

      const { data: allTokens, error: fetchError } = await supabase
        .from('google_oauth_tokens')
        .select('id, access_token')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      for (const token of allTokens) {
        if (token.access_token) {
          try {
            await fetch(`https://oauth2.googleapis.com/revoke?token=${token.access_token}`, {
              method: 'POST',
            });
          } catch (error) {
            console.warn(`⚠️ Erro ao revogar token ${token.id.substring(0, 8)} no Google:`, error);
          }
        }
      }

      const { error: deleteError } = await supabase
        .from('google_oauth_tokens')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      console.log('✅ Todos os tokens removidos com sucesso');
      toast.success('Todos os tokens OAuth foram revogados com sucesso');
      await fetchTokens();

    } catch (error) {
      console.error('❌ Erro ao revogar todos os tokens:', error);
      const message = error instanceof Error ? error.message : 'Erro ao revogar todos os tokens OAuth';
      toast.error(message);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchTokens();
    } else {
      setLoading(false);
      setTokens([]);
    }
  }, [user]);

  return {
    tokens,
    loading,
    revokeOAuthToken,
    revokeAllTokens,
    refetch: fetchTokens
  };
}
