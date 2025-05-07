
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";

export function LogoutButton() {
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar sair",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Sair</span>
    </Button>
  );
}
