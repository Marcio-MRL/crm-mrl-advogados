
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: 'master' | 'admin' | 'advogado' | 'leitor';
  allowedRoles?: ('master' | 'admin' | 'advogado' | 'leitor')[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ 
  children, 
  requiredRole,
  allowedRoles = ['master', 'admin', 'advogado', 'leitor'],
  fallback
}: RoleGuardProps) {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="p-6">
          <div className="animate-pulse text-center">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mapear role do banco para verificação
  const userRole = userProfile.role === 'editor' ? 'advogado' : userProfile.role;

  // Verificar role específico
  if (requiredRole && userRole !== requiredRole) {
    return fallback || (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Acesso Negado</strong><br />
              Você não tem permissão para acessar esta funcionalidade.
              <br />
              <small>Requer role: {requiredRole}, seu role: {userRole}</small>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Verificar se está na lista de roles permitidos
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return fallback || (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="p-6">
          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Acesso Negado</strong><br />
              Você não tem permissão para acessar esta funcionalidade.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
