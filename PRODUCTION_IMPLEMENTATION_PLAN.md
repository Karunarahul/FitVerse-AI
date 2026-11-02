# FITVERSE AI — PRODUCTION IMPLEMENTATION PLAN

**Branch:** `production-hardening`  
**Goal:** Transform FitVerse AI into a secure, hardened, fully persistent, deployable mobile fitness platform.

---

## Phase 1: Authentication Security & Session Integrity
1. **Refactor `src/services/supabase.ts`**:
   - Provide strict Supabase Auth operations: `signUp`, `signIn`, `signOut`, `resetPassword`, `getSession`, `fetchProfile`, `saveProfile`.
   - Never generate fake JWTs or fabricated users when Supabase is unconfigured or unreachable.
   - Return clean, actionable error messages directly from Supabase Auth (e.g., Invalid login credentials, Email not confirmed, Weak password).
2. **Refactor `src/services/auth.ts`**:
   - Eliminate all silent fallbacks to `demoUser` during real login/registration.
   - `getSession()` must invoke `supabase.auth.getSession()` and validate active expiration.
   - Maintain explicit development-only demo mode (`isDemoModeActive()` based on `EXPO_PUBLIC_DEMO_MODE === 'true'`).
3. **Refactor `src/stores/authStore.ts`**:
   - Expose genuine loading, authenticated, and error states.
   - Support `resetPassword(email)` and `deleteAccount()`.
4. **Update Auth Screens (`login.tsx`, `signup.tsx`, `welcome.tsx`)**:
   - Clear out hardcoded demo credentials from inputs.
   - Display real alert error messages from Supabase Auth upon failure.
   - In `signup.tsx`, ensure the user-entered password is provided to `authStore.register(name, email, password)`.

---

## Phase 2: Backend Security & Verification (`server/index.js`)
1. **Install Dependencies**:
   - `express-rate-limit` for DDoS / brute-force protection on AI and auth endpoints.
2. **Add Middleware**:
   - `verifySupabaseJwt`: Validates `Authorization: Bearer <token>` using Supabase client / JWT verification.
   - Rejects unauthenticated requests with HTTP 401 Unauthorized.
   - Injects `req.user` with verified user UUID; never trust client-supplied `user_id`.
3. **Add Public Endpoints**:
   - `GET /health` and `GET /api/health`: Returns `{ status: 'healthy', timestamp, uptime, services: { gemini, openai, supabase } }`.
4. **Protect Private Routes**:
   - Attach `verifySupabaseJwt` to `/api/ai/coach/chat`, `/api/ai/food/recognize`, `/api/ai/generate-plan`, `/api/ai/adapt-plan`, `/api/ai/swap-meal`, `/api/workout/complete`, `/api/user/profile`, `/api/user/account`.
5. **Add Server-Side Account Deletion**:
   - `DELETE /api/user/account`: Authenticated route deleting user from `user_profiles` and calling `supabase.auth.admin.deleteUser(userId)`.

---

## Phase 3: Supabase Database Idempotence & Schema Hardening
1. **Refactor `DATABASE_SCHEMA.sql`**:
   - Ensure all 16 tables are created with `IF NOT EXISTS`.
   - Use idempotent policies: `DROP POLICY IF EXISTS ... ON ...; CREATE POLICY ...`.
   - Ensure shared master tables (`exercises`, `food_database`) permit `SELECT` to authenticated users, but disallow `INSERT`, `UPDATE`, `DELETE` except by `service_role`.
2. **Create Database Migration File**:
   - Create `supabase/migrations/20261102_initial_production_schema.sql` so Supabase CLI / migrations run seamlessly.

---

## Phase 4: Real Nutrition Tracking & Persistence
1. **Create `src/services/nutritionDb.ts`**:
   - `logFoodItem(userId, mealData)`: Inserts into `public.food_logs`.
   - `fetchDailyFoodLogs(userId, date)`: Retrieves confirmed meals for the selected date.
   - `deleteFoodLog(logId)`: Removes logged meal.
   - `logWaterIntake(userId, amountLiters)`: Inserts into `public.water_logs`.
   - `fetchDailyWaterTotal(userId, date)`: Aggregates sum of water consumed.
2. **Update `src/stores/nutritionStore.ts` & `src/app/nutrition/log.tsx`**:
   - Upon clicking "Confirm & Log to Protocol", save meal directly to Supabase `food_logs`.
   - Add offline fallback caching in AsyncStorage with pending sync queue.
   - Ensure `addHydration` writes to Supabase `water_logs`.

---

## Phase 5: Real Workout Tracking & Progressive Overload
1. **Create `src/services/workoutDb.ts`**:
   - `saveWorkoutSession(userId, sessionData)`: Inserts row into `public.workout_sessions` and returns `session.id`.
   - `saveWorkoutSets(sessionId, userId, sets)`: Batch inserts into `public.workout_sets`.
   - `fetchWorkoutHistory(userId)`: Retrieves historical sessions.
2. **Update `src/stores/workoutStore.ts` & `src/app/workout/live.tsx`**:
   - `finishWorkout()` invokes `workoutDb.saveWorkoutSession` and `workoutDb.saveWorkoutSets` with actual completed weights, reps, and sets.
   - Display honest indicators (label simulated heart rate / calorie models clearly).

---

## Phase 6: Hybrid AI Architecture & Honest Food Recognition
1. **Model Validation**:
   - Ensure `server/index.js` uses `gemini-1.5-flash` with structured JSON prompt.
   - OpenAI fallback (`gpt-4o-mini`) if Gemini fails.
2. **Transparent Reporting**:
   - When vision API is offline or returns error, inform the user with an explicit notice instead of presenting a fake AI analysis.

---

## Phase 7: Production API Client (`src/services/api.ts`)
1. **Environment Configuration**:
   - Read `process.env.EXPO_PUBLIC_API_BASE_URL` with graceful fallback to `localhost:3001` or `10.0.2.2:3001` in local dev.
2. **Automatic Bearer Token**:
   - Retrieve current Supabase access token and append `Authorization: Bearer ${token}` to all outgoing API requests.
3. **Timeout & Error Handling**:
   - Set timeout to 15 seconds.
   - Handle network failures with user-friendly error objects.

---

## Phase 8: Profile & Account Management
1. **Edit Profile Modal**:
   - Add interactive Edit Modal in `src/app/(app)/profile.tsx` allowing users to edit weight, height, target weight, goal, and experience.
   - Persist changes to `user_profiles` and insert a record into `body_metrics`.
2. **Delete Account Flow**:
   - Add "Delete Account" action in `src/app/settings.tsx` with confirmation dialog calling `/api/user/account`.

---

## Phase 9: Deployment Configuration (`eas.json`)
1. **Author `eas.json`**:
   - `development`: Development build with client debugging.
   - `preview`: Standalone Android APK for direct device installation without Play Console.
   - `production`: Android App Bundle (AAB) and iOS archive.
2. **Update `.env.example`**:
   - Document `EXPO_PUBLIC_API_BASE_URL`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`.

---

## Phase 10: Testing, Verification & Delivery
1. **Static Checks**:
   - `npx tsc --noEmit`
   - `npx expo lint`
2. **Unit Tests**:
   - Implement test suite verifying nutritional calculations, validation, and token handling.
3. **Produce Documentation**:
   - Update `DEPLOYMENT_GUIDE.md` and `ENVIRONMENT_SETUP.md`.
   - Update `TESTING_REPORT.md` with detailed test results.
