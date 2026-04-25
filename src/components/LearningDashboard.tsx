import { useState, useEffect } from 'react';
import { generateExplanation } from '../services/geminiService';
import type { LearningContext } from '../services/geminiService';
import { adjustDifficulty, calculateScorePercentage } from '../utils/adaptiveLearning';
import { ProgressCard } from './ProgressCard';
import { Quiz } from './Quiz';
import { BookOpen, Lightbulb, HelpCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { db } from '../services/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface LearningDashboardProps {
  initialContext: LearningContext;
  onReset: () => void;
}

export const LearningDashboard: React.FC<LearningDashboardProps> = ({ initialContext, onReset }) => {
  const [context, setContext] = useState<LearningContext>(initialContext);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState('');

  const fetchExplanation = async (specificRequest?: string) => {
    setLoading(true);
    setFeedback('');
    try {
      const content = await generateExplanation(context, specificRequest);
      setExplanation(content);
    } catch (error) {
      setExplanation("Oops! Something went wrong while generating your lesson. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplanation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.currentDifficulty, context.topic]);

  const handleAction = (action: string) => {
    fetchExplanation(action);
  };

  const handleQuizComplete = async (score: number, total: number) => {
    const percentage = calculateScorePercentage(score, total);
    const { newDifficulty, feedbackMessage } = adjustDifficulty(context.currentDifficulty, percentage);
    
    setTotalScore(prev => prev + score);
    setTotalQuestions(prev => prev + total);
    setLessonsCompleted(prev => prev + 1);
    
    setFeedback(feedbackMessage);
    
    const newContext = { ...context, currentDifficulty: newDifficulty };
    setContext(newContext);
    
    // Attempt to save to Firebase (will fail silently in demo if auth/rules are strict or not setup, but good for production)
    try {
      // using a dummy user id for demo if auth is not implemented fully yet
      const userId = "demo-user"; 
      await setDoc(doc(db, "users", userId, "progress", context.topic), {
        topic: context.topic,
        lessonsCompleted: lessonsCompleted + 1,
        averageScore: totalQuestions + total > 0 ? ((totalScore + score) / (totalQuestions + total)) * 100 : 0,
        currentDifficulty: newDifficulty,
        lastActive: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      console.log("Firebase save skipped for demo", e);
    }

    setMode('learn');
  };

  const averageScore = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BookOpen color="var(--primary)" /> Learning: {context.topic}
        </h1>
        <button className="btn btn-outline" onClick={onReset}>
          <RefreshCw size={16} /> Change Topic
        </button>
      </div>

      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {mode === 'learn' ? (
            <div className="glass-panel animate-fade-in" style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Lesson Material</h2>
                <span style={{ padding: '0.25rem 0.75rem', backgroundColor: 'var(--surface)', borderRadius: '1rem', fontSize: '0.85rem', color: 'var(--primary)' }}>
                  Level {context.currentDifficulty}/10
                </span>
              </div>

              {feedback && (
                <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid var(--secondary)', marginBottom: '1.5rem', borderRadius: '4px' }}>
                  {feedback}
                </div>
              )}

              {loading ? (
                <div style={{ padding: '3rem', textAlign: 'center' }}>
                  <div style={{ animation: 'spin 1s linear infinite', display: 'inline-block', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', width: '30px', height: '30px' }} />
                  <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Thinking...</p>
                </div>
              ) : (
                <div style={{ fontSize: '1.1rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                  {explanation}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                <button className="btn btn-secondary" onClick={() => handleAction("Explain Easier")} disabled={loading}>
                  <Lightbulb size={18} /> Explain Easier
                </button>
                <button className="btn btn-secondary" onClick={() => handleAction("Give an Example")} disabled={loading}>
                  <HelpCircle size={18} /> Give Example
                </button>
                <div style={{ flex: 1 }} />
                <button className="btn btn-primary" onClick={() => setMode('quiz')} disabled={loading}>
                  Take Quiz <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ) : (
            <Quiz context={context} onComplete={handleQuizComplete} />
          )}
        </div>

        <div>
          <ProgressCard 
            context={context} 
            lessonsCompleted={lessonsCompleted} 
            averageScore={averageScore} 
          />
        </div>
      </div>
    </div>
  );
};
