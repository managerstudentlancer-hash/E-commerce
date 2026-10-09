const logger = require('../config/logger');
const { captureException } = require('../config/sentry');

/**
 * Centralized Application Error Handler
 * - Logs structured error via Pino
 * - Captures unexpected error via Sentry with request correlation
 * - Returns safe client API response without exposing stack traces
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? (err.statusCode || 500) : res.statusCode;
  const requestId = req.id || req.headers?.['x-request-id'] || 'unknown';

  // 1. Structured logging via Pino
  logger.error(
    {
      err: {
        name: err.name,
        message: err.message,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
      },
      requestId,
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode,
    },
    `[Request Error] ${req.method} ${req.originalUrl || req.url}: ${err.message}`
  );

  // 2. Capture unexpected 5xx server exceptions to Sentry (skip expected 4xx client errors like 404/400/401)
  if (statusCode >= 500) {
    captureException(err, {
      tags: {
        requestId,
        method: req.method,
        path: req.originalUrl || req.url,
        statusCode: String(statusCode),
      },
      extra: {
        query: req.query,
      },
    });
  }

  // 3. Return existing standard API error response
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    requestId,
  });
};

module.exports = errorHandler;
