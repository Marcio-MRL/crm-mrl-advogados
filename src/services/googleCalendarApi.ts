
import { getValidAccessToken } from '@/utils/googleAuthManager';

const API_BASE_URL = 'https://www.googleapis.com/calendar/v3';

async function getHeaders() {
  const accessToken = await getValidAccessToken('calendar');
  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
}

export async function fetchGoogleEvents() {
  const headers = await getHeaders();
  const response = await fetch(`${API_BASE_URL}/calendars/primary/events?maxResults=50`, { headers });
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('Google Calendar API error (fetchEvents):', errorData);
    throw new Error('Erro ao buscar eventos do Google Calendar.');
  }

  const eventData = await response.json();
  return eventData.items || [];
}

export async function createGoogleEvent(event: any) {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/calendars/primary/events`, {
      method: 'POST',
      headers,
      body: JSON.stringify(event),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Google Calendar API error on export:', errorData);
        throw new Error('Erro ao exportar evento para o Google Calendar.');
    }
    
    return await response.json();
}
