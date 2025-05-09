
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleAuthButton } from './GoogleAuthButton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarIcon, FileSpreadsheet, Check } from 'lucide-react';

interface Integration {
  id: string;
  service_name: string;
  is_connected: boolean;
  last_synced: string | null;
}

export function GoogleIntegrations() {
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [sheetsConnected, setSheetsConnected] = useState(false);
  const [lastCalendarSync, setLastCalendarSync] = useState<string | null>(null);
  const [lastSheetsSync, setLastSheetsSync] = useState<string | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;
    
    const fetchIntegrations = async () => {
      try {
        const { data, error } = await supabase
          .from('integrations')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        if (data) {
          const calendarIntegration = data.find(i => i.service_name === 'calendar');
          const sheetsIntegration = data.find(i => i.service_name === 'sheets');
          
          setCalendarConnected(!!calendarIntegration?.is_connected);
          setSheetsConnected(!!sheetsIntegration?.is_connected);
          setLastCalendarSync(calendarIntegration?.last_synced);
          setLastSheetsSync(sheetsIntegration?.last_synced);
        }
      } catch (error) {
        console.error('Erro ao buscar integrações:', error);
      }
    };
    
    fetchIntegrations();
  }, [user]);
  
  const formatLastSyncDate = (dateStr: string | null) => {
    if (!dateStr) return 'Nunca sincronizado';
    return new Date(dateStr).toLocaleString('pt-BR');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-lawblue-500" />
            Integração com Google Calendar
          </CardTitle>
          <CardDescription>
            Sincronize sua agenda com o Google Calendar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {calendarConnected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-5 w-5" />
                <span>Conectado ao Google Calendar</span>
              </div>
              <p className="text-sm text-gray-500">
                Última sincronização: {formatLastSyncDate(lastCalendarSync)}
              </p>
              <GoogleAuthButton 
                service="calendar" 
                onSuccess={() => setCalendarConnected(true)} 
              />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Conecte sua conta do Google para sincronizar seus compromissos com o Google Calendar.
              </p>
              <GoogleAuthButton 
                service="calendar" 
                onSuccess={() => setCalendarConnected(true)} 
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-lawblue-500" />
            Integração com Google Sheets
          </CardTitle>
          <CardDescription>
            Sincronize seus dados financeiros com o Google Sheets
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sheetsConnected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <Check className="h-5 w-5" />
                <span>Conectado ao Google Sheets</span>
              </div>
              <p className="text-sm text-gray-500">
                Última sincronização: {formatLastSyncDate(lastSheetsSync)}
              </p>
              <GoogleAuthButton 
                service="sheets" 
                onSuccess={() => setSheetsConnected(true)} 
              />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Conecte sua conta do Google para exportar e importar dados financeiros usando o Google Sheets.
              </p>
              <GoogleAuthButton 
                service="sheets" 
                onSuccess={() => setSheetsConnected(true)} 
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
