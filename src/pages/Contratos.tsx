
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { ContratosList } from '@/components/contratos/ContratosList';

export default function Contratos() {
  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header title="Contratos" subtitle="Gestão de contratos e documentos jurídicos" />
        <ContratosList />
      </div>
    </MainLayout>
  );
}
