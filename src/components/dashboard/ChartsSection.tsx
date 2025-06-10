
import React from 'react';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ProcessChart } from '@/components/dashboard/ProcessChart';

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RevenueChart />
      <ProcessChart />
    </div>
  );
}
