
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  description?: string;
  category: 'processo' | 'cliente' | 'audiencia' | 'prazo' | 'geral';
}

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, completed: boolean) => void;
  onClick: (task: Task) => void;
}

export function TaskCard({ task, onStatusChange, onClick }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'processo': return 'bg-purple-100 text-purple-800';
      case 'cliente': return 'bg-green-100 text-green-800';
      case 'audiencia': return 'bg-red-100 text-red-800';
      case 'prazo': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case 'processo': return 'Processo';
      case 'cliente': return 'Cliente';
      case 'audiencia': return 'Audiência';
      case 'prazo': return 'Prazo';
      default: return 'Geral';
    }
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow ${
        task.completed ? 'opacity-60' : ''
      }`}
      onClick={() => onClick(task)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => onStatusChange(task.id, !!checked)}
            onClick={(e) => e.stopPropagation()}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-medium text-sm ${
                task.completed ? 'line-through text-gray-500' : ''
              }`}>
                {task.title}
              </h3>
              <span className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <Clock className="h-3 w-3" />
              <span>{task.dueDate}</span>
            </div>
            
            <Badge 
              variant="secondary" 
              className={`text-xs ${getCategoryColor(task.category)}`}
            >
              {getCategoryLabel(task.category)}
            </Badge>
            
            {task.description && (
              <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
