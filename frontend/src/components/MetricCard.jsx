import Icon from './Icon';

const TONE_CLASSES = {
  primary: 'bg-rose-100 text-rose-800',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-sky-100 text-sky-700',
  success: 'bg-emerald-100 text-emerald-700',
};

export default function MetricCard({ label, value, hint, icon, tone = 'primary' }) {
  const toneClass = TONE_CLASSES[tone] || TONE_CLASSES.primary;

  return (
    <div className="h-full rounded-[1.5rem] border border-[var(--app-border)] bg-white p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-3">
        <div className={`metric-icon ${toneClass}`}>
          <Icon name={icon} className="h-5 w-5" />
        </div>
        {hint && <span className="text-right text-xs font-medium text-[var(--app-text-muted)]">{hint}</span>}
      </div>
      <div className="mt-4 text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
        {label}
      </div>
      <div className="mt-1 text-[clamp(1.85rem,3vw,2.4rem)] font-bold leading-none text-[var(--app-text)]">
        {value}
      </div>
    </div>
  );
}
