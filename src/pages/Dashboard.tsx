
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsSection } from '@/components/dashboard/StatsSection';
import { TaskList } from '@/components/dashboard/TaskList';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { AddButtons } from '@/components/dashboard/AddButtons';
import { DashboardModals } from '@/components/dashboard/DashboardModals';
import { useState } from 'react';

// Mock urgent tasks data
const mockUrgentTasks = [
  {
    id: '1',
    title: 'Revisar contrato ABC Corp',
    dueDate: '2024-01-15',
    priority: 'high' as const,
    completed: false,
    description: 'Análise completa do contrato de prestação de serviços'
  },
  {
    id: '2',
    title: 'Preparar audiência processo 123',
    dueDate: '2024-01-16',
    priority: 'high' as const,
    completed: false,
    description: 'Preparação de documentos e estratégia para audiência'
  },
  {
    id: '3',
    title: 'Responder email cliente XYZ',
    dueDate: '2024-01-17',
    priority: 'medium' as const,
    completed: false,
    description: 'Esclarecimentos sobre andamento do processo'
  }
];

export default function Dashboard() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [urgentTasks, setUrgentTasks] = useState(mockUrgentTasks);

  const handleClientAdded = () => {
    setIsClientModalOpen(false);
  };

  const handleProcessAdded = () => {
    setIsProcessModalOpen(false);
  };

  const handleLeadAdded = () => {
    setIsLeadModalOpen(false);
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartsSection 
              urgentTasks={urgentTasks}
              onTasksChange={setUrgentTasks}
            />
          </div>
          <div>
            <TaskList 
              tasks={urgentTasks}
              onTasksChange={setUrgentTasks}
            />
          </div>
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
