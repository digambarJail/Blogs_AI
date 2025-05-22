'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

type Article = {
  _id: string;
  title: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  author: { username: string };
};

export default function ArticleDetailPage() {
  const { id } = useParams(); // ✅ client-side param extraction
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`, {
          withCredentials: true,
        });
        setArticle(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!article) return <p>No article found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-4xl font-extrabold mb-3 text-gray-900">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-6 italic">
        By <span className="font-medium text-gray-700">{article.author.username}</span>
      </p>
      <article className="prose prose-lg prose-blue max-w-none">
        {article.content}
      </article>
    </div>

  );
}
