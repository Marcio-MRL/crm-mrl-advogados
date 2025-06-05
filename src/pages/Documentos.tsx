
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';

export default function Documentos() {
  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header title="Documentos" subtitle="Gestão de documentos do escritório" />
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Biblioteca de Documentos</h2>
          <p className="text-gray-600">Esta página está em desenvolvimento.</p>
        </div>
      </div>
    </MainLayout>
  );
}
