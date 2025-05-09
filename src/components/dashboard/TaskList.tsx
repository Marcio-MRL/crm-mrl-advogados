
import React, { useState } from 'react';
import { Check, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { TaskViewModal } from '@/components/task/TaskViewModal';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  description?: string;
}

interface TaskListProps {
  tasks: Task[];
  className?: string;
}

export function TaskList({ tasks: initialTasks, className }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };
  
  const handleStatusChange = (taskId: string, completed: boolean) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed } : task
      )
    );
  };

  return (
    <>
      <div className={cn("glass-card rounded-lg p-4", className)}>
        <h2 className="text-lg font-semibold mb-3 text-lawblue-700">Tarefas Urgentes</h2>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={cn(
                "p-3 rounded-md flex items-center justify-between border-l-4",
                task.completed ? "bg-gray-100/50 border-green-500" : 
                task.priority === 'high' ? "bg-white/70 border-red-500" : 
                task.priority === 'medium' ? "bg-white/70 border-yellow-500" : 
                "bg-white/70 border-blue-500"
              )}
            >
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "rounded-full w-6 h-6 mr-2",
                    task.completed ? "text-green-500" : "text-gray-400"
                  )}
                  onClick={() => {
                    handleStatusChange(task.id, !task.completed);
                    toast.success(`Tarefa ${task.completed ? 'reaberta' : 'concluída'} com sucesso`);
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
                  </p>
                  <p className="text-xs text-gray-500">
                    Prazo: {task.dueDate}
                  </p>
                </div>
              </div>
              <div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-lawblue-500 hover:text-lawblue-700"
                  onClick={() => handleTaskClick(task)}
                >
                  Ver
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <TaskViewModal 
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}
