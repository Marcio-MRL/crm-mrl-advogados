
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface BankSyncProgressProps {
  syncInProgress: boolean;
  syncProgress: number;
}

export function BankSyncProgress({ syncInProgress, syncProgress }: BankSyncProgressProps) {
  if (!syncInProgress) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Sincronizando...</span>
        <span className="text-sm text-gray-500">{syncProgress}%</span>
      </div>
      <Progress value={syncProgress} className="w-full" />
    </div>
  );
}
