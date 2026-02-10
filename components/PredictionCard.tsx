
import React, { useState } from 'react';
import { Fight, Prediction } from '../types';
import { generatePrediction } from '../services/geminiService';

interface PredictionCardProps {
  fight: Fight;
}

const PredictionCard: React.FC<PredictionCardProps> = ({ fight }) => {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300">
      <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{fight.weightClass}</span>
        <span className="text-xs font-medium text-red-500">{fight.date}</span>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-center w-5/12">
            <h3 className="oswald text-xl font-bold mb-1">{fight.fighterA.name}</h3>
            <p className="text-xs text-slate-400 mb-2">{fight.fighterA.record}</p>
            <div className="text-sm font-mono text-green-400">{fight.oddsA || 'N/A'}</div>
          </div>
          
          <div className="w-2/12 flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center font-bold italic text-white shadow-lg shadow-red-900/40">VS</div>
          </div>

          <div className="text-center w-5/12">
            <h3 className="oswald text-xl font-bold mb-1">{fight.fighterB.name}</h3>
            <p className="text-xs text-slate-400 mb-2">{fight.fighterB.record}</p>
            <div className="text-sm font-mono text-green-400">{fight.oddsB || 'N/A'}</div>
          </div>
        </div>

        {!prediction && !loading && (
          <button 
            onClick={handlePredict}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-900/20 uppercase tracking-wide flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Generate AI Analysis
          </button>
        )}

        {loading && (
          <div className="w-full py-4 flex flex-col items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
            <p className="text-xs text-slate-400 animate-pulse">Consulting the Oracle...</p>
          </div>
        )}

        {prediction && (
          <div className="mt-4 p-4 bg-slate-900/50 rounded-xl border border-red-900/30 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-tighter">AI Pick</span>
                <h4 className="text-lg font-extrabold text-red-500 uppercase">{prediction.winner}</h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Confidence</span>
                <div className="text-lg font-bold text-white">{prediction.confidence}%</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
                <span className="block text-[10px] text-slate-500 uppercase font-bold">Method</span>
                <span className="text-sm text-slate-200">{prediction.method}</span>
              </div>
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
                <span className="block text-[10px] text-slate-500 uppercase font-bold">Projected End</span>
                <span className="text-sm text-slate-200">{prediction.round || 'Full Fight'}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4 italic">
              "{prediction.reasoning}"
            </p>

            {prediction.sources && prediction.sources.length > 0 && (
              <div className="border-t border-slate-700 pt-3">
                <span className="text-[10px] text-slate-500 uppercase font-bold mb-2 block">Grounding Sources</span>
                <div className="flex flex-wrap gap-2">
                  {prediction.sources.map((source, i) => (
                    <a 
                      key={i} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-300 transition-colors truncate max-w-[150px]"
                    >
                      {source.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionCard;
