
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { LeadForm } from '@/components/leads/LeadForm';
import { FormModal } from '@/components/common/FormModal';
import { toast } from 'sonner';
import { LeadGrid } from '@/components/leads/LeadGrid';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { LeadStageTabs, LeadStage } from '@/components/leads/LeadStageTabs';
import { mockLeads } from '@/data/mockLeads';

export default function Leads() {
  const [activeTab, setActiveTab] = useState<LeadStage | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const filteredLeads = activeTab === 'all' 
    ? mockLeads 
    : mockLeads.filter(lead => lead.stage === activeTab);
  
  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    toast.success("Lead adicionado com sucesso!");
  };
  
  return (
    <div>
      <Header title="Gestão de Leads" subtitle="Acompanhe e converta seus potenciais clientes" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <LeadStageTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <Button 
          className="bg-lawblue-500 hover:bg-lawblue-600"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={16} className="mr-1" /> Novo Lead
        </Button>
      </div>
      
      <LeadFilters />
      
      <LeadGrid leads={filteredLeads} />

      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Adicionar Novo Lead"
      >
        <LeadForm onSuccess={handleAddSuccess} onCancel={() => setIsAddModalOpen(false)} />
      </FormModal>
    </div>
  );
}
