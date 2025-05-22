'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const [error, setError] = useState('');

  const onSubmit = async (data: LoginForm) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, data, { withCredentials: true });
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      {error && <p className="mb-4 text-red-600 text-center">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
          required
          className="border p-2 rounded"
        />
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          required
          className="border p-2 rounded"
        />
        <div className="text-right">
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}
