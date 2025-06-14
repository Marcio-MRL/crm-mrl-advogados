
import { useState } from 'react';
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
      const newExport: DataExport = {
        id: Math.random().toString(),
        export_type: type,
        status: 'pending',
        requested_tables: tables || ['leads', 'clients', 'processes', 'contracts', 'events', 'checklists', 'legal_opinions'],
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      setExports(prev => [newExport, ...prev]);

      // Simular processamento
      setTimeout(() => {
        setExports(prev => prev.map(exp => 
          exp.id === newExport.id 
            ? { ...exp, status: 'completed', file_url: 'mock-file-url', completed_at: new Date().toISOString() }
            : exp
        ));
        toast.success('Exportação concluída com sucesso');
      }, 2000);

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

  const fetchExports = async () => {
    // Simulação de busca
    console.log('Buscando exportações...');
  };

  const downloadExport = (exportItem: DataExport) => {
    if (exportItem.file_url) {
      // Simular download
      const jsonData = JSON.stringify({
        export_date: exportItem.created_at,
        user_id: user?.id,
        data: { message: 'Dados exportados com sucesso' }
      }, null, 2);
      
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dados-exportados-${exportItem.created_at.split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
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
