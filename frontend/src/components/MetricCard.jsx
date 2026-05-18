import Icon from './Icon';

const TONE_CLASSES = {
  primary: 'bg-[linear-gradient(135deg,#f4ded4_0%,#fff3ee_100%)] text-[#7d1a20]',
  warning: 'bg-[linear-gradient(135deg,#ffe3be_0%,#fff4e3_100%)] text-[#8a5b00]',
  danger: 'bg-[linear-gradient(135deg,#ffd7d1_0%,#fff0ed_100%)] text-[#9f1f16]',
  info: 'bg-[linear-gradient(135deg,#dff2ff_0%,#f2faff_100%)] text-[#0b6687]',
  success: 'bg-[linear-gradient(135deg,#dbf6e3_0%,#f2fff6_100%)] text-[#0e7040]',
};

export default function MetricCard({ label, value, hint, icon, tone = 'primary' }) {
  const toneClass = TONE_CLASSES[tone] || TONE_CLASSES.primary;

  return (
    <div className="relative h-full overflow-hidden rounded-[1.7rem] border border-[var(--app-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,245,242,0.94))] p-5 shadow-[var(--shadow-glow)]">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(100,22,27,0.28),transparent)]" />
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
