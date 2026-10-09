const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');

async function inspectUrls() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB:', mongoose.connection.name);

  const Banner = require('../models/Banner');
  const Category = require('../models/Category');
  const Product = require('../models/Product');
  const User = require('../models/User');

  const banners = await Banner.find();
  const categories = await Category.find();
  const products = await Product.find();
  const users = await User.find({ profilePhoto: { $exists: true, $ne: '' } });

  console.log('Document counts in DB:', {
    banners: banners.length,
    categories: categories.length,
    products: products.length,
    usersWithPhoto: users.length,
  });

  const allUrls = [];
  banners.forEach((b) => {
    if (b.image) allUrls.push({ type: 'banner', id: b._id, url: b.image });
    if (b.mobileImage) allUrls.push({ type: 'banner_mobile', id: b._id, url: b.mobileImage });
  });
  categories.forEach((c) => {
    if (c.image) allUrls.push({ type: 'category', id: c._id, url: c.image });
  });
  products.forEach((p) => {
    if (p.thumbnail) allUrls.push({ type: 'product_thumb', id: p._id, url: p.thumbnail });
    if (p.hoverImage) allUrls.push({ type: 'product_hover', id: p._id, url: p.hoverImage });
    (p.images || []).forEach((img) => allUrls.push({ type: 'product_image', id: p._id, url: img }));
    (p.videos || []).forEach((v) => allUrls.push({ type: 'product_video', id: p._id, url: v }));
    (p.media || []).forEach((m) => {
      if (m.url) allUrls.push({ type: 'product_media', id: p._id, url: m.url });
    });
  });
  users.forEach((u) => {
    if (u.profilePhoto) allUrls.push({ type: 'user_photo', id: u._id, url: u.profilePhoto });
  });

  const supabaseUrls = allUrls.filter((u) => u.url.includes('supabase.co'));
  const unsplashUrls = allUrls.filter((u) => u.url.includes('unsplash.com'));
  const otherUrls = allUrls.filter((u) => !u.url.includes('supabase.co') && !u.url.includes('unsplash.com'));

  console.log('URL Analysis:', {
    totalUrls: allUrls.length,
    supabaseUrlsCount: supabaseUrls.length,
    unsplashUrlsCount: unsplashUrls.length,
    otherUrlsCount: otherUrls.length,
  });

  if (supabaseUrls.length > 0) {
    console.log('Sample Supabase URLs (first 5):', supabaseUrls.slice(0, 5).map((s) => s.url));
  }
  if (otherUrls.length > 0) {
    console.log('Sample Other URLs:', otherUrls.slice(0, 5).map((o) => o.url));
  }

  process.exit(0);
}

inspectUrls().catch((err) => {
  console.error(err);
  process.exit(1);
});
