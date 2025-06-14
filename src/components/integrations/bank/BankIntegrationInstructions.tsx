
import React from 'react';

export function BankIntegrationInstructions() {
  return (
    <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
      <p className="font-medium mb-1">Como funciona:</p>
      <ul className="list-disc list-inside space-y-1">
        <li>A automação do BTG adiciona novas movimentações na planilha automaticamente</li>
        <li>Use o botão "Sincronizar Agora" para importar as novas transações</li>
        <li>As transações são categorizadas automaticamente no módulo financeiro</li>
        <li>Para dados históricos, faça upload manual da planilha completa</li>
      </ul>
    </div>
  );
}
