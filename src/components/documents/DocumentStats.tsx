
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from 'lucide-react';
import type { DocumentMetadata } from '@/hooks/useGoogleDrive';

interface DocumentStatsProps {
  documents: DocumentMetadata[];
}

export function DocumentStats({ documents }: DocumentStatsProps) {
  const getCategoryCounts = () => {
    const counts = documents.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: documents.length,
      contratos: counts.contrato || 0,
      peticoes: counts.peticao || 0,
      procuracoes: counts.procuracao || 0,
      outros: Object.values(counts).reduce((sum, count) => sum + count, 0) - (counts.contrato || 0) - (counts.peticao || 0) - (counts.procuracao || 0)
    };
  };

  const stats = getCategoryCounts();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Documentos</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contratos</p>
              <p className="text-2xl font-bold">{stats.contratos}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Petições</p>
              <p className="text-2xl font-bold">{stats.peticoes}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Procurações</p>
              <p className="text-2xl font-bold">{stats.procuracoes}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
