const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) results = results.concat(walk(fullPath));
    else if (file.endsWith('.jsx') || file.endsWith('.js')) results.push(fullPath);
  });
  return results;
}

const files = walk(path.join(__dirname, '../../client/src'));
const found = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    // Regex matching dollar signs for pricing, e.g., $100, $50, '$', "$", >$
    const clean = l.replace(/\$\{[^}]*\}/g, ''); // remove template literals
    if (clean.includes('$')) {
      found.push(`${path.relative(path.join(__dirname, '../..'), f)}:${i + 1} -> ${l.trim()}`);
    }
  });
});

console.log(`Found ${found.length} lines with dollar signs:`);
found.forEach(item => console.log(item));
