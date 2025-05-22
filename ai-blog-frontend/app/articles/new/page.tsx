'use client';

import React, { useState } from 'react';
import axios from 'axios';

export default function CreateArticlePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [message, setMessage] = useState('');

  // Call backend AI endpoints
  const handleSuggestTitle = async () => {
  if (!content.trim()) {
    setMessage('Please enter content to suggest a title.');
    return;
  }
  setLoadingAI(true);
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/ai`,
      { task: 'suggest_title', content },
      { withCredentials: true }
    );
    setTitle(res.data.result);
    setMessage('Suggested title applied.');
  } catch {
    setMessage('Error getting title suggestion.');
  } finally {
    setLoadingAI(false);
  }
};

const handleSummarize = async () => {
  if (!content.trim()) {
    setMessage('Please enter content to summarize.');
    return;
  }
  setLoadingAI(true);
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/ai`,
      { task: 'summarize', content },
      { withCredentials: true }
    );
    setContent(res.data.result);
    setMessage('Content summarized.');
  } catch {
    setMessage('Error summarizing content.');
  } finally {
    setLoadingAI(false);
  }
};

const handleImproveText = async () => {
  if (!content.trim()) {
    setMessage('Please enter content to improve.');
    return;
  }
  setLoadingAI(true);
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/ai`,
      { task: 'improve', content },
      { withCredentials: true }
    );
    setContent(res.data.result);
    setMessage('Content improved.');
  } catch {
    setMessage('Error improving content.');
  } finally {
    setLoadingAI(false);
  }
};


  const handleSave = async (status: 'draft' | 'published') => {
    if (!title.trim() || !content.trim()) {
      setMessage('Title and content are required.');
      return;
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/articles`,
        { title, content, status },
        { withCredentials: true }
      );
      setMessage(`Article ${status === 'published' ? 'published' : 'saved as draft'}.`);
      setTitle('');
      setContent('');
    } catch {
      setMessage('Failed to save article.');
    }
  };

  return (
    <div>
  <h1 className="text-3xl font-bold mb-6 text-gray-900">Create New Article</h1>

  {message && <p className="mb-4 text-sm text-red-600">{message}</p>}

  <input
    type="text"
    placeholder="Title"
    value={title}
    onChange={e => setTitle(e.target.value)}
    className="block w-full mb-4 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <textarea
    placeholder="Content"
    value={content}
    onChange={e => setContent(e.target.value)}
    rows={10}
    className="block w-full mb-4 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

  <div className="space-x-2 mb-6">
    <button
      disabled={loadingAI}
      onClick={handleSuggestTitle}
      className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:opacity-50 transition"
    >
      Suggest Title
    </button>

    <button
      disabled={loadingAI}
      onClick={handleSummarize}
      className="px-4 py-2 rounded-lg bg-yellow-100 text-yellow-800 hover:bg-yellow-200 disabled:opacity-50 transition"
    >
      Summarize Content
    </button>

    <button
      disabled={loadingAI}
      onClick={handleImproveText}
      className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 transition"
    >
      Improve Writing
    </button>
  </div>

  <div className="space-x-2">
    <button
      onClick={() => handleSave('draft')}
      className="px-4 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
    >
      Save Draft
    </button>

    <button
      onClick={() => handleSave('published')}
      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
    >
      Publish
    </button>
  </div>
</div>

  );
}
