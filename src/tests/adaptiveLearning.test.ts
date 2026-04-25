import { describe, it, expect } from 'vitest';
import { adjustDifficulty, detectWeakAreas } from '../utils/adaptiveLearning';

describe('Adaptive Learning Utils', () => {
  describe('adjustDifficulty', () => {
    it('should decrease difficulty if score < 50', () => {
      expect(adjustDifficulty(30, 'Advanced')).toBe('Intermediate');
      expect(adjustDifficulty(30, 'Intermediate')).toBe('Beginner');
      expect(adjustDifficulty(30, 'Beginner')).toBe('Beginner');
    });

    it('should increase difficulty if score > 80', () => {
      expect(adjustDifficulty(90, 'Beginner')).toBe('Intermediate');
      expect(adjustDifficulty(90, 'Intermediate')).toBe('Advanced');
      expect(adjustDifficulty(90, 'Advanced')).toBe('Advanced');
    });

    it('should keep difficulty same if score is between 50 and 80', () => {
      expect(adjustDifficulty(70, 'Intermediate')).toBe('Intermediate');
    });
  });

  describe('detectWeakAreas', () => {
    it('should return unique concepts from wrong answers', () => {
      const wrongAnswers = [
        { concept: 'Concept A' },
        { concept: 'Concept B' },
        { concept: 'Concept A' },
      ];
      const result = detectWeakAreas(wrongAnswers);
      expect(result).toContain('Concept A');
      expect(result).toContain('Concept B');
      expect(result.length).toBe(2);
    });
  });
});
