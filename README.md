# 🌿 KebunKU - Digital Garden Diary

**KebunKU** is a sophisticated, high-performance gardening management application designed for plant enthusiasts who demand precision and aesthetic excellence. Built with a modern tech stack and a focus on visual symmetry, KebunKU transforms how you track your garden's growth and maintenance.

![KebunKU Header](https://raw.githubusercontent.com/lucide-react/lucide/main/icons/flower-2.svg)

## 🚀 Vision

To provide a seamless, clutter-free environment for gardeners to document their journey, from seed to harvest, with industrial-grade reliability and a premium user experience.

---

## ✨ Primary Features

### 👤 Advanced Profile & Theme Management
- **Unified User Menu**: A high-density dropdown menu consolidating profile info, theme switching, and secure logout.
- **Quad-Tone Variations**: Choose between **Orange**, **Teal**, **Slate**, and **Stone** themes to match your personal aesthetic.
- **Session Persistence**: Your theme selection is instantly saved to `localStorage`, ensuring a consistent experience every time you return.

### 📏 Symmetrical Dashboard Layout
- **Fixed-Width Precision**: A strictly enforced **800px** main container avoids layout shifts, providing a stable "magazine" feel.
- **Dynamic Tabs**: Instantly switch between **Catat** (Recording), **Riwayat** (History), and **Tanaman** (Collection) without visual jumps.
- **Standardized Padding**: Uniform 1.5rem internal card spacing creates perfect mathematical alignment across all UI components.

### 🪴 Intelligent Plant Collection
- **Hierarchical Organization**: Sort your garden by **Group** (e.g., Buah), **Category** (e.g., Mangga), and **Variety** (e.g., Arumanis).
- **Edit & Purge**: Full CRUD capabilities to rename varieties or remove retired plants from your collection.
- **Quick Discovery**: Collapsible groups allow you to navigate even the largest plant collections with ease.

### 📝 Professional Activity Logging
- **Smart Forms**: Context-aware inputs that adapt based on the activity type (e.g., showing Dosage/Volume only for treatments).
- **New Types**: Support for specialized actions like **"Tanaman Baru"** and **"Pisah Anakan"**.
- **Iconic Selection**: An emoji-enriched dropdown for fast, visual task identification.
- **Photo Monitoring**: Integrated with **Cloudinary** for high-definition visual tracking of your garden's progress.

### 🔍 Powerful Timeline Filters
- **Isolate & Analyze**: Use the top-tier filter bar in your history to see only specific tasks (e.g., show only Fertilizer records).
- **Horizontal Scroll UI**: A mobile-responsive chip system for rapid filtering without taking up vertical space.

---

## 🛠️ Technical Masterpiece (Tech Stack)

| Technology | Role |
| :-- | :-- |
| **Vite + React** | The lightning-fast foundation for the frontend. |
| **TypeScript** | Ensuring type safety and rock-solid reliability. |
| **Firebase Auth** | Industry-standard Google Sign-In integration. |
| **Firestore** | Real-time, cloud-synced NoSQL database for garden data. |
| **Cloudinary** | Global CDN for lightning-fast photo uploads and optimization. |
| **Lucide React** | A consistent, beautiful icon system. |
| **Vanilla CSS** | Pure, optimized styling with zero framework bloat. |

---

## 📂 Architecture Map

```bash
KebunKU/
├── src/
│   ├── components/      # UI components (Layout, ActivityForm, Timeline, etc.)
│   ├── contexts/        # React Contexts for global State (Auth, Activities, Plants)
│   ├── hooks/           # Custom React hooks for service consumption
│   ├── services/        # Logic layer (Firebase interaction, Cloudinary API)
│   ├── firebase.ts      # Core Firebase configuration
│   └── index.css        # Global design system & theme tokens
├── .gemini/             # Agentic intelligence configuration
└── README.md            # You are here 📍
```

---

## ⚙️ Setup & Installation

### 1. Clone & Install
```bash
git clone <repository-url>
cd KebunKU
npm install
```

### 2. Configure Firebase
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_id
```

### 3. Launch Development
```bash
npm run dev
```

---

## 🎯 Future Roadmap
- [ ] Automated watering reminders.
- [ ] Plant health AI diagnosis.
- [ ] Social garden sharing.

**KebunKU** - Crafted with passion for the modern gardener. 🌿✨
