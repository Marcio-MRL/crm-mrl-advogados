
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface DataExport {
  id: string;
  export_type: 'full' | 'partial' | 'lgpd_request';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_url?: string;
  requested_tables: string[];
  created_at: string;
  completed_at?: string;
  expires_at?: string;
}

export function useDataExport() {
  const [exports, setExports] = useState<DataExport[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const requestDataExport = async (type: 'full' | 'partial' | 'lgpd_request', tables?: string[]) => {
    if (!user) return false;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('data_exports')
        .insert({
          user_id: user.id,
          export_type: type,
          requested_tables: tables || ['leads', 'clients', 'processes', 'contracts', 'events', 'checklists', 'legal_opinions'],
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 dias
        })
        .select()
        .single();

      if (error) throw error;

      // Simular processamento (em produção seria uma edge function)
      setTimeout(async () => {
        await generateExportFile(data.id);
      }, 2000);

      await fetchExports();
      toast.success('Solicitação de exportação criada com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao solicitar exportação:', error);
      toast.error('Erro ao solicitar exportação de dados');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const generateExportFile = async (exportId: string) => {
    try {
      // Em produção, isso seria feito por uma edge function
      const exportData = await collectUserData();
      const jsonData = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const { error } = await supabase
        .from('data_exports')
        .update({
          status: 'completed',
          file_url: url,
          completed_at: new Date().toISOString()
        })
        .eq('id', exportId);

      if (error) throw error;
      
      await fetchExports();
      toast.success('Exportação concluída com sucesso');
    } catch (error) {
      console.error('Erro ao gerar arquivo:', error);
      await supabase
        .from('data_exports')
        .update({ status: 'failed' })
        .eq('id', exportId);
    }
  };

  const collectUserData = async () => {
    const data: any = {};
    const tables = ['leads', 'clients', 'processes', 'contracts', 'events', 'checklists', 'legal_opinions'];

    for (const table of tables) {
      try {
        const { data: tableData } = await supabase
          .from(table)
          .select('*')
          .eq('user_id', user?.id);
        data[table] = tableData;
      } catch (error) {
        console.log(`Erro ao exportar tabela ${table}:`, error);
      }
    }

    return {
      export_date: new Date().toISOString(),
      user_id: user?.id,
      data
    };
  };

  const fetchExports = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('data_exports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExports(data || []);
    } catch (error) {
      console.error('Erro ao buscar exportações:', error);
    }
  };

  const downloadExport = (exportItem: DataExport) => {
    if (exportItem.file_url) {
      const link = document.createElement('a');
      link.href = exportItem.file_url;
      link.download = `dados-exportados-${exportItem.created_at.split('T')[0]}.json`;
      link.click();
    }
  };

  return {
    exports,
    loading,
    requestDataExport,
    fetchExports,
    downloadExport
  };
}
