import { motion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'

// Skrol tezligiga qarab markazdan tarqaluvchi nur chiziqlari — "tezlik" effekti.
export default function SpeedLines() {
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { stiffness: 90, damping: 30 })
  const opacity = useTransform(smooth, (v) => Math.min(Math.abs(v) / 2600, 1) * 0.6)
  const scale = useTransform(smooth, (v) => 1 + Math.min(Math.abs(v) / 2600, 1) * 0.25)

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 mix-blend-screen"
      style={{
        opacity,
        scale,
        background:
          'repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.16) 0deg 0.45deg, transparent 0.45deg 4.5deg)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 50%, transparent 14%, #000 72%)',
        maskImage: 'radial-gradient(circle at 50% 50%, transparent 14%, #000 72%)',
      }}
    />
  )
}
