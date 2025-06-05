
import { Event } from '@/types/event';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Audiência Inicial',
    description: 'Audiência de conciliação processo 123456',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    location: 'Fórum Central',
    client: 'João Silva',
    type: 'audiencia',
    participants: ['joao@email.com'],
    syncWithGoogle: true
  },
  {
    id: '2',
    title: 'Reunião com Cliente',
    description: 'Discussão sobre contrato',
    date: new Date(Date.now() + 86400000), // Amanhã
    startTime: '14:00',
    endTime: '15:30',
    location: 'Escritório',
    client: 'Maria Santos',
    type: 'reuniao',
    participants: ['maria@email.com'],
    syncWithGoogle: true
  }
];
