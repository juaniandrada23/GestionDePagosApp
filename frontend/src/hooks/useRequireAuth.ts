import { useAuth } from '@/hooks/useAuth';

export function useRequireAuth() {
  const { user, isAdmin } = useAuth();
  return { user, isAdmin };
}
