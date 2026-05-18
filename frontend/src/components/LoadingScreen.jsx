export default function LoadingScreen({ message = 'Cargando información...', label }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--app-surface)] px-6">
      <div className="rounded-full border border-[var(--app-border)] bg-white/75 px-4 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--app-text-muted)]">
        Inicializando operación
      </div>
      <div
        role="status"
        aria-label="Cargando"
        className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--brand-soft)] border-t-[var(--brand)]"
      />
      <p className="text-center text-sm font-medium text-[var(--app-text-muted)]">{label || message}</p>
    </div>
  );
}
