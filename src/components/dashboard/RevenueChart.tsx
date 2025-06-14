
import React from 'react';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const revenueData = [
  { name: 'Jan', atual: 4000, anterior: 2400 },
  { name: 'Fev', atual: 3000, anterior: 1398 },
  { name: 'Mar', atual: 2000, anterior: 9800 },
  { name: 'Abr', atual: 2780, anterior: 3908 },
  { name: 'Mai', atual: 1890, anterior: 4800 },
  { name: 'Jun', atual: 2390, anterior: 3800 },
];

export function RevenueChart() {
  return (
    <ChartCard title="Receitas Mensais">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#888" fontSize={12} />
          <YAxis stroke="#888" fontSize={12} />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="atual" 
            name="Ano Atual"
            stroke="#6D8299" 
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            dataKey="anterior" 
            name="Ano Anterior"
            stroke="#aebbc8" 
            strokeWidth={2}
            dot={{ r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
