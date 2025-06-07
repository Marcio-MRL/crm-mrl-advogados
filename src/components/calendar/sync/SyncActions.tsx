
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Upload } from 'lucide-react';

interface SyncActionsProps {
  isConnected: boolean;
  isSyncing: boolean;
  onManualSync: () => void;
  onImport: () => void;
  onExport: () => void;
}

export function SyncActions({ 
  isConnected, 
  isSyncing, 
  onManualSync, 
  onImport, 
  onExport 
}: SyncActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        onClick={onManualSync} 
        disabled={!isConnected || isSyncing}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
        Sincronizar Agora
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onImport}
        disabled={!isConnected || isSyncing}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        Importar
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onExport}
        disabled={!isConnected || isSyncing}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Exportar
      </Button>
    </div>
  );
}
