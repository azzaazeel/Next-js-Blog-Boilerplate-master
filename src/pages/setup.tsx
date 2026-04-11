import React, { useState } from 'react';

import Head from 'next/head';

export default function SetupPage() {
  const [email, setEmail] = useState('admin@kanocs.com');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('Admin');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>One-time Setup | Kanocs</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
          <h1 className="text-xl font-bold mb-2">One-time Admin Setup</h1>
          <p className="text-sm text-red-500 mb-6">
            Delete this page after use!
          </p>
          <form onSubmit={handleSetup} className="space-y-4">
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Admin User'}
            </button>
          </form>
          {result && (
            <pre className="mt-4 text-xs bg-gray-50 p-3 rounded overflow-auto">
              {result}
            </pre>
          )}
        </div>
      </div>
    </>
  );
}
