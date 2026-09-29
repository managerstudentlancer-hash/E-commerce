const http = require('http');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://127.0.0.1:5000/api';

const candidateMap = {
  // 1. Health & Fitness: Doorway Pull-Up Training Bar / Dumbbell / Kettlebell
  'https://images.unsplash.com/photo-1584116831289-e53b1cb4df5d?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',

  // 2. Toys: STEM Magnetic 3D Geometric Architectural Tile Set
  'https://images.unsplash.com/photo-1587654780014-daf204a10bd9?auto=format&fit=crop&w=800&q=80&sig=112':
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',

  // 3. Toys: Interactive Astronomy Starlight Constellation Projector
  'https://images.unsplash.com/photo-1587654780014-daf204a10bd9?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80',

  // 4. Toys: Classic Backgammon Set
  'https://images.unsplash.com/photo-1609000580621-dcb8e2be69dd?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80',

  // 5. Toys: Classic Backgammon / Board Game
  'https://images.unsplash.com/photo-1530820883932-3da05e77d7da?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80',

  // 6. Toys: Vintage Dominoes / Tumble Tower / Chess
  'https://images.unsplash.com/photo-1596568362218-0a3ac647b1e8?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80',

  // 7. Toys: Handmade Felt Animal Safari Puppet / Wooden Toy
  'https://images.unsplash.com/photo-1560859251-d563a49e2336?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',

  // 8. Pets Care: Braided Cotton Rope Interactive Tug Dental Play Toy / Water Bottle
  'https://images.unsplash.com/photo-1583337130417-1776413b8c3e?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80',

  // 9. Pets Care: Warm Water-Repellent Winter Dog Puffer Jacket Vest
  'https://images.unsplash.com/photo-1583337130417-1776413b8c3e?auto=format&fit=crop&w=800&q=80&sig=119':
    'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80',

  // 10. Vision Care: Square Minimalist Matte Titanium Optical Eyeglasses
  'https://images.unsplash.com/photo-1617714651527-5c8e74abb3b8?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80',

  // 11. Vision Care: Keyhole Bridge Circular Heritage Spectacle Frames
  'https://images.unsplash.com/photo-1608904401626-c4adfa6c2d5f?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80',

  // 12. Hats: Wool Felt Pork Pie Hat with Silk Interior Lining
  'https://images.unsplash.com/photo-1572460483056-e6cf64a5bfb6?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=800&q=80',

  // 13. Hats: Wool Felt Pork Pie Hat / Classic Headwear
  'https://images.unsplash.com/photo-1552060155-89a413cbf87e?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80',

  // 14. Hats: Foldable Packable Crushable Travel Bucket Sun Hat
  'https://images.unsplash.com/photo-1622445272461-c6580cab5024?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80',

  // 15. Hats: Open-Weave Linen Breathable Summer Ivy Flat Cap
  'https://images.unsplash.com/photo-1561542320-9a18cd340e98?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80',

  // 16. Hats: Corduroy Vintage-Toned Curved Brim Streetwear Cap
  'https://images.unsplash.com/photo-1529590003495-b2646e2c6b1e?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',

  // 17. Hats: Chunky Alpaca Wool Turn-Up Cozy Snow Beanie
  'https://images.unsplash.com/photo-1532973497172-04d39a5be482?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80',

  // 18. Hats: Waffle Knit Fisherman Short Rolled Cuff Beanie
  'https://images.unsplash.com/photo-1562027032-32cdf39b5a39?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',

  // 19. Kids Wear: Sun-Safe Wide Brim Children Bucket Hat
  'https://images.unsplash.com/photo-1505928857043-23f5ebdfa53b?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',

  // 20. Kids Wear: Waterproof Breathable Rain Boots for Puddle Play
  'https://images.unsplash.com/photo-1560526860-1f0e06f4c175?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80',

  // 21. Kids Wear: Breathable Mesh Hook-and-Loop Play Runners
  'https://images.unsplash.com/photo-1594608661623-aa0bd3a69799?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',

  // 22. Kids Wear: Bamboo Cotton Swaddle Bodysuit 3-Pack
  'https://images.unsplash.com/photo-1621452773781-0f992fd1f98e?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80',

  // 23. Kids Wear: Summer Cotton Muslin Overall Dungaree Set
  'https://images.unsplash.com/photo-1576013551627-0ae2f0e5240c?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80',

  // 24. Kids Wear: Preppy Gingham Check Lightweight Boys Shirt
  'https://images.unsplash.com/photo-1565463462722-0a6308e4e9d2?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',

  // 25. Kids Wear: Rib-Knit Sweetheart Toddler Pinafore Dress
  'https://images.unsplash.com/photo-1604467707321-70d009801bf0?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80',

  // 26. Bags: Leather Luggage Tag with Solid Brass Monogram Buckle
  'https://images.unsplash.com/photo-1473188588951-955f30e455d6?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',

  // 27. Bags: Ultra-Slim Executive Leather Laptop Briefcase Backpack
  'https://images.unsplash.com/photo-1585916420730-d7f95e942d46?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',

  // 28. Bags: Pebbled Leather Passport & Boarding Pass Wallet Case
  'https://images.unsplash.com/photo-1622560480654-1ead9cbbb8f1?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',

  // 29. Bags: Tri-Fold Smooth Vachetta Leather Pocket Wallet
  'https://images.unsplash.com/photo-1612902456551-071b5f5e26e3?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',

  // 30. Bags: Half-Moon Smooth Calfskin Mini Crossbody Pouch
  'https://images.unsplash.com/photo-1596431176856-3f7d02de1c6a?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80',

  // 31. Bags: Half-Moon Smooth Calfskin Mini Crossbody Pouch (Alternate angle)
  'https://images.unsplash.com/photo-1548354471-ac08fc4a694f?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',

  // 32. Bags: Minimalist Waterproof Technical Urban Roll-Top Pack
  'https://images.unsplash.com/photo-1547949003-9571a5aee5c8?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',

  // 33. Jewellery: The Aurelia 18K Gold Vermeil Bold Link Chain Necklace
  'https://images.unsplash.com/photo-1611591475819-79b8b73ff270?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',

  // 34. Home & Living: Linen Upholstered Round Footstool Storage Ottoman / Mid-Century Lounge
  'https://images.unsplash.com/photo-1580481077111-9310a01ca06f?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',

  // 35. Home & Living: Solid American Walnut Round Low Coffee Table
  'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80',

  // 36. Beauty: Handcrafted Organic Shea Butter Intensive Balm
  'https://images.unsplash.com/photo-1608248597359-2531a719d363?auto=format&fit=crop&w=800&q=80&sig=121':
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',

  // 37. Beauty: Sonic Pulsation Pore Cleansing Silicone Brush / Gua Sha Tool
  'https://images.unsplash.com/photo-1609097154318-64a7ae61e0f4?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',

  // 38. Beauty: Conditioning Peptide Volumizing Lash Mascara
  'https://images.unsplash.com/photo-1631730486784-5a60e52a86c6?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',

  // 39. Beauty: Conditioning Peptide Volumizing Lash Mascara (Alternate)
  'https://images.unsplash.com/photo-1627384113858-43f03b1aa559?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',

  // 40. Beauty: Ceramide Barrier Repair Intensive Whipped Cream
  'https://images.unsplash.com/photo-1608248597359-2531a719d363?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',

  // 41. Electronics: Compact Multi-Port GaN 100W Fast Travel Charger
  'https://images.unsplash.com/photo-1622445268067-151528622c71?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',

  // 42. Shoes: Woven Leather Minimalist Cross-Strap Mule / Summer Resort Sandal
  'https://images.unsplash.com/photo-1626299504040-e7526e9a2ced?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',

  // 43. Women Wear: Summer Flowy Lace Trim Linen Halter Top / Silk Blouse
  'https://images.unsplash.com/photo-1434389677669-e08b4cda3a20?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80',

  // 44. Women Wear: Pleated Wool Crepe Accordion Skirt
  'https://images.unsplash.com/photo-1599662875272-64de8f5e025e?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',

  // 45. Women Wear: Satin Asymmetric Bias Cut Slip Skirt
  'https://images.unsplash.com/photo-1583496661160-fb5886a773f4?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80',
};

