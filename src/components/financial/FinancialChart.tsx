
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinancialData } from '@/hooks/useFinancialData';
import { Skeleton } from "@/components/ui/skeleton";

export function FinancialChart() {
  const { monthlyData, isLoading } = useFinancialData();

  if (isLoading) {
    return (
      <div className="w-full h-80">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (!monthlyData || monthlyData.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Nenhum dado disponível para exibir</p>
          <p className="text-sm text-gray-400 mt-2">
            Sincronize suas transações bancárias para ver o gráfico
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={monthlyData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis 
            tickFormatter={(value) => 
              `R$ ${value.toLocaleString('pt-BR', { 
                minimumFractionDigits: 0, 
                maximumFractionDigits: 0 
              })}`
            } 
          />
          <Tooltip 
            formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
            labelFormatter={(label) => `Mês: ${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="receitas" 
            name="Receitas"
            stroke="#4f46e5" 
            fill="#c7d2fe" 
            activeDot={{ r: 8 }} 
            strokeWidth={2}
          />
          <Area 
            type="monotone" 
            dataKey="despesas" 
            name="Despesas"
            stroke="#ef4444" 
            fill="#fecaca" 
            strokeWidth={2} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
