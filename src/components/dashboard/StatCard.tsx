
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("glass-card rounded-lg p-4 flex flex-col", className)}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-full glass-card text-lawblue-500">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-2 flex items-center">
          <span className={cn(
            "text-xs", 
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            {trend.isPositive ? "+" : "-"}{trend.value}%
          </span>
          <span className="text-xs text-gray-500 ml-1">desde mês passado</span>
        </div>
      )}
    </div>
  );
}
