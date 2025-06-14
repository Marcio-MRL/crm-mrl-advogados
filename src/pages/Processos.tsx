
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { ProcessoForm } from '@/components/processos/ProcessoForm';
import { ProcessosTable } from '@/components/processos/ProcessosTable';
import { ProcessosFilters } from '@/components/processos/ProcessosFilters';
import { ProcessosStats } from '@/components/processos/ProcessosStats';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useProcesses, type ProcessData } from '@/hooks/useProcesses';

export default function Processos() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState<ProcessData | null>(null);

  const { processes, loading, error } = useProcesses();

  const [filteredProcesses, setFilteredProcesses] = useState<ProcessData[]>([]);

  const handleCreateProcess = () => {
    setEditingProcess(null);
    setIsFormModalOpen(true);
  };

  const handleEditProcess = (process: ProcessData) => {
    setEditingProcess(process);
    setIsFormModalOpen(true);
  };

  const handleViewProcess = (process: ProcessData) => {
    // TODO: Implementar visualização do processo
    console.log('Visualizar processo:', process);
  };

  const handleDeleteProcess = (process: ProcessData) => {
    // TODO: Implementar exclusão do processo
    console.log('Excluir processo:', process);
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setEditingProcess(null);
  };

  const handleFormCancel = () => {
    setIsFormModalOpen(false);
    setEditingProcess(null);
  };

  const handleFilterChange = (filtered: ProcessData[]) => {
    setFilteredProcesses(filtered);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center text-red-600 p-8">
          Erro ao carregar processos: {error}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header 
          title="Processos Jurídicos" 
          subtitle="Gestão completa de processos e andamentos processuais"
        />

        <ProcessosStats data={processes} />

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <ProcessosFilters
            data={processes}
            onFilterChange={handleFilterChange}
          />
          
          <Button 
            onClick={handleCreateProcess}
            className="bg-lawblue-500 hover:bg-lawblue-600 whitespace-nowrap"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Processo
          </Button>
        </div>

        <ProcessosTable 
          data={filteredProcesses.length > 0 ? filteredProcesses : processes}
          onViewProcesso={handleViewProcess}
          onEditProcesso={handleEditProcess}
          onDeleteProcesso={handleDeleteProcess}
          loading={loading}
        />

        <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProcess ? 'Editar Processo' : 'Novo Processo'}
              </DialogTitle>
            </DialogHeader>
            <ProcessoForm
              initialData={editingProcess}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
