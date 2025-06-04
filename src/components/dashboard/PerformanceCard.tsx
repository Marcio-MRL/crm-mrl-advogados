
import React from 'react';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Button } from "@/components/ui/button";
import { TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function PerformanceCard() {
  const navigate = useNavigate();

  const handleViewReport = () => {
    navigate('/relatorios');
  };

  return (
    <ChartCard title="Performance Semanal">
      <div className="flex items-center justify-center h-full">
        <div className="text-center flex flex-col items-center justify-center p-6">
          <div className="p-6 rounded-full glass-card mb-4 flex items-center justify-center">
            <TrendingUp size={32} className="text-lawblue-500" />
          </div>
          <h3 className="text-xl font-bold mb-1">15% de aumento</h3>
          <p className="text-sm text-gray-500 mb-2">em Produtividade</p>
          <Button 
            className="bg-lawblue-500 hover:bg-lawblue-600 mt-2"
            onClick={handleViewReport}
          >
            Ver Relatório Completo
          </Button>
        </div>
      </div>
    </ChartCard>
  );
}
