const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const products = await mongoose.connection.db.collection('products').find({}).toArray();
  const banners = await mongoose.connection.db.collection('banners').find({}).toArray();

  console.log('Total Products:', products.length);
  console.log('Total Banners:', banners.length);

  const supabaseProducts = products.filter(p =>
    (p.thumbnail && p.thumbnail.includes('supabase')) ||
    (p.images && p.images.some(img => img.includes('supabase')))
  );

  const mediaProducts = products.filter(p =>
    (p.thumbnail && p.thumbnail.includes('/api/media')) ||
    (p.images && p.images.some(img => img.includes('/api/media')))
  );

  console.log('Products with Supabase URLs:', supabaseProducts.length);
  console.log('Products with /api/media URLs:', mediaProducts.length);

  console.log('\n--- BANNERS ---');
  banners.forEach(b => {
    console.log(`Banner: "${b.title}" | Position: ${b.position} | Image: ${b.image}`);
  });

  const mediaFiles = await mongoose.connection.db.collection('media.files').find({}).toArray();
  console.log('\n--- MEDIA.FILES IN MONGODB (COUNT: ' + mediaFiles.length + ') ---');
  mediaFiles.forEach(f => {
    console.log(`ID: ${f._id} | Filename: ${f.filename} | Original: ${f.metadata?.originalSupabaseUrl || 'N/A'}`);
  });

  process.exit(0);
}

check().catch(console.error);
