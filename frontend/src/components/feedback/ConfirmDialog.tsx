import React from 'react';
import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import { MdWarningAmber } from 'react-icons/md';

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
  <Dialog
    open={open}
    onClose={onCancel}
    PaperProps={{
      sx: { borderRadius: '16px', maxWidth: '440px', width: '100%', overflow: 'hidden' },
    }}
  >
    <div className="px-6 pt-6 pb-1 flex items-start gap-3">
      <div
        className={`mt-0.5 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          destructive ? 'bg-red-50' : 'bg-[#006989]/10'
        }`}
      >
        <MdWarningAmber className={`text-xl ${destructive ? 'text-red-500' : 'text-[#006989]'}`} />
      </div>
      <div>
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{message}</p>
      </div>
    </div>
    <div className="flex items-center justify-end gap-3 px-6 py-4 mt-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        {cancelText}
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${
          destructive ? 'bg-red-600 hover:bg-red-700' : 'bg-[#006989] hover:bg-[#053F61]'
        }`}
      >
        {loading ? <CircularProgress size={16} color="inherit" /> : null}
        {confirmText}
      </button>
    </div>
  </Dialog>
);

export default ConfirmDialog;
