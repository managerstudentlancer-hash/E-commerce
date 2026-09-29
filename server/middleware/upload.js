const multer = require('multer');
const path = require('path');

// In-Memory Storage: No files are permanently written to server filesystem (uploads/, public/, etc.)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Security Guard: SVG is strictly disallowed to prevent Stored XSS / XML Injection attacks
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const ext = path.extname(file.originalname || '').toLowerCase();
  const isExtValid = allowedExtensions.includes(ext);

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const isMimeValid = allowedMimeTypes.includes((file.mimetype || '').toLowerCase());

  if (isExtValid && isMimeValid) {
    return cb(null, true);
  }

  return cb(
    new Error(
      'Security violation: Invalid file format. Only safe raster image files (JPEG, PNG, WEBP, GIF) up to 5MB are permitted.'
    ),
    false
  );
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB strict limit
    files: 10,
  },
  fileFilter,
});

module.exports = upload;
