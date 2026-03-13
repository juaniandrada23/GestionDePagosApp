import React, { type ReactNode } from 'react';
import Modal from '@/components/shared/Modal';

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onSubmit: () => void;
  submitLabel?: string;
  isLoading?: boolean;
  maxWidth?: string;
  children: ReactNode;
}

const sizeMap: Record<string, 'sm' | 'md' | 'lg' | 'xl'> = {
  '440px': 'sm',
  '500px': 'md',
  '600px': 'lg',
  '700px': 'xl',
};

const FormDialog: React.FC<FormDialogProps> = ({
  open,
  onClose,
  icon,
  title,
  subtitle,
  onSubmit,
  submitLabel = 'Guardar',
  isLoading = false,
  maxWidth = '440px',
  children,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    size={sizeMap[maxWidth] || 'sm'}
    title={title}
    subtitle={subtitle}
    icon={icon}
    onSubmit={onSubmit}
    submitLabel={submitLabel}
    isLoading={isLoading}
  >
    {children}
  </Modal>
);

export default FormDialog;
