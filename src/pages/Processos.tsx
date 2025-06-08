
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
import type { Processo } from '@/data/mockProcessos';

export default function Processos() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProcesso, setSelectedProcesso] = useState<Processo | null>(null);
  const [filteredData, setFilteredData] = useState<Processo[]>([]);
  
  const handleViewProcesso = (processo: Processo) => {
    setSelectedProcesso(processo);
    setIsViewModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    // Aqui seria onde atualizaríamos a lista de processos
  };

  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header 
          title="Processos" 
          subtitle="Gestão de processos jurídicos do escritório" 
        />
        
        {/* Cards de Estatísticas */}
        <ProcessosStats />
        
        {/* Filtros e Botão de Adicionar */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 w-full">
            <ProcessosFilters onFilterChange={setFilteredData} />
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
              data={filteredData}
              onViewProcesso={handleViewProcesso}
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
