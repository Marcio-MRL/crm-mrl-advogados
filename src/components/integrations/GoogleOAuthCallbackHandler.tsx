
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
        fullURL: window.location.href
      });

      if (error) {
        console.error('GoogleOAuthCallbackHandler: Erro do Google:', error);
        
        // Usar postMessage mais robusto para o popup pai
        try {
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
              type: 'GOOGLE_OAUTH_ERROR',
              error: error
            }, '*');
            window.close();
          } else {
            // Se não é popup, mostrar erro na própria página
            toast.error(`Erro na autenticação: ${error}`);
            setTimeout(() => {
              window.location.href = '/configuracoes';
            }, 2000);
          }
        } catch (e) {
          console.error('Erro ao enviar mensagem para popup pai:', e);
          toast.error(`Erro na autenticação: ${error}`);
          setTimeout(() => {
            window.location.href = '/configuracoes';
          }, 2000);
        }
        return;
      }

      if (code && state) {
        try {
          console.log('GoogleOAuthCallbackHandler: Iniciando processamento do callback...');
          
          const result = await handleOAuthCallback(code, state);
          console.log('GoogleOAuthCallbackHandler: Callback processado com sucesso:', result);
          
          // Enviar sucesso para o popup pai com tratamento robusto
          try {
            if (window.opener && !window.opener.closed) {
              const parsedState = JSON.parse(state);
              window.opener.postMessage({
                type: 'GOOGLE_OAUTH_SUCCESS',
                service: parsedState.service
              }, '*');
              
              // Aguardar um pouco antes de fechar para garantir que a mensagem foi enviada
              setTimeout(() => {
                window.close();
              }, 500);
            } else {
              // Se não é popup, redirecionar para configurações
              toast.success('Integração conectada com sucesso!');
              setTimeout(() => {
                window.location.href = '/configuracoes';
              }, 1000);
            }
          } catch (e) {
            console.error('Erro ao comunicar com popup pai:', e);
            toast.success('Integração conectada com sucesso!');
            setTimeout(() => {
              window.location.href = '/configuracoes';
            }, 1000);
          }
          
        } catch (error) {
          console.error('GoogleOAuthCallbackHandler: Erro no processamento:', error);
          
          const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no processamento';
          
          // Enviar erro para o popup pai com tratamento robusto
          try {
            if (window.opener && !window.opener.closed) {
              window.opener.postMessage({
                type: 'GOOGLE_OAUTH_ERROR',
                error: errorMessage
              }, '*');
              
              setTimeout(() => {
                window.close();
              }, 500);
            } else {
              // Se não é popup, mostrar erro e redirecionar
              toast.error(`Erro no processamento: ${errorMessage}`);
              setTimeout(() => {
                window.location.href = '/configuracoes';
              }, 2000);
            }
          } catch (e) {
            console.error('Erro ao comunicar erro para popup pai:', e);
            toast.error(`Erro no processamento: ${errorMessage}`);
            setTimeout(() => {
              window.location.href = '/configuracoes';
            }, 2000);
          }
        }
      } else {
        console.warn('GoogleOAuthCallbackHandler: Parâmetros inválidos', { code, state });
        
        try {
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage({
              type: 'GOOGLE_OAUTH_ERROR',
              error: 'Parâmetros de callback inválidos'
            }, '*');
            
            setTimeout(() => {
              window.close();
            }, 500);
          } else {
            toast.error('Parâmetros de callback inválidos');
            setTimeout(() => {
              window.location.href = '/configuracoes';
            }, 2000);
          }
        } catch (e) {
          console.error('Erro ao comunicar parâmetros inválidos:', e);
          toast.error('Parâmetros de callback inválidos');
          setTimeout(() => {
            window.location.href = '/configuracoes';
          }, 2000);
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
        <p className="text-sm text-gray-500 mt-2">Esta janela deve fechar automaticamente</p>
      </div>
    </div>
  );
}
