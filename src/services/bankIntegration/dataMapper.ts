
import { BankTransactionRaw } from './types';

export class BankDataMapper {
  static mapRowToTransaction(headers: string[], row: any[], rowNumber: number): BankTransactionRaw | null {
    if (!row || row.length === 0) {
      return null;
    }

    // Mapear colunas baseado na estrutura da planilha BTG
    const getColumnValue = (columnName: string): string => {
      const index = headers.findIndex(h => h?.toLowerCase().includes(columnName.toLowerCase()));
      return index >= 0 ? (row[index] || '').toString().trim() : '';
    };

    const data = getColumnValue('data');
    const creditoDebito = getColumnValue('crédito/débito') || getColumnValue('crédito') || getColumnValue('débito');
    const valor = getColumnValue('valor');
    const descricao = getColumnValue('descrição') || getColumnValue('mensagem');

    // Validações básicas
    if (!data || !valor || !descricao) {
      console.warn(`⚠️ Linha ${rowNumber}: dados insuficientes`);
      return null;
    }

    // Converter valor para número
    const valorNumerico = this.parseValue(valor);
    if (valorNumerico === 0) {
      console.warn(`⚠️ Linha ${rowNumber}: valor inválido`);
      return null;
    }

    // Determinar tipo baseado no valor ou coluna específica
    let tipo: 'Crédito' | 'Débito' = 'Crédito';
    if (creditoDebito.toLowerCase().includes('débito') || valorNumerico < 0) {
      tipo = 'Débito';
    }

    return {
      id: `btg-${rowNumber}-${Date.now()}`,
      data: this.parseDate(data),
      credito_debito: tipo,
      valor: Math.abs(valorNumerico),
      descricao: descricao,
      mensagem: getColumnValue('mensagem'),
      documento: getColumnValue('documento'),
      pagador_recebedor: getColumnValue('pagador/recebedor'),
      nome_pagador_recebedor: getColumnValue('nome'),
      banco_pagador_recebedor: getColumnValue('banco'),
      agencia_pagador_recebedor: getColumnValue('agência'),
      conta_pagador_recebedor: getColumnValue('conta'),
      identificador: getColumnValue('identificador'),
      raw_data: { headers, row, rowNumber }
    };
  }

  private static parseValue(valueStr: string): number {
    if (!valueStr) return 0;
    
    // Remove símbolos de moeda e espaços
    const cleaned = valueStr.replace(/[R$\s]/g, '');
    
    // Trata vírgula como separador decimal
    const normalized = cleaned.replace(',', '.');
    
    const number = parseFloat(normalized);
    return isNaN(number) ? 0 : number;
  }

  private static parseDate(dateStr: string): string {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    
    try {
      // Tenta diferentes formatos de data
      const formats = [
        /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // DD/MM/YYYY
        /(\d{4})-(\d{1,2})-(\d{1,2})/, // YYYY-MM-DD
        /(\d{1,2})-(\d{1,2})-(\d{4})/, // DD-MM-YYYY
      ];

      for (const format of formats) {
        const match = dateStr.match(format);
        if (match) {
          const [, p1, p2, p3] = match;
          
          // Para formato DD/MM/YYYY ou DD-MM-YYYY
          if (format === formats[0] || format === formats[2]) {
            const day = p1.padStart(2, '0');
            const month = p2.padStart(2, '0');
            const year = p3;
            return `${year}-${month}-${day}`;
          }
          
          // Para formato YYYY-MM-DD
          if (format === formats[1]) {
            return `${p1}-${p2.padStart(2, '0')}-${p3.padStart(2, '0')}`;
          }
        }
      }
      
      // Se não conseguir parsear, tenta Date.parse
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0];
      }
      
    } catch (error) {
      console.warn('⚠️ Erro ao parsear data:', dateStr);
    }
    
    return new Date().toISOString().split('T')[0];
  }
}
