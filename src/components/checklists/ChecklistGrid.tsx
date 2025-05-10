
import React from 'react';
import { ChecklistCard } from '@/components/checklists/ChecklistCard';
import { ChecklistEmptyState } from '@/components/checklists/ChecklistEmptyState';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface Checklist {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  progress: number;
  items: ChecklistItem[];
  assignedTo?: string;
  client?: string;
  processId?: string;
}

interface ChecklistGridProps {
  filteredChecklists: Checklist[];
  searchQuery: string;
}

export function ChecklistGrid({ filteredChecklists, searchQuery }: ChecklistGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredChecklists.map(checklist => (
        <ChecklistCard key={checklist.id} checklist={checklist} />
      ))}
      
      {filteredChecklists.length === 0 && <ChecklistEmptyState searchQuery={searchQuery} />}
    </div>
  );
}
