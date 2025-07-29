/**
 * Cloudinary image utilities for optimizing and transforming images
 */

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
  blur?: number;
  brightness?: number;
  contrast?: number;
  saturation?: number;
}

/**
 * Checks if a URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
}

/**
 * Extracts the public ID from a Cloudinary URL
 */
export function extractPublicId(cloudinaryUrl: string): string | null {
  try {
    const url = new URL(cloudinaryUrl);
    const pathParts = url.pathname.split('/');
    
    // Find the upload index
    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return null;
    
    // The public ID is everything after the version (if present) or after upload
    const afterUpload = pathParts.slice(uploadIndex + 1);
    
    // Remove version if present (starts with 'v' followed by numbers)
    if (afterUpload[0] && /^v\d+$/.test(afterUpload[0])) {
      afterUpload.shift();
    }
    
    // Join the remaining parts and remove file extension
    const publicId = afterUpload.join('/');
    return publicId.replace(/\.[^/.]+$/, ''); // Remove file extension
  } catch (error) {
    console.error('Error extracting public ID from Cloudinary URL:', error);
    return null;
  }
}

/**
 * Builds transformation parameters for Cloudinary URLs
 */
export function buildTransformationString(options: CloudinaryTransformOptions): string {
  const transformations: string[] = [];
  
  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.gravity) transformations.push(`g_${options.gravity}`);
  if (options.blur) transformations.push(`e_blur:${options.blur}`);
  if (options.brightness) transformations.push(`e_brightness:${options.brightness}`);
  if (options.contrast) transformations.push(`e_contrast:${options.contrast}`);
  if (options.saturation) transformations.push(`e_saturation:${options.saturation}`);
  
  return transformations.join(',');
}

/**
 * Optimizes a Cloudinary URL with transformation parameters
 */
export function optimizeCloudinaryUrl(
  originalUrl: string, 
  options: CloudinaryTransformOptions = {}
): string {
  // If it's not a Cloudinary URL, return as is
  if (!isCloudinaryUrl(originalUrl)) {
    return originalUrl;
  }
  
  try {
    const url = new URL(originalUrl);
    const pathParts = url.pathname.split('/');
    
    // Find the upload index
    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return originalUrl;
    
    // Build transformation string
    const transformationString = buildTransformationString({
      quality: 'auto',
      format: 'auto',
      ...options
    });
    
    // Insert transformation after 'upload'
    if (transformationString) {
      pathParts.splice(uploadIndex + 1, 0, transformationString);
    }
    
    // Reconstruct the URL
    url.pathname = pathParts.join('/');
    return url.toString();
  } catch (error) {
    console.error('Error optimizing Cloudinary URL:', error);
    return originalUrl;
  }
}

/**
 * Gets an optimized image URL for different use cases
 */
export function getOptimizedImageUrl(
  imageUrl: string,
  context: 'thumbnail' | 'card' | 'hero' | 'gallery' | 'full' = 'card'
): string {
  // If it's not a Cloudinary URL, return as is
  if (!isCloudinaryUrl(imageUrl)) {
    return imageUrl;
  }
  
  const optimizationOptions: Record<string, CloudinaryTransformOptions> = {
    thumbnail: {
      width: 150,
      height: 150,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      format: 'auto'
    },
    card: {
      width: 400,
      height: 300,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      format: 'auto'
    },
    hero: {
      width: 1200,
      height: 600,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      format: 'auto'
    },
    gallery: {
      width: 800,
      height: 600,
      crop: 'fit',
      gravity: 'auto',
      quality: 'auto',
      format: 'auto'
    },
    full: {
      quality: 'auto',
      format: 'auto'
    }
  };
  
  return optimizeCloudinaryUrl(imageUrl, optimizationOptions[context]);
}

/**
 * Creates a placeholder image URL for loading states
 */
export function getPlaceholderImageUrl(
  width: number = 400,
  height: number = 300,
  text: string = 'Loading...'
): string {
  // Using a simple placeholder service - you could replace this with your own
  return `https://via.placeholder.com/${width}x${height}/f3f4f6/6b7280?text=${encodeURIComponent(text)}`;
}

/**
 * Validates if an image URL is accessible
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/') === true;
  } catch {
    return false;
  }
}

/**
 * Gets a fallback image URL if the original fails to load
 */
export function getFallbackImageUrl(context: 'product' | 'collection' | 'general' = 'general'): string {
  const fallbackImages = {
    product: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=400&h=300&fit=crop&crop=center',
    collection: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=300&fit=crop&crop=center',
    general: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop&crop=center'
  };

  return fallbackImages[context];
}
