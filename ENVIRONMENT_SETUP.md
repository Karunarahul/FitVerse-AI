# FITVERSE AI — ENVIRONMENT SETUP GUIDE

This guide details how to configure, set up, and launch the upgraded **FitVerse AI** application with Supabase PostgreSQL and Google Gemini AI services.

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher
- **Package Manager**: `npm` (v9+) or `bun`
- **Expo CLI**: Installed globally or via `npx expo`
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

### 2.2 Supabase PostgreSQL Database & Auth
1. Log in to [Supabase](https://supabase.com/) and create a new project (Free Tier).
2. Once the project is provisioned, navigate to **Project Settings** > **API**.
3. Copy the **Project URL** and the **anon/public key**.
4. Navigate to the **SQL Editor** in your Supabase dashboard:
   - Open [`DATABASE_SCHEMA.sql`](./DATABASE_SCHEMA.sql).
   - Paste the contents into the SQL Editor and execute.
   - This creates all 16 tables, foreign keys, indexes, Row Level Security (RLS) policies, and starter exercises/foods.

---

## 3. Environment Variables Configuration

Create a `.env` file in the project root:

```env
# 1. Google Gemini AI API Configuration (Server-Side)
GEMINI_API_KEY=your_gemini_api_key_here

# 2. OpenAI API Configuration (Server-Side Fallback)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL_PRIMARY=gpt-4o
OPENAI_MODEL_FAST=gpt-4o-mini

# 3. Supabase Configuration (Client & Backend)
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# 4. Server Execution Mode
DEMO_MODE=false
PORT=3001
```

> **Security Note**: Never expose `GEMINI_API_KEY`, `OPENAI_API_KEY`, or the Supabase `service_role` key in client source code. Client uses only `EXPO_PUBLIC_SUPABASE_ANON_KEY` which is protected by PostgreSQL Row Level Security (RLS).

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
[FitVerse AI Server] Demo mode: false
[FitVerse AI Server] Gemini configured: true
[FitVerse AI Server] OpenAI configured: true
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

## 5. Offline & Fallback Resiliency
FitVerse AI includes deterministic local fallback generators for:
- Food macronutrient calculations and Indian food composition.
- AI Personal Coach guidance (if offline or rate-limited).
- Local storage caching via AsyncStorage if Supabase network access is unavailable.
