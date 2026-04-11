import React, { useState, useEffect, useRef } from 'react';

import gfm from '@bytemd/plugin-gfm';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { Meta } from '../layout/Meta';
import { useSession } from '../lib/auth-client';
import { Main } from '../templates/Main';

const Editor = dynamic(
  () => import('@bytemd/react').then((mod) => mod.Editor),
  { ssr: false }
);
const plugins = [gfm()];

const today = new Date().toISOString().split('T')[0];
const DEFAULT_FRONTMATTER = `---
title: 'New Post'
description: ''
date: '${today}'
modified_date: '${today}'
image: '/assets/images/default-cover.jpg'
---

Write your content here...
`;

const FOLDERS = ['_tweets', '_articles', '_insights'];

const EditorPage = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newFolder, setNewFolder] = useState('_tweets');
  const [newFilename, setNewFilename] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadFiles = () => {
    fetch('/api/admin/posts')
      .then((res) => res.json())
      .then((data) => {
        if (data.files) {
          setFiles(data.files);
        }
      });
  };

  const loadPost = (filename: string) => {
    setSelectedFile(filename);
    fetch(`/api/admin/posts?filename=${encodeURIComponent(filename)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.content) {
          setContent(data.content);
        }
      });
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: selectedFile, content }),
    });
    setSaving(false);
  };

  const handleCreate = async () => {
    if (!newFilename.trim()) return;
    const slug = newFilename
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    const filename = `${newFolder}/${slug}.md`;
    await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, content: DEFAULT_FRONTMATTER }),
    });
    setShowNewModal(false);
    setNewFilename('');
    loadFiles();
    loadPost(filename);
  };

  const handleDelete = async () => {
    if (!selectedFile) return;
    if (!window.confirm(`Delete "${selectedFile}"? This cannot be undone.`))
      return;
    await fetch('/api/admin/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: selectedFile }),
    });
    loadFiles();
    setSelectedFile('');
    setContent('');
  };

  // Auth guard
  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/auth/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (!session) return;
    fetch('/api/admin/posts')
      .then((res) => res.json())
      .then((data) => {
        if (data.files) {
          setFiles(data.files);
          if (data.files.length > 0) {
            loadPost(data.files[0]);
          }
        }
      });
  }, [session]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredFiles = searchQuery
    ? files.filter((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
    : files.slice(0, 8);

  if (isPending || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <Main
      meta={
        <Meta
          title="Internal Post Manager"
          description="Local markdown editor"
        />
      }
    >
      <div className="py-8">
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-6 border-b pb-4 gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold whitespace-nowrap">
              Edit Content
            </h1>

            {/* File Selector */}
            <div className="relative" ref={dropdownRef}>
              <div
                className="border border-gray-300 bg-white rounded-lg px-3 py-2 font-medium text-gray-700 cursor-pointer min-w-[280px] flex justify-between items-center hover:border-gray-400 transition-colors"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="truncate mr-3 text-sm">
                  {selectedFile || 'Select a post...'}
                </span>
                <span className="text-gray-400 text-xs">▼</span>
              </div>

              {dropdownOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                  <input
                    type="text"
                    className="w-full px-3 py-2.5 border-b border-gray-100 outline-none text-sm placeholder-gray-400"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                  <div className="max-h-64 overflow-y-auto">
                    {filteredFiles.map((f) => {
                      const [dir, ...nameParts] = f.split('/');
                      return (
                        <div
                          key={f}
                          className={`px-3 py-2.5 text-sm cursor-pointer border-b border-gray-50 last:border-0 ${
                            selectedFile === f
                              ? 'bg-blue-50 text-blue-700 font-semibold'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            loadPost(f);
                            setDropdownOpen(false);
                            setSearchQuery('');
                          }}
                        >
                          <span className="text-[10px] font-bold uppercase text-gray-400 mr-1">
                            [{dir}]
                          </span>
                          {nameParts.join('/')}
                        </div>
                      );
                    })}
                    {!searchQuery && files.length > 8 && (
                      <div className="px-3 py-2 text-xs text-center text-gray-400 bg-gray-50">
                        Search to find {files.length - 8} more items
                      </div>
                    )}
                    {filteredFiles.length === 0 && (
                      <div className="px-3 py-4 text-sm text-center text-gray-400">
                        No results found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-1.5 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-all shadow-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New
            </button>
            <button
              onClick={handleDelete}
              disabled={!selectedFile}
              className="flex items-center gap-1.5 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !selectedFile}
              className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Current file badge */}
        {selectedFile && (
          <div className="mb-3 text-xs text-gray-400 font-mono">
            Editing:{' '}
            <span className="text-gray-600 font-semibold">{selectedFile}</span>
          </div>
        )}

        {/* Editor */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <style
            dangerouslySetInnerHTML={{
              __html:
                '.bytemd { height: calc(100vh - 240px); min-height: 500px; }',
            }}
          />
          <Editor
            value={content}
            plugins={plugins}
            onChange={(v) => setContent(v)}
          />
        </div>
      </div>

      {/* New Post Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Create New Post</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Folder
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={newFolder}
                onChange={(e) => setNewFolder(e.target.value)}
              >
                {FOLDERS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filename / Slug
              </label>
              <input
                type="text"
                autoFocus
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. my-first-tweet"
                value={newFilename}
                onChange={(e) => setNewFilename(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
              {newFilename && (
                <p className="text-xs text-gray-400 mt-1">
                  Will create:{' '}
                  <code className="font-mono text-gray-600">
                    {newFolder}/
                    {newFilename
                      .toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace(/[^a-z0-9-]/g, '')}
                    .md
                  </code>
                </p>
              )}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newFilename.trim()}
                className="px-4 py-2 rounded-lg text-sm bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-40 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </Main>
  );
};

export default EditorPage;
