const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('============================================================');
  console.log('🧪 VEXIVO AUTOMATED REGRESSION & FEATURE VERIFICATION SUITE');
  console.log('============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Zero Python Guarantee
  const fs = require('fs');
  let pyFiles = [];
  function scan(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(f => {
      if (f.name === 'node_modules' || f.name === '.git') return;
      const p = dir + '/' + f.name;
      if (f.isDirectory()) scan(p);
      else if (f.name.endsWith('.py')) pyFiles.push(p);
    });
  }
  scan('.');
  assert(pyFiles.length === 0, 'Zero Python Guarantee: 0 .py files found across entire project');

  // 2. Admin & Customer Login Authentication & Role Validation
  console.log('\n--- 1. AUTHENTICATION & ROLE CHECKS ---');
  const adminLogin = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'admin@vexivo.com', password: 'AdminPass123!' });

  assert(adminLogin.status === 200 && adminLogin.data.user && adminLogin.data.user.role === 'admin', 'Admin login succeeds and role is admin');
  const adminToken = adminLogin.data.token;

  const custLogin = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { email: 'arpit123@gmail.com', password: 'Arpit123!' });

  assert(custLogin.status === 200 && custLogin.data.user && custLogin.data.user.role === 'customer', 'Customer login succeeds and role is customer');
  const custToken = custLogin.data.token;

  // 3. Admin-Only Endpoint RBAC Protection
  const adminAccessByCust = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/dashboard',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${custToken}` }
  });
  assert(adminAccessByCust.status === 403, 'Normal customer blocked from /api/admin/dashboard with 403 Forbidden');

  const adminAccessByAdmin = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/dashboard',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert(adminAccessByAdmin.status === 200, 'Admin successfully accesses /api/admin/dashboard with 200 OK');

  // 4. Registration Role Escalation Prevention
  const registerAttempt = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Privilege Escalation Attempt',
    email: `test_hacker_${Date.now()}@example.com`,
    password: 'Password123!',
    role: 'admin' // Attempted privilege escalation
  });
  assert(registerAttempt.status === 201 && registerAttempt.data.user && registerAttempt.data.user.role === 'customer', 'Registration ignores role:admin and forces customer role');

  // 5. Indian Mobile Number Validation & OTP Flow
  console.log('\n--- 2. INDIAN MOBILE & OTP AUTHENTICATION ---');
  const invalidPhone = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/send-otp',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { phone: '1234567890' });
  assert(invalidPhone.status === 400, 'Invalid phone number (1234567890) correctly rejected with 400 Bad Request');

  const validOtpSend = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/send-otp',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { phone: '9876543210' });
  assert(validOtpSend.status === 200 && validOtpSend.data.devOtp, 'Valid Indian phone OTP dispatched successfully');
  const otpCode = validOtpSend.data.devOtp;

  const verifyOtp = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/verify-otp',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { phone: '9876543210', otp: otpCode });
  assert(verifyOtp.status === 200 && verifyOtp.data.user && (verifyOtp.data.user.role === 'customer' || verifyOtp.data.user.role === 'seller'), 'OTP verification authenticates customer/seller successfully');

  // Verify Admin phone login is prohibited
  // Give admin a phone number first
  await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/profile',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, { phone: '9999999999' });

  const adminPhoneOtpAttempt = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/send-otp',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { phone: '9999999999' });
  assert(adminPhoneOtpAttempt.status === 403, 'Mobile login strictly prohibited for administrator accounts (403 Forbidden)');

  // 6. Promotional Banner & Coupon Code Check (AUTUMN30)
  console.log('\n--- 3. PROMOTIONAL BANNER & COUPON (AUTUMN30) ---');
  const couponCheck = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/coupons/validate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${custToken}`
    }
  }, { code: 'AUTUMN30', subtotal: 100 });
  assert(couponCheck.status === 200 && couponCheck.data.discount === 30, 'Coupon AUTUMN30 validates and applies exact 30% discount (£30 on £100)');

  // 7. Multi-Seller Marketplace Ownership Enforcement
  console.log('\n--- 4. MULTI-SELLER MARKETPLACE OWNERSHIP ---');
  // Register Seller Alpha
  const sellerAReg = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Seller Alpha',
    email: `seller_a_${Date.now()}@example.com`,
    password: 'Password123!',
    isSeller: true
  });
  assert(sellerAReg.status === 201 && sellerAReg.data.user.role === 'seller', 'Seller Alpha registered with seller role');
  const sellerAToken = sellerAReg.data.token;

  // Register Seller Beta
  const sellerBReg = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    name: 'Seller Beta',
    email: `seller_b_${Date.now()}@example.com`,
    password: 'Password123!',
    isSeller: true
  });
  assert(sellerBReg.status === 201 && sellerBReg.data.user.role === 'seller', 'Seller Beta registered with seller role');
  const sellerBToken = sellerBReg.data.token;

  // Seller Alpha creates product
  const newProductRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/products',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sellerAToken}`
    }
  }, {
    name: `Alpha Artisan Silk Scarf ${Date.now()}`,
    category: 'Women Wear',
    categorySlug: 'women-wear',
    price: 49.99,
    description: 'Handcrafted pure mulberry silk scarf.',
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'],
    stock: 25
  });
  assert(newProductRes.status === 201 && newProductRes.data.product, 'Seller Alpha created product successfully');
  const alphaProdId = newProductRes.data.product._id;

  // Seller Beta tries to edit Seller Alpha's product -> 403 Forbidden
  const hijackAttempt = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/products/${alphaProdId}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sellerBToken}`
    }
  }, {
    name: 'Hijacked by Beta'
  });
  assert(hijackAttempt.status === 403, 'Cross-seller product edit rejected with 403 Forbidden');

  // Seller Alpha can edit their own product -> 200 OK
  const legitimateEdit = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/products/${alphaProdId}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sellerAToken}`
    }
  }, {
    price: 54.99
  });
  assert(legitimateEdit.status === 200 && legitimateEdit.data.product.price === 54.99, 'Seller Alpha successfully updated their own product (200 OK)');

  // 8. Strict Delivery-Verified Review System
  console.log('\n--- 5. STRICT DELIVERY-VERIFIED REVIEW SYSTEM ---');
  // Attempt review by user without delivered order -> 403 Forbidden
  const unverifiedReview = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/products/${alphaProdId}/reviews`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${custToken}`
    }
  }, {
    rating: 5,
    title: 'Fake Review',
    comment: 'I never bought this but love it!'
  });
  assert(unverifiedReview.status === 403, 'Unverified review (no delivered order) rejected with 403 Forbidden');

  // Customer places order for alphaProdId
  const createOrder = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/orders',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${custToken}`
    }
  }, {
    items: [{
      product: alphaProdId,
      name: newProductRes.data.product.name,
      price: newProductRes.data.product.price,
      quantity: 1,
      image: newProductRes.data.product.images[0]
    }],
    shippingAddress: {
      firstName: 'Arpit',
      lastName: 'Customer',
      address: '123 MG Road',
      city: 'Mumbai',
      postalCode: '400001',
      country: 'India'
    },
    paymentMethod: 'Credit Card',
    subtotal: 54.99,
    shipping: 0,
    total: 54.99
  });
  assert(createOrder.status === 201 && createOrder.data.order, 'Customer created order successfully with default processing status');
  const orderId = createOrder.data.order._id;

  // Review while order is 'processing' -> should still be 403 Forbidden
  const processingReview = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/products/${alphaProdId}/reviews`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${custToken}`
    }
  }, {
    rating: 5,
    title: 'Processing Order Review',
    comment: 'Still waiting for it!'
  });
  assert(processingReview.status === 403, 'Review attempt on processing/undelivered order rejected with 403 Forbidden');

  // 9. Delivery Lifecycle Transitions
  console.log('\n--- 6. ORDER DELIVERY LIFECYCLE TRANSITIONS ---');
  // Attempt illegal jump from processing directly to delivered -> 400 Bad Request
  const illegalTransition = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/orders/${orderId}/status`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, { orderStatus: 'delivered' });
  assert(illegalTransition.status === 400, 'Direct transition processing -> delivered rejected with 400 Bad Request');

  // Valid step: processing -> shipped
  const step1 = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/orders/${orderId}/status`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, { orderStatus: 'shipped' });
  assert(step1.status === 200 && step1.data.order.orderStatus === 'shipped', 'Valid transition: processing -> shipped (200 OK)');

  // Valid step: shipped -> delivered
  const step2 = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/orders/${orderId}/status`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    }
  }, { orderStatus: 'delivered' });
  assert(step2.status === 200 && step2.data.order.orderStatus === 'delivered', 'Valid transition: shipped -> delivered (200 OK)');

  // Now submit review on delivered product -> 201 Created
  const verifiedReview = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/products/${alphaProdId}/reviews`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${custToken}`
    }
  }, {
    rating: 5,
    title: 'Verified Purchase Review',
    comment: 'Received the delivered scarf today! Exceptional quality.'
  });
  assert(verifiedReview.status === 201 && verifiedReview.data.review.verifiedPurchase === true, 'Delivered purchase review accepted with 201 Created and verifiedPurchase: true');
  const reviewId = verifiedReview.data.review._id;

  // Duplicate review submission attempt -> 400 Bad Request
  const duplicateReview = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/products/${alphaProdId}/reviews`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${custToken}`
    }
  }, {
    rating: 4,
    title: 'Duplicate Review',
    comment: 'Trying to review again.'
  });
  assert(duplicateReview.status === 400, 'Duplicate review on same product rejected with 400 Bad Request');

  // 10. Review Like System
  console.log('\n--- 7. REVIEW LIKE SYSTEM ---');
  // First like
  const likeRes1 = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/reviews/${reviewId}/like`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${custToken}`
    }
  });
  assert(likeRes1.status === 200 && likeRes1.data.liked === true && likeRes1.data.likes === 1, 'Liking review increments like count to 1 with liked: true');

  // Second like (toggle to unlike)
  const likeRes2 = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/reviews/${reviewId}/like`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${custToken}`
    }
  });
  assert(likeRes2.status === 200 && likeRes2.data.liked === false && likeRes2.data.likes === 0, 'Unliking review decrements like count to 0 with liked: false');

  console.log('\n============================================================');
  console.log(`SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('============================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Test Suite Fatal Error:', err);
  process.exit(1);
});
