const fs = require('fs');
const path = require('path');

const refPath = 'C:\\Users\\DELL\\Desktop\\Collage\\.archify\\architecture-nirvana-runtime-20261007-164700\\nirvana-runtime.html';
const refContent = fs.readFileSync(refPath, 'utf8');

// Find splitting points
const titlePattern = /<title>.*?<\/title>/;
const toolbarEndPattern = /<\/div>\s*<\/div>\s*<div class="container">/s;

// We will construct the exact VEXIVO Archify page
console.log('Reading reference file, length:', refContent.length);

// 1. Prefix: Up to <div class="container">
const containerIdx = refContent.indexOf('<div class="container">');
if (containerIdx === -1) {
  throw new Error('Could not find <div class="container"> in reference');
}

let prefix = refContent.substring(0, containerIdx);
prefix = prefix.replace(titlePattern, '<title>VEXIVO Marketplace - High-Level Runtime Architecture</title>');

// 2. Extract i18n data script from ref
const i18nMatch = refContent.match(/<script id="archify-i18n-data" type="application\/json">.*?<\/script>/s);
if (!i18nMatch) throw new Error('Could not find archify-i18n-data');
const i18nScript = i18nMatch[0];

// 3. Extract overlay controls (from </svg> to </aside>)
const svgCloseIdx = refContent.indexOf('</svg>');
const asideIdx = refContent.indexOf('<aside class="reader-rail"');
if (svgCloseIdx === -1 || asideIdx === -1) throw new Error('Could not find svg or aside tags');

const overlaysHtml = refContent.substring(svgCloseIdx + 6, asideIdx);

// 4. Extract JS engine (from <script> after </aside> to </html>)
const asideCloseIdx = refContent.indexOf('</aside>');
const scriptEngineIdx = refContent.indexOf('<script>', asideCloseIdx);
if (scriptEngineIdx === -1) throw new Error('Could not find main script engine');

const engineJs = refContent.substring(scriptEngineIdx);

// Construct VEXIVO Source Evidence JSON
const evidenceData = {
  schemaVersion: 1,
  verified: true,
  repository: {
    url: "https://github.com/vexivo/vexivo-marketplace",
    revision: "v2.4.0-production",
    shortRevision: "v2.4.0",
    label: "vexivo/e-commerce",
    href: "c:/Users/DELL/Desktop/E-commerce"
  },
  referenceCount: 16,
  nodes: {
    browser: [
      { path: "client/index.html", line: 1, label: "HTML Entrypoint", href: "client/index.html" }
    ],
    storefront_spa: [
      { path: "client/src/App.jsx", line: 24, label: "Client App Router", href: "client/src/App.jsx" },
      { path: "client/src/context/CartContext.jsx", line: 15, label: "Cart & State Engine", href: "client/src/context/CartContext.jsx" }
    ],
    portals: [
      { path: "client/src/pages/admin/AdminDashboard.jsx", line: 18, label: "Admin Management Portal", href: "client/src/pages/admin/AdminDashboard.jsx" },
      { path: "client/src/pages/seller/SellerDashboard.jsx", line: 20, label: "Seller Center", href: "client/src/pages/seller/SellerDashboard.jsx" }
    ],
    delivery_portal: [
      { path: "client/src/pages/delivery/DeliveryDashboard.jsx", line: 14, label: "Delivery Fleet Console", href: "client/src/pages/delivery/DeliveryDashboard.jsx" }
    ],
    client_sentry: [
      { path: "client/src/main.jsx", line: 12, label: "Sentry React SDK Init", href: "client/src/main.jsx" }
    ],
    express_gw: [
      { path: "server/server.js", line: 45, label: "Express API Gateway Entrypoint", href: "server/server.js" }
    ],
    request_corr: [
      { path: "server/middleware/requestCorrelation.js", line: 8, label: "X-Request-Id Correlation Engine", href: "server/middleware/requestCorrelation.js" }
    ],
    pino_http: [
      { path: "server/middleware/requestLogger.js", line: 12, label: "Pino HTTP Request Logger", href: "server/middleware/requestLogger.js" }
    ],
    auth_middleware: [
      { path: "server/middleware/auth.js", line: 15, label: "JWT Bearer Verification Guard", href: "server/middleware/auth.js" }
    ],
    auth_controller: [
      { path: "server/controllers/authController.js", line: 30, label: "Auth & Phone OTP Controller", href: "server/controllers/authController.js" }
    ],
    catalog_controller: [
      { path: "server/controllers/productController.js", line: 18, label: "Catalog & Multi-Vendor Engine", href: "server/controllers/productController.js" }
    ],
    order_controller: [
      { path: "server/controllers/orderController.js", line: 25, label: "Order & Checkout Controller", href: "server/controllers/orderController.js" }
    ],
    fleet_controller: [
      { path: "server/controllers/deliveryController.js", line: 20, label: "Fleet & Delivery OTP Handshake", href: "server/controllers/deliveryController.js" }
    ],
    mongodb: [
      { path: "server/config/database.js", line: 10, label: "Dual-Mode MongoDB / Memory Engine", href: "server/config/database.js" }
    ],
    supabase: [
      { path: "server/config/supabase.js", line: 8, label: "Supabase Cloud Media Storage", href: "server/config/supabase.js" }
    ],
    sms_gateway: [
      { path: "server/utils/sms.js", line: 15, label: "Indian SMS Gateway Dispatcher", href: "server/utils/sms.js" }
    ],
    pino_logger: [
      { path: "server/config/logger.js", line: 22, label: "Centralized Pino Structured Logger", href: "server/config/logger.js" }
    ],
    sentry_backend: [
      { path: "server/config/sentry.js", line: 16, label: "Sentry Node.js Error Instrumentor", href: "server/config/sentry.js" }
    ]
  }
};

const evidenceScript = `<script id="archify-source-evidence-data" type="application/json">${JSON.stringify(evidenceData)}</script>`;

// Header
const headerHtml = `  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="header-row"
           data-preset-badge-signal-flow="SIGNAL FLOW"
           data-preset-badge-blueprint="BLUEPRINT / REV 01"
           data-preset-badge-editorial="EDITORIAL / FIELD NOTE">
        <div class="pulse-dot"></div>
        <h1>VEXIVO Marketplace - High-Level Runtime Architecture</h1>
      </div>
      <p class="subtitle">Production multi-vendor runtime: React 18 SPA, Node 24 Express Gateway, Dual-Mode MongoDB, Supabase Storage, and Pino/Sentry Observability Plane</p>
    </div>

    ${evidenceScript}
    ${i18nScript}
    <!-- Main Diagram -->
    <div class="diagram-container" data-detail-level="read"
         data-preset-badge-editorial-plate="ARCHIFY / PLATE 04">
`;

