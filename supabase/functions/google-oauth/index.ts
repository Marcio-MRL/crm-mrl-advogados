
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OAuthRequest {
  code: string;
  service: 'calendar' | 'sheets' | 'drive';
  redirectUri: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Usar service role key para ter permissões administrativas
    );

    // Verificar autenticação usando o token do header Authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    // Criar cliente com anon key para verificar o usuário
    const anonClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await anonClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      console.error('Auth error:', authError);
      throw new Error('User not authenticated');
    }

    console.log('Authenticated user:', user.email);

    // Verificar domínio autorizado
    if (!user.email?.endsWith('@mrladvogados.com.br')) {
      throw new Error('OAuth disponível apenas para usuários @mrladvogados.com.br');
    }

    if (req.method === 'POST') {
      const { code, service, redirectUri }: OAuthRequest = await req.json();
      console.log('Processing OAuth callback for service:', service);

      // Buscar credenciais OAuth configuradas
      const { data: configData, error: configError } = await supabaseClient
        .from('google_oauth_configs')
        .select('client_id, client_secret')
        .eq('user_id', user.id)
        .eq('service_type', service)
        .single();

      if (configError || !configData) {
        console.error('Config error:', configError);
        throw new Error('Credenciais OAuth não configuradas para este serviço');
      }

      const { client_id: clientId, client_secret: clientSecret } = configData;

      // Trocar código por tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.text();
        console.error('Token exchange failed:', errorData);
        throw new Error('Falha na troca de tokens OAuth');
      }

      const tokens: TokenResponse = await tokenResponse.json();
      console.log('Tokens received successfully');

      // Calcular data de expiração
      const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

      // Armazenar tokens no banco usando service role key
      const { data: insertData, error: insertError } = await supabaseClient
        .from('google_oauth_tokens')
        .upsert({
          user_id: user.id,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_type: tokens.token_type,
          expires_at: expiresAt.toISOString(),
          scope: tokens.scope,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error storing tokens:', insertError);
        throw new Error('Erro ao armazenar tokens');
      }

      console.log('Tokens stored successfully:', insertData);

      // Registrar log de acesso
      await supabaseClient
        .from('access_logs')
        .insert({
          user_id: user.id,
          email: user.email,
          action: 'google_oauth_connected',
          details: { service, scope: tokens.scope },
        });

      return new Response(
        JSON.stringify({ 
          success: true, 
          service,
          scope: tokens.scope,
          expiresAt: expiresAt.toISOString()
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (req.method === 'DELETE') {
      const { tokenId } = await req.json();

      if (!tokenId) {
        throw new Error('Token ID required');
      }

      // Buscar token antes de revogar
      const { data: tokenData } = await supabaseClient
        .from('google_oauth_tokens')
        .select('access_token')
        .eq('id', tokenId)
        .eq('user_id', user.id)
        .single();

      // Revogar token no Google se existir
      if (tokenData?.access_token) {
        try {
          await fetch(`https://oauth2.googleapis.com/revoke?token=${tokenData.access_token}`, {
            method: 'POST',
          });
        } catch (error) {
          console.warn('Failed to revoke token on Google:', error);
        }
      }

      // Remover token do banco
      const { error: deleteError } = await supabaseClient
        .from('google_oauth_tokens')
        .delete()
        .eq('id', tokenId)
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Error deleting token:', deleteError);
        throw new Error('Erro ao revogar token');
      }

      // Registrar log
      await supabaseClient
        .from('access_logs')
        .insert({
          user_id: user.id,
          email: user.email,
          action: 'google_oauth_revoked',
          details: { token_id: tokenId },
        });

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    throw new Error('Method not allowed');

  } catch (error) {
    console.error('Error in google-oauth function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
