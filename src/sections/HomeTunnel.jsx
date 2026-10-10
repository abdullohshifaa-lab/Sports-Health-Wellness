import { useRef } from 'react'
import TunnelScroll from '../components/TunnelScroll'
import TunnelLayer from '../components/TunnelLayer'
import TunnelArt from '../components/TunnelArt'
import ProgressRail from '../components/ProgressRail'
import ProblemCard from '../components/ProblemCard'
import { Chip, GlassButton, ScrollHint, SectionTitle } from '../components/ui'
import { useLenis, glideTo } from '../components/SmoothScroll'
import { problems } from '../data/problems'
import { diveIn, diveThrough } from '../transitions'

const palettes = {
  hero: { a: '#03141a', b: '#0e7490', c: '#34d399', d: '#bef264' },
  how: { a: '#0a0b25', b: '#4338ca', c: '#22d3ee', d: '#a78bfa' },
  pick: { a: '#07140f', b: '#0f766e', c: '#a3e635', d: '#fde047' },
}

const steps = [
  { n: '01', title: 'Tanlang', text: "Sizni bezovta qilayotgan sport yoki sog'lik muammosini belgilang." },
  { n: '02', title: "Sho'ng'ing", text: "Tanlagan muammoingiz ichiga kirib boring: sabab, qadamlar va aniq reja sizni kutadi." },
  { n: '03', title: 'Amal qiling', text: "Kunlik rejani belgilab boring va o'zgarishni o'zingiz his qiling." },
]

export default function HomeTunnel({ onSelect, startAt }) {
  const stageRef = useRef(null)
  const lenis = useLenis()

  const pick = (problem, el) => {
    // Zoom aynan bosilgan kartochka markazidan boshlanishi uchun.
    const r = el.getBoundingClientRect()
    const x = ((r.left + r.width / 2) / window.innerWidth) * 100
    const y = ((r.top + r.height / 2) / window.innerHeight) * 100
    if (stageRef.current) stageRef.current.style.transformOrigin = `${x}% ${y}%`
    onSelect(problem, { x, y })
  }

  const goToPicker = () => glideTo(lenis, document.documentElement.scrollHeight, 2.2)

  return (
    <TunnelScroll
      count={3}
      stageRef={stageRef}
      startAt={startAt}
      initial={diveIn.initial}
      animate={diveIn.animate}
      exit={diveThrough}
    >
      <ProgressRail labels={['Boshlanish', 'Qanday ishlaydi', 'Muammoni tanlang']} color="#a3e635" />

      {/* 0 — Kirish */}
      <TunnelLayer
        index={0}
        art={<TunnelArt palette={palettes.hero} shape="circle" glyph="pulse" seed={1} veil={0.2} />}
      >
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
          <Chip color="#34d399">Sports · Health · Wellness</Chip>
          <h1 className="mt-6 font-display text-[clamp(2.1rem,7.2vw,6.2rem)] font-extrabold leading-[1.02] tracking-tight text-white">
            Muammoni tanlang.
            <br />
            <span className="grad-text">Yechim — ichkarida.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[clamp(0.95rem,1.6vw,1.2rem)] leading-relaxed text-white/75">
            Sport jarohati, uyqu, suvsizlanish, ruhiy bosim — har bir muammo uchun aniq, qisqa va amaliy yechim.
            Skrol qiling: tunnel sizni ichkariga olib kiradi.
          </p>
          <div className="mt-9">
            <GlassButton primary color="#34d399" onClick={goToPicker}>
              Muammoni tanlash <span aria-hidden="true">→</span>
            </GlassButton>
          </div>
          <ScrollHint />
        </div>
      </TunnelLayer>

      {/* 1 — Qanday ishlaydi */}
      <TunnelLayer
        index={1}
        art={<TunnelArt palette={palettes.how} shape="hex" glyph="compass" glyphOpacity={0.5} seed={2} drift={{ x: -6, y: 3 }} veil={0.3} />}
      >
        <div className="flex h-full flex-col items-center justify-center px-5 pt-14">
          <SectionTitle kicker="Qanday ishlaydi" title="Uch qadamda yechim" color="#22d3ee" />
          <div className="mt-8 grid w-full max-w-5xl gap-3 md:mt-10 md:grid-cols-3 md:gap-5">
            {steps.map((s) => (
              <div key={s.n} className="glass rounded-3xl p-5 md:p-7">
                <div className="font-display text-4xl font-extrabold text-white/20 md:text-6xl">{s.n}</div>
                <h3 className="mt-2 font-display text-lg font-bold text-white md:mt-3 md:text-xl">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </TunnelLayer>

      {/* 2 — Muammoni tanlash */}
      <TunnelLayer
        index={2}
        art={<TunnelArt palette={palettes.pick} shape="square" glyph="portal" glyphOpacity={0.3} seed={3} drift={{ x: 5, y: -3 }} veil={0.34} />}
      >
        <div className="flex h-full flex-col items-center justify-center px-3 pb-4 pt-16 md:px-6 md:pt-20">
          <SectionTitle kicker="Muammoni tanlang" title="Qaysi muammo sizni qiynayapti?" color="#a3e635" />
          <div className="mt-5 grid w-full max-w-6xl grid-cols-2 gap-2.5 md:mt-8 md:grid-cols-4 md:gap-4">
            {problems.map((p, i) => (
              <ProblemCard key={p.id} problem={p} index={i} onSelect={pick} />
            ))}
          </div>
          <p className="mt-4 max-w-xl text-center text-[11px] leading-snug text-white/45 md:mt-6 md:text-xs">
            Ma'lumotlar umumiy xarakterga ega va shifokor maslahatini almashtirmaydi.
          </p>
        </div>
      </TunnelLayer>
    </TunnelScroll>
  )
}
