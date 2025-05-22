'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '@/types';

export default function AdminUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (id: string, newRole: 'admin' | 'editor') => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}/${ newRole }`,{}, { withCredentials: true });
      fetchUsers();
    } catch (err) {
      console.error('Error updating role:', err);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, { withCredentials: true });
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Username</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="border-t">
              <td className="p-2">{user.username}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2 capitalize">{user.role}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => changeRole(user._id, user.role === 'admin' ? 'editor' : 'admin')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Make {user.role === 'admin' ? 'Editor' : 'Admin'}
                </button>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
