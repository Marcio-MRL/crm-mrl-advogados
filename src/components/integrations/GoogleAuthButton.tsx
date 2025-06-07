
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface GoogleAuthButtonProps {
  service: 'calendar' | 'sheets';
  onSuccess?: () => void;
}

export function GoogleAuthButton({ service, onSuccess }: GoogleAuthButtonProps) {
  const { user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para conectar com o Google");
      return;
    }

    setIsConnecting(true);
    
    try {
      // Implementação real do OAuth do Google seria feita aqui
      // Por enquanto, apenas mostra que a conexão não está implementada
      toast.error("Integração com Google ainda não implementada. Conecte suas credenciais OAuth.");
    } catch (error) {
      console.error('Error connecting to Google:', error);
      toast.error("Erro ao conectar com o Google");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button 
      onClick={handleConnect}
      disabled={isConnecting}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
    >
      {isConnecting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Conectando...
        </>
      ) : (
        `Conectar com Google ${service === 'calendar' ? 'Calendar' : 'Sheets'}`
      )}
    </Button>
  );
}
