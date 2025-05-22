'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Article = {
  _id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  author: { username: string };
};

type User = {
  username: string;
  role: 'admin' | 'editor';
};

export default function DashboardPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current user info
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchUrl =
      user.role === 'admin'
        ? `${process.env.NEXT_PUBLIC_API_URL}/articles`
        : `${process.env.NEXT_PUBLIC_API_URL}/articles/articlesByUser`;

    async function fetchArticles() {
      setLoading(true);
      try {
        const response = await axios.get(fetchUrl, { withCredentials: true });
        setArticles(response.data);
        console.log('articles',response.data)
      } catch (error: any) {
        // Axios error response might hold the message inside error.response.data.error
        const backendError = error.response?.data?.error;
        console.error('Backend error:', backendError || error.message);
        // Show this error in UI or console
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [user]);


  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to see your dashboard.</p>;

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <a href="/articles/new" className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Create New Article
      </a>
      {articles.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-3 py-2 text-left">Title</th>
              <th className="border px-3 py-2 text-left">Status</th>
              <th className="border px-3 py-2 text-left">Author</th>
              <th className="border px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article._id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{article.title}</td>
                <td className="border px-3 py-2 capitalize">{article.status}</td>
                <td className="border px-3 py-2">{article.author.username}</td>
                <td className="border px-3 py-2 space-x-2">
                  <a href={`/articles/${article._id}/edit`} className="text-blue-600 hover:underline">Edit</a>
                  <a href={`/articles/${article._id}`} className="text-gray-600 hover:underline">View</a>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
