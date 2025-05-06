
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', receitas: 32000, despesas: 24000 },
  { month: 'Fev', receitas: 38000, despesas: 28000 },
  { month: 'Mar', receitas: 35000, despesas: 30000 },
  { month: 'Abr', receitas: 43000, despesas: 31000 },
  { month: 'Mai', receitas: 48350, despesas: 32768 },
  { month: 'Jun', receitas: 0, despesas: 0 }, // Previsão
];

export function FinancialChart() {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
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
