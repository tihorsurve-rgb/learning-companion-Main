import { describe, it, expect } from 'vitest';
import { calculateQuizScore, formatTime } from '../utils/quizUtils';

describe('Quiz Utils', () => {
  describe('calculateQuizScore', () => {
    it('should calculate correct percentage', () => {
      expect(calculateQuizScore(4, 5)).toBe(80);
      expect(calculateQuizScore(1, 3)).toBe(33);
      expect(calculateQuizScore(0, 5)).toBe(0);
    });

    it('should handle zero questions', () => {
      expect(calculateQuizScore(0, 0)).toBe(0);
    });
  });

  describe('formatTime', () => {
    it('should format seconds to MM:SS', () => {
      expect(formatTime(65)).toBe('1:05');
      expect(formatTime(120)).toBe('2:00');
      expect(formatTime(9)).toBe('0:09');
    });
  });
});
