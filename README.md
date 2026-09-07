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
- Task yang dicentang tersinkron ke Google Sheets

## Integrasi Google Sheets

Integrasi ini menggunakan Google Apps Script sebagai webhook. Setiap task yang dicentang akan dibuat atau diperbarui di Google Sheets. Penghapusan dan reset task tidak menghapus data di Sheet.

### 1. Siapkan Google Sheet

Buat spreadsheet dan isi baris pertama pada tab pertama dengan header berikut:

```text
Todo ID | Todo | Updated At
```

### 2. Buat Google Apps Script

Di spreadsheet, buka **Extensions → Apps Script**, lalu salin isi file `scripts/Code.gs` ke editor Apps Script.

Buka **Project Settings → Script Properties**, lalu tambahkan:

- Property: `WEBHOOK_SECRET`
- Value: secret acak yang panjang

Deploy sebagai **Web app** dengan pengaturan:

- Execute as: **Me**
- Who has access: **Anyone**

Salin URL deployment yang berakhiran `/exec`.

### 3. Konfigurasi aplikasi

Salin `.env.example` menjadi `.env.local` untuk development, lalu isi:

```env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/your-deployment-id/exec
GOOGLE_SHEETS_WEBHOOK_SECRET=secret-yang-sama-dengan-script-properties
```

Untuk Vercel, tambahkan kedua variable tersebut di **Project Settings → Environment Variables**, lalu lakukan redeploy.

Secret diteruskan dari API server ke Apps Script sehingga tidak terekspos di browser.
