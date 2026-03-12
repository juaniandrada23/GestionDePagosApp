import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider } from '@/context/AuthContext';
import AppRouter from '@/router/AppRouter';

const App: React.FC = () => (
  <ErrorBoundary>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </ErrorBoundary>
);

export default App;
