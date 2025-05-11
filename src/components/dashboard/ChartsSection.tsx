
import React from 'react';
import { TaskList } from '@/components/dashboard/TaskList';
import { RevenueChart } from '@/components/dashboard/RevenueChart';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  description?: string;
}

interface ChartsSectionProps {
  urgentTasks: Task[];
}

export function ChartsSection({ urgentTasks }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <RevenueChart />
      <TaskList tasks={urgentTasks} className="h-full" />
    </div>
  );
}
