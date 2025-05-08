
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChecklistCard } from '@/components/checklists/ChecklistCard';
import { ChecklistTemplateList } from '@/components/checklists/ChecklistTemplateList';
import { FormModal } from '@/components/common/FormModal';
import { ChecklistForm } from '@/components/checklists/ChecklistForm';
import { Search, Plus, Filter } from 'lucide-react';
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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
      const mappedChecklists = checklistsData.map(checklist => {
        const checklistItems = itemsData
          .filter(item => item.checklist_id === checklist.id)
          .map(item => ({
            id: item.id,
            text: item.text,
            checked: item.checked
          }));
        
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
      });

      setChecklists(mappedChecklists);
    } catch (error) {
      console.error('Error fetching checklists:', error);
      toast.error('Erro ao carregar checklists');
    } finally {
      setLoading(false);
    }
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
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar checklists..."
            className="pl-8 w-full md:w-[300px] bg-white/70 border-lawblue-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="h-4 w-4" /> Filtros
          </Button>
          <Button 
            className="flex items-center gap-1 bg-lawblue-500 hover:bg-lawblue-600"
            onClick={openModal}
          >
            <Plus className="h-4 w-4" /> Novo Checklist
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando checklists...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ChecklistTemplateList />
          </div>
          
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChecklists.map(checklist => (
                <ChecklistCard key={checklist.id} checklist={checklist} />
              ))}
              
              {filteredChecklists.length === 0 && (
                <div className="col-span-2 flex flex-col items-center justify-center p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <span className="text-4xl">📋</span>
                  </div>
                  <h3 className="text-lg font-medium">Nenhum checklist encontrado</h3>
                  <p className="text-gray-500 mt-2">
                    Não foram encontrados checklists para sua pesquisa {searchQuery ? `"${searchQuery}"` : ""}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Adicionar Novo Checklist"
      >
        <ChecklistForm onSuccess={handleChecklistAdded} onCancel={closeModal} />
      </FormModal>
    </div>
  );
}
