import React, { useState, useEffect } from 'react';
import { AnalysisResult, Paper } from '../types';
import VibeRadarChart from './RadarChart';

declare global {
  interface Window {
    mermaid: any;
  }
}

interface ResultsSectionProps {
  result: AnalysisResult;
  userInput: string;
  onReset: () => void;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ result, userInput, onReset }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);

  // If input was invalid, show the error state immediately
  if (!result.isValid) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in pt-10">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Input Needs Revision</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {result.validationFeedback || "The input provided doesn't appear to be a valid research topic or abstract. Please try again with more specific technical details."}
          </p>
          <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 text-left">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">You entered:</p>
            <p className="text-gray-800 italic">"{userInput}"</p>
          </div>
          <button 
            onClick={onReset}
            className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Re-run Mermaid when the code changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.mermaid) {
      window.mermaid.run({
        querySelector: '.mermaid',
      });
    }
  }, [result.methodology?.mermaidCode]);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <button 
          onClick={onReset}
          className="text-slate-500 hover:text-indigo-600 font-medium text-sm flex items-center gap-1 transition-colors"
        >
          ← Start Over
        </button>
        <button 
          onClick={() => setShowPrompt(!showPrompt)}
          className="text-slate-400 hover:text-slate-600 text-xs flex items-center gap-1"
        >
          {showPrompt ? 'Hide System Prompt' : 'Show Prompt Used'} ℹ️
        </button>
      </div>

      {/* Input Visibility Section - Clearly Visible as requested */}
      <div className="bg-indigo-50/50 rounded-xl p-6 border border-indigo-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
        <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          Your Research Input
        </h3>
        <p className="text-slate-900 text-lg leading-relaxed font-medium font-serif">
          "{userInput}"
        </p>
      </div>

      {/* System Prompt Transparency (Expander) */}
      {showPrompt && (
        <div className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-700">
          <p className="mb-2 text-slate-500">// System Prompt Configuration</p>
          <p>Role: "Research Vibe Navigator"</p>
          <p>Simulated Date: December 2025</p>
          <p>Grading: Strict/Objective (Normal Dist.)</p>
          <p>Validation: Enabled</p>
        </div>
      )}

      {/* Generated Abstract (if Ideation) */}
      {result.generatedAbstract && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-indigo-900 font-bold text-lg mb-3 flex items-center gap-2">
            💡 Generated Research Idea
          </h3>
          <p className="text-slate-800 leading-relaxed font-serif text-lg">
            {result.generatedAbstract}
          </p>
        </div>
      )}

      {/* Keywords & Vibe Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
           <h3 className="text-slate-500 font-medium text-xs uppercase tracking-wider mb-3">Extracted Keywords</h3>
           <div className="flex flex-wrap gap-2 mb-4">
             {result.keywords?.map((kw, i) => (
               <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border border-slate-200">
                 #{kw}
               </span>
             ))}
           </div>
           <div className="border-t border-slate-100 pt-4">
             <h3 className="text-slate-500 font-medium text-xs uppercase tracking-wider mb-2">One-Liner Insight</h3>
             <p className="text-lg text-slate-800 font-medium">"{result.oneLiner}"</p>
           </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg shadow-slate-200 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Background effect */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
          
          <span className="text-3xl mb-2 relative z-10">{result.trendMatchScore > 80 ? '🔥' : result.trendMatchScore > 50 ? '⚖️' : '❄️'}</span>
          <div className="text-5xl font-bold mb-1 relative z-10">{result.trendMatchScore}%</div>
          <p className="text-slate-300 text-sm opacity-90 relative z-10">Objective Vibe Score</p>
        </div>
      </div>

      {/* Methodology Figure (New) */}
      {result.methodology && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-slate-800 font-bold text-lg mb-4 flex items-center gap-2">
             🧩 Proposed Methodology
          </h3>
          <p className="text-slate-600 text-sm mb-6 max-w-3xl leading-relaxed">
            {result.methodology.description}
          </p>
          <div className="flex justify-center bg-slate-50 rounded-xl p-6 border border-slate-100 overflow-x-auto">
            <div className="mermaid text-center">
              {result.methodology.mermaidCode}
            </div>
          </div>
        </div>
      )}

      {/* Top Conferences TABS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 pt-6 pb-2 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <h3 className="text-slate-800 font-bold text-lg flex items-center gap-2">
            🎯 Recommended Conferences
          </h3>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {result.conferences?.map((conf, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === idx 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {conf.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6 bg-slate-50/50 min-h-[300px]">
          {result.conferences?.map((conf, idx) => (
            <div key={idx} className={activeTab === idx ? 'block animate-fade-in' : 'hidden'}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-1">{conf.name}</h4>
                  <p className="text-slate-600 text-sm max-w-2xl">{conf.reason}</p>
                </div>
                <a 
                  href={conf.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap"
                >
                  Visit Website ↗
                </a>
              </div>

              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                📚 Relevant Papers for {conf.name}
              </h5>
              <div className="space-y-3">
                {conf.relevantPapers.map((paper, pIdx) => (
                  <PaperAccordionItem key={pIdx} paper={paper} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual & Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Analysis */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
           <h3 className="text-slate-800 font-bold text-lg mb-6 flex items-center gap-2">
            📊 Visual Analysis
          </h3>
          <div className="flex-grow flex items-center justify-center">
             {result.metrics && <VibeRadarChart data={result.metrics} />}
          </div>
        </div>

        {/* Roadmap */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-slate-800 font-bold text-lg mb-6 flex items-center gap-2">
            🚀 Roadmap (Dec '25 Start)
          </h3>
          <div className="space-y-8 relative pl-2">
            <div className="absolute left-[19px] top-2 bottom-4 w-0.5 bg-slate-200"></div>
            {result.roadmap?.map((step, index) => (
              <div key={index} className="relative flex gap-4">
                <div className="z-10 mt-1.5 w-4 h-4 rounded-full border-2 border-indigo-500 bg-white shadow-sm flex-shrink-0"></div>
                <div className="flex-1 pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                    <h4 className="font-semibold text-slate-800 text-base">{step.phase}</h4>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 w-fit mt-1 sm:mt-0">
                      {step.timeline}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

// Expandable Paper Item Component with Real Links
const PaperAccordionItem: React.FC<{ paper: Paper }> = ({ paper }) => {
  const [isOpen, setIsOpen] = useState(false);
  const scholarLink = `https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title)}`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all hover:border-indigo-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left focus:outline-none hover:bg-slate-50 transition-colors"
      >
        <div className="flex-1 pr-4">
          <div className="font-semibold text-slate-800 group-hover:text-indigo-700">
            {paper.title} <span className="text-slate-400 font-normal text-sm">({paper.year})</span>
          </div>
          {!isOpen && (
            <p className="text-sm text-slate-500 mt-1 truncate max-w-lg">{paper.oneLiner}</p>
          )}
        </div>
        <svg 
          className={`w-5 h-5 text-slate-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-0 bg-white">
          <div className="border-t border-slate-100 pt-3 mt-1 space-y-3 animate-fade-in">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Key Insight</span>
              <p className="text-sm text-slate-800 font-medium mt-1">{paper.oneLiner}</p>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Abstract</span>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">{paper.abstract}</p>
            </div>
            
            <div className="flex items-center gap-3 pt-2">
              <a 
                href={scholarLink}
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-medium text-white bg-indigo-600 px-3 py-1.5 rounded hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                Find on Google Scholar
              </a>

              {paper.github && (
                 <a 
                   href={`https://${paper.github}`} 
                   target="_blank" 
                   rel="noreferrer"
                   className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-100 px-3 py-1.5 rounded hover:bg-slate-200 transition-colors border border-slate-200"
                 >
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                   {paper.github}
                 </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;
