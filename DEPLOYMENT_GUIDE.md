# FITVERSE AI — PRODUCTION DEPLOYMENT GUIDE

This guide details the deployment of the FitVerse AI mobile client and backend intelligence server utilizing free-tier cloud infrastructure.

---

## 1. Cloud Architecture Overview

```
[ Mobile App (Expo SDK 52) ]
        │
        ├─── Direct HTTPS (RLS Protected) ───► [ Supabase PostgreSQL & Auth ]
        │                                      (Tables: 16, RLS, Storage Buckets)
        │
        └─── AI & Vision Endpoints ──────────► [ Node.js Express Proxy (Free Tier) ]
                                                        │
                                                        └──► [ Google Gemini 1.5 API ]
```

---

## 2. Supabase Free-Tier Deployment

1. **Create Free Project**:
   - Register at [supabase.com](https://supabase.com).
   - Create a new project in your preferred region.
2. **Execute Database Migrations**:
   - Navigate to the Supabase **SQL Editor**.
   - Copy the complete script from [`DATABASE_SCHEMA.sql`](./DATABASE_SCHEMA.sql).
   - Execute the SQL script. This sets up all 16 tables, foreign keys, triggers, and Row Level Security policies.
3. **Storage Bucket Setup**:
   - In Supabase Dashboard, go to **Storage** > **New Bucket**.
   - Create a bucket named `progress_photos` with private access.
   - Add RLS policy:
     ```sql
     CREATE POLICY "User Photo Access" ON storage.objects
     FOR ALL TO authenticated
     USING (bucket_id = 'progress_photos' AND auth.uid()::text = (storage.foldername(name))[1]);
     ```

---

## 3. Backend Proxy Deployment (Render / Railway Free Tier)

Deploy `server/index.js` to a free-tier Node container (e.g., Render, Railway, or Fly.io).

### Option A: Render Free Web Service
1. Connect your GitHub repository: `https://github.com/Karunarahul/FitVerse-AI`.
2. Configure settings:
   - **Root Directory**: `server` (or run from root with `npm run server`)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
3. Add Environment Variables in Render Dashboard:
   - `GEMINI_API_KEY`: Your Gemini API key.
   - `OPENAI_API_KEY`: Your OpenAI API key (optional fallback).
   - `PORT`: `3001`
4. Update `src/services/api.ts` with your live Render URL:
   ```typescript
   export const API_BASE_URL = 'https://fitverse-ai-server.onrender.com';
   ```

---

## 4. Mobile Client Deployment (EAS Build)

### 4.1 Prerequisites
```bash
npm install -g eas-cli
eas login
```

### 4.2 Initialize EAS
```bash
eas build:configure
```

### 4.3 Build Android APK (Direct Testing)
Create an installable standalone Android APK without needing Google Play Store console:
```bash
eas build --platform android --profile preview
```
- EAS Cloud will compile the APK.
- Download the resulting `.apk` link to any Android phone and install directly.

### 4.4 Build Android AAB (Google Play Store Release)
```bash
eas build --platform android --profile production
```

### 4.5 Build iOS Simulator or App Store Build
```bash
eas build --platform ios --profile preview
```

---

## 5. Security & Secret Verification Checklist

- [x] No `GEMINI_API_KEY` in mobile client source files.
- [x] No `OPENAI_API_KEY` in mobile client source files.
- [x] No Supabase `service_role` key in mobile client.
- [x] `.env` is verified in `.gitignore` and omitted from git history.
- [x] PostgreSQL Row Level Security (RLS) is active on all 16 tables.
