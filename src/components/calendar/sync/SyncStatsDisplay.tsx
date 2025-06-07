
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface SyncStats {
  lastSync: string | null;
  eventsImported: number;
  eventsExported: number;
  autoSync: boolean;
}

interface SyncStatsDisplayProps {
  syncStats: SyncStats;
}

export function SyncStatsDisplay({ syncStats }: SyncStatsDisplayProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{syncStats.eventsImported}</div>
          <div className="text-sm text-green-700">Eventos Importados</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{syncStats.eventsExported}</div>
          <div className="text-sm text-blue-700">Eventos Exportados</div>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span className="text-sm">Última sincronização:</span>
        <Badge variant="secondary">{formatDate(syncStats.lastSync)}</Badge>
      </div>
    </>
  );
}
