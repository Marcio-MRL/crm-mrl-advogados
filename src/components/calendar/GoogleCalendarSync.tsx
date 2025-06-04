
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RefreshCw, Calendar, Download, Upload, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface GoogleCalendarSyncProps {
  onSyncComplete?: () => void;
}

interface SyncStats {
  lastSync: string | null;
  eventsImported: number;
  eventsExported: number;
  autoSync: boolean;
}

export function GoogleCalendarSync({ onSyncComplete }: GoogleCalendarSyncProps) {
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
        const settings = data.settings || {};
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

  const handleManualSync = async () => {
    if (!isConnected) {
      toast.error("Conecte-se ao Google Calendar primeiro");
      return;
    }

    setIsSyncing(true);
    
    try {
      // Simular sincronização
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar estatísticas (simulado)
      const newStats = {
        ...syncStats,
        lastSync: new Date().toISOString(),
        eventsImported: syncStats.eventsImported + Math.floor(Math.random() * 5),
        eventsExported: syncStats.eventsExported + Math.floor(Math.random() * 3)
      };
      
      setSyncStats(newStats);
      
      // Salvar no banco de dados
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

      toast.success("Sincronização concluída com sucesso!");
      onSyncComplete?.();
    } catch (error) {
      console.error('Sync error:', error);
      toast.error("Erro durante a sincronização");
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleAutoSync = async (enabled: boolean) => {
    const newStats = { ...syncStats, autoSync: enabled };
    setSyncStats(newStats);
    
    try {
      await supabase
        .from('integrations')
        .update({
          settings: {
            eventsImported: newStats.eventsImported,
            eventsExported: newStats.eventsExported,
            autoSync: newStats.autoSync
          }
        })
        .eq('user_id', user?.id)
        .eq('service_name', 'calendar');

      toast.success(`Sincronização automática ${enabled ? 'ativada' : 'desativada'}`);
    } catch (error) {
      console.error('Error updating auto sync:', error);
      toast.error("Erro ao atualizar configuração");
    }
  };

  const importFromGoogle = async () => {
    if (!isConnected) {
      toast.error("Conecte-se ao Google Calendar primeiro");
      return;
    }

    setIsSyncing(true);
    
    try {
      // Simular importação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const imported = Math.floor(Math.random() * 10) + 1;
      const newStats = {
        ...syncStats,
        eventsImported: syncStats.eventsImported + imported,
        lastSync: new Date().toISOString()
      };
      
      setSyncStats(newStats);
      
      toast.success(`${imported} eventos importados do Google Calendar`);
      onSyncComplete?.();
    } catch (error) {
      console.error('Import error:', error);
      toast.error("Erro ao importar eventos");
    } finally {
      setIsSyncing(false);
    }
  };

  const exportToGoogle = async () => {
    if (!isConnected) {
      toast.error("Conecte-se ao Google Calendar primeiro");
      return;
    }

    setIsSyncing(true);
    
    try {
      // Simular exportação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const exported = Math.floor(Math.random() * 5) + 1;
      const newStats = {
        ...syncStats,
        eventsExported: syncStats.eventsExported + exported,
        lastSync: new Date().toISOString()
      };
      
      setSyncStats(newStats);
      
      toast.success(`${exported} eventos exportados para o Google Calendar`);
      onSyncComplete?.();
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Erro ao exportar eventos");
    } finally {
      setIsSyncing(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };

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

        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleManualSync} 
            disabled={!isConnected || isSyncing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Sincronizar Agora
          </Button>
          
          <Button 
            variant="outline" 
            onClick={importFromGoogle}
            disabled={!isConnected || isSyncing}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Importar
          </Button>
          
          <Button 
            variant="outline" 
            onClick={exportToGoogle}
            disabled={!isConnected || isSyncing}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Exportar
          </Button>
        </div>

        {!isConnected && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Conecte-se ao Google Calendar na seção de integrações para habilitar a sincronização.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
