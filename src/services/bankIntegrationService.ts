
import { BankTransaction, BankSyncResult } from '@/types/bankIntegration';
import { supabase } from '@/integrations/supabase/client';

export class BankIntegrationService {
  private static BANK_SHEET_NAME = 'BTG - Entradas e Saídas Caixa';
  
  static async syncWithBankSheet(sheetsToken: string): Promise<BankSyncResult> {
    try {
      console.log('🏦 Iniciando sincronização com planilha bancária...');
      
      // Primeiro, buscar a planilha do BTG
      const sheetData = await this.fetchBankSheetData(sheetsToken);
      
      if (!sheetData || sheetData.length === 0) {
        throw new Error('Nenhum dado encontrado na planilha bancária');
      }

      // Processar e salvar transações
      const processResult = await this.processBankTransactions(sheetData);
      
      console.log('✅ Sincronização bancária concluída:', processResult);
      return processResult;

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

  private static async fetchBankSheetData(token: string): Promise<any[]> {
    // Primeiro, listar todas as planilhas para encontrar a do BTG
    const listResponse = await fetch(
      'https://www.googleapis.com/drive/v3/files?q=name="BTG - Entradas e Saídas Caixa" and mimeType="application/vnd.google-apps.spreadsheet"',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!listResponse.ok) {
      throw new Error('Erro ao buscar planilha bancária');
    }

    const listData = await listResponse.json();
    
    if (!listData.files || listData.files.length === 0) {
      throw new Error('Planilha "BTG - Entradas e Saídas Caixa" não encontrada');
    }

    const spreadsheetId = listData.files[0].id;
    console.log('📊 Planilha bancária encontrada:', spreadsheetId);

    // Buscar dados da primeira aba
    const dataResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1?majorDimension=ROWS`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!dataResponse.ok) {
      throw new Error('Erro ao ler dados da planilha bancária');
    }

    const data = await dataResponse.json();
    return data.values || [];
  }

  private static async processBankTransactions(sheetData: any[]): Promise<BankSyncResult> {
    const result: BankSyncResult = {
      success: false,
      newTransactions: 0,
      totalProcessed: 0,
      errors: [],
      lastSyncDate: new Date().toISOString()
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
        const transaction = this.mapRowToBankTransaction(headers, row, i + 2);
        
        if (transaction) {
          const saved = await this.saveBankTransaction(transaction);
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

  private static mapRowToBankTransaction(headers: string[], row: any[], rowNumber: number): BankTransaction | null {
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

  private static async saveBankTransaction(transaction: BankTransaction): Promise<boolean> {
    try {
      // Verificar se transação já existe
      const { data: existing } = await supabase
        .from('bank_transactions')
        .select('id')
        .eq('data', transaction.data)
        .eq('valor', transaction.valor)
        .eq('descricao', transaction.descricao)
        .single();

      if (existing) {
        console.log('📋 Transação já existe, pulando...');
        return false;
      }

      // Salvar nova transação
      const { data, error } = await supabase
        .from('bank_transactions')
        .insert({
          data: transaction.data,
          credito_debito: transaction.credito_debito,
          valor: transaction.valor,
          descricao: transaction.descricao,
          mensagem: transaction.mensagem,
          documento: transaction.documento,
          pagador_recebedor: transaction.pagador_recebedor,
          nome_pagador_recebedor: transaction.nome_pagador_recebedor,
          banco_pagador_recebedor: transaction.banco_pagador_recebedor,
          agencia_pagador_recebedor: transaction.agencia_pagador_recebedor,
          conta_pagador_recebedor: transaction.conta_pagador_recebedor,
          identificador: transaction.identificador,
          raw_data: transaction.raw_data
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao salvar transação:', error);
        return false;
      }

      console.log('✅ Transação salva:', data);
      return true;

    } catch (error) {
      console.error('❌ Erro ao salvar transação bancária:', error);
      return false;
    }
  }

  static async getBankIntegrationStatus(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('bank_transactions')
        .select('*')
        .order('data', { ascending: false })
        .limit(1);

      if (error) {
        console.error('❌ Erro ao buscar status:', error);
        return {
          connected: false,
          lastSync: null,
          totalTransactions: 0,
          lastTransaction: null
        };
      }

      const { count } = await supabase
        .from('bank_transactions')
        .select('*', { count: 'exact', head: true });

      return {
        connected: true,
        lastSync: data?.[0]?.created_at || null,
        totalTransactions: count || 0,
        lastTransaction: data?.[0] || null
      };

    } catch (error) {
      console.error('❌ Erro ao verificar status:', error);
      return {
        connected: false,
        lastSync: null,
        totalTransactions: 0,
        lastTransaction: null
      };
    }
  }
}
