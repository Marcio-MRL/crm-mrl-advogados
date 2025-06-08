
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
}

interface DocumentBreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export function DocumentBreadcrumbs({ items, onNavigate }: DocumentBreadcrumbsProps) {
  return (
    <div className="flex items-center gap-1 text-sm text-gray-600">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate('/')}
        className="p-1 h-auto text-gray-600 hover:text-gray-900"
      >
        <Home className="h-4 w-4" />
      </Button>
      
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate(item.path)}
            className={`p-1 h-auto ${
              index === items.length - 1 
                ? 'text-gray-900 font-medium' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
            disabled={index === items.length - 1}
          >
            {item.name}
          </Button>
        </React.Fragment>
      ))}
    </div>
  );
}
