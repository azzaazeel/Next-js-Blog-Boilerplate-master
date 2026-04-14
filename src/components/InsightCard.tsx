import React from 'react';
import Link from 'next/link';

export const InsightCard = ({ post }: { post: any }) => {
  const href = `/insights/${post.slug}`;

  return (
    <div className="p-6 border-l-4 border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] hover:border-emerald-500 transition-all mb-6 shadow-sm rounded-r-xl group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
            Market Insight
          </span>
          {post.category && (
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 font-mono">
              {post.category}
            </span>
          )}
        </div>
        <div className="text-[11px] text-gray-400 font-medium">
          {post.date}
        </div>
      </div>

      <h3 className="text-2xl font-bold leading-tight mb-4 group-hover:text-emerald-500 transition-colors text-gray-900 dark:text-white">
        <Link href={href} legacyBehavior>
          <a className="cursor-pointer" style={{ color: 'inherit' }}>
            {post.title}
          </a>
        </Link>
      </h3>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
        {post.description}
      </p>

      <div className="flex justify-between items-center text-xs text-gray-400 pt-4 border-t border-gray-50 dark:border-gray-800/50">
        <div className="flex items-center gap-3">
           <span className="flex items-center gap-1">
             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             Research Data
           </span>
        </div>
        <Link href={href} legacyBehavior>
          <a className="text-emerald-500 font-bold hover:underline flex items-center gap-1 cursor-pointer">
            READ FULL INSIGHT
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </Link>
      </div>
    </div>
  );
};
