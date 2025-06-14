
import { BankDataMapper } from './dataMapper';
import { BankTransactionSaver } from './transactionSaver';
import { ProcessResult } from './types';

export class BankDataProcessor {
  static async processTransactions(sheetData: any[]): Promise<ProcessResult> {
    const result: ProcessResult = {
      success: false,
      newTransactions: 0,
      totalProcessed: 0,
      errors: []
    };

    if (sheetData.length < 2) {
      result.errors.push('Planilha não contém dados suficientes');
      return result;
    }

    // Primeira linha contém cabeçalhos
    const headers = sheetData[0];
    const dataRows = sheetData.slice(1);

    console.log('📋 Cabeçalhos encontrados:', headers);
    console.log('📊 Total de linhas de dados:', dataRows.length);

    for (let i = 0; i < dataRows.length; i++) {
      try {
        const row = dataRows[i];
        
        // Mapear dados conforme estrutura da planilha
        const transaction = BankDataMapper.mapRowToTransaction(headers, row, i + 2);
        
        if (transaction) {
          const saved = await BankTransactionSaver.saveTransaction(transaction);
          if (saved) {
            result.newTransactions++;
          }
        }
        
        result.totalProcessed++;
      } catch (error) {
        console.error(`❌ Erro ao processar linha ${i + 2}:`, error);
        result.errors.push(`Linha ${i + 2}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }

    result.success = result.errors.length === 0 || result.newTransactions > 0;
    return result;
  }
}
