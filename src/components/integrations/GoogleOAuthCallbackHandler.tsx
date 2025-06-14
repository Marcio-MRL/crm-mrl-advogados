
import React, { useEffect } from 'react';
import { useGoogleOAuthComplete } from '@/hooks/useGoogleOAuthComplete';

export function GoogleOAuthCallbackHandler() {
  const { handleOAuthCallback } = useGoogleOAuthComplete();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        // Enviar erro para o popup pai
        window.opener?.postMessage({
          type: 'GOOGLE_OAUTH_ERROR',
          error: error
        }, window.location.origin);
        window.close();
        return;
      }

      if (code && state) {
        try {
          await handleOAuthCallback(code, state);
          
          // Enviar sucesso para o popup pai
          window.opener?.postMessage({
            type: 'GOOGLE_OAUTH_SUCCESS',
            service: JSON.parse(state).service
          }, window.location.origin);
          
          window.close();
        } catch (error) {
          console.error('Erro no callback:', error);
          
          // Enviar erro para o popup pai
          window.opener?.postMessage({
            type: 'GOOGLE_OAUTH_ERROR',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
          }, window.location.origin);
          
          window.close();
        }
      }
    };

    handleCallback();
  }, [handleOAuthCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processando autenticação...</p>
      </div>
    </div>
  );
}
