
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/integrations/supabase/client';
import { 
  ColumnFiltersState,
  flexRender, 
  getCoreRowModel, 
  getFilteredRowModel, 
  getSortedRowModel, 
  SortingState, 
  useReactTable,
  createColumnHelper
} from '@tanstack/react-table';

interface ContratoTableProps {
  contratos: any[];
  loading?: boolean;
  onViewContrato: (id: string) => void;
}

export function ContratoTable({ contratos, loading = false, onViewContrato }: ContratoTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  
  const columnHelper = createColumnHelper<any>();
  
  const columns = [
    columnHelper.accessor('number', {
      header: 'Número',
      cell: info => <div className="font-medium">{info.getValue()}</div>,
    }),
    columnHelper.accessor(row => row.client_name, {
      id: 'client',
      header: 'Cliente',
      cell: info => <div>{info.getValue() || '—'}</div>,
    }),
    columnHelper.accessor('type', {
      header: 'Tipo',
      cell: info => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => (
        <Badge className={`${
          info.getValue() === 'Ativo' || info.getValue() === 'ativo' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('start_date', {
      header: 'Data Início',
      cell: info => <div>{formatDate(info.getValue())}</div>,
    }),
    columnHelper.accessor('value', {
      header: 'Valor',
      cell: info => {
        const value = info.getValue();
        return value ? (
          <div className="font-medium">
            {Number(value).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </div>
        ) : '—';
      },
    }),
    columnHelper.accessor('id', {
      header: '',
      cell: info => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onViewContrato(info.getValue())}
        >
          Visualizar
        </Button>
      ),
    }),
  ];
  
  const table = useReactTable({
    data: contratos,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Carregando contratos...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nenhum contrato encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
