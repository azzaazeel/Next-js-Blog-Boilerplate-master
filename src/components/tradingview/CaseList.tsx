import React from 'react';

type CaseMetadata = {
  name: string;
  releasedDate: string;
  discontinuedDate: string;
  startDateStr: string;
  endDateStr: string;
};

interface CaseListProps {
  cases: CaseMetadata[];
  selectedCaseNames: Set<string>;
  toggleCase: (name: string) => void;
  addAll: () => void;
  clearAll: () => void;
  filename: string;
  showDiscontinued: boolean;
  setShowDiscontinued: (show: boolean) => void;
}

const CaseList: React.FC<CaseListProps> = ({
  cases,
  selectedCaseNames,
  toggleCase,
  addAll,
  clearAll,
  filename,
  showDiscontinued,
  setShowDiscontinued
}) => {
  return (
    <div className={`bg-[#1a1d26]/30 p-6 rounded-2xl border border-gray-800 shadow-inner ${!filename ? 'opacity-20 pointer-events-none' : ''}`}>
       <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-0 flex items-center gap-2">
               CS2 Cases <span className="text-emerald-400/50">— Milestone Dates</span>
            </h4>
            
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={showDiscontinued} 
                onChange={e => setShowDiscontinued(e.target.checked)}
                className="w-3 h-3 rounded border-gray-700 bg-gray-900 text-emerald-500 focus:ring-emerald-500" 
              />
              <span className={`text-[10px] font-bold uppercase transition-colors ${showDiscontinued ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-400'}`}>
                Show Disc. Date
              </span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            {cases.length > 0 && (
              <button onClick={addAll} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-lg transition-all uppercase tracking-wider">Add all</button>
            )}
            {selectedCaseNames.size > 0 && (
              <button onClick={clearAll} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold px-3 py-1 rounded-lg transition-all uppercase tracking-wider">Clear</button>
            )}
          </div>
       </div>
       
       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[160px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-800">
          {cases.map(c => (
            <div 
              key={c.name}
              onClick={() => toggleCase(c.name)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-[80px] ${
                selectedCaseNames.has(c.name) ? 'bg-blue-500/20 border-blue-500/50 ring-1 ring-blue-500/20' : 'bg-[#0f1117] border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[7px] font-bold text-gray-500 uppercase tracking-tighter">Rel: {c.releasedDate.split(',')[0]}</span>
                {selectedCaseNames.has(c.name) && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>}
              </div>
              <p className={`text-[10px] font-bold leading-tight mb-1 ${selectedCaseNames.has(c.name) ? 'text-emerald-200' : 'text-gray-400'}`}>
                {c.name}
              </p>
              <div className="mt-auto flex justify-between items-center border-t border-gray-800/50 pt-1">
                <span className={`text-[7px] font-bold ${c.discontinuedDate === 'TBD' ? 'text-emerald-500/80' : 'text-rose-400/80'} truncate`}>
                  {c.discontinuedDate === 'TBD' ? '● ACTIVE' : `Disc: ${c.discontinuedDate.replace('th', '').replace('st', '').replace('nd', '').replace('rd', '')}`}
                </span>
                <span className="text-[7px] font-bold text-gray-600">CASE</span>
              </div>
            </div>
          ))}
       </div>
    </div>
  );
};

export default CaseList;
