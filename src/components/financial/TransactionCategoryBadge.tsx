
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TransactionCategoryBadgeProps {
  category: string;
  className?: string;
}

// Mapping between common categories and colors
const categoryColorMap: Record<string, string> = {
  'Honorários': 'bg-blue-100 text-blue-800',
  'Despesas Fixas': 'bg-gray-100 text-gray-800',
  'Impostos': 'bg-red-100 text-red-800',
  'Pessoal': 'bg-purple-100 text-purple-800',
  'Suprimentos': 'bg-yellow-100 text-yellow-800',
  'Software': 'bg-indigo-100 text-indigo-800',
  'Marketing': 'bg-pink-100 text-pink-800',
  'Capacitação': 'bg-teal-100 text-teal-800',
};

export function TransactionCategoryBadge({ category, className = '' }: TransactionCategoryBadgeProps) {
  const colorClass = categoryColorMap[category] || 'bg-gray-100 text-gray-800';
  
  return (
    <Badge className={`font-normal ${colorClass} ${className}`}>
      {category}
    </Badge>
  );
}
