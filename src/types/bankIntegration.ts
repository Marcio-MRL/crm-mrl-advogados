
export interface BankTransaction {
  id: string;
  data: string;
  credito_debito: 'Crédito' | 'Débito';
  valor: number;
  descricao: string;
  mensagem?: string;
  documento?: string;
  pagador_recebedor?: string;
  nome_pagador_recebedor?: string;
  banco_pagador_recebedor?: string;
  agencia_pagador_recebedor?: string;
  conta_pagador_recebedor?: string;
  identificador?: string;
  raw_data?: any;
}

export interface BankIntegrationStatus {
  connected: boolean;
  lastSync: string | null;
  totalTransactions: number;
  lastTransaction: BankTransaction | null;
  syncInProgress: boolean;
}

export interface BankSyncResult {
  success: boolean;
  newTransactions: number;
  totalProcessed: number;
  errors: string[];
  lastSyncDate: string;
}
