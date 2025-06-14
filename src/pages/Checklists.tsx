
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { ChecklistSearchFilters } from '@/components/checklists/ChecklistSearchFilters';
import { ChecklistGrid } from '@/components/checklists/ChecklistGrid';
import { ChecklistModals } from '@/components/checklists/ChecklistModals';
import { ChecklistLoading } from '@/components/checklists/ChecklistLoading';
import { supabase, getCurrentUserId } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface Checklist {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  progress: number;
  items: ChecklistItem[];
  assignedTo?: string;
  client?: string;
  processId?: string;
}

export default function Checklists() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  useEffect(() => {
    fetchChecklists();
  }, []);

  const fetchChecklists = async () => {
    try {
      const userId = await getCurrentUserId();
      if (!userId) {
        toast.error('Você precisa estar logado para ver os checklists');
        return;
      }

      const { data: checklistsData, error } = await supabase
        .from('checklists')
        .select(`
          id,
          title,
          description,
          due_date,
          progress,
          assigned_to,
          client_id,
          process_id,
          checklist_items (
            id,
            text,
            checked
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching checklists:', error);
        toast.error('Erro ao carregar checklists');
        return;
      }

      // Buscar nomes dos clientes
      const clientIds = checklistsData
        .filter(checklist => checklist.client_id)
        .map(checklist => checklist.client_id);

      let clientsData = [];
      if (clientIds.length > 0) {
        const { data: clients, error: clientsError } = await supabase
          .from('clients')
          .select('id, name')
          .in('id', clientIds);

        if (!clientsError) {
          clientsData = clients || [];
        }
      }

      // Buscar títulos dos processos
      const processIds = checklistsData
        .filter(checklist => checklist.process_id)
        .map(checklist => checklist.process_id);

      let processesData = [];
      if (processIds.length > 0) {
        const { data: processes, error: processesError } = await supabase
          .from('processes')
          .select('id, title')
          .in('id', processIds);

        if (!processesError) {
          processesData = processes || [];
        }
      }

      const formattedChecklists: Checklist[] = checklistsData.map(checklist => {
        const client = clientsData.find(c => c.id === checklist.client_id);
        const process = processesData.find(p => p.id === checklist.process_id);

        return {
          id: checklist.id,
          title: checklist.title,
          description: checklist.description || '',
          dueDate: checklist.due_date || undefined,
          progress: checklist.progress || 0,
          assignedTo: checklist.assigned_to || undefined,
          client: client?.name || undefined,
          processId: process?.title || undefined,
          items: checklist.checklist_items.map(item => ({
            id: item.id,
            text: item.text,
            checked: item.checked
          }))
        };
      });

      setChecklists(formattedChecklists);
    } catch (error) {
      console.error('Error in fetchChecklists:', error);
      toast.error('Erro ao carregar checklists');
    } finally {
      setLoading(false);
    }
  };

  const filteredChecklists = checklists.filter(checklist =>
    checklist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    checklist.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (checklist.assignedTo && checklist.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (checklist.client && checklist.client.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleChecklistAdded = () => {
    setIsModalOpen(false);
    fetchChecklists();
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="w-full space-y-6">
          <Header title="Checklists" subtitle="Gerenciamento de checklists e procedimentos" />
          <ChecklistLoading />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header title="Checklists" subtitle="Gerenciamento de checklists e procedimentos" />
        
        <ChecklistSearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          openFilterModal={() => setIsFilterModalOpen(true)}
          openModal={() => setIsModalOpen(true)}
        />

        <ChecklistGrid 
          filteredChecklists={filteredChecklists}
          searchQuery={searchQuery}
        />

        <ChecklistModals
          isModalOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
          isFilterModalOpen={isFilterModalOpen}
          closeFilterModal={() => setIsFilterModalOpen(false)}
          isTemplateModalOpen={isTemplateModalOpen}
          closeTemplateModal={() => setIsTemplateModalOpen(false)}
          handleChecklistAdded={handleChecklistAdded}
        />
      </div>
    </MainLayout>
  );
}
