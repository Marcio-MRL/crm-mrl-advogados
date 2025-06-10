
import { useState, useEffect } from 'react';
import { supabase, getCurrentUserId } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'high' | 'medium' | 'low';
  category: 'processo' | 'cliente' | 'audiencia' | 'prazo' | 'geral';
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  due_date?: string;
  priority: 'high' | 'medium' | 'low';
  category: 'processo' | 'cliente' | 'audiencia' | 'prazo' | 'geral';
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const userId = await getCurrentUserId();
      
      if (!userId) {
        toast.error('Você precisa estar logado para ver as tarefas');
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Erro ao carregar tarefas: ' + error.message);
        return;
      }

      // Type assertion para garantir que priority e category sejam dos tipos corretos
      const typedData = (data || []).map(item => ({
        ...item,
        priority: item.priority as 'high' | 'medium' | 'low',
        category: item.category as 'processo' | 'cliente' | 'audiencia' | 'prazo' | 'geral'
      }));

      setTasks(typedData);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      toast.error('Ocorreu um erro ao carregar as tarefas');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: CreateTaskData) => {
    try {
      const userId = await getCurrentUserId();
      
      if (!userId) {
        toast.error('Você precisa estar logado para criar tarefas');
        return false;
      }

      const { error } = await supabase.from('tasks').insert({
        ...taskData,
        user_id: userId,
      });

      if (error) {
        console.error('Error creating task:', error);
        toast.error('Erro ao criar tarefa: ' + error.message);
        return false;
      }

      toast.success('Tarefa criada com sucesso!');
      fetchTasks();
      return true;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Ocorreu um erro ao criar a tarefa');
      return false;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const userId = await getCurrentUserId();
      
      if (!userId) {
        toast.error('Você precisa estar logado para atualizar tarefas');
        return false;
      }

      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating task:', error);
        toast.error('Erro ao atualizar tarefa: ' + error.message);
        return false;
      }

      toast.success('Tarefa atualizada com sucesso!');
      fetchTasks();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      toast.error('Ocorreu um erro ao atualizar a tarefa');
      return false;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const userId = await getCurrentUserId();
      
      if (!userId) {
        toast.error('Você precisa estar logado para excluir tarefas');
        return false;
      }

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error deleting task:', error);
        toast.error('Erro ao excluir tarefa: ' + error.message);
        return false;
      }

      toast.success('Tarefa excluída com sucesso!');
      fetchTasks();
      return true;
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      toast.error('Ocorreu um erro ao excluir a tarefa');
      return false;
    }
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    return updateTask(taskId, { completed });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    refetch: fetchTasks,
  };
}
