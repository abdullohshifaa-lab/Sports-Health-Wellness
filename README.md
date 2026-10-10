# Sports Health & Wellness Solution

React (Vite) + Tailwind CSS + Framer Motion + Lenis. Skrol orqali 3D tunnelga sho'ng'iydigan, muammo → yechim saytı.

## Ishga tushirish

Node.js 18+ kerak.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production uchun
```

## Qanday ishlaydi

- **Bosh sahifa tunneli**: Kirish → Qanday ishlaydi → Muammoni tanlash. Skrol qilganingizda qatlamlar kattalashib, markazida teshik ochilib, bir-birining ichiga kirib boradi.
- **Muammo tanlash**: kartochkani bosing — ekran aynan o'sha kartochka markazidan zoom qilib ichkariga kiradi.
- **Yechim tunneli** (6 qatlam): Muammo → Sabab → Birinchi qadamlar → Kunlik reja (belgilab boriladi, saqlanadi) → Xatolar → Shifokorga qachon murojaat qilish.

## Sozlash

- Muammolar va yechimlar: `src/data/problems.js` (yangi obyekt qo'shsangiz, sayt o'zi quradi).
- O'z rasmingizni fon qilish: rasmni `public/images/` ga qo'ying va `problems.js` da `photo: '/images/nom.jpg'` deb yozing, so'ng `src/sections/SolutionTunnel.jsx` dagi `Art` komponentiga `photo={problem.photo}` qo'shing.
- Tunnel fizikasi (zoom tezligi, xiralashish): `src/components/TunnelLayer.jsx`.
- Skrol uzunligi: `TunnelScroll` ning `stepVh` qiymati.

## Eslatma

Ma'lumotlar umumiy xarakterda va shifokor maslahatini almashtirmaydi.
