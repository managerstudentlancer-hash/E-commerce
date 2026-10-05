const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const User = require('./models/User');
const Order = require('./models/Order');
const Product = require('./models/Product');
const { seedSarees } = require('./seed/sareeSeed');
const { seedAll } = require('./seed/seedData');
const { seedAiKnowledge } = require('./seed/aiKnowledgeSeed');
const aiService = require('./services/aiService');

const runAcceptanceTests = async () => {
  console.log('Connecting to database...');
  await connectDB();
  await seedAll();
  await seedSarees();
  await seedAiKnowledge();

  let user = await User.findOne({ email: 'arpit123@gmail.com' });
  if (!user) {
    user = await User.create({
      name: 'Rohan Sharma',
      email: 'arpit123@gmail.com',
      passwordHash: '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF',
      phone: '9876543211',
    });
  }

  let order = await Order.findOne({ user: user._id });
  if (!order) {
    const sampleProduct = await Product.findOne({ status: 'active' });
    order = await Order.create({
      orderNumber: 'VEX-8899-TEST',
      user: user._id,
      items: [
        {
          product: sampleProduct._id,
          name: sampleProduct.name,
          price: sampleProduct.price,
          quantity: 1,
          image: sampleProduct.thumbnail || sampleProduct.images?.[0] || '',
        },
      ],
      subtotal: sampleProduct.price,
      shipping: 0,
      total: sampleProduct.price,
      shippingAddress: {
        firstName: 'Rohan',
        lastName: 'Sharma',
        address: '42 Marine Drive',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400020',
      },
      paymentStatus: 'paid',
      orderStatus: 'out_for_delivery',
      trackingHistory: [
        { status: 'Ordered', message: 'Order confirmed' },
        { status: 'Out For Delivery', message: 'Courier out for delivery today' },
      ],
    });
  }

  console.log('\n================================================================');
  console.log('🧪 RUNNING 15 CONVERSATIONAL VEXIVO AI ACCEPTANCE TESTS');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  const test = (title, condition, details = '') => {
    total++;
    if (condition) {
      passed++;
      console.log(`✅ [PASS] ${title} ${details ? `-> ${details}` : ''}`);
    } else {
      console.error(`❌ [FAIL] ${title} ${details ? `-> ${details}` : ''}`);
    }
  };

  // Case 1: "Hi"
  console.log('\n--- Case 1: "Hi" ---');
  const c1 = await aiService.processUserMessage({ message: 'Hi', user });
  console.log('Reply:', c1.reply);
  test(
    'Case 1: "Hi" returns conversational greeting WITHOUT product cards',
    (!c1.data?.products || c1.data.products.length === 0) &&
      (c1.reply.includes('VEXIVO') || c1.reply.includes('help')),
    `Action: ${c1.data?.actionType}`
  );

  // Case 2: "Kya tum meri help kar sakti ho?"
  console.log('\n--- Case 2: "Kya tum meri help kar sakti ho?" ---');
  const c2 = await aiService.processUserMessage({
    message: 'Kya tum meri help kar sakti ho?',
    user,
  });
  console.log('Reply:', c2.reply);
  test(
    'Case 2: "Kya tum meri help kar sakti ho?" answers conversationally WITHOUT products',
    (!c2.data?.products || c2.data.products.length === 0) &&
      (c2.reply.includes('help') || c2.reply.includes('Haan bilkul') || c2.reply.includes('sahayata')),
    `Action: ${c2.data?.actionType}`
  );

  // Case 3: "Mujhe meri product ke related baat karni thi"
  console.log('\n--- Case 3: "Mujhe meri product ke related baat karni thi" ---');
  const c3 = await aiService.processUserMessage({
    message: 'Mujhe meri product ke related baat karni thi',
    user,
  });
  console.log('Reply:', c3.reply);
  test(
    'Case 3: "Mujhe meri product ke related baat karni thi" asks what user wants to know WITHOUT product cards',
    (!c3.data?.products || c3.data.products.length === 0) &&
      (c3.reply.includes('Bataiye') || c3.reply.includes('jaanna') || c3.reply.includes('price, size')),
    `Action: ${c3.data?.actionType}`
  );

  // Case 4: "What is VEXIVO?"
  console.log('\n--- Case 4: "What is VEXIVO?" ---');
  const c4 = await aiService.processUserMessage({
    message: 'What is VEXIVO?',
    user,
  });
  console.log('Reply:', c4.reply);
  test(
    'Case 4: "What is VEXIVO?" answers brand info WITHOUT product cards',
    (!c4.data?.products || c4.data.products.length === 0) &&
      c4.reply.toLowerCase().includes('vexivo') &&
      c4.reply.toLowerCase().includes('fashion'),
    `Action: ${c4.data?.actionType}`
  );

  // Case 5: "Shaadi mein kya pehnu?"
  console.log('\n--- Case 5: "Shaadi mein kya pehnu?" ---');
  const c5 = await aiService.processUserMessage({
    message: 'Shaadi mein kya pehnu?',
    user,
  });
  console.log('Reply:', c5.reply);
  test(
    'Case 5: "Shaadi mein kya pehnu?" gives fashion advice WITHOUT dumping random products',
    (!c5.data?.products || c5.data.products.length === 0) &&
      (c5.reply.includes('Haldi') || c5.reply.includes('Saree') || c5.reply.includes('Styling')),
    `Action: ${c5.data?.actionType}`
  );

  // Case 6: "Show me black dresses"
  console.log('\n--- Case 6: "Show me black dresses" ---');
  const c6 = await aiService.processUserMessage({
    message: 'Show me black dresses',
    user,
  });
  console.log('Reply:', c6.reply);
  test(
    'Case 6: "Show me black dresses" searches catalog and returns products',
    c6.data?.products && c6.data.products.length > 0 && c6.data?.actionType === 'PRODUCT_GRID',
    `Found ${c6.data?.products?.length || 0} products`
  );

  // Case 7: "2000 ke under saree dikhao"
  console.log('\n--- Case 7: "2000 ke under saree dikhao" ---');
  const c7 = await aiService.processUserMessage({
    message: '2000 ke under saree dikhao',
    user,
  });
  console.log('Reply:', c7.reply);
  test(
    'Case 7: "2000 ke under saree dikhao" returns matching sarees under ₹2000',
    c7.data?.products &&
      c7.data.products.length > 0 &&
      c7.data.products.every((p) => p.price <= 2000),
    `Found ${c7.data?.products?.length || 0} sarees under ₹2000`
  );

  // Case 8: "Is dress ka price kya hai?"
  console.log('\n--- Case 8: "Is dress ka price kya hai?" ---');
  const historyWithProduct = [
    {
      role: 'assistant',
      content: 'Here are dresses',
      data: { products: c6.data.products },
    },
  ];
  const c8 = await aiService.processUserMessage({
    message: 'Is dress ka price kya hai?',
    history: historyWithProduct,
    user,
  });
  console.log('Reply:', c8.reply);
  test(
    'Case 8: "Is dress ka price kya hai?" returns verified price from reference',
    c8.reply.includes('₹') && (c8.data?.actionType === 'PRODUCT_DETAILS' || c8.data?.products?.length === 1),
    `Price stated accurately`
  );

  // Case 9: "What's trending?"
  console.log('\n--- Case 9: "What\'s trending?" ---');
  const c9 = await aiService.processUserMessage({
    message: "What's trending?",
    user,
  });
  console.log('Reply:', c9.reply);
  test(
    'Case 9: "What\'s trending?" shows trending products from real catalog',
    c9.data?.products && c9.data.products.length > 0 && c9.data?.actionType === 'PRODUCT_GRID',
    `Found ${c9.data?.products?.length || 0} trending products`
  );

  // Case 10: "Mera order kaha hai?"
  console.log('\n--- Case 10: "Mera order kaha hai?" ---');
  const c10 = await aiService.processUserMessage({
    message: 'Mera order kaha hai?',
    user,
  });
  console.log('Reply:', c10.reply);
  test(
    'Case 10: "Mera order kaha hai?" retrieves real order tracking details',
    c10.reply.includes(order.orderNumber) || c10.data?.orders?.length > 0,
    `Order #${order.orderNumber}`
  );

  // Case 11: "Return kaise karu?"
  console.log('\n--- Case 11: "Return kaise karu?" ---');
  const c11 = await aiService.processUserMessage({
    message: 'Return kaise karu?',
    user,
  });
  console.log('Reply:', c11.reply);
  test(
    'Case 11: "Return kaise karu?" provides 30-Day return instructions',
    c11.reply.includes('30-Day') || c11.reply.includes('30-दिन') || c11.data?.actionType?.includes('RETURN'),
    `Action: ${c11.data?.actionType}`
  );

  // Case 12: "Thank you"
  console.log('\n--- Case 12: "Thank you" ---');
  const c12 = await aiService.processUserMessage({
    message: 'Thank you',
    user,
  });
  console.log('Reply:', c12.reply);
  test(
    'Case 12: "Thank you" returns polite appreciation WITHOUT product cards',
    (!c12.data?.products || c12.data.products.length === 0) &&
      (c12.reply.toLowerCase().includes('welcome') || c12.reply.includes('swagat')),
    `Action: ${c12.data?.actionType}`
  );

  // Case 13: "Mujhe ek product ke baare mein baat karni hai"
  console.log('\n--- Case 13: "Mujhe ek product ke baare mein baat karni hai" ---');
  const c13 = await aiService.processUserMessage({
    message: 'Mujhe ek product ke baare mein baat karni hai',
    user,
  });
  console.log('Reply:', c13.reply);
  test(
    'Case 13: Ambiguous product discussion asks clarifying questions',
    (!c13.data?.products || c13.data.products.length === 0) &&
      (c13.reply.includes('Bataiye') || c13.reply.includes('jaanna')),
    `Action: ${c13.data?.actionType}`
  );

  // Case 14: "Mujhe product samajh nahi aa raha"
  console.log('\n--- Case 14: "Mujhe product samajh nahi aa raha" ---');
  const c14 = await aiService.processUserMessage({
    message: 'Mujhe product samajh nahi aa raha',
    user,
  });
  console.log('Reply:', c14.reply);
  test(
    'Case 14: Empathetic response for confusion WITHOUT random products',
    (!c14.data?.products || c14.data.products.length === 0) &&
      (c14.reply.includes('Koi baat nahi') || c14.reply.includes('confusion')),
    `Action: ${c14.data?.actionType}`
  );

  // Case 15: Multi-Turn Conversation Refinement
  console.log('\n--- Case 15: Multi-turn Context Refinement ---');
  const multiTurnHistory = [
    { role: 'user', content: 'Mujhe ek saree chahiye' },
    { role: 'assistant', content: 'Bilkul! Kis occasion ke liye?' },
    { role: 'user', content: 'Shaadi' },
    { role: 'assistant', content: 'Shaadi ke liye traditional sarees achhi rahengi.' },
  ];
  const c15 = await aiService.processUserMessage({
    message: 'Budget 3000 hai',
    history: multiTurnHistory,
    user,
  });
  console.log('Reply:', c15.reply);
  test(
    'Case 15: Multi-turn refinement searches saree + wedding + budget <= 3000',
    c15.data?.products &&
      c15.data.products.length > 0 &&
      c15.data.products.every((p) => p.price <= 3000),
    `Found ${c15.data?.products?.length || 0} sarees under ₹3000`
  );

  console.log('\n================================================================');
  console.log(`🎯 OVERALL RESULT: ${passed}/${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('================================================================\n');

  process.exit(passed === total ? 0 : 1);
};

runAcceptanceTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
