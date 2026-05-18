import { useAuth } from '../context/AuthContext';

export default function AppShell({ title, subtitle, actions, children }) {
  const { user } = useAuth();

  return (
    <>
      <header className="flex flex-col gap-4 px-4 pb-4 pt-6 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div>
          <h1 className="text-[clamp(1.9rem,2vw,2.45rem)] font-extrabold leading-none text-[var(--brand)]">{title}</h1>
          {subtitle && <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--app-text-muted)]">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {actions}
          <div className="min-w-[180px] rounded-2xl border border-[var(--app-border)] bg-white/90 px-4 py-3 shadow-[var(--shadow-soft)]">
            <div className="font-semibold text-[var(--app-text)]">{user?.nombre} {user?.apellido}</div>
            <div className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">{user?.rol}</div>
          </div>
        </div>
      </header>
      <main className="px-4 pb-8 sm:px-6 lg:px-8">{children}</main>
    </>
  );
}
