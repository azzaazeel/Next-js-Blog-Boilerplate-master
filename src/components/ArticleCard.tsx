import React from 'react';
import Link from 'next/link';

export const ArticleCard = ({ post }: { post: any }) => {
  const href = `/articles/${post.slug}`;

  return (
    <div className="p-6 border-l-4 border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] hover:border-secondary transition-all mb-6 shadow-sm rounded-r-xl group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
            Feature Article
          </span>
          {post.category && post.category !== 'articles' && (
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 font-mono">
              {post.category}
            </span>
          )}
        </div>
        <div className="text-[11px] text-gray-400 font-medium">
          {post.date}
        </div>
      </div>

      <h3 className="text-2xl font-bold leading-tight mb-4 group-hover:text-secondary transition-colors text-gray-900 dark:text-white">
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
             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
             Editorial
           </span>
        </div>
        <Link href={href} legacyBehavior>
          <a className="text-secondary font-bold hover:underline flex items-center gap-1 cursor-pointer">
            READ ARTICLE
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
        </Link>
      </div>
    </div>
  );
};
