
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogoutButton } from './LogoutButton';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Activity, 
  Users, 
  FileText, 
  Search, 
  Calendar, 
  FileArchive, 
  ClipboardList, 
  BarChart2, 
  DollarSign, 
  Book, 
  Gavel, 
  ArrowRight,
  ArrowLeft,
  Plus,
  User,
  Settings
} from 'lucide-react';

const menuItems = [
  { icon: Activity, name: 'Dashboard', path: '/' },
  { icon: Users, name: 'Leads', path: '/leads' },
  { icon: Users, name: 'Clientes', path: '/clientes' },
  { icon: Gavel, name: 'Processos', path: '/processos' },
  { icon: FileText, name: 'Contratos', path: '/contratos' },
  { icon: Book, name: 'Pareceres', path: '/pareceres' },
  { icon: DollarSign, name: 'Financeiro', path: '/financeiro' },
  { icon: Calendar, name: 'Agenda', path: '/agenda' },
  { icon: FileArchive, name: 'Documentos', path: '/documentos' },
  { icon: ClipboardList, name: 'Checklists', path: '/checklists' },
  { icon: BarChart2, name: 'Relatórios', path: '/relatorios' },
  { icon: Settings, name: 'Configurações', path: '/configuracoes' }
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  // Extract first name if user exists
  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || '';
  const email = user?.email || '';
  
  return (
    <div 
      className={cn(
        'fixed left-0 top-0 h-full bg-sidebar transition-all duration-300 shadow-lg border-r border-lawblue-700/20 z-40',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed ? (
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/27ce3e50-3cad-44f4-a295-b4890ec2ce52.png" 
              alt="MRL Advogados" 
              className="h-8 mr-2"
            />
            <div className="text-white font-semibold text-lg">MRL Advogados</div>
          </div>
        ) : (
          <img 
            src="/lovable-uploads/27ce3e50-3cad-44f4-a295-b4890ec2ce52.png" 
            alt="MRL Advogados" 
            className="h-8 mx-auto" 
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:bg-sidebar-accent"
        >
          {collapsed ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        </Button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 h-[calc(100vh-180px)]">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link 
                to={item.path} 
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent group transition-colors",
                  location.pathname === item.path && "bg-sidebar-accent/50"
                )}
              >
                <item.icon className="w-5 h-5 mr-3 text-lawblue-300" />
                {!collapsed && <span>{item.name}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-lawblue-700 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User Profile Section */}
      <div className="p-4 border-t border-sidebar-border mt-auto">
        {!collapsed ? (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2 mb-2">
              <div className="bg-lawblue-300 rounded-full w-8 h-8 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{firstName}</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">{email}</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-lawblue-300 rounded-full w-8 h-8 flex items-center justify-center group relative">
              <User size={16} className="text-white" />
              <div className="absolute left-full ml-2 px-2 py-1 bg-lawblue-700 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-50">
                {firstName}<br />{email}
              </div>
            </div>
            <LogoutButton />
          </div>
        )}
      </div>
    </div>
  );
}
