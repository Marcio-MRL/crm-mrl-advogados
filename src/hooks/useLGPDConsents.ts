
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface LGPDConsent {
  id: string;
  consent_type: 'data_processing' | 'marketing' | 'analytics' | 'cookies';
  consent_given: boolean;
  consent_date: string;
  withdrawal_date?: string;
}

export function useLGPDConsents() {
  const [consents, setConsents] = useState<LGPDConsent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchConsents = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('lgpd_consents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConsents(data || []);
    } catch (error) {
      console.error('Erro ao buscar consentimentos:', error);
      toast.error('Erro ao carregar consentimentos LGPD');
    } finally {
      setLoading(false);
    }
  };

  const updateConsent = async (consentType: string, given: boolean) => {
    if (!user) return false;

    try {
      const existingConsent = consents.find(c => c.consent_type === consentType);
      
      if (existingConsent) {
        const { error } = await supabase
          .from('lgpd_consents')
          .update({
            consent_given: given,
            withdrawal_date: given ? null : new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingConsent.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('lgpd_consents')
          .insert({
            user_id: user.id,
            consent_type: consentType,
            consent_given: given,
            ip_address: await getClientIP(),
            user_agent: navigator.userAgent
          });

        if (error) throw error;
      }

      await fetchConsents();
      toast.success(`Consentimento ${given ? 'concedido' : 'retirado'} com sucesso`);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar consentimento:', error);
      toast.error('Erro ao atualizar consentimento');
      return false;
    }
  };

  const getClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return '127.0.0.1';
    }
  };

  useEffect(() => {
    fetchConsents();
  }, [user]);

  return {
    consents,
    loading,
    updateConsent,
    refetch: fetchConsents
  };
}
