
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from 'lucide-react';
import { useGoogleCalendarSync } from '@/hooks/useGoogleCalendarSync';
import { SyncStatsDisplay } from './sync/SyncStatsDisplay';
import { SyncActions } from './sync/SyncActions';
import { ConnectionWarning } from './sync/ConnectionWarning';

interface GoogleCalendarSyncProps {
  onSyncComplete?: () => void;
}

export function GoogleCalendarSync({ onSyncComplete }: GoogleCalendarSyncProps) {
  const {
    isConnected,
    isSyncing,
    syncStats,
    handleManualSync,
    toggleAutoSync,
    importFromGoogle,
    exportToGoogle
  } = useGoogleCalendarSync(onSyncComplete);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Sincronização Google Calendar
        </CardTitle>
        <CardDescription>
          Gerencie a sincronização entre sua agenda local e o Google Calendar
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-sync">Sincronização Automática</Label>
          <Switch
            id="auto-sync"
            checked={syncStats.autoSync}
            onCheckedChange={toggleAutoSync}
            disabled={!isConnected}
          />
        </div>

        <SyncStatsDisplay syncStats={syncStats} />

        <SyncActions
          isConnected={isConnected}
          isSyncing={isSyncing}
          onManualSync={handleManualSync}
          onImport={importFromGoogle}
          onExport={exportToGoogle}
        />

        <ConnectionWarning isConnected={isConnected} />
      </CardContent>
    </Card>
  );
}
