const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Config from environment variables (Never exposed to client)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL_PRIMARY = process.env.OPENAI_MODEL_PRIMARY || 'gpt-4o';
const OPENAI_MODEL_FAST = process.env.OPENAI_MODEL_FAST || 'gpt-4o-mini';
const DEMO_MODE = process.env.DEMO_MODE !== 'false'; // default true for rock-solid demo

// Helper: Call OpenAI with structured JSON
async function callOpenAI(messages, model = OPENAI_MODEL_FAST, jsonMode = true) {
  if (!OPENAI_API_KEY) {
    throw new Error('No OPENAI_API_KEY provided');
  }

  const payload = {
    model,
    messages,
    temperature: 0.7,
  };

  if (jsonMode) {
    payload.response_format = { type: 'json_object' };
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return jsonMode ? JSON.parse(content) : content;
}

// 1. POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  res.json({
    success: true,
    data: {
      token: `fitverse_jwt_${Date.now()}`,
      user: {
        id: 'usr_alex_01',
        name: 'Alex',
        email: email || 'alex@fitverse.ai',
        age: 25,
        gender: 'Male',
        heightCm: 178,
        weightKg: 74.5,
        activityLevel: 'Athlete',
        primaryGoal: 'Build',
        environment: 'Commercial Facility',
        equipment: ['Barbell', 'Dumbbells', 'Cables'],
        workoutDuration: 45,
        nutritionStyle: 'Omnivore',
        restrictions: ['Gluten Free'],
        premium: true,
        streakDays: 14,
        joinedDate: '2026-01-15',
      },
    },
    error: null,
  });
});

