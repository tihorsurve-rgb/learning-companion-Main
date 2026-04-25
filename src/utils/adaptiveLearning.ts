export const calculateScorePercentage = (score: number, total: number): number => {
  if (total === 0) return 0;
  return (score / total) * 100;
};

export const adjustDifficulty = (currentDifficulty: number, scorePercentage: number): {
  newDifficulty: number;
  feedbackMessage: string;
} => {
  let newDifficulty = currentDifficulty;
  let feedbackMessage = "";

  if (scorePercentage <= 33) {
    newDifficulty = Math.max(1, currentDifficulty - 1);
    feedbackMessage = "Let's slow down and explain with simpler examples.";
  } else if (scorePercentage >= 80) {
    newDifficulty = Math.min(10, currentDifficulty + 1);
    feedbackMessage = "Great! Moving to a slightly advanced concept.";
  } else {
    feedbackMessage = "Good job! Let's continue at this level.";
  }

  return { newDifficulty, feedbackMessage };
};
