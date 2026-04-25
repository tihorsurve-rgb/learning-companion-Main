import React, { useState, useEffect } from 'react';
import { type Lesson, type QuizQuestion, type QuizResult } from '../types';
import { generateQuiz } from '../services/geminiService';
import { Card, ProgressBar, Badge } from './UI';
import { calculateQuizScore } from '../utils/quizUtils';

interface QuizProps {
  lesson: Lesson;
  onComplete: (result: QuizResult) => void;
}

export const Quiz: React.FC<QuizProps> = ({ lesson, onComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    handleLoadQuiz();
  }, [lesson]);

  const handleLoadQuiz = async () => {
    setLoading(true);
    try {
      const q = await generateQuiz(lesson);
      setQuestions(q);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    const correctCount = answers.reduce((acc, ans, idx) => acc + (ans === questions[idx].correctAnswer ? 1 : 0), 0);
    const percentage = calculateQuizScore(correctCount, questions.length);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    const wrongAnswers = questions.map((q, idx) => ({
      question: q.question,
      userAnswer: answers[idx],
      correctAnswer: q.correctAnswer,
      concept: lesson.title // Simplification: use lesson title as concept for now
    })).filter((_, idx) => answers[idx] !== questions[idx].correctAnswer);

    const result: QuizResult = {
      score: correctCount,
      totalQuestions: questions.length,
      percentage,
      timeTaken,
      confidenceRating: 4, // Could be asked to user
      wrongAnswers,
      timestamp: Date.now()
    };

    onComplete(result);
  };

  if (loading) return (
    <Card className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
      <p className="text-white/60">Preparing your quiz...</p>
    </Card>
  );

  const currentQuestion = questions[currentIndex];

  return (
    <Card className="animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Quiz: {lesson.title}</h3>
          <Badge color="purple">Question {currentIndex + 1} of {questions.length}</Badge>
        </div>
        <ProgressBar progress={((currentIndex) / questions.length) * 100} />
      </div>

      <div className="space-y-6">
        <p className="text-lg text-white font-medium">{currentQuestion.question}</p>
        
        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                answers[currentIndex] === idx 
                  ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/20' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
              }`}
            >
              <div className="flex items-center">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 text-sm font-bold">
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center text-sm text-white/40">
        <span>Click an option to select and move to next question</span>
        {currentIndex > 0 && (
          <button onClick={() => setCurrentIndex(currentIndex - 1)} className="hover:text-white transition-colors">
            ← Previous Question
          </button>
        )}
      </div>
    </Card>
  );
};
