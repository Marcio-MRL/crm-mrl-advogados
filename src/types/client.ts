
// Define the proper type aliases with literal values
export type ClientType = 'pessoa_fisica' | 'pessoa_juridica';
export type ClientStatus = 'ativo' | 'inativo';

export interface Client {
  id: string;
  name: string;
  document: string;
  type: ClientType;
  phone: string;
  email: string;
  sector: string;
  status: ClientStatus;
  processCount: number;
  contractCount: number;
}
