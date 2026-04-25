import { useState } from 'react';
import { BookOpen, Zap, Target, ArrowRight } from 'lucide-react';
import type { LearningContext } from '../services/geminiService';

interface OnboardingFormProps {
  onComplete: (context: LearningContext) => void;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete }) => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [pace, setPace] = useState('Normal');
  const [style, setStyle] = useState('Simple explanation');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    onComplete({
      topic: topic.trim(),
      level,
      pace,
      style,
      currentDifficulty: level === 'Beginner' ? 1 : level === 'Intermediate' ? 5 : 8
    });
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '2rem' }}>
      <div className="glass-panel animate-fade-in">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(79, 70, 229, 0.1)', marginBottom: '1rem' }}>
            <BookOpen size={32} color="var(--primary)" />
          </div>
          <h1>Welcome to Learning Companion</h1>
          <p style={{ color: 'var(--text-muted)' }}>Tell us what you want to learn, and we'll personalize the journey for you.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="topic" className="input-label">What do you want to learn?</label>
            <input
              id="topic"
              type="text"
              className="input-field"
              placeholder="e.g., Photosynthesis, React Hooks, History of Rome"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              aria-required="true"
            />
          </div>

          <div className="input-group">
            <label htmlFor="level" className="input-label">
              <Target size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Current Level
            </label>
            <select
              id="level"
              className="input-field"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="grid-2">
            <div className="input-group">
              <label htmlFor="pace" className="input-label">
                <Zap size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Preferred Pace
              </label>
              <select
                id="pace"
                className="input-field"
                value={pace}
                onChange={(e) => setPace(e.target.value)}
              >
                <option value="Slow">Slow</option>
                <option value="Normal">Normal</option>
                <option value="Fast">Fast</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="style" className="input-label">Preferred Style</label>
              <select
                id="style"
                className="input-field"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                <option value="Simple explanation">Simple Explanation</option>
                <option value="Example-based">Example-based</option>
                <option value="Quiz-based">Quiz-based</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className={`btn btn-primary ${!topic.trim() ? 'btn-disabled' : ''}`}
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={!topic.trim()}
          >
            Start Learning <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
