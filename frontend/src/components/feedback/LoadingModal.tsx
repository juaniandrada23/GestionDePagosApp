import React from 'react';
import { createPortal } from 'react-dom';
import { Spinner } from '@/components/shared/Modal';

interface LoadingModalProps {
  open: boolean;
  text?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ open, text = 'Cargando...' }) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white px-8 py-6 rounded-2xl shadow-xl flex flex-col items-center gap-3 animate-modal-in">
        <Spinner className="h-8 w-8 text-primary-500" />
        <p className="text-sm font-medium text-gray-600">{text}</p>
      </div>
    </div>,
    document.body,
  );
};

export default LoadingModal;
