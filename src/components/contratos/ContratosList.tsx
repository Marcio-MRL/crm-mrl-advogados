
import React, { useState, useEffect } from 'react';
import { ContratoSearch } from './ContratoSearch';
import { ContratoTable } from './ContratoTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { FormModal } from '@/components/common/FormModal';
import { ContratoForm } from './ContratoForm';
import { supabase, getCurrentUserId } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ContratoViewModal } from './ContratoViewModal';
import { ContratoEditModal } from './ContratoEditModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export function ContratosList() {
  const [contratos, setContratos] = useState<any[]>([]);
  const [filteredContratos, setFilteredContratos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewContrato, setViewContrato] = useState<string | null>(null);
  const [editContrato, setEditContrato] = useState<string | null>(null);
  const [deleteContrato, setDeleteContrato] = useState<string | null>(null);

  const fetchContratos = async () => {
    setLoading(true);
    try {
      const userId = await getCurrentUserId();
      
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to ensure values are displayed correctly
      const transformedData = data.map(contract => ({
        ...contract,
        // Ensure value is a number
        value: contract.value ? Number(contract.value) : null
      }));
      
      setContratos(transformedData);
      setFilteredContratos(transformedData);
    } catch (error) {
      console.error('Error fetching contratos:', error);
      toast.error('Erro ao carregar contratos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContratos();
  }, []);

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    fetchContratos();
    toast.success('Contrato adicionado com sucesso!');
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredContratos(contratos);
      return;
    }
    
    const filtered = contratos.filter(contrato => 
      contrato.number?.toLowerCase().includes(query.toLowerCase()) ||
      contrato.type?.toLowerCase().includes(query.toLowerCase()) ||
      contrato.status?.toLowerCase().includes(query.toLowerCase()) ||
      (contrato.description && contrato.description.toLowerCase().includes(query.toLowerCase()))
    );
    
    setFilteredContratos(filtered);
  };

  const handleViewContrato = (id: string) => {
    setViewContrato(id);
  };

  const handleEditContrato = (id: string) => {
    setViewContrato(null);
    setEditContrato(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteContrato) return;
    
    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', deleteContrato);
      
      if (error) throw error;
      
      toast.success('Contrato excluído com sucesso!');
      fetchContratos();
    } catch (error) {
      console.error('Error deleting contrato:', error);
      toast.error('Erro ao excluir contrato');
    } finally {
      setDeleteContrato(null);
      setViewContrato(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
        <ContratoSearch onSearch={handleSearch} />
        
        <Button 
          onClick={() => setIsAddModalOpen(true)} 
          className="bg-lawblue-500 hover:bg-lawblue-600"
        >
          <Plus size={16} className="mr-2" />
          Novo Contrato
        </Button>
      </div>
      
      <ContratoTable 
        contratos={filteredContratos} 
        loading={loading}
        onViewContrato={handleViewContrato}
      />
      
      <FormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Adicionar Novo Contrato"
      >
        <ContratoForm 
          onSuccess={handleAddSuccess} 
          onCancel={() => setIsAddModalOpen(false)} 
        />
      </FormModal>
      
      {/* View Modal */}
      <ContratoViewModal 
        isOpen={!!viewContrato}
        onClose={() => setViewContrato(null)}
        contratoId={viewContrato}
        onEdit={handleEditContrato}
        onDelete={setDeleteContrato}
      />
      
      {/* Edit Modal */}
      <ContratoEditModal 
        isOpen={!!editContrato}
        onClose={() => setEditContrato(null)}
        contratoId={editContrato}
        onSuccess={() => {
          fetchContratos();
          toast.success('Contrato atualizado com sucesso!');
        }}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteContrato} onOpenChange={() => setDeleteContrato(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este contrato? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleConfirmDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
