
import React, { useState, useEffect } from 'react';
import { Fight, AppState } from './types';
import { fetchUpcomingFights } from './services/geminiService';
import PredictionCard from './components/PredictionCard';

const App: React.FC = () => {
  const [fights, setFights] = useState<Fight[]>([]);
  const [status, setStatus] = useState<AppState>(AppState.LOADING);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        const data = await fetchUpcomingFights();
        setFights(data);
        setStatus(AppState.IDLE);
      } catch (err) {
        setError("Failed to fetch upcoming UFC events. Check your API connection.");
        setStatus(AppState.ERROR);
      }
    };

    initApp();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform cursor-pointer">
              <span className="oswald text-2xl font-black italic">O</span>
            </div>
            <div>
              <h1 className="oswald text-xl font-bold tracking-tight">OCTAGON<span className="text-red-600">ORACLE</span></h1>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">AI-Driven UFC Intelligence</p>
            </div>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium uppercase tracking-tighter text-slate-400">
            <a href="#" className="hover:text-red-500 transition-colors">Upcoming Cards</a>
            <a href="#" className="hover:text-red-500 transition-colors">Historical Data</a>
            <a href="#" className="hover:text-red-500 transition-colors">Odds Analysis</a>
          </div>
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
              Live Feed
            </span>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        {/* Hero Section */}
        <header className="mb-12">
          <h2 className="oswald text-4xl md:text-6xl font-black uppercase mb-4 leading-none">
            The Ultimate <span className="text-red-600 underline decoration-slate-800 underline-offset-8">Prediction</span> Engine
          </h2>
          <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
            Leveraging Gemini 3 Pro reasoning and real-time Google Search grounding to provide professional-grade analysis for every UFC matchup.
          </p>
        </header>

        {status === AppState.LOADING && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-slate-800 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-t-red-600 rounded-full absolute top-0 animate-spin"></div>
            </div>
            <p className="mt-6 text-slate-400 font-medium animate-pulse">Scanning the Octagon...</p>
          </div>
        )}

        {status === AppState.ERROR && (
          <div className="bg-red-900/20 border border-red-800 p-8 rounded-2xl text-center">
            <svg className="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <h3 className="text-xl font-bold text-white mb-2">System Interruption</h3>
            <p className="text-slate-400 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}

        {status === AppState.IDLE && (
          <>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-grow bg-slate-800"></div>
              <span className="oswald text-xl font-bold text-slate-500 uppercase">Current Event Board</span>
              <div className="h-px flex-grow bg-slate-800"></div>
            </div>

            {fights.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fights.map((fight) => (
                  <PredictionCard key={fight.id} fight={fight} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                <p className="text-slate-500">No upcoming fights found in the current window.</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
             <h4 className="oswald text-lg font-bold mb-4 uppercase">About OctagonOracle</h4>
             <p className="text-sm text-slate-500 leading-relaxed">
               A proof-of-concept sports analytics platform demonstrating the power of Large Language Models in real-time predictive modeling. Not intended for actual gambling advice.
             </p>
          </div>
          <div>
            <h4 className="oswald text-lg font-bold mb-4 uppercase">Data Sources</h4>
            <ul className="text-sm text-slate-500 space-y-2">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-600"></div> Gemini 3.0 Pro Intelligence</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-600"></div> Google Search Real-Time Grounding</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-600"></div> Market Odds Synthesis</li>
            </ul>
          </div>
          <div>
             <h4 className="oswald text-lg font-bold mb-4 uppercase">Legal Disclaimer</h4>
             <p className="text-[10px] text-slate-600 leading-tight">
               Predictions provided by this AI are for entertainment purposes only. MMA is a volatile sport with high uncertainty. We do not guarantee accuracy or financial results. Gamble responsibly.
             </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-[10px] text-slate-700 uppercase tracking-widest">
          &copy; 2024 OctagonOracle AI. All Rights Reserved. Build V2.5.0
        </div>
      </footer>
    </div>
  );
};

export default App;
