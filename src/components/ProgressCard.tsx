
import { Target, TrendingUp, Award, Activity } from 'lucide-react';
import type { LearningContext } from '../services/geminiService';

interface ProgressCardProps {
  context: LearningContext;
  lessonsCompleted: number;
  averageScore: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ context, lessonsCompleted, averageScore }) => {
  return (
    <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Activity size={20} color="var(--primary)" /> Your Journey
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flex: 1 }}>
        
        <div style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Current Topic</div>
          <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{context.topic}</div>
        </div>

        <div style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Difficulty Level</div>
          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={16} /> {context.currentDifficulty}/10
          </div>
        </div>

        <div style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Avg. Score</div>
          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', color: averageScore >= 70 ? 'var(--success)' : averageScore > 0 ? 'var(--warning)' : 'var(--text-main)' }}>
            <Award size={16} /> {averageScore.toFixed(0)}%
          </div>
        </div>

        <div style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Completed</div>
          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={16} /> {lessonsCompleted} lesson(s)
          </div>
        </div>

      </div>

      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          <span>Overall Progress</span>
          <span>{Math.min(100, lessonsCompleted * 10)}%</span>
        </div>
        <div className="progress-container" style={{ margin: 0, height: '6px' }}>
          <div className="progress-bar" style={{ width: `${Math.min(100, lessonsCompleted * 10)}%` }} />
        </div>
      </div>
    </div>
  );
};
