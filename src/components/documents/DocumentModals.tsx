
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { GoogleDriveUploadForm } from './GoogleDriveUploadForm';
import type { DocumentMetadata } from '@/hooks/useGoogleDrive';

interface DocumentModalsProps {
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
  documentToDelete: DocumentMetadata | null;
  onUploadSuccess: () => void;
  onConfirmDelete: () => void;
}

export function DocumentModals({
  isUploadModalOpen,
  setIsUploadModalOpen,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  documentToDelete,
  onUploadSuccess,
  onConfirmDelete
}: DocumentModalsProps) {
  return (
    <>
      {/* Modal de Upload */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload de Documento para Google Drive</DialogTitle>
          </DialogHeader>
          <GoogleDriveUploadForm onSuccess={onUploadSuccess} />
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Documento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o documento "{documentToDelete?.name}"? 
              Esta ação é irreversível e o arquivo será removido do Google Drive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
