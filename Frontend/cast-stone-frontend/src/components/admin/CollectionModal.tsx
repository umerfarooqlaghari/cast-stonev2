/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import { collectionService } from '@/services';
import { Collection, CreateCollectionRequest, UpdateCollectionRequest } from '@/services/types/entities';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { cloudinaryService, CloudinaryImageInfo } from '@/services/api/cloudinary/cloudinaryService';

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
  const [uploadedImages, setUploadedImages] = useState<CloudinaryImageInfo[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 1,
    parentCollectionId: null as number | null,
    childCollectionIds: [] as number[],
    tags: [] as string[],
    images: [] as string[],
    published: false,
  });

  const [tagInput, setTagInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    fetchAllCollections();
    fetchUploadedImages();

    if (collection) {
      setFormData({
        name: collection.name,
        description: collection.description || '',
        level: collection.level,
        parentCollectionId: collection.parentCollectionId || null,
        childCollectionIds: collection.childCollectionIds || [],
        tags: collection.tags || [],
        images: collection.images || [],
        published: collection.published,
      });
    }
  }, [collection]);

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
          parentCollectionId: formData.parentCollectionId ?? undefined,
          childCollectionIds: formData.childCollectionIds,
          updatedBy: admin?.email || 'admin',
        };
        await collectionService.update.update(collection.id, updateData);
      } else {
        // Create new collection
        const createData: CreateCollectionRequest = {
          ...formData,
          parentCollectionId: formData.parentCollectionId ?? undefined,
          childCollectionIds: formData.childCollectionIds,
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

  const handleAddImage = async () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      // Validate if the URL exists in uploaded images or is a valid URL
      const isValidUrl = await validateImageUrl(imageInput.trim());
      if (isValidUrl) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, imageInput.trim()]
        }));
        setImageInput('');
        setErrors(prev => ({ ...prev, imageInput: '' }));
      } else {
        setErrors(prev => ({
          ...prev,
          imageInput: 'Invalid image URL or image not found in uploaded images'
        }));
      }
    }
  };

  const handleAddImageFromDropdown = (imageUrl: string) => {
    if (!formData.images.includes(imageUrl)) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
    }
  };

  const handleDirectImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress('Validating files...');

    try {
      // Validate files first
      const validation = cloudinaryService.validateImageFiles(files);
      if (!validation.isValid) {
        setErrors(prev => ({
          ...prev,
          directUpload: validation.errors.join(', ')
        }));
        return;
      }

      setUploadProgress('Uploading images...');

      // Upload files
      const result = await cloudinaryService.uploadImages(files);

      // Add successful uploads to the form
      const successfulUploads = result.results
        .filter(r => r.success && r.secureUrl)
        .map(r => r.secureUrl!);

      if (successfulUploads.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...successfulUploads]
        }));

        // Refresh the uploaded images list
        await fetchUploadedImages();
      }

      // Show results
      if (result.summary.failureCount > 0) {
        const failedFiles = result.results
          .filter(r => !r.success)
          .map(r => `${r.fileName}: ${r.errorMessage}`)
          .join(', ');
        setErrors(prev => ({
          ...prev,
          directUpload: `Some uploads failed: ${failedFiles}`
        }));
      } else {
        setErrors(prev => ({ ...prev, directUpload: '' }));
      }

      setUploadProgress(`Upload complete: ${result.summary.successCount} successful, ${result.summary.failureCount} failed`);

      // Clear progress after 3 seconds
      setTimeout(() => setUploadProgress(''), 3000);

    } catch (error) {
      console.error('Upload error:', error);
      setErrors(prev => ({
        ...prev,
        directUpload: error instanceof Error ? error.message : 'Upload failed'
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(image => image !== imageToRemove)
    }));
  };

  const validateImageUrl = async (url: string): Promise<boolean> => {
    // Check if URL exists in uploaded images
    const existsInUploaded = uploadedImages.some(img => img.secureUrl === url);
    if (existsInUploaded) return true;

    // Check if it's a valid image URL by trying to load it
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;

      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000);
    });
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
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 border border-black w-full max-w-3xl shadow-xl rounded-lg bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-black">
            {collection ? 'Edit Collection' : 'Add New Collection'}
          </h3>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-black mb-2">
              Collection Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-400 ${
                errors.name ? 'border-red-500' : 'border-black'
              }`}
              placeholder="Enter collection name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-black mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-400 ${
                errors.description ? 'border-red-500' : 'border-black'
              }`}
              placeholder="Enter collection description"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Level */}
          <div>
            <label htmlFor="level" className="block text-sm font-semibold text-black mb-2">
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
                  childCollectionIds: newLevel === 3 ? [] : prev.childCollectionIds
                }));
              }}
              className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
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
                <label htmlFor="parentCollection" className="block text-sm font-semibold text-black mb-2">
                  Parent Collection *
                </label>
                <select
                  id="parentCollection"
                  value={formData.parentCollectionId || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    parentCollectionId: e.target.value ? Number(e.target.value) : null
                  }))}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                    errors.parentCollectionId ? 'border-red-500' : 'border-black'
                  }`}
                >
                  <option value="" className="text-gray-600">Select parent collection</option>
                  {getAvailableParentCollections().map(parentCollection => (
                    <option key={parentCollection.id} value={parentCollection.id} className="text-black">
                      {parentCollection.name} (Level {parentCollection.level})
                    </option>
                  ))}
                </select>
                {errors.parentCollectionId && <p className="mt-1 text-sm text-red-600">{errors.parentCollectionId}</p>}
              </div>
            )}

            {/* Child Collections */}
            {formData.level < 3 && (
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Child Collections (Optional)
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-black rounded-lg p-3">
                  {getAvailableChildCollections().length === 0 ? (
                    <p className="text-gray-600 text-sm">No available child collections</p>
                  ) : (
                    getAvailableChildCollections().map(childCollection => (
                      <label key={childCollection.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.childCollectionIds.includes(childCollection.id)}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              childCollectionIds: e.target.checked
                                ? [...prev.childCollectionIds, childCollection.id]
                                : prev.childCollectionIds.filter(id => id !== childCollection.id)
                            }));
                          }}
                          className="rounded border-black text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-black text-sm">
                          {childCollection.name} (Level {childCollection.level})
                        </span>
                      </label>
                    ))
                  )}
                </div>
                <p className="mt-1 text-xs text-black">
                  Select multiple child collections to link to this collection
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
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
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-3 border border-black rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-400"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-6 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Images
            </label>
            <div className="space-y-3 mb-4">
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border">
                  <img
                    src={image}
                    alt={`Collection image ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-md border border-gray-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjI4IiBjeT0iMjgiIHI9IjMiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwIDM2TDI4IDI4TDM2IDM2TDQ0IDI4VjQ0SDIwVjM2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Image {index + 1}</p>
                    <p className="text-xs text-gray-500 truncate" title={image}>{image}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image)}
                    className="flex-shrink-0 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    title="Remove image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Uploaded Images Dropdown */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Choose from uploaded images:
              </label>
              <select
                onChange={(e) => e.target.value && handleAddImageFromDropdown(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

            {/* Manual URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Or enter image URL manually:
              </label>
              <div className="flex">
                <input
                  type="url"
                  value={imageInput}
                  onChange={(e) => {
                    setImageInput(e.target.value);
                    // Clear error when user starts typing
                    if (errors.imageInput) {
                      setErrors(prev => ({ ...prev, imageInput: '' }));
                    }
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                  className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.imageInput ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Paste image URL here or copy from Images section"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={!imageInput.trim()}
                >
                  Add
                </button>
              </div>
              {errors.imageInput && (
                <p className="mt-1 text-sm text-red-600">{errors.imageInput}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Tip: You can copy image URLs from the <a href="/admin/dashboard/images" target="_blank" className="text-blue-600 hover:text-blue-800">Images section</a>
              </p>
            </div>

            {/* Direct Image Upload */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Or upload new images directly:
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleDirectImageUpload(e.target.files)}
                  disabled={isUploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />

                {isUploading && (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-600">{uploadProgress}</span>
                  </div>
                )}

                {uploadProgress && !isUploading && (
                  <p className="text-sm text-green-600">{uploadProgress}</p>
                )}

                {errors.directUpload && (
                  <p className="text-sm text-red-600">{errors.directUpload}</p>
                )}

                <p className="text-xs text-gray-500">
                  Select multiple images to upload them directly to this collection. Supported formats: JPEG, PNG, GIF, WebP (max 10MB each)
                </p>
              </div>
            </div>
          </div>

          {/* Published */}
          <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
            />
            <label htmlFor="published" className="ml-3 block text-sm font-medium text-black">
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
          <div className="flex justify-end space-x-4 pt-6 border-t border-black">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-black rounded-lg text-black hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
            >
              {isSubmitting ? 'Saving...' : (collection ? 'Update Collection' : 'Create Collection')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
