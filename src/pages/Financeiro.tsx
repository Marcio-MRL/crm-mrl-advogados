
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';

export default function Financeiro() {
  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header title="Financeiro" subtitle="Gestão financeira e fluxo de caixa do escritório" />
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Controle Financeiro</h2>
          <p className="text-gray-600">Esta página está em desenvolvimento.</p>
        </div>
      </div>
    </MainLayout>
  );
}
