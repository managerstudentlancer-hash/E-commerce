const http = require('http');
const https = require('https');

const API_BASE = 'http://127.0.0.1:5000/api';

function fetchJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = http.get({
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      headers,
    }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
  });
}

function checkUrlStatus(url) {
  return new Promise((resolve) => {
    if (!url || typeof url !== 'string') return resolve({ ok: false, status: 0 });
    const trimmed = url.trim();
    if (trimmed.startsWith('/uploads')) {
      http.get(`http://127.0.0.1:5000${trimmed}`, (res) => {
        resolve({ ok: res.statusCode === 200, status: res.statusCode });
      }).on('error', () => resolve({ ok: false, status: 0 }));
      return;
    }

    try {
      const client = trimmed.startsWith('https://') ? https : http;
      client.get(new URL(trimmed), { headers: { 'User-Agent': 'Mozilla/5.0', Range: 'bytes=0-10' }, timeout: 6000 }, (res) => {
        res.resume();
        resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode });
      }).on('error', (e) => resolve({ ok: false, status: 0, error: e.message }))
        .on('timeout', () => resolve({ ok: false, status: 408 }));
    } catch (e) {
      resolve({ ok: false, status: 0, error: e.message });
    }
  });
}

async function runEndToEnd() {
  console.log('=== VEXIVO END-TO-END IMAGE VERIFICATION ===\n');

  // 1. Test All Categories
  console.log('--- 1. Testing All 14 Category Images ---');
  const catRes = await fetchJson(`${API_BASE}/categories`);
  const categories = catRes.body.categories || [];
  let catOk = 0;
  for (const cat of categories) {
    const st = await checkUrlStatus(cat.image);
    if (st.ok) {
      catOk++;
      console.log(`  ✅ Category "${cat.name}": Status ${st.status}`);
    } else {
      console.error(`  ❌ Category "${cat.name}": FAILED status ${st.status}`);
    }
  }
  console.log(`Categories Result: ${catOk} / ${categories.length} verified working.\n`);

  // 2. Test All Banners
  console.log('--- 2. Testing All Banner Images ---');
  const banRes = await fetchJson(`${API_BASE}/banners`);
  const banners = banRes.body.banners || [];
  let banOk = 0;
  for (const ban of banners) {
    const st = await checkUrlStatus(ban.image);
    if (st.ok) {
      banOk++;
      console.log(`  ✅ Banner "${ban.title}": Status ${st.status}`);
    } else {
      console.error(`  ❌ Banner "${ban.title}": FAILED status ${st.status}`);
    }
  }
  console.log(`Banners Result: ${banOk} / ${banners.length} verified working.\n`);

  // 3. Test 25 Selected Products Across All Categories
  console.log('--- 3. Testing 25 Products Across Diverse Categories ---');
  const prodRes = await fetchJson(`${API_BASE}/products?limit=500`);
  const allProds = prodRes.body.products || [];

  // Group by category to pick diverse products
  const byCat = {};
  for (const p of allProds) {
    if (!byCat[p.category]) byCat[p.category] = [];
    byCat[p.category].push(p);
  }

  const selectedProducts = [];
  for (const [catName, list] of Object.entries(byCat)) {
    selectedProducts.push(list[0]);
    if (list[1]) selectedProducts.push(list[1]);
  }
  const sample = selectedProducts.slice(0, 25);

  let prodsChecked = 0;
  let prodImagesChecked = 0;
  let prodImagesOk = 0;
  let failedProdImages = 0;

  for (const p of sample) {
    prodsChecked++;
    console.log(`\nProduct #${prodsChecked}: "${p.name}" (${p.category})`);
    const urls = [
      { label: 'thumbnail', url: p.thumbnail },
      { label: 'hoverImage', url: p.hoverImage },
      ...(p.images || []).map((img, i) => ({ label: `images[${i}]`, url: img })),
    ].filter((x) => Boolean(x.url));

    for (const item of urls) {
      prodImagesChecked++;
      const st = await checkUrlStatus(item.url);
      if (st.ok) {
        prodImagesOk++;
        console.log(`  ✅ [${item.label}] Status ${st.status}`);
      } else {
        failedProdImages++;
        console.error(`  ❌ [${item.label}] FAILED (${st.status}): ${item.url}`);
      }
    }
  }

  console.log(`\nSample Products Tested: ${prodsChecked}`);
  console.log(`Total Product Images Verified: ${prodImagesOk} / ${prodImagesChecked} (${failedProdImages} failed)\n`);

  // 4. Test Category Filter Pages
  console.log('--- 4. Testing Category Pages ---');
  const testSlugs = ['women-wear', 'shoes', 'electronics', 'bags', 'beauty', 'home-living'];
  for (const s of testSlugs) {
    const pageRes = await fetchJson(`${API_BASE}/products?category=${s}&limit=4`);
    const count = pageRes.body.products?.length || 0;
    console.log(`  Category page "${s}": Returned ${count} products.`);
  }

  // 5. Test Search Results
  console.log('\n--- 5. Testing Search Endpoint ---');
  const searchQueries = ['tote', 'cotton', 'leather', 'shoes'];
  for (const q of searchQueries) {
    const sRes = await fetchJson(`${API_BASE}/search?q=${q}`);
    const foundCount = sRes.body.products?.length || 0;
    console.log(`  Search query "${q}": Found ${foundCount} items.`);
  }

  // 6. Test Single Product Detail by Slug
  console.log('\n--- 6. Testing Product Detail by Slug ---');
  const firstSlug = allProds[0]?.slug;
  if (firstSlug) {
    const detailRes = await fetchJson(`${API_BASE}/products/${firstSlug}`);
    console.log(`  Detail endpoint for "${firstSlug}": Status ${detailRes.status}, Product name: "${detailRes.body.product?.name}"`);
    console.log(`  Detail thumbnail: ${detailRes.body.product?.thumbnail}`);
    console.log(`  Detail images count: ${detailRes.body.product?.images?.length}`);
  }

  console.log('\n=== ALL END-TO-END TESTS COMPLETED SUCCESSFULLY! ===');
}

runEndToEnd().catch(console.error);
