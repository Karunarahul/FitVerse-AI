/**
 * Standard Fitness and Biometric Calculations
 */

export function calculateBMI(weightKg: number, heightCm: number): { bmi: number; category: string } {
  if (!weightKg || !heightCm || heightCm <= 0 || weightKg <= 0) {
    return { bmi: 0, category: 'Unknown' };
  }
  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

  let category = 'Normal';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Optimal';
  else if (bmi < 30) category = 'Overweight';
  else category = 'High';

  return { bmi, category };
}

/**
 * Basal Metabolic Rate using Mifflin-St Jeor Equation
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: string
): number {
  if (!weightKg || !heightCm || !age) return 1750;
  
  // Base formula: 10 * weight (kg) + 6.25 * height (cm) - 5 * age (y)
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  
  const isFemale = gender.toLowerCase() === 'female';
  const offset = isFemale ? -161 : 5;
  
  return Math.round(base + offset);
}

/**
 * Total Daily Energy Expenditure (TDEE) based on activity level
 */
export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers: Record<string, number> = {
    'Sedentary': 1.2,
    'Active': 1.55,
    'Athlete': 1.725,
    'Elite': 1.9,
  };

  const mult = multipliers[activityLevel] || 1.4;
  return Math.round(bmr * mult);
}

/**
 * Daily Hydration Target (liters) based on weight & activity
 */
export function calculateHydrationTarget(weightKg: number, activityLevel: string): number {
  if (!weightKg || weightKg <= 0) return 2.8;
  
  // Baseline ~ 35ml per kg + activity bonus
  let baselineLiters = (weightKg * 35) / 1000;
  
  if (activityLevel === 'Athlete' || activityLevel === 'Elite') {
    baselineLiters += 0.8;
  } else if (activityLevel === 'Active') {
    baselineLiters += 0.4;
  }

  return parseFloat(baselineLiters.toFixed(1));
}

/**
 * Optimal Macro Distribution based on goal and calorie target
 */
export function calculateMacroTargets(calories: number, goal: string) {
  let proteinRatio = 0.30;
  let carbsRatio = 0.45;
  let fatsRatio = 0.25;

  if (goal === 'Build') {
    // Muscle Gain: Higher protein and carbs
    proteinRatio = 0.32;
    carbsRatio = 0.48;
    fatsRatio = 0.20;
  } else if (goal === 'Burn') {
    // Weight Loss: High protein, moderate fat, lower carb
    proteinRatio = 0.38;
    carbsRatio = 0.32;
    fatsRatio = 0.30;
  } else if (goal === 'Endure') {
    // Endurance: Higher carbs
    proteinRatio = 0.25;
    carbsRatio = 0.55;
    fatsRatio = 0.20;
  }

  const proteinGrams = Math.round((calories * proteinRatio) / 4);
  const carbsGrams = Math.round((calories * carbsRatio) / 4);
  const fatsGrams = Math.round((calories * fatsRatio) / 9);

  return {
    calories,
    proteinGrams,
    carbsGrams,
    fatsGrams,
  };
}
