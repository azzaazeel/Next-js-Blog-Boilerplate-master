import React from 'react';

type ToolbarProps = {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  setSelectedItem: (item: string) => void;
  setSelectedCompareItems: (items: Set<string>) => void;
  dropdownCategoryOpen: boolean;
  setDropdownCategoryOpen: (open: boolean) => void;
  dropdownCategoryRef: React.RefObject<HTMLDivElement | null>;
  customStartDate: string;
  setCustomStartDate: (date: string) => void;
  compareMode: boolean;
  setCompareMode: (mode: boolean) => void;
  selectedCompareItems: Set<string>;
  setSelectedCompareItemsLegacy: (items: Set<string>) => void;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  items: any[];
  watchlist: string[];
  toggleWatchlist: (e: React.MouseEvent, name: string) => void;
  selectedItem: string;
  handleItemSelect: (name: string) => void;
  resolution: string;
  setResolution: (res: string) => void;
  currentItem: any;
  range: string;
  setRange: (range: string) => void;
  selectedYear: string[];
};

const TradingViewToolbar: React.FC<any> = ({ 
  categories, selectedCategory, setSelectedCategory,
  setSelectedItem, setSelectedCompareItems,
  dropdownCategoryOpen, setDropdownCategoryOpen, dropdownCategoryRef,
  customStartDate, setCustomStartDate,
  compareMode, setCompareMode,
  selectedCompareItems,
  dropdownOpen, setDropdownOpen, dropdownRef,
  searchQuery, setSearchQuery,
  items, watchlist, toggleWatchlist,
  selectedItem, handleItemSelect,
  resolution, setResolution, currentItem,
  range, setRange, selectedYear,
  className
}) => {
  const benchmarkItems = items.filter(i => i.isBenchmark);
  const filteredItems = items.filter(i => 
    !i.isBenchmark && 
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex flex-wrap items-end gap-6 ${className || ''}`}>
      {/* 1. Category */}
      <div className="relative w-full md:w-56" ref={dropdownCategoryRef}>
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Category</label>
        <div 
          className="group relative flex items-center bg-[#1a1d26] border border-gray-800 rounded-xl px-4 py-2.5 cursor-pointer hover:border-blue-500/50 transition-all shadow-lg"
          onClick={() => setDropdownCategoryOpen(!dropdownCategoryOpen)}
        >
          <span className="block truncate text-sm font-medium text-gray-200 flex-1">{selectedCategory.replace(/-/g, ' ') || 'Select Category...'}</span>
          <svg className={`w-4 h-4 text-gray-500 transition-transform ${dropdownCategoryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {dropdownCategoryOpen && (
          <div className="absolute z-[60] w-full mt-2 bg-[#1a1d26] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-64 overflow-y-auto scrollbar-thin">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className={`px-4 py-3 text-sm cursor-pointer border-b border-gray-800/30 last:border-0 hover:bg-gray-800 flex items-center ${selectedCategory === cat ? 'text-blue-400 font-semibold bg-blue-500/10' : 'text-gray-400'}`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedItem('');
                    setSelectedCompareItems(new Set());
                    setDropdownCategoryOpen(false);
                  }}
                >
                  {cat.replace(/-/g, ' ')}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 1.5 Start Date */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Start Date</label>
        <div className="flex bg-[#1a1d26] p-1 rounded-xl border border-gray-800">
            <input 
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-300 outline-none px-2 py-1.5 focus:text-blue-400 transition-colors [color-scheme:dark]"
            />
            {customStartDate && (
              <button 
                onClick={() => setCustomStartDate('')}
                className="p-1.5 text-gray-600 hover:text-rose-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
        </div>
      </div>

      {/* 2. Data Source */}
      <div className="relative w-full md:w-64" ref={dropdownRef}>
        <div className="flex justify-between items-center mb-2 ml-1">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{compareMode ? `Symbols (${selectedCompareItems.size})` : 'Data Source'}</label>
          {compareMode && selectedCompareItems.size > 0 && (
            <button 
              onClick={() => setSelectedCompareItems(new Set())}
              className="text-[8px] font-bold text-rose-500 hover:text-rose-400 uppercase tracking-tighter"
            >
              Clear
            </button>
          )}
        </div>
        <div 
          className={`group flex items-center bg-[#1a1d26] border rounded-xl px-4 py-2.5 cursor-pointer transition-all shadow-lg ${dropdownOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-800 hover:border-gray-700'}`}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="flex-1 truncate text-sm font-medium text-gray-200">
            {compareMode 
              ? (selectedCompareItems.size === 0 ? 'Select multiple' : `${selectedCompareItems.size} items selected`)
              : (selectedItem ? selectedItem.replace(/_/g, ' ') : 'Select data source')}
          </div>
          <svg className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {dropdownOpen && (
          <>
            <div className="absolute z-50 w-full mt-2 bg-[#1a1d26] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
               <div className="p-3 border-b border-gray-800 bg-[#14171f]">
                <input
                  type="text"
                  className="w-full bg-[#0f1117] border border-gray-800 rounded-lg pl-3 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none"
                  placeholder="Search source..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="max-h-64 overflow-y-auto scrollbar-thin">
                {benchmarkItems.length > 0 && (
                  <div className="border-b border-gray-800 bg-[#14171f]/50">
                    <div className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Benchmarks</div>
                    {benchmarkItems.map((item) => (
                      <div
                        key={item.name}
                        className={`px-4 py-3 text-sm cursor-pointer border-b border-gray-800/30 last:border-0 hover:bg-gray-800 flex justify-between items-center group/item ${selectedItem === item.name ? 'text-orange-400 font-semibold bg-orange-500/10' : 'text-gray-400'}`}
                        onClick={() => { setSelectedItem(item.name); setDropdownOpen(false); }}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <button 
                            onClick={(e) => toggleWatchlist(e, item.name)}
                            className={`hover:scale-125 transition-transform ${watchlist.includes(item.name) ? 'text-yellow-500' : 'text-gray-600 hover:text-gray-400'}`}
                          >
                            <svg className="w-4 h-4" fill={watchlist.includes(item.name) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </button>
                          <span className="truncate">{item.name}</span>
                        </div>
                        <span className="text-[10px] text-gray-600 font-mono ml-4">Benchmark</span>
                      </div>
                    ))}
                  </div>
                )}

                {filteredItems.slice(0, 50).map((item) => (
                  <div
                    key={item.name}
                    className={`px-4 py-3 text-sm cursor-pointer border-b border-gray-800/30 last:border-0 hover:bg-gray-800 flex justify-between items-center group/item ${
                      compareMode 
                        ? (selectedCompareItems.has(item.name) ? 'text-blue-400 font-semibold bg-blue-500/10' : 'text-gray-400')
                        : (selectedItem === item.name ? 'text-blue-400 font-semibold bg-blue-500/10' : 'text-gray-400')
                    }`}
                    onClick={() => handleItemSelect(item.name)}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <button 
                        onClick={(e) => toggleWatchlist(e, item.name)}
                        className={`hover:scale-125 transition-transform ${watchlist.includes(item.name) ? 'text-yellow-500' : 'text-gray-600 hover:text-gray-400'}`}
                      >
                        {watchlist.includes(item.name) ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        )}
                      </button>
                      <span className="truncate">{item.name}</span>
                    </div>
                    <span className="text-[10px] text-gray-600 font-mono ml-4">{(item as any).recordCount?.toLocaleString()} rows</span>
                  </div>
                ))}
                {filteredItems.length > 50 && (
                  <div className="px-4 py-2 text-[10px] text-gray-600 italic text-center bg-gray-900/20 border-t border-gray-800/30">
                    Showing first 50 matches...
                  </div>
                )}
                {filteredItems.length === 0 && (
                  <div className="px-4 py-6 text-gray-600 text-center text-xs">No items found</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. Mode */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mode</label>
        <div className="flex bg-[#1a1d26] p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => setCompareMode(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                !compareMode ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Single
            </button>
            <button
              onClick={() => setCompareMode(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                compareMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Compare
            </button>
        </div>
      </div>

      {/* 4. Resolution */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Resolution</label>
        <div className="flex bg-[#1a1d26] p-1 rounded-xl border border-gray-800">
          {['1D', '1W', '1M'].map((res) => {
            const available = compareMode ? true : currentItem?.resolutions.includes(res);
            return (
              <button
                key={res}
                disabled={!available}
                onClick={() => setResolution(res)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  resolution === res ? 'bg-blue-600 text-white shadow-lg' : available ? 'text-gray-400 hover:text-gray-200' : 'text-gray-700'
                }`}
              >
                {res === '1D' ? 'D' : res === '1W' ? 'W' : 'M'}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Time Range */}
      <div className={`flex flex-col gap-2 ${selectedYear.length > 0 ? 'opacity-30 pointer-events-none' : ''}`}>
        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Time Range</label>
        <div className="flex bg-[#1a1d26] p-1 rounded-xl border border-gray-800">
          {['1M', '3M', '6M', '1Y', '3Y', 'All'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                range === r ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradingViewToolbar;