function request(endpoint, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_BASE}${endpoint}`);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'object' ? JSON.stringify(postData) : postData);
    }
    req.end();
  });
}

function replaceUrl(u) {
  if (!u) return u;
  return candidateMap[u] || u;
}

async function applyFixes() {
  console.log('=== APPLYING IMAGE FIXES ACROSS DATABASE & SEED DATA ===\n');

  // 1. Authenticate as Admin
  console.log('Logging in as Admin...');
  const adminLogin = await request('/auth/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { email: 'admin@vexivo.com', password: 'AdminPass123!' });

  const adminToken = adminLogin.body?.token;
  if (!adminToken) {
    throw new Error('Admin login failed: ' + JSON.stringify(adminLogin.body));
  }
  console.log('✅ Admin authenticated.\n');

  // 2. Fetch all products from live database
  console.log('Fetching live products...');
  const prodRes = await request('/products?limit=500');
  const products = prodRes.body?.products || [];
  console.log(`Fetched ${products.length} products.`);

  let updatedProductsCount = 0;
  let totalFixedFields = 0;

  for (const prod of products) {
    let changed = false;
    let newThumbnail = prod.thumbnail;
    let newHoverImage = prod.hoverImage;
    let newImages = Array.isArray(prod.images) ? [...prod.images] : [];
    let newOptions = Array.isArray(prod.options) ? [...prod.options] : [];

    if (candidateMap[prod.thumbnail]) {
      newThumbnail = candidateMap[prod.thumbnail];
      changed = true;
      totalFixedFields++;
    }

    if (candidateMap[prod.hoverImage]) {
      newHoverImage = candidateMap[prod.hoverImage];
      changed = true;
      totalFixedFields++;
    }

    newImages = newImages.map((img) => {
      if (candidateMap[img]) {
        changed = true;
        totalFixedFields++;
        return candidateMap[img];
      }
      return img;
    });

    newOptions = newOptions.map((opt) => {
      if (opt.image && candidateMap[opt.image]) {
        changed = true;
        totalFixedFields++;
        return { ...opt, image: candidateMap[opt.image] };
      }
      return opt;
    });

    if (changed) {
      const updatePayload = {
        thumbnail: newThumbnail,
        hoverImage: newHoverImage,
        images: newImages,
        options: newOptions,
      };

      const putRes = await request(`/products/${prod._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
      }, updatePayload);

      if (putRes.status === 200 && putRes.body?.success) {
        updatedProductsCount++;
        console.log(`  [UPDATED] ${prod.name} (ID: ${prod._id})`);
      } else {
        console.error(`  [FAILED] ${prod.name} -> status: ${putRes.status}`, putRes.body);
      }
    }
  }

  console.log(`\n✅ Finished updating live database!`);
  console.log(`  Products updated in database: ${updatedProductsCount}`);
  console.log(`  Total image references updated: ${totalFixedFields}\n`);

  // 3. Update server/seed/seedData.js so future seeds remain clean
  const seedPath = path.join(__dirname, '../seed/seedData.js');
  if (fs.existsSync(seedPath)) {
    console.log('Updating seedData.js permanent file...');
    let seedContent = fs.readFileSync(seedPath, 'utf8');
    let seedReplacedCount = 0;

    for (const [brokenUrl, replacementUrl] of Object.entries(candidateMap)) {
      // Escape for string replace
      if (seedContent.includes(brokenUrl)) {
        seedContent = seedContent.split(brokenUrl).join(replacementUrl);
        seedReplacedCount++;
      }
    }

    fs.writeFileSync(seedPath, seedContent, 'utf8');
    console.log(`✅ seedData.js updated! Replaced occurrences of ${seedReplacedCount} broken URLs.\n`);
  }

  // 4. Update bagsData.js and shoesData.js if any broken URLs exist there
  const bagsPath = path.join(__dirname, '../seed/bagsData.js');
  if (fs.existsSync(bagsPath)) {
    let bagsContent = fs.readFileSync(bagsPath, 'utf8');
    for (const [brokenUrl, replacementUrl] of Object.entries(candidateMap)) {
      if (bagsContent.includes(brokenUrl)) {
        bagsContent = bagsContent.split(brokenUrl).join(replacementUrl);
      }
    }
    fs.writeFileSync(bagsPath, bagsContent, 'utf8');
  }

  const shoesPath = path.join(__dirname, '../seed/shoesData.js');
  if (fs.existsSync(shoesPath)) {
    let shoesContent = fs.readFileSync(shoesPath, 'utf8');
    for (const [brokenUrl, replacementUrl] of Object.entries(candidateMap)) {
      if (shoesContent.includes(brokenUrl)) {
        shoesContent = shoesContent.split(brokenUrl).join(replacementUrl);
      }
    }
    fs.writeFileSync(shoesPath, shoesContent, 'utf8');
  }

  console.log('=== FIXES SUCCESSFULLY APPLIED! ===');
}

applyFixes().catch((e) => {
  console.error('Fatal error applying fixes:', e);
  process.exit(1);
});
