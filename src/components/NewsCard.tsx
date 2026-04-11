import React from 'react';
import Link from 'next/link';

export const NewsCard = ({ item }: { item: any }) => {
  const isExternal = item.link && item.link.startsWith('http');
  const internalHref = `/cs-news/${item.slug}`;
  const href = isExternal ? item.link : internalHref;

  return (
    <div className="p-5 border-l-4 border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] hover:border-secondary transition-all mb-8 shadow-sm rounded-r-lg group">
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
          item.type === 'Update' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
        }`}>
          {item.type}
        </span>
        {item.marketImpact === 'High' && (
          <span className="animate-pulse bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded">
            Market Alert
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-3">
        <Link href={href} legacyBehavior>
          <a className="hover:text-primary transition-colors cursor-pointer block">
            {item.title}
          </a>
        </Link>
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-base mb-4 line-clamp-3">
        {item.description}
      </p>
      <div className="flex justify-between items-center text-xs text-gray-400 font-mono border-t border-gray-50 dark:border-gray-800 pt-4 mt-2">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {item.pubDate}
        </span>
        <Link href={href} legacyBehavior>
          <a className="text-secondary font-bold hover:underline flex items-center gap-1 cursor-pointer">
            {isExternal ? 'READ SOURCE' : 'READ MORE'}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </Link>
      </div>
    </div>
  );
};
