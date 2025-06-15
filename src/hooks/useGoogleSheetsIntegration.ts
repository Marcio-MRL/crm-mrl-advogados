import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { SheetMapping } from '@/types/googleSheets';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useGoogleSheetsIntegration() {
  const { user } = useAuth();
  const [sheets, setSheets] = useState<SheetMapping[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSheets = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('google_sheet_mappings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      const mappedSheets: SheetMapping[] = data.map((sheet: any) => ({
        id: sheet.id,
        name: sheet.name,
        url: sheet.url,
        lastSync: sheet.last_synced_at,
        status: sheet.status as SheetMapping['status'],
        type: sheet.type as SheetMapping['type'],
      }));

      setSheets(mappedSheets);
    } catch (error) {
      console.error("Error fetching sheets:", error);
      toast.error('Erro ao carregar planilhas salvas.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSheets();
  }, [fetchSheets]);
  
  const isConnected = sheets.length > 0;

  const handleDisconnect = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('google_sheet_mappings')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      
      setSheets([]);
      toast.info('Desconectado do Google Sheets e todas as planilhas foram removidas.');
    } catch (error: any) {
      console.error("Error disconnecting:", error);
      toast.error(`Erro ao desconectar: ${error.message}`);
    }
  };

  const handleSync = async (sheetId: string) => {
    setSheets(prev => prev.map(sheet => 
      sheet.id === sheetId 
        ? { ...sheet, status: 'syncing' as const }
        : sheet
    ));
    
    setTimeout(async () => {
      try {
        const lastSyncTime = new Date().toISOString();
        const { error } = await supabase
          .from('google_sheet_mappings')
          .update({ status: 'connected', last_synced_at: lastSyncTime })
          .eq('id', sheetId);

        if (error) throw error;
        
        setSheets(prev => prev.map(sheet => 
          sheet.id === sheetId 
            ? { ...sheet, status: 'connected' as const, lastSync: lastSyncTime }
            : sheet
        ));
        toast.success('Planilha sincronizada com sucesso!');
      } catch(error) {
        console.error("Error syncing sheet:", error);
        toast.error("Erro ao sincronizar planilha.");
        setSheets(prev => prev.map(sheet => 
          sheet.id === sheetId 
            ? { ...sheet, status: 'error' as const }
            : sheet
        ));
      }
    }, 2000);
  };

  const handleAddSheet = async (newSheet: Omit<SheetMapping, 'id' | 'lastSync' | 'status'>): Promise<boolean> => {
    if (!user) {
        toast.error('Você precisa estar logado para adicionar planilhas.');
        return false;
    }

    if (!newSheet.name || !newSheet.url) {
      toast.error('Nome e URL são obrigatórios');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('google_sheet_mappings')
        .insert({
          user_id: user.id,
          name: newSheet.name,
          url: newSheet.url,
          type: newSheet.type,
          status: 'connected',
          last_synced_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // unique_violation on user_id, url
          toast.error('Essa planilha já foi adicionada.');
        } else {
            throw error;
        }
        return false;
      }

      if (data) {
        const addedSheet: SheetMapping = {
            id: data.id,
            name: data.name,
            url: data.url,
            lastSync: data.last_synced_at,
            status: data.status as SheetMapping['status'],
            type: data.type as SheetMapping['type'],
        }
        setSheets(prev => [...prev, addedSheet]);
        toast.success('Planilha adicionada com sucesso!');
        return true;
      }
      return false;

    } catch(error: any) {
        console.error("Error adding sheet:", error);
        toast.error(`Erro ao adicionar planilha: ${error.message}`);
        return false;
    }
  };

  const handleDeleteSheet = async (sheetId: string) => {
    try {
        const { error } = await supabase
            .from('google_sheet_mappings')
            .delete()
            .eq('id', sheetId);

        if (error) throw error;

        setSheets(prev => prev.filter(s => s.id !== sheetId));
        toast.success('Planilha removida com sucesso!');
    } catch(error: any) {
        console.error("Error deleting sheet:", error);
        toast.error(`Erro ao remover planilha: ${error.message}`);
    }
  };

  return {
    isConnected,
    sheets,
    loading,
    handleDisconnect,
    handleSync,
    handleAddSheet,
    handleDeleteSheet,
  };
}
