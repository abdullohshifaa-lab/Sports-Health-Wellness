import { useMemo } from 'react'
import { motion, useTransform } from 'framer-motion'
import { useLayer } from './TunnelLayer'
import { usePointer } from './PointerContext'
import Glyph from './Glyph'

export const rgba = (hex, a) => {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((x) => x + x).join('') : h, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`
}

// Takrorlanadigan "tasodifiy" sonlar (har safar bir xil zarralar chiqishi uchun).
const rng = (seed) => {
  let t = seed + 0x6d2b79f5
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const RING_COUNT = 15
const RING_RATIO = 1.36

function hexagon(r) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6
    return `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`
  }).join(' ')
}

function Ring({ shape, r, stroke, width }) {
  const common = {
    fill: 'none',
    stroke,
    strokeWidth: width,
    vectorEffect: 'non-scaling-stroke',
  }
  if (shape === 'square') return <rect x={-r} y={-r} width={r * 2} height={r * 2} rx={r * 0.14} {...common} />
  if (shape === 'diamond') return <polygon points={`0,${-r} ${r},0 0,${r} ${-r},0`} {...common} />
  if (shape === 'hex') return <polygon points={hexagon(r)} {...common} />
  return <circle r={r} {...common} />
}

/*
  TunnelArt — har bir qatlamning to'liq ekranli "rasmi".
  Qatlamlar (pastdan yuqoriga): gradient fon → (ixtiyoriy foto) → aurora dog'lari → nurlar →
  tunnel halqalari → belgi (glyph) → zarralar → shovqin teksturasi → vinyetka.
*/
export default function TunnelArt({
  palette,
  shape = 'circle',
  glyph = 'portal',
  glyphOpacity = 1,
  photo = null,
  seed = 1,
  drift = { x: 0, y: 0 },
  veil = 0.28,
}) {
  const { c } = useLayer()
  const pointer = usePointer()

  // Halqalar skrol bilan tashqariga qarab "oqib" chiqadi — bu tunnelda uchib borish hissini beradi.
  const ringScale = useTransform(c, (v) => 0.72 + (v + 1) * 0.85)
  const ringRotate = useTransform(c, (v) => v * 14 * (seed % 2 ? 1 : -1))
  const ringX = useTransform(pointer.x, (v) => `${drift.x + v * -2.2}%`)
  const ringY = useTransform(pointer.y, (v) => `${drift.y + v * -2.2}%`)

  const glyphProgress = useTransform(c, [-0.9, -0.15], [0, 1])
  const glyphX = useTransform(pointer.x, (v) => v * 22)
  const glyphY = useTransform(pointer.y, (v) => v * 16)
  const glyphScale = useTransform(c, (v) => 0.8 + Math.max(-1, Math.min(0.3, v)) * 0.25 + 0.2)

  const rings = useMemo(
    () =>
      Array.from({ length: RING_COUNT }, (_, k) => ({
        r: 3.2 * Math.pow(RING_RATIO, k),
        alpha: Math.max(0.1, 0.62 - k * 0.035),
        width: k % 4 === 0 ? 1.8 : 1,
      })),
    [],
  )

  const particles = useMemo(() => {
    const rand = rng(seed * 977)
    return Array.from({ length: 22 }, () => ({
      x: rand() * 100,
      y: 30 + rand() * 80,
      s: 2 + rand() * 4,
      dur: 7 + rand() * 9,
      delay: rand() * 12,
      dx: (rand() - 0.5) * 80,
    }))
  }, [seed])

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: `radial-gradient(125% 95% at 50% 42%, ${rgba(palette.b, 0.6)} 0%, ${palette.a} 56%, #020409 100%)`,
      }}
    >
      {photo && (
        <img
          src={photo}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-luminosity"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      )}

      {/* Aurora dog'lari */}
      <div
        className="absolute left-[-12vmax] top-[-10vmax] h-[62vmax] w-[62vmax] animate-blob rounded-full"
        style={{ background: `radial-gradient(circle, ${rgba(palette.c, 0.34)} 0%, transparent 62%)`, '--bx': '10%', '--by': '8%' }}
      />
      <div
        className="absolute bottom-[-18vmax] right-[-14vmax] h-[70vmax] w-[70vmax] animate-blob rounded-full"
        style={{ background: `radial-gradient(circle, ${rgba(palette.d, 0.22)} 0%, transparent 62%)`, '--bx': '-9%', '--by': '-7%', animationDelay: '-6s' }}
      />

      {/* Nurlar */}
      <div
        className="absolute -left-[115vmax] -top-[115vmax] h-[230vmax] w-[230vmax] animate-spin-slow mix-blend-screen"
        style={{
          left: '50%',
          top: '50%',
          marginLeft: '-115vmax',
          marginTop: '-115vmax',
          opacity: 0.2,
          background: `repeating-conic-gradient(from 0deg, ${rgba(palette.c, 0.55)} 0deg 1.6deg, transparent 1.6deg 12deg)`,
          WebkitMaskImage: 'radial-gradient(circle, #000 0%, transparent 52%)',
          maskImage: 'radial-gradient(circle, #000 0%, transparent 52%)',
        }}
      />

      {/* Tunnel halqalari */}
      <motion.div className="absolute inset-0" style={{ scale: ringScale, rotate: ringRotate, x: ringX, y: ringY }}>
        <svg viewBox="-100 -56.25 200 112.5" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
          {rings.map((ring, i) => (
            <Ring
              key={i}
              shape={shape}
              r={ring.r}
              width={ring.width}
              stroke={rgba(i % 3 === 0 ? palette.d : palette.c, ring.alpha)}
            />
          ))}
        </svg>
      </motion.div>

      {/* Markaziy yorug'lik — tunnel oxiri */}
      <div
        className="absolute left-1/2 top-1/2 h-[46vmin] w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: `radial-gradient(circle, ${rgba(palette.d, 0.38)} 0%, ${rgba(palette.c, 0.14)} 38%, transparent 70%)` }}
      />

      {/* Belgi */}
      <motion.div
        className="absolute left-1/2 top-1/2 -ml-[min(31vmin,280px)] -mt-[min(31vmin,280px)] h-[min(62vmin,560px)] w-[min(62vmin,560px)]"
        style={{ x: glyphX, y: glyphY, scale: glyphScale, opacity: glyphOpacity }}
      >
        <div className="h-full w-full animate-floaty" style={{ filter: `drop-shadow(0 0 26px ${rgba(palette.c, 0.55)})` }}>
          <Glyph name={glyph} progress={glyphProgress} colors={palette} strokeWidth={1.6} className="h-full w-full" />
        </div>
      </motion.div>

      {/* Zarralar */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute animate-drift rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            background: rgba(palette.d, 0.9),
            boxShadow: `0 0 ${p.s * 3}px ${rgba(palette.c, 0.8)}`,
            animationDuration: `${p.dur}s`,
            animationDelay: `-${p.delay}s`,
            '--dx': `${p.dx}px`,
          }}
        />
      ))}

      {/* Matn o'qilishi uchun yengil qoplama */}
      <div className="absolute inset-0" style={{ background: `rgba(2, 5, 10, ${veil})` }} />

      {/* Shovqin teksturasi va vinyetka */}
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-overlay" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.7) 100%)' }}
      />
    </div>
  )
}
