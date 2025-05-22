'use client';

import React, { useState } from 'react';
import axios from 'axios';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reset/reset-password`, { email, otp, newPassword });
      setMessage('Password reset successful! You can now log in.');
      setEmail('');
      setOtp('');
      setNewPassword('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          required
          onChange={(e) => setOtp(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          required
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
