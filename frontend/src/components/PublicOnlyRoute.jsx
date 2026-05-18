import { Navigate } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { useAuth } from '../context/AuthContext';
import { getRoleHomePath } from '../utils/roleHome';

export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen label="Verificando sesión..." />;
  }

  if (user) {
    return <Navigate to={getRoleHomePath(user.rol)} replace />;
  }

  return children;
}
