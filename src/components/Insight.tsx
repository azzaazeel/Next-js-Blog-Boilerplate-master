import React from 'react';

type InsightProps = {
  url?: string;
  theme?: 'dark' | 'light';
  data?: {
    totalIndexValue?: string;
    averagePrice?: string;
    priceRange?: string;
    totalOffers?: string;
    totalSold?: string;
    metrics?: {
      day?: string;
      week?: string;
      month?: string;
      quarter?: string;
    };
  };
};

export const Insight: React.FC<InsightProps> = ({
  theme = 'dark',
  data = {
    totalIndexValue: '$537.22',
    averagePrice: '$12.89',
    totalOffers: '5,541,099',
    totalSold: '11,542',
    priceRange: '$0.26 - $157.67',
    metrics: {
      day: '+0.64%',
      week: '+3.14%',
      month: '+5.50%',
      quarter: '+17.48%',
    },
  },
}) => {
  if (theme === 'light') {
    return (
      <div className="bg-white text-gray-900 rounded-xl shadow-lg p-6 my-8 border border-gray-200">
        <h3
          className="text-xl font-bold mb-4 border-b border-gray-100 pb-2 text-primary"
          style={{ marginTop: 0 }}
        >
          Market Performance (Light Theme)
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">24 Hours</span>
            <span className="text-xl font-bold" style={{ color: '#22c55e' }}>
              {data.metrics?.day}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">7 Days</span>
            <span className="text-xl font-bold" style={{ color: '#22c55e' }}>
              {data.metrics?.week}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">30 Days</span>
            <span className="text-xl font-bold" style={{ color: '#22c55e' }}>
              {data.metrics?.month}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">90 Days</span>
            <span className="text-xl font-bold" style={{ color: '#22c55e' }}>
              {data.metrics?.quarter}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 bg-gray-50 rounded-lg p-5 text-sm">
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-600">Total Index Value:</span>
            <span className="font-bold text-gray-900">
              {data.totalIndexValue}
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-600">Average Price:</span>
            <span className="font-bold text-gray-900">{data.averagePrice}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-600">Total Offers:</span>
            <span className="font-bold text-gray-900">{data.totalOffers}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-gray-600">Total Sold:</span>
            <span className="font-bold text-gray-900">{data.totalSold}</span>
          </div>
          <div className="flex justify-between md:col-span-2 pt-1 border-gray-200">
            <span className="text-gray-600">Price Range:</span>
            <span className="font-bold text-secondary text-base">
              {data.priceRange}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white rounded-xl shadow-lg p-6 my-8 border border-gray-800">
      <h3
        className="text-xl font-bold mb-4 border-b border-gray-800 pb-2 text-primary"
        style={{ marginTop: 0 }}
      >
        Market Performance
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">24 Hours</span>
          <span className="text-xl font-bold" style={{ color: '#4ade80' }}>
            {data.metrics?.day}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">7 Days</span>
          <span className="text-xl font-bold" style={{ color: '#4ade80' }}>
            {data.metrics?.week}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">30 Days</span>
          <span className="text-xl font-bold" style={{ color: '#4ade80' }}>
            {data.metrics?.month}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-400">90 Days</span>
          <span className="text-xl font-bold" style={{ color: '#4ade80' }}>
            {data.metrics?.quarter}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 bg-gray-800 rounded-lg p-5 text-sm">
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">Total Index Value:</span>
          <span className="font-bold text-white">{data.totalIndexValue}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">Average Price:</span>
          <span className="font-bold text-white">{data.averagePrice}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">Total Offers:</span>
          <span className="font-bold text-white">{data.totalOffers}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">Total Sold:</span>
          <span className="font-bold text-white">{data.totalSold}</span>
        </div>
        <div className="flex justify-between md:col-span-2 pt-1 border-gray-700">
          <span className="text-gray-400">Price Range:</span>
          <span className="font-bold text-secondary text-base">
            {data.priceRange}
          </span>
        </div>
      </div>
    </div>
  );
};
