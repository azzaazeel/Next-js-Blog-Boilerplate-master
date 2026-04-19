import React, { useState, useMemo, useRef } from 'react';
import { toJpeg } from 'html-to-image';

type InsightsItem = {
  name: string;
  currentPrice: number;
  change1M: number;
  change3M: number;
  change6M: number;
  change1Y: number;
  changeAll: number;
  recordCount: number;
  trend1Y?: number[];
};

type InsightsTableProps = {
  items: InsightsItem[];
  loading: boolean;
  category: string;
  visibleColumns: {
    price: boolean;
    change1M: boolean;
    change3M: boolean;
    change6M: boolean;
    change1Y: boolean;
    changeAll: boolean;
    records: boolean;
    trend: boolean;
  };
};

type SortConfig = {
  key: keyof InsightsItem;
  direction: 'asc' | 'desc';
};

const ITEMS_PER_PAGE = 20;

const Sparkline = ({ data }: { data: number[] }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((val - min) / range) * height
  }));

  const pathData = points.reduce((acc, p, i) => 
    acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`), ''
  );

  const isPositive = data[data.length - 1] >= data[0];
  const color = isPositive ? '#10b981' : '#f43f5e';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_3px_rgba(0,0,0,0.5)]"
      />
    </svg>
  );
};

const InsightsTable: React.FC<InsightsTableProps> = ({ items, loading, category, visibleColumns }) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'recordCount', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // Reset page when data changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [items, category]);

  const handleDownloadImage = async () => {
    if (!tableRef.current) return;
    
    setIsExporting(true);
    
    // Give time for UI to hide the button
    setTimeout(async () => {
      try {
        // Create a style element to hide scrollbars during capture
        const style = document.createElement('style');
        style.id = 'hide-scrollbars-style';
        style.innerHTML = `
          .exporting-image * {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          .exporting-image *::-webkit-scrollbar {
            display: none !important;
          }
          .exporting-image .overflow-x-auto {
            overflow: visible !important;
            width: auto !important;
          }
        `;
        document.head.appendChild(style);
        
        // Add class to root element
        tableRef.current?.classList.add('exporting-image');

        const dataUrl = await toJpeg(tableRef.current!, { 
          quality: 0.95,
          backgroundColor: '#1a1d26',
          filter: (node) => {
            if (node instanceof HTMLElement && node.id === 'download-button') return false;
            return true;
          }
        });
        
        // Cleanup
        tableRef.current?.classList.remove('exporting-image');
        document.getElementById('hide-scrollbars-style')?.remove();

        const link = document.createElement('a');
        link.download = `Insights_${category}_Page${currentPage}.jpg`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to export image', err);
      } finally {
        setIsExporting(false);
      }
    }, 150);
  };

  const sortedItems = useMemo(() => {
    const sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedItems.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedItems, currentPage]);

  const requestSort = (key: keyof InsightsItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatPercent = (val: number) => {
    const isPositive = val >= 0;
    return (
      <span className={`font-bold font-mono ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isPositive ? '+' : ''}{val.toFixed(0)}%
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const SortIcon = ({ column }: { column: keyof InsightsItem }) => {
    if (sortConfig.key !== column) return <svg className="w-3 h-3 ml-1 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>;
    return sortConfig.direction === 'asc' 
      ? <svg className="w-3 h-3 ml-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>
      : <svg className="w-3 h-3 ml-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>;
  };

  const visibleCount = 1 + Object.values(visibleColumns).filter(Boolean).length;

  return (
    <div ref={tableRef} className="bg-[#1a1d26] border border-gray-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative group min-h-[400px]">
      <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: 'linear-gradient(to bottom right, rgba(59, 130, 246, 0.05), transparent)' }}></div>
      <div className="flex items-center gap-4 mb-8 relative z-10">
        <div className="w-1.5 h-10 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        <div>
          <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Performance Matrix</h3>
          <h2 className="text-2xl font-black text-white tracking-tight">{category.replace(/-/g, ' ')} Overview</h2>
        </div>
        {loading && (
          <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <div className="w-3 h-3 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Updating...</span>
          </div>
        )}
        {!loading && items.length > 0 && (
          <button
            id="download-button"
            onClick={handleDownloadImage}
            disabled={isExporting}
            className={`ml-auto group flex items-center gap-2 px-4 py-2 border rounded-xl transition-all cursor-pointer ${
              isExporting 
                ? 'bg-gray-800 border-gray-700 opacity-50' 
                : 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'
            }`}
          >
            <svg className={`w-4 h-4 text-emerald-400 ${isExporting ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isExporting ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              )}
            </svg>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              {isExporting ? 'Exporting...' : 'Download JPG'}
            </span>
          </button>
        )}
      </div>

      <div className="overflow-x-auto relative z-10">
        <table className={`w-full text-left border-collapse transition-opacity duration-300 ${loading && items.length === 0 ? 'opacity-50' : 'opacity-100'}`}>
          <thead>
            <tr className="border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <th className="px-4 py-4 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('name')}>
                <div className="flex items-center">Item Name <SortIcon column="name" /></div>
              </th>
              {visibleColumns.price && (
                <th className="px-4 py-4 text-right cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('currentPrice')}>
                  <div className="flex items-center justify-end">Price <SortIcon column="currentPrice" /></div>
                </th>
              )}
              {visibleColumns.change1M && (
                <th className="px-4 py-4 text-center cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('change1M')}>
                  <div className="flex items-center justify-center">1 Month <SortIcon column="change1M" /></div>
                </th>
              )}
              {visibleColumns.change3M && (
                <th className="px-4 py-4 text-center cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('change3M')}>
                  <div className="flex items-center justify-center">3 Months <SortIcon column="change3M" /></div>
                </th>
              )}
              {visibleColumns.change6M && (
                <th className="px-4 py-4 text-center cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('change6M')}>
                  <div className="flex items-center justify-center">6 Months <SortIcon column="change6M" /></div>
                </th>
              )}
              {visibleColumns.change1Y && (
                <th className="px-4 py-4 text-center cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('change1Y')}>
                  <div className="flex items-center justify-center">1 Year <SortIcon column="change1Y" /></div>
                </th>
              )}
              {visibleColumns.changeAll && (
                <th className="px-4 py-4 text-center cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('changeAll')}>
                  <div className="flex items-center justify-center">All Time <SortIcon column="changeAll" /></div>
                </th>
              )}
              {visibleColumns.trend && (
                <th className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center">1Y Trend</div>
                </th>
              )}
              {visibleColumns.records && (
                <th className="px-4 py-4 text-center cursor-pointer hover:text-white transition-colors bg-blue-500/5" onClick={() => requestSort('recordCount')}>
                  <div className="flex items-center justify-center">Records <SortIcon column="recordCount" /></div>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading && items.length === 0 ? (
              [...Array(10)].map((_, i) => (
                <tr key={i} className="border-b border-gray-800/50">
                  <td className="px-4 py-6"><div className="h-4 bg-gray-800 rounded-md w-3/4 animate-pulse"></div></td>
                  {visibleColumns.price && <td className="px-4 py-6"><div className="h-4 bg-gray-800 rounded-md w-1/2 ml-auto animate-pulse"></div></td>}
                  {visibleColumns.change1M && <td className="px-4 py-6"><div className="h-4 bg-gray-800 rounded-md w-1/2 mx-auto animate-pulse"></div></td>}
                  {visibleColumns.change3M && <td className="px-4 py-6"><div className="h-4 bg-gray-800 rounded-md w-1/2 mx-auto animate-pulse"></div></td>}
                  {visibleColumns.change6M && <td className="px-4 py-6"><div className="h-4 bg-gray-800 rounded-md w-1/2 mx-auto animate-pulse"></div></td>}
                  {visibleColumns.change1Y && <td className="px-4 py-6"><div className="h-4 bg-gray-800 rounded-md w-1/2 mx-auto animate-pulse"></div></td>}
                  {visibleColumns.changeAll && <td className="px-4 py-6"><div className="h-4 bg-gray-800 rounded-md w-1/2 mx-auto animate-pulse"></div></td>}
                  {visibleColumns.trend && <td className="px-4 py-6"><div className="h-4 bg-gray-800 rounded-md w-1/2 mx-auto animate-pulse"></div></td>}
                  {visibleColumns.records && <td className="px-4 py-6 bg-blue-500/5"><div className="h-4 bg-gray-800 rounded-md w-1/2 mx-auto animate-pulse"></div></td>}
                </tr>
              ))
            ) : (
              paginatedItems.map((item) => (
                <tr key={item.name} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors group">
                  <td className="px-4 py-4 font-bold text-gray-300">
                    <div className="flex items-center gap-3">
                      <span className="truncate max-w-[200px]">{item.name.replace(/_/g, ' ')}</span>
                    </div>
                  </td>
                  {visibleColumns.price && (
                    <td className="px-4 py-4 text-right font-mono text-gray-200">
                      {formatPrice(item.currentPrice)}
                    </td>
                  )}
                  {visibleColumns.change1M && <td className="px-4 py-4 text-center">{formatPercent(item.change1M)}</td>}
                  {visibleColumns.change3M && <td className="px-4 py-4 text-center">{formatPercent(item.change3M)}</td>}
                  {visibleColumns.change6M && <td className="px-4 py-4 text-center">{formatPercent(item.change6M)}</td>}
                  {visibleColumns.change1Y && <td className="px-4 py-4 text-center">{formatPercent(item.change1Y)}</td>}
                  {visibleColumns.changeAll && <td className="px-4 py-4 text-center">{formatPercent(item.changeAll)}</td>}
                  {visibleColumns.trend && (
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center">
                        <Sparkline data={item.trend1Y || []} />
                      </div>
                    </td>
                  )}
                  {visibleColumns.records && (
                    <td className="px-4 py-4 text-center font-mono text-gray-500 bg-blue-500/5">
                      {item.recordCount.toLocaleString()}
                    </td>
                  )}
                </tr>
              ))
            )}
            {!loading && sortedItems.length === 0 && (
              <tr>
                <td colSpan={visibleCount} className="px-4 py-12 text-center text-gray-600 italic">
                  No data available for this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between relative z-10 px-4">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Page {currentPage} of {totalPages} <span className="mx-2 text-gray-800">|</span> {sortedItems.length} Total Items
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-xl border transition-all ${
                currentPage === 1 
                  ? 'bg-gray-800/20 border-gray-800 text-gray-700 cursor-not-allowed' 
                  : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border ${
                        currentPage === pageNum
                          ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                          : 'bg-gray-800/50 border-gray-700 text-gray-500 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <span key={pageNum} className="w-4 flex items-center justify-center text-gray-700">...</span>;
                }
                return null;
              })}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-xl border transition-all ${
                currentPage === totalPages 
                  ? 'bg-gray-800/20 border-gray-800 text-gray-700 cursor-not-allowed' 
                  : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white cursor-pointer'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsTable;
