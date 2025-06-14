
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OAuthConfig {
  id?: string;
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  service_type: 'calendar' | 'sheets' | 'drive';
}

export function useGoogleOAuthConfigs() {
  const { user } = useAuth();
  const [configs, setConfigs] = useState<Record<string, OAuthConfig>>({
    calendar: { client_id: '', client_secret: '', redirect_uri: '', service_type: 'calendar' },
    sheets: { client_id: '', client_secret: '', redirect_uri: '', service_type: 'sheets' },
    drive: { client_id: '', client_secret: '', redirect_uri: '', service_type: 'drive' }
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  const isAuthorizedDomain = user?.email?.endsWith('@mrladvogados.com.br');

  useEffect(() => {
    if (user && isAuthorizedDomain) {
      loadConfigs();
    }
  }, [user, isAuthorizedDomain]);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `https://ncficjpokmmsugykmtdu.supabase.co/rest/v1/google_oauth_configs?user_id=eq.${user?.id}&select=*`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZmljanBva21tc3VneWttdGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzY3NjQsImV4cCI6MjA2MjExMjc2NH0.qibulCIaQ-eLTJH3L-Z5nsfBGVj-CGlQsYCY3--uWOs',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        const configsMap: Record<string, OAuthConfig> = {
          calendar: { client_id: '', client_secret: '', redirect_uri: '', service_type: 'calendar' },
          sheets: { client_id: '', client_secret: '', redirect_uri: '', service_type: 'sheets' },
          drive: { client_id: '', client_secret: '', redirect_uri: '', service_type: 'drive' }
        };

        data.forEach((config: any) => {
          if (config.service_type && configsMap[config.service_type]) {
            configsMap[config.service_type] = {
              id: config.id,
              client_id: config.client_id || '',
              client_secret: config.client_secret || '',
              redirect_uri: config.redirect_uri || `${window.location.origin}/auth/google/callback`,
              service_type: config.service_type
            };
          }
        });

        setConfigs(configsMap);
      }
    } catch (error) {
      console.error('Error loading OAuth configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (serviceType: string) => {
    if (!user) return;

    setSaving(prev => ({ ...prev, [serviceType]: true }));
    
    try {
      const config = configs[serviceType];
      
      if (!config.client_id.trim()) {
        toast.error('Client ID é obrigatório');
        return;
      }

      const configData = {
        user_id: user.id,
        service_type: serviceType,
        client_id: config.client_id.trim(),
        client_secret: config.client_secret.trim(),
        redirect_uri: config.redirect_uri.trim() || `${window.location.origin}/auth/google/callback`,
        is_active: true
      };

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Sessão não encontrada');

      let response;
      if (config.id) {
        response = await fetch(
          `https://ncficjpokmmsugykmtdu.supabase.co/rest/v1/google_oauth_configs?id=eq.${config.id}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZmljanBva21tc3VneWttdGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzY3NjQsImV4cCI6MjA2MjExMjc2NH0.qibulCIaQ-eLTJH3L-Z5nsfBGVj-CGlQsYCY3--uWOs',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(configData)
          }
        );
      } else {
        response = await fetch(
          `https://ncficjpokmmsugykmtdu.supabase.co/rest/v1/google_oauth_configs`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZmljanBva21tc3VneWttdGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzY3NjQsImV4cCI6MjA2MjExMjc2NH0.qibulCIaQ-eLTJH3L-Z5nsfBGVj-CGlQsYCY3--uWOs',
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(configData)
          }
        );
      }

      if (response.ok) {
        const result = await response.json();
        if (Array.isArray(result) && result.length > 0) {
          setConfigs(prev => ({
            ...prev,
            [serviceType]: { ...config, id: result[0].id }
          }));
        }
        toast.success(`Configuração do ${getServiceName(serviceType)} salva com sucesso!`);
      } else {
        throw new Error('Erro ao salvar configuração');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Erro ao salvar configuração');
    } finally {
      setSaving(prev => ({ ...prev, [serviceType]: false }));
    }
  };

  const deleteConfig = async (serviceType: string) => {
    const config = configs[serviceType];
    if (!config.id) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Sessão não encontrada');

      const response = await fetch(
        `https://ncficjpokmmsugykmtdu.supabase.co/rest/v1/google_oauth_configs?id=eq.${config.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZmljanBva21tc3VneWttdGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzY3NjQsImV4cCI6MjA2MjExMjc2NH0.qibulCIaQ-eLTJH3L-Z5nsfBGVj-CGlQsYCY3--uWOs',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        setConfigs(prev => ({
          ...prev,
          [serviceType]: { 
            client_id: '', 
            client_secret: '', 
            redirect_uri: '', 
            service_type: serviceType as 'calendar' | 'sheets' | 'drive' 
          }
        }));
        toast.success(`Configuração do ${getServiceName(serviceType)} removida`);
      } else {
        throw new Error('Erro ao remover configuração');
      }
    } catch (error) {
      console.error('Error deleting config:', error);
      toast.error('Erro ao remover configuração');
    }
  };

  const updateConfig = (serviceType: string, field: string, value: string) => {
    setConfigs(prev => ({
      ...prev,
      [serviceType]: { ...prev[serviceType], [field]: value }
    }));
  };

  const getServiceName = (serviceType: string) => {
    const names = {
      calendar: 'Google Calendar',
      sheets: 'Google Sheets',
      drive: 'Google Drive'
    };
    return names[serviceType as keyof typeof names] || serviceType;
  };

  return {
    configs,
    loading,
    saving,
    isAuthorizedDomain,
    saveConfig,
    deleteConfig,
    updateConfig,
    getServiceName
  };
}
