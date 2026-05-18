export default function LoadingScreen({ message = 'Cargando información...', label }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--app-surface)] px-6">
      <div
        role="status"
        aria-label="Cargando"
        className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--brand-soft)] border-t-[var(--brand)]"
      />
      <p className="text-center text-sm font-medium text-[var(--app-text-muted)]">{label || message}</p>
    </div>
  );
}
