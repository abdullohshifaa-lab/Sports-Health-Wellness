import { createContext, useContext, useEffect, useMemo } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

const PointerContext = createContext(null)

// Sichqoncha (yoki qurilma) harakati bo'yicha -1..1 oralig'idagi x/y qiymatlari.
// Tunnel fonlari shu qiymat bilan sal siljib, parallaks (chuqurlik) hissini kuchaytiradi.
export function PointerProvider({ children }) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.6 })
  const y = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.6 })

  useEffect(() => {
    const onMove = (e) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1)
      rawY.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [rawX, rawY])

  const value = useMemo(() => ({ x, y }), [x, y])
  return <PointerContext.Provider value={value}>{children}</PointerContext.Provider>
}

export const usePointer = () => useContext(PointerContext)
