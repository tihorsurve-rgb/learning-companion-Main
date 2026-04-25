import { useState } from 'react';
import { OnboardingForm } from './components/OnboardingForm';
import { LearningDashboard } from './components/LearningDashboard';
import type { LearningContext } from './services/geminiService';

function App() {
  const [learningContext, setLearningContext] = useState<LearningContext | null>(null);

  const handleOnboardingComplete = (context: LearningContext) => {
    setLearningContext(context);
  };

  const handleReset = () => {
    setLearningContext(null);
  };

  return (
    <div className="app-layout">
      {/* Header */}
      <header style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900 }}>
              L
            </div>
            Learning Companion
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {!learningContext ? (
          <OnboardingForm onComplete={handleOnboardingComplete} />
        ) : (
          <LearningDashboard initialContext={learningContext} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <p>Built with React, Vite, Firebase, and Google Gemini API</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
