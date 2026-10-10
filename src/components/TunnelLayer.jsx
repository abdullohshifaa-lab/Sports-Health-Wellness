import { createContext, useContext } from 'react'
import { motion, useMotionTemplate, useTransform } from 'framer-motion'
import { useTunnel } from './TunnelScroll'

const LayerContext = createContext(null)
export const useLayer = () => useContext(LayerContext)

const smooth = (t) => {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

/*
  c — qatlamning kameraga nisbatan joylashuvi:
    c < 0  → qatlam hali oldinda (uzoqda, kichik, xira)
    c = 0  → aynan siz turgan joy (to'liq ko'rinadi, o'qish mumkin)
    c > 0  → siz uning ichidan o'tib ketyapsiz (kattalashadi, markazida teshik ochiladi)
*/
const scaleAt = (c) => {
  if (c < 0) {
    const t = Math.max(0, c + 1)
    return 0.42 + 0.58 * (1 - Math.pow(1 - t, 3))
  }
  if (c < 0.2) return 1 + 0.06 * (c / 0.2)
  const t = Math.min((c - 0.2) / 0.8, 1.25)
  return 1.06 * Math.pow(6, t)
}

const opacityAt = (c) => {
  if (c <= -1) return 0
  if (c < -0.4) return 0.55 * smooth((c + 1) / 0.6)
  if (c < 0) return 0.55 + 0.45 * smooth((c + 0.4) / 0.4)
  if (c < 0.4) return 1
  if (c < 1) return 1 - smooth((c - 0.4) / 0.6)
  return 0
}

const contentOpacityAt = (c) => {
  if (c < -0.4) return 0
  if (c < -0.05) return smooth((c + 0.4) / 0.35)
  if (c < 0.12) return 1
  if (c < 0.5) return 1 - smooth((c - 0.12) / 0.38)
  return 0
}

const holeAt = (c) => (c < 0.2 ? -28 : -28 + 150 * smooth((c - 0.2) / 0.8))

const blurAt = (c) => {
  let b = 0
  if (c < -0.2) b = Math.min(10, (-0.2 - c) * 12)
  else if (c > 0.3) b = Math.min(14, (c - 0.3) * 20)
  return b < 0.4 ? 'none' : `blur(${b.toFixed(1)}px)`
}

export default function TunnelLayer({ index, art, children }) {
  const { cam, count } = useTunnel()

  const c = useTransform(cam, (v) => v - index)
  const scale = useTransform(c, scaleAt)
  const opacity = useTransform(c, opacityAt)
  const visibility = useTransform(opacity, (o) => (o < 0.015 ? 'hidden' : 'visible'))
  const pointerEvents = useTransform(c, (v) => (v > -0.3 && v < 0.3 ? 'auto' : 'none'))
  const filter = useTransform(c, blurAt)

  const hole = useTransform(c, holeAt)
  const holeEdge = useTransform(hole, (h) => h + 28)
  const mask = useMotionTemplate`radial-gradient(circle at 50% 50%, transparent ${hole}%, #000 ${holeEdge}%)`

  const contentOpacity = useTransform(c, contentOpacityAt)
  const contentScale = useTransform(c, (v) => 1 + v * 0.14)

  return (
    <LayerContext.Provider value={{ c, index }}>
      <motion.section
        className="absolute inset-0 overflow-hidden"
        style={{
          scale,
          opacity,
          visibility,
          pointerEvents,
          filter,
          WebkitMaskImage: mask,
          maskImage: mask,
          zIndex: count - index,
        }}
      >
        {art}
        <motion.div className="relative z-10 h-full w-full" style={{ opacity: contentOpacity, scale: contentScale }}>
          {children}
        </motion.div>
      </motion.section>
    </LayerContext.Provider>
  )
}
