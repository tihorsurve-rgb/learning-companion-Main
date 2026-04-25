import { type Difficulty } from '../types';

export const adjustDifficulty = (score: number, currentDifficulty: Difficulty): Difficulty => {
  if (score < 50) {
    if (currentDifficulty === 'Advanced') return 'Intermediate';
    if (currentDifficulty === 'Intermediate') return 'Beginner';
    return 'Beginner';
  } else if (score > 80) {
    if (currentDifficulty === 'Beginner') return 'Intermediate';
    if (currentDifficulty === 'Intermediate') return 'Advanced';
    return 'Advanced';
  }
  return currentDifficulty;
};

export const detectWeakAreas = (wrongAnswers: { concept: string }[]): string[] => {
  const counts: Record<string, number> = {};
  wrongAnswers.forEach((wa) => {
    counts[wa.concept] = (counts[wa.concept] || 0) + 1;
  });
  return Object.keys(counts).filter((concept) => counts[concept] > 0);
};
