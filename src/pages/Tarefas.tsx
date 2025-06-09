
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from "@/components/ui/button";
import { Plus, Filter, Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskFormModal } from '@/components/task/TaskFormModal';
import { useTasks, Task } from '@/hooks/useTasks';
import { formatDate } from '@/integrations/supabase/client';

const priorityConfig = {
  high: { label: 'Alta', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
  medium: { label: 'Média', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  low: { label: 'Baixa', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
};

const categoryConfig = {
  processo: { label: 'Processo', color: 'bg-blue-100 text-blue-800' },
  cliente: { label: 'Cliente', color: 'bg-purple-100 text-purple-800' },
  audiencia: { label: 'Audiência', color: 'bg-orange-100 text-orange-800' },
  prazo: { label: 'Prazo', color: 'bg-red-100 text-red-800' },
  geral: { label: 'Geral', color: 'bg-gray-100 text-gray-800' },
};

export default function Tarefas() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  const { 
    tasks, 
    loading, 
    createTask, 
    updateTask, 
    deleteTask, 
    toggleTaskCompletion 
  } = useTasks();

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
    overdue: tasks.filter(t => 
      !t.completed && 
      t.due_date && 
      new Date(t.due_date) < new Date()
    ).length,
  };

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    await toggleTaskCompletion(taskId, completed);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      await deleteTask(taskId);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="w-full space-y-6">
          <Header title="Tarefas" subtitle="Gerencie suas atividades e compromissos" />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lawblue-500"></div>
            <span className="ml-2">Carregando tarefas...</span>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header title="Tarefas" subtitle="Gerencie suas atividades e compromissos" />
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Calendar className="h-8 w-8 text-lawblue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Concluídas</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Atrasadas</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas ({stats.total})
            </Button>
            <Button
              variant={filter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('pending')}
            >
              Pendentes ({stats.pending})
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('completed')}
            >
              Concluídas ({stats.completed})
            </Button>
          </div>
          
          <Button 
            className="bg-lawblue-500 hover:bg-lawblue-600"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} className="mr-1" /> Nova Tarefa
          </Button>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'all' ? 'Nenhuma tarefa encontrada' : 
                   filter === 'pending' ? 'Nenhuma tarefa pendente' : 
                   'Nenhuma tarefa concluída'}
                </h3>
                <p className="text-gray-500">
                  {filter === 'all' ? 'Comece criando sua primeira tarefa.' : 
                   filter === 'pending' ? 'Todas as tarefas foram concluídas!' : 
                   'Ainda não há tarefas concluídas.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => {
              const PriorityIcon = priorityConfig[task.priority].icon;
              const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !task.completed;
              
              return (
                <Card key={task.id} className={`${task.completed ? 'opacity-70' : ''} ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={(checked) => 
                          handleTaskToggle(task.id, checked as boolean)
                        }
                        className="mt-1"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {task.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={priorityConfig[task.priority].color}>
                                <PriorityIcon className="h-3 w-3 mr-1" />
                                {priorityConfig[task.priority].label}
                              </Badge>
                              
                              <Badge className={categoryConfig[task.category].color}>
                                {categoryConfig[task.category].label}
                              </Badge>
                              
                              {task.due_date && (
                                <Badge variant={isOverdue ? 'destructive' : 'outline'}>
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(task.due_date)}
                                  {isOverdue && ' (Atrasada)'}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <TaskFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={createTask}
        />
      </div>
    </MainLayout>
  );
}
