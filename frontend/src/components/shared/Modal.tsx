import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { BTN_CANCEL } from '@/config/constants';

const SIZES = {
  sm: 'max-w-[440px]',
  md: 'max-w-[500px]',
  lg: 'max-w-[600px]',
  xl: 'max-w-[700px]',
  full: 'max-w-[900px]',
} as const;

export function Spinner({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  size?: keyof typeof SIZES;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  headerRight?: ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  destructive?: boolean;
  footer?: ReactNode;
  scrollable?: boolean;
  children?: ReactNode;
}

export default function Modal({
  open,
  onClose,
  size = 'sm',
  title,
  subtitle,
  icon,
  headerRight,
  onSubmit,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  isLoading = false,
  destructive = false,
  footer,
  scrollable = false,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const hasHeader = !!(title || icon || headerRight);

  const defaultFooter = onSubmit ? (
    <div className="flex items-center justify-end gap-3 pt-4">
      <button type="button" onClick={onClose} disabled={isLoading} className={BTN_CANCEL}>
        {cancelLabel}
      </button>
      <button
        type="submit"
        disabled={isLoading}
        className={`inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-50 ${
          destructive ? 'bg-red-600 hover:bg-red-700' : 'bg-[#006989] hover:bg-[#053F61]'
        }`}
      >
        {isLoading && <Spinner />}
        {submitLabel}
      </button>
    </div>
  ) : null;

  const footerContent = footer ? (
    <div className="flex items-center justify-end gap-3 pt-4">{footer}</div>
  ) : (
    defaultFooter
  );

  const body = (
    <>
      {children && <div className="space-y-4">{children}</div>}
      {footerContent}
    </>
  );

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`${SIZES[size]} w-full bg-white rounded-2xl shadow-xl animate-modal-in`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {hasHeader && (
          <div className="px-6 pt-6 pb-1 flex items-start gap-3">
            {icon && (
              <div
                className={`mt-0.5 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  destructive ? 'bg-red-50' : 'bg-[#006989]/10'
                }`}
              >
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {title && (
                <h2 id="modal-title" className="text-base font-semibold text-gray-800">
                  {title}
                </h2>
              )}
              {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
            {headerRight}
          </div>
        )}
        <div
          className={`px-6 ${hasHeader ? 'pt-4' : 'pt-6'} pb-6 ${
            scrollable ? 'max-h-[70vh] overflow-y-auto' : ''
          }`}
        >
          {onSubmit ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              {body}
            </form>
          ) : (
            body
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
