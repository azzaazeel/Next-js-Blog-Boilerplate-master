import React, { ReactElement } from 'react';
import { Meta } from '../layout/Meta';
import { Main } from '../templates/Main';
import { useTradingViewData } from '../hooks/useTradingViewData';
import { useBlogCharts } from '../utils/useBlogCharts';

import StatsPanel from '../components/tradingview/StatsPanel';
import YearSelector from '../components/tradingview/YearSelector';
import EventList from '../components/tradingview/EventList';
import MajorList from '../components/tradingview/MajorList';
import CaseList from '../components/tradingview/CaseList';
import TradingViewToolbar from '../components/tradingview/TradingViewToolbar';
import PerformanceTable from '../components/tradingview/PerformanceTable';

const TradingViewAdminPage = () => {
  const {
    items, setItems, selectedItem, setSelectedItem, resolution, setResolution, range, setRange,
    selectedYear, setSelectedYear, availableYears, allPatches, selectedEventIds, setSelectedEventIds,
    allMajors, selectedMajorNames, setSelectedMajorNames, allCases, selectedCaseNames, setSelectedCaseNames,
    allAgents, showDiscontinued, setShowDiscontinued, dropdownOpen, setDropdownOpen, searchQuery, setSearchQuery,
    watchlist, hideGenericUpdates, setHideGenericUpdates, hideReleaseNotes, setHideReleaseNotes,
    showSMA50, setShowSMA50, showSMA200, setShowSMA200, showVolSMA50, setShowVolSMA50,
    showRSI, setShowRSI, compareBTC, setCompareBTC, compareMode, setCompareMode,
    selectedCompareItems, setSelectedCompareItems, categories, setCategories,
    selectedCategory, setSelectedCategory, customStartDate, setCustomStartDate,
    dropdownCategoryOpen, setDropdownCategoryOpen, performanceData, stats,
    dropdownRef, dropdownCategoryRef, filename, yearPatches, markersString, rangesString, selectedCaseImages,
    toggleWatchlist, toggleCompareItem, handleYearToggle, session, isPending
  } = useTradingViewData();

  // Initialize charts (Effect is inside the hook but we need to call the trigger hook here or keep it in the hook)
  // Actually, useBlogCharts is usually an effect hook.
  useBlogCharts([filename, selectedCategory, customStartDate, resolution, range, selectedYear.join(','), markersString, rangesString, showSMA50, showSMA200, showVolSMA50, showRSI, compareBTC, stats?.priceChange, stats?.volumeChange, selectedCaseImages]);

  const handleItemSelect = (itemName: string) => {
    if (compareMode) {
      toggleCompareItem(itemName);
    } else {
      setSelectedItem(itemName);
      setDropdownOpen(false);
      const item = items.find(i => i.name === itemName);
      if (item && !item.resolutions.includes(resolution)) {
        setResolution(item.resolutions[0] || '1D');
      }
    }
  };

  const handlePrevItem = () => {
    if (watchlist.length > 0) {
      const currentIndex = watchlist.indexOf(selectedItem);
      const prevIndex = (currentIndex - 1 + watchlist.length) % watchlist.length;
      setSelectedItem(watchlist[prevIndex]);
    }
  };

  const handleNextItem = () => {
    if (watchlist.length > 0) {
      const currentIndex = watchlist.indexOf(selectedItem);
      const nextIndex = (currentIndex + 1) % watchlist.length;
      setSelectedItem(watchlist[nextIndex]);
    }
  };

  if (isPending || !session) return null;

  const currentItem = items.find(i => i.name === selectedItem);
  const selectedYearString = selectedYear.join(',');
  const dynamicTitle = compareMode 
    ? `Comparison (${Array.from(selectedCompareItems).join(', ')}) ${resolution}` 
    : `${selectedItem ? selectedItem.replace(/_/g, ' ') : 'Market Chart'} ${resolution} (${selectedYear.length > 0 ? selectedYear.join(',') : range})`;

  return (
    <div className="flex flex-col gap-8">
        {/* ROW 1: HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-5xl font-extrabold text-[#f7b731] mb-2">TradingView Visualizer</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">Analyze and backtest market movements with integrated game updates.</p>
          </div>
        </div>

        {/* ROW 2: MAIN CONTROLS */}
        <div className="flex flex-col gap-6 bg-[#1a1d26]/50 p-6 rounded-2xl border border-gray-800 shadow-xl">
          <TradingViewToolbar 
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setSelectedItem={setSelectedItem}
            setSelectedCompareItems={setSelectedCompareItems}
            dropdownCategoryOpen={dropdownCategoryOpen}
            setDropdownCategoryOpen={setDropdownCategoryOpen}
            dropdownCategoryRef={dropdownCategoryRef}
            customStartDate={customStartDate}
            setCustomStartDate={setCustomStartDate}
            compareMode={compareMode}
            setCompareMode={setCompareMode}
            selectedCompareItems={selectedCompareItems}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
            dropdownRef={dropdownRef}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            items={items}
            watchlist={watchlist}
            toggleWatchlist={toggleWatchlist}
            selectedItem={selectedItem}
            handleItemSelect={handleItemSelect}
            resolution={resolution}
            setResolution={setResolution}
            currentItem={currentItem}
            range={range}
            setRange={setRange}
            selectedYear={selectedYear}
          />
          
          <div className="flex items-center gap-4 border-t border-gray-800/50 pt-4">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Technical Indicators</span>
            <div className="flex bg-[#0f1117] p-1.5 rounded-full border border-gray-800 shadow-inner">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-3 py-1 rounded transition-colors group">
                <input type="checkbox" checked={showSMA50} onChange={e => setShowSMA50(e.target.checked)} className="w-3 h-3 rounded border-gray-700 bg-gray-900 text-rose-500 focus:ring-rose-500" />
                <span className={`text-[10px] font-bold uppercase ${showSMA50 ? 'text-rose-500' : 'text-gray-500 group-hover:text-gray-400'}`}>MA 50</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-3 py-1 rounded transition-colors group border-l border-gray-800">
                <input type="checkbox" checked={showSMA200} onChange={e => setShowSMA200(e.target.checked)} className="w-3 h-3 rounded border-gray-700 bg-gray-900 text-blue-500 focus:ring-blue-500" />
                <span className={`text-[10px] font-bold uppercase ${showSMA200 ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-400'}`}>MA 200</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-3 py-1 rounded transition-colors group border-l border-gray-800">
                <input type="checkbox" checked={showVolSMA50} onChange={e => setShowVolSMA50(e.target.checked)} className="w-3 h-3 rounded border-gray-700 bg-gray-900 text-orange-600 focus:ring-orange-500" />
                <span className={`text-[10px] font-bold uppercase ${showVolSMA50 ? 'text-orange-400' : 'text-gray-500 group-hover:text-gray-400'}`}>Vol MA 50</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-white/5 px-3 py-1 rounded transition-colors group border-l border-gray-800">
                <input type="checkbox" checked={showRSI} onChange={e => setShowRSI(e.target.checked)} className="w-3 h-3 rounded border-gray-700 bg-gray-900 text-purple-600 focus:ring-purple-500" />
                <span className={`text-[10px] font-bold uppercase ${showRSI ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-400'}`}>RSI</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-purple-500/5 px-3 py-1 rounded transition-colors group border-l border-gray-800">
                <input type="checkbox" checked={compareBTC} onChange={e => setCompareBTC(e.target.checked)} className="w-3 h-3 rounded border-gray-700 bg-gray-900 text-purple-500 focus:ring-purple-500" />
                <span className={`text-[10px] font-bold uppercase ${compareBTC ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-400'}`}>BTC Compare</span>
              </label>
            </div>
          </div>

          {watchlist.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-gray-800/50 pt-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Watchlist</span>
              <div className="flex flex-wrap gap-2">
                {watchlist.map(name => {
                  const item = items.find(i => i.name === name);
                  const abbreviation = name.replace(/Case/g, '').trim().split(' ').map(w => w[0]).join('').toUpperCase();
                  return (
                    <button
                      key={name}
                      onClick={() => handleItemSelect(name)}
                      title={name}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-bold ${
                        (compareMode ? selectedCompareItems.has(name) : selectedItem === name)
                          ? 'bg-blue-600/20 border-blue-500/50 text-blue-400' 
                          : 'bg-[#1a1d26] border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                      }`}
                    >
                      <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      <span className="truncate">{abbreviation}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ROW 3: FOCUS YEAR */}
        <YearSelector 
          availableYears={availableYears}
          selectedYear={selectedYear}
          onToggle={handleYearToggle}
        />

        {/* ROW 4: EVENTS LIST */}
        <EventList 
          yearPatches={yearPatches}
          selectedEventIds={selectedEventIds}
          toggleEvent={(id: string) => {
            const next = new Set(selectedEventIds);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            setSelectedEventIds(next);
          }}
          addAll={() => {
            const next = new Set(selectedEventIds);
            yearPatches.forEach(p => next.add(p.buildId));
            setSelectedEventIds(next);
          }}
          clearAll={() => setSelectedEventIds(new Set())}
          hideGeneric={hideGenericUpdates}
          setHideGeneric={setHideGenericUpdates}
          hideRelease={hideReleaseNotes}
          setHideRelease={setHideReleaseNotes}
          selectedYear={selectedYear}
          filename={filename}
        />

        {/* ROW 4.5: MAJORS LIST */}
        <MajorList 
          majors={allMajors}
          selectedMajorNames={selectedMajorNames}
          toggleMajor={(name: string) => {
            const next = new Set(selectedMajorNames);
            if (next.has(name)) next.delete(name);
            else next.add(name);
            setSelectedMajorNames(next);
          }}
          addAll={() => setSelectedMajorNames(new Set(allMajors.map(m => m.name)))}
          clearAll={() => setSelectedMajorNames(new Set())}
          filename={filename}
        />

        {/* ROW 4.6: CASES LIST */}
        <CaseList 
          cases={allCases}
          selectedCaseNames={selectedCaseNames}
          toggleCase={(name: string) => {
            const next = new Set(selectedCaseNames);
            if (next.has(name)) next.delete(name);
            else next.add(name);
            setSelectedCaseNames(next);
          }}
          addAll={() => setSelectedCaseNames(new Set(allCases.map(c => c.name)))}
          clearAll={() => setSelectedCaseNames(new Set())}
          filename={filename}
          showDiscontinued={showDiscontinued}
          setShowDiscontinued={setShowDiscontinued}
        />

        {/* ROW 5: CHART */}
        <div className="lg:col-span-3">
             <div className="bg-[#1a1d26] border border-gray-800 rounded-3xl p-6 shadow-2xl relative min-h-[600px] flex flex-col overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none opacity-50"></div>
               
                <div className="flex justify-between items-center mb-6 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-100 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {compareMode ? 'Market Comparison' : (selectedItem ? selectedItem.replace(/_/g, ' ') : 'Market Trend')}
                          <span className="text-sm font-normal text-gray-500">{resolution} ({selectedYear.length > 0 ? selectedYear.join(',') : range})</span>
                        </div>
                        
                        {!compareMode && watchlist.length > 1 && (
                          <div className="flex items-center gap-1 bg-[#0f1117] p-1 rounded-xl border border-gray-800 shadow-inner group-hover:border-blue-500/30 transition-colors">
                            <button 
                              onClick={handlePrevItem}
                              className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-blue-400 transition-colors"
                              title="Previous from Watchlist"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <div className="w-px h-4 bg-gray-800"></div>
                            <button 
                              onClick={handleNextItem}
                              className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-blue-400 transition-colors"
                              title="Next from Watchlist"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </h3>
                   </div>
                  </div>
                  
                  {!compareMode && <StatsPanel stats={stats} />}
                </div>

                {selectedEventIds.size > 0 && (
                   <div className="flex items-center gap-2">
                     <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                     <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{selectedEventIds.size} Active Markers</span>
                   </div>
                 )}

               <div className="chart-container relative w-full overflow-hidden rounded-2xl border border-gray-800/50 bg-[#0f1117]" style={{ height: '500px' }}>
                  {filename ? (
                    <canvas 
                      key={`${filename}-${range}-${selectedYear.join(',')}-${markersString}`}
                      id="admin-tradingview-chart"
                      className="blog-chart"
                      style={{ width: '100%', height: '100%', display: 'block' }}
                      data-url={compareBTC ? `${filename},Bitcoin (BTC)_1D.json` : filename}
                      data-category={selectedCategory}
                      data-start-date={customStartDate}
                      data-tradingview="true"
                      data-mode={compareMode ? 'percent' : 'price'}
                      data-range={range}
                      data-year={selectedYearString}
                      data-markers={markersString}
                      data-ranges={rangesString}
                      data-title={dynamicTitle}
                      data-sma50={showSMA50 ? 'true' : 'false'}
                      data-sma200={showSMA200 ? 'true' : 'false'}
                      data-volsma50={showVolSMA50 ? 'true' : 'false'}
                      data-rsi={showRSI ? 'true' : 'false'}
                      data-price-delta={stats?.priceChange?.toFixed(2)}
                      data-vol-delta={stats?.volumeChange?.toFixed(2)}
                      data-case-images={selectedCaseImages}
                    ></canvas>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-medium">Please select a data source above</div>
                  )}
               </div>
            </div>
            
            <PerformanceTable 
              performanceData={performanceData}
              selectedItem={selectedItem}
              selectedItemImage={selectedCaseImages}
              compareMode={compareMode}
            />
        </div>
    </div>
  );
};

TradingViewAdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Main meta={<Meta title="TradingView Admin - KANOCS" description="Market Data Visualizer" />}>
      {page}
    </Main>
  );
};

export default TradingViewAdminPage;
