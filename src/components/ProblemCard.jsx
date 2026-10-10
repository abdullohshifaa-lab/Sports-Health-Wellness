import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Glyph from './Glyph'
import { rgba } from './TunnelArt'

// Muammo kartochkasi: sichqoncha ustida 3D qiyshayadi va rangli nur sochadi.
export default function ProblemCard({ problem, index, onSelect }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [11, -11]), { stiffness: 220, damping: 20 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-13, 13]), { stiffness: 220, damping: 20 })
  const { palette } = problem

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => onSelect(problem, ref.current)}
      onPointerMove={onMove}
      onPointerLeave={reset}
      whileTap={{ scale: 0.96 }}
      aria-label={`${problem.title} — yechimni ochish`}
      className="glass group relative flex min-h-[92px] flex-col items-start justify-between gap-2 overflow-hidden rounded-2xl p-3 text-left transition-shadow duration-300 hover:shadow-[0_0_46px_-6px_var(--glow)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 md:min-h-[158px] md:rounded-3xl md:p-5"
      style={{ rotateX, rotateY, transformPerspective: 900, '--glow': rgba(palette.c, 0.85) }}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(120% 100% at 0% 0%, ${rgba(palette.c, 0.34)}, transparent 62%)` }}
      />
      <span className="relative flex w-full items-start justify-between">
        <span className="font-display text-[10px] font-semibold tracking-[0.2em] text-white/50 md:text-xs">
          {String(index + 1).padStart(2, '0')}
        </span>
        <Glyph
          name={problem.glyph}
          colors={palette}
          strokeWidth={9}
          className="h-8 w-8 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 md:h-14 md:w-14"
        />
      </span>
      <span className="relative">
        <span className="block font-display text-[12.5px] font-semibold leading-tight text-white md:text-[15px]">
          {problem.title}
        </span>
        <span className="mt-1 hidden text-xs leading-snug text-white/60 md:block">{problem.short}</span>
      </span>
      <span
        className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-0 transition-all duration-500 group-hover:w-full"
        style={{ background: `linear-gradient(90deg, ${palette.c}, ${palette.d})` }}
      />
    </motion.button>
  )
}
