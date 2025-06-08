
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProcessosTableProps {
  data: any[];
  onViewProcesso: (processo: any) => void;
}

export function ProcessosTable({ data, onViewProcesso }: ProcessosTableProps) {
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Em andamento': return 'bg-blue-100 text-blue-800';
      case 'Concluído': return 'bg-green-100 text-green-800';
      case 'Aguardando manifestação': return 'bg-yellow-100 text-yellow-800';
      case 'Prazo em curso': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

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
            <TableRow key={processo.numero} className="hover:bg-gray-50">
              <TableCell className="font-medium">{processo.numero}</TableCell>
              <TableCell>{processo.cliente}</TableCell>
              <TableCell>{processo.tipo}</TableCell>
              <TableCell>
                <Badge className={getStatusClass(processo.status)}>
                  {processo.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(processo.dataInicio)}</TableCell>
              <TableCell>{processo.responsavel}</TableCell>
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
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
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
