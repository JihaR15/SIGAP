# SIGAP — Sistem Informasi Gangguan dan Audit Perusahaan

[![Production Live](https://img.shields.io/badge/Production-Live-success?style=flat-square)](https://sigap.duckdns.org/)
[![Framework Next.js](https://img.shields.io/badge/Frontend-Next.js-blue?style=flat-square)](https://nextjs.org/)
[![Backend Node.js](https://img.shields.io/badge/Backend-Express.js-green?style=flat-square)](https://expressjs.com/)
[![Database MySQL](https://img.shields.io/badge/Database-MySQL-orange?style=flat-square)](https://www.mysql.com/)

SIGAP adalah platform manajemen insiden, log aktivitas, dan audit perusahaan berbasis web modern. Sistem ini dirancang khusus untuk mendeteksi, mencatat, dan mengaudit setiap gangguan operasional perusahaan secara *real-time*.

Arsitektur sistem mengadopsi konsep *Single Page Application* (SPA)  yang lincah, interaktif, dan dioptimalkan untuk lingkungan produksi *cloud environment*.

---

## 🌐 Akses Aplikasi

Aplikasi telah diimplementasikan penuh pada infrastruktur produksi dan dapat diakses secara daring:

➡️ **[https://sigap.duckdns.org/](https://sigap.duckdns.org/)**

---

## 🚀 Fitur Utama

| Fitur | Deskripsi |
| :--- | :--- |
| **Dashboard Insiden Real-time** | Memantau metrik gangguan operasional secara langsung lengkap dengan indikator status aktif |
| **Smart Sorting Algorithm** | Pengurutan otomatis memprioritaskan isu `CRITICAL` & `WARNING` (status `OPEN`/`INVESTIGATING`). Log `INFO` atau `RESOLVED` diletakkan di bawah agar operasional fokus pada kendala utama |
| **Manajemen Log Gangguan** | Pengelolaan pelaporan insiden berdasarkan tingkat keparahan: `INFO`, `WARNING`, `CRITICAL` |
| **Audit Trails Komprehensif** | Pencatatan otomatis setiap aksi pengguna, termasuk data sebelum & sesudah perubahan dalam format JSON |
| **Autentikasi Berbasis Peran** | Pemisahan hak akses antara peran **Manager** dan **Operator** untuk menjaga integritas data |
| **Arsitektur Hybrid SPA** | Pemuatan awal cepat berkat SSR Next.js yang dipadukan dengan kelincahan CSR |

---

## 🛠️ Tech Stack

| Layer | Teknologi |
| :--- | :--- |
| **Frontend** | Next.js (React) — mode `standalone build` |
| **Backend API** | Node.js & Express.js |
| **Database** | MySQL |
| **Web Server** | Nginx (Reverse Proxy) |
| **Process Manager** | PM2 |
| **SSL/HTTPS** | Let's Encrypt (Certbot) |
| **DNS** | DuckDNS |

---

## 📦 Instalasi & Menjalankan Lokal

### Prasyarat

Pastikan perangkat lunak berikut sudah terinstal:

```bash
node -v   # v20.x atau lebih baru
npm -v
mysql -V
```

### 1. Clone Repositori

```bash
git clone https://github.com/JihaR15/SIGAP.git
cd SIGAP
```

### 2. Konfigurasi Environment

**Backend** — buat file `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sigap_db
PORT=3001
```

**Frontend** — buat file `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Setup Database

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS sigap_db;"
mysql -u root -p sigap_db < database.sql
```

### 4. Jalankan Backend

```bash
cd backend
npm install
node index.js
```

### 5. Jalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplikasi berjalan di `http://localhost:3000`.

---

## ☁️ Deployment Produksi (PM2 + Nginx)

### Backend

```bash
cd /var/www/sigap-app/backend
npm install
pm2 start index.js --name "sigap-backend"
```

### Frontend (Standalone Mode)

```bash
cd /var/www/sigap-app/frontend
npm install
npm run build

# Salin aset statis
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

# Jalankan dengan PM2
cd .next/standalone
PORT=3000 pm2 start server.js --name "sigap-frontend"
```

### Simpan Konfigurasi PM2

```bash
pm2 save
pm2 startup
```

### Konfigurasi Nginx

```nginx
server {
    listen 80;
    server_name sigap.duckdns.org;

    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/sigap /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

---

## 📈 Spesifikasi Infrastruktur

Aplikasi dioptimalkan untuk berjalan stabil pada spesifikasi minimal, bahkan di bawah target awal tanpa mengurangi performa.

| Komponen | Target (Greenfields) | Aktual (AWS EC2 t3.micro) | Catatan |
| :--- | :--- | :--- | :--- |
| **Sistem Operasi** | Ubuntu 22.04 LTS | Ubuntu 24.04.4 LTS | Lebih baru & stabil |
| **CPU** | 1 Core | Intel Xeon Platinum 8259CL (1 vCPU) | Sesuai target |
| **RAM** | 2 GB | 1 GB | Efisiensi 50% |
| **Swap Memory** | — | 3 GB | Buffer saat proses build |

---

## 📁 Struktur Proyek


```
├── backend
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── incident.js
│   │   └── user.js
│   ├── routes
│   │   └── index.js
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   └── simulator.js
├── frontend
│   ├── public
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── src
│   │   ├── app
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components
│   │   │   ├── CriticalBanner.tsx
│   │   │   ├── DashboardMetrics.tsx
│   │   │   ├── DashboardView.tsx
│   │   │   ├── DeleteModal.tsx
│   │   │   ├── DetailModal.tsx
│   │   │   ├── IncidentForm.tsx
│   │   │   ├── IncidentTable.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── NewIncidentAction.tsx
│   │   │   ├── PaginationControls.tsx
│   │   │   ├── RestoreModal.tsx
│   │   │   ├── TableFilters.tsx
│   │   │   └── TableTabs.tsx
│   │   └── lib
│   │       └── api.ts
│   ├── .gitignore
│   ├── README.md
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   └── tsconfig.json
├── .gitignore
├── README.md
└── database.sql
```
---

## 📄 Lisensi

Proyek ini dikembangkan sebagai bagian dari Tugas Seleksi Intern pada PT Greenfields Indonesia.

@2026 - Jiha Ramdhan.