import { describe, it, expect } from 'vitest';
import { sanitizeInput, validatePromptLimit } from '../utils/security';

describe('Security Utils', () => {
  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert(1)</script>')).toBe('alert(1)');
      expect(sanitizeInput('Hello <b>World</b>')).toBe('Hello World');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });
  });

  describe('validatePromptLimit', () => {
    it('should return true if under limit', () => {
      expect(validatePromptLimit('abc', 10)).toBe(true);
    });

    it('should return false if over limit', () => {
      expect(validatePromptLimit('abcde', 3)).toBe(false);
    });
  });
});
