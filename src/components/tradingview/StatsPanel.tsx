import React from 'react';

type Stats = {
  startPrice: number;
  endPrice: number;
  high: number;
  low: number;
  priceChange: number;
  volumeChange: number;
  avgVolume: number;
};

interface StatsPanelProps {
  stats: Stats | null;
}

const formatPrice = (val: number) => {
  if (val >= 1000000) return '$' + (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return '$' + (val / 1000).toFixed(0) + 'k';
  return '$' + val.toLocaleString();
};

const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <>
      <div className="hidden xl:flex items-center gap-4 bg-gray-900/50 px-4 py-2 rounded-2xl border border-gray-800 animate-in fade-in slide-in-from-right-2 duration-300">
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 uppercase font-bold">Price Δ</span>
          <span className={`text-xs font-bold ${stats.priceChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {stats.priceChange >= 0 ? '▲' : '▼'} {Math.abs(stats.priceChange).toFixed(2)}%
          </span>
        </div>
        <div className="w-px h-6 bg-gray-800"></div>
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 uppercase font-bold">High/Low</span>
          <span className="text-xs font-medium text-gray-300">
            <span className="text-emerald-400 opacity-80">{formatPrice(stats.high)}</span> / <span className="text-rose-400 opacity-80">{formatPrice(stats.low)}</span>
          </span>
        </div>
        <div className="w-px h-6 bg-gray-800"></div>
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 uppercase font-bold">Vol Δ</span>
          <span className={`text-xs font-bold ${stats.volumeChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {stats.volumeChange >= 0 ? '▲' : '▼'} {Math.abs(stats.volumeChange).toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6 bg-gray-900/20 p-4 rounded-2xl border border-gray-800/30 xl:hidden">
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 uppercase font-extrabold mb-1">Start Price</span>
          <span className="text-xs font-bold text-gray-300">{formatPrice(stats.startPrice)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 uppercase font-extrabold mb-1">End Price</span>
          <span className="text-xs font-bold text-gray-100">{formatPrice(stats.endPrice)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 uppercase font-extrabold mb-1">Highest</span>
          <span className="text-xs font-bold text-emerald-400">{formatPrice(stats.high)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 uppercase font-extrabold mb-1">Lowest</span>
          <span className="text-xs font-bold text-rose-400">{formatPrice(stats.low)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 uppercase font-extrabold mb-1">Price Change</span>
          <span className={`text-xs font-bold ${stats.priceChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {stats.priceChange >= 0 ? '▲' : '▼'} {Math.abs(stats.priceChange).toFixed(2)}%
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-gray-500 uppercase font-extrabold mb-1">Vol Momentum</span>
          <span className={`text-xs font-bold ${stats.volumeChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {stats.volumeChange >= 0 ? '▲' : '▼'} {Math.abs(stats.volumeChange).toFixed(2)}%
          </span>
        </div>
      </div>
    </>
  );
};

export default StatsPanel;
