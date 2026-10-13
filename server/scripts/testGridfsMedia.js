const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const crypto = require('crypto');
const gridfsService = require('../services/gridfsService');

async function runGridFSTests() {
  console.log('====================================================');
  console.log('🧪 MongoDB GridFS Dedicated Verification Test Suite');
  console.log('====================================================\n');

  const connectDB = require('../config/db');
  await connectDB();

  let passed = 0;
  let total = 0;

  function assert(cond, desc) {
    total++;
    if (cond) {
      console.log(`✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${desc}`);
    }
  }

  // TEST 1: Upload a real PNG buffer
  console.log('--- TEST 1: Buffer Upload to GridFS ---');
  const samplePng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVR42mNk+M9QzwAEjDAGACUAAWcW/2WDAAAAAElFTkSuQmCC',
    'base64'
  );
  const sampleSha256 = crypto.createHash('sha256').update(samplePng).digest('hex');

  const uploadResult = await gridfsService.uploadToGridFS({
    buffer: samplePng,
    originalname: 'test-pixel.png',
    mimetype: 'image/png',
    folder: 'tests',
    entityId: 'test-entity-001',
  });

  assert(Boolean(uploadResult.fileId), `File uploaded with GridFS ID: ${uploadResult.fileId}`);
  assert(uploadResult.url === `/api/media/${uploadResult.fileId}`, `Public URL properly formatted: ${uploadResult.url}`);
  assert(uploadResult.sha256 === sampleSha256, 'Cryptographic SHA-256 matches buffer checksum');

  // TEST 2: Inspect Metadata in GridFS
  console.log('\n--- TEST 2: Read Metadata from GridFS ---');
  const fileInfo = await gridfsService.getFileInfo(uploadResult.fileId);
  assert(fileInfo !== null, 'File metadata retrieved from media.files');
  assert(fileInfo.length === samplePng.length, `Length matches (${fileInfo.length} bytes)`);
  assert(fileInfo.metadata?.folder === 'tests', 'Metadata folder preserved');
  assert(fileInfo.metadata?.entityId === 'test-entity-001', 'Metadata entityId preserved');

  // TEST 3: Stream Full Download
  console.log('\n--- TEST 3: Full Stream Download & Byte Verification ---');
  const downloadStream = gridfsService.openDownloadStream(uploadResult.fileId);
  const chunks = [];
  await new Promise((resolve, reject) => {
    downloadStream.on('data', (c) => chunks.push(c));
    downloadStream.on('end', resolve);
    downloadStream.on('error', reject);
  });
  const downloadedBuf = Buffer.concat(chunks);
  assert(downloadedBuf.equals(samplePng), 'Downloaded stream byte-identical to source buffer');

  // TEST 4: Partial Range Download (Seeking & Streaming)
  console.log('\n--- TEST 4: Partial Range Stream (Bytes 0 to 10) ---');
  const rangeStream = gridfsService.openDownloadStream(uploadResult.fileId, { start: 0, end: 11 });
  const rangeChunks = [];
  await new Promise((resolve, reject) => {
    rangeStream.on('data', (c) => rangeChunks.push(c));
    rangeStream.on('end', resolve);
    rangeStream.on('error', reject);
  });
  const rangeBuf = Buffer.concat(rangeChunks);
  assert(rangeBuf.length === 11, `Range stream returned exact requested 11 bytes (length: ${rangeBuf.length})`);
  assert(rangeBuf.equals(samplePng.subarray(0, 11)), 'Range bytes match slice of source buffer');

  // TEST 5: Delete from GridFS
  console.log('\n--- TEST 5: Deletion from GridFS ---');
  const deleted = await gridfsService.deleteFromGridFS(uploadResult.url);
  assert(deleted === true, 'File deleted by URL reference');
  const afterDelete = await gridfsService.getFileInfo(uploadResult.fileId);
  assert(afterDelete === null, 'File no longer found in media.files after deletion');

  // TEST 6: Security validations
  console.log('\n--- TEST 6: Security Format Restrictions ---');
  try {
    gridfsService.validateMediaFile({ mimetype: 'image/svg+xml', originalname: 'test.svg', buffer: Buffer.from('<svg></svg>') });
    assert(false, 'SVG must be rejected');
  } catch (e) {
    assert(true, 'SVG rejection enforced');
  }

  try {
    gridfsService.validateMediaFile({ mimetype: 'application/x-sh', originalname: 'test.sh', buffer: Buffer.from('#!/bin/sh') });
    assert(false, 'Shell scripts must be rejected');
  } catch (e) {
    assert(true, 'Script rejection enforced');
  }

  console.log(`\n====================================================`);
  console.log(`📊 GridFS Test Results: ${passed}/${total} Passed (${Math.round((passed / total) * 100)}%)`);
  console.log(`====================================================`);

  process.exit(passed === total ? 0 : 1);
}

runGridFSTests().catch((err) => {
  console.error('GridFS test suite error:', err);
  process.exit(1);
});
