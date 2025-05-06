
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: string;
  date: string;
  createdBy: string;
  format: 'pdf' | 'xlsx' | 'docx';
}

const mockReports: Report[] = [
  { id: '1', name: 'Relatório Financeiro - Q1 2025', type: 'Financeiro', date: '2025-04-05', createdBy: 'Dra. Ana Silva', format: 'pdf' },
  { id: '2', name: 'Processos em Andamento', type: 'Processual', date: '2025-04-15', createdBy: 'Dr. Carlos Mendes', format: 'xlsx' },
  { id: '3', name: 'Distribuição de Clientes', type: 'Clientes', date: '2025-04-22', createdBy: 'Dra. Maria Oliveira', format: 'pdf' },
  { id: '4', name: 'Horas Trabalhadas - Abril 2025', type: 'Recursos Humanos', date: '2025-05-01', createdBy: 'Dr. Paulo Santos', format: 'xlsx' },
  { id: '5', name: 'Análise de Contratos Q1 2025', type: 'Contratos', date: '2025-04-10', createdBy: 'Dr. Fernando Costa', format: 'docx' },
];

export function ReportsList() {
  const getFormatLabel = (format: string) => {
    switch(format) {
      case 'pdf': return 'PDF';
      case 'xlsx': return 'Excel';
      case 'docx': return 'Word';
      default: return format.toUpperCase();
    }
  };

  const getFormatClass = (format: string) => {
    switch(format) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'xlsx': return 'bg-green-100 text-green-800';
      case 'docx': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Relatório</TableHead>
            <TableHead className="hidden md:table-cell">Tipo</TableHead>
            <TableHead className="hidden md:table-cell">Data</TableHead>
            <TableHead className="hidden md:table-cell">Criado por</TableHead>
            <TableHead>Formato</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockReports.map(report => (
            <TableRow key={report.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>{report.name}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {report.type}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(report.date).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {report.createdBy}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFormatClass(report.format)}`}>
                  {getFormatLabel(report.format)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
