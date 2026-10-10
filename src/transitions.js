// Ko'rinishlar orasidagi "sho'ng'ish" animatsiyalari.

const easeOutExpo = [0.16, 1, 0.3, 1]

// Tunnelga kirish (sahifa ochilganda yoki yechimdan qaytganda).
export const diveIn = {
  initial: { scale: 1.35, opacity: 0, filter: 'blur(10px)' },
  animate: {
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transitionEnd: { filter: 'none' },
    transition: { duration: 1.1, ease: easeOutExpo },
  },
}

// Tanlangan muammoning ichiga zoom qilib kirib ketish (bosilgan kartochkadan boshlab).
export const diveThrough = {
  scale: 9,
  opacity: 0,
  filter: 'blur(14px)',
  transition: {
    default: { duration: 0.95, ease: [0.55, 0, 0.9, 0.35] },
    opacity: { duration: 0.5, delay: 0.45, ease: 'easeIn' },
  },
}

// Yechim tunneli markazdan "uzoqdan" uchib keladi.
export const emerge = {
  initial: { scale: 0.3, opacity: 0, filter: 'blur(14px)' },
  animate: {
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transitionEnd: { filter: 'none' },
    transition: { duration: 1.2, delay: 0.1, ease: easeOutExpo },
  },
}

// Orqaga qaytishda yechim tunneli uzoqlashib ketadi.
export const retreat = {
  scale: 0.25,
  opacity: 0,
  filter: 'blur(12px)',
  transition: { duration: 0.8, ease: [0.6, 0, 0.9, 0.4] },
}
