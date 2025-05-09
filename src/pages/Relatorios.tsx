
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ReportClientDistribution,
  ReportFinancialOverview,
  ReportProcessStatus,
  ReportTimeTracking
} from '@/components/reports/ReportCharts';
import { ReportsList } from '@/components/reports/ReportsList';
import { 
  FileSpreadsheet, 
  Download, 
  Calendar as CalendarIcon,
  Filter 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function Relatorios() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleExport = () => {
    toast.info("Funcionalidade de exportação será implementada em breve.");
  };

  const handleDownloadPDF = () => {
    toast.info("Funcionalidade de download de PDF será implementada em breve.");
  };

  return (
    <div className="w-full space-y-6">
      <Header title="Relatórios" subtitle="Análise de dados e geração de relatórios" />
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Período:</span>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mês</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
              <SelectItem value="year">Último ano</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <Filter className="h-4 w-4" /> Filtros
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={handleExport}
          >
            <FileSpreadsheet className="h-4 w-4" /> Exportar
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={handleDownloadPDF}
          >
            <Download className="h-4 w-4" /> Baixar PDF
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Status de Processos</CardTitle>
            <CardDescription>Distribuição por status atual</CardDescription>
          </CardHeader>
          <CardContent>
            <ReportProcessStatus />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Clientes</CardTitle>
            <CardDescription>Por tipo e setor</CardDescription>
          </CardHeader>
          <CardContent>
            <ReportClientDistribution />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Acompanhamento Financeiro</CardTitle>
            <CardDescription>Receitas vs. Despesas</CardDescription>
          </CardHeader>
          <CardContent>
            <ReportFinancialOverview />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horas Trabalhadas</CardTitle>
            <CardDescription>Por profissional e área</CardDescription>
          </CardHeader>
          <CardContent>
            <ReportTimeTracking />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Salvos</CardTitle>
          <CardDescription>Relatórios gerados anteriormente</CardDescription>
        </CardHeader>
        <CardContent>
          <ReportsList />
        </CardContent>
      </Card>

      {/* Modal de Filtros */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtros Avançados</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Funcionalidade de filtros avançados será implementada em breve.
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setIsFilterModalOpen(false)}>Fechar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
