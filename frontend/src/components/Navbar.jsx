import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/api';

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
      navigate('/login');
    }
  };

  const links = [
    { to: '/productos', label: 'Productos', active: pathname.startsWith('/productos') },
    { to: '/insumos', label: 'Insumos', active: pathname.startsWith('/insumos') },
    { to: '/reportes/ventas', label: 'Productos más vendidos', active: pathname.startsWith('/reportes/ventas') },
    { to: '/reportes/diario', label: 'Ventas diarias', active: pathname.startsWith('/reportes/diario') },
  ];

  return (
    <nav className="border-b border-[var(--app-border)] bg-[var(--brand)] text-white">
      <div className="page-shell flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold no-underline">
            <Icon name="shop" className="h-5 w-5" />
            Tacos El Pepe
          </Link>

          <div className="flex flex-wrap gap-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={[
                  'rounded-full px-3 py-2 text-sm font-medium no-underline transition',
                  link.active ? 'bg-white/18 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm">
            <Icon name="personCircle" className="h-4 w-4" />
            {user.nombre} {user.apellido}
            <span className="rounded-full bg-white/12 px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em]">
              {user.rol}
            </span>
          </span>
          <button type="button" className="app-button app-button-ghost app-button-sm" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
