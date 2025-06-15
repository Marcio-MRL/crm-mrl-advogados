
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BankIntegrationHeader } from './bank/BankIntegrationHeader';
import { BankIntegrationInfo } from './bank/BankIntegrationInfo';
import { BankIntegrationInstructions } from './bank/BankIntegrationInstructions';
import { BankSheetSelector } from './bank/BankSheetSelector';
import { BankIntegrationActions } from './bank/BankIntegrationActions';
import { BankIntegrationStats } from './bank/BankIntegrationStats';
import { BankLastTransaction } from './bank/BankLastTransaction';
import { BankSyncProgress } from './bank/BankSyncProgress';
import { BankExportButton } from './bank/BankExportButton';
import { useBankIntegration } from '@/hooks/useBankIntegration';
import { useBankSheetSelection } from '@/hooks/useBankSheetSelection';

export function BankIntegrationSection() {
  const {
    isConnected,
    lastSync,
    syncInProgress,
    currentProgress,
    totalSteps,
    currentStep,
    transactionCount,
    lastTransaction,
    handleConnect,
    handleSync,
    handleDisconnect
  } = useBankIntegration();

  const {
    availableSheets,
    selectedSheetId,
    setSelectedSheetId,
    loading: sheetsLoading
  } = useBankSheetSelection();

  const renderContent = () => {
    if (!isConnected) {
      return (
        <div className="space-y-4">
          <BankIntegrationInfo />
          <BankIntegrationInstructions />
          <BankIntegrationActions 
            onConnect={handleConnect}
            onSync={handleSync}
            onDisconnect={handleDisconnect}
            syncInProgress={syncInProgress}
            isConnected={isConnected}
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <BankIntegrationStats 
          lastSync={lastSync}
          transactionCount={transactionCount}
        />
        
        {lastTransaction && (
          <BankLastTransaction transaction={lastTransaction} />
        )}

        <BankSheetSelector 
          availableSheets={availableSheets}
          selectedSheetId={selectedSheetId}
          onSheetSelect={setSelectedSheetId}
          loading={sheetsLoading}
        />

        {syncInProgress && (
          <BankSyncProgress 
            currentProgress={currentProgress}
            totalSteps={totalSteps}
            currentStep={currentStep}
          />
        )}

        <div className="flex justify-between items-center">
          <BankExportButton />
          <BankIntegrationActions 
            onConnect={handleConnect}
            onSync={handleSync}
            onDisconnect={handleDisconnect}
            syncInProgress={syncInProgress}
            isConnected={isConnected}
            selectedSheetId={selectedSheetId}
          />
        </div>
      </div>
    );
  };

  return (
    <Card>
      <BankIntegrationHeader isConnected={isConnected} />
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
