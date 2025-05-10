
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus } from 'lucide-react';

interface ChecklistSearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  openFilterModal: () => void;
  openModal: () => void;
}

export function ChecklistSearchFilters({
  searchQuery,
  setSearchQuery,
  openFilterModal,
  openModal
}: ChecklistSearchFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
      <div className="relative w-full md:w-auto">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Buscar checklists..."
          className="pl-8 w-full md:w-[300px] bg-white/70 border-lawblue-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={openFilterModal}
        >
          <Filter className="h-4 w-4" /> Filtros
        </Button>
        <Button 
          className="flex items-center gap-1 bg-lawblue-500 hover:bg-lawblue-600"
          onClick={openModal}
        >
          <Plus className="h-4 w-4" /> Novo Checklist
        </Button>
      </div>
    </div>
  );
}
