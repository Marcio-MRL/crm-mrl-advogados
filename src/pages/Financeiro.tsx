
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FinancialTransactionsTable } from '@/components/financial/FinancialTransactionsTable';
import { FinancialSummary } from '@/components/financial/FinancialSummary';
import { FinancialChart } from '@/components/financial/FinancialChart';
import { Search, Plus, Download, Upload, FileSpreadsheet } from 'lucide-react';

export default function Financeiro() {
  return (
    <div className="w-full space-y-6">
      <Header title="Financeiro" subtitle="Gestão financeira do escritório" />
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <Button className="flex items-center gap-1">
            <Upload className="h-4 w-4" /> Importar Extrato
          </Button>
          <Button variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4" /> Exportar Relatório
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-500">
            Conectado à: mraposo@mrladvogados.com.br
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FinancialSummary />
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Fluxo de Caixa</CardTitle>
            <CardDescription>Movimentação financeira nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialChart />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Movimentações Recentes</CardTitle>
          <CardDescription>Transações importadas da conta principal</CardDescription>
        </CardHeader>
        <CardContent>
          <FinancialTransactionsTable />
        </CardContent>
      </Card>
    </div>
  );
}
