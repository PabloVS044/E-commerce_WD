import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CustomerUiProvider } from './context/CustomerUiContext';
import BackofficeLayout from './components/BackofficeLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicOnlyRoute from './components/PublicOnlyRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductosList from './pages/productos/ProductosList';
import ProductoForm from './pages/productos/ProductoForm';
import InsumosList from './pages/insumos/InsumosList';
import InsumoForm from './pages/insumos/InsumoForm';
import StockCenter from './pages/insumos/StockCenter';
import ReportsHub from './pages/reportes/ReportsHub';
import SqlInsights from './pages/analytics/SqlInsights';
import PosTerminal from './pages/pos/PosTerminal';
import OrdersBoard from './pages/pedidos/OrdersBoard';
import ClientMenu from './pages/public/ClientMenu';
import ClientCheckout from './pages/public/ClientCheckout';
import ClientTracking from './pages/public/ClientTracking';

export default function App() {
  return (
    <AuthProvider>
      <CustomerUiProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ClientMenu />} />
            <Route path="/cliente" element={<Navigate to="/" replace />} />
            <Route path="/cliente/checkout" element={<ClientCheckout />} />
            <Route path="/cliente/seguimiento" element={<ClientTracking />} />
            <Route
              path="/login"
              element={(
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              )}
            />

            <Route path="/app" element={<Navigate to="/dashboard" replace />} />

            <Route
              element={(
                <ProtectedRoute allowedRoles={['admin', 'cajero', 'cocinero']}>
                  <BackofficeLayout />
                </ProtectedRoute>
              )}
            >
              <Route
                element={(
                  <ProtectedRoute allowedRoles={['admin', 'cajero']}>
                    <Outlet />
                  </ProtectedRoute>
                )}
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pos" element={<PosTerminal />} />
                <Route path="/reportes" element={<ReportsHub />} />
                <Route path="/reportes/ventas" element={<Navigate to="/reportes" replace />} />
                <Route path="/reportes/diario" element={<Navigate to="/reportes" replace />} />
                <Route path="/analitica" element={<SqlInsights />} />
              </Route>

              <Route path="/pedidos" element={<OrdersBoard />} />

              <Route
                element={(
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Outlet />
                  </ProtectedRoute>
                )}
              >
                <Route path="/productos" element={<ProductosList />} />
                <Route path="/productos/nuevo" element={<ProductoForm />} />
                <Route path="/productos/:id/editar" element={<ProductoForm />} />
                <Route path="/insumos" element={<InsumosList />} />
                <Route path="/insumos/nuevo" element={<InsumoForm />} />
                <Route path="/insumos/:id/editar" element={<InsumoForm />} />
                <Route path="/insumos/reabastecer" element={<StockCenter />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CustomerUiProvider>
    </AuthProvider>
  );
}
