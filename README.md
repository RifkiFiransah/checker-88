# 🚛 Kalkulator Tonase Muatan Truk Beras (Checker88)

Aplikasi web modern untuk menghitung estimasi kapasitas, distribusi susunan karung beras, dan sisa muatan (_gantungan_) ke dalam armada box truck secara otomatis berdasarkan standar operasional logistik lapangan.

---

## ✨ Fitur Utama

- **Metode Penataan Ganda:** Mendukung metode susun **Bantalan / Tir-tiran** dan **Stapelan**.
- **Logika Bertangga Lapangan (Opsi B):** Menghitung susunan baris depan penuh (_tinggi puncak_), baris belakang standar, dan sisa karung gantung di atas baris terakhir secara presisi.
- **Preview Grafis Isometrik Interaktif:** Visualisasi 3D/isometrik SVG dari konfigurasi susunan karung di dalam bak/box truk.
- **Tabel Rincian per Baris:** Memberikan instruksi rinci jumlah pcs dan tinggi susunan dari baris 1 (depan) hingga baris terakhir (belakang).
- **Dark / Light Mode:** Dukungan penuh tema gelap dan terang yang tersinkronisasi dengan preferensi pengguna.
- **Responsif & Ringan:** Didesain optimal untuk perangkat mobile, tablet, maupun desktop.

---

## 📐 Logika & Rumus Perhitungan

Perhitungan didasarkan pada metode penataan bertahap dari depan ke belakang:

1. **Total Karung ($N$):**
   $$\text{Total Karung} = \frac{\text{Total Tonase (kg)}}{\text{Berat Kemasan per Karung (kg)}}$$

2. **Kapasitas per Layer Alas:**
   $$\text{Kapasitas Layer} = \text{Pcs Samping (Lebar)} \times \text{Pcs Belakang (Panjang)}$$

3. **Distribusi Baris & Gantungan:**
   - **Tinggi Dasar:** $\lfloor N / \text{Kapasitas Layer} \rfloor$
   - **Sisa Karung:** $N \pmod{\text{Kapasitas Layer}}$
   - **Baris Penuh (Depan):** $\lfloor \text{Sisa Karung} / \text{Pcs Samping} \rfloor$ dengan tinggi $\text{Tinggi Dasar} + 1$
   - **Gantungan (Belakang):** $\text{Sisa Karung} \pmod{\text{Pcs Samping}}$ diletakkan di atas baris terakhir.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Memulai Proyek (Local Development)

### 1. Clone Repository

```bash
git clone [https://github.com/username/checker88.git](https://github.com/username/checker88.git)
cd checker88
```

### 2. Install Dependensi

```bash
npm install
```

### 3. Jalankan Development Server

```bash
npm install
```

_Buka http://localhost:3000 di browser untuk melihat aplikasi._

## 📂 Struktur Direktori

```plaintext
checker88/
├── app/
│   ├── lib/
│   │   └── calculator.ts    # Engine logika kalkulasi muatan
│   ├── globals.css          # Setup Tailwind CSS v4 & custom variants
│   ├── layout.tsx           # Layout root Next.js
│   └── page.tsx             # Halaman utama kalkulator & visualizer
├── public/                  # Aset statis
├── tailwind.config.ts       # Konfigurasi Tailwind CSS
├── tsconfig.json            # Konfigurasi TypeScript
└── package.json             # Dependensi dan skrip proyek
```

## 📄 Lisensi

_Proyek ini didistribusikan di bawah lisensi MIT._
