import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { type Difficulty, type LearningPace, type LearningStyle } from '../types';

export const OnboardingForm: React.FC = () => {
  const { updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    topic: '',
    level: 'Beginner' as Difficulty,
    goal: '',
    pace: 'Normal' as LearningPace,
    style: 'Example-based' as LearningStyle,
    dailyTime: 20,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ ...formData, onboarded: true });
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 text-white">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to Learning Companion AI
          </h2>
          <span className="text-sm font-medium text-white/60">Step {step} of 3</span>
        </div>
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-300" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium mb-2">What do you want to learn?</label>
              <input
                id="topic"
                name="topic"
                type="text"
                required
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g. Photosynthesis, React Hooks, Quantum Physics"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label htmlFor="level" className="block text-sm font-medium mb-2">Current Level</label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
              >
                <option value="Beginner" className="bg-slate-900">Beginner</option>
                <option value="Intermediate" className="bg-slate-900">Intermediate</option>
                <option value="Advanced" className="bg-slate-900">Advanced</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div>
              <label htmlFor="goal" className="block text-sm font-medium mb-2">Your Learning Goal</label>
              <textarea
                id="goal"
                name="goal"
                required
                value={formData.goal}
                onChange={handleChange}
                placeholder="What do you want to achieve?"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="pace" className="block text-sm font-medium mb-2">Preferred Pace</label>
                <select
                  id="pace"
                  name="pace"
                  value={formData.pace}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Slow" className="bg-slate-900">Slow</option>
                  <option value="Normal" className="bg-slate-900">Normal</option>
                  <option value="Fast" className="bg-slate-900">Fast</option>
                </select>
              </div>
              <div>
                <label htmlFor="style" className="block text-sm font-medium mb-2">Learning Style</label>
                <select
                  id="style"
                  name="style"
                  value={formData.style}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Visual" className="bg-slate-900">Visual</option>
                  <option value="Example-based" className="bg-slate-900">Example-based</option>
                  <option value="Quiz-based" className="bg-slate-900">Quiz-based</option>
                  <option value="Revision-based" className="bg-slate-900">Revision-based</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div>
              <label htmlFor="dailyTime" className="block text-sm font-medium mb-2">Daily Commitment (Minutes)</label>
              <div className="flex gap-4">
                {[10, 20, 30].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, dailyTime: t }))}
                    className={`flex-1 p-4 rounded-xl border transition-all ${
                      formData.dailyTime === t 
                        ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-500/20' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {t} min
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-200 text-sm">
              <p>Great! We'll tailor a {formData.dailyTime}-minute study session for you every day.</p>
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3 px-6 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-semibold"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all font-semibold shadow-lg shadow-blue-500/25"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transition-all font-semibold shadow-lg shadow-blue-500/25"
            >
              Start My Journey
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
