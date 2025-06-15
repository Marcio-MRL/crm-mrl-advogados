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
import { Download, Eye, FileText, Loader2 } from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import { Report } from '@/types/report';

export function ReportsList() {
  const { reports, isLoading, error } = useReports();

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Erro ao carregar relatórios: {error.message}</div>;
  }
  
  if (reports.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Nenhum relatório encontrado</h3>
            <p className="text-sm">Gere um novo relatório para começar.</p>
        </div>
      )
  }

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
          {reports.map((report: Report) => (
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
                {new Date(report.created_at).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {report.created_by}
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
