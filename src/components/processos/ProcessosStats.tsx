
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, Archive } from 'lucide-react';
import type { ProcessData } from '@/hooks/useProcesses';

interface ProcessosStatsProps {
  data: ProcessData[];
}

export function ProcessosStats({ data }: ProcessosStatsProps) {
  const stats = React.useMemo(() => {
    const total = data.length;
    const emAndamento = data.filter(p => p.status === 'em_andamento').length;
    const concluidos = data.filter(p => p.status === 'concluido').length;
    const arquivados = data.filter(p => p.status === 'arquivado').length;

    return {
      total,
      emAndamento,
      concluidos,
      arquivados
    };
  }, [data]);

  const statCards = [
    {
      title: "Total de Processos",
      value: stats.total,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Em Andamento",
      value: stats.emAndamento,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Concluídos",
      value: stats.concluidos,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Arquivados",
      value: stats.arquivados,
      icon: Archive,
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
