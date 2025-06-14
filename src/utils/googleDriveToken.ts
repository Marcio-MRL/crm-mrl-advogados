
import { supabase } from '@/integrations/supabase/client';

export class GoogleDriveTokenManager {
  static async fetchToken(userId: string): Promise<string | null> {
    try {
      console.log('🔍 Verificando token do Google Drive para usuário:', userId);
      
      const { data, error } = await supabase
        .from('google_oauth_tokens')
        .select('access_token, expires_at, scope')
        .eq('user_id', userId)
        .or('scope.ilike.%drive%,scope.ilike.%https://www.googleapis.com/auth/drive%')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('❌ Erro ao buscar token do Drive:', error);
        return null;
      }

      if (!data) {
        console.log('⚠️ Nenhum token do Google Drive encontrado');
        return null;
      }

      console.log('✅ Token encontrado:', {
        hasToken: !!data.access_token,
        scope: data.scope,
        expiresAt: data.expires_at
      });

      if (data.access_token) {
        const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
        const isExpired = expiresAt && expiresAt <= new Date();
        
        console.log('🔍 Verificação de expiração:', {
          expiresAt: expiresAt?.toISOString(),
          isExpired,
          timeRemaining: expiresAt ? Math.round((expiresAt.getTime() - Date.now()) / 1000 / 60) + ' minutos' : 'indefinido'
        });
        
        if (!isExpired) {
          console.log('✅ Token do Google Drive válido e ativo');
          return data.access_token;
        } else {
          console.log('⚠️ Token do Google Drive expirado');
          return null;
        }
      } else {
        console.log('⚠️ Token encontrado mas access_token está vazio');
        return null;
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao verificar token do Google Drive:', error);
      return null;
    }
  }

  static isTokenValid(token: string | null): boolean {
    const isValid = !!token && token.length > 0;
    console.log('🔍 Validação de token:', { hasToken: !!token, isValid });
    return isValid;
  }

  static async testTokenConnection(token: string): Promise<boolean> {
    try {
      console.log('🧪 Testando conexão com token...');
      
      const response = await fetch('https://www.googleapis.com/drive/v3/about?fields=user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const isValid = response.ok;
      console.log('🧪 Resultado do teste de conexão:', {
        status: response.status,
        isValid
      });

      return isValid;
    } catch (error) {
      console.error('❌ Erro ao testar token:', error);
      return false;
    }
  }
}
