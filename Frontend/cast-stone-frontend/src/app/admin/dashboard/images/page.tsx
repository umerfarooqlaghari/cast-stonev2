/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';
import { cloudinaryService, CloudinaryImageInfo } from '@/services/api/cloudinary/cloudinaryService';

export default function ImagesPage() {
  const [images, setImages] = useState<CloudinaryImageInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const fetchedImages = await cloudinaryService.getAllImages();
      setImages(fetchedImages);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to load images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleUpload(Array.from(files));
    }
  };

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);
    setUploadProgress([]);

    try {
      // Validate files
      const validationErrors: string[] = [];
      files.forEach((file, index) => {
        const validation = cloudinaryService.validateImageFile(file);
        if (!validation.isValid) {
          validationErrors.push(`File ${index + 1} (${file.name}): ${validation.error}`);
        }
      });

      if (validationErrors.length > 0) {
        setError(validationErrors.join('\n'));
        return;
      }

      // Upload files one by one to show progress
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(prev => [...prev, `Uploading ${file.name}...`]);
        
        try {
          const result = await cloudinaryService.uploadImage(file);
          uploadedUrls.push(result.imageUrl);
          setUploadProgress(prev => 
            prev.map((msg, index) => 
              index === i ? `✓ ${file.name} uploaded successfully` : msg
            )
          );
        } catch (error) {
          setUploadProgress(prev => 
            prev.map((msg, index) => 
              index === i ? `✗ Failed to upload ${file.name}` : msg
            )
          );
        }
      }

      if (uploadedUrls.length > 0) {
        setSuccessMessage(`Successfully uploaded ${uploadedUrls.length} image(s)`);
        await fetchImages(); // Refresh the images list
      }

    } catch (error) {
      console.error('Error uploading images:', error);
      setError('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress([]);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (publicId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await cloudinaryService.deleteImage(publicId);
      setSuccessMessage(`Successfully deleted "${fileName}"`);
      await fetchImages(); // Refresh the images list
    } catch (error) {
      console.error('Error deleting image:', error);
      setError(`Failed to delete "${fileName}". Please try again.`);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setSuccessMessage('Image URL copied to clipboard!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      setError('Failed to copy URL to clipboard');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleUpload(files);
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
            <h1 className="text-2xl font-bold text-amber-900 mb-2">Image Management</h1>
            <p className="text-amber-700">
              Upload and manage images for your products and collections. Images are stored securely in the cloud.
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
            <h2 className="text-xl font-semibold text-amber-900 mb-4">Upload Images</h2>
            
            <div
              className="border-2 border-dashed border-amber-300 rounded-lg p-8 text-center hover:border-amber-400 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="text-amber-600">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg text-amber-800">Drag and drop images here, or</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="mt-2 px-4 py-2 bg-amber-900 text-white rounded-md hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? 'Uploading...' : 'Choose Files'}
                  </button>
                </div>
                <p className="text-sm text-amber-600">
                  Supports JPEG, PNG, GIF, and WebP files up to 10MB each
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Upload Progress */}
            {uploadProgress.length > 0 && (
              <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                <h3 className="font-medium text-amber-900 mb-2">Upload Progress:</h3>
                <div className="space-y-1">
                  {uploadProgress.map((message, index) => (
                    <p key={index} className="text-sm text-amber-700">{message}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 whitespace-pre-line">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Dismiss
              </button>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">{successMessage}</p>
              <button
                onClick={() => setSuccessMessage(null)}
                className="mt-2 text-sm text-green-600 hover:text-green-800"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Images Gallery */}
          <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-amber-900">Uploaded Images ({images.length})</h2>
              <button
                onClick={fetchImages}
                disabled={isLoading}
                className="px-4 py-2 bg-amber-100 text-amber-800 rounded-md hover:bg-amber-200 disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-900"></div>
                <p className="mt-2 text-amber-700">Loading images...</p>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-8 text-amber-600">
                <p>No images uploaded yet. Upload your first image above!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-amber-200">
                  <thead className="bg-amber-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                        File Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                        URL
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                        Uploaded
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-amber-200">
                    {images.map((image) => (
                      <tr key={image.publicId} className="hover:bg-amber-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={image.secureUrl}
                            alt={image.fileName}
                            className="h-16 w-16 object-cover rounded-lg border border-amber-200"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-amber-900">{image.fileName}</div>
                          <div className="text-sm text-amber-600">{image.publicId}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-amber-800 max-w-xs truncate" title={image.secureUrl}>
                            {image.secureUrl}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600">
                          {new Date(image.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => copyToClipboard(image.secureUrl)}
                            className="text-amber-600 hover:text-amber-900"
                            title="Copy URL"
                          >
                            Copy URL
                          </button>
                          <button
                            onClick={() => handleDelete(image.publicId, image.fileName)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Image"
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
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
