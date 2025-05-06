
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

const mockContratos = [
  { id: '1', numero: 'CT-001/2025', cliente: 'Empresa ABC Ltda.', tipo: 'Prestação de Serviços', status: 'Ativo', dataInicio: '2025-01-15', dataVencimento: '2026-01-15', valor: 5000 },
  { id: '2', numero: 'CT-002/2025', cliente: 'João da Silva', tipo: 'Assessoria Jurídica', status: 'Ativo', dataInicio: '2025-02-03', dataVencimento: '2025-08-03', valor: 1200 },
  { id: '3', numero: 'CT-003/2025', cliente: 'Construtora XYZ S/A', tipo: 'Contencioso', status: 'Em elaboração', dataInicio: '2024-11-28', dataVencimento: '2025-11-28', valor: 8500 },
  { id: '4', numero: 'CT-004/2025', cliente: 'Distribuidora Bons Negócios', tipo: 'Consultoria', status: 'Ativo', dataInicio: '2025-02-17', dataVencimento: '2026-02-17', valor: 3200 },
  { id: '5', numero: 'CT-005/2025', cliente: 'Ricardo Almeida', tipo: 'Representação', status: 'Vencido', dataInicio: '2024-03-01', dataVencimento: '2025-03-01', valor: 2300 },
];

export default function Contratos() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContratos, setFilteredContratos] = useState(mockContratos);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = mockContratos.filter(
      (contrato) =>
        contrato.numero.toLowerCase().includes(query) ||
        contrato.cliente.toLowerCase().includes(query) ||
        contrato.tipo.toLowerCase().includes(query) ||
        contrato.status.toLowerCase().includes(query)
    );
    
    setFilteredContratos(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Ativo':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'Vencido':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <div className="w-full space-y-6">
      <Header title="Contratos" subtitle="Gestão de contratos e documentos jurídicos" />
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar contratos..."
            className="pl-8 w-full md:w-[300px] bg-white/70 border-lawblue-200"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <Button className="flex items-center gap-1 bg-lawblue-500 hover:bg-lawblue-600">
          <Plus className="h-4 w-4" /> Novo Contrato
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Contratos em Vigor</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden md:table-cell">Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Vencimento</TableHead>
                <TableHead className="hidden md:table-cell">Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContratos.map((contrato) => (
                <TableRow key={contrato.id}>
                  <TableCell className="font-medium">{contrato.numero}</TableCell>
                  <TableCell>{contrato.cliente}</TableCell>
                  <TableCell className="hidden md:table-cell">{contrato.tipo}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(contrato.status)}
                      <span>{contrato.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(contrato.dataVencimento).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatCurrency(contrato.valor)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">Visualizar</Button>
                      <Button variant="ghost" size="sm">Editar</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
