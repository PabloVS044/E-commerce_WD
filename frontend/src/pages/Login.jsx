import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { getRoleHomePath } from '../utils/roleHome';

export default function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <LoadingScreen message="Comprobando sesión..." />;
  if (user) return <Navigate to={getRoleHomePath(user.rol)} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const authUser = await login({ email, password });
      navigate(getRoleHomePath(authUser.rol));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center bg-[var(--app-surface)] py-4">
      <div className="page-shell">
        <div className="grid items-center gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.95fr)]">
          <div>
            <div className="hero-panel p-4 p-lg-5">
              <div className="mb-2 text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">
                Acceso del personal
              </div>
              <h1 className="mb-3 text-[clamp(2.4rem,6vw,3.4rem)] font-bold text-brand">Tacos El Pepe</h1>
              <p className="mb-4 max-w-2xl text-lg leading-8 text-[var(--app-text-muted)]">
                Una sola entrada para cajero, cocina y administración. La operación se mantiene
                sobria, rápida y lista para usarse incluso en terminal táctil.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="app-pill app-pill-neutral">POS simple</span>
                <span className="app-pill app-pill-neutral">Pedidos activos</span>
                <span className="app-pill app-pill-neutral">Reportes SQL</span>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-xl">
            <div className="surface-card p-4 p-lg-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="text-[0.76rem] font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">Iniciar sesión</div>
                  <h2 className="text-3xl font-bold text-[var(--app-text)]">Panel interno</h2>
                </div>
                <div className="product-icon text-[var(--brand)]">
                  <Icon name="lockUser" className="h-8 w-8" />
                </div>
              </div>

              {error && <div className="app-notice app-notice-error mb-4">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="app-label">Correo electrónico</label>
                  <input
                    type="email"
                    className="app-input app-input-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jose.perez@tacospepe.gt"
                    required
                    autoFocus
                  />
                </div>
                <div className="mb-4">
                  <label className="app-label">Contraseña</label>
                  <input
                    type="password"
                    className="app-input app-input-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button type="submit" className="app-button app-button-primary app-button-lg mb-3 w-full" disabled={submitting}>
                  {submitting ? 'Entrando...' : 'Acceder al sistema'}
                </button>
                <Link to="/" className="app-button app-button-secondary app-button-lg w-full">
                  Ir al portal de clientes
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
