# GREEN ENERGY — Hemat Energi untuk Masa Depan

Website kampanye edukasi **Hemat Energi dan Green Technology Focus** yang memadukan Landing Page informatif dengan fitur **AI Konsultan Green Tech** yang terhubung ke workflow **n8n AI Agent** melalui backend Node.js/Express.

---

## Arsitektur Sistem

```
Website (React + TypeScript)
        ↓  POST /api/consultation
Backend Server (Node.js + Express)
        ↓  POST N8N_WEBHOOK_URL (server-side only)
n8n Webhook Trigger
        ↓
AI Agent — Konsultan Green Tech (OpenAI Chat Model + Simple Memory + Calculator + Google Sheets)
        ↓
Respond to Webhook
        ↓  JSON { "reply": "..." }
Backend Server → Website Chatbot Widget
```

---

## Fitur Utama

1. **Landing Page Kampanye GREEN ENERGY**:
   - Navbar responsif dengan menu mobile dan CTA **Mulai Konsultasi**.
   - Hero section bertema energi terbarukan dan keberlanjutan.
   - Bagian Tentang Kampanye, Edukasi Hemat Energi (dengan tips tambahan interaktif), Green Technology, Produk & Solusi Hemat Energi (contoh kategori dengan filter & tombol *Tanyakan kepada AI*), Roadmap 3 Tahap, Manfaat Kampanye, dan struktur Testimoni siap pakai.
2. **AI Konsultan Green Tech**:
   - Widget chatbot mengambang di pojok kanan bawah.
   - Pengelolaan `sessionId` konsisten selama sesi konsultasi berlangsung (plus tombol **Sesi Baru**).
   - 5 tombol pertanyaan cepat, indikator loading, validasi input, dan penanganan error yang ramah pengguna.
   - Pemberitahuan pencatatan percakapan untuk evaluasi layanan.
3. **Backend API Terproteksi**:
   - `POST /api/consultation` memvalidasi input, membatasi panjang pesan (maks. 1000 karakter), menerapkan rate limit dasar, timeout request, serta meneruskan pesan ke `N8N_WEBHOOK_URL` tanpa mengekspos URL maupun kredensial ke frontend.
   - `GET /api/catalog` menyediakan struktur kategori contoh yang mudah dikembangkan untuk menarik data langsung dari API katalog n8n di masa mendatang.
   - `GET /api/health` memeriksa kesiapan server dan status konfigurasi webhook secara aman.

---

## Cara Menjalankan Secara Lokal

1. **Pasang dependensi**:
   ```bash
   npm install
   ```
2. **Siapkan environment variable**:
   Salin `.env.example` menjadi `.env` lalu isi `N8N_WEBHOOK_URL` dengan Production Webhook URL dari workflow n8n Anda:
   ```env
   N8N_WEBHOOK_URL=https://domain-n8n-anda.com/webhook/konsultasi-green-energy
   N8N_TIMEOUT_MS=25000
   ```
3. **Jalankan mode pengembangan**:
   ```bash
   npm run dev
   ```
   Aplikasi berjalan di `http://localhost:3000`.
4. **Build untuk produksi**:
   ```bash
   npm run build
   NODE_ENV=production npm start
   ```

---

## Konfigurasi di Google AI Studio Build Mode

1. Buka panel **Settings → Secrets** di Google AI Studio.
2. Tambahkan secret baru dengan nama:
   - `N8N_WEBHOOK_URL` → isi dengan **Production URL** dari node **Webhook** pada workflow n8n Anda.
   - (Opsional) `N8N_TIMEOUT_MS` → batas waktu tunggu dalam milidetik (default `25000`).
3. Mulai ulang server aplikasi. Apabila `N8N_WEBHOOK_URL` belum diisi, widget chatbot akan otomatis menampilkan pesan informatif bahwa fitur konsultasi sedang dalam tahap konfigurasi.

---

## Panduan Menghubungkan Workflow n8n (Tanpa Mengganggu Jalur Telegram)

Workflow Telegram yang sudah ada (**Telegram Trigger → AI Agent → Telegram Send a Text Message**) tetap dipertahankan. Untuk menambahkan jalur Website:

1. **Tambahkan Node `Webhook`**:
   - **HTTP Method**: `POST`
   - **Path**: misalnya `green-energy-consultation`
   - **Response Mode**: `Using 'Respond to Webhook' Node`
2. **Payload JSON yang dikirim oleh backend website**:
   ```json
   {
     "message": "Bagaimana cara menghemat listrik di rumah?",
     "sessionId": "ge_abc123...",
     "source": "website"
   }
   ```
3. **Hubungkan ke `AI Agent — Konsultan Green Tech`**:
   - Pastikan **Prompt / Text** pada AI Agent membaca pesan dari Telegram maupun Webhook (misalnya menggunakan ekspresi fallback seperti `{{ $json.body?.message || $json.message?.text }}`).
   - Pastikan **Session ID** pada **Simple Memory** juga membedakan sesi website dan Telegram (misalnya `{{ $json.body?.sessionId || $json.message?.chat?.id }}`).
   - Pertahankan seluruh tools yang terhubung: **OpenAI Chat Model**, **Simple Memory**, **Calculator**, **Google Sheets (`Katalog_Produk`)**, dan **Google Sheets (`Catat_Log_Konsultasi`)**.
4. **Pisahkan Jalur Balasan (IF / Switch Node)**:
   - Jika sumber berasal dari Website (`source === "website"`), arahkan output AI Agent ke node **Respond to Webhook**.
   - Jika berasal dari Telegram, arahkan ke node **Telegram Send a Text Message** seperti semula.
5. **Konfigurasi Node `Respond to Webhook`**:
   - **Respond With**: `JSON`
   - **Response Body**:
     ```json
     {
       "reply": "{{ $json.output }}"
     }
     ```
   - Backend website juga otomatis mendukung properti alternatif seperti `output`, `text`, `response`, atau `message`.
6. **Aktifkan Workflow** dan salin **Production URL** Webhook ke variabel `N8N_WEBHOOK_URL`.

---

## Pengujian Unit

Jalankan unit test untuk validasi input, pengecekan URL webhook, parser respons n8n, dan formatter pesan:

```bash
npx --yes tsx --test src/lib/n8n.test.ts src/lib/formatMessage.test.ts
```
