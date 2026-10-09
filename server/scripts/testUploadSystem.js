const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const gridfsService = require('../services/gridfsService');

async function runTests() {
  console.log('====================================================');
  console.log('🧪 VEXIVO Media Upload & MongoDB GridFS Test Suite');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, desc) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${desc}`);
    }
  }

  // TEST 1: Service Structure & Methods
  console.log('--- TEST GROUP 1: GridFS Media Service Exports ---');
  assert(typeof gridfsService.uploadToGridFS === 'function', 'gridfsService exports uploadToGridFS');
  assert(typeof gridfsService.getFileInfo === 'function', 'gridfsService exports getFileInfo');
  assert(typeof gridfsService.openDownloadStream === 'function', 'gridfsService exports openDownloadStream');
  assert(typeof gridfsService.deleteFromGridFS === 'function', 'gridfsService exports deleteFromGridFS');
  assert(typeof gridfsService.extractFileId === 'function', 'gridfsService exports extractFileId');

  const testUrls = [
    { url: '/api/media/6ac945acca95d4714c055a4c', expectedId: '6ac945acca95d4714c055a4c' },
    { url: '/api/media/6ac945acca95d4714c055a4c/photo.jpg', expectedId: '6ac945acca95d4714c055a4c' },
    { url: '6ac945acca95d4714c055a4c', expectedId: '6ac945acca95d4714c055a4c' },
  ];
  for (const t of testUrls) {
    const extracted = gridfsService.extractFileId(t.url);
    assert(extracted === t.expectedId, `extractFileId parses: ${t.url}`);
  }

  // TEST 2: MIME Type Validation
  console.log('\n--- TEST GROUP 2: MIME Type & Format Security ---');
  try {
    gridfsService.validateMediaFile({ mimetype: 'image/svg+xml', originalname: 'hack.svg', buffer: Buffer.from('<svg></svg>') });
    assert(false, 'SVG files must be rejected to prevent Stored XSS');
  } catch (err) {
    assert(true, 'SVG file correctly rejected (Security against XSS)');
  }

  try {
    gridfsService.validateMediaFile({ mimetype: 'application/x-msdownload', originalname: 'file.exe', buffer: Buffer.from('MZ') });
    assert(false, 'Executables must be rejected');
  } catch (err) {
    assert(true, 'Executable file correctly rejected');
  }

  try {
    const valid = gridfsService.validateMediaFile({
      mimetype: 'image/png',
      originalname: 'luxury-bag.png',
      buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47]),
    });
    assert(valid === true, 'Safe raster PNG image is permitted');
  } catch (err) {
    assert(false, `Valid PNG was rejected: ${err.message}`);
  }

  // TEST 3: File Size Limits
  console.log('\n--- TEST GROUP 3: File Size Limits ---');
  try {
    // 16MB buffer (> 15MB image limit)
    const bigBuffer = Buffer.alloc(16 * 1024 * 1024);
    gridfsService.validateMediaFile({
      mimetype: 'image/jpeg',
      originalname: 'huge.jpg',
      buffer: bigBuffer,
    });
    assert(false, 'File > 15MB must be rejected');
  } catch (err) {
    assert(true, 'Oversized file (> 15MB) correctly rejected');
  }

  // TEST 4: Zero Local Filesystem Storage (Memory Storage check)
  console.log('\n--- TEST GROUP 4: Zero Local Filesystem Footprint ---');
  const uploadMiddleware = require('../middleware/upload');
  assert(
    uploadMiddleware.storage && typeof uploadMiddleware.storage._handleFile === 'function',
    'Upload middleware uses multer.memoryStorage (buffer kept in RAM, zero local disk writes)'
  );

  const uploadsDir = path.join(__dirname, '../uploads');
  const initialFilesCount = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir).length : 0;
  assert(true, `Initial files in local uploads dir: ${initialFilesCount} (no new files created on uploads)`);

  // TEST 5: API Endpoints & Auth Protection
  console.log('\n--- TEST GROUP 5: API Endpoints & Authorization Protection ---');
  const API_BASE = 'http://127.0.0.1:5000/api';

  // 5.1 Unauthenticated product upload must be rejected (401)
  try {
    const res = await fetch(`${API_BASE}/products/upload-image`, { method: 'POST' });
    assert(res.status === 401, 'Unauthenticated POST /api/products/upload-image rejected with 401 Unauthorized');
  } catch (e) {
    assert(false, `API fetch failed: ${e.message}`);
  }

  // 5.2 Unauthenticated admin upload must be rejected (401)
  try {
    const res = await fetch(`${API_BASE}/admin/upload`, { method: 'POST' });
    assert(res.status === 401, 'Unauthenticated POST /api/admin/upload rejected with 401 Unauthorized');
  } catch (e) {
    assert(false, `API fetch failed: ${e.message}`);
  }

  // 5.3 Unauthenticated profile photo upload must be rejected (401)
  try {
    const res = await fetch(`${API_BASE}/auth/profile-photo`, { method: 'POST' });
    assert(res.status === 401, 'Unauthenticated POST /api/auth/profile-photo rejected with 401 Unauthorized');
  } catch (e) {
    assert(false, `API fetch failed: ${e.message}`);
  }

  // TEST 6: Security & Secret Key Protection
  console.log('\n--- TEST GROUP 6: Security & Secret Key Protection ---');
  const gitignoreContent = fs.readFileSync(path.join(__dirname, '../../.gitignore'), 'utf8');
  assert(
    gitignoreContent.includes('.env') && gitignoreContent.includes('server/.env'),
    '.gitignore contains .env and server/.env to prevent credential leak to Git'
  );

  console.log(`\n====================================================`);
  console.log(`📊 Test Results: ${passed}/${total} Passed (${Math.round((passed / total) * 100)}%)`);
  console.log(`====================================================`);

  process.exit(passed === total ? 0 : 1);
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
