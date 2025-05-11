
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import type { ChecklistTemplate } from '@/types/checklist';
import { toast } from 'sonner';

interface ChecklistTemplateItemProps {
  template: ChecklistTemplate;
  onApplyTemplate: (templateId: string) => void;
}

export function ChecklistTemplateItem({ template, onApplyTemplate }: ChecklistTemplateItemProps) {
  const handleApplyTemplate = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any parent click events
    onApplyTemplate(template.id);
    toast.success(`Modelo "${template.title}" aplicado com sucesso!`);
  };

  return (
    <div className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-sm">{template.title}</h4>
          <div className="flex gap-2 text-xs text-gray-500 mt-1">
            <span>{template.itemCount} itens</span>
            <span>•</span>
            <span>{template.category}</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={handleApplyTemplate}
        >
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
