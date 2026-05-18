const STATUS_MAP = {
  pendiente: 'bg-amber-100 text-amber-800',
  aprobado: 'bg-violet-100 text-violet-800',
  en_proceso: 'bg-sky-100 text-sky-800',
  finalizado: 'bg-stone-200 text-stone-700',
  entregado: 'bg-emerald-100 text-emerald-800',
  cancelado: 'bg-red-100 text-red-700',
  pagado: 'bg-emerald-100 text-emerald-800',
  fallido: 'bg-red-100 text-red-700',
  reembolsado: 'bg-stone-200 text-stone-700',
};

export default function StatusBadge({ value, status }) {
  const normalizedValue = value || status;
  const text = normalizedValue ? String(normalizedValue).replaceAll('_', ' ') : 'sin estado';
  const toneClass = STATUS_MAP[normalizedValue] || 'bg-stone-200 text-stone-700';

  return (
    <span className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.1em] ${toneClass}`}>
      {text}
    </span>
  );
}
