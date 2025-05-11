
import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Users, Gavel, DollarSign } from 'lucide-react';

export function StatsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        title="Total de Leads" 
        value="24" 
        icon={<Users size={20} />} 
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard 
        title="Clientes Ativos" 
        value="48" 
        icon={<Users size={20} />} 
        trend={{ value: 5, isPositive: true }}
      />
      <StatCard 
        title="Processos em Andamento" 
        value="75" 
        icon={<Gavel size={20} />} 
        trend={{ value: 2, isPositive: false }}
      />
      <StatCard 
        title="Honorários Previstos" 
        value="R$ 125.400" 
        icon={<DollarSign size={20} />} 
        trend={{ value: 15, isPositive: true }}
      />
    </div>
  );
}
