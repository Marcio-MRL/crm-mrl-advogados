
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter } from 'lucide-react';
import { TaskCard } from '@/components/task/TaskCard';
import { TaskCreateModal } from '@/components/task/TaskCreateModal';
import { TaskViewModal } from '@/components/task/TaskViewModal';
import { TaskEditModal } from '@/components/task/TaskEditModal';
import { toast } from 'sonner';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  description?: string;
  category: 'processo' | 'cliente' | 'audiencia' | 'prazo' | 'geral';
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Revisar contrato da Empresa ABC',
    dueDate: 'Hoje, 16:00',
    priority: 'high',
    completed: false,
    description: 'Revisar cláusulas contratuais e fazer ajustes necessários',
    category: 'processo'
  },
  {
    id: '2',
    title: 'Preparar documentos para audiência',
    dueDate: 'Amanhã, 09:30',
    priority: 'high',
    completed: false,
    description: 'Organizar todos os documentos necessários para a audiência',
    category: 'audiencia'
  },
  {
    id: '3',
    title: 'Ligar para cliente João Silva',
    dueDate: 'Hoje, 14:00',
    priority: 'medium',
    completed: true,
    description: 'Discutir andamento do processo',
    category: 'cliente'
  },
  {
    id: '4',
    title: 'Prazo para recurso - Processo 001',
    dueDate: 'Em 3 dias',
    priority: 'high',
    completed: false,
    description: 'Preparar e protocolar recurso',
    category: 'prazo'
  }
];

export default function Tarefas() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && !task.completed;
    if (activeTab === 'completed') return matchesSearch && task.completed;
    return matchesSearch && task.category === activeTab;
  });

  const handleCreateTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString()
    };
    setTasks(prev => [...prev, task]);
    setIsCreateModalOpen(false);
    toast.success('Tarefa criada com sucesso!');
  };

  const handleTaskStatusChange = (taskId: string, completed: boolean) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed } : task
    ));
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setIsViewModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header 
          title="Tarefas" 
          subtitle="Gerencie suas tarefas e prazos" 
        />
        
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar tarefas..."
              className="pl-8 w-full md:w-[300px] bg-white/70 border-lawblue-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" /> Filtros
            </Button>
            <Button 
              className="flex items-center gap-1 bg-lawblue-500 hover:bg-lawblue-600"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4" /> Nova Tarefa
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="completed">Concluídas</TabsTrigger>
            <TabsTrigger value="processo">Processos</TabsTrigger>
            <TabsTrigger value="audiencia">Audiências</TabsTrigger>
            <TabsTrigger value="prazo">Prazos</TabsTrigger>
            <TabsTrigger value="cliente">Clientes</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhuma tarefa encontrada</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleTaskStatusChange}
                    onClick={handleTaskClick}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <TaskCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateTask}
        />

        <TaskViewModal
          task={selectedTask}
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedTask(null);
          }}
          onStatusChange={handleTaskStatusChange}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />

        <TaskEditModal
          task={selectedTask}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTask(null);
          }}
          onSave={handleSaveTask}
        />
      </div>
    </MainLayout>
  );
}