// 2. POST /api/ai/generate-plan
app.post('/api/ai/generate-plan', async (req, res) => {
  const user = req.body;

  if (OPENAI_API_KEY && !DEMO_MODE) {
    try {
      const systemPrompt = `You are FitVerse AI, an adaptive elite fitness operating system.
Generate a structured workout and nutrition plan in valid JSON matching this schema:
{
  "workoutPlan": {
    "id": "string",
    "name": "string",
    "phase": "string",
    "durationMinutes": number,
    "calories": number,
    "difficulty": "string",
    "targetMuscles": ["string"],
    "aiPrediction": "string",
    "exercises": [
      {
        "id": "string",
        "name": "string",
        "primaryMuscle": "string",
        "sets": number,
        "reps": "string",
        "restSeconds": number,
        "targetWeight": number,
        "completedSets": 0
      }
    ]
  },
  "nutritionPlan": {
    "calories": number,
    "proteinGrams": number,
    "carbsGrams": number,
    "fatsGrams": number,
    "hydrationLiters": 1.2,
    "hydrationTargetLiters": number,
    "meals": [
      {
        "id": "string",
        "type": "string",
        "name": "string",
        "description": "string",
        "calories": number,
        "protein": number,
        "carbs": number,
        "fats": number
      }
    ]
  },
  "aiSynthesis": "string"
}`;

      const userPrompt = `User Profile:
Name: ${user.name}, Age: ${user.age}, Gender: ${user.gender}, Height: ${user.heightCm}cm, Weight: ${user.weightKg}kg.
Activity: ${user.activityLevel}, Goal: ${user.primaryGoal}, Environment: ${user.environment}.
Duration: ${user.workoutDuration} mins. Style: ${user.nutritionStyle}, Restrictions: ${JSON.stringify(user.restrictions)}.
Generate customized workout and meals respecting equipment and dietary restrictions.`;

      const aiResult = await callOpenAI([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ], OPENAI_MODEL_PRIMARY, true);

      return res.json({ success: true, data: aiResult, error: null });
    } catch (err) {
      console.warn('OpenAI error during generate-plan, falling back to deterministic fixture:', err.message);
    }
  }

  // Deterministic Demo Fallback
  return res.json({
    success: true,
    data: {
      workoutPlan: {
        id: `plan_${Date.now()}`,
        name: user.primaryGoal === 'Build' ? 'Hypertrophy Core V.4' : 'Metabolic Ignition Protocol',
        phase: 'Hypertrophy Phase II',
        durationMinutes: user.workoutDuration || 45,
        calories: 450,
        difficulty: 'Advanced',
        targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
        aiPrediction: 'Expected 1RM Increase: +2.5%',
        exercises: [
          {
            id: 'ex_1',
            name: 'Barbell Bench Press',
            primaryMuscle: 'Chest',
            sets: 4,
            reps: '8–10',
            restSeconds: 90,
            targetWeight: 225,
            completedSets: 0,
          },
          {
            id: 'ex_2',
            name: 'Seated Dumbbell Press',
            primaryMuscle: 'Shoulders',
            sets: 4,
            reps: '10–12',
            restSeconds: 60,
            targetWeight: 65,
            completedSets: 0,
          },
          {
            id: 'ex_3',
            name: 'Incline Cable Flyes',
            primaryMuscle: 'Chest',
            sets: 3,
            reps: '12–15',
            restSeconds: 45,
            targetWeight: 40,
            completedSets: 0,
          },
          {
            id: 'ex_4',
            name: 'Barbell Deadlift',
            primaryMuscle: 'Posterior Chain',
            sets: 4,
            reps: '8–10',
            restSeconds: 90,
            targetWeight: 315,
            completedSets: 0,
          },
          {
            id: 'ex_5',
            name: 'Bent Over Rows',
            primaryMuscle: 'Upper Back',
            sets: 4,
            reps: '12',
            restSeconds: 60,
            targetWeight: 185,
            completedSets: 0,
          },
        ],
      },
      nutritionPlan: {
        calories: 2400,
        proteinGrams: 180,
        carbsGrams: 220,
        fatsGrams: 65,
        consumedCalories: 1840,
        consumedProtein: 120,
        consumedCarbs: 160,
        consumedFats: 45,
        hydrationLiters: 1.2,
        hydrationTargetLiters: 3.0,
        meals: [
          {
            id: 'meal_1',
            type: 'Breakfast',
            name: 'Anabolic Oat Bowl',
            description: 'Rolled oats, whey isolate, wild blueberries, chia seeds, almond butter.',
            calories: 620,
            protein: 48,
            carbs: 72,
            fats: 16,
          },
          {
            id: 'meal_2',
            type: 'Lunch',
            name: 'Performance Chicken Bowl',
            description: 'Grilled chicken breast, quinoa, roasted sweet potatoes, avocado, chimichurri.',
            calories: 780,
            protein: 62,
            carbs: 74,
            fats: 22,
          },
          {
            id: 'meal_3',
            type: 'Dinner',
            name: 'Wild Salmon & Asparagus',
            description: 'Pan-seared wild salmon, garlic herb jasmine rice, lemon roasted asparagus.',
            calories: 710,
            protein: 52,
            carbs: 56,
            fats: 24,
          },
          {
            id: 'meal_4',
            type: 'Snack',
            name: 'Greek Yogurt & Honey Crisp',
            description: 'Double-strained Greek yogurt, wildflower honey, raw walnuts.',
            calories: 290,
            protein: 24,
            carbs: 22,
            fats: 9,
          },
        ],
      },
      aiSynthesis: `FitVerse Neural Engine calibrated for ${user.name || 'Alex'}: ${user.primaryGoal || 'Build'} goal, ${user.workoutDuration || 45}m duration in ${user.environment || 'Commercial Facility'}. Caloric target set to 2400 kcal with 180g protein.`,
    },
    error: null,
  });
});

// 3. POST /api/ai/swap-meal
app.post('/api/ai/swap-meal', async (req, res) => {
  const { currentMeal, nutritionStyle, restrictions, primaryGoal } = req.body;

  if (OPENAI_API_KEY && !DEMO_MODE) {
    try {
      const prompt = `Current Meal: ${JSON.stringify(currentMeal)}.
Diet Style: ${nutritionStyle}, Restrictions: ${JSON.stringify(restrictions)}, Goal: ${primaryGoal}.
Suggest a direct 1-to-1 replacement meal in JSON:
{
  "id": "meal_swap_ai",
  "type": "${currentMeal.type}",
  "name": "string",
  "description": "string",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number
}`;
      const result = await callOpenAI([
        { role: 'system', content: 'You are FitVerse nutrition AI. Return matching calories and macros in JSON.' },
        { role: 'user', content: prompt },
      ], OPENAI_MODEL_FAST, true);
      return res.json({ success: true, data: result, error: null });
    } catch (e) {
      console.warn('OpenAI swap failed, falling back to deterministic meal:', e.message);
    }
  }

  // Deterministic alternative
  const isBreakfast = currentMeal?.type === 'Breakfast';
  const isDinner = currentMeal?.type === 'Dinner';

  const replacement = isBreakfast
    ? {
        id: `meal_swapped_${Date.now()}`,
        type: 'Breakfast',
        name: 'Fluffy Protein Pancakes & Berries',
        description: 'Gluten-free oat flour, vanilla isolate, pure organic maple drizzle, fresh raspberries.',
        calories: 635,
        protein: 50,
        carbs: 68,
        fats: 17,
      }
    : isDinner
    ? {
        id: `meal_swapped_${Date.now()}`,
        type: 'Dinner',
        name: 'Herb-Crusted Cod & Roasted Fingerlings',
        description: 'Wild Atlantic cod fillet, crushed fingerling potatoes with rosemary, steamed broccolini.',
        calories: 700,
        protein: 55,
        carbs: 58,
        fats: 22,
      }
    : {
        id: `meal_swapped_${Date.now()}`,
        type: 'Lunch',
        name: 'Grass-Fed Beef & Jasmine Rice Bowl',
        description: 'Lean 93/7 beef mince, steamed aromatic jasmine rice, pickled cucumber, sesame ginger glaze.',
        calories: 760,
        protein: 66,
        carbs: 69,
        fats: 23,
      };

  res.json({ success: true, data: replacement, error: null });
});

