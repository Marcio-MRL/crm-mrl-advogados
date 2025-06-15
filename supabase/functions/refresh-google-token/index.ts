
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RefreshRequest {
  service: 'calendar' | 'sheets' | 'drive';
}

const serviceScopes = {
  calendar: 'https://www.googleapis.com/auth/calendar',
  sheets: 'https://www.googleapis.com/auth/spreadsheets',
  drive: 'https://www.googleapis.com/auth/drive.file',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );
    
    const anonClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Authorization header required');

    const { data: { user }, error: authError } = await anonClient.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) throw new Error('User not authenticated');
    
    console.log(`User ${user.id} requesting token refresh.`);

    const { service }: RefreshRequest = await req.json();
    const requiredScope = serviceScopes[service];

    const { data: tokenData, error: tokenError } = await supabaseClient
      .from('google_oauth_tokens')
      .select('id, access_token, refresh_token, expires_at, scope')
      .eq('user_id', user.id)
      .like('scope', `%${requiredScope}%`)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (tokenError || !tokenData) {
      console.error('Token fetch error:', tokenError);
      throw new Error(`Nenhum token encontrado para o serviço ${service}. Por favor, conecte novamente.`);
    }

    const expiresAt = new Date(tokenData.expires_at).getTime();
    const buffer = 5 * 60 * 1000;
    const isExpired = expiresAt < (Date.now() + buffer);

    if (!isExpired) {
      console.log(`Token for ${service} is still valid.`);
      return new Response(JSON.stringify({ access_token: tokenData.access_token }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Token for ${service} expired. Refreshing...`);

    if (!tokenData.refresh_token) {
      throw new Error(`Token de atualização não encontrado para ${service}. Por favor, reconecte a conta.`);
    }

    const { data: configData, error: configError } = await supabaseClient
      .from('google_oauth_configs')
      .select('client_id, client_secret')
      .eq('user_id', user.id)
      .eq('service_type', service)
      .single();

    if (configError || !configData) {
      console.error('Config fetch error:', configError);
      throw new Error(`Credenciais OAuth não configuradas para ${service}.`);
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: configData.client_id,
        client_secret: configData.client_secret,
        refresh_token: tokenData.refresh_token,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error('Google refresh error:', errorBody);
        if (errorBody.error === 'invalid_grant') {
             await supabaseClient.from('google_oauth_tokens').delete().eq('id', tokenData.id);
             throw new Error('Acesso revogado. Por favor, conecte novamente a sua conta Google.');
        }
        throw new Error('Falha ao atualizar o token de acesso do Google.');
    }

    const newTokens = await response.json();
    const newExpiresAt = new Date(Date.now() + newTokens.expires_in * 1000).toISOString();

    const { error: updateError } = await supabaseClient
      .from('google_oauth_tokens')
      .update({
        access_token: newTokens.access_token,
        expires_at: newExpiresAt,
      })
      .eq('id', tokenData.id);

    if (updateError) {
      console.error('Token update error:', updateError);
      throw new Error('Falha ao salvar o novo token de acesso.');
    }
    
    console.log(`Token for ${service} refreshed and updated successfully.`);

    return new Response(JSON.stringify({ access_token: newTokens.access_token }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in refresh-google-token function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
