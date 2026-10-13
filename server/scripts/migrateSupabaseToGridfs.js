const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const { Readable } = require('stream');

async function runMigration() {
  console.log('====================================================');
  console.log('🚀 VEXIVO — Supabase to MongoDB GridFS Media Seeder');
  console.log('====================================================\n');

  // 1. Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing from server/.env');
  }

  console.log('[1/4] Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log(`✅ [MongoDB Connected] Database: ${mongoose.connection.name} (${mongoose.connection.host})\n`);

  // 2. Initialize GridFS Bucket
  const gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'media',
  });

  // 3. Connect to Supabase
  console.log('[2/4] Connecting to Supabase Storage...');
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL or SUPABASE_SECRET_KEY is missing from server/.env');
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const buckets = ['vexivo-images', 'product-media'];
  const allObjects = [];

  // Recursive object lister
  async function listAll(bucket, prefix = '') {
    const { data: items, error } = await supabase.storage.from(bucket).list(prefix, { limit: 100 });
    if (error) {
      console.warn(`[Warning] Could not list ${bucket}/${prefix}:`, error.message);
      return;
    }
    for (const item of items || []) {
      const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
      if (!item.id && (!item.metadata || !item.metadata.mimetype)) {
        await listAll(bucket, fullPath);
      } else {
        allObjects.push({
          bucket,
          name: fullPath,
          size: item.metadata?.size || 0,
          mimetype: item.metadata?.mimetype || 'application/octet-stream',
        });
      }
    }
  }

  for (const b of buckets) {
    await listAll(b);
  }

  console.log(`✅ [Supabase Connected] Discovered ${allObjects.length} objects in Supabase storage.\n`);

  // 4. Migrate and Seed to MongoDB GridFS
  console.log('[3/4] Downloading from Supabase and Seeding into MongoDB GridFS...');
  let migrated = 0;
  let alreadyMigrated = 0;
  let skippedEmpty = 0;
  let errors = 0;

  const urlMapping = new Map(); // oldUrl -> newUrl

  for (const obj of allObjects) {
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${obj.bucket}/${obj.name}`;

    // Skip empty folder markers or 0-byte placeholders
    if (obj.name.endsWith('.emptyFolderPlaceholder') || obj.size === 0) {
      skippedEmpty++;
      continue;
    }

    try {
      // Check if already in MongoDB GridFS
      const existing = await mongoose.connection.db
        .collection('media.files')
        .find({
          $or: [
            { 'metadata.supabasePath': obj.name },
            { filename: obj.name },
            { 'metadata.originalSupabaseUrl': publicUrl },
          ],
        })
        .limit(1)
        .toArray();

      if (existing.length > 0) {
        alreadyMigrated++;
        const fileId = existing[0]._id.toString();
        const newUrl = `/api/media/${fileId}`;
        urlMapping.set(publicUrl, newUrl);
        urlMapping.set(obj.name, newUrl);
        console.log(`ℹ️ [Already Seeded] ${obj.bucket}/${obj.name} -> ${newUrl}`);
        continue;
      }

      // Download buffer from Supabase
      const { data: blob, error: downloadError } = await supabase.storage.from(obj.bucket).download(obj.name);
      if (downloadError) {
        throw new Error(`Download failed: ${downloadError.message}`);
      }

      const buffer = Buffer.from(await blob.arrayBuffer());
      const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

      // Upload to GridFS
      const fileId = new mongoose.mongo.ObjectId();
      const metadata = {
        supabaseBucket: obj.bucket,
        supabasePath: obj.name,
        originalSupabaseUrl: publicUrl,
        mimetype: obj.mimetype,
        size: buffer.length,
        sha256,
        uploadedAt: new Date(),
      };

      await new Promise((resolve, reject) => {
        const uploadStream = gridfsBucket.openUploadStreamWithId(fileId, obj.name, {
          contentType: obj.mimetype,
          metadata,
        });
        uploadStream.on('error', reject);
        uploadStream.on('finish', resolve);
        Readable.from(buffer).pipe(uploadStream);
      });

      const newUrl = `/api/media/${fileId.toString()}`;
      urlMapping.set(publicUrl, newUrl);
      urlMapping.set(obj.name, newUrl);
      migrated++;

      console.log(`✅ [Seeded into MongoDB] ${obj.bucket}/${obj.name} (${buffer.length} bytes) -> ${newUrl}`);
    } catch (err) {
      errors++;
      console.error(`❌ [Error Seeding] ${obj.bucket}/${obj.name}:`, err.message);
    }
  }

  // 5. Update MongoDB Catalog Collections (Banners, Products, Categories, Users)
  console.log('\n[4/4] Updating Database References in Collections...');
  let updatedRefs = 0;

  const Banner = mongoose.models.Banner || mongoose.model('Banner', new mongoose.Schema({}, { strict: false }));
  const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({}, { strict: false }));
  const Category = mongoose.models.Category || mongoose.model('Category', new mongoose.Schema({}, { strict: false }));
  const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));

  for (const [oldUrl, newUrl] of urlMapping.entries()) {
    // Banners
    const b1 = await Banner.updateMany({ image: oldUrl }, { $set: { image: newUrl } });
    const b2 = await Banner.updateMany({ mobileImage: oldUrl }, { $set: { mobileImage: newUrl } });
    updatedRefs += (b1.modifiedCount || 0) + (b2.modifiedCount || 0);

    // Categories
    const c = await Category.updateMany({ image: oldUrl }, { $set: { image: newUrl } });
    updatedRefs += c.modifiedCount || 0;

    // Products
    const p1 = await Product.updateMany({ thumbnail: oldUrl }, { $set: { thumbnail: newUrl } });
    const p2 = await Product.updateMany({ hoverImage: oldUrl }, { $set: { hoverImage: newUrl } });
    const p3 = await Product.updateMany({ images: oldUrl }, { $set: { 'images.$': newUrl } });
    const p4 = await Product.updateMany({ videos: oldUrl }, { $set: { 'videos.$': newUrl } });
    const p5 = await Product.updateMany({ 'media.url': oldUrl }, { $set: { 'media.$.url': newUrl } });
    updatedRefs +=
      (p1.modifiedCount || 0) +
      (p2.modifiedCount || 0) +
      (p3.modifiedCount || 0) +
      (p4.modifiedCount || 0) +
      (p5.modifiedCount || 0);

    // Users
    const u = await User.updateMany({ profilePhoto: oldUrl }, { $set: { profilePhoto: newUrl } });
    updatedRefs += u.modifiedCount || 0;
  }

  console.log('\n====================================================');
  console.log('🎉 SEEDING & MIGRATION SUMMARY:');
  console.log(`- Total Objects in Supabase: ${allObjects.length}`);
  console.log(`- Newly Seeded into MongoDB: ${migrated}`);
  console.log(`- Already in MongoDB (Skipped duplicate): ${alreadyMigrated}`);
  console.log(`- Empty Placeholders Skipped: ${skippedEmpty}`);
  console.log(`- Failed: ${errors}`);
  console.log(`- Catalog Records Updated: ${updatedRefs}`);
  console.log('====================================================\n');

  await mongoose.disconnect();
}

runMigration()
  .then(() => {
    console.log('✅ All done! All Supabase media is now seeded into MongoDB.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Fatal Migration Error:', err.message);
    process.exit(1);
  });
