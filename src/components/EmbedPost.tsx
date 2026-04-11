import React, { useEffect, useState } from 'react';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import { Insight } from './Insight';

interface EmbedPostProps {
  type: string;
  slug: string;
}

export const EmbedPost: React.FC<EmbedPostProps> = ({ type, slug }) => {
  const [data, setData] = useState<{
    title: string;
    mdxSource: MDXRemoteSerializeResult;
  } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/embed?type=${type}&slug=${slug}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(true);
      }
    };

    fetchPost();
  }, [type, slug]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 my-4 text-red-700 font-medium">
        Failed to load embedded post: {slug} from {type}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 my-8 animate-pulse bg-gray-50 border border-gray-100 rounded-xl text-gray-400 font-medium">
        Loading embedded content from server...
      </div>
    );
  }

  return (
    <div className="my-10 rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white">
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center">
        <svg
          className="w-4 h-4 mr-2 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        Embedded Content: {data.title}
      </div>
      <div className="p-8 prose max-w-none text-gray-800">
        <MDXRemote {...data.mdxSource} components={{ Insight }} />
      </div>
    </div>
  );
};
