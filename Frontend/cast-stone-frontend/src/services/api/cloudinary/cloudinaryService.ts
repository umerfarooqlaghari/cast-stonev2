import { BaseApiUrl } from '@/services/config/apiConfig';

export interface CloudinaryImageInfo {
  publicId: string;
  secureUrl: string;
  fileName: string;
  createdAt: string;
}

export interface UploadResponse {
  imageUrl: string;
  message: string;
}

export interface ImagesResponse {
  images: CloudinaryImageInfo[];
  message: string;
}

export interface DeleteResponse {
  message: string;
}

export interface BulkUploadResult {
  fileName: string;
  secureUrl: string | null;
  publicId: string | null;
  success: boolean;
  errorMessage: string | null;
}

export interface BulkUploadResponse {
  results: BulkUploadResult[];
  summary: {
    totalFiles: number;
    successCount: number;
    failureCount: number;
  };
  message: string;
}

class CloudinaryService {
  private baseUrl = `${BaseApiUrl}/cloudinary`;

  /**
   * Upload an image file to Cloudinary
   */
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${this.baseUrl}/uploadImage`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Get all uploaded images from Cloudinary
   */
  async getAllImages(): Promise<CloudinaryImageInfo[]> {
    try {
      const response = await fetch(`${this.baseUrl}/images`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch images');
      }

      const data: ImagesResponse = await response.json();
      return data.images;
    } catch (error) {
      console.error('Error fetching images:', error);
      throw error;
    }
  }

  /**
   * Delete an image from Cloudinary
   */
  async deleteImage(publicId: string): Promise<DeleteResponse> {
    try {
      // Encode the publicId to handle special characters
      const encodedPublicId = encodeURIComponent(publicId);

      const response = await fetch(`${this.baseUrl}/images/${encodedPublicId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete image');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  /**
   * Upload multiple image files to Cloudinary
   */
  async uploadImages(files: FileList | File[]): Promise<BulkUploadResponse> {
    const formData = new FormData();

    // Convert FileList to array if needed and append each file
    const fileArray = Array.from(files);
    fileArray.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await fetch(`${this.baseUrl}/uploadImages`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload images');
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(files: File[]): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  /**
   * Validate image file before upload
   */
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return {
        isValid: false,
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
      };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size too large. Maximum size is 10MB.'
      };
    }

    return { isValid: true };
  }

  /**
   * Validate multiple image files before upload
   */
  validateImageFiles(files: FileList | File[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const fileArray = Array.from(files);

    fileArray.forEach((file, index) => {
      const validation = this.validateImageFile(file);
      if (!validation.isValid) {
        errors.push(`File ${index + 1} (${file.name}): ${validation.error}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const cloudinaryService = new CloudinaryService();
