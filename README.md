# Izin Pintar - Generator Surat Izin Otomatis

PWA (Progressive Web App) untuk membuat surat izin otomatis dengan Firebase cloud sync.

## 🚀 Fitur

- ✅ **Generator Surat Izin Otomatis** - Template profesional untuk berbagai jenis izin
- 📅 **Manajemen Jadwal Mengajar** - Input dan kelola jadwal untuk auto-fill surat izin
- 📝 **Template Editor** - Kustomisasi template sesuai kebutuhan
- 📂 **Riwayat Izin** - Simpan dan cari riwayat izin yang pernah dibuat
- 🔐 **Firebase Auth & Sync** - Login dan sinkronisasi data antar device
- 👨‍💼 **Admin Dashboard** - Monitoring pengguna dan aktivitas (untuk admin)
- 🌙 **Dark Mode** - Antarmuka yang nyaman untuk mata
- 📱 **PWA Support** - Install di device dan gunakan offline
- 🔄 **Real-time Sync** - Data tersinkron otomatis ke cloud

## 📋 Prerequisites

- Node.js (v16 atau lebih baru)
- npm atau yarn
- Akun Firebase (gratis)

## 🛠️ Setup & Installation

### 1. Clone Repository

```bash
git clone https://github.com/iksanarisandi/izinpintar.git
cd izinpintar
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Buat project baru atau gunakan existing project
3. Enable **Authentication** (Email/Password)
4. Enable **Firestore Database** (Start in test mode)
5. Copy Firebase configuration dari Project Settings

### 4. Setup Environment Variables

1. Copy file `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` dan isi dengan Firebase credentials Anda:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Setup Firestore Security Rules

Di Firebase Console > Firestore Database > Rules, gunakan rules berikut:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /analytics/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 6. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### 7. Build untuk Production

```bash
npm run build
```

File hasil build akan ada di folder `dist/`

## 🔒 Keamanan

- ⚠️ **JANGAN** commit file `.env.local` ke repository
- ✅ Semua credentials disimpan di environment variables
- ✅ Firebase Security Rules membatasi akses per user
- ✅ Admin access dikontrol via email whitelist di `App.tsx`

## 👨‍💼 Setup Admin Access

Edit file `App.tsx` baris 20, ganti dengan email Anda:

```typescript
const ADMIN_EMAIL = "your-email@gmail.com";
```

## 📱 Deploy ke Netlify

### Option 1: Deploy via Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Option 2: Deploy via Netlify Dashboard

1. Login ke [Netlify](https://netlify.com)
2. Import repository dari GitHub
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Environment variables: Tambahkan semua `VITE_*` dari `.env.local`
5. Deploy!

## 🎯 Penggunaan

### Pertama Kali:
1. Buka aplikasi
2. Pilih "Simpan di Cloud" untuk fitur sync
3. Daftar/Login dengan email
4. Lengkapi profil Anda
5. Tambahkan jadwal mengajar (opsional)

### Membuat Surat Izin:
1. Pilih tipe izin
2. Pilih tanggal
3. Isi alasan
4. Preview hasil
5. Salin atau simpan ke riwayat

### Kustomisasi Template:
1. Buka tab "Template"
2. Pilih template yang ingin diedit
3. Edit menggunakan variabel `{{nama}}`, `{{date}}`, dll
4. Simpan

## 🤝 Contributing

Pull requests are welcome! Untuk perubahan besar, mohon buka issue terlebih dahulu.

## 📄 License

MIT License - lihat file LICENSE untuk detail

## 👨‍💻 Author

**Iksan Arisandi**
- GitHub: [@iksanarisandi](https://github.com/iksanarisandi)

---

Made with ❤️ using React, TypeScript, Vite, and Firebase
