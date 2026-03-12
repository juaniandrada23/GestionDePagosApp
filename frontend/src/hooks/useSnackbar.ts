import { useState, useCallback } from 'react';

type Severity = 'success' | 'error' | 'warning' | 'info';

export function useSnackbar() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<Severity>('success');
  const [title, setTitle] = useState('');

  const show = useCallback((msg: string, sev: Severity = 'success', titleMsg = '') => {
    setMessage(msg);
    setSeverity(sev);
    setTitle(titleMsg);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return { open, message, severity, title, show, close };
}
