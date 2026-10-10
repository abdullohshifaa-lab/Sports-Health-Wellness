import { createContext, useContext, useEffect, useState } from 'react'
import Lenis from 'lenis'

const LenisContext = createContext(null)

// Lenis — yumshoq (inersiyali) skrol. U brauzerning oddiy skrolini silliqlaydi,
// shuning uchun klaviatura, sensorli ekran va skrol-bar odatdagidek ishlaydi.
export function SmoothScrollProvider({ children }) {
  const [lenis, setLenis] = useState(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return undefined

    const instance = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.95,
      smoothWheel: true,
    })
    setLenis(instance)

    let frame = requestAnimationFrame(function raf(time) {
      instance.raf(time)
      frame = requestAnimationFrame(raf)
    })

    return () => {
      cancelAnimationFrame(frame)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

export const useLenis = () => useContext(LenisContext)

// Sahifani darhol (animatsiyasiz) berilgan joyga qo'yadi.
export function jumpTo(lenis, y) {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
  window.scrollTo(0, y)
}

// Silliq o'tish.
export function glideTo(lenis, y, duration = 1.6) {
  if (lenis) lenis.scrollTo(y, { duration, easing: (t) => 1 - Math.pow(1 - t, 3) })
  else window.scrollTo({ top: y, behavior: 'smooth' })
}
