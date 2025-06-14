
import React from 'react';

export function BankIntegrationInfo() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-medium text-blue-900 mb-2">
        Planilha: "BTG - Entradas e Saídas Caixa"
      </h3>
      <p className="text-sm text-blue-700">
        Sincronização automática com a planilha bancária do BTG. 
        As movimentações são importadas automaticamente conforme chegam da automação bancária.
      </p>
    </div>
  );
}
