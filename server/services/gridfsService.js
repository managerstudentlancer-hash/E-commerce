const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const crypto = require('crypto');
const path = require('path');
const { Readable } = require('stream');

const BUCKET_NAME = 'media';
let gridfsBucket = null;

/**
 * Initialize or get GridFSBucket singleton on active mongoose connection.
 */
function getBucket() {
  if (!mongoose.connection || mongoose.connection.readyState !== 1) {
    throw new Error('MongoDB is not connected. GridFS requires an active MongoDB connection.');
  }
  if (!gridfsBucket || gridfsBucket.s.db !== mongoose.connection.db) {
    gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: BUCKET_NAME,
    });
  }
  return gridfsBucket;
}

/**
 * Check if GridFS is ready to receive operations.
 */
function isGridFSConfigured() {
  return Boolean(mongoose.connection && mongoose.connection.readyState === 1);
}

/**
 * Allowed MIME types and size limits
 */
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'];
const ALLOWED_MIME_TYPES = [...ALLOWED_IMAGE_MIME_TYPES, ...ALLOWED_VIDEO_MIME_TYPES];

const MAX_IMAGE_FILE_SIZE = 15 * 1024 * 1024; // 15 MB
const MAX_VIDEO_FILE_SIZE = 60 * 1024 * 1024; // 60 MB

/**
 * Determine if file is video
 */
function isVideoFile(mimetype = '', originalname = '') {
  const mime = mimetype.toLowerCase();
  const ext = path.extname(originalname || '').toLowerCase();
  return (
    ALLOWED_VIDEO_MIME_TYPES.includes(mime) ||
    ['.mp4', '.webm', '.mov', '.mkv'].includes(ext) ||
    mime.startsWith('video/')
  );
}

/**
 * Validate image / video file for security, MIME types, and size limits.
 */
function validateMediaFile(file) {
  if (!file) throw new Error('No file provided for upload.');

  const mimetype = (file.mimetype || '').toLowerCase();
  const originalname = file.originalname || '';
  const size = file.size || (file.buffer ? file.buffer.length : 0);
  const ext = path.extname(originalname).toLowerCase();

  // Strict check: Block SVGs & executables (Stored XSS & RCE prevention)
  if (
    mimetype.includes('svg') ||
    ext === '.svg' ||
    mimetype.includes('html') ||
    mimetype.includes('javascript') ||
    mimetype.includes('php') ||
    ext === '.exe' ||
    ext === '.sh' ||
    ext === '.bat'
  ) {
    throw new Error('Security violation: Vector (SVG), script, and executable files are strictly prohibited.');
  }

  const isVideo = isVideoFile(mimetype, originalname);

  if (isVideo) {
    if (size > MAX_VIDEO_FILE_SIZE) {
      throw new Error(`Video file size exceeds maximum permitted limit of ${MAX_VIDEO_FILE_SIZE / (1024 * 1024)}MB.`);
    }
  } else {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(mimetype) && !mimetype.startsWith('image/')) {
      throw new Error('Security violation: Only safe raster images (JPEG, PNG, WEBP, GIF) are permitted.');
    }
    if (size > MAX_IMAGE_FILE_SIZE) {
      throw new Error(`Image file size exceeds maximum permitted limit of ${MAX_IMAGE_FILE_SIZE / (1024 * 1024)}MB.`);
    }
    // Verify magic bytes for raster images
    if (file.buffer && file.buffer.length >= 4) {
      const header = file.buffer.subarray(0, 4);
      const isJpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
      const isPng = header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4e && header[3] === 0x47;
      const isGif = header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46;
      const isWebp =
        file.buffer.length >= 12 &&
        header[0] === 0x52 &&
        header[1] === 0x49 &&
        header[2] === 0x46 &&
        header[3] === 0x46 &&
        file.buffer.subarray(8, 12).toString() === 'WEBP';

      if (!isJpeg && !isPng && !isGif && !isWebp) {
        throw new Error('Corrupted or forged image: File signature does not match image format.');
      }
    }
  }

  return true;
}

/**
 * Extract GridFS File ObjectId from a URL, path, or raw ID.
 */
