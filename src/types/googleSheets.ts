
export interface SheetMapping {
  id: string;
  name: string;
  url: string;
  lastSync: string | null;
  status: 'connected' | 'error' | 'syncing';
  type: 'financial' | 'clients' | 'processes';
}
