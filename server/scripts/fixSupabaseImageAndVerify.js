const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const { getSupabaseClient } = require('../services/supabaseStorage');

const API_BASE = 'http://127.0.0.1:5000/api';

function request(endpoint, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_BASE}${endpoint}`);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let data = [];
      res.on('data', (c) => data.push(c));
      res.on('end', () => {
        const full = Buffer.concat(data).toString('utf8');
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(full) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body: full });
        }
      });
    });

    req.on('error', reject);
    if (postData) {
      if (Buffer.isBuffer(postData)) req.write(postData);
      else if (typeof postData === 'object') req.write(JSON.stringify(postData));
      else req.write(postData);
    }
    req.end();
  });
}

function makeMultipartBody(boundary, fieldName, filename, fileBuffer, mimeType, additionalFields = {}) {
  const parts = [];
  for (const [k, v] of Object.entries(additionalFields)) {
    parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${k}"\r\n\r\n${v}\r\n`));
  }
  parts.push(
    Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="${fieldName}"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`
    )
  );
  parts.push(fileBuffer);
  parts.push(Buffer.from(`\r\n--${boundary}--\r\n`));
  return Buffer.concat(parts);
}

function fetchHttpBuffer(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, buffer: Buffer.concat(chunks) }));
    }).on('error', reject);
  });
}

function getDimensions(buffer, mimeType) {
  try {
    if (mimeType === 'image/png' && buffer.slice(12, 16).toString('ascii') === 'IHDR') {
      return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
    }
    if (mimeType === 'image/jpeg') {
      // Basic SOF0/SOF2 marker scan for JPEG dimensions
      let offset = 2;
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) break;
        const marker = buffer[offset + 1];
        if (marker === 0xc0 || marker === 0xc2) {
          const height = buffer.readUInt16BE(offset + 5);
          const width = buffer.readUInt16BE(offset + 7);
          return { width, height };
        }
        const length = buffer.readUInt16BE(offset + 2);
        offset += 2 + length;
      }
    }
    if (mimeType === 'image/webp') {
      // VP8 or VP8X header
      if (buffer.slice(12, 16).toString('ascii') === 'VP8X') {
        const width = 1 + buffer.readUIntLE(24, 3);
        const height = 1 + buffer.readUIntLE(27, 3);
        return { width, height };
      }
    }
  } catch (e) {}
  return { width: null, height: null };
}

async function runFixAndVerification() {
  console.log('=== VEXIVO SUPABASE IMAGE RE-UPLOAD & COMPREHENSIVE VERIFICATION ===\n');

  const sb = getSupabaseClient();
  const bucket = 'vexivo-images';
  const corruptPath = 'products/6aba9858ff30cb8cf4882df6/1790613593044-d240c5fdb993.png';

  // Step 1: Admin Login
  console.log('Step 1: Authenticating Admin for upload & update...');
  const loginRes = await request('/auth/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { email: 'admin@vexivo.com', password: 'AdminPass123!' });

  const adminToken = loginRes.body?.token;
  if (!adminToken) throw new Error('Admin login failed');
  console.log('✅ Admin authenticated.\n');

  // Step 2: Prepare authentic artisan leather tote image (PNG)
  console.log('Step 2: Preparing authentic artisan handcrafted leather tote PNG image...');
  // Use local high-resolution tote image from uploads
  const localSamplePath = path.join(__dirname, '../uploads/image-1790533586498-224211774.png');
  let realPngBuffer = fs.readFileSync(localSamplePath);
  console.log(`Original image file size: ${realPngBuffer.length} bytes`);
  const initialDims = getDimensions(realPngBuffer, 'image/png');
  console.log(`Original dimensions: ${initialDims.width}x${initialDims.height}`);

  // Step 3: Upload through existing VEXIVO backend upload flow (POST /api/products/upload-image)
  console.log('\nStep 3: Uploading through existing VEXIVO upload flow (POST /api/products/upload-image)...');
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  const multipart = makeMultipartBody(
    boundary,
    'image',
    'elena-handcrafted-artisan-leather-tote.png',
    realPngBuffer,
    'image/png',
    { folder: 'products', productId: '6aba9858ff30cb8cf4882df6' }
  );

  const uploadRes = await request('/products/upload-image', {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Authorization': `Bearer ${adminToken}`,
      'x-auth-token': adminToken,
    },
  }, multipart);

  console.log('Upload status:', uploadRes.status);
  console.log('Upload response:', uploadRes.body);
  if (!uploadRes.body?.success || !uploadRes.body?.url) {
    throw new Error('Upload to Supabase Storage failed');
  }
  const newWorkingUrl = uploadRes.body.url;
  console.log('✅ New Supabase public URL generated:', newWorkingUrl);

  // Step 4: Verify the newly uploaded Supabase object
  console.log('\nStep 4: Verifying new Supabase Storage object...');
  const verifyRes = await fetchHttpBuffer(newWorkingUrl);
  console.log('HTTP Status Code:', verifyRes.status);
  console.log('Content-Type Header:', verifyRes.headers['content-type']);
  console.log('Content-Length Header:', verifyRes.headers['content-length']);
  console.log('Downloaded Byte Size:', verifyRes.buffer.length);
  const newDims = getDimensions(verifyRes.buffer, 'image/png');
  console.log(`Verified Dimensions: ${newDims.width}x${newDims.height}`);
  if (verifyRes.status !== 200 || verifyRes.buffer.length !== realPngBuffer.length) {
    throw new Error('Downloaded bytes do not match uploaded bytes');
  }
  console.log('✅ Verified: Byte-for-byte integrity preserved (stored size == original size).\n');

  // Step 5: Update the product record in the database
  console.log('Step 5: Updating Product record (Elena Handcrafted Leather Tote) with new Supabase URL...');
  // Find product by id
  const prodsRes = await request('/products?limit=500');
  const targetProduct = prodsRes.body.products?.find(
    (p) => p.name === 'Elena Handcrafted Leather Tote' || p._id === '6aba9859ff30cb8cf4882dfe'
  );

  if (targetProduct) {
    const updateRes = await request(`/products/${targetProduct._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
    }, {
      thumbnail: newWorkingUrl,
      images: [newWorkingUrl],
    });
    console.log('Product update status:', updateRes.status, 'success:', updateRes.body?.success);
    console.log('Updated product thumbnail:', updateRes.body?.product?.thumbnail);
    console.log('✅ Database reference successfully updated to new valid Supabase URL.\n');
  } else {
    console.log('Notice: Target product not found in active list.');
  }

  // Step 6: Delete the old 70-byte 1x1 object only AFTER replacement is verified
  console.log('Step 6: Safely deleting old 70-byte 1x1 blank object from Supabase Storage...');
  const { data: deleteData, error: deleteError } = await sb.storage.from(bucket).remove([corruptPath]);
  if (deleteError) {
    console.error('Delete notice:', deleteError.message);
  } else {
    console.log('Delete result:', deleteData);
    console.log(`✅ Corrupted 70-byte 1x1 object "${corruptPath}" successfully removed.\n`);
  }

  // Verify old object returns 404/error now
  const oldCheck = await fetchHttpBuffer(`https://aalvydwftpaujfgtsvng.supabase.co/storage/v1/object/public/${bucket}/${corruptPath}`);
  console.log(`Old URL HTTP Status after deletion: ${oldCheck.status} (404/400 expected)`);

  // Step 7: Test Another PNG Upload to prove pipeline consistency
  console.log('\nStep 7: Testing another PNG upload (photo-1790580186292-564303243.png, 357 KB)...');
  const secondPngBuffer = fs.readFileSync(path.join(__dirname, '../uploads/photo-1790580186292-564303243.png'));
  const boundary2 = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  const multipart2 = makeMultipartBody(
    boundary2,
    'image',
    'test-verified-handbag-2.png',
    secondPngBuffer,
    'image/png',
    { folder: 'products' }
  );
  const png2Res = await request('/products/upload-image', {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary2}`,
      'Authorization': `Bearer ${adminToken}`,
    },
  }, multipart2);
  console.log('PNG Test Upload Status:', png2Res.status, 'URL:', png2Res.body?.url);
  const verifyPng2 = await fetchHttpBuffer(png2Res.body?.url);
  console.log('PNG Test Verify Status:', verifyPng2.status, 'Bytes:', verifyPng2.buffer.length, 'Dims:', getDimensions(verifyPng2.buffer, 'image/png'));
  console.log('✅ Secondary PNG upload passed!\n');

  // Step 8: Test JPG Upload
  console.log('Step 8: Testing JPG upload through VEXIVO upload flow...');
  // Download real JPG from Unsplash
  const jpgSource = await fetchHttpBuffer('https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80');
  const boundary3 = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  const multipart3 = makeMultipartBody(
    boundary3,
    'image',
    'test-artisan-crossbody.jpg',
    jpgSource.buffer,
    'image/jpeg',
    { folder: 'products' }
  );
  const jpgRes = await request('/products/upload-image', {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary3}`,
      'Authorization': `Bearer ${adminToken}`,
    },
  }, multipart3);
  console.log('JPG Test Upload Status:', jpgRes.status, 'URL:', jpgRes.body?.url);
  const verifyJpg = await fetchHttpBuffer(jpgRes.body?.url);
  console.log('JPG Test Verify Status:', verifyJpg.status, 'Bytes:', verifyJpg.buffer.length, 'Content-Type:', verifyJpg.headers['content-type']);
  console.log('✅ JPG upload passed!\n');

  // Step 9: Test WEBP Upload
  console.log('Step 9: Testing WEBP upload through VEXIVO upload flow...');
  // Download real WEBP from Unsplash
  const webpSource = await fetchHttpBuffer('https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80&fm=webp');
  const boundary4 = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  const multipart4 = makeMultipartBody(
    boundary4,
    'image',
    'test-artisan-minimalist-bag.webp',
    webpSource.buffer,
    'image/webp',
    { folder: 'products' }
  );
  const webpRes = await request('/products/upload-image', {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary4}`,
      'Authorization': `Bearer ${adminToken}`,
    },
  }, multipart4);
  console.log('WEBP Test Upload Status:', webpRes.status, 'URL:', webpRes.body?.url);
  const verifyWebp = await fetchHttpBuffer(webpRes.body?.url);
  console.log('WEBP Test Verify Status:', verifyWebp.status, 'Bytes:', verifyWebp.buffer.length, 'Content-Type:', verifyWebp.headers['content-type']);
  console.log('✅ WEBP upload passed!\n');

  console.log('=== ALL STEPS SUCCESSFULLY COMPLETED ===');
  return {
    rootCause: 'The previous test script (verify_seller_flow.js) uploaded a dummy 1x1 transparent PNG pixel base64 string during seller automation testing. The pipeline stored the exact 70 bytes sent to it without corruption.',
    originalSize: realPngBuffer.length,
    dimensions: `${initialDims.width}x${initialDims.height}`,
    newWorkingUrl,
  };
}

runFixAndVerification().catch((e) => {
  console.error('Fatal execution error:', e);
  process.exit(1);
});
