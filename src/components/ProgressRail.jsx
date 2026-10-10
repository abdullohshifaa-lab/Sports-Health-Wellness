import { useState } from 'react'
import { useMotionValueEvent } from 'framer-motion'
import { useTunnel } from './TunnelScroll'
import { useLenis, glideTo } from './SmoothScroll'

// O'ng tomondagi nuqtalar: hozir qaysi qatlamdasiz va bosib to'g'ridan-to'g'ri o'tish mumkin.
export default function ProgressRail({ labels, color = '#34d399' }) {
  const { cam, stepVh } = useTunnel()
  const lenis = useLenis()
  const [active, setActive] = useState(0)

  useMotionValueEvent(cam, 'change', (v) => setActive(Math.round(v)))

  const go = (i) => glideTo(lenis, (i * stepVh * window.innerHeight) / 100)

  return (
    <nav aria-label="Bo'limlar" className="absolute right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-3 md:right-6">
      {labels.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => go(i)}
          aria-label={label}
          aria-current={active === i}
          title={label}
          className="group relative flex h-4 w-4 items-center justify-center focus:outline-none"
        >
          <span
            className="block rounded-full transition-all duration-300"
            style={{
              width: active === i ? 10 : 6,
              height: active === i ? 10 : 6,
              background: active === i ? color : 'rgba(255,255,255,0.4)',
              boxShadow: active === i ? `0 0 14px ${color}` : 'none',
            }}
          />
          <span className="pointer-events-none absolute right-6 hidden whitespace-nowrap rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 md:block">
            {label}
          </span>
        </button>
      ))}
    </nav>
  )
}
