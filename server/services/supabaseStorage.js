const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const BUCKET_NAME = process.env.SUPABASE_BUCKET || 'vexivo-images';
const PRODUCT_MEDIA_BUCKET = process.env.SUPABASE_PRODUCT_MEDIA_BUCKET || 'product-media';

let supabaseClient = null;

/**
 * Initialize or get Supabase Client singleton.
 * Uses SUPABASE_URL and SUPABASE_SECRET_KEY from backend environment.
 */
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseClient;
}

/**
 * Check if Supabase credentials are configured.
 */
function isSupabaseConfigured() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();
  return Boolean(url && key && url.startsWith('http'));
}

/**
 * Allowed MIME types and size limits
 */
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'];
const ALLOWED_MIME_TYPES = [...ALLOWED_IMAGE_MIME_TYPES, ...ALLOWED_VIDEO_MIME_TYPES];

const MAX_IMAGE_FILE_SIZE = 15 * 1024 * 1024; // 15 MB
const MAX_VIDEO_FILE_SIZE = 60 * 1024 * 1024; // 60 MB
const MAX_FILE_SIZE = MAX_VIDEO_FILE_SIZE;

/**
 * Determine if file is video
 */
function isVideoFile(mimetype = '', originalname = '') {
  const mime = mimetype.toLowerCase();
  const ext = path.extname(originalname || '').toLowerCase();
  return (
    ALLOWED_VIDEO_MIME_TYPES.includes(mime) ||
    mime.startsWith('video/') ||
    ['.mp4', '.webm', '.mov', '.mkv'].includes(ext)
  );
}

/**
 * Validate image buffer, MIME type, and size.
 */
function validateImageFile(file) {
  if (!file) {
    throw new Error('No image file was provided.');
  }

  const mimetype = (file.mimetype || '').toLowerCase();
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(mimetype)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed.');
  }

  const size = file.size !== undefined ? file.size : (file.buffer ? file.buffer.length : 0);
  if (!file.buffer && size === 0) {
    throw new Error('No valid file buffer or content was provided.');
  }
  if (file.buffer && file.buffer.length === 0) {
    throw new Error('File buffer is empty (0 bytes).');
  }
  if (size > MAX_IMAGE_FILE_SIZE) {
    throw new Error('Image file exceeds the maximum 15MB size limit.');
  }

  const ext = path.extname(file.originalname || '').toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  if (ext && !allowedExts.includes(ext)) {
    throw new Error('Invalid file extension. Only .jpg, .jpeg, .png, .webp, .gif are permitted.');
  }

  return true;
}

/**
 * Validate any media file (images and videos).
 */
function validateMediaFile(file, options = { allowVideo: true }) {
  if (!file) {
    throw new Error('No file was provided.');
  }

  const mimetype = (file.mimetype || '').toLowerCase();
  const ext = path.extname(file.originalname || '').toLowerCase();
  const isVid = isVideoFile(mimetype, file.originalname);

  if (isVid) {
    if (!options.allowVideo) {
      throw new Error('Videos are not allowed for this upload field.');
    }
    const allowedVidExts = ['.mp4', '.webm', '.mov', '.mkv'];
    if (ext && !allowedVidExts.includes(ext) && !ALLOWED_VIDEO_MIME_TYPES.includes(mimetype)) {
      throw new Error('Invalid video format. Supported formats: MP4, WEBM, MOV.');
    }
    const size = file.size !== undefined ? file.size : (file.buffer ? file.buffer.length : 0);
    if (!file.buffer && size === 0) {
      throw new Error('No valid video buffer or content was provided.');
    }
    if (file.buffer && file.buffer.length === 0) {
      throw new Error('Video buffer is empty (0 bytes).');
    }
    if (size > MAX_VIDEO_FILE_SIZE) {
      throw new Error('Video file exceeds the maximum 60MB size limit.');
    }
    return 'video';
  }

  // Otherwise validate as image
  validateImageFile(file);
  return 'image';
}

/**
 * Generate unique filename with random bytes to prevent collision.
 */
function generateUniqueFilename(originalname = 'media.jpg') {
  const ext = path.extname(originalname).toLowerCase() || '.jpg';
  const timestamp = Date.now();
  const randomStr = crypto.randomBytes(6).toString('hex');
  return `${timestamp}-${randomStr}${ext}`;
}

/**
 * Build structured Supabase Storage Path:
 * For products:
 *   - products/{productId}/images/{filename}
 *   - products/{productId}/videos/{filename}
 * For other entities:
 *   - {folder}/{entityId}/{filename}
 */
function buildStoragePath({
  folder = 'products',
  entityId = 'general',
  originalname = 'image.jpg',
  mediaType = 'image',
}) {
  const validFolders = ['products', 'categories', 'banners', 'profiles', 'sellers'];
  const targetFolder = validFolders.includes(folder) ? folder : 'products';
  const cleanEntityId = String(entityId || 'general').replace(/[^a-zA-Z0-9_-]/g, '') || 'general';
  const uniqueName = generateUniqueFilename(originalname);

  let storagePath;
  if (targetFolder === 'products') {
    const subDir = mediaType === 'video' ? 'videos' : 'images';
    storagePath = `products/${cleanEntityId}/${subDir}/${uniqueName}`;
  } else {
    storagePath = `${targetFolder}/${cleanEntityId}/${uniqueName}`;
  }

  return {
    storagePath,
    uniqueName,
    folder: targetFolder,
    entityId: cleanEntityId,
    mediaType,
  };
}

