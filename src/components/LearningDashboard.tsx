import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { type RoadmapStep, type Lesson, type ProgressData, type QuizResult } from '../types';
import { generateRoadmap, generateLessonContent, generateDailyPlan } from '../services/geminiService';
import { Button, Card, ProgressBar, Badge } from './UI';
import { Quiz } from './Quiz';
import { Flashcards } from './Flashcards';
import { StudyNotes } from './StudyNotes';

export const LearningDashboard: React.FC = () => {
  const { userProfile, updateProfile } = useAuth();
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);
  const [currentStep, setCurrentStep] = useState<RoadmapStep | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'lesson' | 'quiz' | 'flashcards' | 'notes'>('lesson');
  const [dailyPlan, setDailyPlan] = useState<string>('');
  const [progress, setProgress] = useState<ProgressData>({
    completedLessons: 0,
    averageQuizScore: 0,
    currentDifficulty: 'Beginner',
    weakTopics: [],
    streak: 1,
    lastActive: Date.now()
  });

  useEffect(() => {
    if (userProfile && roadmap.length === 0) {
      handleGenerateRoadmap();
    }
  }, [userProfile]);

  const handleGenerateRoadmap = async () => {
    if (!userProfile) return;
    setLoading(true);
    try {
      const rm = await generateRoadmap(userProfile);
      setRoadmap(rm);
      setCurrentStep(rm[0]);
      await handleLoadLesson(rm[0]);
      const plan = await generateDailyPlan(userProfile);
      setDailyPlan(plan);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadLesson = async (step: RoadmapStep, diffOverride?: any) => {
    if (!userProfile) return;
    setLoading(true);
    try {
      const content = await generateLessonContent(userProfile, step, diffOverride);
      setLesson(content);
      setView('lesson');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = async (result: QuizResult) => {
    // Update progress
    const newProgress = {
      ...progress,
      completedLessons: progress.completedLessons + 1,
      averageQuizScore: (progress.averageQuizScore + result.percentage) / 2,
      weakTopics: [...new Set([...progress.weakTopics, ...result.wrongAnswers.map(wa => wa.concept)])]
    };
    setProgress(newProgress);
    
    // Mark step as completed
    if (currentStep) {
      const newRoadmap = roadmap.map(s => s.step === currentStep.step ? { ...s, completed: true } : s);
      setRoadmap(newRoadmap);
      
      // Move to next step logic could go here or wait for user click
    }
    setView('lesson');
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  if (loading && !lesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-white/60 animate-pulse">Generating your personalized content...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Sidebar - Roadmap & Progress */}
      <div className="space-y-6">
        <Card>
          <h3 className="text-xl font-bold mb-4 text-white">Your Learning Path</h3>
          <div className="space-y-4">
            {roadmap.map((step) => (
              <div 
                key={step.step}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  currentStep?.step === step.step 
                    ? 'bg-blue-600/20 border-blue-500/50' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                onClick={() => {
                  setCurrentStep(step);
                  handleLoadLesson(step);
                }}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-white/40">Step {step.step}</span>
                  {step.completed && <Badge color="green">Completed</Badge>}
                </div>
                <h4 className="font-semibold text-white">{step.title}</h4>
                <p className="text-sm text-white/60 line-clamp-1">{step.description}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-bold mb-4 text-white">Progress Analytics</h3>
          <div className="space-y-4">
            <ProgressBar 
              progress={(roadmap.filter(s => s.completed).length / roadmap.length) * 100} 
              label="Overall Completion" 
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-center">
                <span className="block text-2xl font-bold text-blue-400">{Math.round(progress.averageQuizScore)}%</span>
                <span className="text-xs text-white/40 uppercase">Avg Score</span>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-center">
                <span className="block text-2xl font-bold text-purple-400">{progress.streak}</span>
                <span className="text-xs text-white/40 uppercase">Day Streak</span>
              </div>
            </div>
            {progress.weakTopics.length > 0 && (
              <div>
                <span className="text-xs font-bold text-orange-400 uppercase mb-2 block">Needs Attention</span>
                <div className="flex flex-wrap gap-2">
                  {progress.weakTopics.slice(0, 3).map(topic => (
                    <Badge key={topic} color="orange">{topic}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border-indigo-500/30">
          <h3 className="text-lg font-bold mb-2 text-white">Daily Study Plan</h3>
          <p className="text-sm text-indigo-200/80 leading-relaxed">
            {dailyPlan || "Generating your plan for today..."}
          </p>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button 
            variant={view === 'lesson' ? 'primary' : 'ghost'} 
            onClick={() => setView('lesson')}
          >
            Lesson
          </Button>
          <Button 
            variant={view === 'notes' ? 'primary' : 'ghost'} 
            onClick={() => setView('notes')}
          >
            Study Notes
          </Button>
          <Button 
            variant={view === 'flashcards' ? 'primary' : 'ghost'} 
            onClick={() => setView('flashcards')}
          >
            Flashcards
          </Button>
          <Button 
            variant={view === 'quiz' ? 'secondary' : 'ghost'} 
            onClick={() => setView('quiz')}
          >
            Take Quiz
          </Button>
        </div>

        {view === 'lesson' && lesson && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <Card className="relative group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Badge color="purple" className="mb-2">{lesson.difficulty}</Badge>
                  <h2 className="text-3xl font-bold text-white">{lesson.title}</h2>
                </div>
                <Button variant="outline" onClick={() => speak(lesson.explanation)} className="group-hover:opacity-100">
                  <span className="mr-2">🔊</span> Read Aloud
                </Button>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  {lesson.explanation}
                </p>
                
                <div className="bg-blue-500/5 border-l-4 border-blue-500 p-4 rounded-r-xl mb-6">
                  <h4 className="text-blue-400 font-bold mb-2 flex items-center">
                    <span className="mr-2">💡</span> Real-Life Example
                  </h4>
                  <p className="text-white/70 italic">{lesson.example}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-xl">
                    <h4 className="text-red-400 font-bold mb-2">Common Mistakes</h4>
                    <ul className="list-disc list-inside text-sm text-white/60 space-y-1">
                      {lesson.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl">
                    <h4 className="text-emerald-400 font-bold mb-2">Practice Task</h4>
                    <p className="text-sm text-white/70">{lesson.practiceTask}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-6 border-t border-white/10">
                <Button variant="outline" onClick={() => handleLoadLesson(currentStep!, 'Beginner')}>Explain Easier</Button>
                <Button variant="outline" onClick={() => setView('notes')}>Show Summary</Button>
                <Button variant="secondary" onClick={() => setView('quiz')}>Take Quiz</Button>
                <Button 
                  className="ml-auto" 
                  onClick={() => {
                    const next = roadmap.find(s => s.step === (currentStep?.step || 0) + 1);
                    if (next) {
                      setCurrentStep(next);
                      handleLoadLesson(next);
                    }
                  }}
                >
                  Next Lesson →
                </Button>
              </div>
            </Card>
          </div>
        )}

        {view === 'quiz' && lesson && (
          <Quiz lesson={lesson} onComplete={handleQuizComplete} />
        )}

        {view === 'flashcards' && lesson && (
          <Flashcards lesson={lesson} />
        )}

        {view === 'notes' && lesson && (
          <StudyNotes lesson={lesson} />
        )}
      </div>
    </div>
  );
};
