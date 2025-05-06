
import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from 'lucide-react';

const mockProcessos = [
  { id: '1', numero: 'PROC-001/2025', cliente: 'Empresa ABC Ltda.', tipo: 'Administrativo', status: 'Em andamento', dataInicio: '2025-01-15', responsavel: 'Dra. Ana Silva' },
  { id: '2', numero: 'PROC-002/2025', cliente: 'João da Silva', tipo: 'Judicial', status: 'Aguardando manifestação', dataInicio: '2025-02-03', responsavel: 'Dr. Carlos Mendes' },
  { id: '3', numero: 'PROC-003/2025', cliente: 'Construtora XYZ S/A', tipo: 'Trabalhista', status: 'Concluído', dataInicio: '2024-11-28', responsavel: 'Dra. Maria Oliveira' },
  { id: '4', numero: 'PROC-004/2025', cliente: 'Distribuidora Bons Negócios', tipo: 'Tributário', status: 'Em andamento', dataInicio: '2025-02-17', responsavel: 'Dr. Paulo Santos' },
  { id: '5', numero: 'PROC-005/2025', cliente: 'Ricardo Almeida', tipo: 'Judicial', status: 'Prazo em curso', dataInicio: '2025-03-01', responsavel: 'Dra. Ana Silva' },
];

export default function Processos() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProcessos, setFilteredProcessos] = useState(mockProcessos);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = mockProcessos.filter(
      (processo) =>
        processo.numero.toLowerCase().includes(query) ||
        processo.cliente.toLowerCase().includes(query) ||
        processo.tipo.toLowerCase().includes(query) ||
        processo.status.toLowerCase().includes(query) ||
        processo.responsavel.toLowerCase().includes(query)
    );
    
    setFilteredProcessos(filtered);
  };

  return (
    <div className="w-full space-y-6">
      <Header title="Processos" subtitle="Gestão de processos jurídicos" />
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar processos..."
            className="pl-8 w-full md:w-[300px] bg-white/70 border-lawblue-200"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="h-4 w-4" /> Filtros
          </Button>
          <Button className="flex items-center gap-1 bg-lawblue-500 hover:bg-lawblue-600">
            <Plus className="h-4 w-4" /> Novo Processo
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="em_andamento">Em Andamento</TabsTrigger>
            <TabsTrigger value="aguardando">Aguardando</TabsTrigger>
            <TabsTrigger value="concluidos">Concluídos</TabsTrigger>
          </TabsList>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden md:table-cell">Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Data Início</TableHead>
                <TableHead className="hidden md:table-cell">Responsável</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProcessos.map((processo) => (
                <TableRow key={processo.id}>
                  <TableCell className="font-medium">{processo.numero}</TableCell>
                  <TableCell>{processo.cliente}</TableCell>
                  <TableCell className="hidden md:table-cell">{processo.tipo}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      processo.status === 'Em andamento' 
                        ? 'bg-blue-100 text-blue-800'
                        : processo.status === 'Concluído'
                        ? 'bg-green-100 text-green-800'
                        : processo.status === 'Aguardando manifestação'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {processo.status}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(processo.dataInicio).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="hidden md:table-cell">{processo.responsavel}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Visualizar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Tabs>
      </div>
    </div>
  );
}
