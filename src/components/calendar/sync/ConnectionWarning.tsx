
import React from 'react';

interface ConnectionWarningProps {
  isConnected: boolean;
}

export function ConnectionWarning({ isConnected }: ConnectionWarningProps) {
  if (isConnected) return null;

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-sm text-yellow-800">
        ⚠️ Conecte-se ao Google Calendar na seção de integrações para habilitar a sincronização.
      </p>
    </div>
  );
}
