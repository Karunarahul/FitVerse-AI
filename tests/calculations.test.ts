import assert from 'node:assert';
import { describe, it } from 'node:test';
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateHydrationTarget,
  calculateMacroTargets,
} from '../src/utils/calculations.ts';
import {
  INDIAN_FOOD_DATABASE,
  calculateScaledNutrients,
} from '../src/utils/indianFoodDatabase.ts';

describe('Biometric & Fitness Calculations Suite', () => {
  it('should accurately calculate BMI and classify categories', () => {
    // 74.5 kg, 178 cm -> 74.5 / (1.78 * 1.78) = 23.5 (Optimal)
    const optimal = calculateBMI(74.5, 178);
    assert.strictEqual(optimal.bmi, 23.5);
    assert.strictEqual(optimal.category, 'Optimal');

    // 50 kg, 175 cm -> 50 / (1.75 * 1.75) = 16.3 (Underweight)
    const under = calculateBMI(50, 175);
    assert.strictEqual(under.bmi, 16.3);
    assert.strictEqual(under.category, 'Underweight');

    // 90 kg, 175 cm -> 90 / (1.75 * 1.75) = 29.4 (Overweight)
    const over = calculateBMI(90, 175);
    assert.strictEqual(over.bmi, 29.4);
    assert.strictEqual(over.category, 'Overweight');

    // Invalid bounds
    const invalid = calculateBMI(0, 0);
    assert.strictEqual(invalid.bmi, 0);
    assert.strictEqual(invalid.category, 'Unknown');
  });

  it('should accurately compute BMR using Mifflin-St Jeor equation', () => {
    // Male: 10 * 75 + 6.25 * 180 - 5 * 25 + 5 = 750 + 1125 - 125 + 5 = 1755
    const maleBmr = calculateBMR(75, 180, 25, 'male');
    assert.strictEqual(maleBmr, 1755);

    // Female: 10 * 60 + 6.25 * 165 - 5 * 28 - 161 = 600 + 1031.25 - 140 - 161 = 1330.25 -> 1330
    const femaleBmr = calculateBMR(60, 165, 28, 'female');
    assert.strictEqual(femaleBmr, 1330);
  });

  it('should compute TDEE based on activity multipliers', () => {
    const bmr = 1750;
    // Sedentary (1.2) -> 2100
    assert.strictEqual(calculateTDEE(bmr, 'Sedentary'), 2100);
    // Active (1.55) -> 2713
    assert.strictEqual(calculateTDEE(bmr, 'Active'), 2713);
    // Athlete (1.725) -> 3019
    assert.strictEqual(calculateTDEE(bmr, 'Athlete'), 3019);
    // Elite (1.9) -> 3325
    assert.strictEqual(calculateTDEE(bmr, 'Elite'), 3325);
  });

  it('should calculate hydration target based on weight and activity', () => {
    // 70 kg Sedentary -> (70 * 35)/1000 = 2.45 -> 2.5 L
    const sedHydration = calculateHydrationTarget(70, 'Sedentary');
    assert.strictEqual(sedHydration, 2.5);

    // 70 kg Athlete -> 2.45 + 0.8 = 3.25 -> 3.3 L
    const athleteHydration = calculateHydrationTarget(70, 'Athlete');
    assert.strictEqual(athleteHydration, 3.3);
  });

  it('should calculate balanced macro distributions by athletic goal', () => {
    const cals = 2500;
    // Build goal (32% protein, 48% carbs, 20% fat)
    const buildMacros = calculateMacroTargets(cals, 'Build');
    assert.strictEqual(buildMacros.calories, 2500);
    assert.strictEqual(buildMacros.proteinGrams, Math.round((2500 * 0.32) / 4)); // 200g
    assert.strictEqual(buildMacros.carbsGrams, Math.round((2500 * 0.48) / 4)); // 300g
    assert.strictEqual(buildMacros.fatsGrams, Math.round((2500 * 0.20) / 9)); // 56g

    // Burn goal (38% protein, 32% carbs, 30% fat)
    const burnMacros = calculateMacroTargets(cals, 'Burn');
    assert.strictEqual(burnMacros.proteinGrams, Math.round((2500 * 0.38) / 4)); // 238g
    assert.strictEqual(burnMacros.carbsGrams, Math.round((2500 * 0.32) / 4)); // 200g
    assert.strictEqual(burnMacros.fatsGrams, Math.round((2500 * 0.30) / 9)); // 83g
  });

  it('should scale Indian food portions accurately (150g Basmati Rice = 195 kcal)', () => {
    const basmati = INDIAN_FOOD_DATABASE.find((i) => i.id === 'food_steamed_rice');
    assert.ok(basmati, 'Basmati rice must exist in Indian food database');

    // 100g basmati rice is 130 kcal
    assert.strictEqual(basmati.per100g.calories, 130);

    // 150g portion (1.5 ratio) = 195 kcal
    const scaled150g = calculateScaledNutrients(basmati, 150);
    assert.strictEqual(scaled150g.calories, 195);
    assert.strictEqual(scaled150g.protein, parseFloat((2.7 * 1.5).toFixed(1))); // 4.1g
    assert.strictEqual(scaled150g.carbs, parseFloat((28.2 * 1.5).toFixed(1))); // 42.3g
    assert.strictEqual(scaled150g.fat, parseFloat((0.3 * 1.5).toFixed(1))); // 0.5g
  });

  it('should scale Roti and Paneer portions accurately', () => {
    const roti = INDIAN_FOOD_DATABASE.find((i) => i.id === 'food_roti');
    assert.ok(roti);
    // 35g roti (default piece)
    const singleRoti = calculateScaledNutrients(roti, 35);
    assert.strictEqual(singleRoti.calories, Math.round(290 * 0.35)); // 102 kcal

    const paneer = INDIAN_FOOD_DATABASE.find((i) => i.id === 'food_paneer_fresh');
    assert.ok(paneer);
    // 100g paneer
    const paneer100 = calculateScaledNutrients(paneer, 100);
    assert.strictEqual(paneer100.calories, 265);
    assert.strictEqual(paneer100.protein, 18.3);
  });
});
