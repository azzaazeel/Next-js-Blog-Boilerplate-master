import React, { useRef } from 'react';

type PerformanceTableProps = {
  performanceData: any[];
  selectedItem: string;
  selectedItemImage?: string;
  compareMode: boolean;
};

const PerformanceTable: React.FC<PerformanceTableProps> = ({ performanceData, selectedItem, selectedItemImage, compareMode }) => {
  const tableRef = useRef<HTMLDivElement>(null);
  
  if (compareMode || !selectedItem) return null;

  const downloadJPG = async () => {
    if (!tableRef.current) return;
    
    // Dynamically import html-to-image to avoid SSR issues
    const { toJpeg } = await import('html-to-image');
    
    // Find scrollable elements
    const scrollContainers = tableRef.current.querySelectorAll('.overflow-x-auto');
    const originalStyles = new Map();
    
    try {
      // Temporarily hide scrollbars and remove overflow restrictions
      scrollContainers.forEach((el, index) => {
        const htmlEl = el as HTMLElement;
        originalStyles.set(index, {
          overflowX: htmlEl.style.overflowX,
          overflowY: htmlEl.style.overflowY,
          webkitScrollbar: htmlEl.style.getPropertyValue('::-webkit-scrollbar')
        });
        htmlEl.style.overflowX = 'visible';
        htmlEl.style.overflowY = 'visible';
        htmlEl.style.setProperty('scrollbar-width', 'none');
      });

      // Capture the element
      const dataUrl = await toJpeg(tableRef.current, {
        quality: 0.95,
        backgroundColor: '#1a1d26',
        pixelRatio: 3, // Even higher quality for crisp text
        style: {
          borderRadius: '0',
          overflow: 'visible', 
          width: 'auto',
          height: 'auto',
          margin: '0',
          padding: '2rem' // Add some padding to avoid clipping
        }
      });
      
      const link = document.createElement('a');
      link.download = `${selectedItem}_performance.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to capture table:', err);
    } finally {
      // Revert styles
      scrollContainers.forEach((el, index) => {
        const htmlEl = el as HTMLElement;
        const style = originalStyles.get(index);
        if (style) {
          htmlEl.style.overflowX = style.overflowX;
          htmlEl.style.overflowY = style.overflowY;
          htmlEl.style.setProperty('scrollbar-width', 'auto');
        }
      });
    }
  };

  const downloadCSV = () => {
    const headers = ['Year', 'Start Date', 'End Date', 'Start Price', 'End Price', 'Return (%)'];
    const rows = performanceData.map(row => [
      row.year,
      row.startDate,
      row.endDate,
      row.startPrice,
      row.endPrice,
      row.return.toFixed(2)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedItem}_performance.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      ref={tableRef}
      id="performance-table-container"
      className="bg-[#1a1d26] border border-gray-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative group my-2"
    >
      <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: 'linear-gradient(to bottom right, rgba(16, 185, 129, 0.05), transparent)' }}></div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: '#10b981', boxShadow: '0 0 15px rgba(16,185,129,0.5)' }}></div>
          <div>
            <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Historical Analytics</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-white tracking-tight">Yearly Performance</h2>
                <div className="px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>ROI Table</div>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <div className="flex bg-gray-800/50 rounded-md border border-gray-700 p-0.5">
                  <button 
                    onClick={downloadJPG}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-md text-white text-[10px] font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-900/20"
                    style={{ backgroundColor: '#059669' }}
                    title="Download as JPG"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    JPG Image
                  </button>
                  <button 
                    onClick={downloadCSV}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-md text-gray-400 hover:text-white transition-colors"
                    title="Download as CSV"
                  >
                    <span className="text-[10px] font-bold uppercase">CSV Data</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#0f1117]/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-gray-800 shadow-xl self-start hover:border-emerald-500/30 transition-all duration-500">
          {selectedItemImage && (
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-md group-hover:blur-lg transition-all" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}></div>
              <img 
                src={selectedItemImage} 
                alt={selectedItem} 
                className="w-14 h-14 object-contain relative z-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transform group-hover:scale-110 transition-transform duration-500" 
              />
            </div>
          )}
          <div>
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Focus Asset</div>
            <div className="text-xl font-bold text-[#f7b731] tracking-tight">{selectedItem.replace(/_/g, ' ')}</div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto relative z-10">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center items-center pointer-events-none -rotate-12 select-none">
        <span className="text-[40px] font-black tracking-[0.2em]" style={{ color: 'rgba(156, 163, 175, 0.05)' }}>KANOCS</span>
      </div>
      <table className="w-full text-left border-collapse relative z-20">
        <thead>
          <tr className="border-b border-gray-800 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <th className="px-4 py-4">Year</th>
            <th className="px-4 py-4">Start Date</th>
            <th className="px-4 py-4">End Date</th>
            <th className="px-4 py-4 text-right">Start Price</th>
            <th className="px-4 py-4 text-right">End Price</th>
            <th className="px-4 py-4 text-center">Return (%)</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {performanceData.map((row: any) => {
            const isPositive = row.return >= 0;
            return (
              <tr key={row.year} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors group">
                <td className="px-4 py-4 font-bold text-gray-300">{row.year}</td>
                <td className="px-4 py-4 text-gray-500 text-xs">{row.startDate}</td>
                <td className="px-4 py-4 text-gray-500 text-xs">{row.endDate}</td>
                <td className="px-4 py-4 text-right font-mono text-gray-400 group-hover:text-gray-200">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.startPrice)}
                </td>
                <td className="px-4 py-4 text-right font-mono text-gray-400 group-hover:text-gray-200">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.endPrice)}
                </td>
                <td 
                  className="px-4 py-4 text-center font-bold font-mono text-xl"
                  style={{ color: isPositive ? '#10b981' : '#f43f5e' }}
                >
                  {isPositive ? '+' : ''}{row.return.toFixed(0)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default PerformanceTable;
