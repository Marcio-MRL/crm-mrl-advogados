
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Leads from "./pages/Leads";
import Clients from "./pages/Clients";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/leads" element={<MainLayout><Leads /></MainLayout>} />
          <Route path="/clientes" element={<MainLayout><Clients /></MainLayout>} />
          
          {/* Placeholder routes for future implementation */}
          <Route path="/processos" element={<MainLayout><NotFound /></MainLayout>} />
          <Route path="/contratos" element={<MainLayout><NotFound /></MainLayout>} />
          <Route path="/pareceres" element={<MainLayout><NotFound /></MainLayout>} />
          <Route path="/financeiro" element={<MainLayout><NotFound /></MainLayout>} />
          <Route path="/agenda" element={<MainLayout><NotFound /></MainLayout>} />
          <Route path="/documentos" element={<MainLayout><NotFound /></MainLayout>} />
          <Route path="/checklists" element={<MainLayout><NotFound /></MainLayout>} />
          <Route path="/relatorios" element={<MainLayout><NotFound /></MainLayout>} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
