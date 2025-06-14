
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    // Verificar domínio autorizado
    if (!user.email?.endsWith('@mrladvogados.com.br')) {
      throw new Error('OAuth disponível apenas para usuários @mrladvogados.com.br');
    }

    if (req.method === 'GET') {
      const clientId = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID');
      
      if (!clientId) {
        return new Response(
          JSON.stringify({ 
            error: 'OAuth não configurado',
            configured: false 
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          client_id: clientId,
          configured: true
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    throw new Error('Method not allowed');

  } catch (error) {
    console.error('Error in google-oauth-config function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        configured: false
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
