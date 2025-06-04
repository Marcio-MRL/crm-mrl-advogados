
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  description?: string;
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
  
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></span>
            <span className="text-sm text-gray-600">
              Prioridade: {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Prazo: {task.dueDate}</span>
          </div>
          
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
