
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from "@/components/ui/button";
import { Plus, Grid3X3, Kanban } from 'lucide-react';
import { LeadForm } from '@/components/leads/LeadForm';
import { FormModal } from '@/components/common/FormModal';
import { toast } from 'sonner';
import { LeadGrid } from '@/components/leads/LeadGrid';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { KanbanBoard } from '@/components/leads/KanbanBoard';
import { mockLeads } from '@/data/mockLeads';
import { Lead } from '@/types/lead';

export default function Leads() {
  const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('kanban');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  
  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    toast.success("Lead adicionado com sucesso!");
  };

  const handleLeadStageChange = (leadId: string, newStage: Lead['stage']) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId 
          ? { ...lead, stage: newStage, lastContact: new Date().toLocaleDateString('pt-BR') }
          : lead
      )
    );
    toast.success("Status do lead atualizado!");
  };
  
  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header title="Gestão de Leads" subtitle="Acompanhe e converta seus potenciais clientes" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('kanban')}
              className="bg-lawblue-500 hover:bg-lawblue-600"
            >
              <Kanban size={16} className="mr-1" />
              Kanban
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 size={16} className="mr-1" />
              Grade
            </Button>
          </div>
          
          <Button 
            className="bg-lawblue-500 hover:bg-lawblue-600"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} className="mr-1" /> Novo Lead
          </Button>
        </div>
        
        <LeadFilters />
        
        {viewMode === 'kanban' ? (
          <KanbanBoard 
            leads={leads}
            onLeadStageChange={handleLeadStageChange}
          />
        ) : (
          <LeadGrid leads={leads} />
        )}

        <FormModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Adicionar Novo Lead"
        >
          <LeadForm onSuccess={handleAddSuccess} onCancel={() => setIsAddModalOpen(false)} />
        </FormModal>
      </div>
    </MainLayout>
  );
}
