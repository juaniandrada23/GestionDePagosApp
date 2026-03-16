import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ComprasPage = lazy(() => import('@/pages/ComprasPage'));
const VentasPage = lazy(() => import('@/pages/VentasPage'));
const ProveedoresPage = lazy(() => import('@/pages/ProveedoresPage'));
const InformesPage = lazy(() => import('@/pages/InformesPage'));
const MediosPagoPage = lazy(() => import('@/pages/MediosPagoPage'));
const UsuariosPage = lazy(() => import('@/pages/UsuariosPage'));
const MaterialesPage = lazy(() => import('@/pages/MaterialesPage'));
const ClientesPage = lazy(() => import('@/pages/ClientesPage'));
const PresupuestosPage = lazy(() => import('@/pages/PresupuestosPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </div>
);

const PagosRedirect = () => {
  const { userId } = useParams<{ userId: string }>();
  return <Navigate to={`/compras/${userId}`} replace />;
};

const CalculosRedirect = () => {
  const { userId } = useParams<{ userId: string }>();
  return <Navigate to={`/informes/${userId}`} replace />;
};

const AppRouter: React.FC = () => (
  <Router>
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/:userId" element={<DashboardPage />} />
          <Route path="/compras/:userId" element={<ComprasPage />} />
          <Route path="/ventas/:userId" element={<VentasPage />} />
          <Route path="/presupuestos/:userId" element={<PresupuestosPage />} />
          <Route path="/materiales/:userId" element={<MaterialesPage />} />
          <Route path="/clientes/:userId" element={<ClientesPage />} />
          <Route path="/usuarios/:userId" element={<UsuariosPage />} />
          <Route path="/pagos/:userId" element={<PagosRedirect />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/proveedores/:userId" element={<ProveedoresPage />} />
          <Route path="/informes/:userId" element={<InformesPage />} />
          <Route path="/calculos/:userId" element={<CalculosRedirect />} />
          <Route path="/medios/:userId" element={<MediosPagoPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </Router>
);

export default AppRouter;
