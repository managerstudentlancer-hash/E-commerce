const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const BUCKET_NAME = process.env.SUPABASE_BUCKET || 'vexivo-images';

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
 * Allowed MIME types for raster images (SVG disallowed to prevent Stored XSS).
 */
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Validate image buffer, MIME type, and size.
 */
function validateImageFile(file) {
  if (!file) {
    throw new Error('No image file was provided.');
  }

  // Validate MIME type
  const mimetype = (file.mimetype || '').toLowerCase();
  if (!ALLOWED_MIME_TYPES.includes(mimetype)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed.');
  }

  // Validate size
  const size = file.size || (file.buffer ? file.buffer.length : 0);
  if (size > MAX_FILE_SIZE) {
    throw new Error('File exceeds the maximum 5MB size limit.');
  }

  // Validate extension
  const ext = path.extname(file.originalname || '').toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  if (ext && !allowedExts.includes(ext)) {
    throw new Error('Invalid file extension. Only .jpg, .jpeg, .png, .webp, .gif are permitted.');
  }

  return true;
}

/**
 * Generate unique filename with random bytes to prevent collision.
 */
function generateUniqueFilename(originalname = 'image.jpg') {
  const ext = path.extname(originalname).toLowerCase() || '.jpg';
  const timestamp = Date.now();
  const randomStr = crypto.randomBytes(6).toString('hex');
  return `${timestamp}-${randomStr}${ext}`;
}

/**
 * Build structured Supabase Storage Path as per specification:
 * - products/{productId}/{unique-file-name}
 * - categories/{categoryId}/{unique-file-name}
 * - banners/{bannerId}/{unique-file-name}
 * - profiles/{userId}/{unique-file-name}
 * - sellers/{sellerId}/{unique-file-name}
 */
function buildStoragePath({ folder = 'products', entityId = 'general', originalname = 'image.jpg' }) {
  const validFolders = ['products', 'categories', 'banners', 'profiles', 'sellers'];
  const targetFolder = validFolders.includes(folder) ? folder : 'products';
  const cleanEntityId = String(entityId || 'general').replace(/[^a-zA-Z0-9_-]/g, '') || 'general';
  const uniqueName = generateUniqueFilename(originalname);

  return {
    storagePath: `${targetFolder}/${cleanEntityId}/${uniqueName}`,
    uniqueName,
    folder: targetFolder,
    entityId: cleanEntityId,
  };
}

/**
 * Extract storage path from a full Supabase Public URL or relative path.
 */
function extractPathFromUrl(fileUrlOrPath) {
  if (!fileUrlOrPath || typeof fileUrlOrPath !== 'string') return null;

  // Pattern: .../storage/v1/object/public/vexivo-images/{folder}/{entityId}/{filename}
  const bucketPattern = new RegExp(`/storage/v1/object/public/${BUCKET_NAME}/(.+)`, 'i');
  const match = fileUrlOrPath.match(bucketPattern);
  if (match && match[1]) {
    return decodeURIComponent(match[1]);
  }

  // If already relative path (e.g. products/123/name.jpg)
  const relativeMatch = fileUrlOrPath.match(/^(products|categories|banners|profiles|sellers)\/[^/]+\/[^/]+$/i);
  if (relativeMatch) {
    return fileUrlOrPath;
  }

  return null;
}

/**
 * Upload an image buffer directly to Supabase Storage.
 *
 * @param {Object} params
 * @param {Buffer} params.buffer - In-memory image buffer (from multer.memoryStorage)
 * @param {string} params.mimetype - Image MIME type (e.g. 'image/png')
 * @param {string} params.originalname - Original uploaded file name
 * @param {string} params.folder - 'products' | 'categories' | 'banners' | 'profiles' | 'sellers'
 * @param {string} params.entityId - ID of product, category, banner, user, or seller
 * @returns {Promise<{ url: string, path: string, filename: string, bucket: string }>}
 */
async function uploadToSupabase({ buffer, mimetype, originalname, folder = 'products', entityId = 'general' }) {
  validateImageFile({ buffer, mimetype, originalname });

  const client = getSupabaseClient();
  const { storagePath, uniqueName } = buildStoragePath({ folder, entityId, originalname });

  if (!client) {
    throw new Error(
      'Supabase Storage is not configured. Please define SUPABASE_URL and SUPABASE_SECRET_KEY in server/.env.'
    );
  }

  // Upload to Supabase bucket
  const { data, error } = await client.storage
    .from(BUCKET_NAME)
    .upload(storagePath, buffer, {
      contentType: mimetype,
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('[Supabase Storage Upload Error]:', error);
    throw new Error(`Failed to upload to Supabase Storage: ${error.message}`);
  }

  // Retrieve public URL
  const { data: publicData } = client.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
  const publicUrl = publicData?.publicUrl || `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${storagePath}`;

  return {
    url: publicUrl,
    path: storagePath,
    filename: uniqueName,
    bucket: BUCKET_NAME,
  };
}

/**
 * Delete an image from Supabase Storage by its full URL or path.
 *
 * @param {string} fileUrlOrPath - Full public Supabase URL or storage path
 * @returns {Promise<boolean>}
 */
async function deleteFromSupabase(fileUrlOrPath) {
  if (!fileUrlOrPath) return false;

  const storagePath = extractPathFromUrl(fileUrlOrPath);
  if (!storagePath) {
    // Not a Supabase managed file (e.g. Unsplash URL or external link)
    return false;
  }

  const client = getSupabaseClient();
  if (!client) {
    console.warn('[Supabase Storage] Cannot delete file: Supabase client not configured.');
    return false;
  }

  try {
    const { error } = await client.storage.from(BUCKET_NAME).remove([storagePath]);
    if (error) {
      console.warn(`[Supabase Storage Delete Warning] (${storagePath}):`, error.message);
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
  uploadToSupabase,
  deleteFromSupabase,
  extractPathFromUrl,
  BUCKET_NAME,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
};
