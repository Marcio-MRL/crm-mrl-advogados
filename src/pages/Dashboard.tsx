
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsSection } from '@/components/dashboard/StatsSection';
import { TaskList } from '@/components/dashboard/TaskList';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { AddButtons } from '@/components/dashboard/AddButtons';
import { DashboardModals } from '@/components/dashboard/DashboardModals';
import { useState } from 'react';

export default function Dashboard() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);

  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Visão geral do escritório</p>
          </div>
          
          <AddButtons 
            onLeadClick={() => setIsLeadModalOpen(true)}
            onClientClick={() => setIsClientModalOpen(true)}
            onProcessClick={() => setIsProcessModalOpen(true)}
          />
        </div>

        <StatsSection />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartsSection />
          </div>
          <div>
            <TaskList />
          </div>
        </div>

        <DashboardModals 
          isLeadModalOpen={isLeadModalOpen}
          setIsLeadModalOpen={setIsLeadModalOpen}
          isClientModalOpen={isClientModalOpen}
          setIsClientModalOpen={setIsClientModalOpen}
          isProcessModalOpen={isProcessModalOpen}
          setIsProcessModalOpen={setIsProcessModalOpen}
        />
      </div>
    </MainLayout>
  );
}
