
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Leads from "./pages/Leads";
import Clients from "./pages/Clients";
import NotFound from "./pages/NotFound";
import Processos from "./pages/Processos";
import Contratos from "./pages/Contratos";
import Pareceres from "./pages/Pareceres";
import Financeiro from "./pages/Financeiro";
import Agenda from "./pages/Agenda";
import Documentos from "./pages/Documentos";
import Checklists from "./pages/Checklists";
import Relatorios from "./pages/Relatorios";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<MainLayout><Index /></MainLayout>} />
            <Route path="/leads" element={<MainLayout><Leads /></MainLayout>} />
            <Route path="/clientes" element={<MainLayout><Clients /></MainLayout>} />
            <Route path="/processos" element={<MainLayout><Processos /></MainLayout>} />
            <Route path="/contratos" element={<MainLayout><Contratos /></MainLayout>} />
            <Route path="/pareceres" element={<MainLayout><Pareceres /></MainLayout>} />
            <Route path="/financeiro" element={<MainLayout><Financeiro /></MainLayout>} />
            <Route path="/agenda" element={<MainLayout><Agenda /></MainLayout>} />
            <Route path="/documentos" element={<MainLayout><Documentos /></MainLayout>} />
            <Route path="/checklists" element={<MainLayout><Checklists /></MainLayout>} />
            <Route path="/relatorios" element={<MainLayout><Relatorios /></MainLayout>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
