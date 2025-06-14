
import { useState, useEffect } from 'react';
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
      // Simulação de dados para demonstração
      const mockConsents: LGPDConsent[] = [
        {
          id: '1',
          consent_type: 'data_processing',
          consent_given: true,
          consent_date: new Date().toISOString()
        },
        {
          id: '2',
          consent_type: 'marketing',
          consent_given: false,
          consent_date: new Date().toISOString()
        }
      ];
      setConsents(mockConsents);
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
      // Simulação de atualização
      setConsents(prev => prev.map(consent => 
        consent.consent_type === consentType 
          ? { ...consent, consent_given: given, withdrawal_date: given ? undefined : new Date().toISOString() }
          : consent
      ));
      
      toast.success(`Consentimento ${given ? 'concedido' : 'retirado'} com sucesso`);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar consentimento:', error);
      toast.error('Erro ao atualizar consentimento');
      return false;
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
