
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Globe, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface GoogleAuthButtonProps {
  service: 'calendar' | 'sheets';
  onSuccess?: () => void;
}

export function GoogleAuthButton({ service, onSuccess }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  const serviceNames = {
    calendar: "Google Calendar",
    sheets: "Google Sheets"
  };
  
  const serviceName = serviceNames[service];
  
  const handleAuth = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para conectar ao Google");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Em um cenário real, isso usaria a OAuth 2.0 do Google
      // Para fins de demonstração, simulamos uma conexão bem-sucedida após 1 segundo
      setTimeout(() => {
        // Simulação de salvar a integração no banco de dados
        const saveIntegration = async () => {
          try {
            const { error } = await supabase.from('integrations').insert({
              user_id: user.id,
              service_name: service,
              is_connected: true,
              last_synced: new Date().toISOString()
            });
            
            if (error) throw error;
            
            toast.success(`Conectado com ${serviceName} com sucesso!`);
            onSuccess?.();
          } catch (err) {
            console.error("Erro ao salvar integração:", err);
            toast.error(`Erro ao conectar: ${(err as Error).message}`);
          }
        };
        
        saveIntegration();
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Erro ao autenticar com Google:", error);
      toast.error(`Falha ao conectar com ${serviceName}`);
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handleAuth} 
      disabled={isLoading} 
      variant="outline" 
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Globe className="h-4 w-4" />
      )}
      Conectar {serviceName}
    </Button>
  );
}
