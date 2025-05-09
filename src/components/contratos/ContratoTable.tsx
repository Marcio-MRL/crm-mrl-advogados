
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/integrations/supabase/client';

export interface Contrato {
  id: string;
  numero: string;
  number: string;
  client_id: string;
  cliente: string;
  tipo: string;
  type: string;
  status: string;
  dataInicio: string;
  start_date: string;
  dataVencimento: string;
  end_date: string;
  valor: number;
  value: number;
  cliente_nome?: string;
}

interface ContratoTableProps {
  contratos: Contrato[];
  loading: boolean;
}

export const ContratoTable: React.FC<ContratoTableProps> = ({ contratos, loading }) => {
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
    if (value === null || value === undefined) return '-';
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Carregando contratos...</p>
      </div>
    );
  }

  return (
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
        {contratos.length > 0 ? (
          contratos.map((contrato) => (
            <TableRow key={contrato.id}>
              <TableCell className="font-medium">{contrato.number}</TableCell>
              <TableCell>{contrato.cliente}</TableCell>
              <TableCell className="hidden md:table-cell">{contrato.type}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {getStatusIcon(contrato.status)}
                  <span>{contrato.status}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{formatDate(contrato.end_date)}</TableCell>
              <TableCell className="hidden md:table-cell">{formatCurrency(contrato.value)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">Visualizar</Button>
                  <Button variant="ghost" size="sm">Editar</Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              Nenhum contrato encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
