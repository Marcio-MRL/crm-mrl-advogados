
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
      <>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Saldo Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Receitas (Mês)</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Despesas (Mês)</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
      </>
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
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Saldo Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <DollarSign className="h-5 w-5 text-gray-500" />
            <span className={`text-2xl font-bold ${
              summary.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(summary.currentBalance)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Atualizado em {formatDate(summary.lastUpdate)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Receitas (Mês)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5 text-green-500" />
            <span className="text-2xl font-bold text-green-600">
              {formatCurrency(summary.monthlyRevenue)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Total de entradas no mês atual
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Despesas (Mês)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <ArrowDownRight className="h-5 w-5 text-red-500" />
            <span className="text-2xl font-bold text-red-600">
              {formatCurrency(summary.monthlyExpenses)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Total de saídas no mês atual
          </p>
        </CardContent>
      </Card>
    </>
  );
}
