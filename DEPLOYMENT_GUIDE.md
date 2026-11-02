# FITVERSE AI — PRODUCTION DEPLOYMENT GUIDE

This guide details the deployment of the FitVerse AI mobile client and backend intelligence server utilizing free-tier and production cloud infrastructure.

---

## 1. Cloud Architecture Overview

```
[ Mobile App (Expo SDK 57 / React Native 0.86) ]
        │
        ├─── Direct HTTPS (RLS Protected) ───► [ Supabase PostgreSQL & Auth ]
        │                                      (Tables: 16, RLS, Storage Buckets, Time-Series Biometrics)
        │
        └─── AI & Vision Endpoints (JWT Auth) ► [ Node.js Express Proxy (Free Tier: Render/Railway) ]
                                                        │
                                                        ├──► [ Google Gemini 1.5 Flash API (Primary) ]
                                                        └──► [ OpenAI GPT-4o / GPT-4o-mini (Fallback) ]
```

---

## 2. Supabase Free-Tier Deployment

1. **Create Free Project**:
   - Register at [supabase.com](https://supabase.com).
   - Create a new project in your preferred region.
2. **Execute Database Migrations**:
   - Navigate to the Supabase **SQL Editor**.
   - Copy the complete script from [`DATABASE_SCHEMA.sql`](./DATABASE_SCHEMA.sql) (or [`supabase/migrations/20261102_initial_production_schema.sql`](./supabase/migrations/20261102_initial_production_schema.sql)).
   - Execute the SQL script. This sets up all 16 tables, foreign keys, triggers, idempotent Row Level Security policies, and seeds starter exercises and food data.
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
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
3. Add Environment Variables in Render Dashboard:
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `OPENAI_API_KEY`: Your OpenAI API key (optional fallback).
   - `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase URL (for server-side JWT verification).
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key.
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin permanent account deletion).
   - `PORT`: `3001`
4. Update `EXPO_PUBLIC_API_BASE_URL` in your mobile app environment with your live Render URL:
   ```env
   EXPO_PUBLIC_API_BASE_URL=https://fitverse-ai-server.onrender.com
   ```

---

## 4. Mobile Client Deployment (EAS Build)

### 4.1 Prerequisites
```bash
npm install -g eas-cli
eas login
```

### 4.2 EAS Configuration (`eas.json`)
The project includes a pre-configured [`eas.json`](./eas.json) file:
```json
{
  "cli": {
    "version": ">= 12.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 4.3 Build Android APK (Installable Directly on Any Phone)
Create a standalone Android APK without requiring a Google Play Developer account:
```bash
eas build --platform android --profile preview
```
- EAS Cloud will compile the APK.
- Download the resulting `.apk` link to any Android phone and install directly.

### 4.4 Build Android AAB (Google Play Store Release)
```bash
eas build --platform android --profile production
```

### 4.5 Build iOS Simulator or Internal Distribution
```bash
eas build --platform ios --profile preview
```

---

## 5. Security & Secret Verification Checklist

- [x] No `GEMINI_API_KEY` in mobile client source code.
- [x] No `OPENAI_API_KEY` in mobile client source code.
- [x] No Supabase `service_role` key in mobile client.
- [x] Backend routes `/api/ai/*`, `/api/workout/*`, and `/api/user/*` strictly verify Supabase JWTs.
- [x] Rate limiting active on AI routes (30 requests/minute).
- [x] Transparent labeling: Offline estimation notice displayed when AI vision is unreachable; metabolic model label on calorie burn.
- [x] `.env` is verified in `.gitignore` and omitted from git history.
- [x] PostgreSQL Row Level Security (RLS) is active and idempotent on all 16 tables.
