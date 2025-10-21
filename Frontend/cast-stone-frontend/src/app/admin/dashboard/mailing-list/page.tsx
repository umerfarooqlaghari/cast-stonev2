'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';

interface MailingListSubscriber {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
}

export default function MailingListPage() {
  const [subscribers, setSubscribers] = useState<MailingListSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('https://cast-stonev2.onrender.com/api/mailinglist');
      const result = await response.json();
      
      if (result.success) {
        setSubscribers(result.data);
      } else {
        setError(result.message || 'Failed to fetch subscribers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch mailing list subscribers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`https://cast-stonev2.onrender.com/api/mailinglist/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Remove from local state
        setSubscribers(prev => prev.filter(sub => sub.id !== id));
        setDeleteConfirm(null);
      } else {
        alert(result.message || 'Failed to delete subscriber');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete subscriber');
    }
  };

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = searchTerm === '' || 
      subscriber.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-black p-6">
            <h1 className="text-3xl font-bold text-black mb-2">Mailing List Subscribers</h1>
            <p className="text-black">
              View and manage all newsletter subscribers.
            </p>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-sm border border-black p-6">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-black mb-2">
                Search Subscribers
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Subscribers Table */}
          <div className="bg-white rounded-lg shadow-sm border border-black overflow-hidden">
            <div className="px-6 py-4 border-b border-black">
              <h2 className="text-xl font-semibold text-black">
                Total Subscribers: {filteredSubscribers.length}
              </h2>
            </div>

            {filteredSubscribers.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-black">
                  {searchTerm ? 'No subscribers match your search.' : 'No subscribers found.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-black">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Full Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Date Subscribed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-black">
                    {filteredSubscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-black">{subscriber.fullName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-black">{subscriber.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {formatDate(subscriber.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {deleteConfirm === subscriber.id ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleDelete(subscriber.id)}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(subscriber.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

