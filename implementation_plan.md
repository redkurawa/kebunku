# KebunKU Implementation Plan

KebunKU is a garden management application designed to track plant growth and maintenance activities. It features a hierarchical plant organization system and detailed activity logging, powered by Firebase for authentication and data storage.

## User Review Required

> [!IMPORTANT]
> To enable Google Login and Firestore, you will need to provide a Firebase Configuration. I will create a template, but you will need to fill in your API keys from the [Firebase Console](https://console.firebase.google.com/).

> [!NOTE]
> I'll use **Vite + React + TypeScript** for a fast and modern development experience, with **Vanilla CSS** for the styling as requested.

## Proposed Changes

### Project Foundation
- Initialize Vite project.
- Install `firebase`, `lucide-react` (for icons), and `date-fns` (for date formatting).

### Authentication
- Implement Google Auth using Firebase Authentication.
- Create a protected route system.

### Data Model (Firestore)
- `users/{uid}`: User profile.
- `plants/{plantId}`:
  - `name`: string
  - `groupId`: string (e.g., "buah", "bunga")
  - `categoryId`: string (e.g., "mangga", "anggur")
  - `variety`: string (e.g., "arumanis")
  - `ownerId`: string
- `activities/{activityId}`:
  - `plantId`: string (ID of the specific variety, or empty if bulk)
  - `targetScope`: "variety" | "category" | "group"
  - `targetValue`: string (the actual ID/name of the group or category)
  - `type`: "pupuk" | "fungisida" | "insektisida" | "monitor" | "new_comer" | "pangkas" | "semai" | "hama_penyakit" | "panen_lainnya"
  - `productName`: string (e.g., "Acrobat", "Antracol")
  - `date`: Timestamp
  - `description`: string
  - `dosis`: string
  - `volume`: string
  - `method`: "spray" | "kocor" | "tabur" | "tanam" | "lainnya"
  - `condition`: "mendung" | "cerah" | "berawan" | "hujan_deras" | "hujan_gerimis"
  - `photoUrl`: string (optional)

### User Interface
- **Theme System**: Implement a dynamic color scheme using CSS variables, allowing users to choose from various "Tailwind-like" color palettes (e.g., Emerald, Blue, Indigo, Rose).
- **Dashboard**: Summary of recent and upcoming activities.
- **Plant List**: Hierarchical view of groups -> categories -> varieties.
- **Activity Log**: Enhanced form to record activities for specific plants or bulk targets (e.g., "Semua Anggur"). Added `productName` field for treatments.
- **Photo Upload**: Integrate with Firebase Storage for monitoring photos.

## Verification Plan

### Automated Tests
- Build test: `npm run build` to ensure no TypeScript or bundling errors.

### Manual Verification
1. Verify Google Login flow.
2. Create a "Group" (e.g., Buah).
3. Add a "Category" to the group (e.g., Anggur).
4. Add a "Variety" (e.g., Jupiter).
5. Log a "Fungisida" activity for "Anggur Jupiter".
6. Verify the activity appears in the timeline.
7. Test photo upload for a "Monitor" activity.
