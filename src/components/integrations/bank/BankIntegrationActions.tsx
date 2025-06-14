
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, AlertCircle } from 'lucide-react';

interface BankIntegrationActionsProps {
  onSync: () => void;
  hasToken: boolean;
  syncInProgress: boolean;
  hasSelectedSheet?: boolean;
}

export function BankIntegrationActions({ 
  onSync, 
  hasToken, 
  syncInProgress,
  hasSelectedSheet = false 
}: BankIntegrationActionsProps) {
  const canSync = hasToken && hasSelectedSheet && !syncInProgress;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Button 
            onClick={onSync}
            disabled={!canSync}
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            {syncInProgress ? 'Sincronizando...' : 'Sincronizar Agora'}
          </Button>
        </div>
      </div>

      {!hasToken && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-800">
            Conecte-se ao Google Sheets nas configurações para habilitar a sincronização.
          </p>
        </div>
      )}

      {hasToken && !hasSelectedSheet && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            Selecione uma planilha acima para habilitar a sincronização.
          </p>
        </div>
      )}
    </div>
  );
}