// 4. POST /api/ai/analyze-progress
app.post('/api/ai/analyze-progress', async (req, res) => {
  const { stats } = req.body;

  if (OPENAI_API_KEY && !DEMO_MODE) {
    try {
      const prompt = `Analyze these athlete performance statistics:
${JSON.stringify(stats)}
Provide sports science analysis in JSON format:
{
  "insight": "string (concise headline and recovery assessment)",
  "recommendation": "string (actionable training cue)",
  "confidence": number (e.g. 96),
  "adaptations": ["string"]
}`;
      const result = await callOpenAI([
        { role: 'system', content: 'You are FitVerse biomechanics AI analyzer. Return valid JSON only.' },
        { role: 'user', content: prompt },
      ], OPENAI_MODEL_FAST, true);
      return res.json({ success: true, data: result, error: null });
    } catch (e) {
      console.warn('OpenAI analyze-progress error:', e.message);
    }
  }

  res.json({
    success: true,
    data: {
      insight: 'Recovery rate is optimal across 14 training days.',
      recommendation: 'Suggest increasing volume on lower body days by +5% next week.',
      confidence: 96,
      adaptations: ['Increase primary compound load by +2.5% to +5%', 'Maintain protein synthesis intake at 180g'],
    },
    error: null,
  });
});

// 5. POST /api/ai/adapt-plan
app.post('/api/ai/adapt-plan', async (req, res) => {
  const { profile, stats, currentPlan } = req.body;

  if (OPENAI_API_KEY && !DEMO_MODE) {
    try {
      const prompt = `Current Athlete:
Profile: ${JSON.stringify(profile)}
Telemetry Stats: ${JSON.stringify(stats)}
Current Workout Plan: ${JSON.stringify(currentPlan)}
Adapt the plan by increasing/adjusting weights or volume by approximately 5% based on recovery.
Return valid JSON matching this schema:
{
  "message": "string (brief summary of changes)",
  "volumeAdjustmentPercent": number,
  "intensityAdjustmentPercent": number,
  "rationale": "string",
  "updatedPlan": {
    "id": "string",
    "name": "string",
    "phase": "string",
    "durationMinutes": number,
    "calories": number,
    "difficulty": "string",
    "targetMuscles": ["string"],
    "aiPrediction": "string",
    "adaptationNote": "string",
    "exercises": [
      {
        "id": "string",
        "name": "string",
        "primaryMuscle": "string",
        "sets": number,
        "reps": "string",
        "restSeconds": number,
        "targetWeight": number,
        "completedSets": 0
      }
    ]
  }
}`;
      const result = await callOpenAI([
        { role: 'system', content: 'You are FitVerse AI adaptive coach. Calibrate volume and progression in JSON.' },
        { role: 'user', content: prompt },
      ], OPENAI_MODEL_PRIMARY, true);
      return res.json({ success: true, data: result, error: null });
    } catch (e) {
      console.warn('OpenAI adapt-plan error:', e.message);
    }
  }

  const updatedExercises = (currentPlan?.exercises || []).map((ex) => ({
    ...ex,
    targetWeight: ex.targetWeight ? Math.round(ex.targetWeight * 1.05) : undefined,
    completedSets: 0,
  }));

  res.json({
    success: true,
    data: {
      message: 'Your recent upper-body performance indicates improved recovery. I’ve increased your next session’s resistance volume by 5%.',
      volumeAdjustmentPercent: 5,
      intensityAdjustmentPercent: 4.5,
      rationale: 'Elevated HRV and zero missed sets across the last 3 sessions confirm central nervous system capacity.',
      updatedPlan: {
        ...(currentPlan || {}),
        name: `${currentPlan?.name || 'Hypertrophy Core'} (Adapted)`,
        aiPrediction: 'Expected 1RM Increase: +4.2%',
        adaptationNote: 'Volume adjusted +5% based on recovery telemetry',
        exercises: updatedExercises,
      },
    },
    error: null,
  });
});

