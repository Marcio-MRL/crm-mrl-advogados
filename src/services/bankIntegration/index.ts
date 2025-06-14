
import { BankSheetFetcher } from './sheetFetcher';
import { BankDataProcessor } from './dataProcessor';
import { BankStatusService } from './statusService';
import { BankSyncResult } from '@/types/bankIntegration';

export class BankIntegrationService {
  static async syncWithBankSheet(sheetsToken: string, spreadsheetId?: string): Promise<BankSyncResult> {
    try {
      console.log('🏦 Iniciando sincronização com planilha bancária...');
      console.log('📊 Planilha ID:', spreadsheetId || 'Busca automática');
      
      // Buscar dados da planilha
      const sheetData = await BankSheetFetcher.fetchSheetData(sheetsToken, spreadsheetId);
      
      if (!sheetData || sheetData.length === 0) {
        throw new Error('Nenhum dado encontrado na planilha bancária');
      }

      // Processar e salvar transações
      const processResult = await BankDataProcessor.processTransactions(sheetData);
      
      console.log('✅ Sincronização bancária concluída:', processResult);
      
      return {
        success: processResult.success,
        newTransactions: processResult.newTransactions,
        totalProcessed: processResult.totalProcessed,
        errors: processResult.errors,
        lastSyncDate: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Erro na sincronização bancária:', error);
      return {
        success: false,
        newTransactions: 0,
        totalProcessed: 0,
        errors: [error instanceof Error ? error.message : 'Erro desconhecido'],
        lastSyncDate: new Date().toISOString()
      };
    }
  }

  static async getBankIntegrationStatus(): Promise<any> {
    return BankStatusService.getIntegrationStatus();
  }
}
