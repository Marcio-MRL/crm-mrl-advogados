
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  data: string;
  descricao: string;
  categoria: string | null;
  tipo: 'entrada' | 'saida';
  valor: number;
  credito_debito: string;
  mensagem?: string;
  created_at: string;
}

export function useFinancialTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      
      const { data: bankTransactions, error } = await supabase
        .from('bank_transactions')
        .select('*')
        .order('data', { ascending: false });

      if (error) {
        console.error('Erro ao carregar transações:', error);
        toast.error('Erro ao carregar transações');
        return;
      }

      // Converter transações bancárias para o formato esperado
      const formattedTransactions: Transaction[] = (bankTransactions || []).map(transaction => ({
        id: transaction.id,
        data: transaction.data,
        descricao: transaction.descricao,
        categoria: transaction.categoria || (transaction.credito_debito === 'Crédito' ? 'Receitas' : 'Despesas'),
        tipo: transaction.credito_debito === 'Crédito' ? 'entrada' : 'saida',
        valor: Number(transaction.valor),
        credito_debito: transaction.credito_debito,
        mensagem: transaction.mensagem,
        created_at: transaction.created_at
      }));

      setTransactions(formattedTransactions);

    } catch (error) {
      console.error('Erro ao processar transações:', error);
      toast.error('Erro ao processar transações');
    } finally {
      setIsLoading(false);
    }
  };

  const uniqueCategories = useMemo(() => 
    Array.from(new Set(transactions.map(t => t.categoria).filter(Boolean))), 
    [transactions]
  );

  return {
    transactions,
    uniqueCategories,
    isLoading,
    refetch: loadTransactions
  };
}
