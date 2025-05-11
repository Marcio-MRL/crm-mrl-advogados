import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard } from 'lucide-react';
import { toast } from 'sonner';
import { ChecklistTemplateItem } from './ChecklistTemplateItem';
import { mockTemplates, applyTemplate } from '@/services/checklistTemplateService';

interface ChecklistTemplateListProps {
  onApplyTemplate?: (templateId: string) => void;
  onManageTemplates?: () => void;
}

export function ChecklistTemplateList({ onApplyTemplate, onManageTemplates }: ChecklistTemplateListProps) {
  const handleApplyTemplate = async (templateId: string) => {
    try {
      if (onApplyTemplate) {
        // If callback provided, use it
        onApplyTemplate(templateId);
      } else {
        // Otherwise apply template directly
        const success = await applyTemplate(templateId);
        
        if (success) {
          // Reload the page to show the new checklist
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Erro ao aplicar modelo de checklist:', error);
      toast.error("Erro ao aplicar modelo de checklist. Tente novamente.");
    }
  };

  const handleManageTemplates = () => {
    if (onManageTemplates) {
      onManageTemplates();
    } else {
      // Provide visual feedback when function is not defined
      toast.info("Gerenciamento de modelos será implementado em breve!");
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Modelos de Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTemplates.map(template => (
            <ChecklistTemplateItem 
              key={template.id} 
              template={template} 
              onApplyTemplate={handleApplyTemplate} 
            />
          ))}
        </div>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2"
            onClick={handleManageTemplates}
          >
            <Clipboard className="h-4 w-4" />
            <span>Gerenciar Modelos</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
