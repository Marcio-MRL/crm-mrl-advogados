
import { useState, useEffect } from 'react';
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
      // Simulação de sessões para demonstração
      const mockSessions: SecuritySession[] = [
        {
          id: '1',
          session_token: 'current-session',
          ip_address: '192.168.1.1',
          user_agent: navigator.userAgent,
          is_active: true,
          last_activity: new Date().toISOString(),
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setSessions(mockSessions);
    } catch (error) {
      console.error('Erro ao buscar sessões:', error);
      toast.error('Erro ao carregar sessões de segurança');
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      setSessions(prev => prev.map(session => 
        session.id === sessionId ? { ...session, is_active: false } : session
      ));
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
      setSessions(prev => prev.map(session => 
        session.session_token !== 'current-session' ? { ...session, is_active: false } : session
      ));
      toast.success('Todas as outras sessões foram terminadas');
      return true;
    } catch (error) {
      console.error('Erro ao terminar sessões:', error);
      toast.error('Erro ao terminar sessões');
      return false;
    }
  };

  const createSession = async () => {
    if (!user) return;
    console.log('Criando nova sessão...');
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
