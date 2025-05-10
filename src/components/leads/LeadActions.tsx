
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

export function useLeadActions() {
  const handleAgendar = (lead: Lead) => {
    toast.success(`Agendamento para ${lead.name} iniciado`);
    // Aqui poderia abrir um modal de agendamento ou redirecionar para a página de agenda
  };

  const handleContatar = (lead: Lead) => {
    toast.success(`Contato iniciado com ${lead.name}`);
    // Aqui poderia abrir um modal de envio de mensagem ou de registro de contato
  };

  const handleConverter = (lead: Lead) => {
    toast.success(`Iniciando processo de conversão de ${lead.name} para cliente`);
    // Aqui poderia abrir o formulário de cliente pré-preenchido com os dados do lead
  };

  const handleLeadAction = (lead: Lead, action: string) => {
    switch(action) {
      case 'agendar':
        handleAgendar(lead);
        break;
      case 'contatar':
        handleContatar(lead);
        break;
      case 'converter':
        handleConverter(lead);
        break;
      default:
        break;
    }
  };

  return {
    handleLeadAction,
    handleAgendar,
    handleContatar,
    handleConverter
  };
}
