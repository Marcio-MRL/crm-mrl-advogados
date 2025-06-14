
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useBankIntegration } from '@/hooks/useBankIntegration';
import { BankIntegrationHeader } from './bank/BankIntegrationHeader';
import { BankIntegrationInfo } from './bank/BankIntegrationInfo';
import { BankIntegrationStats } from './bank/BankIntegrationStats';
import { BankSyncProgress } from './bank/BankSyncProgress';
import { BankLastTransaction } from './bank/BankLastTransaction';
import { BankIntegrationActions } from './bank/BankIntegrationActions';
import { BankIntegrationInstructions } from './bank/BankIntegrationInstructions';

export function BankIntegrationSection() {
  const {
    status,
    syncProgress,
    sheetsToken,
    handleSync
  } = useBankIntegration();

  return (
    <Card>
      <BankIntegrationHeader isConnected={status.connected} />
      
      <CardContent className="space-y-6">
        <BankIntegrationInfo />
        
        <BankIntegrationStats status={status} />
        
        <BankSyncProgress 
          syncInProgress={status.syncInProgress} 
          syncProgress={syncProgress} 
        />
        
        <BankLastTransaction lastTransaction={status.lastTransaction} />
        
        <BankIntegrationActions 
          onSync={handleSync}
          hasToken={!!sheetsToken}
          syncInProgress={status.syncInProgress}
        />
        
        <BankIntegrationInstructions />
      </CardContent>
    </Card>
  );
}
