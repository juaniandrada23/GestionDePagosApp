import React, { type ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import { BTN_CANCEL, BTN_PRIMARY } from '@/config/constants';

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
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{ sx: { borderRadius: '16px', maxWidth, width: '100%', overflow: 'hidden' } }}
  >
    <div className="px-6 pt-6 pb-1 flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-[#006989]/10">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="px-6 pt-4 pb-6 space-y-4"
    >
      {children}
      <div className="flex items-center justify-end gap-3 pt-1">
        <button type="button" onClick={onClose} className={BTN_CANCEL}>
          Cancelar
        </button>
        <button type="submit" disabled={isLoading} className={BTN_PRIMARY}>
          {isLoading ? <CircularProgress size={16} color="inherit" /> : null}
          {submitLabel}
        </button>
      </div>
    </form>
  </Dialog>
);

export default FormDialog;
