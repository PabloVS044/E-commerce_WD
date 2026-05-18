import { memo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from './Icon';
import { useAuth } from '../context/AuthContext';
import { getRoleHomePath } from '../utils/roleHome';

function matchesCrudSection(pathname, basePath) {
  const escapedBasePath = basePath.replace('/', '\\/');
  const editPattern = new RegExp(`^${escapedBasePath}\\/[^/]+\\/editar$`);

  return (
    pathname === basePath
    || pathname === `${basePath}/nuevo`
    || editPattern.test(pathname)
  );
}

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: 'grid',
    roles: ['admin', 'cajero'],
    match: (pathname) => pathname === '/dashboard',
  },
  {
    to: '/pos',
    label: 'POS',
    icon: 'terminal',
    roles: ['admin', 'cajero'],
    match: (pathname) => pathname === '/pos',
  },
  {
    to: '/pedidos',
    label: 'Pedidos',
    icon: 'receipt',
    roles: ['admin', 'cajero', 'cocinero'],
    match: (pathname) => pathname === '/pedidos',
  },
  {
    to: '/productos',
    label: 'Productos',
    icon: 'cupHot',
    roles: ['admin'],
    match: (pathname) => matchesCrudSection(pathname, '/productos'),
  },
  {
    to: '/insumos',
    label: 'Insumos',
    icon: 'box',
    roles: ['admin'],
    match: (pathname) => matchesCrudSection(pathname, '/insumos'),
  },
  {
    to: '/insumos/reabastecer',
    label: 'Reabastecer',
    icon: 'bagCheck',
    roles: ['admin'],
    match: (pathname) => pathname.startsWith('/insumos/reabastecer'),
  },
  {
    to: '/reportes',
    label: 'Reportes',
    icon: 'chart',
    roles: ['admin', 'cajero'],
    match: (pathname) => pathname.startsWith('/reportes'),
  },
  {
    to: '/analitica',
    label: 'Analítica SQL',
    icon: 'nodes',
    roles: ['admin', 'cajero'],
    match: (pathname) => pathname === '/analitica',
  },
];

function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user?.rol));

  const handleClientPortal = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } finally {
      navigate('/login');
    }
  }, [logout, navigate]);

  return (
    <aside className="sticky top-0 z-30 flex h-auto w-full flex-col border-b border-[var(--app-border)] bg-white/95 p-5 backdrop-blur lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:h-screen lg:w-[280px] lg:overflow-y-auto lg:border-b-0 lg:shadow-[inset_-1px_0_0_var(--app-border)]">
      <div className="mb-4 border-b border-[var(--app-border)] pb-4">
        <Link to={getRoleHomePath(user?.rol)} className="flex items-center gap-4 no-underline">
          <span className="inline-flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-[1.35rem] bg-[var(--brand)] text-xl text-white shadow-[var(--shadow-panel)]">
            <Icon name="shop" className="h-6 w-6" />
          </span>
          <div>
            <div className="font-[var(--font-display)] text-[1.02rem] font-bold text-[var(--app-text)]">Tacos El Pepe</div>
            <div className="mt-1 inline-flex rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--brand)]">Operación premium</div>
          </div>
        </Link>
      </div>

      <div className="grid gap-2 lg:flex-1">
        {visibleItems.map((item) => {
          const active = item.match(location.pathname);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={[
                'flex items-center gap-3 rounded-[1.2rem] px-4 py-3 font-semibold no-underline transition',
                active
                  ? 'bg-[var(--brand)] text-white shadow-[0_14px_28px_rgba(16,40,140,0.24)]'
                  : 'text-[var(--app-text-muted)] hover:bg-white/80 hover:text-[var(--brand)]',
              ].join(' ')}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 border-t border-[var(--app-border)] pt-4">
        <button
          type="button"
          className="app-button app-button-secondary mb-2 w-full"
          onClick={handleClientPortal}
        >
          <Icon name="shop" className="h-5 w-5" />
          Portal Cliente
        </button>
        <button type="button" className="app-button app-button-neutral w-full" onClick={handleLogout}>
          <Icon name="logout" className="h-5 w-5" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default memo(AppSidebar);
