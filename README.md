<p align="center">
  <a href="https://github.com/redkurawa/kebunku">
    <img src="https://capsule-render.vercel.app/api?type=waving&color=0:10b981,100:059669&height=300&section=header&text=KebunKU&fontSize=90&animation=fadeIn&fontAlignY=35&desc=Digital%20Garden%20Diary%20%E2%9C%A1%EF%B8%8F&descAlignY=55&descAlign=Center" width="100%" alt="KebunKU Header"/>
  </a>
</p>

<div align="center">

![GitHub Stars](https://img.shields.io/github/stars/redkurawa/kebunku?style=flat&color=10b981&label=Stars&logo=github)
![GitHub Forks](https://img.shields.io/github/forks/redkurawa/kebunku?style=flat&color=059669&label=Forks&logo=github)
![GitHub Issues](https://img.shields.io/github/issues/redkurawa/kebunku?style=flat&color=34d399&label=Issues&logo=github)
![GitHub License](https://img.shields.io/github/license/redkurawa/kebunku?style=flat&color=6ee7b7&label=License&logo=github)
![Vite](https://img.shields.io/badge/Vite-5.0-646cff?style=flat&logo=vite)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-ffca28?style=flat&logo=firebase)

---

**🌿 KebunKU - Digital Garden Diary** adalah aplikasi manajemen taman digital yang sangat canggih dan berkinerja tinggi, dirancang untuk pecinta tanaman yang menuntut presisi dan keunggulan estetika. Dibangun dengan stack teknologi modern dan fokus pada simetri visual, KebunKU mengubah cara Anda melacak pertumbuhan dan pemeliharaan taman Anda.

[![View Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here%20→-10b981?style=for-the-badge&logo=lifecycle)](https://kebunku.vercel.app)
[![Watch Tutorial](https://img.shields.io/badge/Watch%20Tutorial-YouTube-ff0000?style=for-the-badge&logo=youtube)](https://youtube.com)

</div>

---

## ✨ Mengapa KebunKU? (Why KebunKU?)

<table>
<tr>
<td>

### 🎯 Masalah yang Dipecahkan

Kebanyakan aplikasi taman terasa **kuno, berantakan, dan tidak intuitif**. Kami hadir untuk mengubahnya:

| Masalah Biasa                   | Solusi KebunKU                                     |
| :------------------------------ | :------------------------------------------------- |
| 📋 Catatan kertas yang hilang   | ☁️ Backup cloud otomatis dengan Firestore          |
| 🔍 Susah cari data tanaman lama | 🔎 Sistem filter canggih di timeline               |
| 🎨 Tampilan monoton             | 🎭 4 tema berbeda (Orange, Teal, Slate, Stone)     |
| 📷 Foto tidak tertata           | 🖼️ Upload **multiple** foto sekaligus via Cloudinary |
| 📱 Tidak responsif              | 📐 Layout simetris & responsive (Equal-Width Tabs) |

</td>
</tr>
</table>

---

## 🚀 Fitur Utama (Primary Features)

### 👤 Sistem Profil & Tema Tingkat Lanjut

| Fitur                    | Deskripsi                                                                                                              |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| **Unified User Menu**    | Menu dropdown kepadatan tinggi yang menggabungkan info profil, switching tema, dan logout aman                         |
| **Quad-Tone Variations** | Pilih antara **Orange** 🔶, **Teal** 🔷, **Slate** ⬛, dan **Stone** 🪨 tema untuk menyesuaikan estetika personal Anda |
| **Session Persistence**  | Pilihan tema Anda langsung disimpan ke `localStorage`, memastikan pengalaman konsisten setiap kali kembali             |

### 📏 Layout Dashboard Simetris

```
+----------------------------------------------------------------------+
|                        KEBUNKU DASHBOARD                             |
+----------------------------------------------------------------------+
|  +--------+  +--------+  +--------+                                  |
|  | Catat  |  |Riwayat |  |Tanaman |  <- Tab Switching                |
|  +--------+  +--------+  +--------+                                  |
+----------------------------------------------------------------------+
|                                                                      |
|  +----------------------------------------------------------------+  |
|  |                                                                |  |
|  |                    Fixed-Width 800px Container                 |  |
|  |                    "Magazine Feel" Layout                      |  |
|  |                                                                |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
+----------------------------------------------------------------------+
```

- **Fixed-Width Precision**: Container utama **800px** yang ketat menghindari pergeseran layout, memberikan nuansa "majalah" yang stabil
- **Equal-Width Tabs**: Menu navigasi "+ Catat", "Riwayat", dan "Tanaman" memiliki lebar yang sama pada desktop, menciptakan alignment yang sempurna.
- **Dynamic Tabs**: Pindah instan antara **Catat** (Recording), **Riwayat** (History), dan **Tanaman** (Collection) tanpa lompatan visual
- **Standardized Padding**: Spacing card internal 1.5rem yang seragam menciptakan alignment matematika sempurna di semua komponen UI
- **Mobile First**: Tombol aksi (seperti "Tambah Tanaman") secara cerdas berpindah ke bawah judul pada mobile view untuk menghemat ruang.

### 🪴 Koleksi Tanaman Cerdas

```
📁 Koleksi Saya
├── 🍎 Kelompok: Buah
│   ├── 🌳 Mangga
│   │   ├── Arumanis
│   │   ├── Harum Manis
│   │   └── Gedong Gincu
│   ├── 🥭 Jeruk
│   │   ├── Keprok
│   │   └── Siam
│   └── 🍌 Pisang
│       ├── Ambon
│       └── Kepok
├── 🌿 Kelompok: Sayuran
│   ├── 🥬 Kangkung
│   ├── 🥒 Timun
│   └── 🍆 Terong
└── 🌸 Kelompok: Bunga
    ├── 🌺 Mawar
    └── 🌻 Matahari
```

- **Hierarchical Organization**: Urutkan taman Anda berdasarkan **Kelompok** (mis. Buah), **Kategori** (mis. Mangga), dan **Varietas** (mis. Arumanis)
- **Edit & Purge**: Kapabilitas CRUD penuh untuk mengubah nama varietas atau menghapus tanaman yang sudah tidak aktif
- **Quick Discovery**: Grup yang dapat diciutkan memungkinkan Anda menavigasi koleksi tanaman terbesar dengan mudah
- **No-Scroll Mobile UI**: Mengganti tabel dengan sistem kartu (card-based), memastikan tidak ada scrollbar horizontal yang mengganggu di HP.

### 📝 Logging Aktivitas Profesional

- **Smart Forms**: Input yang beradaptasi berdasarkan jenis aktivitas (mis. menampilkan Dosage/Volume hanya untuk treatment)
- **New Types**: Dukungan untuk aksi khusus seperti **"Tanaman Baru"**, **"Pisah Anakan"**, dan **"Lainnya"**
- **Data Integrity**: Sistem **Auto-Trim** dan **Case-Insensitive Deduplication** memastikan data kategori dan varietas tetap bersih dan konsisten tanpa duplikat yang mengganggu.
- **Improved UX**: Saran kategori otomatis (datalist) saat menambah tanaman baru berdasarkan grup yang dipilih.
- **Multi-Photo Monitoring**: Upload banyak foto sekaligus dalam satu aktivitas via Cloudinary. Foto ditampilkan dalam grid yang indah di timeline.

### 🔍 Filter Timeline yang Powerful

- **Isolate & Analyze**: Gunakan filter bar tier-atas di riwayat Anda untuk melihat hanya tugas tertentu (mis. hanya tampilkan catatan Fertilizer)
- **Horizontal Scroll UI**: Sistem chip yang responsif mobile untuk filtering cepat tanpa memakan ruang vertikal

---

## 🛠️ Tech Stack Masterpiece

<div align="center">

| Technology        | Role                                                 | Badge                                                                                                 |
| :---------------- | :--------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| **Vite + React**  | Foundation frontend yang super cepat                 | ![Vite](https://img.shields.io/badge/Vite-5.0-646cff?style=flat-square&logo=vite)                     |
| **TypeScript**    | Memastikan type safety dan keandalan tingkatrock     | ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)   |
| **Firebase Auth** | Integrasi Google Sign-In standar industri            | ![Firebase Auth](https://img.shields.io/badge/Firebase%20Auth-ffca28?style=flat-square&logo=firebase) |
| **Firestore**     | Database NoSQL cloud-sync real-time untuk data taman | ![Firestore](https://img.shields.io/badge/Firestore-ffa726?style=flat-square&logo=firebase)           |
| **Cloudinary**    | CDN global untuk upload dan optimalisasi foto        | ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448c5?style=flat-square)                       |
| **Lucide React**  | Sistem ikon yang konsisten dan indah                 | ![Lucide](https://img.shields.io/badge/Lucide-10b981?style=flat-square)                               |
| **Vanilla CSS**   | Styling murni dan optimal tanpa bloat framework      | ![CSS](https://img.shields.io/badge/Vanilla%20CSS-264de4?style=flat-square&logo=css3)                 |

</div>

---

## 📸 Screenshots

<div align="center">

|                                  Dashboard                                  |                              Plant Collection                              |                               Activity Timeline                               |
| :-------------------------------------------------------------------------: | :------------------------------------------------------------------------: | :---------------------------------------------------------------------------: |
| ![Dashboard](https://placehold.co/400x300/10b981/white?text=Dashboard+View) | ![Plants](https://placehold.co/400x300/059669/white?text=Plant+Collection) | ![Timeline](https://placehold.co/400x300/34d399/white?text=Activity+Timeline) |
|                                  **Login**                                  |                               **Plant Form**                               |                                **Mobile View**                                |
|     ![Login](https://placehold.co/400x300/6ee7b7/white?text=Login+Page)     |   ![Form](https://placehold.co/400x300/047857/white?text=Add+Plant+Form)   |  ![Mobile](https://placehold.co/400x300/065f46/white?text=Mobile+Responsive)  |

</div>

> **📌 Catatan Screenshot**: Saat ini menampilkan placeholder. Ganti dengan screenshot asli setelah diambil!

---

### 📷 Cara Mengambil Screenshot

Ikuti langkah berikut untuk membuat screenshot yang profesional:

#### 1. Screenshot dengan Snipping Tool (Windows)

| Tombol            | Aksi                                                 |
| :---------------- | :--------------------------------------------------- |
| `Win + Shift + S` | Buka Snipping Tool, pilih area yang ingin di-capture |
| `Win + PrtScn`    | Langsung simpan full screen ke folder Screenshots    |

#### 2. Screenshot dengan VS Code

```bash
# Menggunakan command palette
Ctrl + Shift + P -> "Screenshot"
# Atau gunakan ekstensi seperti "Screenshot" atau "Polacode"
```

#### 3. Upload ke GitHub

```bash
#Cara 1: Upload langsung di GitHub
1. Buka repository di github.com
2. Buka folder /docs atau /assets
3. Drag & drop file gambar
4. Copy URL hasil upload

#Cara 2: Gunakan imgbb.com (Gratis, mudah)
1. Buka https://imgbb.com
2. Upload screenshot
3. Copy direct link
```

#### 4. Format yang Disarankan

| Spesifikasi   | Nilai                                              |
| :------------ | :------------------------------------------------- |
| **Format**    | PNG atau JPG                                       |
| **Ukuran**    | 400x300 pixel (untuk tabel di atas)                |
| **Quality**   | 80-90% untuk balance kualitas & ukuran             |
| **Nama file** | `dashboard.png`, `plants.png`, `timeline.png`, dll |

#### 5. Ganti URL di README

Setelah upload, ganti link placeholder dengan link asli:

```markdown
# Sebelum (placeholder):

![Dashboard](https://placehold.co/400x300/10b981/white?text=Dashboard+View)

# Sesudah (screenshot asli):

![Dashboard](/docs/screenshots/dashboard.png)

# atau

![Dashboard](https://i.imgbb.com/xxxxx/dashboard.png)
```

---

### 🎯 Screenshot yang Diperlukan

Berikut list screenshot yang perlu Anda ambil untuk melengkapi README:

| No  | Halaman                     | Deskripsi                                   | Nama File               |
| :-- | :-------------------------- | :------------------------------------------ | :---------------------- |
| 1   | **Login Page**              | Tampilan halaman login dengan tombol Google | `login.png`             |
| 2   | **Dashboard - Tab Catat**   | Form input aktivitas tanaman                | `dashboard-catat.png`   |
| 3   | **Dashboard - Tab Riwayat** | Timeline aktivitas dengan filter            | `dashboard-riwayat.png` |
| 4   | **Dashboard - Tab Tanaman** | Koleksi tanaman tersusun                    | `dashboard-tanaman.png` |
| 5   | **Plant Form**              | Form tambah/edit tanaman                    | `plant-form.png`        |
| 6   | **Mobile View**             | Tampilan responsive di HP                   | `mobile-view.png`       |
| 7   | **Theme Selection**         | Contoh tema berbeda (Teal/Slate)            | `theme-example.png`     |

---

## 🏗️ Architecture Map

```bash
KebunKU/
├── public/                      # Static assets (favicon, images)
├── src/
│   ├── components/              # UI Components
│   │   ├── ActivityForm.tsx    # Form untuk logging aktivitas tanaman
│   │   ├── Layout.tsx          # Layout utama dengan sidebar & header
│   │   ├── PlantForm.tsx       # Form CRUD tanaman
│   │   ├── PlantManager.tsx    # Manager koleksi tanaman
│   │   ├── ProtectedRoute.tsx  # Route yang memerlukan autentikasi
│   │   └── Timeline.tsx        # Komponen timeline aktivitas
│   ├── contexts/               # React Contexts untuk Global State
│   │   ├── ActivityContext.ts  # State management aktivitas
│   │   ├── AuthContext.ts      # State management autentikasi
│   │   └── PlantContext.ts     # State management tanaman
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useActivities.ts    # Hook untuk konsumsi service aktivitas
│   │   ├── useAuth.ts          # Hook untuk service autentikasi
│   │   └── usePlants.ts        # Hook untuk service tanaman
│   ├── services/               # Logic Layer
│   │   ├── activityService.ts  # Interaksi Firebase untuk aktivitas
│   │   └── plantService.ts     # Interaksi Firebase untuk tanaman
│   ├── pages/                  # Halaman Utama
│   │   ├── Dashboard.tsx       # Halaman dashboard utama
│   │   └── LoginPage.tsx      # Halaman login
│   ├── App.tsx                 # Komponen utama aplikasi
│   ├── firebase.ts             # Konfigurasi Firebase utama
│   ├── main.tsx                # Entry point React
│   └── index.css               # Design system global & theme tokens
├── .eslint.config.js           # Konfigurasi ESLint
├── tsconfig.json               # Konfigurasi TypeScript
├── vite.config.ts              # Konfigurasi Vite
├── package.json                # Dependencies & scripts
└── README.md                   # 📍 Anda sedang di sini!
```

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/redkurawa/kebunku.git
cd kebunku

# Install dependencies
npm install

# atau jika preferensi yarn
yarn install
```

### 2. Konfigurasi Firebase

Buat file `.env` di root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **💡 Tips:** Buka [Firebase Console](https://console.firebase.google.com) untuk membuat project baru dan mendapatkan kredensial ini.

### 3. Konfigurasi Cloudinary (Opsional untuk Foto)

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser Anda! 🎉

---

## 🎯 Roadmap Masa Depan

<div align="center">

| Status | Feature                          | Deskripsi                                     |
| :----: | :------------------------------- | :-------------------------------------------- |
|   🔮   | **Automated Watering Reminders** | Pengingat penyiraman otomatis berbasis jadwal |
|   🤖   | **Plant Health AI Diagnosis**    | Diagnosis kesehatan tanaman menggunakan AI    |
|   🌐   | **Social Garden Sharing**        | Bagikan taman Anda ke komunitas               |
|   📊   | **Analytics Dashboard**          | Dashboard analitik pertumbuhan tanaman        |
|   🎮   | **Gamification**                 | Sistem achievement dan level untuk gardener   |
|   🌦️   | **Weather Integration**          | Integrasi data cuaca untuk rekomendasi        |
|   📱   | **PWA Support**                  | Install sebagai aplikasi native               |
|   🔔   | **Push Notifications**           | Notifikasi untuk perawatan mendesak           |

</div>

---

## 🤝 Kontribusi (Contributing)

Kami sangat welcomes kontribusi dari komunitas! Berikut cara berpartisipasi:

### Cara Berkontribusi

1. **Fork** repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan Anda (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka **Pull Request**

### Guidelines

- Pastikan kode Anda mengikuti kode etik yang ada
- Write tests untuk fitur baru jika memungkinkan
- Dokumentasikan perubahan API jika ada
- Gunakan commit message yang deskriptif

---

## 📝 Lisensi

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 🙏 Acknowledgments

Terima kasih kepada semua kontributor dan resource yang membuat project ini mungkin:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite](https://vitejs.dev) - Untuk development experience yang amazing
- [Lucide React](https://lucide.dev) - Untuk ikon yang beautiful
- [Cloudinary](https://cloudinary.com) - Untuk solusi image management
- [React](https://react.dev) - Untuk UI library yang powerful
- **Semua gardener** yang telah memberikan feedback dan dukungan! 🌿

---

<div align="center">

### 🌟 Jangan Lupa Beri Bintang! 🌟

Jika Anda menyukai KebunKU, please ⭐ star repository ini dan share ke teman-teman gardener Anda!

_Dibuat dengan ❤️ dan dedikasi untuk gardener modern._

---

**KebunKU** - Crafted with passion for the modern gardener 🌿✨

![Footer](https://capsule-render.vercel.app/api?type=waving&color=0:10b981,100:059669&height=100&section=footer)

</div>
