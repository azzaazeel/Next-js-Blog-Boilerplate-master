import React from 'react';

interface YearSelectorProps {
  availableYears: string[];
  selectedYear: string[];
  onToggle: (year: string) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ availableYears, selectedYear, onToggle }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Focus Year</label>
      <div className="flex flex-wrap gap-2">
         <button
            onClick={() => onToggle('All')}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${selectedYear.length === 0 ? 'bg-blue-600 text-white shadow-lg' : 'bg-[#1a1d26] text-gray-400 border border-gray-800 hover:border-gray-700'}`}
         >
            Full History
         </button>
         {availableYears.map(y => (
           <button
            key={y}
            onClick={() => onToggle(y)}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${selectedYear.includes(y) ? 'bg-blue-600 text-white shadow-lg' : 'bg-[#1a1d26] text-gray-400 border border-gray-800 hover:border-gray-700'}`}
           >
            {y}
           </button>
         ))}
      </div>
    </div>
  );
};

export default YearSelector;
