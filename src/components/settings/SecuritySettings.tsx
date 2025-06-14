
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSecuritySessions } from '@/hooks/useSecuritySessions';
import { useTwoFactorAuth } from '@/hooks/useTwoFactorAuth';
import { 
  Shield, 
  Smartphone, 
  Monitor, 
  Clock,
  AlertCircle,
  CheckCircle,
  Key,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

export function SecuritySettings() {
  const { sessions, loading: sessionsLoading, terminateSession, terminateAllSessions } = useSecuritySessions();
  const { twoFA, loading: twoFALoading, qrCode, setupTwoFA, enableTwoFA, disableTwoFA } = useTwoFactorAuth();
  
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [showQR, setShowQR] = useState(false);

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error('As senhas não coincidem');
      return;
    }
    if (passwordData.new.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres');
      return;
    }
    // Em produção, faria a chamada para atualizar a senha
    toast.success('Senha atualizada com sucesso');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleSetup2FA = async () => {
    const result = await setupTwoFA();
    if (result) {
      setShowQR(true);
    }
  };

  const handleEnable2FA = async () => {
    const success = await enableTwoFA(verificationCode);
    if (success) {
      setShowQR(false);
      setVerificationCode('');
    }
  };

  const getDeviceIcon = (userAgent?: string) => {
    if (!userAgent) return Monitor;
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      return Smartphone;
    }
    return Monitor;
  };

  const getDeviceName = (userAgent?: string) => {
    if (!userAgent) return 'Dispositivo Desconhecido';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Navegador Desconhecido';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Alteração de Senha
          </CardTitle>
          <CardDescription>
            Atualize sua senha para manter sua conta segura
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha Atual</Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordData.current}
              onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
              placeholder="Digite sua senha atual"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordData.new}
              onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
              placeholder="Digite a nova senha"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordData.confirm}
              onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
              placeholder="Confirme a nova senha"
            />
          </div>
          
          <Button onClick={handlePasswordChange} className="bg-lawblue-500 hover:bg-lawblue-600">
            Atualizar Senha
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Autenticação de Dois Fatores
          </CardTitle>
          <CardDescription>
            Adicione uma camada extra de segurança à sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!twoFA?.is_enabled ? (
            <div className="space-y-4">
              {!showQR ? (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">2FA Desativado</h4>
                    <p className="text-sm text-gray-500">Configure a autenticação de dois fatores para maior segurança</p>
                  </div>
                  <Button onClick={handleSetup2FA} disabled={twoFALoading}>
                    <Shield className="h-4 w-4 mr-2" />
                    Configurar 2FA
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <h4 className="font-medium mb-2">Configure seu Autenticador</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Escaneie o QR Code com seu app autenticador (Google Authenticator, Authy, etc.)
                    </p>
                    
                    {qrCode && (
                      <div className="flex justify-center mb-4">
                        <div className="p-4 bg-white rounded border">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCode)}`}
                            alt="QR Code para 2FA"
                            className="w-48 h-48"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label>Código de Verificação</Label>
                      <Input
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Digite o código de 6 dígitos"
                        maxLength={6}
                      />
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleEnable2FA} disabled={verificationCode.length !== 6}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Ativar 2FA
                      </Button>
                      <Button variant="outline" onClick={() => setShowQR(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <h4 className="font-medium">2FA Ativado</h4>
                    <p className="text-sm text-gray-500">Sua conta está protegida com autenticação de dois fatores</p>
                  </div>
                </div>
                <Button variant="outline" onClick={disableTwoFA}>
                  Desativar 2FA
                </Button>
              </div>
              
              {twoFA.backup_codes && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Códigos de Backup</h4>
                  <p className="text-sm text-gray-500 mb-3">
                    Guarde estes códigos em local seguro. Use-os caso perca acesso ao seu autenticador.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                    {twoFA.backup_codes.map((code, index) => (
                      <Badge key={index} variant="outline">{code}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Sessões Ativas
          </CardTitle>
          <CardDescription>
            Gerencie dispositivos conectados à sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{sessions.length} sessão(ões) ativa(s)</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={terminateAllSessions}
              disabled={sessionsLoading}
            >
              Terminar Todas as Outras Sessões
            </Button>
          </div>
          
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {sessions.map((session) => {
                const DeviceIcon = getDeviceIcon(session.user_agent);
                const isCurrentSession = session.session_token === localStorage.getItem('sb-session-token');
                
                return (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <DeviceIcon className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{getDeviceName(session.user_agent)}</span>
                          {isCurrentSession && <Badge variant="default">Atual</Badge>}
                          {session.is_active && !isCurrentSession && <Badge variant="outline">Ativa</Badge>}
                        </div>
                        <p className="text-sm text-gray-500">
                          IP: {session.ip_address || 'Desconhecido'} • 
                          Última atividade: {new Date(session.last_activity).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    
                    {!isCurrentSession && session.is_active && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => terminateSession(session.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
