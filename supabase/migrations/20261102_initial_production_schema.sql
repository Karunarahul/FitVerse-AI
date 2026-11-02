-- ====================================================================
-- SUPABASE MIGRATION: 20261102_initial_production_schema.sql
-- Application: FitVerse AI
-- Idempotent setup of tables, indexes, RLS, and seed data
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: user_profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Athlete',
    email TEXT UNIQUE NOT NULL,
    age INTEGER CHECK (age >= 10 AND age <= 120),
    gender TEXT DEFAULT 'Prefer not to say',
    height_cm NUMERIC(5,2) CHECK (height_cm > 50 AND height_cm < 300),
    current_weight_kg NUMERIC(5,2) CHECK (current_weight_kg > 20 AND current_weight_kg < 500),
    target_weight_kg NUMERIC(5,2) CHECK (target_weight_kg > 20 AND target_weight_kg < 500),
    fitness_experience TEXT DEFAULT 'Intermediate',
    primary_goal TEXT DEFAULT 'Build',
    workout_frequency INTEGER DEFAULT 4,
    workout_duration INTEGER DEFAULT 45,
    environment TEXT DEFAULT 'Commercial Facility',
    available_equipment TEXT[] DEFAULT ARRAY['Barbell', 'Dumbbells', 'Cables']::TEXT[],
    nutrition_style TEXT DEFAULT 'Omnivore',
    dietary_restrictions TEXT[] DEFAULT ARRAY[]::TEXT[],
    food_allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    injuries_limitations TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_premium BOOLEAN DEFAULT FALSE,
    streak_days INTEGER DEFAULT 0,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- Table 2: body_metrics
CREATE TABLE IF NOT EXISTS public.body_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    weight_kg NUMERIC(5,2) NOT NULL,
    body_fat_percentage NUMERIC(4,2),
    muscle_mass_kg NUMERIC(5,2),
    waist_cm NUMERIC(5,2),
    chest_cm NUMERIC(5,2),
    arms_cm NUMERIC(5,2),
    hips_cm NUMERIC(5,2),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_body_metrics_user_time ON public.body_metrics(user_id, recorded_at DESC);

-- Table 3: exercises
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    target_muscle_group TEXT NOT NULL,
    secondary_muscles TEXT[] DEFAULT ARRAY[]::TEXT[],
    equipment_required TEXT NOT NULL,
    instructions TEXT,
    video_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exercises_muscle ON public.exercises(target_muscle_group);

-- Table 4: workout_plans
CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    split_name TEXT DEFAULT 'Push-Pull-Legs',
    phase TEXT DEFAULT 'Hypertrophy Phase I',
    duration_minutes INTEGER DEFAULT 45,
    difficulty TEXT DEFAULT 'Intermediate',
    target_muscles TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_rationale TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workout_plans_user ON public.workout_plans(user_id, is_active);