// 6. POST /api/ai/chat
app.post('/api/ai/chat', async (req, res) => {
  const { message, context } = req.body;

  if (OPENAI_API_KEY && !DEMO_MODE) {
    try {
      const system = `You are FitVerse AI, a personal fitness operating system coach.
User context: ${JSON.stringify(context)}.
Provide concise, authoritative, sports-science backed guidance. Do not provide medical diagnoses or dangerous advice.`;

      const response = await callOpenAI([
        { role: 'system', content: system },
        { role: 'user', content: message },
      ], OPENAI_MODEL_FAST, false);

      return res.json({ success: true, data: { reply: response }, error: null });
    } catch (e) {
      console.warn('OpenAI chat error:', e.message);
    }
  }

  // Deterministic Coach response
  const msgLower = (message || '').toLowerCase();
  let reply = 'Your biomechanical telemetry and metabolic output are well calibrated. Stay focused on proper progressive overload.';
  if (msgLower.includes('weight') || msgLower.includes('bench') || msgLower.includes('increase')) {
    reply = 'Based on your last three sessions, your completed reps have been consistently above target. A 5 lb increase on your compound movements is appropriate if your form remains stable.';
  } else if (msgLower.includes('protein') || msgLower.includes('diet') || msgLower.includes('macro')) {
    reply = 'Your current 180g protein target delivers 2.4g per kg, optimizing muscle protein synthesis while keeping satiety high.';
  }

  res.json({ success: true, data: { reply }, error: null });
});

// 7. POST /api/workouts/:id/complete
app.post('/api/workouts/:id/complete', (req, res) => {
  const { id } = req.params;
  const { caloriesBurned, elapsedSeconds } = req.body;
  res.json({
    success: true,
    data: {
      workoutId: id,
      completedAt: new Date().toISOString(),
      caloriesBurned: caloriesBurned || 450,
      elapsedSeconds: elapsedSeconds || 2700,
      streakUpdated: 15,
    },
    error: null,
  });
});

// 8. GET /api/user/profile
app.get('/api/user/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      id: 'usr_alex_01',
      name: 'Alex',
      email: 'alex.vance@fitverse.ai',
      age: 25,
      gender: 'Male',
      heightCm: 178,
      weightKg: 74.5,
      activityLevel: 'Athlete',
      primaryGoal: 'Build',
      environment: 'Commercial Facility',
      equipment: ['Barbell', 'Dumbbells', 'Cables', 'Bench'],
      workoutDuration: 45,
      nutritionStyle: 'Omnivore',
      restrictions: ['Gluten Free'],
      premium: true,
      streakDays: 14,
      joinedDate: '2026-01-15',
      currentPhase: 'Hypertrophy Phase II',
    },
    error: null,
  });
});

// 9. GET /api/user/stats
app.get('/api/user/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      consistencyScore: 94,
      consistencyChange: 2,
      totalWorkoutsCompleted: 12,
      totalWorkoutsTarget: 16,
      averageBurnKcal: 640,
      currentStreakDays: 14,
      dailyGoalCompletionPercent: 78,
      heartRateBpm: 68,
      stepsCurrent: 8432,
      stepsTarget: 10000,
      sleepDuration: '7h 12m',
      sleepQuality: 'Optimal',
      weeklyOutputPercent: 75,
      weightTrend: [
        { date: 'Sep 10', weightKg: 75.8 },
        { date: 'Sep 17', weightKg: 75.4 },
        { date: 'Sep 24', weightKg: 75.0 },
        { date: 'Oct 01', weightKg: 74.7 },
        { date: 'Oct 05', weightKg: 74.5 },
      ],
      aiInsight: {
        headline: 'Recovery Rate is Optimal',
        details: 'Based on 14 analyzed sessions, your central nervous system recovery has peaked.',
        recommendation: 'Suggest increasing volume on lower body days by +5% next week.',
        confidence: 96,
      },
    },
    error: null,
  });
});

app.listen(PORT, () => {
  console.log(`[FitVerse AI Server] running on http://localhost:${PORT}`);
  console.log(`[FitVerse AI Server] Demo mode: ${DEMO_MODE}`);
  console.log(`[FitVerse AI Server] OpenAI configured: ${!!OPENAI_API_KEY}`);
});
