import React from 'react';
import { type Lesson } from '../types';
import { Card, Badge } from './UI';

export const StudyNotes: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Study Notes</h3>
          <Badge color="green">Summary</Badge>
        </div>

        <div className="space-y-8">
          <section>
            <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3">Key Points</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lesson.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start p-3 bg-white/5 rounded-lg border border-white/10 text-white/80">
                  <span className="text-blue-400 mr-2">✦</span>
                  {point}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3">Important Summary</h4>
            <p className="text-white/70 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10">
              {lesson.summary}
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-purple-500/5 border border-purple-500/20 p-4 rounded-xl">
              <h4 className="text-purple-400 font-bold mb-2 flex items-center">
                <span className="mr-2">🧠</span> Memory Trick
              </h4>
              <p className="text-white/70 italic">{lesson.memoryTrick}</p>
            </section>

            <section className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl">
              <h4 className="text-blue-400 font-bold mb-2 flex items-center">
                <span className="mr-2">📝</span> Practice Task
              </h4>
              <p className="text-white/70">{lesson.practiceTask}</p>
            </section>
          </div>
        </div>
      </Card>
    </div>
  );
};
