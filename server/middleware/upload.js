const multer = require('multer');
const path = require('path');

// In-Memory Storage: No files are permanently written to server filesystem
const storage = multer.memoryStorage();

// Allowed file extensions
const ALLOWED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const ALLOWED_VIDEO_EXTS = ['.mp4', '.webm', '.mov', '.mkv'];
const ALLOWED_ALL_EXTS = [...ALLOWED_IMAGE_EXTS, ...ALLOWED_VIDEO_EXTS];

const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_MIMES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska'];
const ALLOWED_ALL_MIMES = [...ALLOWED_IMAGE_MIMES, ...ALLOWED_VIDEO_MIMES];

const mediaFileFilter = (req, file, cb) => {
  // SVG, HTML, PHP, EXE, JS strictly disallowed to prevent Stored XSS / RCE attacks
  const ext = path.extname(file.originalname || '').toLowerCase();
  const mimetype = (file.mimetype || '').toLowerCase();

  const isExtValid = ALLOWED_ALL_EXTS.includes(ext);
  const isMimeValid = ALLOWED_ALL_MIMES.includes(mimetype) || mimetype.startsWith('video/') || mimetype.startsWith('image/');

  if (isExtValid && isMimeValid) {
    return cb(null, true);
  }

  return cb(
    new Error(
      'Security violation: Invalid file format. Only safe images (JPEG, PNG, WEBP, GIF) and videos (MP4, WEBM, MOV) are permitted.'
    ),
    false
  );
};

const imageOnlyFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || '').toLowerCase();
  const mimetype = (file.mimetype || '').toLowerCase();

  if (ALLOWED_IMAGE_EXTS.includes(ext) && ALLOWED_IMAGE_MIMES.includes(mimetype)) {
    return cb(null, true);
  }

  return cb(
    new Error('Security violation: Only safe raster image files (JPEG, PNG, WEBP, GIF) are permitted.'),
    false
  );
};

// General upload handler supporting media up to 60MB (images & videos)
const upload = multer({
  storage,
  limits: {
    fileSize: 60 * 1024 * 1024, // 60MB limit to support product videos
    files: 10,
  },
  fileFilter: mediaFileFilter,
});

upload.imageOnly = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024,
    files: 10,
  },
  fileFilter: imageOnlyFilter,
});

module.exports = upload;
