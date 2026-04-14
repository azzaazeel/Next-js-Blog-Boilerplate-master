import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Meta } from '../layout/Meta';
import { useSession } from '../lib/auth-client';
import { Main } from '../templates/Main';

import { ReactElement } from 'react';

const AdminDashboard = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/auth/login');
    }
  }, [session, isPending, router]);

  // Load media files
  useEffect(() => {
    if (!session) return;
    fetch('/api/admin/media-list')
      .then(res => res.json())
      .then(data => setMediaFiles(data.files || []));
  }, [session]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setMediaFiles([
          { name: file.name, url: data.url, mtime: new Date() },
          ...mediaFiles
        ]);
        setMessage('✅ Image uploaded successfully!');
      }
    } catch (err) {
      setMessage('❌ Upload failed.');
    }
    setUploading(false);
  };

  const handleClearCache = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/revalidate');
      const data = await res.json();
      if (data.revalidated) {
        setMessage('✅ Cache cleared successfully!');
      } else {
        setMessage('❌ Failed to clear cache.');
      }
    } catch (err) {
      setMessage(`❌ Error: ${(err as Error).message}`);
    }
    setLoading(false);
  };

  if (isPending) return <div className="p-10 text-center text-gray-400">Loading Dashboard...</div>;

  return (
    <div className="py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-white">
          Admin <span className="text-primary">Dashboard</span>
        </h1>
        <div className="text-xs text-gray-500 font-medium px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
          Admin Access: {session?.user?.name}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Editor Tool */}
        <div className="p-6 bg-white dark:bg-[#1a1d26] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:border-emerald-500/50 transition-all group h-full flex flex-col">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 dark:text-gray-100">Content Editor</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-1">
            Create and manage articles and tweets.
          </p>
          <button
            onClick={() => router.push('/editor')}
            className="w-full bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-emerald-700 transition-all"
          >
            Open Editor
          </button>
        </div>

        {/* TradingView Tool */}
        <div className="p-6 bg-white dark:bg-[#1a1d26] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:border-blue-500/50 transition-all group h-full flex flex-col">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 dark:text-gray-100">TradingView</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-1">
            Market data analysis and visualizers.
          </p>
          <button
            onClick={() => router.push('/tradingview')}
            className="w-full bg-blue-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-blue-700 transition-all"
          >
            View Charts
          </button>
        </div>

        {/* Media Manager Tool */}
        <div className="p-6 bg-white dark:bg-[#1a1d26] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:border-purple-500/50 transition-all group h-full flex flex-col">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 dark:text-gray-100">Media Manager</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Upload images to use in articles.
          </p>
          
          <div className="flex-1 space-y-3 mb-4 max-h-[120px] overflow-y-auto scrollbar-thin">
            {mediaFiles.slice(0, 5).map(f => (
              <div key={f.url} className="flex items-center justify-between gap-2 p-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 group/item">
                 <div className="flex flex-col truncate flex-1">
                    <span className="text-[10px] text-gray-400 truncate">{f.name}</span>
                    <span className="text-[9px] text-gray-600 font-mono truncate">{f.url}</span>
                 </div>
                 <button 
                  onClick={() => { navigator.clipboard.writeText(f.url); setMessage(`✅ Copied: ${f.url}`); }}
                  className="flex-shrink-0 px-2 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold rounded-md hover:bg-purple-500 hover:text-white transition-all uppercase"
                 >
                   Copy Link
                 </button>
              </div>
            ))}
          </div>

          <label className={`w-full bg-purple-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-purple-700 transition-all cursor-pointer text-center ${uploading ? 'opacity-50 cursor-wait' : ''}`}>
            {uploading ? 'Uploading...' : 'Upload Image'}
            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*" />
          </label>
        </div>

        {/* Cache Management */}
        <div className="p-6 bg-white dark:bg-[#1a1d26] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:border-amber-500/50 transition-all group h-full flex flex-col">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-4 text-amber-600 dark:text-amber-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2 dark:text-gray-100">System Cache</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-1">
            Revalidate the website index.
          </p>
          <button
            onClick={handleClearCache}
            disabled={loading}
            className="w-full bg-amber-500 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-amber-600 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? 'Processing...' : 'Clear Cache'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mt-8 p-4 rounded-xl text-center font-bold animate-in fade-in slide-in-from-bottom-2 ${message.includes('✅') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

AdminDashboard.getLayout = function getLayout(page: ReactElement) {
  return (
    <Main
      meta={<Meta title="Admin Dashboard" description="Management utilities and tools" />}
    >
      {page}
    </Main>
  );
};

export default AdminDashboard;
