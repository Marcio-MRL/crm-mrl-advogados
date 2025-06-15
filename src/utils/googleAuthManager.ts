
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const tokenCache = new Map<string, { token: string; expires: number }>();
const CACHE_DURATION_MS = 4 * 60 * 1000;

type GoogleService = 'calendar' | 'sheets' | 'drive';

export async function getValidAccessToken(service: GoogleService): Promise<string> {
  const cached = tokenCache.get(service);
  if (cached && cached.expires > Date.now()) {
    console.log(`[Cache HIT] Using cached token for ${service}.`);
    return cached.token;
  }
  console.log(`[Cache MISS] No valid cached token for ${service}.`);

  console.log(`Invoking 'refresh-google-token' for ${service}...`);
  const { data, error } = await supabase.functions.invoke('refresh-google-token', {
    body: { service },
  });

  if (error) {
    console.error(`Error refreshing token for ${service}:`, error.message);
    toast.error(`Erro de autenticação com ${service}: ${error.message}`);
    tokenCache.delete(service);
    throw new Error(`Failed to get a valid token for ${service}.`);
  }

  const { access_token } = data;

  if (!access_token || typeof access_token !== 'string') {
    console.error('Invalid response from refresh-google-token function');
    toast.error(`Resposta inválida do serviço de autenticação.`);
    throw new Error('Invalid token response from server.');
  }

  tokenCache.set(service, {
    token: access_token,
    expires: Date.now() + CACHE_DURATION_MS,
  });
  console.log(`[Cache SET] Token for ${service} cached.`);
  
  return access_token;
}
