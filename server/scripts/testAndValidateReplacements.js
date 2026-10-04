const https = require('https');
const http = require('http');

// Curated high-quality, relevant replacement images for each of the 45 broken URLs
const candidateMap = {
  // 1. Health & Fitness: Doorway Pull-Up Training Bar / Dumbbell / Kettlebell
  'https://images.unsplash.com/photo-1584116831289-e53b1cb4df5d?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80', // Premium Fitness & Gym equipment

  // 2. Toys: STEM Magnetic 3D Geometric Architectural Tile Set
  'https://images.unsplash.com/photo-1587654780014-daf204a10bd9?auto=format&fit=crop&w=800&q=80&sig=112':
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80', // STEM educational colorful magnetic blocks

  // 3. Toys: Interactive Astronomy Starlight Constellation Projector
  'https://images.unsplash.com/photo-1587654780014-daf204a10bd9?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80', // Starlight galaxy celestial toy

  // 4. Toys: Classic Backgammon Set
  'https://images.unsplash.com/photo-1609000580621-dcb8e2be69dd?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80', // Artisan classic wooden board game

  // 5. Toys: Classic Backgammon / Board Game
  'https://images.unsplash.com/photo-1530820883932-3da05e77d7da?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80', // Luxury board game pieces

  // 6. Toys: Vintage Dominoes / Tumble Tower / Chess
  'https://images.unsplash.com/photo-1596568362218-0a3ac647b1e8?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80', // Handcrafted wooden chess & dominoes

  // 7. Toys: Handmade Felt Animal Safari Puppet / Wooden Toy
  'https://images.unsplash.com/photo-1560859251-d563a49e2336?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80', // Handcrafted wooden & plush puppets

  // 8. Pets Care: Braided Cotton Rope Interactive Tug Dental Play Toy / Water Bottle
  'https://images.unsplash.com/photo-1583337130417-1776413b8c3e?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80', // Premium pet play toy & dog accessory

  // 9. Pets Care: Warm Water-Repellent Winter Dog Puffer Jacket Vest
  'https://images.unsplash.com/photo-1583337130417-1776413b8c3e?auto=format&fit=crop&w=800&q=80&sig=119':
    'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80', // Cozy dog jacket & pet apparel

  // 10. Vision Care: Square Minimalist Matte Titanium Optical Eyeglasses
  'https://images.unsplash.com/photo-1617714651527-5c8e74abb3b8?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80', // Minimalist titanium spectacle frames

  // 11. Vision Care: Keyhole Bridge Circular Heritage Spectacle Frames
  'https://images.unsplash.com/photo-1608904401626-c4adfa6c2d5f?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80', // Vintage round eyewear

  // 12. Hats: Wool Felt Pork Pie Hat with Silk Interior Lining
  'https://images.unsplash.com/photo-1572460483056-e6cf64a5bfb6?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=800&q=80', // Wool felt fedora / pork pie hat

  // 13. Hats: Wool Felt Pork Pie Hat / Classic Headwear
  'https://images.unsplash.com/photo-1552060155-89a413cbf87e?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80', // Tailored gentleman's hat

  // 14. Hats: Foldable Packable Crushable Travel Bucket Sun Hat
  'https://images.unsplash.com/photo-1622445272461-c6580cab5024?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80', // Casual canvas bucket hat

  // 15. Hats: Open-Weave Linen Breathable Summer Ivy Flat Cap
  'https://images.unsplash.com/photo-1561542320-9a18cd340e98?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80', // Classic flat cap / newsboy cap

  // 16. Hats: Corduroy Vintage-Toned Curved Brim Streetwear Cap
  'https://images.unsplash.com/photo-1529590003495-b2646e2c6b1e?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80', // Premium curved brim streetwear cap

  // 17. Hats: Chunky Alpaca Wool Turn-Up Cozy Snow Beanie
  'https://images.unsplash.com/photo-1532973497172-04d39a5be482?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80', // Rib-knit warm wool snow beanie

  // 18. Hats: Waffle Knit Fisherman Short Rolled Cuff Beanie
  'https://images.unsplash.com/photo-1562027032-32cdf39b5a39?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80', // Fisherman rolled cuff beanie

  // 19. Kids Wear: Sun-Safe Wide Brim Children Bucket Hat
  'https://images.unsplash.com/photo-1505928857043-23f5ebdfa53b?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80', // Kids sun hat / apparel

  // 20. Kids Wear: Waterproof Breathable Rain Boots for Puddle Play
  'https://images.unsplash.com/photo-1560526860-1f0e06f4c175?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80', // Children play shoes & boots

  // 21. Kids Wear: Breathable Mesh Hook-and-Loop Play Runners
  'https://images.unsplash.com/photo-1594608661623-aa0bd3a69799?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80', // Kids sporty sneakers

  // 22. Kids Wear: Bamboo Cotton Swaddle Bodysuit 3-Pack
  'https://images.unsplash.com/photo-1621452773781-0f992fd1f98e?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80', // Infant organic cotton bodysuit

  // 23. Kids Wear: Summer Cotton Muslin Overall Dungaree Set
  'https://images.unsplash.com/photo-1576013551627-0ae2f0e5240c?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80', // Kids linen dungarees set

  // 24. Kids Wear: Preppy Gingham Check Lightweight Boys Shirt
  'https://images.unsplash.com/photo-1565463462722-0a6308e4e9d2?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80', // Kids preppy collared shirt

  // 25. Kids Wear: Rib-Knit Sweetheart Toddler Pinafore Dress
  'https://images.unsplash.com/photo-1604467707321-70d009801bf0?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80', // Toddler linen pinafore dress

  // 26. Bags: Leather Luggage Tag with Solid Brass Monogram Buckle
  'https://images.unsplash.com/photo-1473188588951-955f30e455d6?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80', // Artisan leather goods & tag

  // 27. Bags: Ultra-Slim Executive Leather Laptop Briefcase Backpack
  'https://images.unsplash.com/photo-1585916420730-d7f95e942d46?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', // Executive leather backpack

  // 28. Bags: Pebbled Leather Passport & Boarding Pass Wallet Case
  'https://images.unsplash.com/photo-1622560480654-1ead9cbbb8f1?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80', // Luxury leather travel wallet

  // 29. Bags: Tri-Fold Smooth Vachetta Leather Pocket Wallet
  'https://images.unsplash.com/photo-1612902456551-071b5f5e26e3?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80', // Classic leather bifold / trifold wallet

  // 30. Bags: Half-Moon Smooth Calfskin Mini Crossbody Pouch
  'https://images.unsplash.com/photo-1596431176856-3f7d02de1c6a?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80', // Chic leather crossbody pouch

  // 31. Bags: Half-Moon Smooth Calfskin Mini Crossbody Pouch (Alternate angle)
  'https://images.unsplash.com/photo-1548354471-ac08fc4a694f?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', // Premium calfskin bag

  // 32. Bags: Minimalist Waterproof Technical Urban Roll-Top Pack
  'https://images.unsplash.com/photo-1547949003-9571a5aee5c8?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80', // Technical urban backpack

  // 33. Jewellery: The Aurelia 18K Gold Vermeil Bold Link Chain Necklace
  'https://images.unsplash.com/photo-1611591475819-79b8b73ff270?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', // 18K Gold chain statement jewelry

  // 34. Home & Living: Linen Upholstered Round Footstool Storage Ottoman / Mid-Century Lounge
  'https://images.unsplash.com/photo-1580481077111-9310a01ca06f?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', // Elegant upholstered designer armchair & ottoman

  // 35. Home & Living: Solid American Walnut Round Low Coffee Table
  'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80', // Minimalist walnut low coffee table

  // 36. Beauty: Handcrafted Organic Shea Butter Intensive Balm
  'https://images.unsplash.com/photo-1608248597359-2531a719d363?auto=format&fit=crop&w=800&q=80&sig=121':
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',

  // 37. Beauty: Sonic Pulsation Pore Cleansing Silicone Brush / Gua Sha Tool
  'https://images.unsplash.com/photo-1609097154318-64a7ae61e0f4?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', // Beauty skincare device & facial tool

  // 38. Beauty: Conditioning Peptide Volumizing Lash Mascara
  'https://images.unsplash.com/photo-1631730486784-5a60e52a86c6?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80', // Luxury mascara & cosmetics

  // 39. Beauty: Conditioning Peptide Volumizing Lash Mascara (Alternate)
  'https://images.unsplash.com/photo-1627384113858-43f03b1aa559?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80', // Makeup & eye cosmetic applicator

  // 40. Beauty: Ceramide Barrier Repair Intensive Whipped Cream
  'https://images.unsplash.com/photo-1608248597359-2531a719d363?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80', // Luxury face cream jar

  // 41. Electronics: Compact Multi-Port GaN 100W Fast Travel Charger
  'https://images.unsplash.com/photo-1622445268067-151528622c71?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80', // Compact GaN power adapter & tech charger

  // 42. Shoes: Woven Leather Minimalist Cross-Strap Mule / Summer Resort Sandal
  'https://images.unsplash.com/photo-1626299504040-e7526e9a2ced?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80', // Handcrafted leather mules & sandals

  // 43. Women Wear: Summer Flowy Lace Trim Linen Halter Top / Silk Blouse
  'https://images.unsplash.com/photo-1434389677669-e08b4cda3a20?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80', // Flowy elegant summer linen top

  // 44. Women Wear: Pleated Wool Crepe Accordion Skirt
  'https://images.unsplash.com/photo-1599662875272-64de8f5e025e?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80', // Elegant pleated skirt

  // 45. Women Wear: Satin Asymmetric Bias Cut Slip Skirt
  'https://images.unsplash.com/photo-1583496661160-fb5886a773f4?auto=format&fit=crop&w=800&q=80':
    'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80', // Satin silk flowing skirt
};

// Check candidate URLs via HTTP HEAD/GET
function checkCandidate(url) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      https.get(parsed, { headers: { 'User-Agent': 'Mozilla/5.0', Range: 'bytes=0-10' }, timeout: 6000 }, (res) => {
        res.resume();
        resolve({ url, ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode });
      }).on('error', (e) => resolve({ url, ok: false, error: e.message }))
        .on('timeout', () => resolve({ url, ok: false, error: 'Timeout' }));
    } catch (e) {
      resolve({ url, ok: false, error: e.message });
    }
  });
}

async function validateAll() {
  console.log('Testing all replacement candidate URLs...');
  const candidates = Object.values(candidateMap);
  let failed = 0;
  for (const c of candidates) {
    const res = await checkCandidate(c);
    if (!res.ok) {
      console.error(`❌ FAILED (Status ${res.status}): ${c}`);
      failed++;
    } else {
      console.log(`✅ OK (${res.status}): ${c.slice(0, 75)}...`);
    }
  }
  console.log(`\nValidation complete. Passed: ${candidates.length - failed} / ${candidates.length}`);
  if (failed === 0) {
    console.log('🎉 ALL CANDIDATE URLS VALIDATED WITH 200 OK!');
  }
}

validateAll();
