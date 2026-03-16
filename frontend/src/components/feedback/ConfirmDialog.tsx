import React from 'react';
import { MdWarningAmber } from 'react-icons/md';
import Modal from '@/components/shared/Modal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  destructive = false,
}) => (
  <Modal
    open={open}
    onClose={onCancel}
    title={title}
    subtitle={message}
    icon={
      <MdWarningAmber className={`text-xl ${destructive ? 'text-red-500' : 'text-primary-500'}`} />
    }
    onSubmit={onConfirm}
    submitLabel={confirmText}
    cancelLabel={cancelText}
    isLoading={loading}
    destructive={destructive}
  />
);

export default ConfirmDialog;
