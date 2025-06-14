
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreHorizontal, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProcessData } from '@/hooks/useProcesses';

interface ProcessosTableProps {
  data: ProcessData[];
  onViewProcesso: (processo: ProcessData) => void;
  onEditProcesso: (processo: ProcessData) => void;
  onDeleteProcesso: (processo: ProcessData) => void;
  loading?: boolean;
}

export function ProcessosTable({ 
  data, 
  onViewProcesso, 
  onEditProcesso, 
  onDeleteProcesso,
  loading = false 
}: ProcessosTableProps) {
  const getStatusClass = (status?: string) => {
    switch(status) {
      case 'em_andamento': return 'bg-blue-100 text-blue-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'suspenso': return 'bg-yellow-100 text-yellow-800';
      case 'arquivado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch(status) {
      case 'em_andamento': return 'Em andamento';
      case 'concluido': return 'Concluído';
      case 'suspenso': return 'Suspenso';
      case 'arquivado': return 'Arquivado';
      default: return 'Indefinido';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Carregando processos...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum processo encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data Início</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((processo) => (
            <TableRow key={processo.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{processo.process_number}</TableCell>
              <TableCell>{processo.title}</TableCell>
              <TableCell>{processo.client_name || '-'}</TableCell>
              <TableCell>{processo.process_type}</TableCell>
              <TableCell>
                <Badge className={getStatusClass(processo.status)}>
                  {getStatusLabel(processo.status)}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(processo.start_date)}</TableCell>
              <TableCell>{processo.responsible || '-'}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onViewProcesso(processo)}
                      className="cursor-pointer"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onEditProcesso(processo)}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteProcesso(processo)}
                      className="cursor-pointer text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
