import assert from 'node:assert';
import { describe, it } from 'node:test';
import {
  isValidEmail,
  isValidPassword,
  isNonEmptyString,
  isPositiveNumber,
} from '../src/utils/validators.ts';

describe('Validation Utility Suite', () => {
  it('should validate email formats correctly', () => {
    assert.strictEqual(isValidEmail('alex@fitverse.ai'), true);
    assert.strictEqual(isValidEmail('athlete.pro+1@domain.co.in'), true);
    assert.strictEqual(isValidEmail(''), false);
    assert.strictEqual(isValidEmail('invalid-email'), false);
    assert.strictEqual(isValidEmail('missing@domain'), false);
    assert.strictEqual(isValidEmail('  user@domain.com  '), true);
  });

  it('should enforce password length rules (>= 6 chars)', () => {
    assert.strictEqual(isValidPassword('FitVerse!2026'), true);
    assert.strictEqual(isValidPassword('123456'), true);
    assert.strictEqual(isValidPassword('12345'), false);
    assert.strictEqual(isValidPassword(''), false);
    assert.strictEqual(isValidPassword(null as any), false);
  });

  it('should validate non-empty strings', () => {
    assert.strictEqual(isNonEmptyString('Bench Press'), true);
    assert.strictEqual(isNonEmptyString('   '), false);
    assert.strictEqual(isNonEmptyString(''), false);
    assert.strictEqual(isNonEmptyString(123 as any), false);
    assert.strictEqual(isNonEmptyString(null as any), false);
  });

  it('should validate positive numbers', () => {
    assert.strictEqual(isPositiveNumber(74.5), true);
    assert.strictEqual(isPositiveNumber('150'), true);
    assert.strictEqual(isPositiveNumber(0), false);
    assert.strictEqual(isPositiveNumber(-5), false);
    assert.strictEqual(isPositiveNumber('abc'), false);
    assert.strictEqual(isPositiveNumber(null), false);
  });
});
