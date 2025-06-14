
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Tarefas from "./pages/Tarefas";
import Clients from "./pages/Clients";
import Leads from "./pages/Leads";
import Processos from "./pages/Processos";
import Contratos from "./pages/Contratos";
import Documentos from "./pages/Documentos";
import Checklists from "./pages/Checklists";
import Pareceres from "./pages/Pareceres";
import Financeiro from "./pages/Financeiro";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/tarefas" element={<Tarefas />} />
            <Route path="/clientes" element={<Clients />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/processos" element={<Processos />} />
            <Route path="/contratos" element={<Contratos />} />
            <Route path="/documentos" element={<Documentos />} />
            <Route path="/checklists" element={<Checklists />} />
            <Route path="/pareceres" element={<Pareceres />} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
