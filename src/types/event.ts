
export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  startTime: string;
  endTime: string;
  location: string | null;
  client?: string | null;
  type: 'audiencia' | 'reuniao' | 'prazo' | 'outro';
  participants: string[] | null;
  syncWithGoogle: boolean;
}
