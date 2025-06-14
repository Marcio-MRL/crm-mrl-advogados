
import React, { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface MainLayoutProps {
  children: ReactNode;
  requiredRole?: 'master' | 'admin' | 'advogado' | 'leitor';
  allowedRoles?: ('master' | 'admin' | 'advogado' | 'leitor')[];
}

export function MainLayout({ children, requiredRole, allowedRoles }: MainLayoutProps) {
  return (
    <ProtectedRoute requiredRole={requiredRole} allowedRoles={allowedRoles}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto ml-16 md:ml-64 transition-all">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
