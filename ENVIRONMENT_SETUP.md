# FITVERSE AI — ENVIRONMENT SETUP GUIDE

This guide details how to configure, set up, and launch the production-ready **FitVerse AI** application with Supabase PostgreSQL, Google Gemini AI, and OpenAI hybrid architecture.

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher (v25+ supported)
- **Package Manager**: `npm` (v9+)
- **Expo CLI**: Installed via `npx expo`
- **Mobile Device**: Expo Go app installed on iOS or Android, or an active simulator/emulator

---

## 2. API & Service Keys Setup

### 2.1 Google Gemini AI (Hybrid Personal Coach & Vision Nutritionist)
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Create an API Key for the Gemini API.
3. FitVerse AI utilizes `gemini-1.5-flash` for high-speed, cost-conscious conversational coaching and meal image recognition.
4. Set the key in your server environment:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### 2.2 OpenAI API (Intelligence Fallback)
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys).
2. Create an API key and set it in your server environment:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### 2.3 Supabase PostgreSQL Database & Auth
1. Log in to [Supabase](https://supabase.com/) and create a new project (Free Tier).
2. Navigate to **Project Settings** > **API**.
3. Copy the **Project URL**, the **anon/public key**, and the **service_role secret key** (for server only).
4. Navigate to the **SQL Editor** in your Supabase dashboard:
   - Open [`DATABASE_SCHEMA.sql`](./DATABASE_SCHEMA.sql).
   - Paste the contents into the SQL Editor and execute.
   - This creates all 16 tables, foreign keys, indexes, idempotent Row Level Security (RLS) policies, and starter exercises/foods.

---

## 3. Environment Variables Configuration

Create a `.env` file in the project root based on `.env.example`:

```env
# --------------------------------------------------------------------
# 1. CLIENT CONFIGURATION (Expo Public — Bundled in Mobile Client)
# --------------------------------------------------------------------
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
EXPO_PUBLIC_DEMO_MODE=false

# --------------------------------------------------------------------
# 2. SERVER CONFIGURATION (Backend Only — NEVER Exposed to Client)
# --------------------------------------------------------------------
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL_PRIMARY=gpt-4o
OPENAI_MODEL_FAST=gpt-4o-mini
OPENAI_MODEL_REASONING=o1-mini
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

> **Security Note**: Never expose `GEMINI_API_KEY`, `OPENAI_API_KEY`, or `SUPABASE_SERVICE_ROLE_KEY` in client source code. Mobile client utilizes only `EXPO_PUBLIC_SUPABASE_ANON_KEY` and passes user JWT Bearer tokens to the Express API server.

---

## 4. Launching the Application

### Step A: Start the Backend AI & Vision Server
In your first terminal:
```bash
npm run server
# or: node server/index.js
```
The server will initialize on `http://localhost:3001` and output:
```text
[FitVerse AI Server] running on http://localhost:3001
[FitVerse AI Server] Rate limiter: 30 req/min
[FitVerse AI Server] Gemini configured: true
[FitVerse AI Server] OpenAI configured: true
[FitVerse AI Server] Supabase JWT auth: enabled
```

### Step B: Start the Expo Mobile Client
In your second terminal:
```bash
npx expo start
```
- Press `a` to launch on connected Android device / emulator.
- Press `i` to launch on iOS simulator.
- Or scan the displayed QR code with your phone using **Expo Go**.

---

## 5. Running the Automated Test Suite

To verify fitness calculations, metabolic equations, and input validators:
```bash
npm test
```
Runs 11 unit tests covering BMR, TDEE, macro distribution, Indian portion scaling (150g basmati rice = 195 kcal), and email/password validators.
