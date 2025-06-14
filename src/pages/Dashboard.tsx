
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { StatsSection } from '@/components/dashboard/StatsSection';
import { TaskList } from '@/components/dashboard/TaskList';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ProcessChart } from '@/components/dashboard/ProcessChart';
import { PerformanceCard } from '@/components/dashboard/PerformanceCard';
import { AddButtons } from '@/components/dashboard/AddButtons';
import { DashboardModals } from '@/components/dashboard/DashboardModals';
import { TaskFormModal } from '@/components/task/TaskFormModal';
import { useTasks } from '@/hooks/useTasks';
import { useState } from 'react';

export default function Dashboard() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  const { tasks, loading, createTask } = useTasks();

  // Filter urgent tasks: high priority or due within 3 days
  const urgentTasks = tasks.filter(task => {
    if (task.completed) return false;
    
    const isHighPriority = task.priority === 'high';
    const isDueSoon = task.due_date && 
      new Date(task.due_date) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    
    return isHighPriority || isDueSoon;
  }).slice(0, 5); // Show max 5 urgent tasks

  const handleClientAdded = () => {
    setIsClientModalOpen(false);
  };

  const handleProcessAdded = () => {
    setIsProcessModalOpen(false);
  };

  const handleLeadAdded = () => {
    setIsLeadModalOpen(false);
  };

  const handleTaskAdded = async (taskData: any): Promise<boolean> => {
    const success = await createTask(taskData);
    if (success) {
      setIsTaskModalOpen(false);
    }
    return success;
  };

  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header title="Visão Geral" subtitle="Bem-vindo ao CRM do MRL Advogados" />
        
        <div className="flex justify-end">
          <AddButtons 
            openLeadModal={() => setIsLeadModalOpen(true)}
            openClientModal={() => setIsClientModalOpen(true)}
            openProcessModal={() => setIsProcessModalOpen(true)}
            openTaskModal={() => setIsTaskModalOpen(true)}
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
              loading={loading}
              showHeader={true}
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

        <TaskFormModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSubmit={handleTaskAdded}
        />
      </div>
    </MainLayout>
  );
}
