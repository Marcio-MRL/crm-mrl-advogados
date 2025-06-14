
import { supabase } from '@/integrations/supabase/client';
import { BankTransactionRaw } from './types';

export class BankTransactionSaver {
  static async saveTransaction(transaction: BankTransactionRaw): Promise<boolean> {
    try {
      // Verificar se transação já existe
      const { data: existing, error: checkError } = await supabase
        .from('bank_transactions')
        .select('id')
        .eq('data', transaction.data)
        .eq('valor', transaction.valor)
        .eq('descricao', transaction.descricao)
        .limit(1);

      if (checkError) {
        console.error('❌ Erro ao verificar transação existente:', checkError);
        return false;
      }

      if (existing && existing.length > 0) {
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
          raw_data: transaction.raw_data,
          user_id: (await supabase.auth.getUser()).data.user?.id
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
}
