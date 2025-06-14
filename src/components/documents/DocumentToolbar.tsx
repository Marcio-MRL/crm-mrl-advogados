
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Upload, 
  Search, 
  FolderPlus,
  Filter
} from 'lucide-react';

interface DocumentToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onUploadClick: () => void;
  onCreateFolderClick?: () => void;
  isConnected: boolean;
}

export function DocumentToolbar({ 
  searchQuery, 
  onSearchChange, 
  onUploadClick,
  onCreateFolderClick,
  isConnected 
}: DocumentToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-1 items-center gap-4 w-full sm:w-auto">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar documentos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          onClick={onUploadClick}
          className="bg-lawblue-500 hover:bg-lawblue-600"
          disabled={!isConnected}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload para Drive
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onCreateFolderClick}
          disabled={!isConnected}
        >
          <FolderPlus className="h-4 w-4 mr-2" />
          Nova Pasta
        </Button>
      </div>
    </div>
  );
}
