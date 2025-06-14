
export interface BankSheetData {
  headers: string[];
  rows: any[][];
}

export interface BankTransactionRaw {
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

export interface ProcessResult {
  success: boolean;
  newTransactions: number;
  totalProcessed: number;
  errors: string[];
}
