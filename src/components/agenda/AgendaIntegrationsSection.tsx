
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarSync } from '@/components/calendar/GoogleCalendarSync';
import { useGoogleCalendarSync } from '@/hooks/useGoogleCalendarSync';

interface AgendaIntegrationsSectionProps {
  onSyncComplete?: () => void;
}

export function AgendaIntegrationsSection({ onSyncComplete }: AgendaIntegrationsSectionProps) {
  const { 
    isConnected, 
    isSyncing, 
    syncStats,
    handleManualSync,
    importFromGoogle,
    exportToGoogle,
    toggleAutoSync 
  } = useGoogleCalendarSync(onSyncComplete);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              📅 Sincronização Google Calendar
            </CardTitle>
            <CardDescription>
              Sincronize seus eventos automaticamente com o Google Calendar
            </CardDescription>
          </div>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Conectado" : "Desconectado"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CalendarSync 
          isConnected={isConnected}
          isSyncing={isSyncing}
          syncStats={syncStats}
          onManualSync={handleManualSync}
          onImport={importFromGoogle}
          onExport={exportToGoogle}
          onToggleAutoSync={toggleAutoSync}
        />
      </CardContent>
    </Card>
  );
}
