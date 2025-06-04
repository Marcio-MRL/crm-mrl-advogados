
import React from 'react';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ProcessChart } from '@/components/dashboard/ProcessChart';
import { TaskList } from '@/components/dashboard/TaskList';

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
  onTasksChange?: (tasks: Task[]) => void;
}

export function ChartsSection({ urgentTasks, onTasksChange }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <RevenueChart />
      <ProcessChart />
      <TaskList 
        tasks={urgentTasks} 
        onTasksChange={onTasksChange}
      />
    </div>
  );
}
