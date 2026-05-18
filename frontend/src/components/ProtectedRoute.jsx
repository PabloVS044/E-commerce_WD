import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';
import { getRoleHomePath } from '../utils/roleHome';

export default function ProtectedRoute({ children, allowedRoles = null }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen message="Verificando sesión..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to={getRoleHomePath(user.rol)} replace />;
  }
  return children;
}
