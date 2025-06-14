
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from 'lucide-react';

interface BankIntegrationActionsProps {
  onSync: () => void;
  hasToken: boolean;
  syncInProgress: boolean;
}

export function BankIntegrationActions({ onSync, hasToken, syncInProgress }: BankIntegrationActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button
        onClick={onSync}
        disabled={!hasToken || syncInProgress}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${syncInProgress ? 'animate-spin' : ''}`} />
        {syncInProgress ? 'Sincronizando...' : 'Sincronizar Agora'}
      </Button>
      
      {!hasToken && (
        <div className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 inline mr-1" />
          Conecte-se ao Google Sheets nas configurações para habilitar a sincronização
        </div>
      )}
    </div>
  );
}
