import { createContext, useContext, useLayoutEffect, useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useLenis, jumpTo } from './SmoothScroll'

const TunnelContext = createContext(null)
export const useTunnel = () => useContext(TunnelContext)

/*
  TunnelScroll — saytning yuragi.

  Oddiy sahifa pastga siljimaydi. Buning o'rniga:
    1) ko'rinmas baland "spacer" brauzer skrolini beradi,
    2) ustida esa ekranga qotirilgan "stage" turadi,
    3) skrol progressi `cam` (kamera) qiymatiga aylanadi: 0 → count-1,
    4) har bir qatlam (TunnelLayer) kameradan qancha uzoqligiga qarab kattalashadi / kichrayadi.

  Natija: siz qatlamning ichiga zoom qilib kirib borasiz, u esa ortda qoladi va
  keyingi qatlam tunnel teshigidan paydo bo'ladi.
*/
export default function TunnelScroll({
  count,
  stepVh = 95,
  startAt = 'start',
  stageRef,
  initial,
  animate,
  exit,
  children,
}) {
  const spacerRef = useRef(null)
  const lenis = useLenis()

  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ['start start', 'end end'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 220, damping: 34, mass: 0.4 })
  const cam = useTransform(smooth, [0, 1], [0, count - 1])

  // Yangi tunnel ochilganda skrol joyini boshiga (yoki oxiriga) qo'yamiz.
  useLayoutEffect(() => {
    const y = startAt === 'end' ? document.documentElement.scrollHeight : 0
    jumpTo(lenis, y)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <TunnelContext.Provider value={{ cam, count, stepVh }}>
      <div
        ref={spacerRef}
        aria-hidden="true"
        style={{ height: `calc(100vh + ${(count - 1) * stepVh}vh)` }}
      />
      <motion.div
        ref={stageRef}
        className="fixed inset-0 overflow-hidden bg-ink"
        initial={initial}
        animate={animate}
        exit={exit}
      >
        {children}
      </motion.div>
    </TunnelContext.Provider>
  )
}
