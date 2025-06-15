
import { useState } from 'react';
import { toast } from 'sonner';
import { useGoogleIntegrationState } from './google-calendar/useGoogleIntegrationState';
import { fetchGoogleEvents, createGoogleEvent } from '@/services/googleCalendarApi';

export function useGoogleCalendarSync(onSyncComplete?: () => void) {
  const { isConnected, syncStats, updateIntegrationState } = useGoogleIntegrationState();
  const [isSyncing, setIsSyncing] = useState(false);

  const performImport = async () => {
    if (!isConnected) {
      toast.error("Conecte-se ao Google Calendar primeiro");
      return;
    }

    setIsSyncing(true);
    toast.info("Sincronizando com Google Calendar...");
    
    try {
      const events = await fetchGoogleEvents();
      console.log('Events from Google:', events);
      
      await updateIntegrationState({
        lastSync: new Date().toISOString(),
        eventsImported: syncStats.eventsImported + (events?.length || 0),
      });
      
      toast.success(`${events?.length || 0} eventos verificados. Sincronização concluída!`);
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
