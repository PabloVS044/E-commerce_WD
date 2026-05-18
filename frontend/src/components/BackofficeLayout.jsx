import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AppSidebar from './AppSidebar';
import Icon from './Icon';

export default function BackofficeLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isSidebarOpen) {
      document.body.style.overflow = '';
      return undefined;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-[var(--app-surface)]">
      <div className="sticky top-0 z-40 border-b border-[var(--app-border)] bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand)] text-white">
              <Icon name="shop" className="h-5 w-5" />
            </span>
            <div>
              <div className="font-[var(--font-display)] text-base font-bold text-[var(--app-text)]">Tacos El Pepe</div>
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">Backoffice</div>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--app-border)] bg-white text-[var(--app-text)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Abrir navegación"
            aria-expanded={isSidebarOpen}
          >
            <Icon name="menu" className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[rgba(14,20,43,0.38)] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Cerrar navegación"
        />
      )}

      <AppSidebar isMobileOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="min-w-0 lg:pl-[280px]">
        <Outlet />
      </div>
    </div>
  );
}
