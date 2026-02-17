# KebunKU App Completed!

I have built the **KebunKU** application based on your requirements. It is a modern, minimalist garden management tool with the following features:

## Features Implemented

- **Google Authentication**: Secure login using Firebase Auth.
- **Dynamic Theme System**: Choose from Emerald, Blue, Indigo, Rose, or Amber color schemes.
- **Hierarchical Plant Management**: Organize plants by Group (Buah, Bunga, etc.) -> Category (Mangga, Anggur) -> Variety (Jupiter, Arumanis).
- **Advanced Activity Logging**:
    - **Pencatatan Produk**: Mencatat nama produk (pupuk/pestisida) yang digunakan.
    - **Bulk Logging (Borongan)**: Mencatat aktivitas sekaligus untuk kategori atau kelompok tanaman.
    - **Upload Foto**: Sekarang Anda bisa langsung mengambil/upload foto kondisi tanaman. Foto akan tersimpan di Firebase Storage dan bisa dilihat di riwayat (klik foto untuk membesarkan).
    - **Treatment Detail**: Bidang khusus untuk Dosis, Volume, dan Metode aplikasi.
    - **Kondisi Cuaca**: Mencatat cuaca saat melakukan aktivitas.
- **Activity Timeline**: Riwayat aktivitas yang detail dengan informasi produk dan target (varietas/kategori/kelompok).

## Project Structure

- `src/contexts/`: Terdiri dari Provider dan Context definition yang terpisah untuk mendukung Vite Fast Refresh.
- `src/hooks/`: Custom hooks (`useAuth`, `usePlants`, `useActivities`) untuk akses state yang lebih bersih.
- `src/services/`: Logika interaksi dengan Firestore.
- `src/components/`: Komponen UI reusable.

## How to Get Started

> [!IMPORTANT]
> **Firebase Setup Required**
> 1. Enable **Google Authentication** di bagian Authentication.
> 2. Buat **Firestore Database** dalam mode test.
> 3. Aktifkan **Firebase Storage** (di bagian Storage) agar fitur upload foto bisa berfungsi.
> 4. Daftarkan **Web App** di pengaturan proyek dan salin konfigurasi `firebaseConfig`.
> 5. Konfigurasi API Key di [src/firebase.ts](file:///c:/Users/cube/Desktop/anti05/KebunKU/src/firebase.ts) harus sesuai dengan proyek Anda.

## Running the App

Untuk menjalankan server pengembangan:
```bash
npm run dev
```

Aplikasi dapat diakses di `http://localhost:5173`.
Layar putih saat startup telah diperbaiki dengan penambahan sistem loading dan perbaikan sinkronisasi Auth.
