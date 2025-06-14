
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { BankIntegrationService } from '@/services/bankIntegration';
import { BankIntegrationStatus, BankSyncResult } from '@/types/bankIntegration';
import { useGoogleOAuth } from '@/hooks/useGoogleOAuth';

export function useBankIntegration() {
  const [status, setStatus] = useState<BankIntegrationStatus>({
    connected: false,
    lastSync: null,
    totalTransactions: 0,
    lastTransaction: null,
    syncInProgress: false
  });
  const [syncProgress, setSyncProgress] = useState(0);
  const { tokens } = useGoogleOAuth();

  // Verificar se tem token do Google Sheets
  const sheetsToken = tokens.find(token => 
    token.scope?.includes('spreadsheets') || token.scope?.includes('drive')
  );

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      console.log('🔍 Carregando status da integração bancária...');
      const statusData = await BankIntegrationService.getBankIntegrationStatus();
      console.log('📊 Status carregado:', statusData);
      setStatus(prev => ({ ...prev, ...statusData }));
    } catch (error) {
      console.error('❌ Erro ao carregar status:', error);
      toast.error('Erro ao carregar status da integração bancária');
    }
  };

  const handleSync = async () => {
    if (!sheetsToken) {
      toast.error('Conecte-se ao Google Sheets primeiro nas configurações');
      return;
    }

    setStatus(prev => ({ ...prev, syncInProgress: true }));
    setSyncProgress(0);

    try {
      console.log('🔄 Iniciando sincronização com planilha bancária...');
      console.log('🔑 Token disponível:', !!sheetsToken.access_token);
      console.log('🔑 Token scope:', sheetsToken.scope);
      toast.info('Iniciando sincronização com planilha bancária...');
      
      // Simular progresso
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result: BankSyncResult = await BankIntegrationService.syncWithBankSheet(sheetsToken.access_token);
      
      clearInterval(progressInterval);
      setSyncProgress(100);

      console.log('✅ Resultado da sincronização:', result);

      if (result.success) {
        toast.success(
          `Sincronização concluída! ${result.newTransactions} novas transações importadas.`
        );
        
        // Atualizar status após sucesso
        await loadStatus();
      } else {
        console.error('❌ Erros na sincronização:', result.errors);
        
        // Tratamento mais específico de erros
        const errorMessage = result.errors[0] || 'Erro desconhecido';
        
        if (errorMessage.includes('não encontrada')) {
          toast.error('Planilha "BTG - Entradas e Saídas Caixa" não encontrada. Verifique se ela existe no Google Drive e se o nome está correto.');
        } else if (errorMessage.includes('vazia')) {
          toast.error('A planilha foi encontrada mas está vazia. Adicione dados de transações bancárias antes de sincronizar.');
        } else if (errorMessage.includes('token') || errorMessage.includes('401')) {
          toast.error('Token de acesso expirado ou inválido. Reconecte-se ao Google Sheets nas configurações.');
        } else if (errorMessage.includes('403')) {
          toast.error('Acesso negado à planilha. Verifique se você tem permissão de leitura na planilha "BTG - Entradas e Saídas Caixa".');
        } else {
          toast.error(`Erro na sincronização: ${errorMessage}`);
        }
      }

    } catch (error) {
      console.error('❌ Erro inesperado na sincronização:', error);
      
      // Log detalhado do erro para debug
      if (error instanceof Error) {
        console.error('❌ Mensagem do erro:', error.message);
        console.error('❌ Stack do erro:', error.stack);
        
        // Tratamento de erros específicos
        if (error.message.includes('não encontrada')) {
          toast.error('Planilha "BTG - Entradas e Saídas Caixa" não encontrada no Google Drive.');
        } else if (error.message.includes('vazia')) {
          toast.error('A planilha existe mas não contém dados para sincronizar.');
        } else if (error.message.includes('401') || error.message.includes('token')) {
          toast.error('Problema de autenticação. Reconecte-se ao Google Sheets.');
        } else {
          toast.error(`Erro: ${error.message}`);
        }
      } else {
        toast.error('Erro inesperado durante a sincronização. Verifique os logs do console para mais detalhes.');
      }
    } finally {
      setStatus(prev => ({ ...prev, syncInProgress: false }));
      setSyncProgress(0);
    }
  };

  return {
    status,
    syncProgress,
    sheetsToken,
    handleSync,
    loadStatus
  };
}
