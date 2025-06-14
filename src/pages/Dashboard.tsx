
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsSection } from '@/components/dashboard/StatsSection';
import { TaskList } from '@/components/dashboard/TaskList';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ProcessChart } from '@/components/dashboard/ProcessChart';
import { PerformanceCard } from '@/components/dashboard/PerformanceCard';
import { AddButtons } from '@/components/dashboard/AddButtons';
import { DashboardModals } from '@/components/dashboard/DashboardModals';
import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  description?: string;
  category: 'processo' | 'cliente' | 'audiencia' | 'prazo' | 'geral';
}

// Mock urgent tasks data
const mockUrgentTasks: Task[] = [
  {
    id: '1',
    title: 'Revisar contrato ABC Corp',
    dueDate: '2024-01-15',
    priority: 'high' as const,
    completed: false,
    description: 'Análise completa do contrato de prestação de serviços',
    category: 'processo'
  },
  {
    id: '2',
    title: 'Preparar audiência processo 123',
    dueDate: '2024-01-16',
    priority: 'high' as const,
    completed: false,
    description: 'Preparação de documentos e estratégia para audiência',
    category: 'audiencia'
  },
  {
    id: '3',
    title: 'Responder email cliente XYZ',
    dueDate: '2024-01-17',
    priority: 'medium' as const,
    completed: false,
    description: 'Esclarecimentos sobre andamento do processo',
    category: 'cliente'
  }
];

export default function Dashboard() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [urgentTasks, setUrgentTasks] = useState<Task[]>(mockUrgentTasks);

  const handleClientAdded = () => {
    setIsClientModalOpen(false);
  };

  const handleProcessAdded = () => {
    setIsProcessModalOpen(false);
  };

  const handleLeadAdded = () => {
    setIsLeadModalOpen(false);
  };

  const handleTasksChange = (newTasks: Task[]) => {
    setUrgentTasks(newTasks);
  };

  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Visão geral do escritório</p>
          </div>
          
          <AddButtons 
            openLeadModal={() => setIsLeadModalOpen(true)}
            openClientModal={() => setIsClientModalOpen(true)}
            openProcessModal={() => setIsProcessModalOpen(true)}
          />
        </div>

        <StatsSection />
        
        {/* Layout em 3 colunas mais balanceado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna 1: Receitas */}
          <div className="lg:col-span-1">
            <RevenueChart />
          </div>
          
          {/* Coluna 2: Processos */}
          <div className="lg:col-span-1">
            <ProcessChart />
          </div>
          
          {/* Coluna 3: Tarefas Urgentes */}
          <div className="lg:col-span-1">
            <TaskList 
              tasks={urgentTasks}
              onTasksChange={handleTasksChange}
            />
          </div>
        </div>

        {/* Seção adicional para performance */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <PerformanceCard />
        </div>

        <DashboardModals 
          isLeadModalOpen={isLeadModalOpen}
          closeLeadModal={() => setIsLeadModalOpen(false)}
          isClientModalOpen={isClientModalOpen}
          closeClientModal={() => setIsClientModalOpen(false)}
          isProcessModalOpen={isProcessModalOpen}
          closeProcessModal={() => setIsProcessModalOpen(false)}
          handleClientAdded={handleClientAdded}
          handleProcessAdded={handleProcessAdded}
          handleLeadAdded={handleLeadAdded}
        />
      </div>
    </MainLayout>
  );
}
