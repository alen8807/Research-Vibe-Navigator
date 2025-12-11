import React, { useState, useEffect } from 'react';

interface InputSectionProps {
  onAnalyze: (input: string, mode: 'idea' | 'abstract', isFastTrack: boolean) => void;
  isLoading: boolean;
}

const LOADING_STEPS = [
  "Initializing Vibe Check...",
  "Scanning CVPR/NeurIPS Trends...",
  "Synthesizing Novel Methodology...",
  "Cross-referencing SOTA Papers...",
  "Calculating Success Probability...",
  "Finalizing Visual Roadmap...",
];

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [mode, setMode] = useState<'idea' | 'abstract'>('idea');
  const [input, setInput] = useState('');
  const [isFastTrack, setIsFastTrack] = useState(false);
  const [loadingText, setLoadingText] = useState(LOADING_STEPS[0]);

  // Cycle through loading messages
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      let step = 0;
      setLoadingText(LOADING_STEPS[0]);
      interval = setInterval(() => {
        step = (step + 1) % LOADING_STEPS.length;
        setLoadingText(LOADING_STEPS[step]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnalyze(input, mode, isFastTrack);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setMode('idea')}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            mode === 'idea' 
              ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>💡</span> Get Research Idea
        </button>
        <button
          onClick={() => setMode('abstract')}
          className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            mode === 'abstract' 
              ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>📝</span> Evaluate Abstract
        </button>
      </div>

      <div className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-2">
          {mode === 'idea' ? 'Enter a Research Topic' : 'Input Research Abstract'}
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          {mode === 'idea' 
            ? 'We will generate a novel abstract for you and then analyze its vibe.' 
            : 'Paste your existing abstract to check its trendiness and conference fit.'}
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full h-48 p-4 rounded-xl border border-slate-300 bg-white text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none placeholder-slate-400 font-normal leading-relaxed mb-4"
            placeholder={mode === 'idea' 
              ? "e.g., 'Generative Video for Robotics', 'Efficient LLM Inference'..." 
              : "Paste your research abstract here..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Fast Track Toggle */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={isFastTrack}
                  onChange={(e) => setIsFastTrack(e.target.checked)}
                  disabled={isLoading}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
              </div>
              <span className={`text-sm font-medium ${isFastTrack ? 'text-rose-600' : 'text-slate-600'}`}>
                🚀 Apply Fast <span className="text-xs font-normal opacity-80">(Deadline &lt; 2 months)</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`
                px-8 py-3 rounded-lg font-medium text-white transition-all transform flex items-center justify-center gap-2 min-w-[200px]
                ${!input.trim() || isLoading 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] shadow-md shadow-indigo-200'}
              `}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="animate-pulse">{loadingText}</span>
                </>
              ) : (
                <>
                  Analyze Vibe 🔎
                </>
              )}
            </button>
          </div>
          
          {/* Progress Bar (Visual) */}
          {isLoading && (
            <div className="w-full bg-slate-100 h-1 mt-4 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500 animate-progress-indeterminate"></div>
            </div>
          )}
        </form>
      </div>
      <style>{`
        @keyframes progress-indeterminate {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 70%; margin-left: 30%; }
          100% { width: 0%; margin-left: 100%; }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default InputSection;