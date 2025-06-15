import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getValidAccessToken } from '@/utils/googleAuthManager';

interface SyncStats {
  lastSync: string | null;
  eventsImported: number;
  eventsExported: number;
  autoSync: boolean;
}

interface SyncSettings {
  eventsImported?: number;
  eventsExported?: number;
  autoSync?: boolean;
}

export function useGoogleCalendarSync(onSyncComplete?: () => void) {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStats, setSyncStats] = useState<SyncStats>({
    lastSync: null,
    eventsImported: 0,
    eventsExported: 0,
    autoSync: false
  });

  useEffect(() => {
    if (user) {
      checkConnectionStatus();
      loadSyncStats();
    }
  }, [user]);

  const checkConnectionStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('is_connected')
        .eq('user_id', user?.id)
        .eq('service_name', 'calendar')
        .single();

      if (!error && data) {
        setIsConnected(data.is_connected);
      }
    } catch (err) {
      console.error('Error checking connection status:', err);
    }
  };

  const loadSyncStats = async () => {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('last_synced, settings')
        .eq('user_id', user?.id)
        .eq('service_name', 'calendar')
        .single();

      if (!error && data) {
        let settings: SyncSettings = {};
        if (data.settings && typeof data.settings === 'object' && !Array.isArray(data.settings)) {
          settings = data.settings as SyncSettings;
        }
        
        setSyncStats({
          lastSync: data.last_synced,
          eventsImported: settings.eventsImported || 0,
          eventsExported: settings.eventsExported || 0,
          autoSync: settings.autoSync || false
        });
      }
    } catch (err) {
      console.error('Error loading sync stats:', err);
    }
  };

  const updateSyncStats = async (newStats: SyncStats) => {
    setSyncStats(newStats);
    
    try {
      await supabase
        .from('integrations')
        .update({
          last_synced: newStats.lastSync,
          settings: {
            eventsImported: newStats.eventsImported,
            eventsExported: newStats.eventsExported,
            autoSync: newStats.autoSync
          }
        })
        .eq('user_id', user?.id)
        .eq('service_name', 'calendar');
    } catch (error) {
      console.error('Error updating sync stats:', error);
      throw error;
    }
  };

  const handleManualSync = async () => {
    if (!isConnected) {
      toast.error("Conecte-se ao Google Calendar primeiro");
      return;
    }

    setIsSyncing(true);
    toast.info("Sincronizando com Google Calendar...");
    
    try {
      const accessToken = await getValidAccessToken('calendar');

      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=50', {
          headers: { 'Authorization': `Bearer ${accessToken}` },
      });

      if (!response.ok) {
          const errorData = await response.json();
          console.error('Google Calendar API error:', errorData);
          throw new Error('Erro ao buscar eventos do Google Calendar.');
      }

      const eventData = await response.json();
      console.log('Events from Google:', eventData.items);
      
      const newStats = {
        ...syncStats,
        lastSync: new Date().toISOString(),
        eventsImported: syncStats.eventsImported + (eventData.items?.length || 0),
      };
      
      await updateSyncStats(newStats);
      toast.success(`${eventData.items?.length || 0} eventos verificados. Sincronização concluída!`);
      onSyncComplete?.();
    } catch (error) {
      console.error('Sync error:', error);
      toast.error(error instanceof Error ? error.message : "Erro durante a sincronização");
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleAutoSync = async (enabled: boolean) => {
    const newStats = { ...syncStats, autoSync: enabled };
    
    try {
      await updateSyncStats(newStats);
      toast.success(`Sincronização automática ${enabled ? 'ativada' : 'desativada'}`);
    } catch (error) {
      console.error('Error updating auto sync:', error);
      toast.error("Erro ao atualizar configuração");
    }
  };

  const importFromGoogle = async () => {
    await handleManualSync();
  };

  const exportToGoogle = async () => {
    if (!isConnected) {
      toast.error("Conecte-se ao Google Calendar primeiro");
      return;
    }

    setIsSyncing(true);
    toast.info("Exportando evento para o Google Calendar...");
    
    try {
      const accessToken = await getValidAccessToken('calendar');
      
      const now = new Date();
      const startDateTime = now.toISOString();
      const endDateTime = new Date(now.getTime() + 60 * 60 * 1000).toISOString();

      const event = {
        'summary': 'Evento de Teste (via App)',
        'description': 'Este evento foi criado automaticamente pela aplicação.',
        'start': { 'dateTime': startDateTime, 'timeZone': 'America/Sao_Paulo' },
        'end': { 'dateTime': endDateTime, 'timeZone': 'America/Sao_Paulo' },
      };

      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Google Calendar API error on export:', errorData);
        throw new Error('Erro ao exportar evento para o Google Calendar.');
      }

      const newStats = {
        ...syncStats,
        eventsExported: syncStats.eventsExported + 1,
        lastSync: new Date().toISOString()
      };
      
      await updateSyncStats(newStats);
      toast.success(`1 evento exportado para o Google Calendar`);
      onSyncComplete?.();
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error instanceof Error ? error.message : "Erro ao exportar eventos");
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isConnected,
    isSyncing,
    syncStats,
    handleManualSync,
    toggleAutoSync,
    importFromGoogle,
    exportToGoogle
  };
}
