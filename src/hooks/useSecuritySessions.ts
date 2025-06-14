
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface SecuritySession {
  id: string;
  session_token: string;
  ip_address?: string;
  user_agent?: string;
  device_info?: any;
  is_active: boolean;
  last_activity: string;
  created_at: string;
  expires_at: string;
}

export function useSecuritySessions() {
  const [sessions, setSessions] = useState<SecuritySession[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('security_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('last_activity', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Erro ao buscar sessões:', error);
      toast.error('Erro ao carregar sessões de segurança');
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('security_sessions')
        .update({ is_active: false })
        .eq('id', sessionId);

      if (error) throw error;

      await fetchSessions();
      toast.success('Sessão terminada com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao terminar sessão:', error);
      toast.error('Erro ao terminar sessão');
      return false;
    }
  };

  const terminateAllSessions = async () => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('security_sessions')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .neq('session_token', getCurrentSessionToken());

      if (error) throw error;

      await fetchSessions();
      toast.success('Todas as outras sessões foram terminadas');
      return true;
    } catch (error) {
      console.error('Erro ao terminar sessões:', error);
      toast.error('Erro ao terminar sessões');
      return false;
    }
  };

  const getCurrentSessionToken = () => {
    // Em produção, isso viria do contexto de autenticação
    return localStorage.getItem('sb-session-token') || 'current-session';
  };

  const createSession = async () => {
    if (!user) return;

    try {
      const sessionToken = crypto.randomUUID();
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screen: `${screen.width}x${screen.height}`
      };

      const { error } = await supabase
        .from('security_sessions')
        .insert({
          user_id: user.id,
          session_token: sessionToken,
          device_info: deviceInfo,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
        });

      if (error) throw error;
      
      localStorage.setItem('sb-session-token', sessionToken);
      await fetchSessions();
    } catch (error) {
      console.error('Erro ao criar sessão:', error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  return {
    sessions,
    loading,
    terminateSession,
    terminateAllSessions,
    createSession,
    refetch: fetchSessions
  };
}
