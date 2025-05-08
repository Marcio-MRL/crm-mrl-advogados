
// Define the proper type aliases with literal values
export type ClientType = 'pessoa_fisica' | 'pessoa_juridica';
export type ClientStatus = 'ativo' | 'inativo';

export interface Client {
  id: string;
  name: string;
  document?: string | null;
  type: ClientType;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  status: ClientStatus;
  notes?: string | null;
  user_id?: string | null;
  created_at?: string;
  updated_at?: string;
  
  // UI display properties that can be computed
  sector?: string;
  processCount?: number;
  contractCount?: number;
}
