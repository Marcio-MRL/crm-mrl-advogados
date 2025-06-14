
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProcessData {
  id?: string;
  process_number: string;
  title: string;
  client_id?: string;
  client_name?: string;
  process_type: string;
  forum?: string;
  status?: string;
  start_date?: string;
  responsible?: string;
  description?: string;
  user_id?: string;
}

export interface ProcessMovement {
  id?: string;
  process_id: string;
  date: string;
  type: string;
  description: string;
  responsible?: string;
  deadline?: string;
  user_id?: string;
}

export function useProcesses() {
  const [processes, setProcesses] = useState<ProcessData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProcesses = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('processes')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setProcesses(data || []);
    } catch (err) {
      console.error('Erro ao buscar processos:', err);
      setError('Erro ao carregar processos');
      toast.error('Erro ao carregar processos');
    } finally {
      setLoading(false);
    }
  };

  const createProcess = async (processData: Omit<ProcessData, 'id' | 'user_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('processes')
        .insert({
          ...processData,
          user_id: user.id,
          status: processData.status || 'em_andamento'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success('Processo criado com sucesso!');
      await fetchProcesses(); // Recarregar lista
      return data;
    } catch (err) {
      console.error('Erro ao criar processo:', err);
      toast.error('Erro ao criar processo');
      throw err;
    }
  };

  const updateProcess = async (id: string, processData: Partial<ProcessData>) => {
    try {
      const { error } = await supabase
        .from('processes')
        .update(processData)
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Processo atualizado com sucesso!');
      await fetchProcesses(); // Recarregar lista
    } catch (err) {
      console.error('Erro ao atualizar processo:', err);
      toast.error('Erro ao atualizar processo');
      throw err;
    }
  };

  const deleteProcess = async (id: string) => {
    try {
      const { error } = await supabase
        .from('processes')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Processo excluído com sucesso!');
      await fetchProcesses(); // Recarregar lista
    } catch (err) {
      console.error('Erro ao excluir processo:', err);
      toast.error('Erro ao excluir processo');
      throw err;
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  return {
    processes,
    loading,
    error,
    createProcess,
    updateProcess,
    deleteProcess,
    refetch: fetchProcesses
  };
}
