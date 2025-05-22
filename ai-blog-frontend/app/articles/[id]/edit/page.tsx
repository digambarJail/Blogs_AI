'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

interface Props {
  params: { id: string };
}

export default function EditArticlePage({ params }: Props) {
  const { id } = useParams(); // Get dynamic route param
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('draft');
  const [loading, setLoading] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`, { withCredentials: true })
      .then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
        setStatus(res.data.status);
      })
      .catch(() => setMessage('Failed to load article.'))
      .finally(() => setLoading(false));
  }, [id]);

  // AI handlers same as create page
  const handleSuggestTitle = async () => {
    if (!content.trim()) {
      setMessage('Please enter content to suggest a title.');
      return;
    }
    setLoadingAI(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ai/suggest-title`, { content }, { withCredentials: true });
      setTitle(res.data.suggestedTitle);
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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ai/summarize`, { content }, { withCredentials: true });
      setContent(res.data.summary);
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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ai/improve-text`, { content }, { withCredentials: true });
      setContent(res.data.improvedText);
      setMessage('Content improved.');
    } catch {
      setMessage('Error improving content.');
    } finally {
      setLoadingAI(false);
    }
  };

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      setMessage('Title and content are required.');
      return;
    }
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`,
        { title, content, status },
        { withCredentials: true }
      );
      setMessage('Article updated.');
      router.push('/dashboard');
    } catch {
      setMessage('Failed to update article.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
  <h1 className="text-3xl font-bold mb-6 text-gray-900">Edit Article</h1>

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

  <select
    value={status}
    onChange={e => setStatus(e.target.value as 'draft' | 'published' | 'archived')}
    className="block w-full mb-6 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="draft">Draft</option>
    <option value="published">Published</option>
    <option value="archived">Archived</option>
  </select>

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

  <button
    onClick={handleUpdate}
    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
  >
    Update Article
  </button>
</div>

  );
}
