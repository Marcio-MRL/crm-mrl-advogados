
import React from 'react';
import { FormModal } from '@/components/common/FormModal';
import { ClientForm } from '@/components/clients/ClientForm';
import { ProcessoForm } from '@/components/processos/ProcessoForm';
import { LeadForm } from '@/components/leads/LeadForm';

interface DashboardModalsProps {
  isClientModalOpen: boolean;
  isProcessModalOpen: boolean;
  isLeadModalOpen: boolean;
  closeClientModal: () => void;
  closeProcessModal: () => void;
  closeLeadModal: () => void;
  handleClientAdded: () => void;
  handleProcessAdded: () => void;
  handleLeadAdded: () => void;
}

export function DashboardModals({
  isClientModalOpen,
  isProcessModalOpen,
  isLeadModalOpen,
  closeClientModal,
  closeProcessModal,
  closeLeadModal,
  handleClientAdded,
  handleProcessAdded,
  handleLeadAdded
}: DashboardModalsProps) {
  return (
    <>
      {/* Client Form Modal */}
      <FormModal
        isOpen={isClientModalOpen}
        onClose={closeClientModal}
        title="Adicionar Novo Cliente"
      >
        <ClientForm onSuccess={handleClientAdded} onCancel={closeClientModal} />
      </FormModal>

      {/* Process Form Modal */}
      <FormModal
        isOpen={isProcessModalOpen}
        onClose={closeProcessModal}
        title="Adicionar Novo Processo"
      >
        <ProcessoForm onSuccess={handleProcessAdded} onCancel={closeProcessModal} />
      </FormModal>

      {/* Lead Form Modal */}
      <FormModal
        isOpen={isLeadModalOpen}
        onClose={closeLeadModal}
        title="Adicionar Novo Lead"
      >
        <LeadForm onSuccess={handleLeadAdded} onCancel={closeLeadModal} />
      </FormModal>
    </>
  );
}
