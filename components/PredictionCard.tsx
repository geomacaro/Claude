
import React, { useState, useEffect } from 'react';
import { Fight, Prediction, LoggedBet } from '../types';
import { generatePrediction } from '../services/geminiService';

interface PredictionCardProps {
  fight: Fight;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ fight }) => {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [bet, setBet] = useState<LoggedBet | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  
  // Form State
  const [formFighter, setFormFighter] = useState(fight.fighterA.name);
  const [formAmount, setFormAmount] = useState<string>('');
  const [formOdds, setFormOdds] = useState<string>(fight.oddsA || '');

  useEffect(() => {
    const savedBets = JSON.parse(localStorage.getItem('octagon_bets') || '{}');
    if (savedBets[fight.id]) {
      setBet(savedBets[fight.id]);
    }
  }, [fight.id]);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const result = await generatePrediction(fight);
      setPrediction(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBet = (e: React.FormEvent) => {
    e.preventDefault();
    const newBet: LoggedBet = {
      fightId: fight.id,
      fighterName: formFighter,
      amount: parseFloat(formAmount) || 0,
      odds: formOdds,
      timestamp: Date.now()
    };

    const savedBets = JSON.parse(localStorage.getItem('octagon_bets') || '{}');
    savedBets[fight.id] = newBet;
    localStorage.setItem('octagon_bets', JSON.stringify(savedBets));
    
    setBet(newBet);
    setIsLogging(false);
  };

  const handleClearBet = () => {
    const savedBets = JSON.parse(localStorage.getItem('octagon_bets') || '{}');
    delete savedBets[fight.id];
    localStorage.setItem('octagon_bets', JSON.stringify(savedBets));
    setBet(null);
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300 flex flex-col h-full">
      <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{fight.weightClass}</span>
        <span className="text-xs font-medium text-red-500">{fight.date}</span>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="text-center w-5/12">
            <h3 className="oswald text-xl font-bold mb-1 truncate">{fight.fighterA.name}</h3>
            <p className="text-xs text-slate-400 mb-2">{fight.fighterA.record}</p>
            <div className="text-sm font-mono text-green-400">{fight.oddsA || 'N/A'}</div>
          </div>
          
          <div className="w-2/12 flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center font-bold italic text-white shadow-lg shadow-red-900/40">VS</div>
          </div>

          <div className="text-center w-5/12">
            <h3 className="oswald text-xl font-bold mb-1 truncate">{fight.fighterB.name}</h3>
            <p className="text-xs text-slate-400 mb-2">{fight.fighterB.record}</p>
            <div className="text-sm font-mono text-green-400">{fight.oddsB || 'N/A'}</div>
          </div>
        </div>

        {!prediction && !loading && (
          <button 
            onClick={handlePredict}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-900/20 uppercase tracking-wide flex items-center justify-center gap-2 mb-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            AI Analysis
          </button>
        )}

        {loading && (
          <div className="w-full py-4 flex flex-col items-center justify-center gap-2 mb-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            <p className="text-xs text-slate-400 animate-pulse">Consulting the Oracle...</p>
          </div>
        )}

        {prediction && (
          <div className="mb-4 p-4 bg-slate-900/50 rounded-xl border border-red-900/30 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-tighter">AI Pick</span>
                <h4 className="text-md font-extrabold text-red-500 uppercase">{prediction.winner}</h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Confidence</span>
                <div className="text-md font-bold text-white">{prediction.confidence}%</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-2 line-clamp-2 italic">
              "{prediction.reasoning}"
            </p>
          </div>
        )}

        {/* Bet Tracking Section */}
        <div className="mt-auto pt-4 border-t border-slate-700/50">
          {!bet && !isLogging && (
            <button 
              onClick={() => setIsLogging(true)}
              className="w-full py-2 border border-slate-600 hover:border-slate-400 text-slate-400 hover:text-white text-xs font-bold rounded-lg transition-all uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Log A Bet
            </button>
          )}

          {isLogging && (
            <form onSubmit={handleSaveBet} className="bg-slate-900/80 p-4 rounded-xl border border-slate-700 animate-in fade-in zoom-in-95">
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-black text-slate-500 mb-1">Select Fighter</label>
                  <select 
                    value={formFighter}
                    onChange={(e) => {
                      setFormFighter(e.target.value);
                      setFormOdds(e.target.value === fight.fighterA.name ? (fight.oddsA || '') : (fight.oddsB || ''));
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value={fight.fighterA.name}>{fight.fighterA.name}</option>
                    <option value={fight.fighterB.name}>{fight.fighterB.name}</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-500 mb-1">Amount ($)</label>
                    <input 
                      type="number"
                      required
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-500 mb-1">Odds</label>
                    <input 
                      type="text"
                      required
                      value={formOdds}
                      onChange={(e) => setFormOdds(e.target.value)}
                      placeholder="+150"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-grow py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-[10px] uppercase transition-colors">Save Bet</button>
                  <button type="button" onClick={() => setIsLogging(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded-lg text-[10px] uppercase transition-colors">Cancel</button>
                </div>
              </div>
            </form>
          )}

          {bet && (
            <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-xl flex justify-between items-center group animate-in slide-in-from-right-4">
              <div>
                <span className="block text-[10px] uppercase font-black text-green-500 tracking-tighter">Your Active Bet</span>
                <div className="text-xs text-white font-medium">
                  <span className="text-green-400">${bet.amount}</span> on <span className="font-bold">{bet.fighterName}</span> @ <span className="font-mono">{bet.odds}</span>
                </div>
              </div>
              <button 
                onClick={handleClearBet}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-500 hover:text-red-500"
                title="Remove Bet"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
