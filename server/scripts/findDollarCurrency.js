const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) results = results.concat(walk(p));
    else if (p.endsWith('.jsx') || p.endsWith('.js')) results.push(p);
  });
  return results;
}

const files = walk(path.join(__dirname, '../../client/src'));
console.log(`Checking ${files.length} client files for currency dollar signs...`);

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // Check for $ followed by variable or literal currency
    if (
      /\$+\{[^}]*(price|Price|total|Total|amount|Amount|subtotal|discount|cost|shipping|original|current)/i.test(line) ||
      />\$[0-9{]/.test(line) ||
      /\'\$[0-9]/.test(line) ||
      /\"\$[0-9]/.test(line) ||
      /\s\$\{[^}]+\}/.test(line)
    ) {
      console.log(`${path.relative(path.join(__dirname, '../..'), f)}:${idx + 1} -> ${line.trim()}`);
    }
  });
});
