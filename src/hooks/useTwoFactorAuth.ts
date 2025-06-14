
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
      const { data, error } = await supabase
        .from('two_factor_auth')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setTwoFA(data);
    } catch (error) {
      console.error('Erro ao buscar 2FA:', error);
      toast.error('Erro ao carregar configurações de 2FA');
    } finally {
      setLoading(false);
    }
  };

  const generateSecret = () => {
    // Gerar um secret simples para demonstração
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
      
      // Gerar QR Code URL para autenticadores como Google Authenticator
      const appName = 'MRL Advogados CRM';
      const qrUrl = `otpauth://totp/${encodeURIComponent(appName)}:${encodeURIComponent(user.email || '')}?secret=${secret}&issuer=${encodeURIComponent(appName)}`;
      setQrCode(qrUrl);

      const { data, error } = await supabase
        .from('two_factor_auth')
        .upsert({
          user_id: user.id,
          secret_key: secret,
          backup_codes: backupCodes,
          is_enabled: false
        })
        .select()
        .single();

      if (error) throw error;
      
      setTwoFA(data);
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
      // Em produção, verificaríamos o código TOTP aqui
      // Por simplicidade, vamos simular a verificação
      const isValid = verificationCode.length === 6 && /^\d+$/.test(verificationCode);
      
      if (!isValid) {
        toast.error('Código de verificação inválido');
        return false;
      }

      const { error } = await supabase
        .from('two_factor_auth')
        .update({
          is_enabled: true,
          verified_at: new Date().toISOString()
        })
        .eq('id', twoFA.id);

      if (error) throw error;

      await fetchTwoFA();
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
      const { error } = await supabase
        .from('two_factor_auth')
        .update({ is_enabled: false })
        .eq('id', twoFA.id);

      if (error) throw error;

      await fetchTwoFA();
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
