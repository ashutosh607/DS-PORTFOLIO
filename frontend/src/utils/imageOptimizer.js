import imageCompression from 'browser-image-compression';

const CLOUDINARY_MAX_LIMIT_MB = 10;
const TARGET_MAX_SIZE_MB = 8;

/**
 * DS Photography & Films — Client-Side Image Compression for Photographer Uploads
 *
 * Compresses large 20-30 MB DSLR camera exports on the client side before network transmission,
 * ensuring the upload is safely around 5-8 MB (< 10 MB Cloudinary Free limit) while preserving
 * pristine visual quality for professional studio photography.
 *
 * @param {File} file - Original photo file selected by the photographer
 * @param {object} customOptions - Optional custom options or onProgress callback
 * @returns {Promise<File>} Compressed File ready for Cloudinary upload
 */
export async function optimizeImageFile(file, customOptions = {}) {
  // 1. Guard check: only process image files (skip videos, audio, etc.)
  if (!file || !file.type?.startsWith('image/')) {
    return file;
  }

  // Non-compressible or vector images
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  // 2. Base compression configuration as specified
  const options = {
    maxSizeMB: TARGET_MAX_SIZE_MB,
    maxWidthOrHeight: 3000,
    useWebWorker: true,
    initialQuality: 0.9,
    ...customOptions,
  };

  try {
    let compressedFile = await imageCompression(file, options);

    // Keep the original filename where possible so existing logic remains unaffected
    if (compressedFile && file.name && compressedFile.name !== file.name) {
      compressedFile = new File([compressedFile], file.name, {
        type: compressedFile.type || file.type,
        lastModified: Date.now(),
      });
    }

    // 3. Check if resulting file is still above Cloudinary's 10 MB limit
    const limitBytes = CLOUDINARY_MAX_LIMIT_MB * 1024 * 1024;
    if (compressedFile.size > limitBytes) {
      console.warn('Compressed image exceeded 10 MB; attempting secondary compression pass...');
      const secondaryOptions = {
        maxSizeMB: 7,
        maxWidthOrHeight: 2560,
        useWebWorker: true,
        initialQuality: 0.82,
      };

      compressedFile = await imageCompression(compressedFile, secondaryOptions);

      if (compressedFile && file.name && compressedFile.name !== file.name) {
        compressedFile = new File([compressedFile], file.name, {
          type: compressedFile.type || file.type,
          lastModified: Date.now(),
        });
      }
    }

    // 4. Hard safety check: Never silently upload a file larger than Cloudinary limit
    if (compressedFile.size > limitBytes) {
      throw new Error(
        `Image compression produced ${(compressedFile.size / (1024 * 1024)).toFixed(1)} MB, which exceeds Cloudinary's 10 MB limit. Please provide a smaller image.`
      );
    }

    return compressedFile;
  } catch (error) {
    console.error('Client-side image compression failed:', error);
    // Rethrow to trigger the existing upload error UI
    throw new Error(error.message || 'Image optimization failed. Please check the file format.');
  }
}

export default optimizeImageFile;
