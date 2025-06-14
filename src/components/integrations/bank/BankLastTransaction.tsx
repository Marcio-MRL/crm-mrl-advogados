
import React from 'react';
import { BankTransaction } from '@/types/bankIntegration';

interface BankLastTransactionProps {
  lastTransaction: BankTransaction | null;
}

export function BankLastTransaction({ lastTransaction }: BankLastTransactionProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  if (!lastTransaction) return null;

  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-medium mb-2">Última Movimentação</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Data:</span>
          <p className="font-medium">{formatDate(lastTransaction.data)}</p>
        </div>
        <div>
          <span className="text-gray-500">Tipo:</span>
          <p className={`font-medium ${
            lastTransaction.credito_debito === 'Crédito' ? 'text-green-600' : 'text-red-600'
          }`}>
            {lastTransaction.credito_debito}
          </p>
        </div>
        <div>
          <span className="text-gray-500">Valor:</span>
          <p className="font-medium">{formatCurrency(lastTransaction.valor)}</p>
        </div>
        <div>
          <span className="text-gray-500">Descrição:</span>
          <p className="font-medium">{lastTransaction.descricao}</p>
        </div>
      </div>
    </div>
  );
}
