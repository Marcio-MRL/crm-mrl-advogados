
import { useState, useEffect } from 'react';
import { supabase, getCurrentUserId } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GoogleIntegration {
  id: string;
  user_id: string;
  service_type: 'calendar' | 'sheets';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useGoogleAuth() {
  const [integrations, setIntegrations] = useState<GoogleIntegration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const userId = await getCurrentUserId();
      
      if (!userId) {
        return;
      }

      const { data, error } = await supabase
        .from('google_integrations')
        .select('id, user_id, service_type, is_active, created_at, updated_at')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching integrations:', error);
        toast.error('Erro ao carregar integrações');
        return;
      }

      setIntegrations(data || []);
    } catch (error) {
      console.error('Erro ao buscar integrações:', error);
    } finally {
      setLoading(false);
    }
  };

  const initiateGoogleAuth = async (serviceType: 'calendar' | 'sheets') => {
    try {
      const userId = await getCurrentUserId();
      
      if (!userId) {
        toast.error('Você precisa estar logado');
        return;
      }

      // Verificar se o usuário tem um email do domínio permitido
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.email?.endsWith('@mrladvogados.com.br')) {
        toast.error('OAuth do Google disponível apenas para usuários do domínio @mrladvogados.com.br');
        return;
      }

      // Por enquanto, mostrar uma mensagem informativa até a implementação completa
      toast.info(`Integração com Google ${serviceType === 'calendar' ? 'Calendar' : 'Sheets'} será implementada em breve. Disponível apenas para usuários @mrladvogados.com.br após liberação do usuário master.`);
      
    } catch (error) {
      console.error('Erro ao iniciar autenticação:', error);
      toast.error('Erro ao iniciar autenticação');
    }
  };

  const disconnectService = async (serviceType: 'calendar' | 'sheets') => {
    try {
      const userId = await getCurrentUserId();
      
      if (!userId) {
        toast.error('Você precisa estar logado');
        return;
      }

      const { error } = await supabase
        .from('google_integrations')
        .update({ is_active: false, access_token: null, refresh_token: null })
        .eq('user_id', userId)
        .eq('service_type', serviceType);

      if (error) {
        console.error('Error disconnecting service:', error);
        toast.error('Erro ao desconectar serviço');
        return;
      }

      toast.success(`${serviceType === 'calendar' ? 'Google Calendar' : 'Google Sheets'} desconectado`);
      fetchIntegrations();
    } catch (error) {
      console.error('Erro ao desconectar serviço:', error);
      toast.error('Erro ao desconectar serviço');
    }
  };

  const isServiceConnected = (serviceType: 'calendar' | 'sheets') => {
    return integrations.some(integration => 
      integration.service_type === serviceType && integration.is_active
    );
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  return {
    integrations,
    loading,
    initiateGoogleAuth,
    disconnectService,
    isServiceConnected,
    refetch: fetchIntegrations,
  };
}
