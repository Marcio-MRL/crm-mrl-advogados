
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface TwoFactorAuth {
  id: string;
  secret_key: string;
  backup_codes: string[];
  is_enabled: boolean;
  verified_at?: string;
}

export function useTwoFactorAuth() {
  const [twoFA, setTwoFA] = useState<TwoFactorAuth | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState<string>('');
  const { user } = useAuth();

  const fetchTwoFA = async () => {
    if (!user) return;

    try {
      // Simulação de dados 2FA
      setTwoFA(null); // Inicialmente não configurado
    } catch (error) {
      console.error('Erro ao buscar 2FA:', error);
      toast.error('Erro ao carregar configurações de 2FA');
    } finally {
      setLoading(false);
    }
  };

  const generateSecret = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return secret;
  };

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  };

  const setupTwoFA = async () => {
    if (!user) return null;

    try {
      const secret = generateSecret();
      const backupCodes = generateBackupCodes();
      
      const appName = 'MRL Advogados CRM';
      const qrUrl = `otpauth://totp/${encodeURIComponent(appName)}:${encodeURIComponent(user.email || '')}?secret=${secret}&issuer=${encodeURIComponent(appName)}`;
      setQrCode(qrUrl);

      const newTwoFA: TwoFactorAuth = {
        id: '1',
        secret_key: secret,
        backup_codes: backupCodes,
        is_enabled: false
      };
      
      setTwoFA(newTwoFA);
      return { secret, backupCodes, qrUrl };
    } catch (error) {
      console.error('Erro ao configurar 2FA:', error);
      toast.error('Erro ao configurar autenticação de dois fatores');
      return null;
    }
  };

  const enableTwoFA = async (verificationCode: string) => {
    if (!twoFA) return false;

    try {
      const isValid = verificationCode.length === 6 && /^\d+$/.test(verificationCode);
      
      if (!isValid) {
        toast.error('Código de verificação inválido');
        return false;
      }

      setTwoFA({
        ...twoFA,
        is_enabled: true,
        verified_at: new Date().toISOString()
      });

      toast.success('Autenticação de dois fatores ativada com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao ativar 2FA:', error);
      toast.error('Erro ao ativar autenticação de dois fatores');
      return false;
    }
  };

  const disableTwoFA = async () => {
    if (!twoFA) return false;

    try {
      setTwoFA({
        ...twoFA,
        is_enabled: false
      });
      toast.success('Autenticação de dois fatores desativada');
      return true;
    } catch (error) {
      console.error('Erro ao desativar 2FA:', error);
      toast.error('Erro ao desativar autenticação de dois fatores');
      return false;
    }
  };

  useEffect(() => {
    fetchTwoFA();
  }, [user]);

  return {
    twoFA,
    loading,
    qrCode,
    setupTwoFA,
    enableTwoFA,
    disableTwoFA,
    refetch: fetchTwoFA
  };
}
