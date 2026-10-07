const crypto = require('crypto');
const pinoHttp = require('pino-http');
const logger = require('../config/logger');

/**
 * Pino HTTP request logging middleware with Correlation Request ID
 */
const requestLogger = pinoHttp({
  logger,

  // Generate or reuse incoming X-Request-Id correlation header
  genReqId(req, res) {
    const existingId = req.headers['x-request-id'];
    // Validate existing ID is safe alphanumeric string up to 64 chars
    if (existingId && typeof existingId === 'string' && /^[a-zA-Z0-9_-]{8,64}$/.test(existingId)) {
      res.setHeader('X-Request-Id', existingId);
      return existingId;
    }

    const newId = crypto.randomUUID();
    res.setHeader('X-Request-Id', newId);
    return newId;
  },

  // Map HTTP response status codes to structured log levels
  customLogLevel(req, res, err) {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    // Lower priority for frequent health check pings to prevent noise
    if (req.url === '/api/health') return 'debug';
    return 'info';
  },

  // Clean, standard human-readable and structured message format
  customSuccessMessage(req, res, responseTime) {
    return `${req.method} ${req.url} ${res.statusCode} (${Math.round(responseTime)}ms)`;
  },

  customErrorMessage(req, res, err) {
    return `${req.method} ${req.url} ${res.statusCode} - ${err.message}`;
  },

  // Strict safe serializers: NEVER log authorization headers, cookies, or request bodies
  serializers: {
    req(req) {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        query: req.query,
        remoteAddress: req.remoteAddress,
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
    err(err) {
      return {
        type: err.type || err.name,
        message: err.message,
      };
    },
  },
});

module.exports = requestLogger;
