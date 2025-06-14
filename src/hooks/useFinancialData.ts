
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FinancialSummary {
  currentBalance: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  totalTransactions: number;
  lastUpdate: string;
}

interface MonthlyData {
  month: string;
  receitas: number;
  despesas: number;
}

export function useFinancialData() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    try {
      setIsLoading(true);
      
      // Buscar todas as transações do usuário atual
      const { data: transactions, error } = await supabase
        .from('bank_transactions')
        .select('*')
        .order('data', { ascending: false });

      if (error) {
        console.error('Erro ao carregar transações:', error);
        toast.error('Erro ao carregar dados financeiros');
        return;
      }

      if (!transactions || transactions.length === 0) {
        setSummary({
          currentBalance: 0,
          monthlyRevenue: 0,
          monthlyExpenses: 0,
          totalTransactions: 0,
          lastUpdate: new Date().toISOString()
        });
        setMonthlyData([]);
        return;
      }

      // Calcular resumo financeiro
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let totalBalance = 0;
      let monthlyRevenue = 0;
      let monthlyExpenses = 0;

      // Dados mensais para o gráfico (últimos 6 meses)
      const monthlyMap = new Map<string, { receitas: number; despesas: number }>();
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - i, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
        monthlyMap.set(key, { receitas: 0, despesas: 0 });
      }

      transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.data);
        const transactionMonth = transactionDate.getMonth();
        const transactionYear = transactionDate.getFullYear();
        const monthKey = `${transactionYear}-${String(transactionMonth + 1).padStart(2, '0')}`;
        
        const valor = Number(transaction.valor);
        
        // Calcular saldo total
        if (transaction.credito_debito === 'Crédito') {
          totalBalance += valor;
        } else {
          totalBalance -= valor;
        }

        // Calcular receitas e despesas do mês atual
        if (transactionMonth === currentMonth && transactionYear === currentYear) {
          if (transaction.credito_debito === 'Crédito') {
            monthlyRevenue += valor;
          } else {
            monthlyExpenses += valor;
          }
        }

        // Agrupar dados mensais para o gráfico
        if (monthlyMap.has(monthKey)) {
          const monthData = monthlyMap.get(monthKey)!;
          if (transaction.credito_debito === 'Crédito') {
            monthData.receitas += valor;
          } else {
            monthData.despesas += valor;
          }
        }
      });

      setSummary({
        currentBalance: totalBalance,
        monthlyRevenue,
        monthlyExpenses,
        totalTransactions: transactions.length,
        lastUpdate: transactions[0]?.created_at || new Date().toISOString()
      });

      // Converter dados mensais para array
      const chartData: MonthlyData[] = [];
      monthlyMap.forEach((data, key) => {
        const [year, month] = key.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
        
        chartData.push({
          month: monthName,
          receitas: data.receitas,
          despesas: data.despesas
        });
      });

      setMonthlyData(chartData);

    } catch (error) {
      console.error('Erro ao processar dados financeiros:', error);
      toast.error('Erro ao processar dados financeiros');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    summary,
    monthlyData,
    isLoading,
    refetch: loadFinancialData
  };
}
