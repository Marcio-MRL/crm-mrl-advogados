
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExportRequest {
  sheetId: string;
  dataType: 'clients' | 'processes' | 'financial' | 'calendar' | 'tasks';
  range?: string;
  clearExisting?: boolean;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function getValidAccessToken(): Promise<string> {
  const { data, error } = await supabase.functions.invoke('refresh-google-token', {
    body: { service: 'sheets' },
  });

  if (error) {
    console.error('Error getting access token:', error);
    throw new Error(`Failed to get valid token: ${error.message}`);
  }

  return data.access_token;
}

async function exportClientsData(userId: string, accessToken: string, sheetId: string, range: string) {
  console.log('Exporting clients data...');
  
  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;

  const headers = ['Nome', 'Tipo', 'Email', 'Telefone', 'Documento', 'Cidade', 'Estado', 'Status', 'Data Criação'];
  const rows = clients.map(client => [
    client.name || '',
    client.type || '',
    client.email || '',
    client.phone || '',
    client.document || '',
    client.city || '',
    client.state || '',
    client.status || '',
    new Date(client.created_at).toLocaleDateString('pt-BR')
  ]);

  const values = [headers, ...rows];
  return updateSheet(accessToken, sheetId, range, values);
}

async function exportProcessesData(userId: string, accessToken: string, sheetId: string, range: string) {
  console.log('Exporting processes data...');
  
  const { data: processes, error } = await supabase
    .from('processes')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;

  const headers = ['Título', 'Número do Processo', 'Cliente', 'Tipo', 'Status', 'Fórum', 'Responsável', 'Data Início'];
  const rows = processes.map(process => [
    process.title || '',
    process.process_number || '',
    process.client_name || '',
    process.process_type || '',
    process.status || '',
    process.forum || '',
    process.responsible || '',
    process.start_date ? new Date(process.start_date).toLocaleDateString('pt-BR') : ''
  ]);

  const values = [headers, ...rows];
  return updateSheet(accessToken, sheetId, range, values);
}

async function exportFinancialData(userId: string, accessToken: string, sheetId: string, range: string) {
  console.log('Exporting financial data...');
  
  const { data: transactions, error } = await supabase
    .from('bank_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('data', { ascending: false })
    .limit(1000);

  if (error) throw error;

  const headers = ['Data', 'Descrição', 'Valor', 'Tipo', 'Categoria', 'Documento', 'Pagador/Recebedor'];
  const rows = transactions.map(transaction => [
    new Date(transaction.data).toLocaleDateString('pt-BR'),
    transaction.descricao || '',
    transaction.valor ? parseFloat(transaction.valor.toString()).toFixed(2) : '0.00',
    transaction.credito_debito || '',
    transaction.categoria || '',
    transaction.documento || '',
    transaction.nome_pagador_recebedor || ''
  ]);

  const values = [headers, ...rows];
  return updateSheet(accessToken, sheetId, range, values);
}

async function exportCalendarData(userId: string, accessToken: string, sheetId: string, range: string) {
  console.log('Exporting calendar data...');
  
  const { data: events, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('user_id', userId)
    .order('start_time', { ascending: false });

  if (error) throw error;

  const headers = ['Título', 'Descrição', 'Data Início', 'Data Fim', 'Tipo', 'Local', 'Cliente', 'Sincronizado Google'];
  const rows = events.map(event => [
    event.title || '',
    event.description || '',
    new Date(event.start_time).toLocaleString('pt-BR'),
    new Date(event.end_time).toLocaleString('pt-BR'),
    event.type || '',
    event.location || '',
    event.client || '',
    event.sync_with_google ? 'Sim' : 'Não'
  ]);

  const values = [headers, ...rows];
  return updateSheet(accessToken, sheetId, range, values);
}

async function exportTasksData(userId: string, accessToken: string, sheetId: string, range: string) {
  console.log('Exporting tasks data...');
  
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const headers = ['Título', 'Descrição', 'Prioridade', 'Categoria', 'Status', 'Data Vencimento', 'Data Criação'];
  const rows = tasks.map(task => [
    task.title || '',
    task.description || '',
    task.priority || '',
    task.category || '',
    task.completed ? 'Concluída' : 'Pendente',
    task.due_date ? new Date(task.due_date).toLocaleDateString('pt-BR') : '',
    new Date(task.created_at).toLocaleDateString('pt-BR')
  ]);

  const values = [headers, ...rows];
  return updateSheet(accessToken, sheetId, range, values);
}

async function updateSheet(accessToken: string, sheetId: string, range: string, values: any[][]) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=RAW`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Sheets API error:', errorText);
    throw new Error(`Erro ao atualizar planilha: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication token');
    }

    const { sheetId, dataType, range = 'Sheet1!A1:Z1000', clearExisting = true }: ExportRequest = await req.json();

    console.log(`Starting export of ${dataType} data to sheet ${sheetId}`);

    const accessToken = await getValidAccessToken();
    
    let result;
    switch (dataType) {
      case 'clients':
        result = await exportClientsData(user.id, accessToken, sheetId, range);
        break;
      case 'processes':
        result = await exportProcessesData(user.id, accessToken, sheetId, range);
        break;
      case 'financial':
        result = await exportFinancialData(user.id, accessToken, sheetId, range);
        break;
      case 'calendar':
        result = await exportCalendarData(user.id, accessToken, sheetId, range);
        break;
      case 'tasks':
        result = await exportTasksData(user.id, accessToken, sheetId, range);
        break;
      default:
        throw new Error(`Tipo de dados não suportado: ${dataType}`);
    }

    console.log('Export completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        result,
        message: `Dados de ${dataType} exportados com sucesso!`
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in export-to-sheets function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error.stack 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
