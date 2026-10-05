const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, '../seed/seedData.js');
let content = fs.readFileSync(seedPath, 'utf8');

function convertToInr(usd) {
  const raw = usd * 28;
  let inr = Math.round(raw / 100) * 100 - 1;
  if (inr < 499) inr = 499;
  return inr;
}

function calculateMrp(inrPrice, existingDiscount) {
  const disc = existingDiscount && existingDiscount >= 15 && existingDiscount <= 50 ? existingDiscount : 30;
  const rawMrp = inrPrice / (1 - disc / 100);
  let mrp = Math.round(rawMrp / 100) * 100 - 1;
  if (mrp <= inrPrice) mrp = inrPrice + 500;
  return mrp;
}

// 1. Update rawProducts
const pMatch = content.match(/const rawProducts = (\[[\s\S]*?\]);\s*const collectionsData/);
if (!pMatch) {
  console.error('Could not match rawProducts in seedData.js');
  process.exit(1);
}

const products = JSON.parse(pMatch[1]);
console.log(`Processing ${products.length} products for INR pricing...`);

let convertedCount = 0;
products.forEach((p, idx) => {
  if (p.price < 500) {
    const oldPrice = p.price;
    const oldMrp = p.compareAtPrice;
    const inrPrice = convertToInr(p.price);
    const inrMrp = calculateMrp(inrPrice, p.discount);
    const inrDiscount = Math.round(((inrMrp - inrPrice) / inrMrp) * 100);

    p.price = inrPrice;
    p.compareAtPrice = inrMrp;
    p.discount = inrDiscount;

    // Update variants / options if they have prices
    if (Array.isArray(p.options)) {
      p.options.forEach(opt => {
        if (opt.price < 500) opt.price = inrPrice;
      });
    }
    if (Array.isArray(p.variants)) {
      p.variants.forEach(v => {
        if (v.price && v.price < 500) v.price = inrPrice;
      });
    }

    convertedCount++;
    if (convertedCount <= 10) {
      console.log(`[#${idx + 1}] ${p.name.slice(0, 32).padEnd(33)}: $${oldPrice} -> ₹${inrPrice} (MRP: ₹${inrMrp}, ${inrDiscount}% off)`);
    }
  }
});

console.log(`Converted ${convertedCount} legacy USD products to authentic INR.`);

// 2. Update coupons
const updatedCoupons = [
  {
    code: 'VEX10',
    type: 'percentage',
    value: 10,
    minimumOrder: 999,
    maximumDiscount: 500,
    usageLimit: 1000,
    active: true
  },
  {
    code: 'WELCOME20',
    type: 'percentage',
    value: 20,
    minimumOrder: 1499,
    maximumDiscount: 1000,
    usageLimit: 500,
    active: true
  },
  {
    code: 'FREESHIP',
    type: 'fixed',
    value: 99,
    minimumOrder: 499,
    maximumDiscount: 99,
    usageLimit: 2000,
    active: true
  },
  {
    code: 'AUTUMN30',
    type: 'percentage',
    value: 30,
    minimumOrder: 1999,
    maximumDiscount: 1500,
    usageLimit: 2000,
    active: true
  }
];

// Re-serialize rawProducts
const newProductsStr = 'const rawProducts = ' + JSON.stringify(products, null, 2) + ';\nconst collectionsData';
content = content.replace(/const rawProducts = (\[[\s\S]*?\]);\s*const collectionsData/, newProductsStr);

// Re-serialize couponsData
const newCouponsStr = 'const couponsData = ' + JSON.stringify(updatedCoupons, null, 2) + ';\n\nconst seedAll';
content = content.replace(/const couponsData = (\[[\s\S]*?\]);\s*const seedAll/, newCouponsStr);

fs.writeFileSync(seedPath, content, 'utf8');
console.log('✅ Successfully updated server/seed/seedData.js with 100% INR pricing and Indian coupon thresholds!');

// Check overall min and max across all 477 products
let min = 999999, max = 0;
products.forEach(p => {
  if (p.price < min) min = p.price;
  if (p.price > max) max = p.price;
});
console.log(`Final Catalog Price Statistics: Min = ₹${min}, Max = ₹${max}, Total Products = ${products.length}`);
