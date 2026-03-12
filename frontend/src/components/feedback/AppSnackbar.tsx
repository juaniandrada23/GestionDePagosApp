import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import { MdCheckCircle, MdError, MdWarning, MdInfo, MdClose } from 'react-icons/md';

interface AppSnackbarProps {
  open: boolean;
  message: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  onClose: () => void;
  isMobile?: boolean;
}

const severityConfig = {
  success: {
    icon: MdCheckCircle,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    border: 'border-l-emerald-500',
  },
  error: {
    icon: MdError,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    border: 'border-l-red-500',
  },
  warning: {
    icon: MdWarning,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    border: 'border-l-amber-500',
  },
  info: {
    icon: MdInfo,
    iconBg: 'bg-[#006989]/10',
    iconColor: 'text-[#006989]',
    border: 'border-l-[#006989]',
  },
};

const AppSnackbar: React.FC<AppSnackbarProps> = ({
  open,
  message,
  severity = 'success',
  title,
  onClose,
  isMobile: _isMobile = false,
}) => {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <Snackbar
      open={open}
      autoHideDuration={2500}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <div
        className={`flex items-start gap-3 px-4 py-3 bg-white rounded-xl shadow-lg border border-gray-200 border-l-4 ${config.border} min-w-[300px] max-w-[420px]`}
      >
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${config.iconBg}`}
        >
          <Icon className={`text-lg ${config.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          {title && <p className="text-sm font-semibold text-gray-800">{title}</p>}
          <p className={`text-sm text-gray-600 ${title ? 'mt-0.5' : ''}`}>{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <MdClose className="text-base" />
        </button>
      </div>
    </Snackbar>
  );
};

export default AppSnackbar;
