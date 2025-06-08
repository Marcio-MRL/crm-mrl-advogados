
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { FinancialSummary } from '@/components/financial/FinancialSummary';
import { FinancialChart } from '@/components/financial/FinancialChart';
import { FinancialTransactionsTable } from '@/components/financial/FinancialTransactionsTable';
import { GoogleIntegrations } from '@/components/integrations/GoogleIntegrations';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Financeiro() {
  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header 
          title="Financeiro" 
          subtitle="Gestão financeira e fluxo de caixa do escritório" 
        />
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Cards de Resumo Financeiro */}
            <div className="grid gap-4 md:grid-cols-3">
              <FinancialSummary />
            </div>
            
            {/* Gráfico de Fluxo de Caixa */}
            <Card>
              <CardHeader>
                <CardTitle>Fluxo de Caixa</CardTitle>
              </CardHeader>
              <CardContent>
                <FinancialChart />
              </CardContent>
            </Card>
            
            {/* Últimas Transações (resumo) */}
            <Card>
              <CardHeader>
                <CardTitle>Últimas Transações</CardTitle>
              </CardHeader>
              <CardContent>
                <FinancialTransactionsTable />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Todas as Transações</CardTitle>
              </CardHeader>
              <CardContent>
                <FinancialTransactionsTable />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Integração com Google Sheets</CardTitle>
                <p className="text-sm text-gray-600">
                  Conecte sua planilha do banco para sincronização automática de transações
                </p>
              </CardHeader>
              <CardContent>
                <GoogleIntegrations hideGoogleSheets={false} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
