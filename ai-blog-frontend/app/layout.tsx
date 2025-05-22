import './globals.css';
import React from 'react';

export const metadata = {
  title: 'AI-Powered Blog',
  description: 'Minimal AI blog with Next.js 13 app directory',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen antialiased font-sans">
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <nav className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            <a
              href="/"
              className="text-2xl font-bold text-gray-800 hover:text-gray-900 transition"
            >
              AI Blog
            </a>
            <div className="space-x-4">
              <a
                href="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
              >
                Dashboard
              </a>
              <a
                href="/articles/new"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
              >
                Create
              </a>
              <a
                href="/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
              >
                Login
              </a>
              <a
                href="/register"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
              >
                Register
              </a>
            </div>
          </nav>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
