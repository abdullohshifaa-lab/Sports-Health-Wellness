import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SmoothScrollProvider, useLenis, glideTo } from './components/SmoothScroll'
import { PointerProvider } from './components/PointerContext'
import SpeedLines from './components/SpeedLines'
import { rgba } from './components/TunnelArt'
import HomeTunnel from './sections/HomeTunnel'
import SolutionTunnel from './sections/SolutionTunnel'

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 64 64" className="h-9 w-9" aria-hidden="true">
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#34d399" />
            <stop offset="1" stopColor="#bef264" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="26" fill="none" stroke="url(#logo-g)" strokeWidth="3" opacity=".55" />
        <circle cx="32" cy="32" r="15" fill="none" stroke="url(#logo-g)" strokeWidth="3" opacity=".85" />
        <path
          d="M8 34h11l5-13 8 24 5-11h19"
          fill="none"
          stroke="url(#logo-g)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="hidden font-display text-[11px] font-semibold uppercase leading-tight tracking-[0.18em] text-white/85 sm:block">
        Sports Health
        <br />
        &amp; Wellness
      </span>
    </div>
  )
}

function Header({ inSolution, onBack }) {
  const lenis = useLenis()
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 md:px-8 md:py-5">
      <div className="pointer-events-auto">
        <Logo />
      </div>
      <div className="pointer-events-auto">
        {inSolution ? (
          <button
            type="button"
            onClick={onBack}
            className="glass rounded-full px-4 py-2 text-xs font-bold tracking-wide text-white transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:text-sm"
          >
            ← Muammolar
          </button>
        ) : (
          <button
            type="button"
            onClick={() => glideTo(lenis, document.documentElement.scrollHeight, 2.2)}
            className="glass rounded-full px-4 py-2 text-xs font-bold tracking-wide text-white transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:text-sm"
          >
            Muammolar
          </button>
        )}
      </div>
    </header>
  )
}

// Muammo tanlanganda ekran bo'ylab o'tadigan rangli "portal" chaqnashi.
function Flash({ flash, onDone }) {
  return (
    <motion.div
      key={flash.key}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{
        background: `radial-gradient(circle at ${flash.x}% ${flash.y}%, ${rgba(flash.color, 0.95)} 0%, ${rgba(flash.color, 0.5)} 24%, transparent 58%)`,
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: [0, 1, 0], scale: [0.6, 1.5, 2.4] }}
      transition={{ duration: 1.5, times: [0, 0.55, 1], ease: 'easeInOut' }}
      onAnimationComplete={onDone}
    />
  )
}

function Shell() {
  const [problem, setProblem] = useState(null)
  const [homeStart, setHomeStart] = useState('start')
  const [flash, setFlash] = useState(null)
  const busy = useRef(false)

  const lock = (ms) => {
    busy.current = true
    setTimeout(() => {
      busy.current = false
    }, ms)
  }

  const select = (p, origin) => {
    if (busy.current) return
    lock(2300)
    setFlash({ key: Date.now(), color: p.palette.c, x: origin?.x ?? 50, y: origin?.y ?? 50 })
    setProblem(p)
  }

  const back = () => {
    if (busy.current) return
    lock(1900)
    setHomeStart('end')
    setFlash({ key: Date.now(), color: '#a3e635', x: 50, y: 50 })
    setProblem(null)
  }

  return (
    <>
      <Header inSolution={!!problem} onBack={back} />
      <SpeedLines />
      <AnimatePresence mode="wait">
        {problem ? (
          <SolutionTunnel key={problem.id} problem={problem} onBack={back} />
        ) : (
          <HomeTunnel key="home" onSelect={select} startAt={homeStart} />
        )}
      </AnimatePresence>
      {flash && <Flash flash={flash} onDone={() => setFlash(null)} />}
    </>
  )
}

export default function App() {
  return (
    <SmoothScrollProvider>
      <PointerProvider>
        <Shell />
      </PointerProvider>
    </SmoothScrollProvider>
  )
}
