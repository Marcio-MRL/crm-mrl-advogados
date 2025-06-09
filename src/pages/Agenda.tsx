
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { AgendaTabs } from '@/components/agenda/AgendaTabs';
import { AgendaHeader } from '@/components/agenda/AgendaHeader';
import { AgendaIntegrationsSection } from '@/components/agenda/AgendaIntegrationsSection';
import { GoogleOAuthSection } from '@/components/integrations/GoogleOAuthSection';

export default function Agenda() {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <MainLayout>
      <div className="w-full space-y-6">
        <Header title="Agenda" subtitle="Gerencie seus compromissos e eventos" />
        
        <AgendaHeader 
          currentDate={currentDate} 
          onDateChange={setCurrentDate} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AgendaTabs currentDate={currentDate} />
          </div>
          
          <div className="space-y-6">
            <AgendaIntegrationsSection />
            <GoogleOAuthSection />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
