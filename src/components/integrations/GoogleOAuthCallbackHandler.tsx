
import React, { useEffect } from 'react';
import { useGoogleOAuthComplete } from '@/hooks/useGoogleOAuthComplete';
import { toast } from 'sonner';

export function GoogleOAuthCallbackHandler() {
  const { handleOAuthCallback } = useGoogleOAuthComplete();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      console.log('GoogleOAuthCallbackHandler: Processando callback', {
        hasCode: !!code,
        hasState: !!state,
        hasError: !!error,
      });

      const notifyOpenerAndClose = (message: object) => {
        try {
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage(message, window.location.origin);
            setTimeout(() => window.close(), 300);
          } else {
             window.location.href = '/configuracoes';
          }
        } catch (e) {
          console.error('Erro ao comunicar com a janela principal:', e);
          window.location.href = '/configuracoes';
        }
      };

      if (error) {
        toast.error(`Erro na autenticação: ${error}`);
        notifyOpenerAndClose({ type: 'GOOGLE_OAUTH_ERROR', error });
        return;
      }

      if (code && state) {
        try {
          const result = await handleOAuthCallback(code, state);
          notifyOpenerAndClose({ type: 'GOOGLE_OAUTH_SUCCESS', service: result.service });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
          toast.error(`Erro no processamento: ${errorMessage}`);
          notifyOpenerAndClose({ type: 'GOOGLE_OAUTH_ERROR', error: errorMessage });
        }
      } else {
        toast.error('Parâmetros de callback inválidos.');
        notifyOpenerAndClose({ type: 'GOOGLE_OAUTH_ERROR', error: 'Parâmetros inválidos' });
      }
    };

    handleCallback();
  }, [handleOAuthCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processando autenticação...</p>
        <p className="text-sm text-gray-500 mt-2">Esta janela deve fechar automaticamente.</p>
      </div>
    </div>
  );
}
