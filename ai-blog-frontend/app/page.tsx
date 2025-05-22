'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Author {
  username: string;
  // add other author fields if needed
}

interface Article {
  _id: string;
  title: string;
  summary?: string;
  content: string;
  author: Author;
  username: string;
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/articles?status=published`, {
          withCredentials: true,
        });
        setArticles(res.data);
        console.log('resdata',res.data)
      } catch (err) {
        setError('Failed to load articles.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <p>Loading articles...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
  <h1 className="text-4xl font-bold mb-8 text-gray-900">Published Articles</h1>

  {articles.length === 0 ? (
    <p className="text-gray-600 italic">No articles available.</p>
  ) : (
    <ul className="space-y-6">
      {articles.map(article => (
        <li
          key={article._id}
          className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow bg-white"
        >
          <a
            href={`/articles/${article._id}`}
            className="text-2xl font-semibold text-blue-700 hover:underline"
          >
            {article.title}
          </a>
          <p className="text-gray-600 mt-3 text-sm leading-relaxed">
            {article.summary || article.content.substring(0, 150) + '...'}
          </p>
          <p className="text-gray-600 mt-3 text-sm leading-relaxed">
            {article.author?.username || article.content.substring(0, 150) + '...'}
          </p>
        </li>
      ))}
    </ul>
  )}
    </>

  );
}
