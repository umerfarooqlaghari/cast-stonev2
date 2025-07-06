'use client';

import React, { useState, useEffect } from 'react';
import { collectionService } from '@/services';
import { Collection, CreateCollectionRequest, UpdateCollectionRequest } from '@/services/types/entities';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface CollectionModalProps {
  collection?: Collection | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CollectionModal({ collection, onClose, onSuccess }: CollectionModalProps) {
  const { admin } = useAdminAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 1,
    parentCollectionId: null as number | null,
    childCollectionId: null as number | null,
    tags: [] as string[],
    published: false,
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchAllCollections();
    
    if (collection) {
      setFormData({
        name: collection.name,
        description: collection.description || '',
        level: collection.level,
        parentCollectionId: collection.parentCollectionId || null,
        childCollectionId: collection.childCollectionId || null,
        tags: collection.tags || [],
        published: collection.published,
      });
    }
  }, [collection]);

  const fetchAllCollections = async () => {
    try {
      const collections = await collectionService.get.getAll();
      setAllCollections(collections);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 200) {
      newErrors.name = 'Name must be less than 200 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    // Validate hierarchy rules
    if (formData.level === 1 && formData.parentCollectionId) {
      newErrors.parentCollectionId = 'Level 1 collections cannot have a parent';
    }

    if (formData.level > 1 && !formData.parentCollectionId) {
      newErrors.parentCollectionId = `Level ${formData.level} collections must have a parent`;
    }

    if (formData.parentCollectionId) {
      const parentCollection = allCollections.find(c => c.id === formData.parentCollectionId);
      if (parentCollection) {
        const expectedParentLevel = formData.level - 1;
        if (parentCollection.level !== expectedParentLevel) {
          newErrors.parentCollectionId = `Parent collection must be Level ${expectedParentLevel}`;
        }
      }
    }

    // Prevent circular references
    if (collection && formData.parentCollectionId === collection.id) {
      newErrors.parentCollectionId = 'Collection cannot be its own parent';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (collection) {
        // Update existing collection
        const updateData: UpdateCollectionRequest = {
          ...formData,
          updatedBy: admin?.email || 'admin',
        };
        await collectionService.update.updateById(collection.id, updateData);
      } else {
        // Create new collection
        const createData: CreateCollectionRequest = {
          ...formData,
          createdBy: admin?.email || 'admin',
        };
        await collectionService.post.create(createData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving collection:', error);
      setErrors({ submit: 'Failed to save collection. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getAvailableParentCollections = () => {
    const targetParentLevel = formData.level - 1;
    return allCollections.filter(c =>
      c.level === targetParentLevel &&
      (!collection || c.id !== collection.id) // Exclude self when editing
    );
  };

  const getAvailableChildCollections = () => {
    const targetChildLevel = formData.level + 1;
    return allCollections.filter(c =>
      c.level === targetChildLevel &&
      (!collection || c.id !== collection.id) && // Exclude self when editing
      (!formData.parentCollectionId || c.parentCollectionId === (collection?.id || null)) // Only show children that could belong to this collection
    );
  };

  return (
    <div className="fixed inset-0 bg-amber-900 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border border-amber-200 w-full max-w-3xl shadow-xl rounded-lg bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-amber-900">
            {collection ? 'Edit Collection' : 'Add New Collection'}
          </h3>
          <button
            onClick={onClose}
            className="text-amber-600 hover:text-amber-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-amber-900 mb-2">
              Collection Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 placeholder-amber-400 ${
                errors.name ? 'border-red-500' : 'border-amber-300'
              }`}
              placeholder="Enter collection name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-amber-900 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 placeholder-amber-400 ${
                errors.description ? 'border-red-500' : 'border-amber-300'
              }`}
              placeholder="Enter collection description"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Level */}
          <div>
            <label htmlFor="level" className="block text-sm font-semibold text-amber-900 mb-2">
              Hierarchy Level *
            </label>
            <select
              id="level"
              value={formData.level}
              onChange={(e) => {
                const newLevel = Number(e.target.value);
                setFormData(prev => ({
                  ...prev,
                  level: newLevel,
                  parentCollectionId: newLevel === 1 ? null : prev.parentCollectionId,
                  childCollectionId: newLevel === 3 ? null : prev.childCollectionId
                }));
              }}
              className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900"
            >
              <option value={1}>Level 1 (Root Category)</option>
              <option value={2}>Level 2 (Sub Category)</option>
              <option value={3}>Level 3 (Specific Type)</option>
            </select>
          </div>

          {/* Parent and Child Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Parent Collection */}
            {formData.level > 1 && (
              <div>
                <label htmlFor="parentCollection" className="block text-sm font-semibold text-amber-900 mb-2">
                  Parent Collection *
                </label>
                <select
                  id="parentCollection"
                  value={formData.parentCollectionId || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parentCollectionId: e.target.value ? Number(e.target.value) : null
                  }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 ${
                    errors.parentCollectionId ? 'border-red-500' : 'border-amber-300'
                  }`}
                >
                  <option value="" className="text-amber-600">Select parent collection</option>
                  {getAvailableParentCollections().map(parentCollection => (
                    <option key={parentCollection.id} value={parentCollection.id} className="text-amber-900">
                      {parentCollection.name} (Level {parentCollection.level})
                    </option>
                  ))}
                </select>
                {errors.parentCollectionId && <p className="mt-1 text-sm text-red-600">{errors.parentCollectionId}</p>}
              </div>
            )}

            {/* Child Collection */}
            {formData.level < 3 && (
              <div>
                <label htmlFor="childCollection" className="block text-sm font-semibold text-amber-900 mb-2">
                  Child Collection (Optional)
                </label>
                <select
                  id="childCollection"
                  value={formData.childCollectionId || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    childCollectionId: e.target.value ? Number(e.target.value) : null
                  }))}
                  className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900"
                >
                  <option value="" className="text-amber-600">Select child collection (optional)</option>
                  {getAvailableChildCollections().map(childCollection => (
                    <option key={childCollection.id} value={childCollection.id} className="text-amber-900">
                      {childCollection.name} (Level {childCollection.level})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-amber-700">
                  Link an existing child collection to this collection
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-amber-600 hover:text-amber-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-3 border border-amber-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-amber-900 placeholder-amber-400"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-6 py-3 bg-amber-900 text-white rounded-r-lg hover:bg-amber-800 transition-colors font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Published */}
          <div className="flex items-center p-4 bg-amber-50 rounded-lg border border-amber-200">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-amber-300 rounded"
            />
            <label htmlFor="published" className="ml-3 block text-sm font-medium text-amber-900">
              Published (visible to customers)
            </label>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-amber-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-amber-300 rounded-lg text-amber-800 hover:bg-amber-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-amber-900 text-white rounded-lg hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
            >
              {isSubmitting ? 'Saving...' : (collection ? 'Update Collection' : 'Create Collection')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
