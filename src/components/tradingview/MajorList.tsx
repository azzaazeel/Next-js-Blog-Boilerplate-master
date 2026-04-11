import React from 'react';

type MajorMetadata = {
  name: string;
  dateRange: string;
  startDateStr: string;
  endDateStr: string;
  prize: string;
  location: string;
  teams: string;
  winner: string;
  runnerUp: string;
};

interface MajorListProps {
  majors: MajorMetadata[];
  selectedMajorNames: Set<string>;
  toggleMajor: (name: string) => void;
  addAll: () => void;
  clearAll: () => void;
  filename: string;
}

const MajorList: React.FC<MajorListProps> = ({
  majors,
  selectedMajorNames,
  toggleMajor,
  addAll,
  clearAll,
  filename
}) => {
  return (
    <div className={`bg-[#1a1d26]/30 p-6 rounded-2xl border border-gray-800 shadow-inner ${!filename ? 'opacity-20 pointer-events-none' : ''}`}>
       <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-0 flex items-center gap-2">
             CS2 Majors <span className="text-rose-400/50">— Tournament Periods</span>
          </h4>
          <div className="flex items-center gap-3">
            {majors.length > 0 && (
              <button onClick={addAll} className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold px-3 py-1 rounded-lg transition-all uppercase tracking-wider">Add all</button>
            )}
            {selectedMajorNames.size > 0 && (
              <button onClick={clearAll} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold px-3 py-1 rounded-lg transition-all uppercase tracking-wider">Clear</button>
            )}
          </div>
       </div>
       
       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[160px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-800">
          {majors.map(m => (
            <div 
              key={m.name}
              onClick={() => toggleMajor(m.name)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-[80px] ${
                selectedMajorNames.has(m.name) ? 'bg-rose-500/20 border-rose-500/50 ring-1 ring-rose-500/20' : 'bg-[#0f1117] border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-mono text-gray-500">{m.dateRange.split(' ')[0]} {m.dateRange.split(' ').pop()}</span>
                {selectedMajorNames.has(m.name) && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></span>}
              </div>
              <p className={`text-[10px] font-bold leading-tight ${selectedMajorNames.has(m.name) ? 'text-rose-200' : 'text-gray-400'}`}>
                {m.name}
              </p>
              <div className="mt-1 flex justify-between items-center">
                <span className="text-[7px] text-gray-600 truncate max-w-[50%]">{m.location}</span>
                <span className="text-[7px] font-bold text-gray-500 group-hover:text-gray-400">{m.winner}</span>
              </div>
            </div>
          ))}
       </div>
    </div>
  );
};

export default MajorList;
