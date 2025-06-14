
import React from 'react';
import { useAuthValidation } from '@/hooks/useAuthValidation';
import { AuthStatusHandler } from '@/components/auth/AuthStatusHandler';
import { RoleGuard } from '@/components/auth/RoleGuard';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'master' | 'admin' | 'advogado' | 'leitor';
  allowedRoles?: ('master' | 'admin' | 'advogado' | 'leitor')[];
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  allowedRoles = ['master', 'admin', 'advogado', 'leitor']
}: ProtectedRouteProps) {
  const { isValid, reason, shouldRedirect, performRedirect, loading } = useAuthValidation();

  // Mostrar loading enquanto verifica
  if (loading) {
    return <AuthStatusHandler reason={undefined}>{null}</AuthStatusHandler>;
  }

  // Fazer redirect se necessário
  if (shouldRedirect) {
    performRedirect();
    return null;
  }

  // Se não é válido mas não deve redirecionar (ex: pending_approval)
  if (!isValid) {
    return <AuthStatusHandler reason={reason}>{null}</AuthStatusHandler>;
  }

  // Se está autenticado e ativo, verificar roles
  return (
    <RoleGuard requiredRole={requiredRole} allowedRoles={allowedRoles}>
      {children}
    </RoleGuard>
  );
}
