
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, Edit, Trash2, AlertTriangle } from 'lucide-react';
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

interface TaskViewModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (taskId: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskViewModal({ task, isOpen, onClose, onStatusChange, onEdit, onDelete }: TaskViewModalProps) {
  if (!task) return null;
  
  const handleStatusToggle = () => {
    onStatusChange(task.id, !task.completed);
    toast.success(`Tarefa ${task.completed ? 'reaberta' : 'concluída'} com sucesso`);
  };
  
  const handleDeleteTask = () => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      onDelete(task.id);
      onClose();
    }
  };

  const handleEditTask = () => {
    onEdit(task);
    onClose();
  };
  
  const handleAddToCalendar = () => {
    toast.success("Tarefa adicionada ao Google Calendar");
  };
  
  const getPriorityConfig = (priority: string) => {
    switch(priority) {
      case 'high': return { label: 'Alta', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
      case 'medium': return { label: 'Média', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'low': return { label: 'Baixa', color: 'bg-green-100 text-green-800', icon: Clock };
      default: return { label: 'Média', color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const getCategoryConfig = (category: string) => {
    switch(category) {
      case 'processo': return { label: 'Processo', color: 'bg-blue-100 text-blue-800' };
      case 'cliente': return { label: 'Cliente', color: 'bg-purple-100 text-purple-800' };
      case 'audiencia': return { label: 'Audiência', color: 'bg-orange-100 text-orange-800' };
      case 'prazo': return { label: 'Prazo', color: 'bg-red-100 text-red-800' };
      default: return { label: 'Geral', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);
  const categoryConfig = getCategoryConfig(task.category);
  const PriorityIcon = priorityConfig.icon;
  
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {task.title}
            {isOverdue && <AlertTriangle className="h-5 w-5 text-red-500" />}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Badge className={priorityConfig.color}>
              <PriorityIcon className="h-3 w-3 mr-1" />
              {priorityConfig.label}
            </Badge>
            
            <Badge className={categoryConfig.color}>
              {categoryConfig.label}
            </Badge>
          </div>
          
          {task.due_date && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                Prazo: {formatDate(task.due_date)}
                {isOverdue && ' (Atrasada)'}
              </span>
            </div>
          )}
          
          {task.description && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-1">Descrição</h4>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handleAddToCalendar}
            >
              <CalendarIcon className="h-4 w-4" />
              Adicionar ao Google Calendar
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Fechar
            </Button>
            <Button 
              variant={task.completed ? "outline" : "default"} 
              size="sm"
              onClick={handleStatusToggle}
            >
              {task.completed ? "Reabrir Tarefa" : "Marcar Concluída"}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-blue-600"
              onClick={handleEditTask}
            >
              <Edit className="h-4 w-4 mr-1" /> Editar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600"
              onClick={handleDeleteTask}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Excluir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
