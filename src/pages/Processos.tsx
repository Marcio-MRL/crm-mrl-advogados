
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';

export default function Processos() {
  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header title="Processos" subtitle="Gestão de processos jurídicos" />
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Processos em Andamento</h2>
          <p className="text-gray-600">Esta página está em desenvolvimento.</p>
        </div>
      </div>
    </MainLayout>
  );
}
