
import React from 'react';

interface ChecklistEmptyStateProps {
  searchQuery: string;
}

export function ChecklistEmptyState({ searchQuery }: ChecklistEmptyStateProps) {
  return (
    <div className="col-span-2 flex flex-col items-center justify-center p-8 text-center">
      <div className="text-gray-400 mb-4">
        <span className="text-4xl">📋</span>
      </div>
      <h3 className="text-lg font-medium">Nenhum checklist encontrado</h3>
      <p className="text-gray-500 mt-2">
        Não foram encontrados checklists para sua pesquisa {searchQuery ? `"${searchQuery}"` : ""}.
      </p>
    </div>
  );
}
