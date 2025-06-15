
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BankIntegrationSection } from './BankIntegrationSection';
import { GoogleSheetsHeader } from './googleSheets/GoogleSheetsHeader';
import { GoogleSheetsConnectionPrompt } from './googleSheets/GoogleSheetsConnectionPrompt';
import { GoogleSheetsToolbar } from './googleSheets/GoogleSheetsToolbar';
import { GoogleSheetsList } from './googleSheets/GoogleSheetsList';
import { AddSheetModal } from './googleSheets/AddSheetModal';
import { useGoogleSheetsIntegration } from '@/hooks/useGoogleSheetsIntegration';
import { useGoogleOAuth } from '@/hooks/useGoogleOAuth';
import { Skeleton } from '@/components/ui/skeleton';

export function GoogleSheetsIntegration() {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const { tokens } = useGoogleOAuth();
  const {
    isConnected,
    sheets,
    loading,
    handleDisconnect,
    handleSync,
    handleAddSheet,
    handleDeleteSheet
  } = useGoogleSheetsIntegration();

  // Verificar se há tokens válidos do Google Sheets
  const hasValidToken = tokens.some(token => 
    token.scope?.includes('spreadsheets') || token.scope?.includes('drive')
  );

  const effectivelyConnected = isConnected || hasValidToken;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4 p-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      );
    }

    if (!effectivelyConnected) {
      return <GoogleSheetsConnectionPrompt onConnect={() => setIsConfigModalOpen(true)} />;
    }

    return (
      <div className="space-y-4">
        <GoogleSheetsToolbar 
          sheetsCount={sheets.length}
          onAddSheet={() => setIsConfigModalOpen(true)}
          onDisconnect={handleDisconnect}
        />
        <GoogleSheetsList 
          sheets={sheets} 
          onSync={handleSync} 
          onDelete={handleDeleteSheet} 
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Integração Bancária BTG - Seção Principal */}
      <BankIntegrationSection />
      
      {/* Outras Planilhas Google Sheets */}
      <Card>
        <GoogleSheetsHeader isConnected={effectivelyConnected} />
        
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>

      {/* Modal de Configuração */}
      <AddSheetModal
        open={isConfigModalOpen}
        onOpenChange={setIsConfigModalOpen}
        onAddSheet={handleAddSheet}
      />
    </div>
  );
}
