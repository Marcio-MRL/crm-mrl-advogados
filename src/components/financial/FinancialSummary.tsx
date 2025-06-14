
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { useFinancialData } from '@/hooks/useFinancialData';
import { Skeleton } from "@/components/ui/skeleton";

export function FinancialSummary() {
  const { summary, isLoading } = useFinancialData();

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 text-center">Saldo Atual</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Skeleton className="h-6 w-32 mb-1 mx-auto" />
            <Skeleton className="h-3 w-24 mx-auto" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 text-center">Receitas (Mês)</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Skeleton className="h-6 w-32 mb-1 mx-auto" />
            <Skeleton className="h-3 w-24 mx-auto" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 text-center">Despesas (Mês)</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Skeleton className="h-6 w-32 mb-1 mx-auto" />
            <Skeleton className="h-3 w-24 mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum dado financeiro disponível</p>
        <p className="text-sm text-gray-400 mt-2">
          Sincronize suas transações bancárias na aba Integrações
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 text-center">Saldo Atual</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className={`text-lg font-bold ${
              summary.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(summary.currentBalance)}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Atualizado em {formatDate(summary.lastUpdate)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 text-center">Receitas (Mês)</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <ArrowUpRight className="h-4 w-4 text-green-500" />
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(summary.monthlyRevenue)}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Total de entradas no mês atual
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500 text-center">Despesas (Mês)</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <ArrowDownRight className="h-4 w-4 text-red-500" />
            <span className="text-lg font-bold text-red-600">
              {formatCurrency(summary.monthlyExpenses)}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Total de saídas no mês atual
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
