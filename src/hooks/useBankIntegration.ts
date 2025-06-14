
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { BankIntegrationService } from '@/services/bankIntegrationService';
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
      const statusData = await BankIntegrationService.getBankIntegrationStatus();
      setStatus(prev => ({ ...prev, ...statusData }));
    } catch (error) {
      console.error('❌ Erro ao carregar status:', error);
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
      toast.info('Iniciando sincronização com planilha bancária...');
      
      // Simular progresso
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result: BankSyncResult = await BankIntegrationService.syncWithBankSheet(sheetsToken.access_token);
      
      clearInterval(progressInterval);
      setSyncProgress(100);

      if (result.success) {
        toast.success(
          `Sincronização concluída! ${result.newTransactions} novas transações importadas.`
        );
        
        // Atualizar status
        await loadStatus();
      } else {
        toast.error(`Erro na sincronização: ${result.errors.join(', ')}`);
      }

    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
      toast.error('Erro inesperado durante a sincronização');
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
