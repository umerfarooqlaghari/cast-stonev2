'use client';

import React, { useState, useEffect } from 'react';
import { productService } from '@/services';
import { Product, Collection, CreateProductRequest, UpdateProductRequest } from '@/services/types/entities';
import { cloudinaryService, CloudinaryImageInfo } from '@/services/api/cloudinary/cloudinaryService';

interface ProductModalProps {
  product?: Product | null;
  collections: Collection[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductModal({ product, collections, onClose, onSuccess }: ProductModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedImages, setUploadedImages] = useState<CloudinaryImageInfo[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    collectionId: 0,
    images: [] as string[],
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        collectionId: product.collectionId,
        images: product.images || [],
        tags: product.tags || [],
      });
    }
    // Fetch uploaded images when modal opens
    fetchUploadedImages();
  }, [product]);

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

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    if (!formData.collectionId) {
      newErrors.collectionId = 'Collection is required';
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
      if (product) {
        // Update existing product
        const updateData: UpdateProductRequest = formData;
        await productService.update.update(product.id, updateData);
      } else {
        // Create new product
        const createData: CreateProductRequest = formData;
        await productService.post.create(createData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
      setErrors({ submit: 'Failed to save product. Please try again.' });
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

  const handleRemoveImage = (imageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(image => image !== imageToRemove)
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter product description"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                id="stock"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
            </div>
          </div>

          {/* Collection */}
          <div>
            <label htmlFor="collection" className="block text-sm font-medium text-gray-700 mb-1">
              Collection *
            </label>
            <select
              id="collection"
              value={formData.collectionId}
              onChange={(e) => setFormData(prev => ({ ...prev, collectionId: parseInt(e.target.value) || 0 }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 ${
                errors.collectionId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value={0}>Select a collection</option>
              {collections.map(collection => (
                <option key={collection.id} value={collection.id}>
                  {collection.name} (Level {collection.level})
                </option>
              ))}
            </select>
            {errors.collectionId && <p className="mt-1 text-sm text-red-600">{errors.collectionId}</p>}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Images
            </label>
            <div className="space-y-3 mb-4">
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg border">
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
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
                  No uploaded images found. <a href="/admin/dashboard/images" target="_blank" className="text-amber-600 hover:text-amber-800">Upload images here</a>
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
                  className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 ${
                    errors.imageInput ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Paste image URL here or copy from Images section"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-amber-900 text-white rounded-r-md hover:bg-amber-800 disabled:opacity-50"
                  disabled={!imageInput.trim()}
                >
                  Add
                </button>
              </div>
              {errors.imageInput && (
                <p className="mt-1 text-sm text-red-600">{errors.imageInput}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Tip: You can copy image URLs from the <a href="/admin/dashboard/images" target="_blank" className="text-amber-600 hover:text-amber-800">Images section</a>
              </p>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-amber-600 hover:text-amber-800"
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-amber-900 text-white rounded-r-md hover:bg-amber-800"
              >
                Add
              </button>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {errors.submit}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-amber-900 text-white rounded-md hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : (product ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
