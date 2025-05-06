
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Dados mock para Status de Processos
const processStatusData = [
  { name: 'Em andamento', value: 45, color: '#3b82f6' },
  { name: 'Prazo em curso', value: 20, color: '#f59e0b' },
  { name: 'Aguardando', value: 15, color: '#8b5cf6' },
  { name: 'Concluídos', value: 20, color: '#10b981' },
];

// Dados mock para Distribuição de Clientes
const clientDistributionData = [
  { name: 'Pessoa Física', pj: 0, pf: 35 },
  { name: 'Empresas', pj: 45, pf: 0 },
  { name: 'Setor Público', pj: 10, pf: 0 },
  { name: 'Terceiro Setor', pj: 10, pf: 0 },
];

// Dados mock para Acompanhamento Financeiro
const financialData = [
  { name: 'Jan', receitas: 25000, despesas: 18000 },
  { name: 'Fev', receitas: 30000, despesas: 20000 },
  { name: 'Mar', receitas: 27000, despesas: 19000 },
  { name: 'Abr', receitas: 32000, despesas: 21000 },
  { name: 'Mai', receitas: 35000, despesas: 22000 },
  { name: 'Jun', receitas: 40000, despesas: 25000 },
];

// Dados mock para Horas Trabalhadas
const timeTrackingData = [
  { name: 'Ana Silva', horas: 168 },
  { name: 'Carlos Mendes', horas: 152 },
  { name: 'Maria Oliveira', horas: 140 },
  { name: 'Paulo Santos', horas: 135 },
  { name: 'Fernando Costa', horas: 120 },
];

export function ReportProcessStatus() {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={processStatusData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {processStatusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} processos`, 'Quantidade']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReportClientDistribution() {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={clientDistributionData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pj" name="Pessoa Jurídica" stackId="a" fill="#3b82f6" />
          <Bar dataKey="pf" name="Pessoa Física" stackId="a" fill="#93c5fd" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReportFinancialOverview() {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={financialData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis 
            tickFormatter={(value) => 
              `R$ ${(value / 1000).toFixed(0)}k`
            } 
          />
          <Tooltip 
            formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, '']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="receitas" 
            name="Receitas" 
            stroke="#10b981" 
            strokeWidth={2}
            activeDot={{ r: 8 }} 
          />
          <Line 
            type="monotone" 
            dataKey="despesas" 
            name="Despesas" 
            stroke="#ef4444" 
            strokeWidth={2} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReportTimeTracking() {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={timeTrackingData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          <Legend />
          <Bar dataKey="horas" name="Horas Trabalhadas" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
