
import React from 'react';
import { ProcessChart } from '@/components/dashboard/ProcessChart';
import { PerformanceCard } from '@/components/dashboard/PerformanceCard';

export function BottomCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ProcessChart />
      <PerformanceCard />
    </div>
  );
}
