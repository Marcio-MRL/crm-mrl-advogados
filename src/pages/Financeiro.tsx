
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FinancialSummary } from '@/components/financial/FinancialSummary';
import { FinancialTransactionsTable } from '@/components/financial/FinancialTransactionsTable';
import { FinancialChart } from '@/components/financial/FinancialChart';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Download, Upload } from 'lucide-react';
import { GoogleIntegrations } from '@/components/integrations/GoogleIntegrations';
import { toast } from 'sonner';

export default function Financeiro() {
  const handleExportToSheets = () => {
    toast.info("Funcionalidade de exportação para Google Sheets será implementada em breve.");
  };

  const handleImportFromSheets = () => {
    toast.info("Funcionalidade de importação do Google Sheets será implementada em breve.");
  };

  return (
    <div className="w-full space-y-6">
      <Header 
        title="Financeiro" 
        subtitle="Gestão financeira e fluxo de caixa do escritório" 
      />
      
      <div className="glass-card rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Integração Google Sheets</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleExportToSheets}
            >
              <Download className="h-4 w-4" /> Exportar para Sheets
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleImportFromSheets}
            >
              <Upload className="h-4 w-4" /> Importar de Sheets
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <GoogleIntegrations />
        </div>
      </div>

      <FinancialSummary />
      
      <Tabs defaultValue="table">
        <TabsList className="mb-4">
          <TabsTrigger value="table">Transações</TabsTrigger>
          <TabsTrigger value="chart">Gráficos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="bg-white/70 rounded-lg shadow-sm">
          <FinancialTransactionsTable />
        </TabsContent>
        
        <TabsContent value="chart" className="bg-white/70 p-6 rounded-lg shadow-sm">
          <FinancialChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}
