import { describe, it, expect } from 'vitest';
import { calculateScorePercentage, adjustDifficulty } from '../utils/adaptiveLearning';

describe('Adaptive Learning Utils', () => {
  describe('calculateScorePercentage', () => {
    it('should calculate 100% for perfect score', () => {
      expect(calculateScorePercentage(3, 3)).toBe(100);
    });

    it('should calculate 0% for zero score', () => {
      expect(calculateScorePercentage(0, 3)).toBe(0);
    });

    it('should handle division by zero gracefully', () => {
      expect(calculateScorePercentage(0, 0)).toBe(0);
    });
  });

  describe('adjustDifficulty', () => {
    it('should decrease difficulty and return simplified message for low scores', () => {
      const result = adjustDifficulty(5, 33);
      expect(result.newDifficulty).toBe(4);
      expect(result.feedbackMessage).toBe("Let's slow down and explain with simpler examples.");
    });

    it('should not decrease difficulty below 1', () => {
      const result = adjustDifficulty(1, 0);
      expect(result.newDifficulty).toBe(1);
    });

    it('should increase difficulty and return positive message for high scores', () => {
      const result = adjustDifficulty(5, 100);
      expect(result.newDifficulty).toBe(6);
      expect(result.feedbackMessage).toBe("Great! Moving to a slightly advanced concept.");
    });

    it('should not increase difficulty above 10', () => {
      const result = adjustDifficulty(10, 100);
      expect(result.newDifficulty).toBe(10);
    });

    it('should keep difficulty same for average scores', () => {
      const result = adjustDifficulty(5, 66);
      expect(result.newDifficulty).toBe(5);
      expect(result.feedbackMessage).toBe("Good job! Let's continue at this level.");
    });
  });
});