/**
 * Extract storage path and bucket name from a full Supabase Public URL or relative path.
 */
function extractPathAndBucketFromUrl(fileUrlOrPath) {
  if (!fileUrlOrPath || typeof fileUrlOrPath !== 'string') return null;

  // Pattern: .../storage/v1/object/public/{bucketName}/{storagePath}
  const match = fileUrlOrPath.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/i);
  if (match && match[1] && match[2]) {
    return {
      bucket: decodeURIComponent(match[1]),
      path: decodeURIComponent(match[2]),
    };
  }

  // If already relative path
  if (fileUrlOrPath.startsWith('products/')) {
    return {
      bucket: PRODUCT_MEDIA_BUCKET,
      path: fileUrlOrPath,
    };
  }

  const relativeMatch = fileUrlOrPath.match(/^(categories|banners|profiles|sellers)\/[^/]+\/[^/]+$/i);
  if (relativeMatch) {
    return {
      bucket: BUCKET_NAME,
      path: fileUrlOrPath,
    };
  }

  return null;
}

function extractPathFromUrl(fileUrlOrPath) {
  const res = extractPathAndBucketFromUrl(fileUrlOrPath);
  return res ? res.path : null;
}

/**
 * Upload an image or video buffer directly to Supabase Storage.
 *
 * @param {Object} params
 * @param {Buffer} params.buffer - In-memory media buffer
 * @param {string} params.mimetype - Media MIME type
 * @param {string} params.originalname - Original uploaded file name
 * @param {string} params.folder - 'products' | 'categories' | 'banners' | 'profiles' | 'sellers'
 * @param {string} params.entityId - ID of product, category, etc.
 * @param {string} [params.bucket] - Explicit bucket override
 * @param {string} [params.mediaType] - 'image' | 'video' | 'auto'
 * @returns {Promise<{ url: string, path: string, filename: string, bucket: string, mediaType: string, mimeType: string, size: number }>}
 */
async function uploadToSupabase({
  buffer,
  mimetype,
  originalname,
  folder = 'products',
  entityId = 'general',
  bucket = null,
  mediaType = 'auto',
}) {
  const detectedMediaType =
    mediaType === 'auto'
      ? validateMediaFile({ buffer, mimetype, originalname }, { allowVideo: true })
      : mediaType;

  const client = getSupabaseClient();
  if (!client) {
    throw new Error(
      'Supabase Storage is not configured. Please define SUPABASE_URL and SUPABASE_SECRET_KEY in server/.env.'
    );
  }

  // Choose appropriate bucket: 'product-media' for products, 'vexivo-images' for other entities
  const targetBucket =
    bucket ||
    (folder === 'products' ? PRODUCT_MEDIA_BUCKET : BUCKET_NAME);

  const { storagePath, uniqueName } = buildStoragePath({
    folder,
    entityId,
    originalname,
    mediaType: detectedMediaType,
  });

  const size = buffer ? buffer.length : 0;

  // Upload to Supabase bucket
  const { data, error } = await client.storage
    .from(targetBucket)
    .upload(storagePath, buffer, {
      contentType: mimetype || (detectedMediaType === 'video' ? 'video/mp4' : 'image/jpeg'),
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error(`[Supabase Storage Upload Error - ${targetBucket}]:`, error);
    throw new Error(`Failed to upload to Supabase Storage (${targetBucket}): ${error.message}`);
  }

  // Retrieve public URL
  const { data: publicData } = client.storage.from(targetBucket).getPublicUrl(storagePath);
  const publicUrl =
    publicData?.publicUrl ||
    `${process.env.SUPABASE_URL}/storage/v1/object/public/${targetBucket}/${storagePath}`;

  return {
    url: publicUrl,
    path: storagePath,
    filename: uniqueName,
    bucket: targetBucket,
    mediaType: detectedMediaType,
    mimeType: mimetype,
    size,
  };
}

/**
 * Delete a media file from Supabase Storage by its full URL or path.
 *
 * @param {string} fileUrlOrPath - Full public Supabase URL or storage path
 * @returns {Promise<boolean>}
 */
async function deleteFromSupabase(fileUrlOrPath) {
  if (!fileUrlOrPath) return false;

  const extracted = extractPathAndBucketFromUrl(fileUrlOrPath);
  if (!extracted || !extracted.path) {
    return false;
  }

  const client = getSupabaseClient();
  if (!client) {
    console.warn('[Supabase Storage] Cannot delete file: Supabase client not configured.');
    return false;
  }

  try {
    const { error } = await client.storage.from(extracted.bucket).remove([extracted.path]);
    if (error) {
      console.warn(`[Supabase Storage Delete Warning] (${extracted.bucket}/${extracted.path}):`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase Storage Delete Error]:', err.message);
    return false;
  }
}

module.exports = {
  getSupabaseClient,
  isSupabaseConfigured,
  validateImageFile,
  validateMediaFile,
  isVideoFile,
  uploadToSupabase,
  deleteFromSupabase,
  extractPathFromUrl,
  extractPathAndBucketFromUrl,
  buildStoragePath,
  BUCKET_NAME,
  PRODUCT_MEDIA_BUCKET,
  ALLOWED_IMAGE_MIME_TYPES,
  ALLOWED_VIDEO_MIME_TYPES,
  ALLOWED_MIME_TYPES,
  MAX_IMAGE_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE,
  MAX_FILE_SIZE,
};
