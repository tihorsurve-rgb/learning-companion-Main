import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' }> = ({ 
  children, variant = 'primary', className = '', ...props 
}) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25',
    secondary: 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25',
    outline: 'bg-transparent border border-white/20 hover:bg-white/10 text-white',
    ghost: 'bg-transparent hover:bg-white/5 text-white/70 hover:text-white',
    danger: 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30'
  };

  return (
    <button 
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-6 ${className}`}>
    {children}
  </div>
);

export const ProgressBar: React.FC<{ progress: number; label?: string; sublabel?: string }> = ({ progress, label, sublabel }) => (
  <div className="w-full">
    {(label || sublabel) && (
      <div className="flex justify-between mb-2 text-sm">
        <span className="font-medium text-white/80">{label}</span>
        <span className="text-white/60">{sublabel || `${Math.round(progress)}%`}</span>
      </div>
    )}
    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
      <div 
        className="bg-blue-500 h-full transition-all duration-500 ease-out" 
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: 'blue' | 'purple' | 'green' | 'orange' }> = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    orange: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  };
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-bold border ${colors[color]}`}>
      {children}
    </span>
  );
};
