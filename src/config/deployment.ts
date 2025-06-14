
// Configurações específicas para deployment
export const deploymentConfig = {
  // URLs base para diferentes ambientes
  production: {
    url: 'https://crm.mrladvogados.com.br',
    supabase: {
      url: 'https://ncficjpokmmsugykmtdu.supabase.co',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZmljanBva21tc3VneWttdGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzY3NjQsImV4cCI6MjA2MjExMjc2NH0.qibulCIaQ-eLTJH3L-Z5nsfBGVj-CGlQsYCY3--uWOs'
    }
  },
  development: {
    url: 'http://localhost:8080',
    supabase: {
      url: 'https://ncficjpokmmsugykmtdu.supabase.co',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZmljanBva21tc3VneWttdGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzY3NjQsImV4cCI6MjA2MjExMjc2NH0.qibulCIaQ-eLTJH3L-Z5nsfBGVj-CGlQsYCY3--uWOs'
    }
  }
};

// Detecta ambiente atual
export const getCurrentEnvironment = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    }
  }
  return 'production';
};

// Retorna configuração do ambiente atual
export const getConfig = () => {
  const env = getCurrentEnvironment();
  return deploymentConfig[env];
};

// Utilitários para URLs
export const buildUrl = (path: string) => {
  const config = getConfig();
  return `${config.url}${path}`;
};

// Flag para desenvolvimento
export const isDevelopment = getCurrentEnvironment() === 'development';
export const isProduction = getCurrentEnvironment() === 'production';
