# VEXIVO — Sentry + Pino Observability & Monitoring

This document details the production-grade observability architecture implemented for the VEXIVO platform, combining **Sentry** (exception and error tracking) and **Pino** (high-performance structured logging).

---

## 1. Architecture Overview

```
                                ┌───────────────────────────────────────┐
                                │             VEXIVO CLIENT             │
                                │   React 18 + Vite + ErrorBoundary    │
                                └───────────────────┬───────────────────┘
                                                    │
                                                    │ Sentry Browser SDK
                                                    ▼
                                          ┌───────────────────┐
                                          │   Sentry Cloud    │
                                          │  (Frontend DSN)   │
                                          └───────────────────┘

                                ┌───────────────────────────────────────┐
                                │             VEXIVO SERVER             │
                                │          Express 4 + Node.js          │
                                └───────────────────┬───────────────────┘
                                                    │
                      ┌─────────────────────────────┴─────────────────────────────┐
                      ▼                                                           ▼
         ┌─────────────────────────┐                                 ┌─────────────────────────┐
         │     Pino Structured     │                                 │     Sentry Node SDK     │
         │         Logger          │                                 │      (Backend DSN)      │
         └────────────┬────────────┘                                 └────────────┬────────────┘
                      │                                                           │
                      ▼                                                           ▼
         - Request correlation (X-Request-Id)                        - Unhandled 5xx exceptions
         - Structured JSON in production                             - Safe breadcrumbs & context
         - Pretty-printed in development                             - Deep sensitive-data scrubbing
         - Automated credential redaction
```

---

## 2. Environment Variables

### Backend (`server/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `LOG_LEVEL` | Pino log level (`fatal`, `error`, `warn`, `info`, `debug`, `trace`) | `info` (prod), `debug` (dev) |
| `SENTRY_DSN` | Sentry project DSN for backend error monitoring | *(empty = local Pino logging only)* |
| `SENTRY_ENVIRONMENT` | Environment tag (`development`, `staging`, `production`) | `development` |
| `SENTRY_RELEASE` | Release identifier for error tracking | `vexivo-server@1.0.0` |
| `SENTRY_TRACES_SAMPLE_RATE` | Traces sample rate (0.0 to 1.0) | `0.1` |

### Frontend (`client/.env`)

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_SENTRY_DSN` | Sentry project DSN for frontend client | *(empty = console error logging only)* |
| `VITE_SENTRY_ENVIRONMENT`| Frontend environment tag | `development` |
| `VITE_SENTRY_RELEASE` | Frontend release tag | `vexivo-client@1.0.0` |
| `VITE_SENTRY_TRACES_SAMPLE_RATE` | Frontend performance trace sample rate | `0.1` |

> **Fail-Safe Guarantee:** If `SENTRY_DSN` or `VITE_SENTRY_DSN` is empty, both the backend and frontend initialize in safe no-op mode without crashing or logging error spam.

---

## 3. Pino Structured Logging

### How It Works
- **Centralized Logger (`server/config/logger.js`)**: All server logs flow through a single singleton Pino instance.
- **Request Logging (`server/middleware/requestLogger.js`)**: Uses `pino-http` to track request duration, HTTP method, URL, status code, and correlation ID.
- **Development Mode**: Pretty-printed with colorization and readable timestamps.
- **Production Mode**: Emits raw, high-throughput, structured JSON directly to `stdout`.

### Changing the Log Level
Set `LOG_LEVEL` in your environment or `.env` file:
```bash
LOG_LEVEL=debug npm run server    # Detailed debugging logs
LOG_LEVEL=warn npm run server     # Warnings and errors only
```

---

## 4. Request Correlation (Request ID)

1. Incoming requests are inspected for `x-request-id`. If missing or invalid, a secure UUID (`crypto.randomUUID()`) is generated.
2. The ID is attached to `req.id` and echoed back in the response header `X-Request-Id`.
3. The ID is automatically included in:
   - Pino request completion logs (`requestId`)
   - Pino error logs
   - Sentry error tags (`requestId`)
   - API error response JSON (`requestId`)
   - Frontend API client error objects

---

## 5. Security & Sensitive-Data Redaction

Pino and Sentry both enforce strict sanitization to guarantee that sensitive customer or authentication data is never leaked into logs or external monitoring platforms:

### Redacted Fields:
- **Credentials & Auth**: `password`, `confirmPassword`, `newPassword`, `currentPassword`, `token`, `accessToken`, `refreshToken`, `jwt`, `JWT_SECRET`, `Authorization` header, `Cookie` header, `Set-Cookie` header.
- **OTPs & Verification Codes**: `otp`, `pickupOtp`, `deliveryOtp`, `returnPickupOtp`, `code`.
- **Infrastructure Secrets**: `SUPABASE_SECRET_KEY`, `serviceRoleKey`, `apiKey`, `secretKey`, `STRIPE_SECRET_KEY`.

---

## 6. Sentry Error Capture & Testing

### Testing the Backend Integration
To verify that error capture and structured logging work properly:
```bash
# Check observability status
curl http://localhost:5000/api/observability/status

# Trigger a diagnostic test error (available in non-production only)
curl http://localhost:5000/api/observability/test-error
```

Response format:
```json
{
  "success": false,
  "message": "VEXIVO Observability Diagnostic Test Error",
  "requestId": "3f9c6d48-8e0b-4f9e-8fa9-d2b56e6d19c3"
}
```

### Testing the Frontend Integration
In your browser console while on the VEXIVO site:
```javascript
import('@sentry/react').then(Sentry => Sentry.captureMessage('VEXIVO Frontend Sentry Test'));
```
React component crashes caught by `ErrorBoundary` automatically report to Sentry with component stack metadata before rendering the user-friendly fallback view.
