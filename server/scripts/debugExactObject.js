const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const { getSupabaseClient } = require('../services/supabaseStorage');
const https = require('https');
const http = require('http');

async function debugExactObject() {
  const sb = getSupabaseClient();
  const bucket = 'vexivo-images';
  const objectPath = 'products/6aba9858ff30cb8cf4882df6/1790613593044-d240c5fdb993.png';
  const publicUrl = `https://aalvydwftpaujfgtsvng.supabase.co/storage/v1/object/public/${bucket}/${objectPath}`;

  console.log('=== EXACT SUPABASE OBJECT INSPECTION ===');
  console.log('Public URL:', publicUrl);

  // 1. Download via Supabase Storage API
  const { data: blob, error } = await sb.storage.from(bucket).download(objectPath);
  if (error) {
    console.error('Download error via Supabase API:', error.message);
  } else {
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log('\n--- 1. Download via Supabase Client ---');
    console.log('Size in bytes:', buffer.length);
    console.log('Header (hex):', buffer.slice(0, 16).toString('hex'));
    console.log('Is PNG signature (89504e470d0a1a0a)?', buffer.slice(0, 8).toString('hex') === '89504e470d0a1a0a');

    // Parse PNG dimensions from IHDR chunk (bytes 16-24)
    if (buffer.length >= 24 && buffer.slice(12, 16).toString('ascii') === 'IHDR') {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      const bitDepth = buffer[24];
      const colorType = buffer[25];
      console.log(`PNG Dimensions: ${width} x ${height}`);
      console.log(`Bit Depth: ${bitDepth}, Color Type: ${colorType} (6 = RGBA)`);
    }
  }

  // 2. Download via Public HTTP GET URL
  console.log('\n--- 2. Public HTTP GET Inspection ---');
  await new Promise((resolve) => {
    https.get(publicUrl, (res) => {
      console.log('HTTP Status Code:', res.statusCode);
      console.log('Content-Type Header:', res.headers['content-type']);
      console.log('Content-Length Header:', res.headers['content-length']);
      console.log('ETag Header:', res.headers['etag']);
      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        const full = Buffer.concat(data);
        console.log('Downloaded bytes from HTTP:', full.length);
        console.log('Base64:', full.toString('base64'));
        resolve();
      });
    }).on('error', (err) => {
      console.error('HTTP GET error:', err.message);
      resolve();
    });
  });

  // 3. Inspect Product Record in DB
  console.log('\n--- 3. Database Product Record Inspection ---');
  await new Promise((resolve) => {
    http.get('http://127.0.0.1:5000/api/products?limit=500', (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        const json = JSON.parse(d);
        const prod = json.products?.find(p => p._id === '6aba9858ff30cb8cf4882df6' || p.thumbnail?.includes('1790613593044-d240c5fdb993'));
        if (prod) {
          console.log('Found product:', prod.name);
          console.log('Product ID:', prod._id);
          console.log('Category:', prod.category);
          console.log('Thumbnail:', prod.thumbnail);
          console.log('Images:', prod.images);
        } else {
          console.log('Product not found in list. Looking for matching URL in all products...');
          const match = json.products?.find(p => JSON.stringify(p).includes('1790613593044-d240c5fdb993'));
          if (match) {
            console.log('Match found in product:', match.name, match._id);
          } else {
            console.log('No product currently references this URL.');
          }
        }
        resolve();
      });
    }).on('error', resolve);
  });
}

debugExactObject().catch(console.error);
