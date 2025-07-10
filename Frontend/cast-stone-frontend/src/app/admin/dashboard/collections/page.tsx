'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import CollectionModal from '@/components/admin/CollectionModal';
import { collectionService } from '@/services';
import { Collection } from '@/services/types/entities';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<number | ''>('');

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const data = await collectionService.get.getAll();
      setCollections(data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCollection = () => {
    setEditingCollection(null);
    setIsModalOpen(true);
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setIsModalOpen(true);
  };

  const handleDeleteCollection = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await collectionService.delete.delete(id);
        await fetchCollections();
      } catch (error) {
        console.error('Error deleting collection:', error);
        alert('Error deleting collection. Please try again.');
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    setEditingCollection(null);
    fetchCollections();
  };

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (collection.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesLevel = levelFilter === '' || collection.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const getLevelBadgeColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-blue-100 text-blue-800';
      case 2: return 'bg-green-100 text-green-800';
      case 3: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getParentCollectionName = (parentId: number | null) => {
    if (!parentId) return '-';
    const parent = collections.find(c => c.id === parentId);
    return parent?.name || 'Unknown';
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-black-200">
            <div>
              <h1 className="text-3xl font-bold text-black">Collections Management</h1>
              <p className="text-black mt-1">Manage your product collections and hierarchy</p>
            </div>
            <button
              onClick={handleAddCollection}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-black transition-colors flex items-center shadow-sm font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Collection
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-black-200 p-6">
            <h3 className="text-lg font-semibold text-black mb-4">Filter Collections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="search" className="block text-sm font-semibold text-black mb-2">
                  Search Collections
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or description..."
                  className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black placeholder-black"
                />
              </div>
              <div>
                <label htmlFor="level" className="block text-sm font-semibold text-black mb-2">
                  Filter by Level
                </label>
                <select
                  id="level"
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-black"
                >
                  <option value="" className="text-black">All Levels</option>
                  <option value={1} className="text-black">Level 1 (Root)</option>
                  <option value={2} className="text-black">Level 2 (Category)</option>
                  <option value={3} className="text-black">Level 3 (Subcategory)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Collections Table */}
          <div className="bg-white rounded-lg shadow-sm border border-black overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto"></div>
                <p className="mt-6 text-black font-medium">Loading collections...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-black">
                  <thead className="bg-black">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Collection Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Level
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Parent Collection
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Products
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-black">
                    {filteredCollections.map((collection) => (
                      <tr key={collection.id} className="hover:bg-black-25 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-semibold text-black">{collection.name}</div>
                            {collection.description && (
                              <div className="text-sm text-black truncate max-w-xs mt-1">
                                {collection.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelBadgeColor(collection.level)}`}>
                            Level {collection.level}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                          {getParentCollectionName(collection.parentCollectionId || null)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                            collection.published
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}>
                            {collection.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-black">
                          {collection.products?.length || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {new Date(collection.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditCollection(collection)}
                            className="text-black hover:text-black mr-4 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCollection(collection.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredCollections.length === 0 && (
                  <div className="p-12 text-center">
                    <div className="text-black mb-2">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <p className="text-black font-medium">No collections found matching your criteria.</p>
                    <p className="text-black text-sm mt-1">Try adjusting your search or filters.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Collection Modal */}
        {isModalOpen && (
          <CollectionModal
            collection={editingCollection}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
          />
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
