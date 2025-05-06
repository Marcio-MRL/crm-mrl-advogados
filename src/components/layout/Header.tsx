
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Calendar,
  Search, 
  User
} from 'lucide-react';
import { Input } from "@/components/ui/input";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="w-full glass-card mb-6 rounded-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4">
        <div>
          <h1 className="text-2xl font-semibold text-lawblue-800">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="pl-8 w-full md:w-[200px] lg:w-[300px] bg-white/70 border-lawblue-200"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="text-gray-600">
            <Calendar size={18} />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-gray-600 relative">
            <Bell size={18} />
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
          </Button>
          
          <Button variant="ghost" size="icon" className="text-gray-600">
            <User size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}
