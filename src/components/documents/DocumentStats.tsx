
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText, File, FileSpreadsheet, FileImage } from 'lucide-react';

interface DocumentStatsProps {
  totalDocuments: number;
  pdfCount: number;
  docCount: number;
  xlsCount: number;
  imgCount: number;
}

export function DocumentStats({ 
  totalDocuments, 
  pdfCount, 
  docCount, 
  xlsCount, 
  imgCount 
}: DocumentStatsProps) {
  const stats = [
    {
      label: 'Total de Documentos',
      value: totalDocuments,
      icon: FileText,
      color: 'blue'
    },
    {
      label: 'PDFs',
      value: pdfCount,
      icon: File,
      color: 'red'
    },
    {
      label: 'Documentos Word',
      value: docCount,
      icon: FileText,
      color: 'blue'
    },
    {
      label: 'Planilhas',
      value: xlsCount,
      icon: FileSpreadsheet,
      color: 'green'
    }
  ];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'red':
        return 'bg-red-100 text-red-600';
      case 'green':
        return 'bg-green-100 text-green-600';
      case 'blue':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${getColorClasses(stat.color)}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
