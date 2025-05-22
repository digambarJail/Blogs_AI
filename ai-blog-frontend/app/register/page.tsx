'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

type RegisterForm = {
  username: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmit = async (data: RegisterForm) => {
    try {
      console.log('data',data)
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, data, {withCredentials:true});
      setSuccess('Registration successful! You can now log in.');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      setSuccess('');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      {success && <p className="mb-4 text-green-600">{success}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
        <input
          {...register('username')}
          type="text"
          placeholder="Username"
          required
          className="border p-2 rounded"
        />
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
        <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Register
        </button>
      </form>
    </div>
  );
}
