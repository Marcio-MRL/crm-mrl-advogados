
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Clipboard } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, getCurrentUserId } from '@/integrations/supabase/client';

interface ChecklistTemplate {
  id: string;
  title: string;
  itemCount: number;
  category: string;
  items?: { text: string; checked: boolean }[];
}

interface ChecklistTemplateListProps {
  onApplyTemplate?: (templateId: string) => void;
  onManageTemplates?: () => void;
}

const mockTemplates: ChecklistTemplate[] = [
  { 
    id: '1', 
    title: 'Contrato de Prestação de Serviços', 
    itemCount: 8, 
    category: 'Contratos',
    items: [
      { text: 'Verificar dados das partes', checked: false },
      { text: 'Revisar cláusulas contratuais', checked: false },
      { text: 'Conferir valores e formas de pagamento', checked: false },
      { text: 'Verificar prazos e vigência', checked: false },
      { text: 'Revisar cláusulas de rescisão', checked: false },
      { text: 'Conferir obrigações das partes', checked: false },
      { text: 'Revisar cláusulas de confidencialidade', checked: false },
      { text: 'Verificar assinaturas e rubricas', checked: false }
    ]
  },
  { 
    id: '2', 
    title: 'Audiência Trabalhista', 
    itemCount: 5, 
    category: 'Processual',
    items: [
      { text: 'Preparar pasta com documentos', checked: false },
      { text: 'Revisar depoimentos de testemunhas', checked: false },
      { text: 'Preparar argumentação oral', checked: false },
      { text: 'Verificar jurisprudência recente', checked: false },
      { text: 'Reunir-se com cliente antes da audiência', checked: false }
    ]
  },
  { 
    id: '3', 
    title: 'Due Diligence Empresarial', 
    itemCount: 12, 
    category: 'Empresarial',
    items: [
      { text: 'Analisar documentos societários', checked: false },
      { text: 'Verificar contratos vigentes', checked: false },
      { text: 'Analisar situação fiscal', checked: false },
      { text: 'Verificar processos judiciais', checked: false },
      { text: 'Analisar situação trabalhista', checked: false },
      { text: 'Verificar propriedade intelectual', checked: false },
      { text: 'Analisar contratos de financiamento', checked: false },
      { text: 'Verificar licenças e autorizações', checked: false },
      { text: 'Analisar questões ambientais', checked: false },
      { text: 'Verificar seguros vigentes', checked: false },
      { text: 'Analisar imóveis e bens', checked: false },
      { text: 'Preparar relatório final', checked: false }
    ]
  },
  { 
    id: '4', 
    title: 'Conformidade LGPD', 
    itemCount: 10, 
    category: 'Compliance',
    items: [
      { text: 'Mapear dados pessoais tratados', checked: false },
      { text: 'Verificar base legal para tratamento', checked: false },
      { text: 'Analisar contratos com operadores', checked: false },
      { text: 'Verificar políticas de privacidade', checked: false },
      { text: 'Analisar medidas de segurança', checked: false },
      { text: 'Verificar procedimentos para atendimento de titulares', checked: false },
      { text: 'Analisar registro de tratamento', checked: false },
      { text: 'Verificar DPO designado', checked: false },
      { text: 'Analisar plano de resposta a incidentes', checked: false },
      { text: 'Verificar treinamentos realizados', checked: false }
    ]
  },
  { 
    id: '5', 
    title: 'Processo Tributário', 
    itemCount: 7, 
    category: 'Tributário',
    items: [
      { text: 'Analisar auto de infração', checked: false },
      { text: 'Verificar prescrição e decadência', checked: false },
      { text: 'Analisar jurisprudência aplicável', checked: false },
      { text: 'Preparar defesa administrativa', checked: false },
      { text: 'Verificar garantias para discussão judicial', checked: false },
      { text: 'Analisar possibilidade de transação tributária', checked: false },
      { text: 'Avaliar riscos e chances de êxito', checked: false }
    ]
  },
];

export function ChecklistTemplateList({ onApplyTemplate, onManageTemplates }: ChecklistTemplateListProps) {
  const handleApplyTemplate = async (templateId: string) => {
    try {
      // Encontrar o template selecionado
      const selectedTemplate = mockTemplates.find(template => template.id === templateId);
      
      if (!selectedTemplate) {
        toast.error("Modelo de checklist não encontrado.");
        return;
      }
      
      if (onApplyTemplate) {
        // Se a função callback for fornecida, use-a
        onApplyTemplate(templateId);
      } else {
        // Caso contrário, aplicar o template diretamente
        // Obter o ID do usuário atual
        const userId = await getCurrentUserId();
        
        if (!userId) {
          toast.error("Você precisa estar logado para criar um checklist.");
          return;
        }
        
        // Criar novo checklist baseado no template
        const { data: checklistData, error: checklistError } = await supabase
          .from('checklists')
          .insert({
            title: selectedTemplate.title,
            description: `Baseado no modelo "${selectedTemplate.title}"`,
            progress: 0,
            due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Data padrão: 2 semanas
            user_id: userId // Adicionar o ID do usuário
          })
          .select('id')
          .single();
        
        if (checklistError) {
          console.error('Erro ao criar checklist:', checklistError);
          throw checklistError;
        }
        
        // Adicionar itens do checklist
        if (selectedTemplate.items && selectedTemplate.items.length > 0) {
          const checklistItems = selectedTemplate.items.map(item => ({
            checklist_id: checklistData.id,
            text: item.text,
            checked: false
          }));
          
          const { error: itemsError } = await supabase
            .from('checklist_items')
            .insert(checklistItems);
            
          if (itemsError) {
            console.error('Erro ao criar itens do checklist:', itemsError);
            throw itemsError;
          }
        }
        
        toast.success(`Modelo de checklist "${selectedTemplate.title}" aplicado com sucesso!`);
        
        // Recarregar a página para mostrar o novo checklist
        setTimeout(() => {
          window.location.reload();
        }, 1500);
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
      // Fornecer feedback visual ao usuário quando a função não estiver definida
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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => handleApplyTemplate(template.id)}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
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
