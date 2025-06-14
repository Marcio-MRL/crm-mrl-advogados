
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const { data: processes, loading, error } = useProcesses();

  const filteredProcesses = processes.filter(process => {
    const matchesSearch = searchQuery === '' || 
      process.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      process.process_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      process.client_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === '' || process.status === statusFilter;
    const matchesType = typeFilter === '' || process.process_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreateProcess = () => {
    setEditingProcess(null);
    setIsFormModalOpen(true);
  };

  const handleEditProcess = (process: ProcessData) => {
    setEditingProcess(process);
    setIsFormModalOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setEditingProcess(null);
  };

  const handleFormCancel = () => {
    setIsFormModalOpen(false);
    setEditingProcess(null);
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
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
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
          processes={filteredProcesses}
          onEdit={handleEditProcess}
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
