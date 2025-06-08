
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export function ProcessosStats() {
  const stats = [
    {
      title: "Total de Processos",
      value: "156",
      icon: Scale,
      color: "text-lawblue-600"
    },
    {
      title: "Em Andamento",
      value: "89",
      icon: Clock,
      color: "text-blue-600"
    },
    {
      title: "Concluídos",
      value: "45",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Pendências",
      value: "22",
      icon: AlertTriangle,
      color: "text-yellow-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
