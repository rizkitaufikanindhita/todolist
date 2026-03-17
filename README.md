# Hari Ini — Daily To-Do

Aplikasi to-do list harian minimalis. Data tersimpan di localStorage browser.

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- Tidak ada dependency tambahan

## Deploy ke Vercel

### Cara 1 — Via GitHub (Rekomendasi)

1. Upload folder ini ke repository GitHub baru
2. Buka [vercel.com](https://vercel.com) → New Project
3. Import repository GitHub tersebut
4. Klik **Deploy** — selesai, tidak perlu konfigurasi apapun

### Cara 2 — Via Vercel CLI

```bash
npm i -g vercel
cd daily-todo
vercel
```

## Development Lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Fitur

- Tambah task (Enter atau klik +)
- Centang task selesai
- Hapus task satu per satu
- Progress bar otomatis
- Reset semua task dengan konfirmasi
- Dark mode otomatis
- Data tersimpan di localStorage
