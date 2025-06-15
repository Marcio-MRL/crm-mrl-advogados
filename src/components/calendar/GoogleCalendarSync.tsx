
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { RefreshCw, Download, Upload, Calendar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface SyncStats {
  lastSync: string | null;
  eventsImported: number;
  eventsExported: number;
  autoSync: boolean;
}

interface CalendarSyncProps {
  isConnected: boolean;
  isSyncing: boolean;
  syncStats: SyncStats;
  onManualSync: () => void;
  onImport: () => void;
  onExport: () => void;
  onToggleAutoSync: (enabled: boolean) => void;
}

export function CalendarSync({
  isConnected,
  isSyncing,
  syncStats,
  onManualSync,
  onImport,
  onExport,
  onToggleAutoSync
}: CalendarSyncProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  };

  if (!isConnected) {
    return (
      <div className="text-center py-4 space-y-3">
        <Calendar className="w-8 h-8 mx-auto text-gray-400" />
        <p className="text-sm text-gray-600">
          Conecte sua conta do Google para sincronizar eventos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="text-center p-3 bg-green-50 rounded-md">
          <div className="text-lg font-semibold text-green-600">
            {syncStats.eventsImported}
          </div>
          <div className="text-xs text-green-700">Importados</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-md">
          <div className="text-lg font-semibold text-blue-600">
            {syncStats.eventsExported}
          </div>
          <div className="text-xs text-blue-700">Exportados</div>
        </div>
      </div>

      <Separator />

      {/* Sync Actions */}
      <div className="space-y-3">
        <Button 
          onClick={onManualSync} 
          disabled={isSyncing}
          className="w-full flex items-center gap-2"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
        </Button>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            onClick={onImport}
            disabled={isSyncing}
            size="sm"
            className="flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Importar
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onExport}
            disabled={isSyncing}
            size="sm"
            className="flex items-center gap-1"
          >
            <Upload className="h-3 w-3" />
            Exportar
          </Button>
        </div>
      </div>

      <Separator />

      {/* Auto Sync Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Sync Automático</div>
          <div className="text-xs text-gray-500">
            Sincroniza automaticamente
          </div>
        </div>
        <Switch
          checked={syncStats.autoSync}
          onCheckedChange={onToggleAutoSync}
          disabled={isSyncing}
        />
      </div>

      {/* Last Sync */}
      <div className="pt-2 border-t">
        <div className="text-xs text-gray-500 text-center">
          Última sincronização: {formatDate(syncStats.lastSync)}
        </div>
      </div>
    </div>
  );
}
