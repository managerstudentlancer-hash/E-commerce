const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const gridfsService = require('../services/gridfsService');

/**
 * Common handler to stream media from GridFS by fileId.
 * Supports Range headers, ETags, and long-term caching.
 */
async function streamMediaFile(req, res, next) {
  try {
    const { fileId } = req.params;
    if (!fileId || !ObjectId.isValid(fileId)) {
      return res.status(400).json({ success: false, message: 'Invalid media ID format.' });
    }

    const file = await gridfsService.getFileInfo(fileId);
    if (!file) {
      return res.status(404).json({ success: false, message: 'Media file not found in GridFS.' });
    }

    const contentType = file.metadata?.mimetype || file.contentType || 'application/octet-stream';
    const etag = file.metadata?.sha256 ? `"${file.metadata.sha256}"` : `"${file._id.toString()}-${file.uploadDate?.getTime()}"`;

    // 304 Not Modified check
    if (req.headers['if-none-match'] === etag) {
      return res.status(304).end();
    }

    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('ETag', etag);
    res.setHeader('Content-Type', contentType);

    const fileSize = file.length;
    const range = req.headers.range;

    if (range) {
      // Parse Range header (e.g., "bytes=0-1024" or "bytes=1024-")
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize || start > end) {
        res.setHeader('Content-Range', `bytes */${fileSize}`);
        return res.status(416).send('Requested range not satisfiable');
      }

      const chunkSize = end - start + 1;
      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      res.setHeader('Content-Length', chunkSize);

      const downloadStream = gridfsService.openDownloadStream(fileId, {
        start,
        end: end + 1,
      });

      downloadStream.on('error', (err) => {
        if (!res.headersSent) {
          res.status(500).json({ success: false, message: err.message });
        }
      });

      downloadStream.pipe(res);
    } else {
      res.setHeader('Content-Length', fileSize);
      const downloadStream = gridfsService.openDownloadStream(fileId);

      downloadStream.on('error', (err) => {
        if (!res.headersSent) {
          res.status(500).json({ success: false, message: err.message });
        }
      });

      downloadStream.pipe(res);
    }
  } catch (error) {
    next(error);
  }
}

// Media streaming endpoints
router.get('/:fileId', streamMediaFile);
router.get('/:fileId/:filename', streamMediaFile);

// Metadata inspection endpoint
router.get('/:fileId/info', async (req, res, next) => {
  try {
    const { fileId } = req.params;
    if (!fileId || !ObjectId.isValid(fileId)) {
      return res.status(400).json({ success: false, message: 'Invalid media ID.' });
    }
    const file = await gridfsService.getFileInfo(fileId);
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found.' });
    }
    res.json({
      success: true,
      file: {
        id: file._id,
        filename: file.filename,
        length: file.length,
        contentType: file.contentType,
        uploadDate: file.uploadDate,
        metadata: file.metadata,
        url: `/api/media/${file._id}`,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
