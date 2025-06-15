
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export type ExportDataType = 'clients' | 'processes' | 'financial' | 'calendar' | 'tasks';

interface ExportOptions {
  sheetId: string;
  dataType: ExportDataType;
  range?: string;
  clearExisting?: boolean;
}

export function useGoogleSheetsExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = async (options: ExportOptions): Promise<boolean> => {
    setIsExporting(true);
    try {
      console.log('Starting export with options:', options);
      
      const { data, error } = await supabase.functions.invoke('export-to-sheets', {
        body: {
          sheetId: options.sheetId,
          dataType: options.dataType,
          range: options.range || 'Sheet1!A1:Z1000',
          clearExisting: options.clearExisting ?? true
        }
      });

      if (error) {
        console.error('Export error:', error);
        toast.error(`Erro na exportação: ${error.message}`);
        return false;
      }

      if (!data.success) {
        console.error('Export failed:', data.error);
        toast.error(`Falha na exportação: ${data.error}`);
        return false;
      }

      toast.success(data.message || 'Dados exportados com sucesso!');
      console.log('Export completed:', data);
      return true;

    } catch (error: any) {
      console.error('Unexpected error during export:', error);
      toast.error(`Erro inesperado: ${error.message}`);
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  const getDataTypeLabel = (dataType: ExportDataType): string => {
    const labels = {
      clients: 'Clientes',
      processes: 'Processos',
      financial: 'Financeiro',
      calendar: 'Agenda',
      tasks: 'Tarefas'
    };
    return labels[dataType] || dataType;
  };

  return {
    exportData,
    isExporting,
    getDataTypeLabel
  };
}
