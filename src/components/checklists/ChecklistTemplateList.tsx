
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Clipboard } from 'lucide-react';

interface ChecklistTemplate {
  id: string;
  title: string;
  itemCount: number;
  category: string;
}

const mockTemplates: ChecklistTemplate[] = [
  { id: '1', title: 'Contrato de Prestação de Serviços', itemCount: 8, category: 'Contratos' },
  { id: '2', title: 'Audiência Trabalhista', itemCount: 5, category: 'Processual' },
  { id: '3', title: 'Due Diligence Empresarial', itemCount: 12, category: 'Empresarial' },
  { id: '4', title: 'Conformidade LGPD', itemCount: 10, category: 'Compliance' },
  { id: '5', title: 'Processo Tributário', itemCount: 7, category: 'Tributário' },
];

export function ChecklistTemplateList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Modelos de Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockTemplates.map(template => (
            <div key={template.id} className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm">{template.title}</h4>
                  <div className="flex gap-2 text-xs text-gray-500 mt-1">
                    <span>{template.itemCount} itens</span>
                    <span>•</span>
                    <span>{template.category}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Clipboard className="h-4 w-4" />
            <span>Gerenciar Modelos</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
