const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

function getAllFiles(dir, exts = ['.jsx', '.js']) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      if (item !== 'node_modules' && item !== 'dist' && item !== '.git') {
        files = files.concat(getAllFiles(full, exts));
      }
    } else if (exts.includes(path.extname(item))) {
      files.push(full);
    }
  }
  return files;
}

const clientDir = path.join(__dirname, '../../client/src');
const clientFiles = getAllFiles(clientDir);
const urlRegex = /(https?:\/\/[^\s'"`,;)]+)/g;
const foundUrls = new Map();

for (const file of clientFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = urlRegex.exec(content)) !== null) {
    const url = match[1].replace(/[,\);]+$/, '');
    if (url.includes('images.unsplash.com') || url.includes('cloudinary') || url.includes('supabase.co')) {
      if (!foundUrls.has(url)) foundUrls.set(url, []);
      foundUrls.get(url).push(path.relative(clientDir, file));
    }
  }
}

console.log('Found ' + foundUrls.size + ' unique hardcoded image URLs in frontend source code.');

function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https:') ? https : http;
      client.get(new URL(url), { headers: { 'User-Agent': 'Mozilla/5.0', Range: 'bytes=0-10' }, timeout: 6000 }, (res) => {
        res.resume();
        resolve({ url, ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode });
      }).on('error', (e) => resolve({ url, ok: false, error: e.message }))
        .on('timeout', () => resolve({ url, ok: false, error: 'timeout' }));
    } catch (e) {
      resolve({ url, ok: false, error: e.message });
    }
  });
}

async function checkAll() {
  const broken = [];
  for (const [url, files] of foundUrls.entries()) {
    const res = await checkUrl(url);
    if (!res.ok) {
      broken.push({ url, status: res.status, files });
      console.log(`❌ BROKEN URL (${res.status}): ${url}`);
      console.log(`   In files: ${files.join(', ')}`);
    }
  }
  console.log('\nTotal broken hardcoded URLs in frontend:', broken.length);
}

checkAll();
