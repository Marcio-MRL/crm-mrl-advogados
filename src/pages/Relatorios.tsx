
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';

export default function Relatorios() {
  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header title="Relatórios" subtitle="Relatórios e análises do escritório" />
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Relatórios Gerenciais</h2>
          <p className="text-gray-600">Esta página está em desenvolvimento.</p>
        </div>
      </div>
    </MainLayout>
  );
}
