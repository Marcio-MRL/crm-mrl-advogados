
import React, { useState } from 'react';
import { Check, Clock, Plus, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { TaskViewModal } from '@/components/task/TaskViewModal';
import { TaskEditModal } from '@/components/task/TaskEditModal';
import { useTasks } from '@/hooks/useTasks';
import { toast } from 'sonner';
import { formatDate } from '@/integrations/supabase/client';

interface Task {
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

interface TaskListProps {
  tasks: Task[];
  loading?: boolean;
  className?: string;
  showHeader?: boolean;
}

export function TaskList({ tasks, loading = false, className, showHeader = false }: TaskListProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { toggleTaskCompletion, updateTask, deleteTask } = useTasks();

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };
  
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedTask(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveTask = async (updatedTaskData: Partial<Task>) => {
    if (!editingTask) return;
    
    await updateTask(editingTask.id, updatedTaskData);
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };
  
  const handleStatusChange = async (taskId: string, completed: boolean) => {
    await toggleTaskCompletion(taskId, completed);
    toast.success(`Tarefa ${completed ? 'concluída' : 'reaberta'} com sucesso`);
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-blue-500';
      default: return 'border-gray-500';
    }
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !selectedTask?.completed;
  };

  if (loading) {
    return (
      <div className={cn("glass-card rounded-lg p-4", className)}>
        {showHeader && <h2 className="text-lg font-semibold mb-3 text-lawblue-700">Tarefas Urgentes</h2>}
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-lawblue-500"></div>
          <span className="ml-2 text-sm">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cn("glass-card rounded-lg p-4", className)}>
        {showHeader && (
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-lawblue-700">Tarefas Urgentes</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-lawblue-500 hover:text-lawblue-700"
              onClick={() => window.location.href = '/tarefas'}
            >
              <Plus size={16} className="mr-1" /> Nova
            </Button>
          </div>
        )}
        
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma tarefa urgente</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id} 
                className={cn(
                  "p-3 rounded-md flex items-center justify-between border-l-4 cursor-pointer hover:bg-gray-50/50 transition-colors",
                  task.completed ? "bg-gray-100/50 border-green-500" : 
                  getPriorityColor(task.priority),
                  isOverdue(task.due_date) && !task.completed ? "bg-red-50/80" : "bg-white/70"
                )}
                onClick={() => handleTaskClick(task)}
              >
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn(
                      "rounded-full w-6 h-6 mr-2",
                      task.completed ? "text-green-500" : "text-gray-400"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(task.id, !task.completed);
                    }}
                  >
                    {task.completed ? <Check size={14} /> : <Clock size={14} />}
                  </Button>
                  <div>
                    <p className={cn(
                      "text-sm font-medium",
                      task.completed ? "text-gray-500 line-through" : "text-gray-700"
                    )}>
                      {task.title}
                      {isOverdue(task.due_date) && !task.completed && (
                        <AlertTriangle className="inline h-3 w-3 ml-1 text-red-500" />
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {task.due_date ? `Prazo: ${formatDate(task.due_date)}` : 'Sem prazo definido'}
                    </p>
                  </div>
                </div>
                <div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-lawblue-500 hover:text-lawblue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskClick(task);
                    }}
                  >
                    Ver
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <TaskViewModal 
        task={selectedTask}
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        onStatusChange={handleStatusChange}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

      <TaskEditModal
        task={editingTask}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveTask}
      />
    </>
  );
}
