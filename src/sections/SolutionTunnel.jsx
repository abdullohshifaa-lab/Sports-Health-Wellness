import { useState } from 'react'
import TunnelScroll from '../components/TunnelScroll'
import TunnelLayer from '../components/TunnelLayer'
import TunnelArt, { rgba } from '../components/TunnelArt'
import ProgressRail from '../components/ProgressRail'
import BreathingOrb from '../components/BreathingOrb'
import { Chip, GlassButton, ScrollHint, SectionTitle } from '../components/ui'
import { useLenis, glideTo } from '../components/SmoothScroll'
import { problems } from '../data/problems'
import { emerge, retreat } from '../transitions'

const LABELS = ['Muammo', 'Sabab', 'Birinchi qadamlar', 'Kunlik reja', 'Xatolar', 'Xavfsizlik']

// Har bir qatlam o'zining tunnel shakli va siljishiga ega — tunnel "egri-bugri" yo'l bo'ylab uchayotgandek.
const LAYER_ART = [
  { shape: null, glyphOpacity: 0.95, drift: { x: 0, y: 0 }, veil: 0.16 },
  { shape: 'circle', glyphOpacity: 0.16, drift: { x: -7, y: 4 }, veil: 0.3 },
  { shape: 'hex', glyphOpacity: 0.16, drift: { x: 6, y: -4 }, veil: 0.3 },
  { shape: 'square', glyphOpacity: 0.16, drift: { x: -5, y: -5 }, veil: 0.34 },
  { shape: 'diamond', glyphOpacity: 0.16, drift: { x: 7, y: 5 }, veil: 0.3 },
  { shape: null, glyphOpacity: 0.22, drift: { x: 0, y: 0 }, veil: 0.34 },
]

function Art({ problem, i, seedBase }) {
  const cfg = LAYER_ART[i]
  return (
    <TunnelArt
      palette={problem.palette}
      shape={cfg.shape || problem.shape}
      glyph={problem.glyph}
      glyphOpacity={cfg.glyphOpacity}
      drift={cfg.drift}
      veil={cfg.veil}
      seed={seedBase + i}
    />
  )
}

