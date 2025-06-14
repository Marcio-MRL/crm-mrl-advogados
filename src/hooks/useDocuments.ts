
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface DocumentMetadata {
  id: string;
  drive_file_id: string;
  name: string;
  description?: string;
  category: string;
  client_id?: string;
  process_id?: string;
  user_id: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('documents' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setDocuments((data as unknown as DocumentMetadata[]) || []);
    } catch (err) {
      console.error('Erro ao buscar documentos:', err);
      setError('Erro ao carregar documentos');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentsByClient = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('documents' as any)
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as unknown as DocumentMetadata[]) || [];
    } catch (err) {
      console.error('Erro ao buscar documentos do cliente:', err);
      return [];
    }
  };

  const getDocumentsByProcess = async (processId: string) => {
    try {
      const { data, error } = await supabase
        .from('documents' as any)
        .select('*')
        .eq('process_id', processId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as unknown as DocumentMetadata[]) || [];
    } catch (err) {
      console.error('Erro ao buscar documentos do processo:', err);
      return [];
    }
  };

  const updateDocument = async (id: string, updates: Partial<DocumentMetadata>) => {
    try {
      const { error } = await supabase
        .from('documents' as any)
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast.success('Documento atualizado com sucesso!');
      await fetchDocuments();
    } catch (err) {
      console.error('Erro ao atualizar documento:', err);
      toast.error('Erro ao atualizar documento');
    }
  };

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    getDocumentsByClient,
    getDocumentsByProcess,
    updateDocument,
  };
}
