
import { useState } from 'react';
import { toast } from 'sonner';
import { useGoogleIntegrationState } from './google-calendar/useGoogleIntegrationState';
import { fetchGoogleEvents, createGoogleEvent, updateGoogleEvent, deleteGoogleEvent } from '@/services/googleCalendarApi';
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
    if (!isConnected || !user) {
      toast.error("Conecte-se ao Google Calendar primeiro");
      return;
    }

    setIsSyncing(true);
    toast.info("Exportando eventos para o Google Calendar...");
    
    try {
      // Buscar eventos locais que devem ser sincronizados mas ainda não têm google_event_id
      const { data: localEvents, error: localEventsError } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .eq('sync_with_google', true)
        .is('google_event_id', null);

      if (localEventsError) throw localEventsError;

      if (!localEvents || localEvents.length === 0) {
        toast.info("Nenhum evento local pendente para exportar.");
        setIsSyncing(false);
        return;
      }

      let exportedCount = 0;

      for (const localEvent of localEvents) {
        try {
          const googleEvent = {
            summary: localEvent.title,
            description: localEvent.description || '',
            start: {
              dateTime: localEvent.start_time,
              timeZone: 'America/Sao_Paulo'
            },
            end: {
              dateTime: localEvent.end_time,
              timeZone: 'America/Sao_Paulo'
            },
            location: localEvent.location || '',
            attendees: localEvent.participants?.map((email: string) => ({ email })) || []
          };

          const createdGoogleEvent = await createGoogleEvent(googleEvent);
          
          // Atualizar o evento local com o ID do Google
          const { error: updateError } = await supabase
            .from('calendar_events')
            .update({ google_event_id: createdGoogleEvent.id })
            .eq('id', localEvent.id);

          if (updateError) {
            console.error('Error updating local event with Google ID:', updateError);
          } else {
            exportedCount++;
          }
        } catch (eventError) {
          console.error('Error exporting individual event:', eventError);
        }
      }

      await updateIntegrationState({
        eventsExported: syncStats.eventsExported + exportedCount,
        lastSync: new Date().toISOString()
      });
      
      toast.success(`${exportedCount} eventos exportados para o Google Calendar`);
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
