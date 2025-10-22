/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { workerMessageService, collectionService } from '@/services';
import { WorkerMessage, Collection } from '@/services/types/entities';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export default function WorkerMessagesPage() {
  const { admin } = useAdminAuth();
  const [workerMessages, setWorkerMessages] = useState<WorkerMessage[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<WorkerMessage | null>(null);
  const [formData, setFormData] = useState({
    heading: '',
    description: '',
    imageUrl: '',
    collectionIds: [] as number[],
    isActive: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCollectionDropdown, setShowCollectionDropdown] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [messages, cols] = await Promise.all([
        workerMessageService.get.getAll(),
        collectionService.get.getAll(),
      ]);
      setWorkerMessages(messages);
      setCollections(cols);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMessage = () => {
    setEditingMessage(null);
    setFormData({
      heading: '',
      description: '',
      imageUrl: '',
      collectionIds: [],
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEditMessage = (message: WorkerMessage) => {
    setEditingMessage(message);
    setFormData({
      heading: message.heading,
      description: message.description,
      imageUrl: message.imageUrl,
      collectionIds: message.collectionIds || [],
      isActive: message.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setError('');
      setSuccess('');

      if (!formData.heading || !formData.description || !formData.imageUrl) {
        setError('Please fill in all required fields');
        return;
      }

      if (editingMessage) {
        await workerMessageService.update.update(editingMessage.id, {
          heading: formData.heading,
          description: formData.description,
          imageUrl: formData.imageUrl,
          collectionIds: formData.collectionIds.length > 0 ? formData.collectionIds : undefined,
          isActive: formData.isActive,
          updatedBy: admin?.email || 'admin',
        });
        setSuccess('Worker message updated successfully');
      } else {
        await workerMessageService.post.create({
          heading: formData.heading,
          description: formData.description,
          imageUrl: formData.imageUrl,
          collectionIds: formData.collectionIds.length > 0 ? formData.collectionIds : undefined,
          createdBy: admin?.email || 'admin',
        });
        setSuccess('Worker message created successfully');
      }

      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to save worker message';
      setError(errorMessage);
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this worker message?')) return;

    try {
      await workerMessageService.delete.delete(id);
      setSuccess('Worker message deleted successfully');
      await fetchData();
    } catch (err) {
      setError('Failed to delete worker message');
      console.error(err);
    }
  };

  const getCollectionName = (collectionIds?: number[]) => {
    if (!collectionIds || collectionIds.length === 0) return 'None';
    const names = collectionIds.map(id => {
      const collection = collections.find(c => c.id === id);
      return collection?.name || 'Unknown';
    });
    return names.join(', ');
  };

  const getCollectionDisplayInfo = (collectionId: number) => {
    const collection = collections.find(c => c.id === collectionId);
    if (!collection) return '';
    const parentName = collection.parentCollectionId
      ? collections.find(c => c.id === collection.parentCollectionId)?.name
      : null;
    return `${collection.name}${parentName ? ` (${parentName})` : ''}`;
  };

  const toggleCollectionSelection = (collectionId: number) => {
    setFormData(prev => ({
      ...prev,
      collectionIds: prev.collectionIds.includes(collectionId)
        ? prev.collectionIds.filter(id => id !== collectionId)
        : [...prev.collectionIds, collectionId]
    }));
  };

  const isCollectionAssignedToOtherMessage = (collectionId: number): boolean => {
    return workerMessages.some(msg =>
      msg.id !== editingMessage?.id &&
      msg.collectionIds?.includes(collectionId)
    );
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-black">
            <div>
              <h1 className="text-3xl font-bold text-black">Worker Messages</h1>
              <p className="text-black mt-1">Manage worker messages for collections</p>
            </div>
            <button
              onClick={handleAddMessage}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center shadow-sm font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Message
            </button>
          </div>

          {/* Messages */}
          {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
          {success && <div className="p-4 bg-green-100 text-green-700 rounded-lg">{success}</div>}

          {/* Messages Table */}
          <div className="bg-white rounded-lg shadow-sm border border-black overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto"></div>
                <p className="mt-6 text-black font-medium">Loading messages...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-black">
                  <thead className="bg-black">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Heading</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Collection</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">Created</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-black">
                    {workerMessages.map((message) => (
                      <tr key={message.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-black">{message.heading}</td>
                        <td className="px-6 py-4 text-sm text-black">{getCollectionName(message.collectionIds)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${message.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{new Date(message.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditMessage(message)}
                            className="text-black hover:text-gray-700 mr-4 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(message.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
                <h2 className="text-2xl font-bold text-black mb-6">{editingMessage ? 'Edit Message' : 'Add Message'}</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Heading *</label>
                    <input
                      type="text"
                      value={formData.heading}
                      onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                      className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Enter heading"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Enter description"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Image URL *</label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Enter image URL"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Collections (Multi-Select)</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCollectionDropdown(!showCollectionDropdown)}
                        className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-left bg-white flex justify-between items-center"
                      >
                        <span>
                          {formData.collectionIds.length === 0
                            ? 'Select collections...'
                            : `${formData.collectionIds.length} collection(s) selected`}
                        </span>
                        <svg className={`w-5 h-5 transition-transform ${showCollectionDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </button>

                      {showCollectionDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                          {collections.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">No collections available</div>
                          ) : (
                            collections.map((col) => {
                              const isAssignedToOther = isCollectionAssignedToOtherMessage(col.id);
                              const isSelected = formData.collectionIds.includes(col.id);
                              const parentName = col.parentCollectionId
                                ? collections.find(c => c.id === col.parentCollectionId)?.name
                                : null;

                              return (
                                <label
                                  key={col.id}
                                  className={`flex items-center px-4 py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                                    isAssignedToOther && !isSelected ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleCollectionSelection(col.id)}
                                    disabled={isAssignedToOther && !isSelected}
                                    className="w-4 h-4 border border-black rounded"
                                  />
                                  <div className="ml-3 flex-1">
                                    <div className="text-sm font-medium text-black">
                                      {col.name}
                                      {parentName && <span className="text-gray-500 ml-2">({parentName})</span>}
                                    </div>
                                    {isAssignedToOther && !isSelected && (
                                      <div className="text-xs text-red-600 mt-1">Already assigned to another message</div>
                                    )}
                                  </div>
                                </label>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>

                    {/* Selected Collections Display */}
                    {formData.collectionIds.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {formData.collectionIds.map(collectionId => {
                          const col = collections.find(c => c.id === collectionId);
                          return (
                            <div key={collectionId} className="bg-black text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                              {col?.name}
                              <button
                                type="button"
                                onClick={() => toggleCollectionSelection(collectionId)}
                                className="hover:text-gray-300"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {editingMessage && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 border border-black rounded"
                      />
                      <label className="ml-2 text-sm font-medium text-black">Active</label>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

