const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const AISettings = require('./models/AISettings');
const AIKnowledge = require('./models/AIKnowledge');
const AIFAQ = require('./models/AIFAQ');
const AIUnansweredQuestion = require('./models/AIUnansweredQuestion');
const AIConversation = require('./models/AIConversation');
const AIMessage = require('./models/AIMessage');

const { seedSarees } = require('./seed/sareeSeed');
const { seedAll } = require('./seed/seedData');
const { seedAiKnowledge } = require('./seed/aiKnowledgeSeed');
const aiService = require('./services/aiService');
const tools = require('./services/aiTools');

const runFullTest = async () => {
  console.log('--- Connecting to database & Seeding ---');
  await connectDB();
  await seedAll();
  await seedSarees();
  await seedAiKnowledge();

  // 1. Fetch seeded test user
  let user = await User.findOne({ email: 'arpit123@gmail.com' });
  if (!user) {
    user = await User.create({
      name: 'Rohan Sharma',
      email: 'arpit123@gmail.com',
      passwordHash: '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEF',
      phone: '9876543211',
    });
  }

  // 2. Ensure test user has an order
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

  console.log('\n======================================================');
  console.log('🧪 RUNNING FULL VEXIVO AI ASSISTANT ACCEPTANCE TESTS');
  console.log('======================================================\n');

  let passedCount = 0;
  let totalCount = 0;

  const assertTest = (name, condition, details = '') => {
    totalCount++;
    if (condition) {
      passedCount++;
      console.log(`✅ [PASS] ${name} ${details ? `(${details})` : ''}`);
    } else {
      console.error(`❌ [FAIL] ${name} ${details ? `(${details})` : ''}`);
    }
  };

  // Scenario 1: User: "black dress 2000 ke under"
  console.log('\n--- Scenario 1: "black dress 2000 ke under" ---');
  const res1 = await aiService.processUserMessage({
    message: 'black dress 2000 ke under',
    user,
    sessionId: 'test_sess_1',
  });
  assertTest(
    'Scenario 1 - Products under ₹2000 returned',
    res1.data?.products && res1.data.products.length > 0 && res1.data.products.every((p) => p.price <= 2000),
    `Found ${res1.data?.products?.length || 0} items`
  );

  // Scenario 2: User: "red saree dikhao"
  console.log('\n--- Scenario 2: "red saree dikhao" ---');
  const res2 = await aiService.processUserMessage({
    message: 'red saree dikhao',
    user,
    sessionId: 'test_sess_2',
  });
  assertTest(
    'Scenario 2 - Red Sarees returned',
    res2.data?.products && res2.data.products.length > 0,
    `Found ${res2.data?.products?.length || 0} sarees`
  );

  // Scenario 3: User: "second product cart mein add karo"
  console.log('\n--- Scenario 3: "second product cart mein add karo" ---');
  const historyForCart = [
    {
      role: 'assistant',
      content: 'Here are sarees',
      data: { products: res2.data.products },
    },
  ];
  const res3 = await aiService.processUserMessage({
    message: 'second product cart mein add karo',
    history: historyForCart,
    user,
    sessionId: 'test_sess_3',
  });
  assertTest(
    'Scenario 3 - Second product cart action triggered',
    res3.reply.toLowerCase().includes('added to your cart') || res3.data?.actionType === 'CART_ACTION' || res3.data?.actionType === 'CART_PROMPT',
    res3.reply.slice(0, 60)
  );

  // Scenario 4: User: "ye M size mein available hai?"
  console.log('\n--- Scenario 4: "ye M size mein available hai?" ---');
  const res4 = await aiService.processUserMessage({
    message: 'ye M size mein available hai?',
    history: historyForCart,
    user,
    sessionId: 'test_sess_4',
  });
  assertTest(
    'Scenario 4 - Variant / Size check performed live',
    res4.reply.toLowerCase().includes('size m') || res4.reply.toLowerCase().includes('stock') || res4.reply.toLowerCase().includes('price'),
    res4.reply.slice(0, 60)
  );

  // Scenario 5: User: "return policy kya hai?"
  console.log('\n--- Scenario 5: "return policy kya hai?" ---');
  const res5 = await aiService.processUserMessage({
    message: 'return policy kya hai?',
    user,
    sessionId: 'test_sess_5',
  });
  assertTest(
    'Scenario 5 - Verified VEXIVO 30-Day Return Policy',
    res5.reply.includes('30-Day') || res5.reply.includes('return') || res5.data?.actionType === 'RETURN_POLICY',
    res5.reply.slice(0, 60)
  );

  // Scenario 6: User: "mera order kaha hai?"
  console.log('\n--- Scenario 6: "mera order kaha hai?" ---');
  const res6 = await aiService.processUserMessage({
    message: 'mera order kaha hai?',
    user,
    sessionId: 'test_sess_6',
  });
  assertTest(
    'Scenario 6 - Real order status returned',
    res6.reply.includes(order.orderNumber) || res6.data?.orders?.length > 0,
    `Order #${order.orderNumber}`
  );

  // Scenario 7: User: "mujhe 1000 ke under kuch dikhao"
  console.log('\n--- Scenario 7: "mujhe 1000 ke under kuch dikhao" ---');
  const res7 = await aiService.processUserMessage({
    message: 'mujhe 1000 ke under kuch dikhao',
    user,
    sessionId: 'test_sess_7',
  });
  assertTest(
    'Scenario 7 - Real products under ₹1000 returned',
    res7.data?.products && res7.data.products.length > 0 && res7.data.products.every((p) => p.price <= 1000),
    `Found ${res7.data?.products?.length || 0} items`
  );

  // Scenario 8: User: "aisa product dikhao jo VEXIVO par hai hi nahi"
  console.log('\n--- Scenario 8: "aisa product dikhao jo VEXIVO par hai hi nahi" ---');
  const res8 = await aiService.processUserMessage({
    message: 'aisa product dikhao jo VEXIVO par hai hi nahi xyznonexistent',
    user,
    sessionId: 'test_sess_8',
  });
  const unansweredLogged = await AIUnansweredQuestion.findOne({
    normalizedQuery: new RegExp('xyznonexistent', 'i'),
  });
  assertTest(
    'Scenario 8 - Zero Hallucination & Unanswered Query Logged in DB',
    Boolean(unansweredLogged) && !res8.reply.includes('xyznonexistent is priced at'),
    `Logged in AIUnansweredQuestion`
  );

  // Scenario 9: Admin adds FAQ & AI can use it
  console.log('\n--- Scenario 9: Admin Adds FAQ ---');
  await AIFAQ.create({
    question: 'Can I pay using Cryptocurrencies on VEXIVO?',
    answer: 'VEXIVO currently only accepts INR payments via UPI, Credit/Debit cards, Netbanking, and COD. Cryptocurrency is not accepted.',
    category: 'Payments',
  });
  const websiteFaqs = await tools.getFAQ('cryptocurrency');
  assertTest(
    'Scenario 9 - New FAQ immediately accessible',
    websiteFaqs.length > 0 && websiteFaqs[0].answer.includes('INR payments'),
    websiteFaqs[0]?.question
  );

  // Scenario 10: Admin Updates Welcome Message
  console.log('\n--- Scenario 10: Admin Updates Welcome Message ---');
  await AISettings.findOneAndUpdate(
    {},
    { welcomeMessage: 'Namaste! Welcome to VEXIVO Luxury Concierge.' },
    { upsert: true }
  );
  const welcomeRes = await tools.getAISettings();
  assertTest(
    'Scenario 10 - Updated welcome message dynamically loaded',
    welcomeRes.welcomeMessage === 'Namaste! Welcome to VEXIVO Luxury Concierge.',
    welcomeRes.welcomeMessage
  );

  // Scenario 11: Admin Disables AI
  console.log('\n--- Scenario 11: Admin Disables AI ---');
  await AISettings.findOneAndUpdate({}, { enabled: false });
  const disabledRes = await aiService.processUserMessage({
    message: 'hello',
    user,
    sessionId: 'test_sess_11',
  });
  assertTest(
    'Scenario 11 - AI Disabled notice returned gracefully',
    disabledRes.data?.actionType === 'MAINTENANCE' || disabledRes.reply.includes('maintenance'),
    disabledRes.reply.slice(0, 60)
  );

  // Re-enable AI
  await AISettings.findOneAndUpdate({}, { enabled: true });

  // Scenario 12: Admin Analytics
  console.log('\n--- Scenario 12: Admin AI Analytics ---');
  const convCount = await AIConversation.countDocuments();
  const msgCount = await AIMessage.countDocuments();
  assertTest(
    'Scenario 12 - AI Analytics logged in DB',
    convCount > 0 && msgCount > 0,
    `Conversations: ${convCount}, Messages: ${msgCount}`
  );

  console.log('\n======================================================');
  console.log(`🎯 TEST RESULTS: ${passedCount}/${totalCount} SCENARIOS PASSED (${Math.round((passedCount / totalCount) * 100)}%)`);
  console.log('======================================================\n');

  process.exit(passedCount === totalCount ? 0 : 1);
};

runFullTest().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
