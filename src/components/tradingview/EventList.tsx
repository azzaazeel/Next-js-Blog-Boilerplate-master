import React from 'react';

type PatchMetadata = {
  buildId: string;
  title: string;
  date: string;
  filename: string;
};

interface EventListProps {
  yearPatches: PatchMetadata[];
  selectedEventIds: Set<string>;
  toggleEvent: (id: string) => void;
  addAll: () => void;
  clearAll: () => void;
  hideGeneric: boolean;
  setHideGeneric: (val: boolean) => void;
  hideRelease: boolean;
  setHideRelease: (val: boolean) => void;
  selectedYear: string[];
  filename: string;
}

const EventList: React.FC<EventListProps> = ({
  yearPatches,
  selectedEventIds,
  toggleEvent,
  addAll,
  clearAll,
  hideGeneric,
  setHideGeneric,
  hideRelease,
  setHideRelease,
  selectedYear,
  filename
}) => {
  return (
    <div className={`bg-[#1a1d26]/30 p-6 rounded-2xl border border-gray-800 shadow-inner ${!filename ? 'opacity-20 pointer-events-none' : ''}`}>
       <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-0 flex items-center gap-2">
             Game Updates <span className="text-blue-400/50">— {selectedYear.length > 0 ? selectedYear.join(',') : 'Full History'}</span>
          </h4>
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={hideGeneric} 
                onChange={(e) => setHideGeneric(e.target.checked)}
                className="w-3 h-3 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-0" 
              />
              <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-400 uppercase tracking-widest transition-colors">Hide "CS2 Update"</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={hideRelease} 
                onChange={(e) => setHideRelease(e.target.checked)}
                className="w-3 h-3 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-0" 
              />
              <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-400 uppercase tracking-widest transition-colors">Hide "Release Notes"</span>
            </label>

            <div className="flex items-center gap-3 border-l border-gray-800 pl-4">
              {yearPatches.length > 0 && (
                <button onClick={addAll} className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-lg transition-all uppercase tracking-wider">Add all</button>
              )}
              {selectedEventIds.size > 0 && (
                <button onClick={clearAll} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] font-bold px-3 py-1 rounded-lg transition-all uppercase tracking-wider">Clear</button>
              )}
            </div>
          </div>
       </div>
       
       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[160px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-800">
          {yearPatches.map(p => (
            <div 
              key={p.buildId}
              onClick={() => toggleEvent(p.buildId)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-[70px] ${
                selectedEventIds.has(p.buildId) ? 'bg-blue-500/20 border-blue-500/50 ring-1 ring-blue-500/20' : 'bg-[#0f1117] border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-mono text-gray-500">{p.date.split(' ').slice(0, 2).join(' ')}</span>
                {selectedEventIds.has(p.buildId) && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>}
              </div>
              <p className={`text-[11px] font-bold truncate ${selectedEventIds.has(p.buildId) ? 'text-blue-200' : 'text-gray-400'}`}>
                {p.title}
              </p>
            </div>
          ))}
       </div>
    </div>
  );
};

export default EventList;
