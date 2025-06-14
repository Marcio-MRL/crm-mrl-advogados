
import { supabase } from '@/integrations/supabase/client';

export class BankStatusService {
  static async getIntegrationStatus(): Promise<any> {
    try {
      // Buscar última transação
      const { data: lastTransaction, error: lastError } = await supabase
        .from('bank_transactions')
        .select('id, data, credito_debito, valor, descricao, created_at')
        .order('data', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (lastError && lastError.code !== 'PGRST116') {
        console.error('❌ Erro ao buscar última transação:', lastError);
      }

      // Contar total de transações
      const { count, error: countError } = await supabase
        .from('bank_transactions')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('❌ Erro ao contar transações:', countError);
      }

      return {
        connected: true,
        lastSync: lastTransaction?.created_at || null,
        totalTransactions: count || 0,
        lastTransaction: lastTransaction || null
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
