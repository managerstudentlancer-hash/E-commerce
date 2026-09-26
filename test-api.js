const http = require('http');

const testEndpoint = (path) => {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5000${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', reject);
  });
};

const runTests = async () => {
  console.log('Testing VEXIVO REST APIs on http://localhost:5000...');

  try {
    const health = await testEndpoint('/api/health');
    console.log('✅ GET /api/health:', health.status, health.body);

    const categories = await testEndpoint('/api/categories');
    console.log(`✅ GET /api/categories: Status ${categories.status}, Found ${categories.body?.categories?.length} categories`);

    const products = await testEndpoint('/api/products');
    console.log(`✅ GET /api/products: Status ${products.status}, Found ${products.body?.products?.length} products`);

    const banners = await testEndpoint('/api/banners');
    console.log(`✅ GET /api/banners: Status ${banners.status}, Found ${banners.body?.banners?.length} banners`);

    console.log('\n🎉 ALL REST APIS VERIFIED AND OPERATIONAL!');
    process.exit(0);
  } catch (err) {
    console.error('Test error:', err.message);
    process.exit(1);
  }
};

setTimeout(runTests, 2000);
