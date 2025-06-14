
import React from 'react';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { BankIntegrationStatus } from '@/types/bankIntegration';

interface BankIntegrationStatsProps {
  status: BankIntegrationStatus;
}

export function BankIntegrationStats({ status }: BankIntegrationStatsProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  if (!status.connected) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">Total de Transações</span>
        </div>
        <span className="text-xl font-bold">{status.totalTransactions}</span>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">Última Sincronização</span>
        </div>
        <span className="text-sm">
          {status.lastSync ? formatDate(status.lastSync) : 'Nunca'}
        </span>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">Última Transação</span>
        </div>
        <span className="text-sm">
          {status.lastTransaction ? 
            `${formatCurrency(status.lastTransaction.valor)} - ${status.lastTransaction.credito_debito}` :
            'Nenhuma'
          }
        </span>
      </div>
    </div>
  );
}
