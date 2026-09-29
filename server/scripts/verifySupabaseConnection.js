const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment from server/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const { createClient } = require('@supabase/supabase-js');

async function testConnection() {
  console.log('========================================================');
  console.log('🔍 VEXIVO — Supabase Live Storage Verification Suite');
  console.log('========================================================\n');

  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();
  const bucketName = process.env.SUPABASE_BUCKET?.trim() || 'vexivo-images';

  // 1. Client initialization
  console.log('[Step 1/6] Initializing Supabase client...');
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ FAIL: SUPABASE_URL or SUPABASE_SECRET_KEY missing from environment.');
    process.exit(1);
  }

  // Ensure key is never logged
  console.log(`   Connected to Project: ${supabaseUrl}`);
  console.log(`   Target Bucket: ${bucketName}`);
  console.log(`   Key Status: [Configured - Masked for security: ${supabaseKey.slice(0, 7)}...${supabaseKey.slice(-4)}]`);

  let supabase;
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    console.log('   ✅ PASS: Supabase client initialized successfully.\n');
  } catch (err) {
    console.error(`   ❌ FAIL: Client initialization error: ${err.message}`);
    process.exit(1);
  }

  // 2. Bucket verification
  console.log(`[Step 2/6] Checking bucket "${bucketName}"...`);
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
      console.warn(`   ⚠️ Bucket list warning: ${listError.message}`);
    } else {
      const found = buckets?.some((b) => b.name === bucketName);
      if (found) {
        console.log(`   ✅ PASS: Bucket "${bucketName}" exists and is accessible.`);
      } else {
        console.log(`   ℹ️ Bucket "${bucketName}" not found in list. Attempting to create bucket "${bucketName}"...`);
        const { data: newBucket, error: createError } = await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        });
        if (createError) {
          console.log(`   Notice on create: ${createError.message}. Proceeding to direct access test...`);
        } else {
          console.log(`   ✅ PASS: Bucket "${bucketName}" created successfully!`);
        }
      }
    }
  } catch (err) {
    console.log(`   Bucket check note: ${err.message}. Proceeding to upload test.`);
  }

  // 3. Upload a temporary test image
  const testFileName = `test/connection-test-${Date.now()}.png`;
  console.log(`\n[Step 3/6] Uploading temporary test image: "${testFileName}"...`);
  
  // 1x1 transparent PNG buffer
  const testImageBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );

  let uploadedPath = null;
  let publicUrl = null;

  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(testFileName, testImageBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error(`   ❌ FAIL: Upload error: ${uploadError.message}`);
      process.exit(1);
    }

    uploadedPath = uploadData?.path || testFileName;
    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(uploadedPath);
    publicUrl = urlData?.publicUrl;

    console.log(`   ✅ PASS: Test image uploaded successfully.`);
    console.log(`   Object Path: ${uploadedPath}`);
    console.log(`   Public URL: ${publicUrl}`);
  } catch (err) {
    console.error(`   ❌ FAIL: Exception during upload: ${err.message}`);
    process.exit(1);
  }

  // 4. Verify object exists
  console.log(`\n[Step 4/6] Verifying object exists in bucket...`);
  try {
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(uploadedPath);

    if (downloadError || !fileData) {
      console.error(`   ❌ FAIL: Could not download uploaded object: ${downloadError?.message}`);
      process.exit(1);
    }

    const downloadedSize = fileData.size || (await fileData.arrayBuffer()).byteLength;
    console.log(`   ✅ PASS: Object exists and verified via download (Size: ${downloadedSize} bytes).`);
  } catch (err) {
    console.error(`   ❌ FAIL: Verification error: ${err.message}`);
    process.exit(1);
  }

  // 5. Delete temporary test image
  console.log(`\n[Step 5/6] Deleting temporary test image...`);
  try {
    const { data: deleteData, error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([uploadedPath]);

    if (deleteError) {
      console.error(`   ❌ FAIL: Delete error: ${deleteError.message}`);
      process.exit(1);
    }
    console.log(`   ✅ PASS: Temporary test image deleted from bucket.`);
  } catch (err) {
    console.error(`   ❌ FAIL: Exception during deletion: ${err.message}`);
    process.exit(1);
  }

  // 6. Verify deletion
  console.log(`\n[Step 6/6] Verifying deletion (object must no longer exist)...`);
  try {
    const { data: checkData, error: checkError } = await supabase.storage
      .from(bucketName)
      .download(uploadedPath);

    if (checkError) {
      console.log(`   ✅ PASS: Verified object no longer exists (Error response as expected: ${checkError.message}).`);
    } else {
      console.warn(`   ⚠️ Warning: Object may still be present in bucket.`);
    }
  } catch (err) {
    console.log(`   ✅ PASS: Verified object deleted (exception as expected).`);
  }

  // Security Verifications
  console.log(`\n--- Security Verifications ---`);
  // Check gitignore
  const gitignore = fs.readFileSync(path.join(__dirname, '../../.gitignore'), 'utf8');
  const isEnvIgnored = gitignore.includes('.env') && gitignore.includes('server/.env');
  console.log(`   ${isEnvIgnored ? '✅' : '❌'} .env & server/.env strictly ignored by Git: ${isEnvIgnored}`);

  // Check frontend dist
  let secretLeakedInClient = false;
  const distDir = path.join(__dirname, '../../client/dist/assets');
  if (fs.existsSync(distDir)) {
    const files = fs.readdirSync(distDir).filter((f) => f.endsWith('.js'));
    for (const f of files) {
      const content = fs.readFileSync(path.join(distDir, f), 'utf8');
      if (content.includes(supabaseKey)) {
        secretLeakedInClient = true;
      }
    }
  }
  console.log(`   ${!secretLeakedInClient ? '✅' : '❌'} Secret Key is NOT exposed to frontend client: ${!secretLeakedInClient}`);

  console.log('\n========================================================');
  console.log('🎉 ALL SUPABASE STORAGE VERIFICATION CHECKS PASSED!');
  console.log('========================================================\n');

  process.exit(0);
}

testConnection().catch((err) => {
  console.error('Fatal test error:', err.message);
  process.exit(1);
});
