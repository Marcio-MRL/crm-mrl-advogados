
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthStatusHandlerProps {
  children: React.ReactNode;
  reason?: string;
}

export function AuthStatusHandler({ children, reason }: AuthStatusHandlerProps) {
  const { signOut } = useAuth();

  if (!reason) {
    return <>{children}</>;
  }

  const getStatusInfo = () => {
    switch (reason) {
      case 'pending_approval':
        return {
          icon: <Clock className="h-5 w-5 text-yellow-500" />,
          title: 'Aguardando Aprovação',
          message: 'Seu cadastro foi realizado com sucesso! Aguarde a aprovação do administrador para acessar o sistema.',
          variant: 'default' as const,
          showLogout: true
        };
      case 'account_suspended':
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          title: 'Conta Suspensa',
          message: 'Sua conta foi suspensa. Entre em contato com o administrador para mais informações.',
          variant: 'destructive' as const,
          showLogout: true
        };
      case 'invalid_domain':
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          title: 'Domínio Não Autorizado',
          message: 'Acesso restrito a emails do domínio @mrladvogados.com.br.',
          variant: 'destructive' as const,
          showLogout: true
        };
      case 'no_profile':
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          title: 'Perfil Não Encontrado',
          message: 'Erro na configuração do perfil. Tente fazer login novamente.',
          variant: 'destructive' as const,
          showLogout: true
        };
      default:
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          title: 'Erro de Autenticação',
          message: 'Ocorreu um erro inesperado. Tente novamente.',
          variant: 'destructive' as const,
          showLogout: true
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-lawblue-800 flex items-center justify-center gap-2">
            {statusInfo.icon}
            MRL Advogados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant={statusInfo.variant}>
            <AlertDescription>
              <strong>{statusInfo.title}</strong><br />
              {statusInfo.message}
            </AlertDescription>
          </Alert>
          
          {statusInfo.showLogout && (
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={signOut}
                className="w-full"
              >
                Fazer Logout
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
