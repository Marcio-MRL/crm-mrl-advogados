
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { FinancialSummary } from '@/components/financial/FinancialSummary';
import { FinancialChart } from '@/components/financial/FinancialChart';
import { FinancialTransactionsTable } from '@/components/financial/FinancialTransactionsTable';
import { GoogleSheetsIntegration } from '@/components/integrations/GoogleSheetsIntegration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Financeiro() {
  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header 
          title="Financeiro" 
          subtitle="Gestão financeira do escritório" 
        />
        
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="integrations">Integrações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            {/* Resumo Financeiro */}
            <FinancialSummary />
            
            {/* Gráfico Financeiro */}
            <Card>
              <CardHeader>
                <CardTitle>Evolução Financeira</CardTitle>
              </CardHeader>
              <CardContent>
                <FinancialChart />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-6">
            {/* Tabela de Transações */}
            <Card>
              <CardHeader>
                <CardTitle>Transações Financeiras</CardTitle>
              </CardHeader>
              <CardContent>
                <FinancialTransactionsTable />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-6">
            <GoogleSheetsIntegration />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
