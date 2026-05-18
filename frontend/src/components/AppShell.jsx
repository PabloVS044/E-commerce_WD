import { useAuth } from '../context/AuthContext';

export default function AppShell({ title, subtitle, actions, children }) {
  const { user } = useAuth();

  return (
    <>
      <header className="px-4 pb-4 pt-6 sm:px-6 lg:px-8">
        <div className="surface-card overflow-hidden px-5 py-5 sm:px-6 lg:px-7 lg:py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-white/75 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--app-text-muted)]">
                <span className="inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
                Control Suite
              </div>
              <h1 className="font-[var(--font-display)] text-[clamp(2rem,2vw,2.75rem)] font-extrabold leading-[0.98] text-[var(--brand)]">{title}</h1>
              {subtitle && <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--app-text-muted)]">{subtitle}</p>}
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              {actions}
              <div className="min-w-[220px] rounded-[1.4rem] border border-[var(--app-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,238,234,0.92))] px-4 py-3 shadow-[var(--shadow-soft)]">
                <div className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">Turno activo</div>
                <div className="mt-2 font-semibold text-[var(--app-text)]">{user?.nombre} {user?.apellido}</div>
                <div className="mt-1 inline-flex rounded-full bg-[var(--brand-soft)] px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[var(--brand)]">{user?.rol}</div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="px-4 pb-8 sm:px-6 lg:px-8">{children}</main>
    </>
  );
}
