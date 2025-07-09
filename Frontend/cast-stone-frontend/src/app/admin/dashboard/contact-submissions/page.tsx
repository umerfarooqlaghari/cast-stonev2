'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { contactFormGetService } from '@/services/api/contactForm/get';
import { ContactFormSubmission } from '@/services/types/entities';

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactFormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<string>('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await contactFormGetService.getAll();
      setSubmissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contact submissions');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = searchTerm === '' || 
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesInquiry = selectedInquiry === '' || 
      submission.inquiryDisplayName === selectedInquiry;
    
    return matchesSearch && matchesInquiry;
  });

  const uniqueInquiryTypes = Array.from(new Set(submissions.map(s => s.inquiryDisplayName)));

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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-900"></div>
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
          <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
            <h1 className="text-3xl font-bold text-amber-900 mb-2">Contact Form Submissions</h1>
            <p className="text-amber-700">
              View and manage all contact form submissions from your website.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-amber-900 mb-2">
                  Search Submissions
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, company, or message..."
                  className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-amber-900"
                />
              </div>
              <div>
                <label htmlFor="inquiry" className="block text-sm font-medium text-amber-900 mb-2">
                  Filter by Inquiry Type
                </label>
                <select
                  id="inquiry"
                  value={selectedInquiry}
                  onChange={(e) => setSelectedInquiry(e.target.value)}
                  className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-amber-900"
                >
                  <option value="">All Inquiry Types</option>
                  {uniqueInquiryTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
              <button
                onClick={fetchSubmissions}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Submissions Table */}
          <div className="bg-white rounded-lg shadow-sm border border-amber-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-amber-200">
              <h2 className="text-xl font-semibold text-amber-900">
                Submissions ({filteredSubmissions.length})
              </h2>
            </div>
            
            {filteredSubmissions.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-amber-600">
                  {searchTerm || selectedInquiry ? 'No submissions match your filters.' : 'No contact submissions found.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-amber-200">
                  <thead className="bg-amber-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                        Company & State
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                        Inquiry Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-amber-200">
                    {filteredSubmissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-amber-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="font-medium text-amber-900">{submission.name}</div>
                            <div className="text-amber-600">{submission.email}</div>
                            <div className="text-amber-600">{submission.phoneNumber}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="text-amber-900">{submission.company || 'N/A'}</div>
                            <div className="text-amber-600">{submission.state}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                            {submission.inquiryDisplayName}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-amber-900 max-w-xs">
                            <div className="truncate" title={submission.message}>
                              {submission.message.length > 100 
                                ? `${submission.message.substring(0, 100)}...` 
                                : submission.message}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600">
                          {formatDate(submission.createdAt)}
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
