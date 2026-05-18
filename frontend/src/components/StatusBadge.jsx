const STATUS_MAP = {
  pendiente: 'bg-[#EEF2FF] text-[#1C2859]',
  aprobado: 'bg-[#E7EDFF] text-[#10288C]',
  en_proceso: 'bg-[#E3E9FF] text-[#10288C]',
  finalizado: 'bg-[#F3F6FF] text-[#1C2859]',
  entregado: 'bg-[#EAF0FF] text-[#10288C]',
  cancelado: 'bg-red-100 text-red-700',
  pagado: 'bg-[#EAF0FF] text-[#10288C]',
  fallido: 'bg-red-100 text-red-700',
  reembolsado: 'bg-[#F3F6FF] text-[#1C2859]',
};

export default function StatusBadge({ value, status }) {
  const normalizedValue = value || status;
  const text = normalizedValue ? String(normalizedValue).replaceAll('_', ' ') : 'sin estado';
  const toneClass = STATUS_MAP[normalizedValue] || 'bg-[#F3F6FF] text-[#1C2859]';

  return (
    <span className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.1em] ${toneClass}`}>
      {text}
    </span>
  );
}
