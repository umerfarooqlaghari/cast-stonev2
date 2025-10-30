/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { workerMessageService, collectionService } from '@/services';
import { cloudinaryService, CloudinaryImageInfo } from '@/services/api/cloudinary/cloudinaryService';
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
  const [collectionSearchQuery, setCollectionSearchQuery] = useState('');
  const [uploadedImages, setUploadedImages] = useState<CloudinaryImageInfo[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

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

  const fetchUploadedImages = async () => {
    try {
      setIsLoadingImages(true);
      const images = await cloudinaryService.getAllImages();
      setUploadedImages(images);
    } catch (error) {
      console.error('Error fetching uploaded images:', error);
    } finally {
      setIsLoadingImages(false);
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
    fetchUploadedImages();
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
    fetchUploadedImages();
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

  const selectAllCollections = () => {
    const availableCollections = collections
      .filter(col => !isCollectionAssignedToOtherMessage(col.id))
      .map(col => col.id);
    setFormData(prev => ({
      ...prev,
      collectionIds: [...new Set([...prev.collectionIds, ...availableCollections])]
    }));
  };

  const deselectAllCollections = () => {
    setFormData(prev => ({
      ...prev,
      collectionIds: []
    }));
  };

  const selectAllChildrenOfParent = (parentId: number) => {
    const childCollections = collections
      .filter(col => col.parentCollectionId === parentId && !isCollectionAssignedToOtherMessage(col.id))
      .map(col => col.id);
    setFormData(prev => ({
      ...prev,
      collectionIds: [...new Set([...prev.collectionIds, ...childCollections])]
    }));
  };

  const getParentCollections = () => {
    return collections.filter(col => !col.parentCollectionId);
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
            <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto border-2 border-black rounded-lg">
              <div className="bg-white  border-2 border-black rounded-lg p-8 max-w-2xl w-full mx-4 my-8">
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

                    {/* Choose from uploaded images dropdown */}
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Or choose from uploaded images:
                      </label>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            setFormData({ ...formData, imageUrl: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                        disabled={isLoadingImages}
                        value=""
                      >
                        <option value="">
                          {isLoadingImages ? 'Loading images...' : 'Select an uploaded image'}
                        </option>
                        {uploadedImages.map((image) => (
                          <option key={image.publicId} value={image.secureUrl}>
                            {image.fileName}
                          </option>
                        ))}
                      </select>
                      {uploadedImages.length === 0 && !isLoadingImages && (
                        <p className="text-sm text-gray-500 mt-1">
                          No uploaded images found. <a href="/admin/dashboard/images" target="_blank" className="text-blue-600 hover:text-blue-800">Upload images here</a>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Collections (Multi-Select)</label>

                    {/* Quick Select Buttons */}
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <button
                        type="button"
                        onClick={selectAllCollections}
                        className="px-3 py-1 text-xs font-medium bg-black text-white rounded hover:bg-gray-800 transition-colors"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={deselectAllCollections}
                        className="px-3 py-1 text-xs font-medium bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
                      >
                        Deselect All
                      </button>
                      {getParentCollections().map(parent => (
                        <button
                          key={parent.id}
                          type="button"
                          onClick={() => selectAllChildrenOfParent(parent.id)}
                          className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Select {parent.name}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCollectionDropdown(!showCollectionDropdown);
                          if (showCollectionDropdown) {
                            setCollectionSearchQuery('');
                          }
                        }}
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
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black rounded-lg shadow-lg z-10 max-h-96 overflow-hidden flex flex-col">
                          {/* Search Bar */}
                          <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
                            <input
                              type="text"
                              placeholder="Search collections..."
                              value={collectionSearchQuery}
                              onChange={(e) => setCollectionSearchQuery(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black text-sm"
                            />
                          </div>

                          {/* Collections List */}
                          <div className="overflow-y-auto">
                            {collections.length === 0 ? (
                              <div className="p-4 text-center text-gray-500">No collections available</div>
                            ) : (
                              collections
                                .filter((col) =>
                                  col.name.toLowerCase().includes(collectionSearchQuery.toLowerCase()) ||
                                  (col.parentCollectionId &&
                                    collections.find(c => c.id === col.parentCollectionId)?.name.toLowerCase().includes(collectionSearchQuery.toLowerCase()))
                                )
                                .map((col) => {
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

