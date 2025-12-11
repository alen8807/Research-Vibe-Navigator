import React, { useState } from 'react';
import InputSection from './components/InputSection';
import ResultsSection from './components/ResultsSection';
import { AnalysisState } from './types';
import { analyzeResearch } from './services/gemini';

const App: React.FC = () => {
  const [view, setView] = useState<'input' | 'result'>('input');
  const [lastInput, setLastInput] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
  });

  const handleAnalyze = async (input: string, mode: 'idea' | 'abstract', isFastTrack: boolean) => {
    setAnalysis(prev => ({ ...prev, isLoading: true, error: null }));
    setLastInput(input);
    
    try {
      const result = await analyzeResearch(input, mode, isFastTrack);
      setAnalysis({ isLoading: false, error: null, result });
      setView('result'); // Switch view on success
    } catch (err: any) {
      setAnalysis({ 
        isLoading: false, 
        error: "Analysis failed. Please try again.", 
        result: null 
      });
      // Do not switch view on error, let user try again
      console.error(err);
    }
  };

  const handleReset = () => {
    setView('input');
    setAnalysis({ isLoading: false, error: null, result: null });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-200">
               <span className="text-white font-bold text-lg">V</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">Research Vibe Navigator</h1>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
               Simulating Dec 2025
             </span>
             <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
               Gemini 3 Pro
             </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Intro Text - Only show on Input View */}
        {view === 'input' && (
          <div className="text-center max-w-2xl mx-auto mb-10 animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Your AI Research Strategist</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Design your next SOTA paper. <br/>
              Check trend vibes, find conferences, and plan your deadline strategy.
            </p>
          </div>
        )}

        {/* Input View */}
        {view === 'input' && (
          <>
            <InputSection onAnalyze={handleAnalyze} isLoading={analysis.isLoading} />
            {analysis.error && (
              <div className="mt-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-center gap-3 animate-fade-in">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium">Analysis Error</p>
                  <p className="text-sm opacity-90">{analysis.error}</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Results View */}
        {view === 'result' && analysis.result && (
          <ResultsSection result={analysis.result} userInput={lastInput} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-10">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Research Vibe Navigator. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
