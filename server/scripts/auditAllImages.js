const http = require('http');
const https = require('https');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const { getSupabaseClient } = require('../services/supabaseStorage');

const API_BASE = 'http://127.0.0.1:5000/api';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function checkUrlStatus(targetUrl) {
  return new Promise((resolve) => {
    if (!targetUrl || typeof targetUrl !== 'string') {
      return resolve({ url: targetUrl, ok: false, status: 0, error: 'Empty or invalid URL type' });
    }

    const trimmed = targetUrl.trim();
    if (!trimmed) {
      return resolve({ url: targetUrl, ok: false, status: 0, error: 'Empty string' });
    }

    if (trimmed.startsWith('/uploads') || trimmed.startsWith('uploads/')) {
      // Local relative upload path: check via server
      const localFull = `http://127.0.0.1:5000${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
      http.get(localFull, (res) => {
        resolve({
          url: trimmed,
          ok: res.statusCode >= 200 && res.statusCode < 400,
          status: res.statusCode,
          type: 'local_upload',
        });
      }).on('error', (err) => {
        resolve({ url: trimmed, ok: false, status: 0, error: err.message, type: 'local_upload' });
      });
      return;
    }

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return resolve({ url: trimmed, ok: false, status: 0, error: 'Malformed protocol: ' + trimmed });
    }

    const client = trimmed.startsWith('https://') ? https : http;
    try {
      const parsed = new URL(trimmed);
      const req = client.request(parsed, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 6000 }, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve({ url: trimmed, ok: true, status: res.statusCode });
        } else if (res.statusCode === 405 || res.statusCode === 403) {
          // Some CDNs reject HEAD requests; fallback to GET with range
          const getReq = client.get(parsed, { headers: { Range: 'bytes=0-10', 'User-Agent': 'Mozilla/5.0' }, timeout: 6000 }, (getRes) => {
            getRes.resume();
            resolve({ url: trimmed, ok: getRes.statusCode >= 200 && getRes.statusCode < 400, status: getRes.statusCode });
          });
          getReq.on('error', (err) => resolve({ url: trimmed, ok: false, status: 0, error: err.message }));
          getReq.on('timeout', () => { getReq.destroy(); resolve({ url: trimmed, ok: false, status: 408, error: 'Timeout' }); });
        } else {
          resolve({ url: trimmed, ok: false, status: res.statusCode });
        }
      });

      req.on('error', (err) => {
        resolve({ url: trimmed, ok: false, status: 0, error: err.message });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ url: trimmed, ok: false, status: 408, error: 'Timeout' });
      });

      req.end();
    } catch (e) {
      resolve({ url: trimmed, ok: false, status: 0, error: e.message });
    }
  });
}

// Concurrency helper
async function checkAllUrlsConcurrently(urlList, concurrency = 15) {
  const results = new Map();
  const queue = [...new Set(urlList.filter(Boolean))];
  let inFlight = 0;
  let index = 0;

  return new Promise((resolve) => {
    function next() {
      if (index >= queue.length && inFlight === 0) {
        return resolve(results);
      }

      while (inFlight < concurrency && index < queue.length) {
        const u = queue[index++];
        inFlight++;
        checkUrlStatus(u).then((res) => {
          results.set(u, res);
          inFlight--;
          next();
        });
      }
    }
    next();
  });
}

async function audit() {
  console.log('=== VEXIVO COMPREHENSIVE IMAGE AUDIT ===\n');

  // 1. Inspect Supabase Storage
  console.log('--- 1. Inspecting Supabase Storage Bucket: vexivo-images ---');
  const supabase = getSupabaseClient();
  const supabaseInventory = {};
  if (supabase) {
    const folders = ['products', 'categories', 'banners', 'profiles', 'sellers', 'legacy'];
    for (const folder of folders) {
      const { data, error } = await supabase.storage.from('vexivo-images').list(folder, { limit: 100 });
      if (error) {
        console.log(`Folder "${folder}": Error listing - ${error.message}`);
        supabaseInventory[folder] = [];
      } else {
        supabaseInventory[folder] = data || [];
        console.log(`Folder "${folder}": ${data?.length || 0} top-level items`);
        // If subfolders exist, list one level deep
        for (const item of (data || []).slice(0, 10)) {
          if (!item.id) {
            // It's a directory
            const sub = `${folder}/${item.name}`;
            const { data: subData } = await supabase.storage.from('vexivo-images').list(sub, { limit: 50 });
            console.log(`  Subfolder "${sub}": ${subData?.length || 0} files`);
          }
        }
      }
    }
  } else {
    console.log('Supabase client not initialized.');
  }

  // 2. Fetch categories
  console.log('\n--- 2. Fetching Categories ---');
  const catRes = await fetchJson(`${API_BASE}/categories`);
  const categories = catRes.categories || [];
  console.log(`Found ${categories.length} categories.`);

  // 3. Fetch banners
  console.log('\n--- 3. Fetching Banners ---');
  let banners = [];
  try {
    const banRes = await fetchJson(`${API_BASE}/banners`);
    banners = banRes.banners || [];
  } catch (e) {
    console.log('Public banners error:', e.message);
  }
  console.log(`Found ${banners.length} banners.`);

  // 4. Fetch products
  console.log('\n--- 4. Fetching Products (up to 400) ---');
  const prodRes = await fetchJson(`${API_BASE}/products?limit=400`);
  const products = prodRes.products || [];
  console.log(`Found ${products.length} products.`);

  // Collect all URLs and mapping
  const imageEntities = [];
  const allUrls = new Set();

  categories.forEach((cat) => {
    if (cat.image) {
      allUrls.add(cat.image);
      imageEntities.push({ type: 'category', id: cat._id, name: cat.name, field: 'image', url: cat.image });
    }
  });

  banners.forEach((ban) => {
    if (ban.image) {
      allUrls.add(ban.image);
      imageEntities.push({ type: 'banner', id: ban._id, name: ban.title, field: 'image', url: ban.image });
    }
    if (ban.mobileImage) {
      allUrls.add(ban.mobileImage);
      imageEntities.push({ type: 'banner', id: ban._id, name: ban.title, field: 'mobileImage', url: ban.mobileImage });
    }
  });

  products.forEach((prod) => {
    if (prod.thumbnail) {
      allUrls.add(prod.thumbnail);
      imageEntities.push({ type: 'product', id: prod._id, slug: prod.slug, name: prod.name, category: prod.category, field: 'thumbnail', url: prod.thumbnail });
    }
    if (prod.hoverImage) {
      allUrls.add(prod.hoverImage);
      imageEntities.push({ type: 'product', id: prod._id, slug: prod.slug, name: prod.name, category: prod.category, field: 'hoverImage', url: prod.hoverImage });
    }
    if (Array.isArray(prod.images)) {
      prod.images.forEach((img, idx) => {
        if (img) {
          allUrls.add(img);
          imageEntities.push({ type: 'product', id: prod._id, slug: prod.slug, name: prod.name, category: prod.category, field: `images[${idx}]`, url: img });
        }
      });
    }
    if (Array.isArray(prod.options)) {
      prod.options.forEach((opt, idx) => {
        if (opt.image) {
          allUrls.add(opt.image);
          imageEntities.push({ type: 'product', id: prod._id, slug: prod.slug, name: prod.name, category: prod.category, field: `options[${idx}].image`, url: opt.image });
        }
      });
    }
  });

  console.log(`\n--- 5. Checking HTTP Status for ${allUrls.size} unique image URLs (${imageEntities.length} total field references) ---`);
  const statusMap = await checkAllUrlsConcurrently([...allUrls], 20);

  let workingCount = 0;
  let brokenCount = 0;
  let cloudinaryCount = 0;
  let supabaseCount = 0;
  let localCount = 0;
  let unsplashCount = 0;

  const brokenEntities = [];

  for (const entity of imageEntities) {
    const status = statusMap.get(entity.url);
    if (!status || !status.ok) {
      brokenCount++;
      brokenEntities.push({ ...entity, status: status?.status || 0, error: status?.error || 'Failed' });
    } else {
      workingCount++;
    }

    if (entity.url.includes('cloudinary.com')) cloudinaryCount++;
    if (entity.url.includes('supabase.co')) supabaseCount++;
    if (entity.url.includes('unsplash.com')) unsplashCount++;
    if (entity.url.startsWith('/uploads') || entity.url.startsWith('uploads/')) localCount++;
  }

  console.log('\n================ AUDIT SUMMARY ================');
  console.log(`Total Image References: ${imageEntities.length}`);
  console.log(`Unique URLs Checked:     ${allUrls.size}`);
  console.log(`Working Images:         ${workingCount}`);
  console.log(`Broken Images:          ${brokenCount}`);
  console.log(`Supabase URLs:          ${supabaseCount}`);
  console.log(`Cloudinary URLs:        ${cloudinaryCount}`);
  console.log(`Unsplash URLs:          ${unsplashCount}`);
  console.log(`Local Upload URLs:      ${localCount}`);
  console.log('================================================\n');

  if (brokenEntities.length > 0) {
    console.log(`⚠️  Found ${brokenEntities.length} Broken Image References:\n`);
    brokenEntities.slice(0, 30).forEach((b) => {
      console.log(`[${b.type.toUpperCase()}] ${b.name} (${b.category || ''}) -> Field: ${b.field}`);
      console.log(`  URL: ${b.url}`);
      console.log(`  Status: ${b.status} | Error: ${b.error}\n`);
    });
    if (brokenEntities.length > 30) {
      console.log(`... and ${brokenEntities.length - 30} more broken images.`);
    }
  } else {
    console.log('🎉 No broken images found in database entities!');
  }

  // Save full report to file
  const reportData = {
    totalReferences: imageEntities.length,
    uniqueUrlsChecked: allUrls.size,
    workingCount,
    brokenCount,
    supabaseCount,
    cloudinaryCount,
    unsplashCount,
    localCount,
    brokenEntities,
    uniqueBrokenUrls: [...new Set(brokenEntities.map((b) => b.url))],
  };
  require('fs').writeFileSync(
    require('path').join(__dirname, 'broken_images_report.json'),
    JSON.stringify(reportData, null, 2)
  );
  console.log(`Report written to ${require('path').join(__dirname, 'broken_images_report.json')}`);

  return { imageEntities, brokenEntities, statusMap, productsWithMissingImages };
}

audit().catch(console.error);