function extractFileId(fileUrlOrId) {
  if (!fileUrlOrId || typeof fileUrlOrId !== 'string') return null;
  const str = fileUrlOrId.trim();

  // If already a valid hex ObjectId (24 chars)
  if (/^[0-9a-fA-F]{24}$/.test(str)) {
    return str;
  }

  // If path like /api/media/:id or /api/media/:id/:filename
  const mediaMatch = str.match(/\/api\/media\/([0-9a-fA-F]{24})/);
  if (mediaMatch) {
    return mediaMatch[1];
  }

  return null;
}

/**
 * Upload an image or video buffer to MongoDB GridFS.
 */
async function uploadToGridFS({
  file,
  buffer,
  originalname = 'upload.jpg',
  mimetype = 'image/jpeg',
  folder = 'general',
  entityId = 'common',
  customId = null,
}) {
  const buf = buffer || file?.buffer;
  const name = originalname || file?.originalname || 'upload.jpg';
  const mime = (mimetype || file?.mimetype || 'image/jpeg').toLowerCase();

  validateMediaFile({ buffer: buf, originalname: name, mimetype: mime, size: buf.length });

  const bucket = getBucket();
  const fileId = customId && ObjectId.isValid(customId) ? new ObjectId(customId) : new ObjectId();
  const ext = path.extname(name) || (mime.includes('png') ? '.png' : mime.includes('webp') ? '.webp' : '.jpg');
  const safeBase = path.basename(name, ext).replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 40) || 'file';
  const storedFilename = `${folder}/${entityId}/${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${safeBase}${ext}`;

  // Calculate cryptographic SHA-256 checksum
  const sha256 = crypto.createHash('sha256').update(buf).digest('hex');

  const metadata = {
    folder,
    entityId: String(entityId),
    originalName: name,
    mimetype: mime,
    size: buf.length,
    sha256,
    uploadedAt: new Date(),
    isVideo: isVideoFile(mime, name),
  };

  return new Promise((resolve, reject) => {
    const readable = Readable.from(buf);
    const uploadStream = bucket.openUploadStreamWithId(fileId, storedFilename, {
      contentType: mime,
      metadata,
    });

    uploadStream.on('error', (err) => {
      reject(new Error(`Failed to upload to MongoDB GridFS: ${err.message}`));
    });

    uploadStream.on('finish', () => {
      const publicUrl = `/api/media/${fileId.toString()}`;
      resolve({
        fileId: fileId.toString(),
        url: publicUrl,
        storagePath: storedFilename,
        filename: storedFilename,
        originalName: name,
        size: buf.length,
        mimetype: mime,
        sha256,
        success: true,
      });
    });

    readable.pipe(uploadStream);
  });
}

/**
 * Find file metadata in GridFS.
 */
async function getFileInfo(fileId) {
  if (!ObjectId.isValid(fileId)) return null;
  const bucket = getBucket();
  const files = await bucket.find({ _id: new ObjectId(fileId) }).limit(1).toArray();
  return files && files.length > 0 ? files[0] : null;
}

/**
 * Open download stream for a GridFS file by ID.
 */
function openDownloadStream(fileId, options = {}) {
  if (!ObjectId.isValid(fileId)) {
    throw new Error('Invalid file ObjectId');
  }
  const bucket = getBucket();
  return bucket.openDownloadStream(new ObjectId(fileId), options);
}

/**
 * Delete a media file from GridFS by its fileId, URL, or path.
 */
async function deleteFromGridFS(fileUrlOrId) {
  try {
    const fileId = extractFileId(fileUrlOrId);
    if (!fileId || !ObjectId.isValid(fileId)) {
      return false;
    }
    const bucket = getBucket();
    const existing = await bucket.find({ _id: new ObjectId(fileId) }).limit(1).toArray();
    if (!existing || existing.length === 0) {
      return false;
    }
    await bucket.delete(new ObjectId(fileId));
    return true;
  } catch (err) {
    console.warn(`[GridFS Delete Warning] Failed to delete file (${fileUrlOrId}):`, err.message);
    return false;
  }
}

module.exports = {
  getBucket,
  isGridFSConfigured,
  validateMediaFile,
  uploadToGridFS,
  getFileInfo,
  openDownloadStream,
  deleteFromGridFS,
  extractFileId,
  ALLOWED_IMAGE_MIME_TYPES,
  ALLOWED_VIDEO_MIME_TYPES,
  MAX_IMAGE_FILE_SIZE,
  MAX_VIDEO_FILE_SIZE,
};
