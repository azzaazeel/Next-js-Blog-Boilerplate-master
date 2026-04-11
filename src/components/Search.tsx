import React, { useState, useEffect, useRef } from 'react';

import Link from 'next/link';

export const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          if (res.ok) {
            const data = await res.json();
            setResults(data);
          }
        } catch (e) {
          console.error(e);
        }
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref]);

  return (
    <div className="relative flex items-center mt-[-2px]" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors flex items-center p-1 rounded-full focus:outline-none"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden z-50 border border-gray-100 dark:border-gray-800">
          <div className="p-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
              <svg
                className="w-4 h-4 text-gray-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400"
                placeholder="Search posts..."
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && query && (
              <div className="p-4 text-center text-sm text-gray-400">
                Searching...
              </div>
            )}
            {!loading && query && results.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-400">
                No results found
              </div>
            )}
            {!loading &&
              results.map((post) => (
                <Link
                  key={post.slug}
                  href={`/${post.category}/${post.slug}`}
                  legacyBehavior
                >
                  <a
                    onClick={() => setIsOpen(false)}
                    className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {post.category}
                    </span>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 break-words leading-tight mt-1">
                      {post.title}
                    </h4>
                  </a>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
