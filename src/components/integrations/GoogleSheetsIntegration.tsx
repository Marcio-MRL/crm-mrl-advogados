
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BankIntegrationSection } from './BankIntegrationSection';
import { GoogleSheetsHeader } from './googleSheets/GoogleSheetsHeader';
import { GoogleSheetsConnectionPrompt } from './googleSheets/GoogleSheetsConnectionPrompt';
import { GoogleSheetsToolbar } from './googleSheets/GoogleSheetsToolbar';
import { GoogleSheetsList } from './googleSheets/GoogleSheetsList';
import { AddSheetModal } from './googleSheets/AddSheetModal';
import { useGoogleSheetsIntegration } from '@/hooks/useGoogleSheetsIntegration';

export function GoogleSheetsIntegration() {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const {
    isConnected,
    sheets,
    handleConnect,
    handleDisconnect,
    handleSync,
    handleAddSheet
  } = useGoogleSheetsIntegration();

  return (
    <div className="space-y-6">
      {/* Integração Bancária BTG - Seção Principal */}
      <BankIntegrationSection />
      
      {/* Outras Planilhas Google Sheets */}
      <Card>
        <GoogleSheetsHeader isConnected={isConnected} />
        
        <CardContent>
          {!isConnected ? (
            <GoogleSheetsConnectionPrompt onConnect={handleConnect} />
          ) : (
            <div className="space-y-4">
              <GoogleSheetsToolbar 
                sheetsCount={sheets.length}
                onAddSheet={() => setIsConfigModalOpen(true)}
                onDisconnect={handleDisconnect}
              />

              <GoogleSheetsList sheets={sheets} onSync={handleSync} />
            </div>
          )}
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
