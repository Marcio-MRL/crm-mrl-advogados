
import { ChecklistTemplate } from '@/types/checklist';
import { supabase, getCurrentUserId } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const mockTemplates: ChecklistTemplate[] = [
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

export const applyTemplate = async (templateId: string): Promise<boolean> => {
  try {
    // Find the template
    const selectedTemplate = mockTemplates.find(template => template.id === templateId);
    
    if (!selectedTemplate) {
      toast.error("Modelo de checklist não encontrado.");
      return false;
    }
    
    // Get current user ID
    const userId = await getCurrentUserId();
    
    if (!userId) {
      toast.error("Você precisa estar logado para criar um checklist.");
      return false;
    }
    
    // Create new checklist based on template
    const { data: checklistData, error: checklistError } = await supabase
      .from('checklists')
      .insert({
        title: selectedTemplate.title,
        description: `Baseado no modelo "${selectedTemplate.title}"`,
        progress: 0,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Date: 2 weeks
        user_id: userId
      })
      .select('id')
      .single();
    
    if (checklistError) {
      console.error('Erro ao criar checklist:', checklistError);
      throw checklistError;
    }
    
    // Add checklist items
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
    return true;
    
  } catch (error) {
    console.error('Erro ao aplicar modelo de checklist:', error);
    toast.error("Erro ao aplicar modelo de checklist. Tente novamente.");
    return false;
  }
};
