
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsList } from '@/components/reports/ReportsList';
import { ReportCharts } from '@/components/reports/ReportCharts';
import { Plus, Download, TrendingUp, Users, FileText, DollarSign } from 'lucide-react';
import { FormModal } from '@/components/common/FormModal';
import { ReportGeneratorForm } from '@/components/reports/ReportGeneratorForm';

export default function Relatorios() {
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);

  const stats = [
    {
      title: "Total de Relatórios",
      value: "23",
      icon: FileText,
      change: "+12%",
      changeType: "positive" as const
    },
    {
      title: "Relatórios Este Mês",
      value: "8",
      icon: TrendingUp,
      change: "+3",
      changeType: "positive" as const
    },
    {
      title: "Clientes Analisados",
      value: "45",
      icon: Users,
      change: "+5%",
      changeType: "positive" as const
    },
    {
      title: "Receita Analisada",
      value: "R$ 125.000",
      icon: DollarSign,
      change: "+8%",
      changeType: "positive" as const
    }
  ];

  const handleReportGenerated = () => {
    setIsGeneratorModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <div className="flex justify-between items-center">
          <Header title="Relatórios" subtitle="Análises e relatórios do escritório" />
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar Todos
            </Button>
            <Button 
              onClick={() => setIsGeneratorModalOpen(true)}
              className="bg-lawblue-500 hover:bg-lawblue-600 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Gerar Relatório
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Lista de Relatórios</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <ReportsList />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <ReportCharts />
          </TabsContent>
        </Tabs>

        <FormModal
          isOpen={isGeneratorModalOpen}
          onClose={() => setIsGeneratorModalOpen(false)}
          title="Gerar Novo Relatório"
        >
          <ReportGeneratorForm 
            onSuccess={handleReportGenerated}
            onCancel={() => setIsGeneratorModalOpen(false)} 
          />
        </FormModal>
      </div>
    </MainLayout>
  );
}
