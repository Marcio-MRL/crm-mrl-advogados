
import { supabase } from '@/integrations/supabase/client';

export class GoogleDriveTokenManager {
  static async fetchToken(userId: string): Promise<string | null> {
    try {
      console.log('Verificando token do Google Drive...');
      
      const { data, error } = await supabase
        .from('google_oauth_tokens')
        .select('access_token, expires_at, scope')
        .eq('user_id', userId)
        .or('scope.like.%drive%,scope.like.%https://www.googleapis.com/auth/drive%')
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar token do Drive:', error);
        return null;
      }

      console.log('Token encontrado:', data);

      if (data && data.access_token) {
        const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
        const isExpired = expiresAt && expiresAt <= new Date();
        
        console.log('Token expira em:', expiresAt);
        console.log('Token expirado:', isExpired);
        
        if (!isExpired) {
          console.log('Token do Google Drive configurado com sucesso');
          return data.access_token;
        } else {
          console.log('Token do Google Drive expirado');
          return null;
        }
      } else {
        console.log('Nenhum token do Google Drive encontrado');
        return null;
      }
    } catch (error) {
      console.error('Erro ao verificar token do Google Drive:', error);
      return null;
    }
  }

  static isTokenValid(token: string | null): boolean {
    return !!token;
  }
}
