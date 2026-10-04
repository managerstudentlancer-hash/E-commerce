const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const supabaseStorage = require('../services/supabaseStorage');
const connectDB = require('../config/db');

// Models
const Product = require('../models/Product');
const Category = require('../models/Category');
const Banner = require('../models/Banner');
const User = require('../models/User');

async function runMigration() {
  console.log('========================================================');
  console.log('🚀 VEXIVO — Supabase Storage Migration Engine');
  console.log('========================================================');

  if (!supabaseStorage.isSupabaseConfigured()) {
    console.error('❌ Error: Supabase credentials not found in server/.env');
    console.error('   Please define SUPABASE_URL and SUPABASE_SECRET_KEY in server/.env first.');
    process.exit(1);
  }

  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    console.log('ℹ️  No local server/uploads directory found. Nothing to migrate.');
    process.exit(0);
  }

  const localFiles = fs.readdirSync(uploadsDir).filter((file) => {
    return !file.startsWith('.') && fs.statSync(path.join(uploadsDir, file)).isFile();
  });

  console.log(`📁 Found ${localFiles.length} local file(s) in server/uploads:`);
  localFiles.forEach((f) => console.log(`   - ${f}`));

  if (localFiles.length === 0) {
    console.log('✅ Zero files need migration.');
    process.exit(0);
  }

  // Connect Database
  await connectDB();
  console.log('✅ Connected to MongoDB.');

  const migrationMap = new Map(); // localPath -> supabaseUrl

  for (const filename of localFiles) {
    const filePath = path.join(uploadsDir, filename);
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    let mimetype = 'image/jpeg';
    if (ext === '.png') mimetype = 'image/png';
    else if (ext === '.webp') mimetype = 'image/webp';
    else if (ext === '.gif') mimetype = 'image/gif';

    console.log(`⏳ Uploading ${filename} to Supabase (${mimetype})...`);
    try {
      const result = await supabaseStorage.uploadToSupabase({
        buffer,
        mimetype,
        originalname: filename,
        folder: 'products',
        entityId: 'migrated',
      });
      console.log(`   ✅ Uploaded! Supabase URL: ${result.url}`);
      migrationMap.set(`/uploads/${filename}`, result.url);
      migrationMap.set(`uploads/${filename}`, result.url);
    } catch (err) {
      console.error(`   ❌ Failed to upload ${filename}:`, err.message);
    }
  }

  console.log('\n🔄 Updating MongoDB references...');
  let updatedProducts = 0;
  let updatedUsers = 0;
  let updatedBanners = 0;
  let updatedCategories = 0;

  for (const [oldRef, newUrl] of migrationMap.entries()) {
    // 1. Users
    const uRes = await User.updateMany({ profilePhoto: oldRef }, { $set: { profilePhoto: newUrl } });
    updatedUsers += uRes.modifiedCount;

    // 2. Banners
    const bRes = await Banner.updateMany({ image: oldRef }, { $set: { image: newUrl } });
    updatedBanners += bRes.modifiedCount;

    // 3. Categories
    const cRes = await Category.updateMany({ image: oldRef }, { $set: { image: newUrl } });
    updatedCategories += cRes.modifiedCount;

    // 4. Products thumbnail & hover
    const p1 = await Product.updateMany({ thumbnail: oldRef }, { $set: { thumbnail: newUrl } });
    const p2 = await Product.updateMany({ hoverImage: oldRef }, { $set: { hoverImage: newUrl } });
    const p3 = await Product.updateMany({ images: oldRef }, { $set: { 'images.$': newUrl } });
    updatedProducts += p1.modifiedCount + p2.modifiedCount + p3.modifiedCount;
  }

  console.log('========================================================');
  console.log('🎉 Migration Completed Successfully!');
  console.log(`   - Uploaded Files: ${migrationMap.size / 2}`);
  console.log(`   - Products Updated: ${updatedProducts}`);
  console.log(`   - Users Updated: ${updatedUsers}`);
  console.log(`   - Banners Updated: ${updatedBanners}`);
  console.log(`   - Categories Updated: ${updatedCategories}`);
  console.log('   (Existing local files in server/uploads/ preserved safely)');
  console.log('========================================================');

  process.exit(0);
}

runMigration().catch((err) => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
