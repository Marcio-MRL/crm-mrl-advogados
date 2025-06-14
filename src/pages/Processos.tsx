
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { ProcessosTable } from '@/components/processos/ProcessosTable';
import { ProcessoForm } from '@/components/processos/ProcessoForm';
import { ProcessoViewModal } from '@/components/modals/ProcessoViewModal';
import { ProcessosFilters } from '@/components/processos/ProcessosFilters';
import { ProcessosStats } from '@/components/processos/ProcessosStats';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from 'lucide-react';
import { useProcesses, type ProcessData } from '@/hooks/useProcesses';
import { toast } from 'sonner';

export default function Processos() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProcesso, setSelectedProcesso] = useState<ProcessData | null>(null);
  const [filteredData, setFilteredData] = useState<ProcessData[]>([]);
  
  const { processes, loading, deleteProcess } = useProcesses();
  
  const handleViewProcesso = (processo: ProcessData) => {
    setSelectedProcesso(processo);
    setIsViewModalOpen(true);
  };

  const handleEditProcesso = (processo: ProcessData) => {
    setSelectedProcesso(processo);
    setIsEditModalOpen(true);
  };

  const handleDeleteProcesso = async (processo: ProcessData) => {
    if (window.confirm('Tem certeza que deseja excluir este processo?')) {
      try {
        if (processo.id) {
          await deleteProcess(processo.id);
        }
      } catch (error) {
        console.error('Erro ao excluir processo:', error);
      }
    }
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    toast.success('Processo criado com sucesso!');
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedProcesso(null);
    toast.success('Processo atualizado com sucesso!');
  };

  // Use os dados filtrados se existirem, caso contrário use todos os processos
  const displayData = filteredData.length > 0 ? filteredData : processes;

  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header 
          title="Processos" 
          subtitle="Gestão de processos jurídicos do escritório" 
        />
        
        {/* Cards de Estatísticas */}
        <ProcessosStats data={processes} />
        
        {/* Filtros e Botão de Adicionar */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 w-full">
            <ProcessosFilters 
              data={processes} 
              onFilterChange={setFilteredData} 
            />
          </div>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-lawblue-500 hover:bg-lawblue-600 shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Processo
          </Button>
        </div>
        
        {/* Tabela de Processos */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Processos</CardTitle>
          </CardHeader>
          <CardContent>
            <ProcessosTable 
              data={displayData}
              loading={loading}
              onViewProcesso={handleViewProcesso}
              onEditProcesso={handleEditProcesso}
              onDeleteProcesso={handleDeleteProcesso}
            />
          </CardContent>
        </Card>
        
        {/* Modal de Criação */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Processo</DialogTitle>
            </DialogHeader>
            <ProcessoForm 
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
        
        {/* Modal de Edição */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Processo</DialogTitle>
            </DialogHeader>
            <ProcessoForm 
              initialData={selectedProcesso}
              onSuccess={handleEditSuccess}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedProcesso(null);
              }}
            />
          </DialogContent>
        </Dialog>
        
        {/* Modal de Visualização */}
        <ProcessoViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          processo={selectedProcesso}
        />
      </div>
    </MainLayout>
  );
}
