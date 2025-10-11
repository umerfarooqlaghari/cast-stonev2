/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import { productVariantService } from '@/services';
import { ProductVariant, CreateProductVariantRequest, UpdateProductVariantRequest } from '@/services/types/entities';
import { cloudinaryService, CloudinaryImageInfo } from '@/services/api/cloudinary/cloudinaryService';

interface ProductVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  variant?: ProductVariant | null;
  productId: number;
}

export default function ProductVariantModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  variant, 
  productId 
}: ProductVariantModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [uploadedImages, setUploadedImages] = useState<CloudinaryImageInfo[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const [formData, setFormData] = useState({
    productCode: '',
    variantName: '',
    variantIdentity: '',
    variantDescription: '',
    variantPrice: 0,
    variantWholesalePrice: 0,
    variantTags: [] as string[],
    variantImages: [] as string[],
  });

  useEffect(() => {
    if (variant) {
      setFormData({
        productCode: variant.productCode || '',
        variantName: variant.variantName || '',
        variantIdentity: variant.variantIdentity || '',
        variantDescription: variant.variantDescription || '',
        variantPrice: variant.variantPrice,
        variantWholesalePrice: variant.variantWholesalePrice || 0,
        variantTags: variant.variantTags || [],
        variantImages: variant.variantImages || [],
      });
    } else {
      setFormData({
        productCode: '',
        variantName: '',
        variantIdentity: '',
        variantDescription: '',
        variantPrice: 0,
        variantWholesalePrice: 0,
        variantTags: [],
        variantImages: [],
      });
    }
    setErrors({});
  }, [variant]);

  useEffect(() => {
    fetchUploadedImages();
  }, []);

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

  const handleAddImage = async () => {
    if (imageInput.trim() && !formData.variantImages.includes(imageInput.trim())) {
      const isValidUrl = await validateImageUrl(imageInput.trim());
      if (isValidUrl) {
        setFormData(prev => ({
          ...prev,
          variantImages: [...prev.variantImages, imageInput.trim()]
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
    if (!formData.variantImages.includes(imageUrl)) {
      setFormData(prev => ({
        ...prev,
        variantImages: [...prev.variantImages, imageUrl]
      }));
    }
  };

  const handleDirectImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress('Validating files...');

    try {
      const validation = cloudinaryService.validateImageFiles(files);
      if (!validation.isValid) {
        setErrors(prev => ({
          ...prev,
          directUpload: validation.errors.join(', ')
        }));
        return;
      }

      setUploadProgress('Uploading images...');
      const result = await cloudinaryService.uploadImages(files);

      const successfulUploads = result.results
        .filter(r => r.success && r.secureUrl)
        .map(r => r.secureUrl!);

      if (successfulUploads.length > 0) {
        setFormData(prev => ({
          ...prev,
          variantImages: [...prev.variantImages, ...successfulUploads]
        }));
        await fetchUploadedImages();
      }

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

  const validateImageUrl = async (url: string): Promise<boolean> => {
    const existsInUploaded = uploadedImages.some(img => img.secureUrl === url);
    if (existsInUploaded) return true;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      setTimeout(() => resolve(false), 5000);
    });
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      variantImages: prev.variantImages.filter(image => image !== imageToRemove)
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Price') ? parseFloat(value) || 0 : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.variantTags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        variantTags: [...prev.variantTags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      variantTags: prev.variantTags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.variantPrice <= 0) {
      newErrors.variantPrice = 'Variant price must be greater than 0';
    }

    if (formData.variantWholesalePrice && formData.variantWholesalePrice < 0) {
      newErrors.variantWholesalePrice = 'Wholesale price cannot be negative';
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
      if (variant) {
        // Update existing variant
        const updateRequest: UpdateProductVariantRequest = {
          productCode: formData.productCode || undefined,
          variantName: formData.variantName || undefined,
          variantIdentity: formData.variantIdentity || undefined,
          variantDescription: formData.variantDescription || undefined,
          variantPrice: formData.variantPrice,
          variantWholesalePrice: formData.variantWholesalePrice || undefined,
          variantTags: formData.variantTags,
          variantImages: formData.variantImages,
        };
        await productVariantService.update.update(variant.id, updateRequest);
      } else {
        // Create new variant
        const createRequest: CreateProductVariantRequest = {
          productId: productId,
          productCode: formData.productCode || undefined,
          variantName: formData.variantName || undefined,
          variantIdentity: formData.variantIdentity || undefined,
          variantDescription: formData.variantDescription || undefined,
          variantPrice: formData.variantPrice,
          variantWholesalePrice: formData.variantWholesalePrice || undefined,
          variantTags: formData.variantTags,
          variantImages: formData.variantImages,
        };
        await productVariantService.create.create(createRequest);
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving variant:', error);
      if (error.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: string) => {
          apiErrors.general = err;
        });
        setErrors(apiErrors);
      } else {
        setErrors({ general: 'An error occurred while saving the variant. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {variant ? 'Edit Product Variant' : 'Add Product Variant'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          {/* Product Code */}
          <div>
            <label htmlFor="productCode" className="block text-sm font-medium text-gray-700 mb-1">
              Product Code
            </label>
            <input
              type="text"
              id="productCode"
              name="productCode"
              value={formData.productCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., VAR-001"
            />
          </div>

          {/* Variant Name */}
          <div>
            <label htmlFor="variantName" className="block text-sm font-medium text-gray-700 mb-1">
              Variant Name
            </label>
            <input
              type="text"
              id="variantName"
              name="variantName"
              value={formData.variantName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Large Size"
            />
          </div>

          {/* Variant Identity */}
          <div>
            <label htmlFor="variantIdentity" className="block text-sm font-medium text-gray-700 mb-1">
              Variant Identity
            </label>
            <input
              type="text"
              id="variantIdentity"
              name="variantIdentity"
              value={formData.variantIdentity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Size: Large, Color: Blue"
            />
          </div>

          {/* Variant Description */}
          <div>
            <label htmlFor="variantDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Variant Description
            </label>
            <textarea
              id="variantDescription"
              name="variantDescription"
              value={formData.variantDescription}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe this variant..."
            />
          </div>

          {/* Variant Price */}
          <div>
            <label htmlFor="variantPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Variant Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="variantPrice"
              name="variantPrice"
              value={formData.variantPrice}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              required
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.variantPrice ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.variantPrice && (
              <p className="mt-1 text-sm text-red-600">{errors.variantPrice}</p>
            )}
          </div>

          {/* Variant Wholesale Price */}
          <div>
            <label htmlFor="variantWholesalePrice" className="block text-sm font-medium text-gray-700 mb-1">
              Variant Wholesale Price
            </label>
            <input
              type="number"
              id="variantWholesalePrice"
              name="variantWholesalePrice"
              value={formData.variantWholesalePrice}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.variantWholesalePrice ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.variantWholesalePrice && (
              <p className="mt-1 text-sm text-red-600">{errors.variantWholesalePrice}</p>
            )}
          </div>

          {/* Variant Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Variant Tags
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
              {formData.variantTags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Variant Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Variant Images
            </label>

            {/* Current Images */}
            <div className="mb-3 flex flex-wrap gap-2">
              {formData.variantImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Variant ${index + 1}`}
                    className="w-20 h-20 object-cover rounded border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Choose from uploaded images */}
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
                    if (errors.imageInput) {
                      setErrors(prev => ({ ...prev, imageInput: '' }));
                    }
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                  className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.imageInput ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Paste image URL here"
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
            </div>

            {/* Direct Image Upload */}
            <div className="border-t pt-3">
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
                  Select multiple images to upload them directly. Supported formats: JPEG, PNG, GIF, WebP (max 10MB each)
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                variant ? 'Update Variant' : 'Create Variant'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

