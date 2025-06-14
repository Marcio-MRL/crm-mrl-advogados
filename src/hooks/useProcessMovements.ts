
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { ProcessMovement } from './useProcesses';

export function useProcessMovements(processId: string) {
  const [movements, setMovements] = useState<ProcessMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('process_movements')
        .select('*')
        .eq('process_id', processId)
        .order('date', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setMovements(data || []);
    } catch (err) {
      console.error('Erro ao buscar andamentos:', err);
      setError('Erro ao carregar andamentos');
    } finally {
      setLoading(false);
    }
  };

  const createMovement = async (movementData: Omit<ProcessMovement, 'id' | 'user_id' | 'process_id'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('process_movements')
        .insert({
          ...movementData,
          process_id: processId,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success('Andamento adicionado com sucesso!');
      await fetchMovements(); // Recarregar lista
      return data;
    } catch (err) {
      console.error('Erro ao criar andamento:', err);
      toast.error('Erro ao adicionar andamento');
      throw err;
    }
  };

  const updateMovement = async (id: string, movementData: Partial<ProcessMovement>) => {
    try {
      const { error } = await supabase
        .from('process_movements')
        .update(movementData)
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Andamento atualizado com sucesso!');
      await fetchMovements(); // Recarregar lista
    } catch (err) {
      console.error('Erro ao atualizar andamento:', err);
      toast.error('Erro ao atualizar andamento');
      throw err;
    }
  };

  const deleteMovement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('process_movements')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Andamento excluído com sucesso!');
      await fetchMovements(); // Recarregar lista
    } catch (err) {
      console.error('Erro ao excluir andamento:', err);
      toast.error('Erro ao excluir andamento');
      throw err;
    }
  };

  useEffect(() => {
    if (processId) {
      fetchMovements();
    }
  }, [processId]);

  return {
    movements,
    loading,
    error,
    createMovement,
    updateMovement,
    deleteMovement,
    refetch: fetchMovements
  };
}
