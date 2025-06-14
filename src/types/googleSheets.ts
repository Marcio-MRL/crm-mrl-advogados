
export interface SheetMapping {
  id: string;
  name: string;
  url: string;
  lastSync: string;
  status: 'connected' | 'error' | 'syncing';
  type: 'financial' | 'clients' | 'processes';
}
