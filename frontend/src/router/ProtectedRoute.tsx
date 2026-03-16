import React from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import SessionTimeoutModal from '@/components/feedback/SessionTimeoutModal';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { userId } = useParams<{ userId: string }>();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (userId && user && userId !== String(user.id)) {
    return <Navigate to={`/dashboard/${user.id}`} replace />;
  }

  return (
    <>
      <Outlet />
      <SessionTimeoutModal />
    </>
  );
};

export default ProtectedRoute;
