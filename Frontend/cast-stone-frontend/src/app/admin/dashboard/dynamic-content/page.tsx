'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { collectionService } from '@/services';
import { Collection } from '@/services/types/entities';
import CollectionModal from '@/components/admin/CollectionModal';

export default function DynamicContentPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await collectionService.get.getAll();
        setCollections(data);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-black-200">
            <div>
              <h1 className="text-3xl font-bold text-black">Dynamic Content</h1>
              <p className="text-black mt-1">Edit section text and images for each collection</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-black overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center">Loading...</div>
            ) : (
              <div className="divide-y divide-black">
                {collections.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-4">
                    <div>
                      <div className="text-black font-semibold">{c.name}</div>
                      <div className="text-sm text-black">Level {c.level}</div>
                    </div>
                    <button
                      onClick={() => { setEditingCollection(c); setIsModalOpen(true); }}
                      className="px-4 py-2 bg-black text-white rounded-md"
                    >
                      Edit Content
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {isModalOpen && (
            <CollectionModal
              collection={editingCollection}
              onClose={() => { setIsModalOpen(false); setEditingCollection(null); }}
              onSuccess={() => { setIsModalOpen(false); setEditingCollection(null); }}
            />
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}

