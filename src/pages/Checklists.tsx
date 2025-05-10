
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { ChecklistTemplateList } from '@/components/checklists/ChecklistTemplateList';
import { ChecklistGrid } from '@/components/checklists/ChecklistGrid';
import { ChecklistSearchFilters } from '@/components/checklists/ChecklistSearchFilters';
import { ChecklistModals } from '@/components/checklists/ChecklistModals';
import { ChecklistLoading } from '@/components/checklists/ChecklistLoading';
import { supabase } from '@/integrations/supabase/client';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);

  const openTemplateModal = () => setIsTemplateModalOpen(true);
  const closeTemplateModal = () => setIsTemplateModalOpen(false);

  const fetchChecklists = async () => {
    setLoading(true);
    try {
      // Get all checklists
      const { data: checklistsData, error: checklistsError } = await supabase
        .from('checklists')
        .select(`
          id, 
          title, 
          description, 
          due_date, 
          progress, 
          assigned_to,
          client_id, 
          clients (name),
          process_id
        `)
        .order('created_at', { ascending: false });
      
      if (checklistsError) {
        throw checklistsError;
      }

      // Get all checklist items
      const { data: itemsData, error: itemsError } = await supabase
        .from('checklist_items')
        .select('id, checklist_id, text, checked');
      
      if (itemsError) {
        throw itemsError;
      }

      // Map checklists with their items
      const mappedChecklists = checklistsData?.map(checklist => {
        const checklistItems = itemsData
          ?.filter(item => item.checklist_id === checklist.id)
          ?.map(item => ({
            id: item.id,
            text: item.text,
            checked: item.checked
          })) || [];
        
        return {
          id: checklist.id,
          title: checklist.title,
          description: checklist.description || '',
          dueDate: checklist.due_date,
          progress: checklist.progress || 0,
          items: checklistItems,
          assignedTo: checklist.assigned_to,
          client: checklist.clients?.name,
          processId: checklist.process_id
        };
      }) || [];

      setChecklists(mappedChecklists);
    } catch (error) {
      console.error('Error fetching checklists:', error);
      toast.error('Erro ao carregar checklists');
      // Se não conseguir buscar dados reais, use dados simulados
      const mockChecklists = [
        {
          id: '1',
          title: 'Preparação para Audiência',
          description: 'Tarefas necessárias antes da audiência trabalhista',
          dueDate: '2025-05-20',
          progress: 60,
          items: [
            { id: '1', text: 'Revisar documentos', checked: true },
            { id: '2', text: 'Preparar testemunhas', checked: true },
            { id: '3', text: 'Estudar jurisprudência', checked: false },
            { id: '4', text: 'Reunião com cliente', checked: false },
          ],
          assignedTo: 'Dra. Maria Oliveira',
          client: 'João da Silva',
        },
        {
          id: '2',
          title: 'Due Diligence - Aquisição Empresa XYZ',
          description: 'Análise de documentos para aquisição',
          dueDate: '2025-06-15',
          progress: 30,
          items: [
            { id: '1', text: 'Verificar débitos fiscais', checked: true },
            { id: '2', text: 'Analisar contratos vigentes', checked: false },
            { id: '3', text: 'Verificar processos judiciais', checked: false },
            { id: '4', text: 'Avaliar passivo trabalhista', checked: false },
            { id: '5', text: 'Relatório de compliance', checked: false },
          ],
          assignedTo: 'Dr. Carlos Mendes',
          client: 'Empresa ABC Ltda.',
        }
      ];
      setChecklists(mockChecklists);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyTemplate = (templateId: string) => {
    toast.info(`Modelo de checklist será aplicado em breve. ID: ${templateId}`);
  };

  const handleManageTemplates = () => {
    openTemplateModal();
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  const handleChecklistAdded = () => {
    closeModal();
    fetchChecklists();
  };

  const filteredChecklists = searchQuery.trim() !== '' 
    ? checklists.filter(checklist => 
        checklist.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        checklist.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (checklist.client && checklist.client.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : checklists;

  return (
    <div className="w-full space-y-6">
      <Header title="Checklists" subtitle="Gerenciamento de checklists e procedimentos" />
      
      <ChecklistSearchFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        openFilterModal={openFilterModal}
        openModal={openModal}
      />
      
      {loading ? (
        <ChecklistLoading />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ChecklistTemplateList 
              onApplyTemplate={handleApplyTemplate}
              onManageTemplates={handleManageTemplates}
            />
          </div>
          
          <div className="lg:col-span-3">
            <ChecklistGrid 
              filteredChecklists={filteredChecklists}
              searchQuery={searchQuery} 
            />
          </div>
        </div>
      )}

      <ChecklistModals
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        isFilterModalOpen={isFilterModalOpen}
        closeFilterModal={closeFilterModal}
        isTemplateModalOpen={isTemplateModalOpen}
        closeTemplateModal={closeTemplateModal}
        handleChecklistAdded={handleChecklistAdded}
      />
    </div>
  );
}
