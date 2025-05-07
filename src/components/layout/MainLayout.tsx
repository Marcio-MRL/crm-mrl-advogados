
import React, { ReactNode } from 'react';
import { Sidebar } from '@/components/sidebar/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto ml-16 md:ml-64 transition-all">
        {children}
      </main>
    </div>
  );
}
