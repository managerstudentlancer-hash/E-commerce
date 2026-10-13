const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

async function checkSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.log('Supabase credentials not configured in server/.env');
    return;
  }
  const client = createClient(url, key);
  const { data: buckets, error } = await client.storage.listBuckets();
  if (error) {
    console.error('List buckets error:', error.message);
    return;
  }
  console.log('Buckets found:', buckets.map(b => b.name));

  const allObjects = [];

  async function listRecursive(bucket, prefix = '') {
    const { data: items, error: iErr } = await client.storage.from(bucket).list(prefix, { limit: 100 });
    if (iErr) {
      console.error(`Error listing ${bucket}/${prefix}:`, iErr.message);
      return;
    }
    for (const item of (items || [])) {
      const fullPath = prefix ? `${prefix}/${item.name}` : item.name;
      if (!item.id && (!item.metadata || !item.metadata.mimetype)) {
        // Folder
        await listRecursive(bucket, fullPath);
      } else {
        // File object
        allObjects.push({
          bucket,
          name: fullPath,
          id: item.id,
          size: item.metadata?.size,
          mimetype: item.metadata?.mimetype,
          updated_at: item.updated_at
        });
      }
    }
  }

  for (const b of buckets) {
    await listRecursive(b.name, '');
  }

  console.log(`Total Supabase objects found across all buckets: ${allObjects.length}`);
  allObjects.forEach(o => {
    console.log(`- [${o.bucket}] ${o.name} (${o.size} bytes, ${o.mimetype})`);
  });

  return allObjects;
}

checkSupabase().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
