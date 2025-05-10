
import React from 'react';
import { Button } from "@/components/ui/button";
import { FormModal } from '@/components/common/FormModal';
import { ChecklistForm } from '@/components/checklists/ChecklistForm';

interface ChecklistModalsProps {
  isModalOpen: boolean;
  closeModal: () => void;
  isFilterModalOpen: boolean;
  closeFilterModal: () => void;
  isTemplateModalOpen: boolean;
  closeTemplateModal: () => void;
  handleChecklistAdded: () => void;
}

export function ChecklistModals({
  isModalOpen,
  closeModal,
  isFilterModalOpen,
  closeFilterModal,
  isTemplateModalOpen,
  closeTemplateModal,
  handleChecklistAdded
}: ChecklistModalsProps) {
  return (
    <>
      <FormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Adicionar Novo Checklist"
      >
        <ChecklistForm onSuccess={handleChecklistAdded} onCancel={closeModal} />
      </FormModal>

      <FormModal
        isOpen={isFilterModalOpen}
        onClose={closeFilterModal}
        title="Filtros Avançados"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Funcionalidade de filtros avançados será implementada em breve.
          </p>
          <div className="flex justify-end">
            <Button onClick={closeFilterModal}>Fechar</Button>
          </div>
        </div>
      </FormModal>

      <FormModal
        isOpen={isTemplateModalOpen}
        onClose={closeTemplateModal}
        title="Gerenciar Modelos de Checklist"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Funcionalidade para gerenciar modelos de checklist será implementada em breve.
          </p>
          <div className="flex justify-end">
            <Button onClick={closeTemplateModal}>Fechar</Button>
          </div>
        </div>
      </FormModal>
    </>
  );
}