function DailyPlan({ problem }) {
  const { palette } = problem
  const slots = [
    { key: 'morning', label: 'Ertalab', icon: '☀' },
    { key: 'day', label: 'Kunduzi', icon: '◐' },
    { key: 'evening', label: 'Kechqurun', icon: '☾' },
  ]
  const storageKey = `sws:plan:${problem.id}`
  const [done, setDone] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {}
    } catch {
      return {}
    }
  })

  const total = slots.reduce((n, s) => n + problem.plan[s.key].length, 0)
  const count = slots.reduce((n, s) => n + problem.plan[s.key].filter((_, i) => done[`${s.key}-${i}`]).length, 0)
  const pct = Math.round((count / total) * 100)
  const R = 24
  const C = 2 * Math.PI * R

  const toggle = (key) =>
    setDone((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      try {
        localStorage.setItem(storageKey, JSON.stringify(next))
      } catch {
        /* saqlash mumkin bo'lmasa — jim o'tamiz */
      }
      return next
    })

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 pb-4 pt-16 md:px-6 md:pt-20">
      <SectionTitle kicker="03 · Reja" title="Kunlik reja" color={palette.c} />
      <div className="mt-4 flex items-center gap-3 text-sm text-white/70">
        <svg viewBox="0 0 60 60" className="h-12 w-12 -rotate-90" aria-hidden="true">
          <circle cx="30" cy="30" r={R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
          <circle
            cx="30"
            cy="30"
            r={R}
            fill="none"
            stroke={palette.c}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - count / total)}
            style={{ transition: 'stroke-dashoffset 0.6s ease', filter: `drop-shadow(0 0 6px ${palette.c})` }}
          />
        </svg>
        <span>
          Bugun bajarildi: <b className="text-white">{pct}%</b>
          <span className="block text-[11px] text-white/45">Belgilab boring — saqlanadi</span>
        </span>
      </div>

      <div
        className={`mt-5 grid w-full max-w-6xl gap-3 md:gap-4 ${problem.breathing ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}
      >
        {slots.map((s) => (
          <div key={s.key} className="glass rounded-3xl p-4 md:p-5">
            <div className="flex items-center gap-2 font-display text-sm font-bold text-white">
              <span style={{ color: palette.c }}>{s.icon}</span>
              {s.label}
            </div>
            <ul className="mt-2 space-y-1">
              {problem.plan[s.key].map((item, i) => {
                const key = `${s.key}-${i}`
                const checked = !!done[key]
                return (
                  <li key={key}>
                    <label className="flex cursor-pointer items-start gap-3 py-1.5 text-[13px] leading-snug text-white/85 md:text-sm">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={checked}
                        onChange={() => toggle(key)}
                      />
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[12px] font-black text-ink transition peer-focus-visible:ring-2 peer-focus-visible:ring-white"
                        style={{
                          background: checked ? palette.c : 'transparent',
                          borderColor: checked ? palette.c : 'rgba(255,255,255,0.4)',
                        }}
                      >
                        {checked ? '✓' : ''}
                      </span>
                      <span className={checked ? 'text-white/45 line-through' : ''}>{item}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
        {problem.breathing && (
          <div className="glass hidden rounded-3xl p-4 md:flex md:items-center md:justify-center">
            <BreathingOrb color={palette.c} accent={palette.d} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function SolutionTunnel({ problem, onBack }) {
  const lenis = useLenis()
  const { palette } = problem
  const idx = problems.findIndex((p) => p.id === problem.id)
  const seedBase = (idx + 1) * 10

  return (
    <TunnelScroll count={6} stageRef={null} initial={emerge.initial} animate={emerge.animate} exit={retreat}>
      <ProgressRail labels={LABELS} color={palette.c} />

      {/* 0 — Muammo va asosiy raqam */}
      <TunnelLayer index={0} art={<Art problem={problem} i={0} seedBase={seedBase} />}>
        <div className="flex h-full flex-col items-center justify-center px-6 pt-10 text-center">
          <Chip color={palette.c}>
            Yechim · {String(idx + 1).padStart(2, '0')} / {String(problems.length).padStart(2, '0')}
          </Chip>
          <h1 className="mt-6 max-w-5xl font-display text-[clamp(2rem,6.4vw,5.4rem)] font-extrabold leading-[1.03] tracking-tight text-white">
            {problem.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[clamp(0.95rem,1.6vw,1.2rem)] leading-relaxed text-white/80">{problem.tagline}</p>
          <div className="glass mt-8 flex max-w-xl flex-col items-center gap-3 rounded-3xl px-6 py-4 sm:flex-row sm:gap-5">
            <div
              className="font-display text-3xl font-extrabold md:text-5xl"
              style={{
                background: `linear-gradient(110deg, ${palette.c}, ${palette.d})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {problem.fact.value}
            </div>
            <p className="text-center text-xs leading-snug text-white/70 sm:text-left md:text-sm">{problem.fact.label}</p>
          </div>
          <ScrollHint label="Ichkariga sho'ng'ing" />
        </div>
      </TunnelLayer>

      {/* 1 — Sabablar */}
      <TunnelLayer index={1} art={<Art problem={problem} i={1} seedBase={seedBase} />}>
        <div className="flex h-full flex-col items-center justify-center px-5 pb-4 pt-16 md:pt-20">
          <SectionTitle kicker="01 · Sabab" title="Nima sodir bo'lyapti?" color={palette.c} />
          <div className="mt-7 grid w-full max-w-5xl gap-3 md:mt-10 md:grid-cols-3 md:gap-5">
            {problem.causes.map((c, i) => (
              <div key={c.title} className="glass relative overflow-hidden rounded-3xl p-5 md:p-7">
                <span
                  className="absolute -right-3 -top-5 font-display text-[88px] font-extrabold leading-none md:text-[120px]"
                  style={{ color: rgba(palette.c, 0.14) }}
                >
                  {i + 1}
                </span>
                <h3 className="relative font-display text-base font-bold text-white md:text-lg">{c.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-white/72">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </TunnelLayer>

      {/* 2 — Birinchi qadamlar */}
      <TunnelLayer index={2} art={<Art problem={problem} i={2} seedBase={seedBase} />}>
        <div className="flex h-full flex-col items-center justify-center px-4 pb-4 pt-16 md:px-6 md:pt-20">
          <SectionTitle kicker="02 · Yechim" title="Hoziroq nima qilish kerak?" color={palette.c} />
          <div className="mt-6 grid w-full max-w-5xl gap-2.5 md:mt-9 md:grid-cols-2 md:gap-4">
            {problem.steps.map((s, i) => (
              <div key={s.title} className="glass flex items-start gap-4 rounded-3xl p-4 md:p-6">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-extrabold text-ink md:h-14 md:w-14 md:text-2xl"
                  style={{ background: `linear-gradient(135deg, ${palette.c}, ${palette.d})`, boxShadow: `0 0 28px -6px ${palette.c}` }}
                >
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-display text-[15px] font-bold text-white md:text-lg">{s.title}</h3>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/80"
                      style={{ background: rgba(palette.c, 0.22) }}
                    >
                      {s.tag}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-white/72 md:text-sm">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TunnelLayer>

      {/* 3 — Kunlik reja */}
      <TunnelLayer index={3} art={<Art problem={problem} i={3} seedBase={seedBase} />}>
        <DailyPlan problem={problem} />
      </TunnelLayer>

      {/* 4 — Xatolar */}
      <TunnelLayer index={4} art={<Art problem={problem} i={4} seedBase={seedBase} />}>
        <div className="flex h-full flex-col items-center justify-center px-4 pb-4 pt-16 md:px-6 md:pt-20">
          <SectionTitle kicker="04 · Ehtiyot bo'ling" title="Qochish kerak bo'lgan xatolar" color={palette.c} />
          <div className="mt-6 grid w-full max-w-5xl gap-2.5 md:mt-9 md:grid-cols-2 md:gap-4">
            {problem.mistakes.map((m) => (
              <div key={m} className="glass flex items-center gap-4 rounded-2xl p-4 md:p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-lg font-black text-rose-300 ring-1 ring-rose-400/40">
                  ✕
                </span>
                <p className="text-[13px] font-medium leading-snug text-white/85 md:text-[15px]">{m}</p>
              </div>
            ))}
          </div>
        </div>
      </TunnelLayer>

      {/* 5 — Shifokorga qachon */}
      <TunnelLayer index={5} art={<Art problem={problem} i={5} seedBase={seedBase} />}>
        <div className="flex h-full flex-col items-center justify-center px-4 pb-4 pt-16 md:px-6 md:pt-20">
          <SectionTitle kicker="05 · Xavfsizlik" title="Qachon shifokorga murojaat qilish kerak?" color="#fbbf24" />
          <div className="mt-6 grid w-full max-w-5xl gap-2.5 md:mt-8 md:grid-cols-2 md:gap-4">
            {problem.redFlags.map((f) => (
              <div
                key={f}
                className="glass flex items-start gap-3 rounded-2xl p-4 md:p-5"
                style={{ borderColor: 'rgba(251,191,36,0.35)' }}
              >
                <span className="mt-0.5 text-lg text-amber-300">⚠</span>
                <p className="text-[13px] leading-snug text-white/88 md:text-[15px]">{f}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-2xl text-center text-[11px] leading-snug text-white/50 md:text-xs">
            Bu sahifa umumiy ma'lumot beradi va shifokor maslahatini almashtirmaydi. Ahvolingiz og'ir bo'lsa yoki
            shubha bo'lsa — mutaxassisga murojaat qiling.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <GlassButton primary color={palette.c} onClick={onBack}>
              Boshqa muammoni tanlash
            </GlassButton>
            <GlassButton onClick={() => glideTo(lenis, 0, 2.4)}>↑ Boshiga qaytish</GlassButton>
          </div>
        </div>
      </TunnelLayer>
    </TunnelScroll>
  )
}
