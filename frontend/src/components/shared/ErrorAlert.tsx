import React from 'react';
import { MdErrorOutline } from 'react-icons/md';

interface ErrorAlertProps {
  message: string | null | undefined;
  className?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, className = '' }) => {
  if (!message) return null;
  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl ${className}`}
    >
      <MdErrorOutline className="text-red-500 text-lg flex-shrink-0" />
      <p className="text-sm text-red-700 font-medium">{message}</p>
    </div>
  );
};

export default ErrorAlert;
