import React, { type ReactNode } from 'react';
import { MdErrorOutline } from 'react-icons/md';

interface FormFieldProps {
  label: string | ReactNode;
  error?: string | boolean;
  errorMessage?: string;
  children: ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({ label, error, errorMessage, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    {children}
    {error && (
      <span className="flex items-center gap-1 text-red-500 text-xs mt-1">
        <MdErrorOutline className="text-sm" />
        {typeof error === 'string' ? error : errorMessage || 'Campo obligatorio'}
      </span>
    )}
  </div>
);

export default FormField;
