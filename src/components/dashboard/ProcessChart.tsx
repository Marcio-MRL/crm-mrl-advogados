
import React from 'react';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const processData = [
  { name: 'Tributário', ativos: 40, concluídos: 24 },
  { name: 'Trabalhista', ativos: 30, concluídos: 13 },
  { name: 'Cível', ativos: 20, concluídos: 98 },
  { name: 'Empresarial', ativos: 27, concluídos: 39 },
  { name: 'Contratos', ativos: 18, concluídos: 48 },
];

export function ProcessChart() {
  return (
    <ChartCard title="Processos por Área">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={processData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#888" fontSize={12} />
          <YAxis stroke="#888" fontSize={12} />
          <Tooltip />
          <Legend />
          <Bar dataKey="ativos" name="Em Andamento" fill="#6D8299" radius={[4, 4, 0, 0]} />
          <Bar dataKey="concluídos" name="Concluídos" fill="#aebbc8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
