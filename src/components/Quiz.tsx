import { useState, useEffect } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import type { LearningContext } from '../services/geminiService';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface QuizProps {
  context: LearningContext;
  onComplete: (score: number, total: number) => void;
}

interface Question {
  question: string;
  options: string[];
  answerIndex: number;
}

export const Quiz: React.FC<QuizProps> = ({ context, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await generateQuizQuestions(context);
        if (mounted) {
          setQuestions(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError('Failed to load quiz. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchQuestions();
    return () => { mounted = false; };
  }, [context]);

  const handleSelect = (index: number) => {
    if (isChecking) return;
    setSelectedAnswer(index);
  };

  const handleCheck = () => {
    if (selectedAnswer === null) return;
    
    setIsChecking(true);
    if (selectedAnswer === questions[currentIndex].answerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsChecking(false);
    } else {
      onComplete(score + (selectedAnswer === questions[currentIndex].answerIndex ? 1 : 0), questions.length);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ animation: 'spin 1s linear infinite', display: 'inline-block', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', width: '40px', height: '40px' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Generating personalized questions...</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--danger)' }}>{error || 'No questions available.'}</p>
        <button className="btn btn-primary" onClick={() => onComplete(0, 0)} style={{ marginTop: '1rem' }}>
          Skip Quiz
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQ.answerIndex;

  return (
    <div className="glass-panel animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Quiz Time</h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      <div className="progress-container" style={{ marginBottom: '2rem' }}>
        <div className="progress-bar" style={{ width: `${((currentIndex) / questions.length) * 100}%` }} />
      </div>

      <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 500 }}>{currentQ.question}</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {currentQ.options.map((option, index) => {
          let styleClass = 'btn-secondary';
          if (isChecking) {
            if (index === currentQ.answerIndex) styleClass = 'btn-primary'; // Highlight correct answer
            else if (index === selectedAnswer) styleClass = 'btn-disabled'; // Mark selected wrong
          } else if (selectedAnswer === index) {
            styleClass = 'btn-outline'; // Currently selected before check
          }

          return (
            <button
              key={index}
              className={`btn ${styleClass}`}
              style={{ justifyContent: 'flex-start', padding: '1rem', textAlign: 'left', height: 'auto', opacity: isChecking && index !== currentQ.answerIndex && index !== selectedAnswer ? 0.5 : 1 }}
              onClick={() => handleSelect(index)}
              disabled={isChecking}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '3rem' }}>
        <div>
          {isChecking && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isCorrect ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}>
              {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
              {isCorrect ? 'Correct!' : 'Not quite right.'}
            </span>
          )}
        </div>

        {!isChecking ? (
          <button 
            className={`btn btn-primary ${selectedAnswer === null ? 'btn-disabled' : ''}`}
            onClick={handleCheck}
            disabled={selectedAnswer === null}
          >
            Check Answer
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleNext}>
            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
