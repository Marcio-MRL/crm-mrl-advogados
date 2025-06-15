
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
    <div className="space-y-4">
      {/* Google Calendar Integration */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                📅 Google Calendar
              </CardTitle>
              <CardDescription className="text-sm">
                Sincronize sua agenda com o Google Calendar
              </CardDescription>
            </div>
            <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
              {isConnected ? "Conectado" : "Desconectado"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
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
    </div>
  );
}
