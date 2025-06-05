
import React from 'react';
import { Calendar } from 'lucide-react';
import { GoogleIntegrations } from '@/components/integrations/GoogleIntegrations';
import { GoogleCalendarSync } from '@/components/calendar/GoogleCalendarSync';

interface AgendaIntegrationsSectionProps {
  onSyncComplete: () => void;
}

export function AgendaIntegrationsSection({ onSyncComplete }: AgendaIntegrationsSectionProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
      <div className="xl:col-span-2">
        <div className="glass-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Integrações Google
          </h2>
          <GoogleIntegrations hideGoogleSheets={true} />
        </div>
      </div>
      
      <div>
        <GoogleCalendarSync onSyncComplete={onSyncComplete} />
      </div>
    </div>
  );
}
