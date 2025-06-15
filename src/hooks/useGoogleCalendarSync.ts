
import { useState } from 'react';
import { toast } from 'sonner';
import { useGoogleIntegrationState } from './google-calendar/useGoogleIntegrationState';
import { fetchGoogleEvents, createGoogleEvent } from '@/services/googleCalendarApi';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useGoogleCalendarSync(onSyncComplete?: () => void) {
  const { isConnected, syncStats, updateIntegrationState } = useGoogleIntegrationState();
  const [isSyncing, setIsSyncing] = useState(false);
  const { user } = useAuth();

  const performImport = async () => {
    if (!isConnected || !user) {
      toast.error("Conecte-se ao Google Calendar e faça login primeiro");
      return;
    }

    setIsSyncing(true);
    toast.info("Sincronizando com Google Calendar...");
    
    try {
      const googleEvents = await fetchGoogleEvents();
      if (!googleEvents || googleEvents.length === 0) {
        toast.info("Nenhum evento novo encontrado no Google Calendar para importar.");
        setIsSyncing(false);
        return;
      }
      
      const { data: localEvents, error: localEventsError } = await supabase
        .from('calendar_events')
        .select('google_event_id')
        .eq('user_id', user.id)
        .not('google_event_id', 'is', null);

      if (localEventsError) throw localEventsError;

      const existingGoogleEventIds = new Set(localEvents.map(e => e.google_event_id));
      
      const newGoogleEvents = googleEvents.filter((ge: any) => !existingGoogleEventIds.has(ge.id));

      if (newGoogleEvents.length === 0) {
        toast.info("Sua agenda já está sincronizada.");
        await updateIntegrationState({ lastSync: new Date().toISOString() });
        setIsSyncing(false);
        onSyncComplete?.();
        return;
      }

      const eventsToInsert = newGoogleEvents.map((ge: any) => {
        const startTime = ge.start.dateTime || ge.start.date;
        const endTime = ge.end.dateTime || ge.end.date;

        return {
          user_id: user.id,
          google_event_id: ge.id,
          title: ge.summary || 'Evento sem título',
          description: ge.description,
          start_time: new Date(startTime).toISOString(),
          end_time: new Date(endTime).toISOString(),
          location: ge.location,
          type: 'outro' as const,
          sync_with_google: true,
          participants: ge.attendees?.map((a: any) => a.email) || [],
          client: null,
        };
      });
      
      const { error: insertError } = await supabase
        .from('calendar_events')
        .insert(eventsToInsert);

      if (insertError) throw insertError;

      await updateIntegrationState({
        lastSync: new Date().toISOString(),
        eventsImported: syncStats.eventsImported + newGoogleEvents.length,
      });
      
      toast.success(`${newGoogleEvents.length} novos eventos importados do Google Calendar!`);
      onSyncComplete?.();
    } catch (error) {
      console.error('Sync error:', error);
      toast.error(error instanceof Error ? error.message : "Erro durante a sincronização");
    } finally {
      setIsSyncing(false);
    }
  };

  const performExport = async () => {
    if (!isConnected) {
      toast.error("Conecte-se ao Google Calendar primeiro");
      return;
    }

    setIsSyncing(true);
    toast.info("Exportando evento para o Google Calendar...");
    
    try {
      const now = new Date();
      const startDateTime = now.toISOString();
      const endDateTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString();

      const event = {
        'summary': 'Evento de Teste (via App)',
        'description': 'Este evento foi criado automaticamente pela aplicação.',
        'start': { 'dateTime': startDateTime, 'timeZone': 'America/Sao_Paulo' },
        'end': { 'dateTime': endDateTime, 'timeZone': 'America/Sao_Paulo' },
      };
      
      await createGoogleEvent(event);

      await updateIntegrationState({
        eventsExported: syncStats.eventsExported + 1,
        lastSync: new Date().toISOString()
      });
      
      toast.success(`1 evento exportado para o Google Calendar`);
      onSyncComplete?.();
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error instanceof Error ? error.message : "Erro ao exportar eventos");
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleAutoSync = async (enabled: boolean) => {
    try {
      await updateIntegrationState({ autoSync: enabled });
      toast.success(`Sincronização automática ${enabled ? 'ativada' : 'desativada'}`);
    } catch (error) {
      console.error('Error updating auto sync:', error);
      toast.error("Erro ao atualizar configuração");
    }
  };

  return {
    isConnected,
    isSyncing,
    syncStats,
    handleManualSync: performImport,
    importFromGoogle: performImport,
    exportToGoogle: performExport,
    toggleAutoSync
  };
}
