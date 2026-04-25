export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type LearningPace = 'Slow' | 'Normal' | 'Fast';
export type LearningStyle = 'Visual' | 'Example-based' | 'Quiz-based' | 'Revision-based';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  topic: string;
  level: Difficulty;
  goal: string;
  pace: LearningPace;
  style: LearningStyle;
  dailyTime: number; // in minutes
  onboarded: boolean;
}

export interface LearningPath {
  id: string;
  userId: string;
  topic: string;
  roadmap: RoadmapStep[];
  createdAt: number;
}

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  estimatedTime: string;
  completed: boolean;
}

export interface Lesson {
  id: string;
  stepId: number;
  title: string;
  explanation: string;
  example: string;
  commonMistakes: string[];
  practiceTask: string;
  summary: string;
  keyPoints: string[];
  memoryTrick: string;
  difficulty: Difficulty;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number; // in seconds
  confidenceRating: number; // 1-5
  wrongAnswers: {
    question: string;
    userAnswer: number;
    correctAnswer: number;
    concept: string;
  }[];
  timestamp: number;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: Difficulty;
  known: boolean;
}

export interface ProgressData {
  completedLessons: number;
  averageQuizScore: number;
  currentDifficulty: Difficulty;
  weakTopics: string[];
  streak: number;
  lastActive: number;
}
