import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { rgba } from './TunnelArt'

// 4 soniya nafas olish → 4 soniya ushlash → 6 soniya chiqarish.
const PHASES = [
  { label: 'Nafas oling', seconds: 4 },
  { label: 'Ushlab turing', seconds: 4 },
  { label: 'Sekin chiqaring', seconds: 6 },
]
const TOTAL = PHASES.reduce((s, p) => s + p.seconds, 0)

export default function BreathingOrb({ color = '#a78bfa', accent = '#f0abfc' }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    let cancelled = false
    let timer
    const run = (i) => {
      if (cancelled) return
      setPhase(i)
      timer = setTimeout(() => run((i + 1) % PHASES.length), PHASES[i].seconds * 1000)
    }
    run(0)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-2">
      <div className="relative flex h-32 w-32 items-center justify-center md:h-36 md:w-36">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 35% 30%, ${rgba(accent, 0.95)}, ${rgba(color, 0.55)} 55%, transparent 72%)`,
            boxShadow: `0 0 50px ${rgba(color, 0.55)}`,
          }}
          animate={{ scale: [0.55, 1, 1, 0.55] }}
          transition={{
            duration: TOTAL,
            times: [0, 4 / TOTAL, 8 / TOTAL, 1],
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
        <span className="relative z-10 text-center text-xs font-bold leading-tight text-white drop-shadow">
          {PHASES[phase].label}
        </span>
      </div>
      <p className="text-center text-[11px] font-medium text-white/60">4 – 4 – 6 nafas ritmi</p>
    </div>
  )
}
