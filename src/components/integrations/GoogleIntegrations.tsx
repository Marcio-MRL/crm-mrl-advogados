
import React, { useState, useEffect } from 'react';
import { GoogleAuthButton } from './GoogleAuthButton';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

interface GoogleIntegrationsProps {
  hideGoogleSheets?: boolean;
}

interface Integration {
  id: string;
  service_name: string;
  is_connected: boolean;
  last_synced: string | null;
}

export function GoogleIntegrations({ hideGoogleSheets = false }: GoogleIntegrationsProps) {
  const { user } = useAuth();
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [sheetsConnected, setSheetsConnected] = useState(false);
  const [lastCalendarSync, setLastCalendarSync] = useState<string | null>(null);
  const [lastSheetsSync, setLastSheetsSync] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchIntegrations = async () => {
      try {
        const { data, error } = await supabase
          .from('integrations')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching integrations:', error);
          return;
        }
        
        const calendarIntegration = data.find((item: Integration) => item.service_name === 'calendar');
        const sheetsIntegration = data.find((item: Integration) => item.service_name === 'sheets');
        
        if (calendarIntegration) {
          setCalendarConnected(calendarIntegration.is_connected);
          setLastCalendarSync(calendarIntegration.last_synced);
        }
        
        if (sheetsIntegration) {
          setSheetsConnected(sheetsIntegration.is_connected);
          setLastSheetsSync(sheetsIntegration.last_synced);
        }
      } catch (error) {
        console.error('Error in fetchIntegrations:', error);
      }
    };
    
    fetchIntegrations();
  }, [user]);
  
  const handleCalendarSuccess = () => {
    setCalendarConnected(true);
    setLastCalendarSync(new Date().toISOString());
    toast.success("Conectado com Google Calendar com sucesso!");
  };
  
  const handleSheetsSuccess = () => {
    setSheetsConnected(true);
    setLastSheetsSync(new Date().toISOString());
    toast.success("Conectado com Google Sheets com sucesso!");
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.toLocaleDateString('pt-BR')}, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white/60 p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📅</span>
          <h3 className="text-lg font-medium">Integração com Google Calendar</h3>
        </div>
        <p className="text-sm text-gray-500 mb-3">
          Sincronize sua agenda com o Google Calendar
        </p>
        <p className="text-sm mb-4">
          Conecte sua conta do Google para sincronizar seus compromissos com o Google Calendar.
        </p>
        
        {calendarConnected ? (
          <div>
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Check className="h-5 w-5" />
              <span>Conectado ao Google Calendar</span>
            </div>
            {lastCalendarSync && (
              <p className="text-xs text-gray-500">
                Última sincronização: {formatDate(lastCalendarSync)}
              </p>
            )}
          </div>
        ) : (
          <GoogleAuthButton service="calendar" onSuccess={handleCalendarSuccess} />
        )}
      </div>
      
      {!hideGoogleSheets && (
        <div className="bg-white/60 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📊</span>
            <h3 className="text-lg font-medium">Integração com Google Sheets</h3>
          </div>
          <p className="text-sm text-gray-500 mb-3">
            Sincronize seus dados financeiros com o Google Sheets
          </p>
          <p className="text-sm mb-4">
            Conecte sua conta do Google para exportar e importar dados financeiros usando o Google Sheets.
          </p>
          
          {sheetsConnected ? (
            <div>
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <Check className="h-5 w-5" />
                <span>Conectado ao Google Sheets</span>
              </div>
              {lastSheetsSync && (
                <p className="text-xs text-gray-500">
                  Última sincronização: {formatDate(lastSheetsSync)}
                </p>
              )}
            </div>
          ) : (
            <GoogleAuthButton service="sheets" onSuccess={handleSheetsSuccess} />
          )}
        </div>
      )}
    </div>
  );
}
