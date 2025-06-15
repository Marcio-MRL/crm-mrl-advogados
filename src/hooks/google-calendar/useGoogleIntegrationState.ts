
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface SyncStats {
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

export function useGoogleIntegrationState() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [syncStats, setSyncStats] = useState<SyncStats>({
    lastSync: null,
    eventsImported: 0,
    eventsExported: 0,
    autoSync: false,
  });
  const [loading, setLoading] = useState(true);

  const fetchIntegrationStatus = useCallback(async () => {
    if (!user) {
        setLoading(false);
        return;
    };
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('is_connected, last_synced, settings')
        .eq('user_id', user.id)
        .eq('service_name', 'calendar')
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      if (data) {
        setIsConnected(data.is_connected);
        let settings: SyncSettings = {};
        if (data.settings && typeof data.settings === 'object' && !Array.isArray(data.settings)) {
          settings = data.settings as SyncSettings;
        }
        setSyncStats({
          lastSync: data.last_synced,
          eventsImported: settings.eventsImported || 0,
          eventsExported: settings.eventsExported || 0,
          autoSync: settings.autoSync || false,
        });
      } else {
        setIsConnected(false);
        setSyncStats({ lastSync: null, eventsImported: 0, eventsExported: 0, autoSync: false });
      }
    } catch (err) {
      console.error('Error fetching integration status:', err);
    } finally {
        setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchIntegrationStatus();
  }, [fetchIntegrationStatus]);

  const updateIntegrationState = async (newStats: Partial<SyncStats>) => {
    if (!user) return;
    
    const updatedStats = { ...syncStats, ...newStats };
    setSyncStats(updatedStats);
    
    try {
      await supabase
        .from('integrations')
        .update({
          last_synced: updatedStats.lastSync,
          settings: {
            eventsImported: updatedStats.eventsImported,
            eventsExported: updatedStats.eventsExported,
            autoSync: updatedStats.autoSync
          }
        })
        .eq('user_id', user.id)
        .eq('service_name', 'calendar');
    } catch (error) {
      console.error('Error updating integration state:', error);
      throw error;
    }
  };

  return { isConnected, syncStats, loading, updateIntegrationState, refetch: fetchIntegrationStatus };
}
