# KebunKU App - Complete Walkthrough

Welcome to **KebunKU** - Digital Garden Diary! This comprehensive guide will help you set up and use the application.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase account (free tier)

### Installation Steps

```bash
# Clone the repository
git clone https://github.com/redkurawa/kebunku.git
cd kebunku

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your Firebase config (see below)
```

---

## 🔧 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Google Authentication** in Authentication tab
4. Create **Firestore Database** in test mode
5. Enable **Firebase Storage** for photo uploads

### 2. Get Configuration

1. Go to Project Settings > General
2. Register a Web App (</> icon)
3. Copy the `firebaseConfig` object

### 3. Configure .env File

Edit the `.env` file in project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Cloudinary (Optional - for photo uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 4. Run the App

```bash
npm run dev
```

Access the app at `http://localhost:5173`

---

## 📱 Features Overview

### Authentication

- **Google Sign-In**: Secure login with Google account
- **Protected Routes**: Dashboard only accessible after login

### Theme System

Choose from 4 beautiful themes:

- 🔶 **Orange** (Default)
- 🔷 **Teal**
- ⬛ **Slate**
- 🪨 **Stone**

Change theme from the user menu in the header.

### Plant Management

Hierarchical organization:

```
Kelompok (Group)
├── Kategori (Category)
│   └── Varietas (Variety)
│       └── Nama Alias (Optional)
```

### Activity Logging

Record plant care activities:

- 🧪 **Pupuk** (Fertilizer)
- 🛡️ **Fungisida** (Fungicide)
- 🪲 **Insektisida** (Insecticide)
- 👁️ **Monitor** (Monitoring)
- 🆕 **Tanaman Baru** (New Plant)
- ✂️ **Pangkas** (Pruning)
- 🌱 **Semai** (Sowing)
- ⚠️ **Hama/Penyakit** (Pest/Disease)
- 🧺 **Panen/Lainnya** (Harvest/Other)
- 🪴 **Pisah Anakan** (Splitting)

Each activity includes:

- Product name
- Dosage & Volume
- Application method
- Weather condition
- Photo upload (Cloudinary)
- Notes/description

### Timeline & Filters

- View all activities in chronological order
- Filter by activity type
- Photo zoom on click

---

## 📐 Responsive Design

The app is fully responsive with smooth animations:

| Screen Size          | Layout                                      |
| :------------------- | :------------------------------------------ |
| **Mobile** < 576px   | Full width, stacked layout, scrollable tabs |
| **Tablet** 576-768px | Fluid width with clamp()                    |
| **Desktop** > 768px  | Fixed 800px container                       |

### Mobile Features

- Horizontal scrollable tab navigation
- Touch-friendly buttons with feedback
- Responsive tables with horizontal scroll
- Fluid typography with CSS clamp()

---

## 🏗️ Project Structure

```
KebunKU/
├── src/
│   ├── components/         # UI Components
│   │   ├── ActivityForm.tsx    # Activity logging form
│   │   ├── Layout.tsx          # Main layout with header
│   │   ├── PlantForm.tsx       # Plant CRUD form
│   │   ├── PlantManager.tsx    # Plant collection manager
│   │   ├── ProtectedRoute.tsx  # Auth protection
│   │   └── Timeline.tsx        # Activity history
│   ├── contexts/           # React Contexts
│   ├── hooks/              # Custom hooks
│   ├── services/           # Firebase & Cloudinary services
│   ├── pages/              # Page components
│   ├── App.tsx             # Main app component
│   ├── firebase.ts         # Firebase configuration
│   └── index.css           # Global styles & responsive
├── .env.example            # Environment template
├── package.json
└── vite.config.ts
```

---

## 🔒 Security Rules

### Firestore Rules (Recommended)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Rules (Recommended)

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🛠️ Troubleshooting

### App not loading?

- Check `.env` file exists and has valid Firebase config
- Run `npm run dev` and check console for errors

### Photos not uploading?

- Verify Firebase Storage is enabled
- Check Cloudinary config in `.env` (optional)

### Authentication issues?

- Ensure Google Auth is enabled in Firebase Console
- Check that your domain is authorized (for production)

---

## 📄 License

MIT License - Feel free to use and modify!

---

**Built with ❤️ for modern gardeners** 🌿✨
