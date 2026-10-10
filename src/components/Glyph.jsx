import { createElement, useId } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

/*
  Vektorli belgilar (viewBox 0 0 200 200).
  `progress` (0..1) — chiziqlar "chizilib" chiqish darajasi. Skrol bilan bog'langanda
  belgi tunnelga yaqinlashganingiz sari o'zi chizilib chiqadi.
*/
const GLYPHS = {
  pulse: [
    { tag: 'circle', cx: 100, cy: 100, r: 86 },
    { tag: 'path', d: 'M22 104 H62 L78 104 L90 58 L108 150 L122 88 L132 104 H178' },
  ],
  compass: [
    { tag: 'circle', cx: 100, cy: 100, r: 86 },
    { tag: 'path', d: 'M100 24 L113 87 L176 100 L113 113 L100 176 L87 113 L24 100 L87 87 Z' },
    { tag: 'circle', cx: 100, cy: 100, r: 6 },
  ],
  portal: [
    { tag: 'circle', cx: 100, cy: 100, r: 88 },
    { tag: 'circle', cx: 100, cy: 100, r: 62 },
    { tag: 'circle', cx: 100, cy: 100, r: 36 },
    { tag: 'circle', cx: 100, cy: 100, r: 10 },
  ],
  bandage: [
    { tag: 'rect', x: 18, y: 68, width: 164, height: 64, rx: 32 },
    { tag: 'rect', x: 74, y: 68, width: 52, height: 64, rx: 6 },
    { tag: 'circle', cx: 87, cy: 87, r: 3.5 },
    { tag: 'circle', cx: 113, cy: 87, r: 3.5 },
    { tag: 'circle', cx: 87, cy: 113, r: 3.5 },
    { tag: 'circle', cx: 113, cy: 113, r: 3.5 },
  ],
  stairs: [
    { tag: 'path', d: 'M18 172 H58 V136 H94 V100 H130 V64 H172' },
    { tag: 'path', d: 'M150 40 L172 64 L150 88' },
    { tag: 'circle', cx: 40, cy: 110, r: 10 },
  ],
  moon: [
    { tag: 'path', d: 'M122 34 A70 70 0 1 0 170 128 A56 56 0 0 1 122 34 Z' },
    { tag: 'path', d: 'M156 40 V58 M147 49 H165' },
    { tag: 'path', d: 'M176 82 V94 M170 88 H182' },
    { tag: 'circle', cx: 140, cy: 20, r: 3 },
  ],
  drop: [
    { tag: 'path', d: 'M100 22 C100 22 44 96 44 130 A56 56 0 0 0 156 130 C156 96 100 22 100 22 Z' },
    { tag: 'path', d: 'M72 134 A30 30 0 0 0 100 162' },
    { tag: 'path', d: 'M64 112 Q82 100 100 112 T136 112' },
  ],
  target: [
    { tag: 'circle', cx: 100, cy: 100, r: 70 },
    { tag: 'circle', cx: 100, cy: 100, r: 44 },
    { tag: 'circle', cx: 100, cy: 100, r: 18 },
    { tag: 'path', d: 'M100 14 V44 M100 156 V186 M14 100 H44 M156 100 H186' },
  ],
  dumbbell: [
    { tag: 'path', d: 'M56 100 H144' },
    { tag: 'rect', x: 36, y: 64, width: 20, height: 72, rx: 7 },
    { tag: 'rect', x: 144, y: 64, width: 20, height: 72, rx: 7 },
    { tag: 'rect', x: 18, y: 80, width: 18, height: 40, rx: 6 },
    { tag: 'rect', x: 164, y: 80, width: 18, height: 40, rx: 6 },
  ],
  apple: [
    { tag: 'path', d: 'M100 62 C80 44 40 54 42 106 C44 150 74 182 100 170 C126 182 156 150 158 106 C160 54 120 44 100 62 Z' },
    { tag: 'path', d: 'M100 62 C100 44 106 32 120 22' },
    { tag: 'path', d: 'M120 28 C138 22 150 30 152 44 C136 50 123 44 120 28 Z' },
  ],
  spine: [
    { tag: 'path', d: 'M100 30 Q128 62 108 100 T86 170' },
    { tag: 'ellipse', cx: 100, cy: 30, rx: 22, ry: 9 },
    { tag: 'ellipse', cx: 114, cy: 53, rx: 22, ry: 9 },
    { tag: 'ellipse', cx: 118, cy: 77, rx: 22, ry: 9 },
    { tag: 'ellipse', cx: 108, cy: 100, rx: 22, ry: 9 },
    { tag: 'ellipse', cx: 92, cy: 123, rx: 22, ry: 9 },
    { tag: 'ellipse', cx: 82, cy: 147, rx: 22, ry: 9 },
    { tag: 'ellipse', cx: 86, cy: 170, rx: 22, ry: 9 },
  ],
}

// Butun belgini burish kerak bo'lsa (masalan, bint) — guruh darajasida beriladi.
const GROUP_TRANSFORM = {
  bandage: 'rotate(-35 100 100)',
}

function Part({ part, progress }) {
  const { tag, ...rest } = part
  const fillOpacity = useTransform(progress, [0.6, 1], [0, 0.1])
  const El = motion[tag]
  return createElement(El, { ...rest, style: { pathLength: progress, fillOpacity } })
}

export default function Glyph({ name, progress, colors, className = '', strokeWidth = 2.2 }) {
  const fallback = useMotionValue(1)
  const p = progress ?? fallback
  const uid = useId().replace(/:/g, '')
  const parts = GLYPHS[name] || GLYPHS.portal
  const c = colors || { c: '#34d399', d: '#a3e635' }

  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`g-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.c} />
          <stop offset="1" stopColor={c.d} />
        </linearGradient>
      </defs>
      <g
        stroke={`url(#g-${uid})`}
        fill={c.c}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={GROUP_TRANSFORM[name]}
      >
        {parts.map((part, i) => (
          <Part key={i} part={part} progress={p} />
        ))}
      </g>
    </svg>
  )
}
