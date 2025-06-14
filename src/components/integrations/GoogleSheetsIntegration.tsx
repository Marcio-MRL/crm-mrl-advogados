
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

export function GoogleSheetsIntegration() {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const { tokens } = useGoogleOAuth();
  const {
    isConnected,
    sheets,
    handleConnect,
    handleDisconnect,
    handleSync,
    handleAddSheet
  } = useGoogleSheetsIntegration();

  // Verificar se há tokens válidos do Google Sheets
  const hasValidToken = tokens.some(token => 
    token.scope?.includes('spreadsheets') || token.scope?.includes('drive')
  );

  const effectivelyConnected = isConnected || hasValidToken;

  return (
    <div className="space-y-6">
      {/* Integração Bancária BTG - Seção Principal */}
      <BankIntegrationSection />
      
      {/* Outras Planilhas Google Sheets */}
      <Card>
        <GoogleSheetsHeader isConnected={effectivelyConnected} />
        
        <CardContent>
          {!effectivelyConnected ? (
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
