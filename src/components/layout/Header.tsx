
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Calendar,
  Search, 
  User
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { NotificationsModal } from '@/components/notifications/NotificationsModal';
import { UserProfileModal } from '@/components/user/UserProfileModal';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Get first name if available or use email username
  const firstName = user?.user_metadata?.first_name || 
                    (user?.email ? user.email.split('@')[0] : '');
  
  // Create personalized welcome message if title is "Visão Geral"
  const personalizedSubtitle = 
    title === "Visão Geral" 
      ? `${firstName}, bem-vindo ao CRM do MRL Advogados.`
      : subtitle;

  const handleCalendarClick = () => {
    navigate('/agenda');
  };

  const handleNotificationsClick = () => {
    setIsNotificationsOpen(true);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(true);
  };
  
  return (
    <>
      <header className="w-full glass-card mb-6 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-semibold text-lawblue-800">{title}</h1>
            {personalizedSubtitle && <p className="text-sm text-gray-500">{personalizedSubtitle}</p>}
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-grow md:flex-grow-0 max-w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Pesquisar..."
                className="pl-8 w-full md:w-[200px] lg:w-[300px] bg-white/70 border-lawblue-200"
              />
            </div>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600"
                onClick={handleCalendarClick}
                title="Ir para Agenda"
              >
                <Calendar size={18} />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600 relative"
                onClick={handleNotificationsClick}
                title="Notificações"
              >
                <Bell size={18} />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600"
                onClick={handleProfileClick}
                title="Perfil do Usuário"
              >
                <User size={18} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <NotificationsModal 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
      
      <UserProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />
    </>
  );
}
