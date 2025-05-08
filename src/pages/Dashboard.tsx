
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { TaskList } from '@/components/dashboard/TaskList';
import { Button } from "@/components/ui/button";
import { Users, FileText, Gavel, DollarSign, TrendingUp, Plus } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { FormModal } from '@/components/common/FormModal';
import { ClientForm } from '@/components/clients/ClientForm';
import { ContratoForm } from '@/components/contratos/ContratoForm';
import { toast } from 'sonner';

const revenueData = [
  { name: 'Jan', atual: 4000, anterior: 2400 },
  { name: 'Fev', atual: 3000, anterior: 1398 },
  { name: 'Mar', atual: 2000, anterior: 9800 },
  { name: 'Abr', atual: 2780, anterior: 3908 },
  { name: 'Mai', atual: 1890, anterior: 4800 },
  { name: 'Jun', atual: 2390, anterior: 3800 },
];

const processData = [
  { name: 'Tributário', ativos: 40, concluídos: 24 },
  { name: 'Trabalhista', ativos: 30, concluídos: 13 },
  { name: 'Cível', ativos: 20, concluídos: 98 },
  { name: 'Empresarial', ativos: 27, concluídos: 39 },
  { name: 'Contratos', ativos: 18, concluídos: 48 },
];

const urgentTasks = [
  {
    id: '1',
    title: 'Protocolar recurso Processo 1234-5',
    dueDate: 'Hoje, 16:00',
    priority: 'high' as const,
    completed: false,
  },
  {
    id: '2',
    title: 'Reunião com cliente ABC Ltda',
    dueDate: 'Hoje, 14:30',
    priority: 'medium' as const,
    completed: false,
  },
  {
    id: '3',
    title: 'Enviar proposta para Lead XYZ',
    dueDate: 'Amanhã, 12:00',
    priority: 'medium' as const,
    completed: false,
  },
  {
    id: '4',
    title: 'Revisar contrato Cliente DEF',
    dueDate: 'Ontem, 18:00',
    priority: 'high' as const,
    completed: true,
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
      
      <div className="flex flex-wrap justify-end mb-4 gap-2">
        <Button 
          className="bg-lawblue-500 hover:bg-lawblue-600"
          onClick={openClientModal}
        >
          <Plus size={16} className="mr-1" /> Novo Cliente
        </Button>
        <Button 
          className="bg-lawblue-500 hover:bg-lawblue-600"
          onClick={openProcessModal}
        >
          <Plus size={16} className="mr-1" /> Novo Processo
        </Button>
        <Button 
          className="bg-lawblue-500 hover:bg-lawblue-600"
          onClick={openLeadModal}
        >
          <Plus size={16} className="mr-1" /> Novo Lead
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total de Leads" 
          value="24" 
          icon={<Users size={20} />} 
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Clientes Ativos" 
          value="48" 
          icon={<Users size={20} />} 
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard 
          title="Processos em Andamento" 
          value="75" 
          icon={<Gavel size={20} />} 
          trend={{ value: 2, isPositive: false }}
        />
        <StatCard 
          title="Honorários Previstos" 
          value="R$ 125.400" 
          icon={<DollarSign size={20} />} 
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ChartCard title="Receitas Mensais" className="col-span-2">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="atual" 
                name="Ano Atual"
                stroke="#6D8299" 
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="anterior" 
                name="Ano Anterior"
                stroke="#aebbc8" 
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <TaskList tasks={urgentTasks} className="h-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Processos por Área">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={processData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="ativos" name="Em Andamento" fill="#6D8299" radius={[4, 4, 0, 0]} />
              <Bar dataKey="concluídos" name="Concluídos" fill="#aebbc8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard title="Performance Semanal">
          <div className="flex items-center justify-center h-full">
            <div className="text-center flex flex-col items-center justify-center p-6">
              <div className="p-6 rounded-full glass-card mb-4 flex items-center justify-center">
                <TrendingUp size={32} className="text-lawblue-500" />
              </div>
              <h3 className="text-xl font-bold mb-1">15% de aumento</h3>
              <p className="text-sm text-gray-500 mb-2">em Produtividade</p>
              <Button className="bg-lawblue-500 hover:bg-lawblue-600 mt-2">
                Ver Relatório Completo
              </Button>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Client Form Modal */}
      <FormModal
        isOpen={isClientModalOpen}
        onClose={closeClientModal}
        title="Adicionar Novo Cliente"
      >
        <ClientForm onSuccess={handleClientAdded} onCancel={closeClientModal} />
      </FormModal>

      {/* Process Form Modal */}
      <FormModal
        isOpen={isProcessModalOpen}
        onClose={closeProcessModal}
        title="Adicionar Novo Processo"
      >
        <div className="p-4">
          <p>Formulário de processo será implementado em breve.</p>
          <div className="flex justify-end mt-4">
            <Button onClick={closeProcessModal}>Fechar</Button>
          </div>
        </div>
      </FormModal>

      {/* Lead Form Modal */}
      <FormModal
        isOpen={isLeadModalOpen}
        onClose={closeLeadModal}
        title="Adicionar Novo Lead"
      >
        <div className="p-4">
          <p>Formulário de lead será implementado em breve.</p>
          <div className="flex justify-end mt-4">
            <Button onClick={closeLeadModal}>Fechar</Button>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