// SVG Diagram (viewBox 0 0 1560 720)
const svgHtml = `      <svg viewBox="0 0 1560 720" role="img" lang="en" aria-labelledby="archify-diagram-title archify-diagram-description" data-preset="classic" data-quality-profile="showcase" data-reader-fit="intrinsic-height" data-reader-min-text="7.5" data-reader-primary-text="14">
        <title id="archify-diagram-title">VEXIVO Marketplace - High-Level Runtime Architecture</title>
        <desc id="archify-diagram-description">An interactive runtime architecture diagram generated for VEXIVO E-Commerce Marketplace.</desc>
        <!-- Definitions -->
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" class="m-default" />
          </marker>
          <marker id="arrowhead-emphasis" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" class="m-emphasis" />
          </marker>
          <marker id="arrowhead-security" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" class="m-security" />
          </marker>
          <marker id="arrowhead-dashed" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" class="m-dashed" />
          </marker>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" class="c-grid" stroke-width="0.5"/>
          </pattern>
        </defs>

        <!-- Background Grid -->
        <rect width="100%" height="100%" fill="url(#grid)" />

        <!-- Boundaries (behind everything) -->
        <rect data-graph-role="structural-frame" data-composition-frame-kind="region" data-composition-frame-id="0" data-composition-frame-label="Client Tier (React 18 + Vite SPA)" x="30" y="50" width="310" height="570" rx="12" class="c-region" stroke-width="1"/>

        <rect data-graph-role="structural-frame" data-composition-frame-kind="region" data-composition-frame-id="1" data-composition-frame-label="API Gateway &amp; Security Tier (Node 24 + Express :5000)" x="370" y="50" width="300" height="570" rx="12" class="c-region" stroke-width="1"/>

        <rect data-graph-role="structural-frame" data-composition-frame-kind="region" data-composition-frame-id="2" data-composition-frame-label="Domain Application Tier (Modular Controllers)" x="700" y="50" width="330" height="570" rx="12" class="c-region" stroke-width="1"/>

        <rect data-graph-role="structural-frame" data-composition-frame-kind="security-group" data-composition-frame-id="3" data-composition-frame-label="Persistence &amp; Cloud Storage" x="1060" y="50" width="220" height="570" rx="8" class="c-security-group" stroke-width="1"/>

        <rect data-graph-role="structural-frame" data-composition-frame-kind="region" data-composition-frame-id="4" data-composition-frame-label="Observability Plane (Pino &amp; Sentry)" x="1310" y="50" width="220" height="570" rx="12" class="c-region" stroke-width="1"/>

        <!-- Connection paths (before components for correct z-order) -->
        <!-- 1. browser to storefront_spa -->
        <g data-graph-role="automatic-crossover" style="--step:0">
          <path data-graph-role="automatic-crossover-underlay" d="M 175 144 L 175 180" fill="none" stroke="var(--mask)" stroke-width="5.8" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="browser" data-edge-to="storefront_spa" data-edge-label="HTTPS Web Shopper" data-edge-key="0" d="M 175 144 L 175 180" class="a-emphasis" stroke-width="1.8" marker-end="url(#arrowhead-emphasis)"/>
        </g>

        <!-- 2. browser to portals -->
        <g data-graph-role="automatic-crossover" style="--step:1">
          <path data-graph-role="automatic-crossover-underlay" d="M 285 112 Q 305 112 305 200 L 305 272 Q 305 292 285 292 L 285 292" fill="none" stroke="var(--mask)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="browser" data-edge-to="portals" data-edge-label="Admin/Seller Auth" data-edge-key="1" d="M 285 112 Q 305 112 305 200 L 305 272 Q 305 292 285 292" class="a-default" stroke-width="1.5" marker-end="url(#arrowhead)"/>
        </g>

        <!-- 3. browser to delivery_portal -->
        <g data-graph-role="automatic-crossover" style="--step:2">
          <path data-graph-role="automatic-crossover-underlay" d="M 65 112 Q 45 112 45 250 L 45 382 Q 45 402 65 402 L 65 402" fill="none" stroke="var(--mask)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="browser" data-edge-to="delivery_portal" data-edge-label="Delivery Handshake" data-edge-key="2" d="M 65 112 Q 45 112 45 250 L 45 382 Q 45 402 65 402" class="a-default" stroke-width="1.5" marker-end="url(#arrowhead)"/>
        </g>

        <!-- 4. storefront_spa to client_sentry -->
        <g data-graph-role="automatic-crossover" style="--step:3">
          <path data-graph-role="automatic-crossover-underlay" d="M 175 244 L 175 490" fill="none" stroke="var(--mask)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="storefront_spa" data-edge-to="client_sentry" data-edge-label="Frontend Errors" data-edge-key="3" d="M 175 244 L 175 490" class="a-security" stroke-width="1.5" marker-end="url(#arrowhead-security)"/>
        </g>

        <!-- 5. storefront_spa to express_gw -->
        <g data-graph-role="automatic-crossover" style="--step:4">
          <path data-graph-role="automatic-crossover-underlay" d="M 285 212 L 400 212" fill="none" stroke="var(--mask)" stroke-width="5.8" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="storefront_spa" data-edge-to="express_gw" data-edge-label="Axios /api/v1 + X-Request-Id" data-edge-key="4" d="M 285 212 L 400 212" class="a-emphasis" stroke-width="1.8" marker-end="url(#arrowhead-emphasis)"/>
        </g>

        <!-- 6. portals to express_gw -->
        <g data-graph-role="automatic-crossover" style="--step:5">
          <path data-graph-role="automatic-crossover-underlay" d="M 285 300 Q 340 300 340 230 L 400 230" fill="none" stroke="var(--mask)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="portals" data-edge-to="express_gw" data-edge-label="Admin/Seller APIs" data-edge-key="5" d="M 285 300 Q 340 300 340 230 L 400 230" class="a-default" stroke-width="1.5" marker-end="url(#arrowhead)"/>
        </g>

        <!-- 7. delivery_portal to express_gw -->
        <g data-graph-role="automatic-crossover" style="--step:6">
          <path data-graph-role="automatic-crossover-underlay" d="M 285 410 Q 350 410 350 250 L 400 250" fill="none" stroke="var(--mask)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="delivery_portal" data-edge-to="express_gw" data-edge-label="Verify OTP API" data-edge-key="6" d="M 285 410 Q 350 410 350 250 L 400 250" class="a-default" stroke-width="1.5" marker-end="url(#arrowhead)"/>
        </g>

        <!-- 8. express_gw to request_corr -->
        <g data-graph-role="automatic-crossover" style="--step:7">
          <path data-graph-role="automatic-crossover-underlay" d="M 515 254 L 515 280" fill="none" stroke="var(--mask)" stroke-width="5.8" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="express_gw" data-edge-to="request_corr" data-edge-label="UUID X-Request-Id" data-edge-key="7" d="M 515 254 L 515 280" class="a-emphasis" stroke-width="1.8" marker-end="url(#arrowhead-emphasis)"/>
        </g>

        <!-- 9. request_corr to pino_http -->
        <g data-graph-role="automatic-crossover" style="--step:8">
          <path data-graph-role="automatic-crossover-underlay" d="M 515 344 L 515 370" fill="none" stroke="var(--mask)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="request_corr" data-edge-to="pino_http" data-edge-label="Latency Tracking" data-edge-key="8" d="M 515 344 L 515 370" class="a-default" stroke-width="1.5" marker-end="url(#arrowhead)"/>
        </g>

        <!-- 10. pino_http to auth_middleware -->
        <g data-graph-role="automatic-crossover" style="--step:9">
          <path data-graph-role="automatic-crossover-underlay" d="M 515 434 L 515 460" fill="none" stroke="var(--mask)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="pino_http" data-edge-to="auth_middleware" data-edge-label="Redact Credentials" data-edge-key="9" d="M 515 434 L 515 460" class="a-security" stroke-width="1.5" marker-end="url(#arrowhead-security)"/>
        </g>

        <!-- 11. auth_middleware to auth_controller -->
        <g data-graph-role="automatic-crossover" style="--step:10">
          <path data-graph-role="automatic-crossover-underlay" d="M 630 492 Q 680 492 680 132 L 730 132" fill="none" stroke="var(--mask)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="auth_middleware" data-edge-to="auth_controller" data-edge-label="JWT Claims Validated" data-edge-key="10" d="M 630 492 Q 680 492 680 132 L 730 132" class="a-security" stroke-width="1.5" marker-end="url(#arrowhead-security)"/>
        </g>

        <!-- 12. express_gw to catalog_controller -->
        <g data-graph-role="automatic-crossover" style="--step:11">
          <path data-graph-role="automatic-crossover-underlay" d="M 630 200 L 730 200" fill="none" stroke="var(--mask)" stroke-width="5.8" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="express_gw" data-edge-to="catalog_controller" data-edge-label="GET /api/products" data-edge-key="11" d="M 630 200 L 730 200" class="a-emphasis" stroke-width="1.8" marker-end="url(#arrowhead-emphasis)"/>
        </g>

        <!-- 13. express_gw to order_controller -->
        <g data-graph-role="automatic-crossover" style="--step:12">
          <path data-graph-role="automatic-crossover-underlay" d="M 630 220 Q 675 220 675 292 L 730 292" fill="none" stroke="var(--mask)" stroke-width="5.8" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="express_gw" data-edge-to="order_controller" data-edge-label="POST /api/orders/checkout" data-edge-key="12" d="M 630 220 Q 675 220 675 292 L 730 292" class="a-emphasis" stroke-width="1.8" marker-end="url(#arrowhead-emphasis)"/>
        </g>

        <!-- 14. express_gw to fleet_controller -->
        <g data-graph-role="automatic-crossover" style="--step:13">
          <path data-graph-role="automatic-crossover-underlay" d="M 630 240 Q 675 240 675 392 L 730 392" fill="none" stroke="var(--mask)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="express_gw" data-edge-to="fleet_controller" data-edge-label="Fleet Routes &amp; Hubs" data-edge-key="13" d="M 630 240 Q 675 240 675 392 L 730 392" class="a-default" stroke-width="1.5" marker-end="url(#arrowhead)"/>
        </g>

        <!-- 15. express_gw to seller_controller -->
        <g data-graph-role="automatic-crossover" style="--step:14">
          <path data-graph-role="automatic-crossover-underlay" d="M 580 254 Q 580 520 730 520" fill="none" stroke="var(--mask)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="express_gw" data-edge-to="seller_controller" data-edge-label="Vendor Inventory &amp; KYC" data-edge-key="14" d="M 580 254 Q 580 520 730 520" class="a-default" stroke-width="1.5" marker-end="url(#arrowhead)"/>
        </g>

        <!-- 16. catalog_controller to mongodb -->
        <g data-graph-role="automatic-crossover" style="--step:15">
          <path data-graph-role="automatic-crossover-underlay" d="M 1000 200 L 1090 200" fill="none" stroke="var(--mask)" stroke-width="5.8" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="catalog_controller" data-edge-to="mongodb" data-edge-label="477 Multi-Vendor SKUs" data-edge-key="15" d="M 1000 200 L 1090 200" class="a-emphasis" stroke-width="1.8" marker-end="url(#arrowhead-emphasis)"/>
        </g>

        <!-- 17. order_controller to mongodb -->
        <g data-graph-role="automatic-crossover" style="--step:16">
          <path data-graph-role="automatic-crossover-underlay" d="M 1000 292 Q 1045 292 1045 220 L 1090 220" fill="none" stroke="var(--mask)" stroke-width="5.8" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="order_controller" data-edge-to="mongodb" data-edge-label="Atomic Transaction &amp; Stock" data-edge-key="16" d="M 1000 292 Q 1045 292 1045 220 L 1090 220" class="a-emphasis" stroke-width="1.8" marker-end="url(#arrowhead-emphasis)"/>
        </g>

        <!-- 18. catalog_controller to supabase -->
        <g data-graph-role="automatic-crossover" style="--step:17">
          <path data-graph-role="automatic-crossover-underlay" d="M 1000 220 Q 1045 220 1045 320 L 1090 320" fill="none" stroke="var(--mask)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="catalog_controller" data-edge-to="supabase" data-edge-label="Product Media &amp; CDN CDN" data-edge-key="17" d="M 1000 220 Q 1045 220 1045 320 L 1090 320" class="a-default" stroke-width="1.5" marker-end="url(#arrowhead)"/>
        </g>

        <!-- 19. auth_controller to sms_gateway -->
        <g data-graph-role="automatic-crossover" style="--step:18">
          <path data-graph-role="automatic-crossover-underlay" d="M 1000 132 Q 1060 132 1060 440 L 1090 440" fill="none" stroke="var(--mask)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="auth_controller" data-edge-to="sms_gateway" data-edge-label="6-Digit OTP Dispatch" data-edge-key="18" d="M 1000 132 Q 1060 132 1060 440 L 1090 440" class="a-default" stroke-width="1.5" marker-end="url(#arrowhead)"/>
        </g>

        <!-- 20. fleet_controller to sms_gateway -->
        <g data-graph-role="automatic-crossover" style="--step:19">
          <path data-graph-role="automatic-crossover-underlay" d="M 1000 400 Q 1045 400 1045 460 L 1090 460" fill="none" stroke="var(--mask)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="fleet_controller" data-edge-to="sms_gateway" data-edge-label="Delivery Handshake OTP" data-edge-key="19" d="M 1000 400 Q 1045 400 1045 460 L 1090 460" class="a-default" stroke-width="1.5" marker-end="url(#arrowhead)"/>
        </g>

        <!-- 21. pino_http to pino_logger -->
        <g data-graph-role="automatic-crossover" style="--step:20">
          <path data-graph-role="automatic-crossover-underlay" d="M 630 400 Q 670 605 1340 605 L 1400 605 Q 1420 605 1420 280 L 1420 280" fill="none" stroke="var(--mask)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="pino_http" data-edge-to="pino_logger" data-edge-label="JSON Stream + ReqId" data-edge-key="20" d="M 630 400 Q 670 605 1340 605 L 1400 605 Q 1420 605 1420 280" class="a-default" stroke-width="1.5" marker-end="url(#arrowhead)"/>
        </g>

        <!-- 22. express_gw to sentry_backend -->
        <g data-graph-role="automatic-crossover" style="--step:21">
          <path data-graph-role="automatic-crossover-underlay" d="M 515 190 Q 515 90 950 90 L 1380 90 Q 1420 90 1420 370 L 1420 370" fill="none" stroke="var(--mask)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="express_gw" data-edge-to="sentry_backend" data-edge-label="5xx Exception Tracking" data-edge-key="21" d="M 515 190 Q 515 90 950 90 L 1380 90 Q 1420 90 1420 370" class="a-security" stroke-width="1.5" marker-end="url(#arrowhead-security)"/>
        </g>

        <!-- 23. pino_logger to sentry_backend -->
        <g data-graph-role="automatic-crossover" style="--step:22">
          <path data-graph-role="automatic-crossover-underlay" d="M 1420 274 L 1420 370" fill="none" stroke="var(--mask)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
          <path data-edge-from="pino_logger" data-edge-to="sentry_backend" data-edge-label="Error Breadcrumbs" data-edge-key="22" d="M 1420 274 L 1420 370" class="a-dashed" stroke-width="1.5" marker-end="url(#arrowhead-dashed)"/>
        </g>

        <!-- Components (Tier 1: Client) -->
        <g id="node-browser" data-node-id="browser" data-node-label="Client Devices" tabindex="0" role="button" aria-label="Focus Client Devices, Desktop &amp; Mobile Shoppers" aria-pressed="false" data-node-kind="external" data-node-sublabel="Desktop &amp; Mobile Shoppers" data-node-context="Client Tier (React 18 + Vite SPA)">
          <title>Client Devices · Desktop &amp; Mobile Shoppers · Client Tier</title>
          <rect x="65" y="80" width="220" height="64" rx="6" class="c-mask"/>
          <rect x="65" y="80" width="220" height="64" rx="6" class="c-external" stroke-width="1.5"/>
          <g aria-hidden="true" data-semantic-sigil="external" class="semantic-sigil s-external" transform="translate(73 88) scale(0.6875)">
            <rect x="2.5" y="5" width="8.5" height="8" rx="1.5"/>
            <path d="M8 2.5h5.5V8M13.5 2.5 7.5 8.5"/>
          </g>
          <text data-node-label="" data-detail-anchor="" x="175" y="108" class="t-primary" font-size="11.5" font-weight="600" text-anchor="middle">Client Devices</text>
          <text data-detail="context" x="175" y="126" class="t-muted" font-size="8.8" text-anchor="middle">Desktop &amp; Mobile Shoppers</text>
        </g>

        <g id="node-storefront_spa" data-node-id="storefront_spa" data-node-label="VEXIVO Storefront SPA" tabindex="0" role="button" aria-label="Focus VEXIVO Storefront SPA, React 18, Vite 5, Tailwind CSS" aria-pressed="false" data-node-kind="frontend" data-node-sublabel="React 18, Vite 5, Tailwind CSS" data-node-context="Client Tier (React 18 + Vite SPA)">
          <title>VEXIVO Storefront SPA · React 18, Vite 5, Tailwind CSS · Client Tier</title>
          <rect x="65" y="180" width="220" height="64" rx="6" class="c-mask"/>
          <rect x="65" y="180" width="220" height="64" rx="6" class="c-frontend" stroke-width="1.5"/>
          <g aria-hidden="true" data-semantic-sigil="frontend" class="semantic-sigil s-frontend" transform="translate(73 188) scale(0.6875)">
            <rect x="2" y="3" width="12" height="10" rx="2"/>
            <path d="M2 6.5h12"/>
            <circle cx="4.1" cy="4.8" r=".7" class="sigil-fill"/>
            <circle cx="6.3" cy="4.8" r=".7" class="sigil-fill"/>
          </g>
          <text data-node-label="" data-detail-anchor="" x="175" y="208" class="t-primary" font-size="11.5" font-weight="600" text-anchor="middle">VEXIVO Storefront SPA</text>
          <text data-detail="context" x="175" y="226" class="t-muted" font-size="8.8" text-anchor="middle">React 18, Vite 5, Tailwind CSS</text>
        </g>

        <g id="node-portals" data-node-id="portals" data-node-label="Multi-Role Portals" tabindex="0" role="button" aria-label="Focus Multi-Role Portals, Admin (/admin) &amp; Seller (/account/seller)" aria-pressed="false" data-node-kind="frontend" data-node-sublabel="Admin (/admin) &amp; Seller Center" data-node-context="Client Tier (React 18 + Vite SPA)">
          <title>Multi-Role Portals · Admin (/admin) &amp; Seller Center · Client Tier</title>
          <rect x="65" y="280" width="220" height="64" rx="6" class="c-mask"/>
          <rect x="65" y="280" width="220" height="64" rx="6" class="c-frontend" stroke-width="1.5"/>
          <g aria-hidden="true" data-semantic-sigil="frontend" class="semantic-sigil s-frontend" transform="translate(73 288) scale(0.6875)">
            <rect x="2" y="3" width="12" height="10" rx="2"/>
            <path d="M2 6.5h12"/>
            <circle cx="4.1" cy="4.8" r=".7" class="sigil-fill"/>
            <circle cx="6.3" cy="4.8" r=".7" class="sigil-fill"/>
          </g>
          <text data-node-label="" data-detail-anchor="" x="175" y="308" class="t-primary" font-size="11.5" font-weight="600" text-anchor="middle">Multi-Role Portals</text>
          <text data-detail="context" x="175" y="326" class="t-muted" font-size="8.8" text-anchor="middle">Admin (/admin) &amp; Seller Center</text>
        </g>

        <g id="node-delivery_portal" data-node-id="delivery_portal" data-node-label="Delivery Fleet Portal" tabindex="0" role="button" aria-label="Focus Delivery Fleet Portal, Route Hub &amp; Customer OTP Handshake (/delivery)" aria-pressed="false" data-node-kind="frontend" data-node-sublabel="Fleet Console (/delivery)" data-node-context="Client Tier (React 18 + Vite SPA)">
          <title>Delivery Fleet Portal · Fleet Console (/delivery) · Client Tier</title>
          <rect x="65" y="380" width="220" height="64" rx="6" class="c-mask"/>
          <rect x="65" y="380" width="220" height="64" rx="6" class="c-frontend" stroke-width="1.5"/>
          <g aria-hidden="true" data-semantic-sigil="frontend" class="semantic-sigil s-frontend" transform="translate(73 388) scale(0.6875)">
            <rect x="2" y="3" width="12" height="10" rx="2"/>
            <path d="M2 6.5h12"/>
            <circle cx="4.1" cy="4.8" r=".7" class="sigil-fill"/>
            <circle cx="6.3" cy="4.8" r=".7" class="sigil-fill"/>
          </g>
          <text data-node-label="" data-detail-anchor="" x="175" y="408" class="t-primary" font-size="11.5" font-weight="600" text-anchor="middle">Delivery Fleet Portal</text>
          <text data-detail="context" x="175" y="426" class="t-muted" font-size="8.8" text-anchor="middle">Fleet Console (/delivery)</text>
        </g>

        <g id="node-client_sentry" data-node-id="client_sentry" data-node-label="Frontend Sentry SDK" tabindex="0" role="button" aria-label="Focus Frontend Sentry SDK, @sentry/react v11 ErrorBoundary &amp; Traces" aria-pressed="false" data-node-kind="security" data-node-sublabel="@sentry/react v11 &amp; Traces" data-node-context="Client Tier (React 18 + Vite SPA)">
          <title>Frontend Sentry SDK · @sentry/react v11 &amp; Traces · Client Tier</title>
          <rect x="65" y="490" width="220" height="64" rx="6" class="c-mask"/>
          <rect x="65" y="490" width="220" height="64" rx="6" class="c-security" stroke-width="1.5"/>
          <g aria-hidden="true" data-semantic-sigil="security" class="semantic-sigil s-security" transform="translate(73 498) scale(0.6875)">
            <path d="M8 2.2 13 4v3.5c0 3.1-1.8 5.4-5 6.5-3.2-1.1-5-3.4-5-6.5V4Z"/>
            <path d="m5.8 8 1.5 1.5 3-3"/>
          </g>
          <text data-node-label="" data-detail-anchor="" x="175" y="518" class="t-primary" font-size="11.5" font-weight="600" text-anchor="middle">Frontend Sentry SDK</text>
          <text data-detail="context" x="175" y="536" class="t-muted" font-size="8.8" text-anchor="middle">@sentry/react v11 &amp; Traces</text>
        </g>

        <!-- Components (Tier 2: Gateway & Security) -->
        <g id="node-express_gw" data-node-id="express_gw" data-node-label="Express API Gateway" tabindex="0" role="button" aria-label="Focus Express API Gateway, CORS, Helmet, RateLimiter, MongoSanitize" aria-pressed="false" data-node-kind="security" data-node-sublabel="Node.js 24 + Express 4.21 :5000" data-node-context="API Gateway &amp; Security Tier">
          <title>Express API Gateway · Node.js 24 + Express 4.21 :5000 · Gateway Tier</title>
          <rect x="400" y="190" width="230" height="64" rx="6" class="c-mask"/>
          <rect x="400" y="190" width="230" height="64" rx="6" class="c-security" stroke-width="1.5"/>
          <g aria-hidden="true" data-semantic-sigil="security" class="semantic-sigil s-security" transform="translate(408 198) scale(0.6875)">
            <path d="M8 2.2 13 4v3.5c0 3.1-1.8 5.4-5 6.5-3.2-1.1-5-3.4-5-6.5V4Z"/>
            <path d="m5.8 8 1.5 1.5 3-3"/>
          </g>
          <text data-node-label="" data-detail-anchor="" x="515" y="218" class="t-primary" font-size="11.5" font-weight="600" text-anchor="middle">Express API Gateway</text>
          <text data-detail="context" x="515" y="236" class="t-muted" font-size="8.8" text-anchor="middle">Node.js 24 + Express 4.21 :5000</text>
        </g>

        <g id="node-request_corr" data-node-id="request_corr" data-node-label="Request Correlation Engine" tabindex="0" role="button" aria-label="Focus Request Correlation Engine, UUIDv4 X-Request-Id &amp; AsyncLocalStorage" aria-pressed="false" data-node-kind="backend" data-node-sublabel="UUIDv4 X-Request-Id Generator" data-node-context="API Gateway &amp; Security Tier">
          <title>Request Correlation Engine · UUIDv4 X-Request-Id Generator · Gateway Tier</title>
          <rect x="400" y="280" width="230" height="64" rx="6" class="c-mask"/>
          <rect x="400" y="280" width="230" height="64" rx="6" class="c-backend" stroke-width="1.5"/>
          <g aria-hidden="true" data-semantic-sigil="backend" class="semantic-sigil s-backend" transform="translate(408 288) scale(0.6875)">
            <path d="M6 3 3 8l3 5M10 3l3 5-3 5"/>
          </g>
          <text data-node-label="" data-detail-anchor="" x="515" y="308" class="t-primary" font-size="11.5" font-weight="600" text-anchor="middle">Request Correlation Engine</text>
          <text data-detail="context" x="515" y="326" class="t-muted" font-size="8.8" text-anchor="middle">UUIDv4 X-Request-Id Generator</text>
        </g>

        <g id="node-pino_http" data-node-id="pino_http" data-node-label="Pino HTTP Logger" tabindex="0" role="button" aria-label="Focus Pino HTTP Logger, Latency Tracking &amp; Header Redaction" aria-pressed="false" data-node-kind="backend" data-node-sublabel="Latency Tracker &amp; Redactor" data-node-context="API Gateway &amp; Security Tier">
          <title>Pino HTTP Logger · Latency Tracker &amp; Redactor · Gateway Tier</title>
          <rect x="400" y="370" width="230" height="64" rx="6" class="c-mask"/>
          <rect x="400" y="370" width="230" height="64" rx="6" class="c-backend" stroke-width="1.5"/>
          <g aria-hidden="true" data-semantic-sigil="backend" class="semantic-sigil s-backend" transform="translate(408 378) scale(0.6875)">
            <path d="M6 3 3 8l3 5M10 3l3 5-3 5"/>
          </g>
          <text data-node-label="" data-detail-anchor="" x="515" y="398" class="t-primary" font-size="11.5" font-weight="600" text-anchor="middle">Pino HTTP Logger</text>
          <text data-detail="context" x="515" y="416" class="t-muted" font-size="8.8" text-anchor="middle">Latency Tracker &amp; Redactor</text>
        </g>

        <g id="node-auth_middleware" data-node-id="auth_middleware" data-node-label="JWT Auth &amp; RBAC Guard" tabindex="0" role="button" aria-label="Focus JWT Auth &amp; RBAC Guard, Bearer Token Verification &amp; Role Check" aria-pressed="false" data-node-kind="security" data-node-sublabel="Bearer Token Verification &amp; Roles" data-node-context="API Gateway &amp; Security Tier">
          <title>JWT Auth &amp; RBAC Guard · Bearer Token Verification &amp; Roles · Gateway Tier</title>
          <rect x="400" y="460" width="230" height="64" rx="6" class="c-mask"/>
          <rect x="400" y="460" width="230" height="64" rx="6" class="c-security" stroke-width="1.5"/>
          <g aria-hidden="true" data-semantic-sigil="security" class="semantic-sigil s-security" transform="translate(408 468) scale(0.6875)">
            <path d="M8 2.2 13 4v3.5c0 3.1-1.8 5.4-5 6.5-3.2-1.1-5-3.4-5-6.5V4Z"/>
            <path d="m5.8 8 1.5 1.5 3-3"/>
          </g>
          <text data-node-label="" data-detail-anchor="" x="515" y="488" class="t-primary" font-size="11.5" font-weight="600" text-anchor="middle">JWT Auth &amp; RBAC Guard</text>
          <text data-detail="context" x="515" y="506" class="t-muted" font-size="8.8" text-anchor="middle">Bearer Token Verification &amp; Roles</text>
        </g>

        <!-- Components (Tier 3: Domain Controllers) -->
        <g id="node-auth_controller" data-node-id="auth_controller" data-node-label="Auth &amp; Account Engine" tabindex="0" role="button" aria-label="Focus Auth &amp; Account Engine, JWT 30-Day, Bcrypt Hash, Indian Phone OTP (+91)" aria-pressed="false" data-node-kind="backend" data-node-sublabel="JWT 30-Day, Bcrypt, Phone OTP" data-node-context="Domain Application Tier">
          <title>Auth &amp; Account Engine · JWT 30-Day, Bcrypt, Phone OTP · Domain Tier</title>
          <rect x="730" y="100" width="270" height="64" rx="6" class="c-mask"/>
          <rect x="730" y="100" width="270" height="64" rx="6" class="c-backend" stroke-width="1.5"/>
          <g aria-hidden="true" data-semantic-sigil="backend" class="semantic-sigil s-backend" transform="translate(738 108) scale(0.6875)">
            <path d="M6 3 3 8l3 5M10 3l3 5-3 5"/>
          </g>
          <text data-node-label="" data-detail-anchor="" x="865" y="128" class="t-primary" font-size="11.5" font-weight="600" text-anchor="middle">Auth &amp; Account Engine</text>
          <text data-detail="context" x="865" y="146" class="t-muted" font-size="8.8" text-anchor="middle">JWT 30-Day, Bcrypt, Phone OTP</text>
        </g>

        <g id="node-catalog_controller" data-node-id="catalog_controller" data-node-label="Product Catalog Engine" tabindex="0" role="button" aria-label="Focus Product Catalog Engine, 477 Multi-Vendor SKUs, Regex Search, Category Tree" aria-pressed="false" data-node-kind="backend" data-node-sublabel="477 Multi-Vendor SKUs &amp; Search" data-node-context="Domain Application Tier">
          <title>Product Catalog Engine · 477 Multi-Vendor SKUs &amp; Search · Domain Tier</title>
          <rect x="730" y="190" width="270" height="64" rx="6" class="c-mask"/>
          <rect x="730" y="190" width="270" height="64" rx="6" class="c-backend" stroke-width="1.5"/>
          <g aria-hidden="true" data-semantic-sigil="backend" class="semantic-sigil s-backend" transform="translate(738 198) scale(0.6875)">
            <path d="M6 3 3 8l3 5M10 3l3 5-3 5"/>
          </g>
          <text data-node-label="" data-detail-anchor="" x="865" y="218" class="t-primary" font-size="11.5" font-weight="600" text-anchor="middle">Product Catalog Engine</text>
          <text data-detail="context" x="865" y="236" class="t-muted" font-size="8.8" text-anchor="middle">477 Multi-Vendor SKUs &amp; Search</text>
        </g>

        <g id="node-order_controller" data-node-id="order_controller" data-node-label="Order &amp; Checkout Controller" tabindex="0" role="button" aria-label="Focus Order &amp; Checkout Controller, Server Price Validation, Slug Fallback, Idempotency" aria-pressed="false" data-node-kind="backend" data-node-sublabel="Server Price Auth &amp; Idempotency" data-node-context="Domain Application Tier">
          <title>Order &amp; Checkout Controller · Server Price Auth &amp; Idempotency · Domain Tier</title>
          <rect x="730" y="280" width="270" height="64" rx="6" class="c-mask"/>
          <rect x="730" y="280" width="270" height="64" rx="6" class="c-backend" stroke-width="1.5"/>
          <g aria-hidden="true" data-semantic-sigil="backend" class="semantic-sigil s-backend" transform="translate(738 288) scale(0.6875)">
            <path d="M6 3 3 8l3 5M10 3l3 5-3 5"/>
          </g>
          <text data-node-label="" data-detail-anchor="" x="865" y="308" class="t-primary" font-size="11.5" font-weight="600" text-anchor="middle">Order &amp; Checkout Controller</text>
          <text data-detail="context" x="865" y="326" class="t-muted" font-size="8.8" text-anchor="middle">Server Price Auth &amp; Idempotency</text>
        </g>

        <g id="node-fleet_controller" data-node-id="fleet_controller" data-node-label="Logistics &amp; Fleet Engine" tabindex="0" role="button" aria-label="Focus Logistics &amp; Fleet Engine, Delivery Hubs, Pincode Routing, OTP Handshake" aria-pressed="false" data-node-kind="backend" data-node-sublabel="Hub Routing &amp; OTP Handshake" data-node-context="Domain Application Tier">
          <title>Logistics &amp; Fleet Engine · Hub Routing &amp; OTP Handshake · Domain Tier</title>
          <rect x="730" y="370" width="270" height="64" rx="6" class="c-mask"/>
          <rect x="730" y="370" width="270" height="64" rx="6" class="c-backend" stroke-width="1.5"/>
          <g aria-hidden="true" data-semantic-sigil="backend" class="semantic-sigil s-backend" transform="translate(738 378) scale(0.6875)">
            <path d="M6 3 3 8l3 5M10 3l3 5-3 5"/>
          </g>
          <text data-node-label="" data-detail-anchor="" x="865" y="398" class="t-primary" font-size="11.5" font-weight="600" text-anchor="middle">Logistics &amp; Fleet Engine</text>
          <text data-detail="context" x="865" y="416" class="t-muted" font-size="8.8" text-anchor="middle">Hub Routing &amp; OTP Handshake</text>
        </g>

        <g id="node-seller_controller" data-node-id="seller_controller" data-node-label="Seller &amp; Vendor Engine" tabindex="0" role="button" aria-label="Focus Seller &amp; Vendor Engine, Inventory Ledger, Multi-Tier Commission &amp; KYC" aria-pressed="false" data-node-kind="backend" data-node-sublabel="Inventory Ledger &amp; Commissions" data-node-context="Domain Application Tier">
          <title>Seller &amp; Vendor Engine · Inventory Ledger &amp; Commissions · Domain Tier</title>
          <rect x="730" y="480" width="270" height="64" rx="6" class="c-mask"/>
          <rect x="730" y="480" width="270" height="64" rx="6" class="c-backend" stroke-width="1.5"/>
          <g aria-hidden="true" data-semantic-sigil="backend" class="semantic-sigil s-backend" transform="translate(738 488) scale(0.6875)">
            <path d="M6 3 3 8l3 5M10 3l3 5-3 5"/>
          </g>
          <text data-node-label="" data-detail-anchor="" x="865" y="508" class="t-primary" font-size="11.5" font-weight="600" text-anchor="middle">Seller &amp; Vendor Engine</text>
          <text data-detail="context" x="865" y="526" class="t-muted" font-size="8.8" text-anchor="middle">Inventory Ledger &amp; Commissions</text>
        </g>

        <!-- Components (Tier 4: Persistence & Cloud) -->
        <g id="node-mongodb" data-node-id="mongodb" data-node-label="Dual-Mode MongoDB" tabindex="0" role="button" aria-label="Focus Dual-Mode MongoDB, Primary Local :27017 + MongoMemoryServer Fallback" aria-pressed="false" data-node-kind="database" data-node-sublabel="Local :27017 + Memory Fallback" data-node-context="Persistence &amp; Cloud Storage">
          <title>Dual-Mode MongoDB · Local :27017 + Memory Fallback · Persistence Tier</title>
          <rect x="1090" y="170" width="165" height="70" rx="6" class="c-mask"/>
          <rect x="1090" y="170" width="165" height="70" rx="6" class="c-database" stroke-width="1.5"/>
          <g aria-hidden="true" data-semantic-sigil="database" class="semantic-sigil s-database" transform="translate(1098 178) scale(0.6875)">
            <ellipse cx="8" cy="4" rx="5" ry="2"/>
            <path d="M3 4v8c0 1.1 2.2 2 5 2s5-.9 5-2V4M3 8c0 1.1 2.2 2 5 2s5-.9 5-2"/>
          </g>
          <text data-node-label="" data-detail-anchor="" x="1172" y="200" class="t-primary" font-size="11.5" font-weight="600" text-anchor="middle">Dual-Mode MongoDB</text>
          <text data-detail="context" x="1172" y="220" class="t-muted" font-size="8.8" text-anchor="middle">Local + Memory Fallback</text>
        </g>

        <g id="node-supabase" data-node-id="supabase" data-node-label="Supabase Cloud Storage" tabindex="0" role="button" aria-label="Focus Supabase Cloud Storage, Product Photos, Seller KYC Docs &amp; Media CDN" aria-pressed="false" data-node-kind="cloud" data-node-sublabel="Product Photos &amp; Media CDN" data-node-context="Persistence &amp; Cloud Storage">
          <title>Supabase Cloud Storage · Product Photos &amp; Media CDN · Persistence Tier</title>
          <rect x="1090" y="290" width="165" height="70" rx="6" class="c-mask"/>
          <rect x="1090" y="290" width="165" height="70" rx="6" class="c-cloud" stroke-width="1.5"/>
          <g aria-hidden="true" data-semantic-sigil="cloud" class="semantic-sigil s-cloud" transform="translate(1098 298) scale(0.6875)">
            <path d="M4.3 12.5h7.3a2.4 2.4 0 0 0 .2-4.8 4 4 0 0 0-7.5-1.3A3.1 3.1 0 0 0 4.3 12.5Z"/>
          </g>
          <text data-node-label="" data-detail-anchor="" x="1172" y="320" class="t-primary" font-size="11.5" font-weight="600" text-anchor="middle">Supabase Storage</text>
          <text data-detail="context" x="1172" y="340" class="t-muted" font-size="8.8" text-anchor="middle">Product Photos &amp; Media CDN</text>
        </g>

        <g id="node-sms_gateway" data-node-id="sms_gateway" data-node-label="Indian SMS Gateway" tabindex="0" role="button" aria-label="Focus Indian SMS Gateway, Fast2SMS / Twilio / Dev Mock OTP Handshake" aria-pressed="false" data-node-kind="cloud" data-node-sublabel="Fast2SMS / Twilio / Dev Mock" data-node-context="Persistence &amp; Cloud Storage">
          <title>Indian SMS Gateway · Fast2SMS / Twilio / Dev Mock · Persistence Tier</title>
          <rect x="1090" y="410" width="165" height="70" rx="6" class="c-mask"/>
          <rect x="1090" y="410" width="165" height="70" rx="6" class="c-cloud" stroke-width="1.5"/>
          <g aria-hidden="true" data-semantic-sigil="cloud" class="semantic-sigil s-cloud" transform="translate(1098 418) scale(0.6875)">
            <path d="M4.3 12.5h7.3a2.4 2.4 0 0 0 .2-4.8 4 4 0 0 0-7.5-1.3A3.1 3.1 0 0 0 4.3 12.5Z"/>
          </g>
          <text data-node-label="" data-detail-anchor="" x="1172" y="440" class="t-primary" font-size="11.5" font-weight="600" text-anchor="middle">Indian SMS Gateway</text>
          <text data-detail="context" x="1172" y="460" class="t-muted" font-size="8.8" text-anchor="middle">Fast2SMS / Twilio / Dev Mock</text>
        </g>

        <!-- Components (Tier 5: Observability) -->
        <g id="node-pino_logger" data-node-id="pino_logger" data-node-label="Pino Structured Logger" tabindex="0" role="button" aria-label="Focus Pino Structured Logger, Centralized NDJSON &amp; Credential Redaction" aria-pressed="false" data-node-kind="backend" data-node-sublabel="Structured JSON &amp; Redaction" data-node-context="Observability Plane">
          <title>Pino Structured Logger · Structured JSON &amp; Redaction · Observability Plane</title>
          <rect x="1335" y="200" width="170" height="74" rx="6" class="c-mask"/>
          <rect x="1335" y="200" width="170" height="74" rx="6" class="c-backend" stroke-width="1.5"/>
          <g aria-hidden="true" data-semantic-sigil="backend" class="semantic-sigil s-backend" transform="translate(1343 208) scale(0.6875)">
            <path d="M6 3 3 8l3 5M10 3l3 5-3 5"/>
          </g>
          <text data-node-label="" data-detail-anchor="" x="1420" y="232" class="t-primary" font-size="11.5" font-weight="600" text-anchor="middle">Pino Logger</text>
          <text data-detail="context" x="1420" y="252" class="t-muted" font-size="8.8" text-anchor="middle">Structured JSON &amp; Redaction</text>
        </g>

        <g id="node-sentry_backend" data-node-id="sentry_backend" data-node-label="Backend Sentry SDK" tabindex="0" role="button" aria-label="Focus Backend Sentry SDK, @sentry/node v11 Unhandled 5xx Tracking" aria-pressed="false" data-node-kind="security" data-node-sublabel="@sentry/node v11 Tracing" data-node-context="Observability Plane">
          <title>Backend Sentry SDK · @sentry/node v11 Tracing · Observability Plane</title>
          <rect x="1335" y="370" width="170" height="74" rx="6" class="c-mask"/>
          <rect x="1335" y="370" width="170" height="74" rx="6" class="c-security" stroke-width="1.5"/>
          <g aria-hidden="true" data-semantic-sigil="security" class="semantic-sigil s-security" transform="translate(1343 378) scale(0.6875)">
            <path d="M8 2.2 13 4v3.5c0 3.1-1.8 5.4-5 6.5-3.2-1.1-5-3.4-5-6.5V4Z"/>
            <path d="m5.8 8 1.5 1.5 3-3"/>
          </g>
          <text data-node-label="" data-detail-anchor="" x="1420" y="402" class="t-primary" font-size="11.5" font-weight="600" text-anchor="middle">Backend Sentry SDK</text>
          <text data-detail="context" x="1420" y="422" class="t-muted" font-size="8.8" text-anchor="middle">@sentry/node v11 Tracing</text>
        </g>

        <!-- Connection Labels -->
        <g data-detail="context" data-edge-from="storefront_spa" data-edge-to="express_gw" data-edge-label="Axios /api/v1 + X-Request-Id" data-edge-key="4">
          <rect x="295" y="204" width="95" height="15" rx="3" class="c-mask"/>
          <text x="342" y="215" class="t-edge-emphasis" font-size="7.8" text-anchor="middle">Axios /api/v1 + ReqId</text>
        </g>

        <g data-detail="context" data-edge-from="express_gw" data-edge-to="catalog_controller" data-edge-label="GET /api/products" data-edge-key="11">
          <rect x="640" y="192" width="78" height="15" rx="3" class="c-mask"/>
          <text x="679" y="203" class="t-edge-emphasis" font-size="7.8" text-anchor="middle">GET /api/products</text>
        </g>

        <g data-detail="context" data-edge-from="express_gw" data-edge-to="order_controller" data-edge-label="POST /api/orders/checkout" data-edge-key="12">
          <rect x="640" y="260" width="82" height="15" rx="3" class="c-mask"/>
          <text x="681" y="271" class="t-edge-emphasis" font-size="7.8" text-anchor="middle">POST Checkout</text>
        </g>

        <g data-detail="context" data-edge-from="order_controller" data-edge-to="mongodb" data-edge-label="Atomic Transaction &amp; Stock" data-edge-key="16">
          <rect x="1010" y="235" width="70" height="15" rx="3" class="c-mask"/>
          <text x="1045" y="246" class="t-edge-emphasis" font-size="7.8" text-anchor="middle">Stock Mutex</text>
        </g>

        <!-- Boundary Labels -->
        <g data-composition-frame-label-group="0">
          <text data-boundary-label="" x="40" y="68" class="t-frontend" font-size="9.8" font-weight="600">Client Tier (React 18 + Vite SPA &amp; Portals)</text>
        </g>
        <g data-composition-frame-label-group="1">
          <text data-boundary-label="" x="380" y="68" class="t-security" font-size="9.8" font-weight="600">API Gateway &amp; Security Tier (Express :5000)</text>
        </g>
        <g data-composition-frame-label-group="2">
          <text data-boundary-label="" x="710" y="68" class="t-backend" font-size="9.8" font-weight="600">Domain Application Tier (Modular Controllers)</text>
        </g>
        <g data-composition-frame-label-group="3">
          <text data-boundary-label="" x="1070" y="68" class="t-security" font-size="9.8" font-weight="600">Persistence &amp; Storage</text>
        </g>
        <g data-composition-frame-label-group="4">
          <text data-boundary-label="" x="1320" y="68" class="t-frontend" font-size="9.8" font-weight="600">Observability Plane</text>
        </g>

        <!-- Legend -->
        <g data-legend="" data-legend-bridge="">
          <text x="40" y="660" class="t-primary" font-size="12" font-weight="650">Legend</text>
          <g data-legend-semantic-kind="frontend" data-legend-kind="frontend" data-legend-label="Frontend" data-legend-x="40" data-legend-baseline="680" data-legend-width="83">
            <rect x="40" y="671" width="16" height="10" rx="2.5" class="c-frontend" stroke-width="1"/>
            <text x="62" y="680" class="t-muted" font-size="10" font-weight="500">Frontend</text>
          </g>
          <g data-legend-semantic-kind="backend" data-legend-kind="backend" data-legend-label="Backend" data-legend-x="145" data-legend-baseline="680" data-legend-width="78">
            <rect x="145" y="671" width="16" height="10" rx="2.5" class="c-backend" stroke-width="1"/>
            <text x="167" y="680" class="t-muted" font-size="10" font-weight="500">Backend</text>
          </g>
          <g data-legend-semantic-kind="database" data-legend-kind="database" data-legend-label="Database" data-legend-x="245" data-legend-baseline="680" data-legend-width="83">
            <rect x="245" y="671" width="16" height="10" rx="2.5" class="c-database" stroke-width="1"/>
            <text x="267" y="680" class="t-muted" font-size="10" font-weight="500">Database</text>
          </g>
          <g data-legend-semantic-kind="cloud" data-legend-kind="cloud" data-legend-label="Cloud" data-legend-x="350" data-legend-baseline="680" data-legend-width="68">
            <rect x="350" y="671" width="16" height="10" rx="2.5" class="c-cloud" stroke-width="1"/>
            <text x="372" y="680" class="t-muted" font-size="10" font-weight="500">Cloud</text>
          </g>
          <g data-legend-semantic-kind="security" data-legend-kind="security" data-legend-label="Security" data-legend-x="440" data-legend-baseline="680" data-legend-width="83">
            <rect x="440" y="671" width="16" height="10" rx="2.5" class="c-security" stroke-width="1"/>
            <text x="462" y="680" class="t-muted" font-size="10" font-weight="500">Security</text>
          </g>
          <g data-legend-semantic-kind="external" data-legend-kind="external" data-legend-label="External" data-legend-x="545" data-legend-baseline="680" data-legend-width="83">
            <rect x="545" y="671" width="16" height="10" rx="2.5" class="c-external" stroke-width="1"/>
            <text x="567" y="680" class="t-muted" font-size="10" font-weight="500">External</text>
          </g>
        </g>
      </svg>
`;

