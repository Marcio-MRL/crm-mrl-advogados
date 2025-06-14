
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Settings,
  Edit,
  Camera
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  const firstName = user?.user_metadata?.first_name || '';
  const lastName = user?.user_metadata?.last_name || '';
  const email = user?.email || '';
  
  const [editData, setEditData] = useState({
    firstName,
    lastName,
    phone: '',
    position: 'Advogado'
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Perfil atualizado com sucesso!");
  };

  const handleLogout = async () => {
    try {
      await signOut();
      onClose();
      navigate('/auth');
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  const handleGoToSettings = () => {
    onClose();
    navigate('/configuracoes');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil do Usuário
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar e informações básicas */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-lg">
                  {firstName.charAt(0)}{lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                {firstName} {lastName}
              </h3>
              <p className="text-sm text-gray-500">{email}</p>
              <Badge className="mt-2">{editData.position}</Badge>
            </div>
          </div>

          <Separator />

          {/* Informações detalhadas */}
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input
                      id="firstName"
                      value={editData.firstName}
                      onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input
                      id="lastName"
                      value={editData.lastName}
                      onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1 bg-lawblue-500 hover:bg-lawblue-600">
                    Salvar
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{email}</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{editData.phone || 'Não informado'}</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Membro desde {new Date(user?.created_at || '').toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Ações */}
          <div className="space-y-2">
            {!isEditing && (
              <Button 
                onClick={() => setIsEditing(true)} 
                variant="outline" 
                className="w-full justify-start"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Perfil
              </Button>
            )}
            
            <Button 
              onClick={handleGoToSettings} 
              variant="outline" 
              className="w-full justify-start"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Sair
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
