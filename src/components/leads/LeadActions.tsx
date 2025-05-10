
import { Lead } from '@/types/lead';
import { toast } from 'sonner';

export function useLeadActions() {
  const handleAgendar = (lead: Lead) => {
    toast.info(`Agendamento para ${lead.name} será implementado em breve`);
  };

  const handleContatar = (lead: Lead) => {
    toast.info(`Contato para ${lead.name} será implementado em breve`);
  };

  const handleConverter = (lead: Lead) => {
    toast.info(`Conversão do lead ${lead.name} para cliente será implementada em breve`);
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
