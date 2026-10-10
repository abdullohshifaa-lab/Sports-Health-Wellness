import { rgba } from './TunnelArt'

export function Chip({ children, color = '#34d399', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85 backdrop-blur-md ${className}`}
      style={{ borderColor: rgba(color, 0.45), background: rgba(color, 0.12) }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
      {children}
    </span>
  )
}

export function SectionTitle({ kicker, title, color = '#34d399', className = '' }) {
  return (
    <div className={`text-center ${className}`}>
      <Chip color={color}>{kicker}</Chip>
      <h2 className="mt-4 font-display text-[clamp(1.55rem,4.2vw,3.2rem)] font-bold leading-[1.08] tracking-tight text-white">
        {title}
      </h2>
    </div>
  )
}

export function ScrollHint({ label = 'Skrol qiling' }) {
  return (
    <div className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/60">
      <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">{label}</span>
      <span className="flex h-9 w-5 justify-center rounded-full border border-white/40 pt-1.5">
        <span className="h-2 w-[3px] animate-scroll-hint rounded-full bg-white/80" />
      </span>
    </div>
  )
}

export function GlassButton({ children, onClick, primary = false, color = '#34d399', className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-bold tracking-wide transition-transform duration-300 hover:scale-[1.04] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
        primary ? 'text-ink' : 'glass text-white'
      } ${className}`}
      style={primary ? { background: `linear-gradient(120deg, ${color}, #d9f99d)`, boxShadow: `0 0 36px -6px ${color}` } : undefined}
    >
      {children}
    </button>
  )
}
