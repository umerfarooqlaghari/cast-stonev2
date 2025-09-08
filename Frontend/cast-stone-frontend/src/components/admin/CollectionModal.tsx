/* eslint-disable @typescript-eslint/no-unused-vars */
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

    // Dynamic content fields (all optional)
    elegantHeader: '' as string | null,
    elegantDescription: '' as string | null,
    section3Header: '' as string | null,
    section3Content: '' as string | null,
    section3Image: '' as string | null,
    section4Header: '' as string | null,
    section4Content: '' as string | null,
    section4Image: '' as string | null,
    collageImageSection: [] as string[] | null,
    staticContentHeader: '' as string | null,
    staticContentParagraph1: '' as string | null,
    staticContentParagraph2: '' as string | null,
    staticContentParagraph3: '' as string | null,
    staticContentBackgroundImage: '' as string | null,

    published: false,
  });

  const [tagInput, setTagInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [availableImages, setAvailableImages] = useState<string[]>([]);

  useEffect(() => {
    fetchAllCollections();
    fetchUploadedImages();

    const prefill = (c: Collection) => {
      setFormData({
        name: c.name,
        description: c.description || '',
        level: c.level,
        parentCollectionId: c.parentCollectionId || null,
        childCollectionIds: c.childCollectionIds || [],
        tags: c.tags || [],
        images: c.images || [],
        elegantHeader: c.elegantHeader || '',
        elegantDescription: c.elegantDescription || '',
        section3Header: c.section3Header || '',
        section3Content: c.section3Content || '',
        section3Image: c.section3Image || '',
        section4Header: c.section4Header || '',
        section4Content: c.section4Content || '',
        section4Image: c.section4Image || '',
        collageImageSection: c.collageImageSection || [],
        staticContentHeader: c.staticContentHeader || '',
        staticContentParagraph1: c.staticContentParagraph1 || '',
        staticContentParagraph2: c.staticContentParagraph2 || '',
        staticContentParagraph3: c.staticContentParagraph3 || '',
        staticContentBackgroundImage: c.staticContentBackgroundImage || '',
        published: c.published,
      });
    };

    if (collection) {
      // Fetch the latest copy to ensure fields are up-to-date when reopening
      (async () => {
        try {
          const fresh = await collectionService.get.getById(collection.id);
          prefill(fresh);
        } catch {
          prefill(collection);
        }
      })();
    }
  }, [collection]);

  const fetchUploadedImages = async () => {
    try {
      setIsLoadingImages(true);
      const images = await cloudinaryService.getAllImages();
      setUploadedImages(images);
      // Convert to URLs for availableImages
      setAvailableImages(images.map(img => img.secureUrl));
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

  const handleRemoveCollageImage = (url: string) => {
    setFormData(prev => ({
      ...prev,
      collageImageSection: (prev.collageImageSection || []).filter(u => u !== url)
    }));
  };

  const handleStaticBackgroundUpload = async (file: File | null) => {
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress('Uploading static background image...');

      const result = await cloudinaryService.uploadImage(file);

      if (result.imageUrl) {
        setFormData(prev => ({
          ...prev,
          staticContentBackgroundImage: result.imageUrl
        }));

        // Refresh the uploaded images list
        await fetchUploadedImages();
        setUploadProgress('Static background image uploaded successfully!');

        // Clear progress after 3 seconds
        setTimeout(() => setUploadProgress(''), 3000);
      }

      setErrors(prev => ({ ...prev, staticContentBackgroundImage: '' }));
    } catch (error) {
      console.error('Static background upload error:', error);
      setErrors(prev => ({
        ...prev,
        staticContentBackgroundImage: error instanceof Error ? error.message : 'Upload failed'
      }));
    } finally {
      setIsUploading(false);
    }
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

  const uploadDynamicImage = async (
    key: 'section3Image' | 'section4Image',
    files: FileList | null
  ) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const validation = cloudinaryService.validateImageFile(file);
    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, [key]: validation.error || 'Invalid file' }));
      return;
    }
    try {
      setIsUploading(true);
      setUploadProgress('Uploading image...');
      const res = await cloudinaryService.uploadImage(file);
      if (res.imageUrl) {
        setFormData(prev => ({ ...prev, [key]: res.imageUrl }));
        await fetchUploadedImages();
      }
      setErrors(prev => ({ ...prev, [key]: '' }));
    } catch (e) {
      setErrors(prev => ({ ...prev, [key]: 'Upload failed' }));
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const uploadCollageImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadProgress('Uploading collage images...');
    try {
      const result = await cloudinaryService.uploadImages(files);
      const urls = result.results.filter(r => r.success && r.secureUrl).map(r => r.secureUrl!)
      if (urls.length > 0) {
        setFormData(prev => ({
          ...prev,
          collageImageSection: [...(prev.collageImageSection || []), ...urls]
        }));
      }
      await fetchUploadedImages();
    } catch {
      setErrors(prev => ({ ...prev, collageImageSection: 'Upload failed' }));
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
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

  // Helper functions for tags and images
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const addImage = () => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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
            {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level}</p>}
            <p className="mt-1 text-xs text-gray-600">
              Level 1: Root collections, Level 2: Must have Level 1 parent, Level 3: Must have Level 2 parent
            </p>
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
            <label htmlFor="tags" className="block text-sm font-semibold text-black mb-2">
              Tags
            </label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black placeholder-gray-400"
                  placeholder="Enter a tag and press Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-600">
              Add tags to help categorize and search for this collection
            </p>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Images
            </label>

            {/* Selected Images Display */}
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
                    onClick={() => removeImage(index)}
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

            {/* Choose from uploaded images dropdown */}
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
            <div className="mb-3">
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
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                  className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.imageInput ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Paste image URL here or copy from Images section"
                />
                <button
                  type="button"
                  onClick={addImage}
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

            {/* Direct Image Upload */}



	          {/* Dynamic Content Fields */}
	          <div className="border-t pt-6 space-y-6">
	            <h4 className="text-lg font-semibold text-black">Dynamic Content</h4>

	            {/* Elegant Section (always visible) */}
	            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
	              <div>
	                <label className="block text-sm font-semibold text-black mb-2">Elegant Header</label>
	                <input type="text" value={formData.elegantHeader || ''} onChange={(e)=>setFormData(p=>({...p,elegantHeader:e.target.value}))}
	                  className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black" />
	              </div>
	              <div>
	                <label className="block text-sm font-semibold text-black mb-2">Elegant Description</label>
	                <textarea value={formData.elegantDescription || ''} onChange={(e)=>setFormData(p=>({...p,elegantDescription:e.target.value}))} rows={3}
	                  className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black" />
	              </div>
	            </div>

	            {/* Section 3 (Level 3 only) */}
	            {formData.level === 3 && (
	              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
	                <div>
	                  <label className="block text-sm font-semibold text-black mb-2">Choose Your Style Header</label>
	                  <input type="text" value={formData.section3Header || ''} onChange={(e)=>setFormData(p=>({...p,section3Header:e.target.value}))}
	                    className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black" />
	                </div>
	                <div>
	                  <label className="block text-sm font-semibold text-black mb-2">Choose Your Style Content</label>
	                  <textarea value={formData.section3Content || ''} onChange={(e)=>setFormData(p=>({...p,section3Content:e.target.value}))} rows={3}
	                    className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black" />
	                </div>
	                <div className="md:col-span-2">
	                  <label className="block text-sm font-semibold text-black mb-2">Choose Your Style Image URL</label>
	                  <input type="url" value={formData.section3Image || ''} onChange={(e)=>setFormData(p=>({...p,section3Image:e.target.value}))}
	                    className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black" />
	                </div>
	                <div className="mt-2 md:col-span-2">
	                  <label className="block text-sm font-medium text-gray-600 mb-1">Choose from uploaded images:</label>
	                  <select
	                    onChange={(e)=> e.target.value && setFormData(p=>({...p, section3Image: e.target.value}))}
	                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
	                    value=""
	                  >
	                    <option value="">Select an uploaded image</option>
	                    {uploadedImages.map(img => (
	                      <option key={img.publicId} value={img.secureUrl}>{img.fileName}</option>
	                    ))}
	                  </select>

	                  <div className="mt-3">
	                    <label className="block text-sm font-medium text-gray-600 mb-1">Or upload a new Section 3 image:</label>
	                    <input type="file" accept="image/*" onChange={(e)=> uploadDynamicImage('section3Image', e.target.files)} disabled={isUploading}
	                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50" />
	                    {errors.section3Image && <p className="text-sm text-red-600 mt-1">{errors.section3Image}</p>}
	                  </div>
	                  {formData.section3Image && (
	                    <div className="mt-2 flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border">
	                      <img src={formData.section3Image} alt="Section 3" className="w-16 h-16 object-cover rounded-md border" />
	                      <div className="flex-1 min-w-0">
	                        <p className="text-sm text-gray-600 truncate">{formData.section3Image}</p>
	                      </div>
	                      <button type="button" onClick={() => setFormData(p=>({...p, section3Image: ''}))} className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded" title="Remove">
	                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
	                      </button>
	                    </div>
	                  )}

	                </div>
	              </div>
	            )}

	            {/* Section 4 (Level 3 only) */}
	            {formData.level === 3 && (
	              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
	                <div>
	                  <label className="block text-sm font-semibold text-black mb-2">Excellence Header</label>
	                  <input type="text" value={formData.section4Header || ''} onChange={(e)=>setFormData(p=>({...p,section4Header:e.target.value}))}
	                    className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black" />
	                </div>
	                <div>
	                  <label className="block text-sm font-semibold text-black mb-2">Excellence Content</label>
	                  <textarea value={formData.section4Content || ''} onChange={(e)=>setFormData(p=>({...p,section4Content:e.target.value}))} rows={3}
	                    className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black" />
	                </div>
	                <div className="md:col-span-2">
	                  <label className="block text-sm font-semibold text-black mb-2">Excellence Image URL</label>
	                  <input type="url" value={formData.section4Image || ''} onChange={(e)=>setFormData(p=>({...p,section4Image:e.target.value}))}
	                    className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black" />
	                </div>
	                <div className="md:col-span-2">
	                  <div className="mt-2">
	                    <label className="block text-sm font-medium text-gray-600 mb-1">Choose from uploaded images:</label>
	                    <select
	                      onChange={(e)=> e.target.value && setFormData(p=>({...p, section4Image: e.target.value}))}
	                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
	                      value=""
	                    >
	                      <option value="">Select an uploaded image</option>
	                      {uploadedImages.map(img => (
	                        <option key={img.publicId} value={img.secureUrl}>{img.fileName}</option>
	                      ))}
	                    </select>
	                  </div>

	                  <div className="mt-3">
	                    <label className="block text-sm font-medium text-gray-600 mb-1">Or upload a new Section 4 image:</label>
	                    <input type="file" accept="image/*" onChange={(e)=> uploadDynamicImage('section4Image', e.target.files)} disabled={isUploading}
	                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50" />
	                    {errors.section4Image && <p className="text-sm text-red-600 mt-1">{errors.section4Image}</p>}
	                  </div>
	                  {formData.section4Image && (
	                    <div className="mt-2 flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border">
	                      <img src={formData.section4Image} alt="Section 4" className="w-16 h-16 object-cover rounded-md border" />
	                      <div className="flex-1 min-w-0">
	                        <p className="text-sm text-gray-600 truncate">{formData.section4Image}</p>
	                      </div>
	                      <button type="button" onClick={() => setFormData(p=>({...p, section4Image: ''}))} className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded" title="Remove">
	                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
	                      </button>
	                    </div>
	                  )}

	                </div>
	              </div>
	            )}

	            {/* Collage Images (Level 3 only) */}
	            {formData.level === 3 && (
	              <div>
	                <label className="block text-sm font-semibold text-black mb-2">Collage Images (comma separated URLs)</label>
	                <input type="text" value={(formData.collageImageSection || []).join(', ')} onChange={(e)=>setFormData(p=>({...p,collageImageSection:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)}))}
	                  className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black" />

					<div className="mt-2 space-y-2">
					  <label className="block text-sm font-medium text-gray-600">Upload Collage Images (Level 3 only)</label>
					  <input type="file" accept="image/*" multiple onChange={(e)=> uploadCollageImages(e.target.files)} disabled={isUploading}
					    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50" />
					  {errors.collageImageSection && <p className="text-sm text-red-600">{errors.collageImageSection}</p>}
					  {(formData.collageImageSection || []).length > 0 && (
					    <div className="grid grid-cols-2 gap-2 mt-2">
					      {(formData.collageImageSection || []).map((url, idx) => (
					        <div key={idx} className="flex items-center space-x-2 bg-gray-50 p-2 rounded border">
					          <img src={url} alt={`Collage ${idx+1}`} className="w-14 h-14 object-cover rounded border" />
					          <button type="button" onClick={() => handleRemoveCollageImage(url)} className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded" title="Remove">
					            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
					          </button>
					        </div>
					      ))}
					    </div>
					  )}
					</div>

	              </div>
	            )}

	            {/* Level 2+ Static Content (hide for Level 1) */}
	            {formData.level >= 2 && (
	              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
	                <div>
	                  <label className="block text-sm font-semibold text-black mb-2">Static Content Header</label>
	                  <input type="text" value={formData.staticContentHeader || ''} onChange={(e)=>setFormData(p=>({...p,staticContentHeader:e.target.value}))}
	                    className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black" />
	                </div>
	                <div>
	                  <label className="block text-sm font-semibold text-black mb-2">Static Paragraph 1</label>
	                  <textarea value={formData.staticContentParagraph1 || ''} onChange={(e)=>setFormData(p=>({...p,staticContentParagraph1:e.target.value}))} rows={3}
	                    className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black" />
	                </div>
	                <div>
	                  <label className="block text-sm font-semibold text-black mb-2">Static Paragraph 2</label>
	                  <textarea value={formData.staticContentParagraph2 || ''} onChange={(e)=>setFormData(p=>({...p,staticContentParagraph2:e.target.value}))} rows={3}
	                    className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black" />
	                </div>
	                <div>
	                  <label className="block text-sm font-semibold text-black mb-2">Static Paragraph 3</label>
	                  <textarea value={formData.staticContentParagraph3 || ''} onChange={(e)=>setFormData(p=>({...p,staticContentParagraph3:e.target.value}))} rows={3}
	                    className="w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black" />
	                </div>
	                <div>
	                  <label className="block text-sm font-semibold text-black mb-2">Static Content Background Image</label>

	                  {/* Current Image Preview */}
	                  {formData.staticContentBackgroundImage && (
	                    <div className="mb-3">
	                      <img
	                        src={formData.staticContentBackgroundImage}
	                        alt="Static content background preview"
	                        className="w-32 h-20 object-cover rounded border"
	                      />
	                      <button
	                        type="button"
	                        onClick={() => setFormData(p => ({...p, staticContentBackgroundImage: ''}))}
	                        className="ml-2 text-sm text-red-600 hover:text-red-800"
	                      >
	                        Remove
	                      </button>
	                    </div>
	                  )}

	                  {/* Upload New Image */}
	                  <div className="space-y-3">
	                    <div>
	                      <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Background Image</label>
	                      <input
	                        type="file"
	                        accept="image/*"
	                        onChange={(e) => handleStaticBackgroundUpload(e.target.files?.[0] || null)}
	                        disabled={isUploading}
	                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
	                      />

	                      {/* Upload Progress and Errors */}
	                      {isUploading && (
	                        <div className="flex items-center space-x-2 mt-2">
	                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
	                          <span className="text-sm text-gray-600">{uploadProgress}</span>
	                        </div>
	                      )}

	                      {uploadProgress && !isUploading && (
	                        <p className="text-sm text-green-600 mt-2">{uploadProgress}</p>
	                      )}

	                      {errors.staticContentBackgroundImage && (
	                        <p className="text-sm text-red-600 mt-2">{errors.staticContentBackgroundImage}</p>
	                      )}
	                    </div>

	                    {/* OR Divider */}
	                    <div className="flex items-center">
	                      <div className="flex-grow border-t border-gray-300"></div>
	                      <span className="px-3 text-sm text-gray-500">OR</span>
	                      <div className="flex-grow border-t border-gray-300"></div>
	                    </div>

	                    {/* Select from Existing Images */}
	                    <div>
	                      <label className="block text-sm font-medium text-gray-700 mb-1">Select from Uploaded Images</label>
	                      <select
	                        onChange={(e) => e.target.value && setFormData(p => ({...p, staticContentBackgroundImage: e.target.value}))}
	                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
	                        value=""
	                      >
	                        <option value="">Select an uploaded image</option>
	                        {uploadedImages.map(img => (
	                          <option key={img.publicId} value={img.secureUrl}>{img.fileName}</option>
	                        ))}
	                      </select>
	                      {uploadedImages.length === 0 && !isLoadingImages && (
	                        <p className="text-sm text-gray-500 mt-1">
	                          No uploaded images found. <a href="/admin/dashboard/images" target="_blank" className="text-blue-600 hover:text-blue-800">Upload images here</a>
	                        </p>
	                      )}
	                    </div>

	                    {/* OR Divider */}
	                    <div className="flex items-center">
	                      <div className="flex-grow border-t border-gray-300"></div>
	                      <span className="px-3 text-sm text-gray-500">OR</span>
	                      <div className="flex-grow border-t border-gray-300"></div>
	                    </div>

	                    {/* Manual URL Input */}
	                    <div>
	                      <label className="block text-sm font-medium text-gray-700 mb-1">Enter Image URL</label>
	                      <input
	                        type="text"
	                        value={formData.staticContentBackgroundImage || ''}
	                        onChange={(e) => setFormData(p => ({...p, staticContentBackgroundImage: e.target.value}))}
	                        placeholder="https://example.com/image.jpg"
	                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
	                      />
	                    </div>

	                    {/* Helper Text */}
	                    <p className="text-xs text-gray-500 mt-3">
	                      This image will be used as the full-scale background for the static content section on collection pages.
	                      The static content text will appear in a box overlay on the top-left corner.
	                    </p>
	                  </div>
	                </div>
	              </div>
	            )}
	          </div>

          {/* {formData.level >= 2 && (
            <div className="mt-4">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Upload Main Images (Level 2+ only)</label>
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
          )} */}

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