-- Table 5: workout_sessions
CREATE TABLE IF NOT EXISTS public.workout_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.workout_plans(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    calories_burned INTEGER NOT NULL DEFAULT 0,
    average_heart_rate INTEGER,
    max_heart_rate INTEGER,
    perceived_exertion_rpe INTEGER CHECK (perceived_exertion_rpe >= 1 AND perceived_exertion_rpe <= 10),
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_time ON public.workout_sessions(user_id, completed_at DESC);

-- Table 6: workout_sets
CREATE TABLE IF NOT EXISTS public.workout_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    exercise_name TEXT NOT NULL,
    set_number INTEGER NOT NULL,
    weight_kg NUMERIC(6,2) NOT NULL DEFAULT 0,
    reps_completed INTEGER NOT NULL,
    rpe INTEGER,
    rest_seconds INTEGER DEFAULT 90,
    completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workout_sets_session ON public.workout_sets(session_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise ON public.workout_sets(user_id, exercise_name);

-- Table 7: food_database
CREATE TABLE IF NOT EXISTS public.food_database (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    serving_unit TEXT NOT NULL,
    default_grams NUMERIC(6,2) NOT NULL DEFAULT 100,
    calories_per_100g NUMERIC(6,2) NOT NULL,
    protein_per_100g NUMERIC(5,2) NOT NULL,
    carbs_per_100g NUMERIC(5,2) NOT NULL,
    fat_per_100g NUMERIC(5,2) NOT NULL,
    saturated_fat_per_100g NUMERIC(5,2),
    fiber_per_100g NUMERIC(5,2) DEFAULT 0,
    sugar_per_100g NUMERIC(5,2) DEFAULT 0,
    sodium_mg_per_100g NUMERIC(6,2) DEFAULT 0,
    calcium_mg_per_100g NUMERIC(6,2) DEFAULT 0,
    iron_mg_per_100g NUMERIC(6,2) DEFAULT 0,
    potassium_mg_per_100g NUMERIC(6,2) DEFAULT 0,
    is_verified BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_food_database_name ON public.food_database(name);
CREATE INDEX IF NOT EXISTS idx_food_database_category ON public.food_database(category);

-- Table 8: food_logs
CREATE TABLE IF NOT EXISTS public.food_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    food_name TEXT NOT NULL,
    meal_type TEXT NOT NULL,
    serving_grams NUMERIC(6,2) NOT NULL,
    calories NUMERIC(6,2) NOT NULL,
    protein NUMERIC(5,2) NOT NULL,
    carbs NUMERIC(5,2) NOT NULL,
    fat NUMERIC(5,2) NOT NULL,
    fiber NUMERIC(5,2) DEFAULT 0,
    sodium_mg NUMERIC(6,2) DEFAULT 0,
    calcium_mg NUMERIC(6,2) DEFAULT 0,
    iron_mg NUMERIC(6,2) DEFAULT 0,
    potassium_mg NUMERIC(6,2) DEFAULT 0,
    image_url TEXT,
    ai_recognized BOOLEAN DEFAULT FALSE,
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_food_logs_user_time ON public.food_logs(user_id, logged_at DESC);

-- Table 9: diet_plans
CREATE TABLE IF NOT EXISTS public.diet_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    dietary_style TEXT NOT NULL DEFAULT 'Omnivore',
    calorie_target INTEGER NOT NULL,
    protein_target_grams INTEGER NOT NULL,
    carbs_target_grams INTEGER NOT NULL,
    fats_target_grams INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diet_plans_user ON public.diet_plans(user_id, is_active);

-- Table 10: nutrition_targets
CREATE TABLE IF NOT EXISTS public.nutrition_targets (
    user_id UUID PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    calorie_target INTEGER NOT NULL DEFAULT 2400,
    protein_target_grams INTEGER NOT NULL DEFAULT 180,
    carbs_target_grams INTEGER NOT NULL DEFAULT 250,
    fat_target_grams INTEGER NOT NULL DEFAULT 70,
    water_target_liters NUMERIC(4,2) NOT NULL DEFAULT 3.5,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 11: water_logs
CREATE TABLE IF NOT EXISTS public.water_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    amount_liters NUMERIC(4,2) NOT NULL,
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_water_logs_user_date ON public.water_logs(user_id, logged_at DESC);

-- Table 12: sleep_logs
CREATE TABLE IF NOT EXISTS public.sleep_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    duration_hours NUMERIC(4,2) NOT NULL,
    sleep_quality TEXT DEFAULT 'Optimal',
    recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, recorded_at)
);

CREATE INDEX IF NOT EXISTS idx_sleep_logs_user ON public.sleep_logs(user_id, recorded_at DESC);

-- Table 13: ai_conversations
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'Performance Consultation',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON public.ai_conversations(user_id, updated_at DESC);

-- Table 14: ai_messages
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'coach')),
    content TEXT NOT NULL,
    suggestions TEXT[] DEFAULT ARRAY[]::TEXT[],
    action_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conv ON public.ai_messages(conversation_id, created_at ASC);

-- Table 15: progress_photos
CREATE TABLE IF NOT EXISTS public.progress_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    pose_type TEXT DEFAULT 'Front Relaxed',
    weight_kg NUMERIC(5,2),
    notes TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_progress_photos_user ON public.progress_photos(user_id, recorded_at DESC);

-- Table 16: push_subscriptions
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    device_token TEXT NOT NULL,
    platform TEXT NOT NULL,
    remind_workouts BOOLEAN DEFAULT TRUE,
    remind_meals BOOLEAN DEFAULT TRUE,
    remind_water BOOLEAN DEFAULT TRUE,
    daily_summary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, device_token)
);

CREATE INDEX IF NOT EXISTS idx_push_subs_user ON public.push_subscriptions(user_id);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_database ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can delete own profile" ON public.user_profiles;
CREATE POLICY "Users can delete own profile" ON public.user_profiles FOR DELETE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view own body metrics" ON public.body_metrics;
CREATE POLICY "Users can view own body metrics" ON public.body_metrics FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Everyone can read standard exercises" ON public.exercises;
CREATE POLICY "Everyone can read standard exercises" ON public.exercises FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS "Users can manage own workout plans" ON public.workout_plans;
CREATE POLICY "Users can manage own workout plans" ON public.workout_plans FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own workout sessions" ON public.workout_sessions;
CREATE POLICY "Users can manage own workout sessions" ON public.workout_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own workout sets" ON public.workout_sets;
CREATE POLICY "Users can manage own workout sets" ON public.workout_sets FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Everyone can read standard food database" ON public.food_database;
CREATE POLICY "Everyone can read standard food database" ON public.food_database FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS "Users can manage own food logs" ON public.food_logs;
CREATE POLICY "Users can manage own food logs" ON public.food_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own diet plans" ON public.diet_plans;
CREATE POLICY "Users can manage own diet plans" ON public.diet_plans FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own nutrition targets" ON public.nutrition_targets;
CREATE POLICY "Users can manage own nutrition targets" ON public.nutrition_targets FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own water logs" ON public.water_logs;
CREATE POLICY "Users can manage own water logs" ON public.water_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own sleep logs" ON public.sleep_logs;
CREATE POLICY "Users can manage own sleep logs" ON public.sleep_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own AI conversations" ON public.ai_conversations;
CREATE POLICY "Users can manage own AI conversations" ON public.ai_conversations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own AI messages" ON public.ai_messages;
CREATE POLICY "Users can manage own AI messages" ON public.ai_messages FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own progress photos" ON public.progress_photos;
CREATE POLICY "Users can manage own progress photos" ON public.progress_photos FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can manage own push subscriptions" ON public.push_subscriptions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
