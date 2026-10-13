const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const gridfsService = require('../services/gridfsService');

const Banner = require('../models/Banner');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');

async function runMigration() {
  console.log('====================================================');
  console.log('🚀 VEXIVO — Supabase to MongoDB GridFS Media Migration');
  console.log('====================================================\n');

  // 1. Connect DB
  const connectDB = require('../config/db');
  await connectDB();
  console.log(`[DB] Connected to MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`);

  // 2. Connect Supabase
  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials missing from server/.env');
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  const buckets = ['vexivo-images', 'product-media'];
  const allObjects = [];

  // Recursive object lister
  async function listAll(bucket, prefix = '') {
    const { data: items, error } = await supabase.storage.from(bucket).list(prefix, { limit: 100 });
    if (error) {
      console.warn(`Warning listing ${bucket}/${prefix}:`, error.message);
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

  console.log(`[Discovery] Found ${allObjects.length} total objects in Supabase storage.\n`);

  const stats = {
    total: allObjects.length,
    migrated: 0,
    alreadyMigrated: 0,
    skippedEmpty: 0,
    verifiedChecksums: 0,
    dbReferencesUpdated: 0,
    errors: [],
  };

  const urlMapping = new Map(); // oldUrl -> newUrl

  const gridfsBucket = gridfsService.getBucket();

  for (const obj of allObjects) {
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${obj.bucket}/${obj.name}`;

    // Skip empty folder placeholders or zero-byte files
    if (obj.name.endsWith('.emptyFolderPlaceholder') || obj.size === 0) {
      stats.skippedEmpty++;
      continue;
    }

    try {
      // Check if already migrated
      const existing = await gridfsBucket
        .find({
          'metadata.supabaseBucket': obj.bucket,
          'metadata.supabasePath': obj.name,
        })
        .limit(1)
        .toArray();

      let gridfsFile = existing && existing.length > 0 ? existing[0] : null;

      if (gridfsFile) {
        stats.alreadyMigrated++;
        const newUrl = `/api/media/${gridfsFile._id}`;
        urlMapping.set(publicUrl, newUrl);
        urlMapping.set(obj.name, newUrl);
        continue;
      }

      // Download from Supabase
      const { data: blob, error: downloadError } = await supabase.storage.from(obj.bucket).download(obj.name);
      if (downloadError) {
        throw new Error(`Failed to download ${obj.bucket}/${obj.name}: ${downloadError.message}`);
      }

      const buffer = Buffer.from(await blob.arrayBuffer());
      const sourceChecksum = crypto.createHash('sha256').update(buffer).digest('hex');

      // Upload to GridFS
      const folder = obj.name.includes('/') ? obj.name.split('/')[0] : 'migrated';
      const entityId = obj.name.includes('/') ? obj.name.split('/')[1] : 'common';

      const uploadResult = await gridfsService.uploadToGridFS({
        buffer,
        originalname: path.basename(obj.name),
        mimetype: obj.mimetype || 'image/jpeg',
        folder,
        entityId,
      });

      // Attach Supabase tracking metadata to GridFS file
      await mongoose.connection.db.collection('media.files').updateOne(
        { _id: new mongoose.mongo.ObjectId(uploadResult.fileId) },
        {
          $set: {
            'metadata.supabaseBucket': obj.bucket,
            'metadata.supabasePath': obj.name,
            'metadata.originalSupabaseUrl': publicUrl,
          },
        }
      );

      // Verify read back & checksum
      const readBackChunks = [];
      const downloadStream = gridfsService.openDownloadStream(uploadResult.fileId);
      await new Promise((resolve, reject) => {
        downloadStream.on('data', (chunk) => readBackChunks.push(chunk));
        downloadStream.on('end', resolve);
        downloadStream.on('error', reject);
      });
      const readBackBuf = Buffer.concat(readBackChunks);
      const readBackChecksum = crypto.createHash('sha256').update(readBackBuf).digest('hex');

      if (readBackChecksum !== sourceChecksum) {
        throw new Error(`Checksum mismatch for ${obj.name}: expected ${sourceChecksum}, got ${readBackChecksum}`);
      }

      stats.verifiedChecksums++;
      stats.migrated++;

      urlMapping.set(publicUrl, uploadResult.url);
      urlMapping.set(obj.name, uploadResult.url);
      console.log(`✅ [Migrated & Verified] ${obj.bucket}/${obj.name} -> ${uploadResult.url}`);
    } catch (err) {
      stats.errors.push({ file: `${obj.bucket}/${obj.name}`, error: err.message });
      console.error(`❌ [Failed] ${obj.bucket}/${obj.name}:`, err.message);
    }
  }

  // Update Database References
  console.log('\n--- Updating Database References to GridFS ---');

  for (const [oldUrl, newUrl] of urlMapping.entries()) {
    // 1. Banners
    const b1 = await Banner.updateMany({ image: oldUrl }, { $set: { image: newUrl } });
    const b2 = await Banner.updateMany({ mobileImage: oldUrl }, { $set: { mobileImage: newUrl } });
    stats.dbReferencesUpdated += b1.modifiedCount + b2.modifiedCount;

    // 2. Categories
    const c = await Category.updateMany({ image: oldUrl }, { $set: { image: newUrl } });
    stats.dbReferencesUpdated += c.modifiedCount;

    // 3. Products
    const p1 = await Product.updateMany({ thumbnail: oldUrl }, { $set: { thumbnail: newUrl } });
    const p2 = await Product.updateMany({ hoverImage: oldUrl }, { $set: { hoverImage: newUrl } });
    const p3 = await Product.updateMany({ images: oldUrl }, { $set: { 'images.$': newUrl } });
    const p4 = await Product.updateMany({ videos: oldUrl }, { $set: { 'videos.$': newUrl } });
    const p5 = await Product.updateMany({ 'media.url': oldUrl }, { $set: { 'media.$.url': newUrl } });
    stats.dbReferencesUpdated += p1.modifiedCount + p2.modifiedCount + p3.modifiedCount + p4.modifiedCount + p5.modifiedCount;

    // 4. Users (profilePhoto)
    const u = await User.updateMany({ profilePhoto: oldUrl }, { $set: { profilePhoto: newUrl } });
    stats.dbReferencesUpdated += u.modifiedCount;
  }

  console.log('\n====================================================');
  console.log('📊 Migration Summary:');
  console.log(`- Total Supabase Objects: ${stats.total}`);
  console.log(`- Newly Migrated: ${stats.migrated}`);
  console.log(`- Already Migrated: ${stats.alreadyMigrated}`);
  console.log(`- Skipped Empty Placeholders: ${stats.skippedEmpty}`);
  console.log(`- Checksums Cryptographically Verified: ${stats.verifiedChecksums}`);
  console.log(`- Database References Updated: ${stats.dbReferencesUpdated}`);
  console.log(`- Errors Encountered: ${stats.errors.length}`);
  console.log('====================================================\n');

  if (stats.errors.length > 0) {
    console.error('Migration errors detail:', stats.errors);
    process.exit(1);
  }
}

runMigration().then(() => {
  console.log('🎉 Migration completed successfully!');
  process.exit(0);
}).catch((err) => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
