
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'master' | 'admin' | 'advogado' | 'leitor';
  status: 'pending_approval' | 'approved' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface AccessLog {
  id: string;
  user_id: string;
  email: string;
  action: string;
  details: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export function useUserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUsers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Mapear os dados para o formato esperado
      const mappedUsers = (data || []).map((profile: any) => ({
        id: profile.id,
        email: profile.email || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        role: profile.role || 'leitor',
        status: profile.status === 'pending_approval' ? 'pending_approval' : 
                profile.status === 'suspended' ? 'suspended' : 'approved',
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }));
      
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao carregar usuários');
    }
  };

  const fetchAccessLogs = async () => {
    if (!user) return;

    try {
      // Simulando logs enquanto a tabela não é reconhecida
      const mockLogs: AccessLog[] = [
        {
          id: '1',
          user_id: user.id,
          email: user.email || '',
          action: 'login',
          details: { timestamp: new Date().toISOString() },
          created_at: new Date().toISOString()
        }
      ];
      setAccessLogs(mockLogs);
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
      toast.error('Erro ao carregar logs de acesso');
    }
  };

  const approveUser = async (email: string, role: 'admin' | 'advogado' | 'leitor' = 'leitor') => {
    try {
      const { error } = await supabase.rpc('approve_user', {
        user_email: email,
        new_role: role
      });

      if (error) throw error;

      toast.success('Usuário aprovado com sucesso');
      await fetchUsers();
      await fetchAccessLogs();
      return true;
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error);
      toast.error('Erro ao aprovar usuário');
      return false;
    }
  };

  const suspendUser = async (email: string) => {
    try {
      const { error } = await supabase.rpc('suspend_user', {
        user_email: email
      });

      if (error) throw error;

      toast.success('Usuário suspenso com sucesso');
      await fetchUsers();
      await fetchAccessLogs();
      return true;
    } catch (error) {
      console.error('Erro ao suspender usuário:', error);
      toast.error('Erro ao suspender usuário');
      return false;
    }
  };

  const checkUserRole = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, status')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao verificar role do usuário:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setLoading(true);
      await fetchUsers();
      await fetchAccessLogs();
      setLoading(false);
    };

    loadData();
  }, [user]);

  return {
    users,
    accessLogs,
    loading,
    approveUser,
    suspendUser,
    checkUserRole,
    refetch: () => {
      fetchUsers();
      fetchAccessLogs();
    }
  };
}
