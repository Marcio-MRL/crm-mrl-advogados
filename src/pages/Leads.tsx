
import React, { useState, useEffect } from 'react';
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
import { Lead } from '@/types/lead';
import { supabase, getCurrentUserId } from '@/integrations/supabase/client';

export default function Leads() {
  const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('kanban');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  
  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    toast.success("Lead adicionado com sucesso!");
    fetchLeads(); // Recarregar leads após adicionar
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const userId = await getCurrentUserId();
      
      if (!userId) {
        toast.error('Você precisa estar logado para ver os leads');
        return;
      }

      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', userId)
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        toast.error('Erro ao carregar leads: ' + error.message);
        return;
      }

      // Converter dados do Supabase para o formato esperado pelos componentes
      const formattedLeads: Lead[] = data.map(lead => ({
        id: lead.lead_id.toString(),
        name: lead.nome_lead,
        email: lead.email || '',
        phone: lead.telefone || '',
        document: '', // Não temos esse campo na tabela atual
        source: lead.origem_lead || 'Não informado',
        stage: mapStatusToStage(lead.status_lead),
        lastContact: new Date(lead.data_ultima_interacao || lead.data_criacao).toLocaleDateString('pt-BR'),
        responsibleLawyer: 'Dr. Responsável', // Campo fixo por enquanto
        daysSinceLastContact: calculateDaysSinceLastContact(lead.data_ultima_interacao || lead.data_criacao),
      }));

      setLeads(formattedLeads);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      toast.error('Ocorreu um erro ao carregar os leads');
    } finally {
      setLoading(false);
    }
  };

  const mapStatusToStage = (status: string): Lead['stage'] => {
    const statusMap: Record<string, Lead['stage']> = {
      'Novo': 'new',
      'Qualificado': 'qualified',
      'Reunião': 'meeting',
      'Proposta': 'proposal',
      'Contratado': 'hired'
    };
    return statusMap[status] || 'new';
  };

  const mapStageToStatus = (stage: Lead['stage']): string => {
    const stageMap: Record<Lead['stage'], string> = {
      'new': 'Novo',
      'qualified': 'Qualificado',
      'meeting': 'Reunião',
      'proposal': 'Proposta',
      'hired': 'Contratado'
    };
    return stageMap[stage];
  };

  const calculateDaysSinceLastContact = (lastContactDate: string): number => {
    const lastContact = new Date(lastContactDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastContact.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleLeadStageChange = async (leadId: string, newStage: Lead['stage']) => {
    try {
      const userId = await getCurrentUserId();
      
      if (!userId) {
        toast.error('Você precisa estar logado para atualizar leads');
        return;
      }

      const newStatus = mapStageToStatus(newStage);
      
      const { error } = await supabase
        .from('leads')
        .update({ 
          status_lead: newStatus,
          data_ultima_interacao: new Date().toISOString()
        })
        .eq('lead_id', parseInt(leadId))
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating lead:', error);
        toast.error('Erro ao atualizar lead: ' + error.message);
        return;
      }

      // Atualizar estado local
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId 
            ? { 
                ...lead, 
                stage: newStage, 
                lastContact: new Date().toLocaleDateString('pt-BR'),
                daysSinceLastContact: 0
              }
            : lead
        )
      );
      
      toast.success("Status do lead atualizado!");
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      toast.error('Ocorreu um erro ao atualizar o lead');
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="w-full space-y-6">
          <Header title="Gestão de Leads" subtitle="Acompanhe e converta seus potenciais clientes" />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lawblue-500"></div>
            <span className="ml-2">Carregando leads...</span>
          </div>
        </div>
      </MainLayout>
    );
  }
  
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
