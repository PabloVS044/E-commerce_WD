import Icon from './Icon';

const TONE_CLASSES = {
  primary: 'bg-[#EEF2FF] text-[#10288C]',
  warning: 'bg-[#F3F6FF] text-[#1C2859]',
  danger: 'bg-[#F7F8FC] text-[#1C2859]',
  info: 'bg-[#F5F7FF] text-[#10288C]',
  success: 'bg-[#EAF0FF] text-[#10288C]',
};

export default function MetricCard({ label, value, hint, icon, tone = 'primary' }) {
  const toneClass = TONE_CLASSES[tone] || TONE_CLASSES.primary;

  return (
    <div className="relative h-full overflow-hidden rounded-[1.7rem] border border-[var(--app-border)] bg-white p-5 shadow-[var(--shadow-glow)]">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[rgba(16,40,140,0.12)]" />
      <div className="flex items-start justify-between gap-3">
        <div className={`metric-icon ${toneClass}`}>
          <Icon name={icon} className="h-5 w-5" />
        </div>
        {hint && (
          <span className="rounded-full border border-[var(--app-border)] bg-white/80 px-3 py-1 text-right text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--app-text-muted)]">
            {hint}
          </span>
        )}
      </div>
      <div className="mt-5 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-[var(--app-text-muted)]">
        {label}
      </div>
      <div className="mt-2 font-[var(--font-display)] text-[clamp(2rem,3vw,2.6rem)] font-extrabold leading-none text-[var(--app-text)]">
        {value}
      </div>
    </div>
  );
}