// Reader rail & VEXIVO Info Cards
const cardsHtml = `    <aside class="reader-rail" id="reader-rail">
    <div class="rail-controls no-print" role="toolbar" aria-label="Side panel">
      <button class="rail-control" id="rail-placement" type="button" hidden aria-label="Move panel below the diagram" title="Move panel below the diagram" data-placement="right"><span class="rail-control-icon placement" aria-hidden="true"></span></button>
      <button class="rail-control" id="rail-collapse" type="button" hidden aria-controls="reader-rail" aria-expanded="true" aria-label="Collapse side panel" title="Collapse side panel"><span class="rail-control-icon collapse" aria-hidden="true"></span></button>
    </div>
    <!-- Info Cards -->
    <div class="cards">
      <div class="card">
        <div class="card-header">
          <div class="card-dot cyan"></div>
          <h3>Client Tier (React 18 &amp; Sentry)</h3>
        </div>
        <ul>
          <li>VEXIVO Single Page App built on React 18, Vite 5, Tailwind CSS, and Context/Redux cart state</li>
          <li>Role-based portal routing: Customer Storefront, Seller Center (<code>/account/seller</code>), Admin Portal (<code>/admin</code>), and Delivery Fleet (<code>/delivery</code>)</li>
          <li>Sentry React SDK integration (<code>@sentry/react</code> v11) for client runtime crash monitoring, session breadcrumbs, and network telemetry</li>
        </ul>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-dot emerald"></div>
          <h3>API Gateway &amp; Request Correlation</h3>
        </div>
        <ul>
          <li>Node.js 24 + Express 4.21 REST Gateway listening on <code>http://127.0.0.1:5000</code></li>
          <li>Deterministic correlation middleware injects or forwards unique <code>X-Request-Id</code> UUID across the entire pipeline</li>
          <li>Pino HTTP logger automatically redacts sensitive headers, passwords, OTPs, tokens, and payment fields</li>
        </ul>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-dot rose"></div>
          <h3>Domain Controllers &amp; Security</h3>
        </div>
        <ul>
          <li>477 multi-vendor catalog SKUs with category filtering, fuzzy search, and Supabase media CDN resolution</li>
          <li>Order Checkout Controller with server-side price authentication, stock mutex, and slug fallback resilience</li>
          <li>JWT Bearer authentication (30-day expiry), Bcrypt password hashing, and Indian Phone (+91) OTP handshake via SMS Gateway</li>
        </ul>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-dot purple"></div>
          <h3>Persistence &amp; Observability Plane</h3>
        </div>
        <ul>
          <li>Dual-mode database architecture: Primary local MongoDB (<code>:27017</code>) with automatic in-memory MongoMemoryServer fallback</li>
          <li>Supabase Cloud Storage bucket for product images, seller KYC documents, and delivery signatures</li>
          <li>Centralized Pino structured JSON logging correlated directly with Sentry v11 Node.js 5xx exception tracking</li>
        </ul>
      </div>
    </div>
    <nav class="node-outline no-print" id="node-outline" hidden aria-labelledby="node-outline-title">
      <div class="node-outline-head">
        <strong id="node-outline-title">Node index</strong>
        <span class="node-outline-count" id="node-outline-count"></span>
      </div>
      <ol class="node-outline-list" id="node-outline-list"></ol>
    </nav>
    </aside>

  </div>
`;

// Assemble final HTML
const fullHtml = prefix + headerHtml + svgHtml + overlaysHtml + cardsHtml + engineJs;

const targetFile = path.resolve(__dirname, '..', 'architecture.html');
fs.writeFileSync(targetFile, fullHtml, 'utf8');
console.log('Successfully written VEXIVO Archify diagram to:', targetFile, 'Size:', fullHtml.length);

// Also write to client/public/architecture.html so it can be served by Vite
const publicFile = path.resolve(__dirname, '..', 'client', 'public', 'architecture.html');
fs.writeFileSync(publicFile, fullHtml, 'utf8');
console.log('Successfully written to client/public:', publicFile);
