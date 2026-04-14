import React, { useState, useEffect, useRef, ReactElement } from 'react';

import gfm from '@bytemd/plugin-gfm';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { renderToStaticMarkup } from 'react-dom/server';
import { 
  Plus, 
  Trash2, 
  Save, 
  Search as SearchIcon, 
  Folder, 
  FileText, 
  ChevronDown, 
  X,
  Image as ImageIcon,
  Upload,
  Link
} from 'lucide-react';

import { Meta } from '../layout/Meta';
import { useSession } from '../lib/auth-client';
import { Main } from '../templates/Main';

const Editor = dynamic(
  () => import('@bytemd/react').then((mod) => mod.Editor),
  { ssr: false }
);

const getIcon = (Icon: any) => renderToStaticMarkup(<Icon size={16} strokeWidth={2} />);

const plugins = [
  gfm(),
  {
    actions: [
      {
        title: 'Image',
        icon: '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.333 2.667v10.666h13.334V2.667H1.333zM13.333 4v8H2.667V4h10.666zM4 5.333a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm0 5.334l2.667-2.667 2 2 1.333-1.334 2 2H4z" fill="currentColor"/></svg>',
        handler: {
          type: 'dropdown' as const,
          actions: [
            {
              title: 'Upload local image',
              icon: getIcon(Upload),
              handler: {
                type: 'action' as const,
                click({ editor }: any) {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = async () => {
                    const file = input.files?.[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append('file', file);
                      const res = await fetch('/api/admin/upload', {
                        method: 'POST',
                        body: formData,
                      });
                      const data = await res.json();
                      if (data.url) {
                        editor.replaceSelection(`![${file.name}](${data.url})`);
                        editor.focus();
                      }
                    }
                  };
                  input.click();
                },
              },
            },
            {
              title: 'Insert from URL',
              icon: getIcon(Link),
              handler: {
                type: 'action' as const,
                click({ editor }: any) {
                  const url = window.prompt('Enter image URL:');
                  if (url) {
                    editor.replaceSelection(`![image](${url})`);
                    editor.focus();
                  }
                },
              },
            },
          ],
        },
      },
    ],
  },
];

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
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
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
                        <span className="text-[10px] font-bold uppercase text-gray-400 mr-2 bg-gray-100 px-1.5 py-0.5 rounded">
                          {dir.replace('_', '')}
                        </span>
                        <span className="truncate">{nameParts.join('/')}</span>
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
            className="group flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-md hover:shadow-emerald-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            New Post
          </button>
          <button
            onClick={handleDelete}
            disabled={!selectedFile}
            className="flex items-center gap-2 bg-rose-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-rose-600 disabled:opacity-30 disabled:grayscale transition-all shadow-md hover:shadow-rose-500/20 active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !selectedFile}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-30 disabled:grayscale transition-all shadow-md hover:shadow-blue-500/20 active:scale-95"
          >
            <Save className={`w-4 h-4 ${saving ? 'animate-pulse' : ''}`} />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
        </div>
      </div>

      {/* Current file badge */}
      {selectedFile && (
        <div className="mb-4 flex items-center gap-2 text-xs text-gray-400 font-medium">
          <FileText className="w-3.5 h-3.5" />
          Editing:{' '}
          <span className="text-gray-600 font-bold bg-gray-100 px-2 py-0.5 rounded-full">{selectedFile}</span>
        </div>
      )}

      {/* Editor */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .bytemd { height: calc(100vh - 240px); min-height: 500px; }
              /* Hide the default ByteMD image button to use our enhanced one */
              button[aria-label="Image"], 
              button[title="Image"],
              button[data-tippy-content="Image"] { 
                display: none !important; 
              }
            `,
          }}
        />
        <Editor
          value={content}
          plugins={plugins}
          onChange={(v) => setContent(v)}
          uploadImages={async (files) => {
            const results = await Promise.all(
              files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                
                const res = await fetch('/api/admin/upload', {
                  method: 'POST',
                  body: formData,
                });
                
                const data = await res.json();
                return {
                  url: data.url,
                  alt: file.name,
                };
              })
            );
            return results;
          }}
        />
      </div>

      {/* New Post Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-emerald-500" />
                    Create New Post
                </h2>
                <button onClick={() => setShowNewModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="p-6">
                <div className="mb-5">
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
      </div>
    )}
    </div>
  );
};

EditorPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <Main
      meta={
        <Meta
          title="Internal Post Manager"
          description="Local markdown editor"
        />
      }
    >
      {page}
    </Main>
  );
};

export default EditorPage;
