import React from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { OnboardingForm } from './components/OnboardingForm';
import { LearningDashboard } from './components/LearningDashboard';
import { Button } from './components/UI';

const AppContent: React.FC = () => {
  const { user, userProfile, loading, isDemo, signInAsGuest, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Hack2Skill Logo */}
        <div className="fixed top-6 left-6 z-50 animate-in fade-in slide-in-from-top-4 duration-1000">
          <img 
            src="/h2s-logo.png" 
            alt="Hack2Skill Logo" 
            className="h-10 w-auto object-contain hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          />
        </div>

        <div className="mb-8 animate-in fade-in zoom-in duration-700">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-4xl shadow-2xl shadow-blue-500/20 mx-auto mb-6">
            🎓
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight cursor-default">
            {"Learning ".split("").map((char, i) => (
              <span key={i} className="inline-block hover:scale-125 transition-transform duration-200">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
            {"Companion AI".split("").map((char, i) => (
              <span key={i} className="inline-block hover:scale-125 transition-transform duration-200 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          <p className="text-white/60 text-xl max-w-md mx-auto">
            Your personalized AI tutor that adapts to your pace, detects weak areas, and builds your custom learning path.
          </p>
        </div>
        
        <div className="space-y-4 w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 delay-300">
          <Button className="w-full py-4 text-lg overflow-hidden" onClick={signInAsGuest}>
            {"Start Learning Now".split("").map((char, i) => (
              <span key={i} className="inline-block hover:scale-125 transition-transform duration-200">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </Button>
          <p className="text-white/40 text-sm">
            No account required. Try the demo mode instantly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30">
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-lg shadow-lg shadow-blue-500/20">
              🎓
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">Learning Companion AI</span>
          </div>

          <div className="flex items-center gap-4">
            {isDemo && (
              <span className="bg-orange-500/10 text-orange-400 text-xs font-bold px-2 py-1 rounded border border-orange-500/20">
                Demo Mode Active
              </span>
            )}
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            <Button variant="ghost" className="text-sm" onClick={signOut}>Sign Out</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {!userProfile?.onboarded ? (
          <OnboardingForm />
        ) : (
          <LearningDashboard />
        )}
      </main>

      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/40 text-sm mb-4">
            Powered by Google Gemini API & Firebase
          </p>
          <div className="flex justify-center gap-6 text-white/20">
            <span className="hover:text-blue-400 transition-colors cursor-pointer">Security</span>
            <span className="hover:text-blue-400 transition-colors cursor-pointer">Accessibility</span>
            <span className="hover:text-blue-400 transition-colors cursor-pointer">Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
