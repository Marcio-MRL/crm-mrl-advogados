
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { toast } from 'sonner';
import { AddButtons } from '@/components/dashboard/AddButtons';
import { StatsSection } from '@/components/dashboard/StatsSection';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { BottomCharts } from '@/components/dashboard/BottomCharts';
import { DashboardModals } from '@/components/dashboard/DashboardModals';

const urgentTasks = [
  {
    id: '1',
    title: 'Protocolar recurso Processo 1234-5',
    dueDate: 'Hoje, 16:00',
    priority: 'high' as const,
    completed: false,
    description: 'Prazo final para protocolar o recurso de apelação no processo 1234-5 do cliente ABC Ltda.',
  },
  {
    id: '2',
    title: 'Reunião com cliente ABC Ltda',
    dueDate: 'Hoje, 14:30',
    priority: 'medium' as const,
    completed: false,
    description: 'Reunião para discutir estratégia processual e próximos passos no caso tributário.',
  },
  {
    id: '3',
    title: 'Enviar proposta para Lead XYZ',
    dueDate: 'Amanhã, 12:00',
    priority: 'medium' as const,
    completed: false,
    description: 'Enviar proposta comercial para o lead XYZ conforme discutido na reunião inicial.',
  },
  {
    id: '4',
    title: 'Revisar contrato Cliente DEF',
    dueDate: 'Ontem, 18:00',
    priority: 'high' as const,
    completed: true,
    description: 'Revisar cláusulas contratuais e enviar para assinatura do cliente DEF.',
  },
];

export default function Dashboard() {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  const openClientModal = () => setIsClientModalOpen(true);
  const closeClientModal = () => setIsClientModalOpen(false);
  
  const openProcessModal = () => setIsProcessModalOpen(true);
  const closeProcessModal = () => setIsProcessModalOpen(false);
  
  const openLeadModal = () => setIsLeadModalOpen(true);
  const closeLeadModal = () => setIsLeadModalOpen(false);

  const handleClientAdded = () => {
    closeClientModal();
    toast.success("Cliente adicionado com sucesso!");
  };

  const handleProcessAdded = () => {
    closeProcessModal();
    toast.success("Processo adicionado com sucesso!");
  };

  const handleLeadAdded = () => {
    closeLeadModal();
    toast.success("Lead adicionado com sucesso!");
  };

  return (
    <div>
      <Header 
        title="Visão Geral" 
        subtitle="Bem-vindo ao Juris Flow Elegance - Gestão Jurídica" 
      />
      
      <AddButtons
        openClientModal={openClientModal}
        openProcessModal={openProcessModal}
        openLeadModal={openLeadModal}
      />
      
      <StatsSection />

      <ChartsSection urgentTasks={urgentTasks} />

      <BottomCharts />

      <DashboardModals
        isClientModalOpen={isClientModalOpen}
        isProcessModalOpen={isProcessModalOpen}
        isLeadModalOpen={isLeadModalOpen}
        closeClientModal={closeClientModal}
        closeProcessModal={closeProcessModal}
        closeLeadModal={closeLeadModal}
        handleClientAdded={handleClientAdded}
        handleProcessAdded={handleProcessAdded}
        handleLeadAdded={handleLeadAdded}
      />
    </div>
  );
}
