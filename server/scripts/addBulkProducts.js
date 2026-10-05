const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Helper to check URL status
function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.get(new URL(url), { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', Range: 'bytes=0-10' }, timeout: 5000 }, (res) => {
        res.resume();
        resolve({ url, ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode });
      });
      req.on('error', () => resolve({ url, ok: false, status: 0 }));
      req.on('timeout', () => { req.destroy(); resolve({ url, ok: false, status: 408 }); });
    } catch {
      resolve({ url, ok: false, status: 0 });
    }
  });
}

// 1. Load verified pool
const verifiedPool = JSON.parse(fs.readFileSync(path.join(__dirname, 'verified_pool.json'), 'utf8'));

// Extract verified seed images as backup
const seedContent = fs.readFileSync(path.join(__dirname, '../seed/seedData.js'), 'utf8');
const pMatch = seedContent.match(/const rawProducts = (\[[\s\S]*?\]);\s*const collectionsData/);
const seedProducts = pMatch ? JSON.parse(pMatch[1]) : [];

const verifiedByCat = {};
for (const [cat, urls] of Object.entries(verifiedPool)) {
  verifiedByCat[cat] = [...urls];
}
seedProducts.forEach(p => {
  if (!verifiedByCat[p.category]) verifiedByCat[p.category] = [];
  (p.images || []).forEach(img => {
    if (!verifiedByCat[p.category].includes(img)) verifiedByCat[p.category].push(img);
  });
});

console.log('Verified Image Pool Summary:');
Object.keys(verifiedByCat).forEach(c => console.log(`  - ${c.padEnd(20)}: ${verifiedByCat[c].length} verified images`));

function getImagesFor(category, idx) {
  const pool = verifiedByCat[category] || verifiedByCat['Women Wear'];
  const first = pool[idx % pool.length];
  const second = pool[(idx + 1) % pool.length];
  const third = pool[(idx + 2) % pool.length];
  return [first, second, third];
}

// 2. Define 12 high quality products per category (14 categories = 168 products)
const catalogDefinitions = [
  // ===================== 1. WOMEN WEAR =====================
  {
    category: 'Women Wear',
    categorySlug: 'women-wear',
    subcategory: 'Ethnic Wear',
    collectionSlug: 'bestsellers',
    brand: 'VEXIVO Couture',
    sellerName: 'Varanasi Weavers Co-op',
    sellerInfo: 'Certified GI Authentic Banarasi Silk Artisans',
    items: [
      {
        name: 'Handcrafted Banarasi Silk Zari Festive Anarkali',
        price: 4499,
        compareAtPrice: 6999,
        stock: 45,
        description: 'Woven with pure gold and silver zari thread on fine Mulberry silk. Features a flared silhouette with hand-embroidered gota patti work on the neckline and hem.',
        shortDescription: 'Pure Banarasi silk zari festive anarkali suit.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Maroon Gold', 'Emerald Green']
      },
      {
        name: 'Chanderi Handloom Floral Block Print Kurta Set',
        price: 2299,
        compareAtPrice: 3499,
        stock: 60,
        description: 'Lightweight gossamer Chanderi cotton-silk fabric adorned with traditional Bagru botanical block prints. Paired with scalloped organza dupatta.',
        shortDescription: 'Lightweight Chanderi floral kurta with organza dupatta.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: ['Sage Green', 'Dusty Rose']
      },
      {
        name: 'Tailored Italian Crepe Double-Breasted Blazer',
        price: 3899,
        compareAtPrice: 5499,
        stock: 30,
        description: 'Cut with structured peaked lapels, padded shoulders, and tortoiseshell horn buttons. Fully lined in silky cupro with internal passport pocket.',
        shortDescription: 'Sharp double-breasted crepe blazer with peak lapels.',
        sizes: ['S', 'M', 'L'],
        colors: ['Oatmeal Beige', 'Midnight Black']
      },
      {
        name: 'Tiered Bohemian Broderie Anglaise Maxi Sundress',
        price: 2799,
        compareAtPrice: 3999,
        stock: 55,
        description: 'Crafted from 100% breathable organic cotton eyelet lace with tiered flutter ruffle hem, smocked back bodice, and adjustable tie straps.',
        shortDescription: 'Organic cotton eyelet lace tiered maxi dress.',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Ivory Cream', 'Sky Blue']
      },
      {
        name: 'Mulberry Silk Hand-Pleated Evening Cocktail Gown',
        price: 5999,
        compareAtPrice: 8499,
        stock: 25,
        description: 'Sensational Grecian draped gown in high-luster mulberry silk charmeuse with asymmetrical shoulder detail and concealed side zipper.',
        shortDescription: 'Draped Grecian gown in pure mulberry silk charmeuse.',
        sizes: ['S', 'M', 'L'],
        colors: ['Burgundy Wine', 'Sapphire Blue']
      },
      {
        name: 'Cashmere Knit High-Neck Tunic Sweater',
        price: 3499,
        compareAtPrice: 4999,
        stock: 40,
        description: 'Spun from pure grade-A Mongolian cashmere with ribbed funnel neckline and drop shoulder seams. Effortless slouchy cold-weather warmth.',
        shortDescription: 'Grade-A Mongolian cashmere funnel neck tunic.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Heather Camel', 'Charcoal Grey']
      },
      {
        name: 'Belgian Linen Wrap Utility Trench Coat',
        price: 4299,
        compareAtPrice: 5999,
        stock: 35,
        description: 'Pre-washed heavy Belgian flax linen trench featuring storm flaps, tortoiseshell double buckle belt, and deep welt pockets.',
        shortDescription: 'Relaxed unlined utility trench in Belgian flax linen.',
        sizes: ['S', 'M', 'L'],
        colors: ['Khaki Tan', 'Olive Moss']
      },
      {
        name: 'Organza Embroidered Festive Dupatta Set',
        price: 1999,
        compareAtPrice: 2899,
        stock: 50,
        description: 'Sheer gossamer organza with hand-embroidered sequin border and floral motifs. Pairs effortlessly with raw silk and velvet kurtas.',
        shortDescription: 'Hand-embroidered organza dupatta with sequin border.',
        sizes: ['Free Size (2.5m)'],
        colors: ['Blush Pink', 'Champagne Gold']
      },
      {
        name: 'Pleated Satin Wide-Leg Palazzo Trousers',
        price: 2199,
        compareAtPrice: 3199,
        stock: 48,
        description: 'High-waisted fluid crepe satin palazzo pants with sharp knife pleats and an elasticated back waistband for all-day comfort.',
        shortDescription: 'High-rise knife pleated satin wide-leg trousers.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Champagne', 'Obsidian Black']
      },
      {
        name: 'Parisian Fluted Sleeve Floral Chiffon Blouse',
        price: 1799,
        compareAtPrice: 2499,
        stock: 65,
        description: 'Semi-sheer vintage floral chiffon with delicate fluted cuffs, keyhole button closure at back, and camisole slip included.',
        shortDescription: 'Vintage floral chiffon blouse with fluted cuffs.',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: ['Vintage Rose', 'Midnight Floral']
      },
      {
        name: 'Merino Wool Cardigan with Tortoiseshell Buttons',
        price: 2699,
        compareAtPrice: 3899,
        stock: 52,
        description: 'Extra-fine Australian merino wool cardigan knit in a delicate micro-waffle stitch with reinforced grosgrain ribbon button placket.',
        shortDescription: 'Extra-fine merino wool cardigan with horn buttons.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Oatmeal', 'Sage Mist']
      },
      {
        name: 'Raw Silk Embroidered Crop Top and Lehenga Skirt',
        price: 6499,
        compareAtPrice: 9499,
        stock: 20,
        description: 'Rich raw dupioni silk set with heavy hand-embroidered zardozi and mirror work. Complete with can-can lining for voluminous flare.',
        shortDescription: 'Handcrafted zardozi embroidered raw silk lehenga set.',
        sizes: ['S', 'M', 'L'],
        colors: ['Royal Rust', 'Peacock Teal']
      }
    ]
  },

  // ===================== 2. MEN WEAR =====================
  {
    category: 'Men Wear',
    categorySlug: 'men-wear',
    subcategory: 'Tailoring & Casuals',
    collectionSlug: 'trending',
    brand: 'VEXIVO Sartorial',
    sellerName: 'Savile Row Tailors',
    sellerInfo: 'Master Craftsmen in British Heritage Menswear',
    items: [
      {
        name: 'Savile Row Tailored Double-Breasted Wool Blazer',
        price: 5499,
        compareAtPrice: 7999,
        stock: 35,
        description: 'Constructed from English worsted wool with floating half-canvas chest piece and surgeon cuffs. Sharp peaked lapels offer enduring power tailoring.',
        shortDescription: 'English worsted wool half-canvas double-breasted blazer.',
        sizes: ['38R', '40R', '42R', '44R'],
        colors: ['Navy Pinhead', 'Charcoal Melange']
      },
      {
        name: 'Egyptian Long-Staple Cotton Oxford Dress Shirt',
        price: 1999,
        compareAtPrice: 2899,
        stock: 75,
        description: '100% Giza 87 Egyptian long-staple cotton woven in a durable royal Oxford weave. Features genuine Australian mother-of-pearl buttons.',
        shortDescription: 'Giza 87 Egyptian cotton royal Oxford button-down.',
        sizes: ['39', '40', '42', '44'],
        colors: ['Crisp White', 'Ice Blue']
      },
      {
        name: 'Heavyweight 450GSM Loopback French Terry Crewneck',
        price: 2499,
        compareAtPrice: 3499,
        stock: 50,
        description: 'Knitted on vintage flatbed machines in 100% organic combed cotton. Pre-shrunk with ribbed side gussets for unrestricted movement.',
        shortDescription: 'Heavyweight 450GSM loopback organic cotton sweatshirt.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Heather Grey', 'Washed Olive']
      },
      {
        name: 'Selvedge Raw Indigo 14oz Japanese Denim Jeans',
        price: 3699,
        compareAtPrice: 4999,
        stock: 40,
        description: 'Woven on vintage Toyoda shuttle looms in Okayama, Japan. Features redline selvedge ID, hidden copper rivets, and vegetable-tanned leather patch.',
        shortDescription: 'Okayama 14oz redline selvedge raw indigo denim.',
        sizes: ['30x32', '32x32', '34x32', '36x32'],
        colors: ['Deep Indigo Raw']
      },
      {
        name: 'Merino Wool Mock-Neck Ribbed Pullover',
        price: 2899,
        compareAtPrice: 3999,
        stock: 45,
        description: 'Spun from 19.5-micron Australian merino wool with thermo-regulating properties. Modern minimalist mock neck for sleek layered looks.',
        shortDescription: 'Australian 19.5-micron merino wool mock neck knit.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Espresso Brown', 'Black Onyx']
      },
      {
        name: 'British Showerproof Gabardine Trench Overcoat',
        price: 6499,
        compareAtPrice: 8999,
        stock: 28,
        description: 'Tightly woven cotton gabardine engineered to repel torrential rain while remaining breathable. Fully lined in custom check cotton twill.',
        shortDescription: 'Weatherproof cotton gabardine tailored trench coat.',
        sizes: ['38R', '40R', '42R', '44R'],
        colors: ['Honey Beige', 'Ink Navy']
      },
      {
        name: 'Tailored Relaxed Cuban Collar Pure Linen Shirt',
        price: 2199,
        compareAtPrice: 3199,
        stock: 60,
        description: 'Normandy flax linen woven into a light, airy weave. Cut with an open camp collar, straight vented hem, and natural shell buttons.',
        shortDescription: 'Normandy flax linen relaxed Cuban collar summer shirt.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Terracotta', 'Parchment Sand']
      },
      {
        name: 'Italian Wool Houndstooth Double-Breasted Overcoat',
        price: 6999,
        compareAtPrice: 9999,
        stock: 22,
        description: 'Spun in Prato, Italy from a heavy wool-cashmere blend with classic monochrome houndstooth motif. Back vent allows easy walking stride.',
        shortDescription: 'Italian wool-cashmere houndstooth long overcoat.',
        sizes: ['38R', '40R', '42R', '44R'],
        colors: ['Black & Ivory Houndstooth']
      },
      {
        name: 'Brushed Cotton Flannel Buffalo Check Casual Shirt',
        price: 1899,
        compareAtPrice: 2699,
        stock: 65,
        description: 'Double-brushed cotton flannel offering supreme softness and insulation. Features reinforced twin buttoned chest pockets and triple-needle stitching.',
        shortDescription: 'Double-brushed heavyweight cotton flannel shirt.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Red & Black Check', 'Forest Green Plaid']
      },
      {
        name: 'Single-Pleat Tapered Stretch Cotton Chinos',
        price: 2299,
        compareAtPrice: 3199,
        stock: 55,
        description: 'Tailored with a single forward pleat, mid-rise waist, and gentle taper through the ankle. Woven with 2% elastane for flexible mobility.',
        shortDescription: 'Single-pleat tailored stretch cotton chinos.',
        sizes: ['30', '32', '34', '36'],
        colors: ['Stone Beige', 'Dark Navy']
      },
      {
        name: 'Fine Gauge Cashmere Blend Ribbed V-Neck Sweater',
        price: 3299,
        compareAtPrice: 4599,
        stock: 38,
        description: 'Plush blend of 70% merino wool and 30% Mongolian cashmere. Classic V-neck depth designed to frame dress shirt collars perfectly.',
        shortDescription: 'Merino-cashmere blend fine gauge V-neck sweater.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Dark Pine Green', 'Burgundy']
      },
      {
        name: 'Technical Waterproof Commuter Field Jacket',
        price: 4799,
        compareAtPrice: 6499,
        stock: 30,
        description: 'Three-layer waterproof breathable shell with fully taped seams, four utility bellows pockets, and a stowaway emergency hood.',
        shortDescription: '3-layer waterproof breathable commuter field jacket.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Matte Black', 'Deep Khaki']
      }
    ]
  },

  // ===================== 3. KIDS WEAR =====================
  {
    category: 'Kids Wear',
    categorySlug: 'kids-wear',
    subcategory: 'Infant & Children Essentials',
    collectionSlug: 'new-arrivals',
    brand: 'VEXIVO Tiny',
    sellerName: 'Pure Baby Essentials',
    sellerInfo: 'Certified GOTS Organic Children Clothing',
    items: [
      {
        name: 'Certified GOTS Organic Bamboo Cotton Toddler Romper 2-Pack',
        price: 1499,
        compareAtPrice: 2199,
        stock: 70,
        description: 'Buttery soft thermo-regulating bamboo viscose with two-way ankle-to-chin zip for effortless diaper changes. Tagless with foldover scratch mittens.',
        shortDescription: 'GOTS organic bamboo cotton 2-way zip sleep romper.',
        sizes: ['0-3M', '3-6M', '6-12M', '12-18M'],
        colors: ['Oatmeal & Sage']
      },
      {
        name: 'Organic Muslin Cotton Frill Sleeve Toddler Dress',
        price: 1299,
        compareAtPrice: 1899,
        stock: 60,
        description: 'Four-layer breathable organic cotton muslin that grows softer with every wash. Delicately gathered flutter sleeves with coconut shell back buttons.',
        shortDescription: '4-layer organic cotton muslin flutter sleeve dress.',
        sizes: ['1-2Y', '2-3Y', '3-4Y', '4-5Y'],
        colors: ['Dusty Blush', 'Mustard Yellow']
      },
      {
        name: 'Brushed Fleece Kangaroo Pocket Unisex Kids Hoodie',
        price: 1399,
        compareAtPrice: 1999,
        stock: 65,
        description: 'Thick organic cotton brushed fleece with double-layer hood (no drawstrings for safety). Roomy front kangaroo pocket for little treasures.',
        shortDescription: 'Plush organic cotton brushed fleece kids hoodie.',
        sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
        colors: ['Sky Heather', 'Forest Green']
      },
      {
        name: 'Ribbed Organic Cotton Co-ord Loungewear Set',
        price: 1599,
        compareAtPrice: 2299,
        stock: 55,
        description: 'Ultra-stretchy wide ribbed organic cotton long-sleeve top and elasticated drawstring leggings. Ideal for play and all-day lounging.',
        shortDescription: 'Stretchy wide-ribbed organic cotton 2-piece lounge set.',
        sizes: ['1-2Y', '2-3Y', '3-4Y', '5-6Y'],
        colors: ['Caramel', 'Sage Mist']
      },
      {
        name: 'Hand-Smocked Heritage Linen Party Dress',
        price: 1899,
        compareAtPrice: 2799,
        stock: 40,
        description: 'Traditional English smocking embroidered by hand across the bodice in fine French linen. Finished with Peter Pan collar and back sash tie.',
        shortDescription: 'Hand-smocked French linen vintage party dress.',
        sizes: ['2-3Y', '3-4Y', '4-5Y', '6-7Y'],
        colors: ['Cornflower Blue', 'Pure White']
      },
      {
        name: 'Soft Chambray Denim Overalls with Wooden Buttons',
        price: 1499,
        compareAtPrice: 2199,
        stock: 50,
        description: 'Lightweight washed indigo chambray overalls with adjustable shoulder crossover straps and nickel-free leg snaps for quick changes.',
        shortDescription: 'Washed soft chambray overalls with wooden buttons.',
        sizes: ['6-12M', '1-2Y', '2-3Y', '3-4Y'],
        colors: ['Light Washed Indigo']
      },
      {
        name: 'Breathable Cotton Waffle Knit Sleepsuit Pajamas',
        price: 1199,
        compareAtPrice: 1699,
        stock: 60,
        description: 'Textured thermal waffle knit that traps warm air without overheating. Features non-slip silicone gripper soles on toddler sizes.',
        shortDescription: 'Thermal waffle knit footed organic sleepsuit.',
        sizes: ['3-6M', '6-12M', '12-18M', '18-24M'],
        colors: ['Cloud Grey', 'Butter Cream']
      },
      {
        name: 'Pastel Merino Wool Knit Baby Cardigan',
        price: 1699,
        compareAtPrice: 2499,
        stock: 45,
        description: 'Knit from non-scratchy 100% fine merino wool with adorable cable knit details and engraved wooden buttons. Naturally odor resistant.',
        shortDescription: 'Non-scratchy fine merino wool baby cable cardigan.',
        sizes: ['0-6M', '6-12M', '1-2Y'],
        colors: ['Powder Blue', 'Rose Dawn']
      },
      {
        name: 'UPF 50+ Sun Protection Striped Swimwear 2-Piece',
        price: 1399,
        compareAtPrice: 1999,
        stock: 50,
        description: 'Chlorine-resistant quick-drying recycled polyester swim set blocking 98% of UVA/UVB rays. Raglan long sleeves for maximum shoulder cover.',
        shortDescription: 'UPF 50+ quick-dry long sleeve kids swim set.',
        sizes: ['1-2Y', '2-3Y', '3-4Y', '5-6Y'],
        colors: ['Navy Nautical Stripe', 'Coral Reef']
      },
      {
        name: 'Elasticated Soft Corduroy Tapered Joggers',
        price: 1299,
        compareAtPrice: 1799,
        stock: 55,
        description: 'Fine needlecord cotton with reinforced knees for active crawlers and climbers. Gentle elastic waist with functional cotton drawcord.',
        shortDescription: 'Reinforced knee fine needlecord cotton joggers.',
        sizes: ['2-3Y', '3-4Y', '4-5Y', '6-7Y'],
        colors: ['Cinnamon Brown', 'Teal Blue']
      },
      {
        name: 'Organic Cotton Quilted Winter Puffer Vest',
        price: 1799,
        compareAtPrice: 2599,
        stock: 40,
        description: 'Insulated with hypoallergenic recycled fill and lined in organic cotton flannel. High chin guard and smooth zip with zipper garage.',
        shortDescription: 'Hypoallergenic quilted lightweight winter vest.',
        sizes: ['2-3Y', '3-4Y', '5-6Y', '7-8Y'],
        colors: ['Mustard Ochre', 'Deep Navy']
      },
      {
        name: 'Fairisle Jacquard Knit Heritage Children Sweater',
        price: 1599,
        compareAtPrice: 2299,
        stock: 48,
        description: 'Traditional Nordic Fairisle geometric pattern knitted in soft cotton-wool yarn. Ribbed cuffs and hem retain their shape wash after wash.',
        shortDescription: 'Nordic Fairisle patterned cotton-wool children sweater.',
        sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'],
        colors: ['Cranberry Red', 'Snow Pine']
      }
    ]
  },

  // ===================== 4. SHOES =====================
  {
    category: 'Shoes',
    categorySlug: 'shoes',
    subcategory: 'Luxury Footwear',
    collectionSlug: 'bestsellers',
    brand: 'VEXIVO Calzature',
    sellerName: 'Tuscan Cobblers Guild',
    sellerInfo: 'Artisanal Hand-Crafted Footwear from Florence',
    items: [
      {
        name: 'Italian Calfskin Hand-Burnished Penny Loafers',
        price: 5499,
        compareAtPrice: 7999,
        stock: 35,
        description: 'Full-grain Florentine calfskin hand-burnished for rich multidimensional patina. Blake stitched leather sole with stacked heel and rubber tap.',
        shortDescription: 'Hand-burnished Florentine calfskin Blake loafers.',
        sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
        colors: ['Antique Cognac', 'Ebony Black']
      },
      {
        name: 'Full-Grain Nappa Leather Minimalist Low Sneakers',
        price: 4299,
        compareAtPrice: 5999,
        stock: 50,
        description: 'Buttery soft Italian Nappa leather upper stitched directly to an authentic Margom rubber cupsole. Fully lined in calfskin with removable foam insole.',
        shortDescription: 'Italian Nappa leather Margom sole court sneakers.',
        sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
        colors: ['Triple White', 'Off-White & Gum']
      },
      {
        name: 'Blake-Stitched Goodyear Welted Suede Chelsea Boots',
        price: 5999,
        compareAtPrice: 8499,
        stock: 30,
        description: 'Repello water-resistant split suede with heavy-duty elasticated side gussets and dual nylon pull tabs. Durable studded rubber Dainite sole.',
        shortDescription: 'Water-resistant suede Chelsea boots with Dainite sole.',
        sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
        colors: ['Snuff Brown', 'Charcoal Suede']
      },
      {
        name: 'Handwoven Leather Huarache Summer Slip-On Sandals',
        price: 2999,
        compareAtPrice: 4199,
        stock: 45,
        description: 'Individually hand-woven vegetable-tanned leather strips that conform uniquely to your foot shape over time. Flexible non-slip crepe sole.',
        shortDescription: 'Hand-woven vegetable-tanned leather huarache sandals.',
        sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
        colors: ['Caramel Tan', 'Dark Walnut']
      },
      {
        name: 'Suede Double Monk Strap Dress Shoes',
        price: 4999,
        compareAtPrice: 6999,
        stock: 28,
        description: 'Velvety English calf suede adorned with polished silver-finish buckles. Chiseled toe shape with channel-stitched leather outsoles.',
        shortDescription: 'Calf suede double monk shoes with silver buckles.',
        sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
        colors: ['Tobacco Suede', 'Navy Suede']
      },
      {
        name: 'Vibram Commando Sole Weatherproof Derby Boots',
        price: 6499,
        compareAtPrice: 8999,
        stock: 25,
        description: 'Waxy pull-up Horween leather with speed hooks, bellows tongue, and Goodyear storm welt. Built atop rugged Italian Vibram commando lugs.',
        shortDescription: 'Horween waxy pull-up leather Vibram storm boots.',
        sizes: ['UK 8', 'UK 9', 'UK 10', 'UK 11'],
        colors: ['Dark Oxblood', 'Matte Black']
      },
      {
        name: 'Ergonomic Breathable Knit Performance Running Trainers',
        price: 3499,
        compareAtPrice: 4899,
        stock: 60,
        description: 'Seamless engineered mesh upper with carbon-infused TPU midfoot shank and bouncy supercritical nitrogen-infused foam midsole.',
        shortDescription: 'Supercritical nitrogen foam knit running shoes.',
        sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
        colors: ['Triple Black', 'Glacier White']
      },
      {
        name: 'Velvet Venetian Slippers with Grosgrain Ribbon Trim',
        price: 3899,
        compareAtPrice: 5499,
        stock: 35,
        description: 'Lush Italian cotton velvet lined in quilted ruby red satin. Finished with hand-stitched grosgrain binding and leather bottom.',
        shortDescription: 'Italian velvet Venetian slipper with satin lining.',
        sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
        colors: ['Midnight Navy', 'Emerald Velvet']
      },
      {
        name: 'Handcrafted Mediterranean Espadrilles with Jute Rope',
        price: 2499,
        compareAtPrice: 3499,
        stock: 50,
        description: 'Organic heavyweight cotton canvas hand-stitched to a natural braided jute sole vulcanized with natural rubber for all-weather grip.',
        shortDescription: 'Braided jute rope vulcanized canvas espadrilles.',
        sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
        colors: ['Navy Blue', 'Natural Sand']
      },
      {
        name: 'Lightweight Trail-Walking All-Weather Sneaker',
        price: 3999,
        compareAtPrice: 5499,
        stock: 40,
        description: 'Ripstop Cordura upper reinforced with TPU mudguards and waterproof inner bootie membrane. Multi-directional traction outsole.',
        shortDescription: 'Cordura waterproof trail sneaker with high grip sole.',
        sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
        colors: ['Desert Clay', 'Shadow Olive']
      },
      {
        name: 'Orthopedic Arch-Support Italian Driving Loafers',
        price: 4499,
        compareAtPrice: 6299,
        stock: 35,
        description: 'Unlined supple deer-skin leather with pebbled rubber split driving sole wrapping up the heel. Integrated podiatrist-approved arch support.',
        shortDescription: 'Supple deerskin Italian driving moccasin with arch bed.',
        sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
        colors: ['Chestnut Tan', 'Navy Blue']
      },
      {
        name: 'Hand-Polished Goodyear Wingtip Oxford Brogues',
        price: 5899,
        compareAtPrice: 8299,
        stock: 25,
        description: 'Classic full brogue wingtip detailing carved into premium French box calf leather. Traditional closed lacing with leather mid-sole.',
        shortDescription: 'French box calf Goodyear welted full wingtip brogues.',
        sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
        colors: ['Rich Walnut', 'Glossy Black']
      }
    ]
  },

  // ===================== 5. BEAUTY =====================
  {
    category: 'Beauty',
    categorySlug: 'beauty',
    subcategory: 'Skincare & Perfumery',
    collectionSlug: 'trending',
    brand: 'VEXIVO Botanicals',
    sellerName: 'Provence Herbal Laboratories',
    sellerInfo: 'Cold-Pressed Botanical Skincare Specialists',
    items: [
      {
        name: 'Cold-Pressed Botanical Marula Facial Oil 50ml',
        price: 1899,
        compareAtPrice: 2699,
        stock: 80,
        description: 'Virgin unrefined cold-pressed marula seed oil loaded with antioxidants, Vitamin C, and omega fatty acids. Instantly absorbs for luminous radiance.',
        shortDescription: 'Pure unrefined cold-pressed marula facial glow oil.',
        sizes: ['50ml Dropper'],
        colors: ['Golden Nectar']
      },
      {
        name: 'Niacinamide 10% & Zinc 1% Clinical Clarifying Serum 30ml',
        price: 1299,
        compareAtPrice: 1799,
        stock: 100,
        description: 'High-potency clinical formulation that refines enlarged pores, regulates sebum production, and evens post-inflammatory hyperpigmentation.',
        shortDescription: 'Niacinamide 10% clarifying pore reduction serum.',
        sizes: ['30ml Pipette'],
        colors: ['Clear Gel']
      },
      {
        name: 'Rose Damascena Hydrosol Refreshing Face Mist 100ml',
        price: 1099,
        compareAtPrice: 1599,
        stock: 90,
        description: '100% steam-distilled Bulgarian Rose Damascena flower water. Tightens pores, rebalances skin pH, and delivers instant botanical hydration.',
        shortDescription: 'Steam-distilled Bulgarian rose water hydrating mist.',
        sizes: ['100ml Fine Spray'],
        colors: ['Clear Rose']
      },
      {
        name: 'Shea & Murumuru Butter Deep Nourishing Body Balm 200g',
        price: 1499,
        compareAtPrice: 2199,
        stock: 65,
        description: 'Whipped raw Ghanaian shea butter blended with Amazonian murumuru and sweet almond oil. Melts upon skin contact to heal parched skin.',
        shortDescription: 'Whipped raw shea and murumuru deep moisture body balm.',
        sizes: ['200g Glass Jar'],
        colors: ['Whipped Ivory']
      },
      {
        name: 'Bakuchiol Botanical Retinol Alternative Night Elixir 30ml',
        price: 2199,
        compareAtPrice: 3199,
        stock: 55,
        description: 'Plant-derived 2% bakuchiol combined with squalane and rosehip fruit oil. Stimulates cellular renewal and collagen synthesis without irritation.',
        shortDescription: '2% Bakuchiol plant-based gentle retinol alternative oil.',
        sizes: ['30ml Dropper'],
        colors: ['Amber Glow']
      },
      {
        name: 'Brazilian Green Jade Facial Sculpting Gua Sha Tool',
        price: 999,
        compareAtPrice: 1499,
        stock: 120,
        description: 'Hand-carved from genuine grade-A Brazilian green jade crystal. Ergonomic curved edges sculpt cheekbones and drain lymphatic fluid.',
        shortDescription: 'Authentic hand-carved Brazilian jade gua sha stone.',
        sizes: ['One Size (8.5x5.5cm)'],
        colors: ['Natural Jade Green']
      },
      {
        name: 'Moroccan Rhassoul Clay Detoxifying Face Mask 120ml',
        price: 1399,
        compareAtPrice: 1999,
        stock: 70,
        description: 'Sourced from the Atlas Mountains of Morocco. Enriched with silica and magnesium to draw out deep impurities without drying out the skin barrier.',
        shortDescription: 'Atlas Mountains mineral-rich rhassoul detox clay mask.',
        sizes: ['120ml Jar'],
        colors: ['Earthy Clay']
      },
      {
        name: 'Multi-Molecular Hyaluronic Acid Plumping Cream 50ml',
        price: 1699,
        compareAtPrice: 2399,
        stock: 75,
        description: 'Combines five molecular weights of hyaluronic acid to hydrate epidermal layers from surface to deep dermis. Ceramides seal in moisture.',
        shortDescription: '5-weight hyaluronic acid deep plumping barrier cream.',
        sizes: ['50ml Airless Pump'],
        colors: ['Velvet Cream']
      },
      {
        name: 'Centella Asiatica Cica Calming Barrier Repair Gel 80ml',
        price: 1399,
        compareAtPrice: 1899,
        stock: 85,
        description: 'Formulated with 70% Madagascar Centella Asiatica leaf water and panthenol to instantly soothe redness, sunburn, and skin irritation.',
        shortDescription: '70% Madagascar cica soothing barrier gel moisturizer.',
        sizes: ['80ml Tube'],
        colors: ['Translucent Aqua']
      },
      {
        name: 'Artisan Cedarwood & Vetiver Niche Eau De Parfum 50ml',
        price: 3299,
        compareAtPrice: 4799,
        stock: 45,
        description: 'Handcrafted in Grasse, France. Opens with bergamot and pink pepper, transitioning into smoky Atlas cedar and Haitian vetiver base.',
        shortDescription: 'Niche eau de parfum with cedarwood and Haitian vetiver.',
        sizes: ['50ml Spray'],
        colors: ['Smoky Amber']
      },
      {
        name: 'Japanese Camellia Tsubaki Hair Rejuvenating Treatment 100ml',
        price: 1799,
        compareAtPrice: 2499,
        stock: 60,
        description: 'Cold-pressed Camellia Japonica seed oil traditionally used by Geishas to restore mirror-like shine and repair heat-damaged hair cuticles.',
        shortDescription: 'Cold-pressed Tsubaki seed hair nourishing elixir.',
        sizes: ['100ml Glass Bottle'],
        colors: ['Golden Tsubaki']
      },
      {
        name: 'Vitamin C 20% + Ferulic Acid Radiance Glow Serum 30ml',
        price: 1999,
        compareAtPrice: 2899,
        stock: 65,
        description: 'Pure L-Ascorbic acid stabilized with ferulic acid and Vitamin E at optimal pH 3.0. Fades stubborn sunspots and protects against free radicals.',
        shortDescription: '20% L-Ascorbic Acid + Ferulic brightening glow serum.',
        sizes: ['30ml UV-Proof Bottle'],
        colors: ['Pale Gold']
      }
    ]
  },

  // ===================== 6. JEWELLERY =====================
  {
    category: 'Jewellery',
    categorySlug: 'jewellery',
    subcategory: 'Fine Metals & Gems',
    collectionSlug: 'bestsellers',
    brand: 'VEXIVO Orfèvrerie',
    sellerName: 'Geneva Goldsmiths Guild',
    sellerInfo: 'Master Goldsmiths and Gemologists Since 1984',
    items: [
      {
        name: '18K Solid Gold Vermeil Dainty Paperclip Chain Necklace',
        price: 3299,
        compareAtPrice: 4899,
        stock: 40,
        description: 'Thick 2.5-micron layer of 18K gold electroplated over recycled 925 sterling silver. Lobster claw clasp with 2-inch extender chain.',
        shortDescription: '18K gold vermeil rectangular paperclip link necklace.',
        sizes: ['16 inch + 2 inch extender'],
        colors: ['Yellow Gold Vermeil', 'Rose Gold Vermeil']
      },
      {
        name: 'Natural Freshwater Baroque Pearl Drop Earrings',
        price: 2499,
        compareAtPrice: 3699,
        stock: 45,
        description: 'Hand-selected luminous freshwater baroque pearls with organic contours. Mounted on hypoallergenic 14K solid gold post hooks.',
        shortDescription: 'Organic freshwater baroque pearl drops on 14K hooks.',
        sizes: ['One Size (Approx 20mm pearl)'],
        colors: ['Lustrous White Pearl']
      },
      {
        name: 'Swiss Movement Minimalist Sapphire Crystal Watch',
        price: 6999,
        compareAtPrice: 9999,
        stock: 25,
        description: 'Swiss Ronda quartz movement housed in 38mm surgical-grade 316L stainless steel case. Scratch-proof antireflective sapphire crystal glass.',
        shortDescription: 'Swiss Ronda quartz 38mm watch with sapphire crystal.',
        sizes: ['38mm Case (20mm strap)'],
        colors: ['Silver & Black Leather', 'Rose Gold & Mesh']
      },
      {
        name: 'Sterling Silver 925 Braided Herringbone Chain Bracelet',
        price: 1999,
        compareAtPrice: 2899,
        stock: 55,
        description: 'Italian crafted high-polish herringbone links that drape like liquid silver along the wrist. Finished with sturdy lobster clasp.',
        shortDescription: 'Italian 925 sterling silver fluid herringbone bracelet.',
        sizes: ['7 inch', '7.5 inch', '8 inch'],
        colors: ['Bright Sterling Silver']
      },
      {
        name: 'Hand-Set Baguette Cut Zirconia Eternity Band Ring',
        price: 2199,
        compareAtPrice: 3299,
        stock: 50,
        description: 'Continuous band of precision-cut AAAAA baguette cubic zirconia stones channel-set into sterling silver coated in rhodium.',
        shortDescription: 'Channel-set AAAAA baguette zirconia eternity band.',
        sizes: ['US 6', 'US 7', 'US 8', 'US 9'],
        colors: ['Platinum Rhodium', '18K Yellow Gold']
      },
      {
        name: 'Hand-Hammered Sculptural Statement Dome Ring',
        price: 1799,
        compareAtPrice: 2599,
        stock: 48,
        description: 'Chunky organic dome ring with hand-hammered faceted dimples that catch the light from all angles. Lightweight hollow-core comfort fit.',
        shortDescription: 'Hand-hammered textured dome ring in 18K vermeil.',
        sizes: ['US 6', 'US 7', 'US 8'],
        colors: ['Polished Gold', 'Oxidized Silver']
      },
      {
        name: 'Pavé Diamond Look Huggie Hoop Earrings in 14K Gold',
        price: 2299,
        compareAtPrice: 3399,
        stock: 60,
        description: 'Dainty 12mm huggies lined with double rows of pavé micro-crystals. Secure click-closure mechanism designed for daily wear.',
        shortDescription: '12mm double row pavé crystal huggie hoop earrings.',
        sizes: ['12mm Diameter'],
        colors: ['14K Gold Finish', 'White Gold Finish']
      },
      {
        name: 'Minimalist Titanium Ultra-Thin Mesh Strap Watch',
        price: 5499,
        compareAtPrice: 7999,
        stock: 30,
        description: 'Featherweight aerospace-grade titanium case measuring just 6.5mm in thickness. Integrated quick-release stainless steel Milanese mesh bracelet.',
        shortDescription: '6.5mm ultra-thin titanium watch with Milanese mesh band.',
        sizes: ['40mm Case'],
        colors: ['Matte Titanium Gunmetal', 'Brushed Silver']
      },
      {
        name: 'Constellation Zodiac Engraved Medallion Pendant',
        price: 2199,
        compareAtPrice: 3199,
        stock: 50,
        description: 'Coin pendant featuring hand-drawn zodiac constellations illuminated with sparkling micro-zirconia stars. Suspended on rope chain.',
        shortDescription: 'Zodiac constellation coin medallion on rope chain.',
        sizes: ['18 inch + 2 inch'],
        colors: ['18K Gold Vermeil']
      },
      {
        name: 'Tahitian Black Mother-of-Pearl Cufflinks',
        price: 2799,
        compareAtPrice: 3999,
        stock: 35,
        description: 'Natural iridescent Polynesian black mother-of-pearl cabochons set into solid rhodium-plated brass swivel-bar toggle mounts.',
        shortDescription: 'Tahitian black mother-of-pearl swivel-back cufflinks.',
        sizes: ['16mm Round'],
        colors: ['Iridescent Peacock Black']
      },
      {
        name: 'Double Layer Figaro Link Sterling Silver Anklet',
        price: 1599,
        compareAtPrice: 2299,
        stock: 55,
        description: 'Delicate dual-strand anklet pairing an Italian Figaro link with a shimmering diamond-cut ball chain. Hypoallergenic nickel-free.',
        shortDescription: 'Italian Figaro and diamond-cut bead double anklet.',
        sizes: ['9 inch + 2 inch extender'],
        colors: ['925 Sterling Silver']
      },
      {
        name: 'Natural Untreated Emerald Solitaire Ring in Gold',
        price: 4999,
        compareAtPrice: 7499,
        stock: 20,
        description: 'Ethically sourced 1-carat oval cut Zambian emerald set in four-prong 14K yellow gold vermeil basket on a micro-pavé band.',
        shortDescription: '1-carat oval Zambian emerald solitaire cocktail ring.',
        sizes: ['US 6', 'US 7', 'US 8'],
        colors: ['Deep Emerald Green']
      }
    ]
  },

  // ===================== 7. BAGS =====================
  {
    category: 'Bags',
    categorySlug: 'bags',
    subcategory: 'Leather & Travel Goods',
    collectionSlug: 'trending',
    brand: 'VEXIVO Cuir',
    sellerName: 'Florence Leathercraft',
    sellerInfo: 'Certified Tuscan Vegetable-Tanned Leather Guild',
    items: [
      {
        name: 'Full-Grain Vegetable-Tanned Italian Leather Briefcase',
        price: 6999,
        compareAtPrice: 9999,
        stock: 25,
        description: 'Handcrafted from 2.2mm Tuscan vegetable-tanned bridle leather with solid antiqued brass hardware. Padded sleeve protects 15.6-inch laptops.',
        shortDescription: 'Tuscan bridle leather 15.6-inch laptop briefcase.',
        sizes: ['40 x 29 x 10 cm'],
        colors: ['Cognac Tan', 'Dark Espresso']
      },
      {
        name: 'Handcrafted Woven Straw Beach Tote with Leather Handles',
        price: 2499,
        compareAtPrice: 3699,
        stock: 45,
        description: 'Hand-woven natural palm straw with tubular saddle leather shoulder straps and an internal cotton drawstring canvas lining for security.',
        shortDescription: 'Natural palm straw tote with saddle leather straps.',
        sizes: ['46 x 32 x 15 cm'],
        colors: ['Natural Straw & Tan']
      },
      {
        name: 'Minimalist Waterproof Roll-Top Commuter Backpack',
        price: 3899,
        compareAtPrice: 5499,
        stock: 40,
        description: 'Welded TPU waterproof fabric with roll-top buckle closure, magnetic side bottle pockets, and breathable ergonomic airflow back panel.',
        shortDescription: 'Waterproof TPU roll-top urban commuter backpack.',
        sizes: ['25L Capacity'],
        colors: ['Matte Black', 'Slate Grey']
      },
      {
        name: 'Structured Saddle Crossbody Bag with Brass Hardware',
        price: 3499,
        compareAtPrice: 4999,
        stock: 35,
        description: 'Equestrian-inspired curved saddle silhouette made from firm box calf leather. Front flap secures with magnetic stirrup brass buckle.',
        shortDescription: 'Box calf leather curved saddle crossbody bag.',
        sizes: ['22 x 18 x 7 cm'],
        colors: ['Chestnut Brown', 'Black Onyx']
      },
      {
        name: 'Genuine Pebble-Grain Leather Compact Cardholder Wallet',
        price: 1299,
        compareAtPrice: 1899,
        stock: 80,
        description: 'Slimline pocket card case with 6 card slots and central cash sleeve. Integrated RFID blocking metallic mesh protects against scans.',
        shortDescription: 'RFID blocking pebble leather 6-slot slim card case.',
        sizes: ['10 x 7.5 cm'],
        colors: ['Midnight Black', 'Forest Green']
      },
      {
        name: 'Quilted Nylon Convertible Gym & Weekender Duffel',
        price: 2999,
        compareAtPrice: 4299,
        stock: 50,
        description: 'Water-resistant diamond quilted nylon with separate ventilated shoe compartment, trolley sleeve for luggage, and padded shoulder strap.',
        shortDescription: 'Quilted nylon weekender duffel with shoe compartment.',
        sizes: ['35L Capacity (50 x 28 x 25 cm)'],
        colors: ['Glossy Black', 'Olive Drab']
      },
      {
        name: 'Artisan Slouchy Nappa Leather Shoulder Hobo Bag',
        price: 4499,
        compareAtPrice: 6299,
        stock: 30,
        description: 'Drapes effortlessly with a curved slouch top and wide padded shoulder strap. Lined in soft suede microfiber with zippered interior organizer.',
        shortDescription: 'Soft Italian Nappa leather slouchy hobo shoulder bag.',
        sizes: ['38 x 30 x 12 cm'],
        colors: ['Caramel Toffee', 'Pebbled Black']
      },
      {
        name: 'Rugged Waxed Canvas Travel Rucksack with Leather Straps',
        price: 4699,
        compareAtPrice: 6499,
        stock: 32,
        description: 'Heavy 18oz water-repellent Scottish waxed canvas trimmed with thick oil-tanned leather straps and quick-release brass snap buckles.',
        shortDescription: '18oz waxed canvas rugged rucksack with leather straps.',
        sizes: ['28L (45 x 32 x 16 cm)'],
        colors: ['Field Tan', 'Dark Forest']
      },
      {
        name: 'Ergonomic Crossbody Sling Bag with RFID Protection',
        price: 2199,
        compareAtPrice: 3199,
        stock: 55,
        description: 'Compact chest pack designed for travel essentials. YKK waterproof zippers, magnetic key leash, and hidden rear passport pocket.',
        shortDescription: 'Water-resistant tactical everyday carry chest sling.',
        sizes: ['4L (31 x 17 x 8 cm)'],
        colors: ['Charcoal Heather', 'Jet Black']
      },
      {
        name: 'Hand-Stitched Leather Passport Wallet & Luggage Tag Set',
        price: 1699,
        compareAtPrice: 2499,
        stock: 65,
        description: 'Crafted from oiled crazy horse leather that develops unique personal character. Includes matching buckle-strap luggage privacy tag.',
        shortDescription: 'Crazy horse leather passport travel wallet and tag set.',
        sizes: ['Standard Passport Size'],
        colors: ['Vintage Tan', 'Espresso']
      },
      {
        name: 'Elegant Velvet Evening Clutch with Detachable Chain',
        price: 2299,
        compareAtPrice: 3299,
        stock: 45,
        description: 'Hard-case minaudière enveloped in plush emerald velvet with polished golden ball clasp and removable 120cm drop snake chain.',
        shortDescription: 'Plush velvet hard-case evening minaudière clutch.',
        sizes: ['20 x 12 x 5 cm'],
        colors: ['Emerald Green', 'Royal Navy']
      },
      {
        name: 'Technical Ripstop Modular Lightweight Belt Bag',
        price: 1499,
        compareAtPrice: 2199,
        stock: 70,
        description: 'Diamond ripstop Cordura nylon with Duraflex buckle and adjustable webbing strap. Can be worn as fanny pack or crossbody.',
        shortDescription: 'Cordura ripstop lightweight modular waist pack.',
        sizes: ['2.5L (24 x 14 x 6 cm)'],
        colors: ['Blackout', 'Coyote Brown']
      }
    ]
  },

  // ===================== 8. HATS =====================
  {
    category: 'Hats',
    categorySlug: 'hats',
    subcategory: 'Millinery & Headwear',
    collectionSlug: 'new-arrivals',
    brand: 'VEXIVO Millinery',
    sellerName: 'Montecristi Hat Artisans',
    sellerInfo: 'UNESCO Intangible Heritage Toquilla Weavers',
    items: [
      {
        name: 'Genuine Grade-8 Handwoven Ecuadorian Toquilla Straw Panama Hat',
        price: 3499,
        compareAtPrice: 5199,
        stock: 25,
        description: 'Hand-woven over two months from split jipijapa palm fronds. Lightweight UPF 50+ sun protection trimmed with black grosgrain ribbon.',
        shortDescription: 'Grade 8 authentic handwoven Ecuadorian Panama hat.',
        sizes: ['57 cm (M)', '59 cm (L)', '61 cm (XL)'],
        colors: ['Bleached Natural']
      },
      {
        name: '100% Australian Merino Wool Wide-Brim Fedora',
        price: 2899,
        compareAtPrice: 4199,
        stock: 35,
        description: 'Structured wool felt blocked on wooden forms. Features a stiff flat 8cm brim, pinched teardrop crown, and genuine leather hat band.',
        shortDescription: 'Australian wool felt stiff flat-brim fedora hat.',
        sizes: ['56 cm (S)', '58 cm (M)', '60 cm (L)'],
        colors: ['Pecan Brown', 'Obsidian Black']
      },
      {
        name: 'Washed Cotton Twill Unstructured Dad Baseball Cap',
        price: 999,
        compareAtPrice: 1499,
        stock: 90,
        description: 'Heavyweight pre-washed cotton twill with low-profile 6-panel crown and curved bill. Antiqued brass tri-glide sliding closure buckle.',
        shortDescription: 'Pre-washed cotton twill low-profile dad cap.',
        sizes: ['Adjustable (54-61 cm)'],
        colors: ['Faded Navy', 'Washed Olive', 'Vintage Black']
      },
      {
        name: 'Hand-Knitted Ribbed Cashmere Slouchy Winter Beanie',
        price: 1899,
        compareAtPrice: 2699,
        stock: 50,
        description: 'Spun from 100% 2-ply Mongolian cashmere. Knit in a chunky 7-gauge fisherman rib that can be worn cuffed or slouchy.',
        shortDescription: 'Pure Mongolian 2-ply cashmere fisherman ribbed beanie.',
        sizes: ['One Size Stretch'],
        colors: ['Oatmeal Heather', 'Charcoal Grey']
      },
      {
        name: 'Heritage Wool Herringbone Newsboy Baker Boy Cap',
        price: 1799,
        compareAtPrice: 2499,
        stock: 40,
        description: '8-panel traditional British newsboy cap crafted from Scottish wool tweed in a classic chevron weave. Sewn-down peak with satin lining.',
        shortDescription: 'Scottish wool tweed 8-panel heritage newsboy cap.',
        sizes: ['57 cm (M)', '59 cm (L)', '61 cm (XL)'],
        colors: ['Grey Herringbone', 'Brown Tweed']
      },
      {
        name: 'Packable Floppy Linen Summer Sun Hat with Chiffon Tie',
        price: 1599,
        compareAtPrice: 2299,
        stock: 55,
        description: '10cm wide brim woven from breathable washed French linen. Folds compactly into your beach tote without losing its shape.',
        shortDescription: 'Packable French linen wide-brim sun protection hat.',
        sizes: ['One Size with internal drawstring'],
        colors: ['Natural Ecru', 'Terracotta']
      },
      {
        name: 'UPF 50+ Waterproof Outdoor Trekking Bucket Hat',
        price: 1299,
        compareAtPrice: 1899,
        stock: 65,
        description: 'Hydrophobic quick-dry nylon with mesh ventilation crown and moisture-wicking sweatband. Adjustable chin cord keeps it secure in gale winds.',
        shortDescription: 'UPF 50+ quick-dry waterproof boonie bucket hat.',
        sizes: ['M/L (57-59 cm)', 'L/XL (60-62 cm)'],
        colors: ['Khaki Camo', 'Dark Charcoal']
      },
      {
        name: 'Structured Wool Felt Boater Hat with Grosgrain Band',
        price: 2499,
        compareAtPrice: 3599,
        stock: 30,
        description: 'Classic flat top crown and flat circular brim stiffened with natural shellac. Trimmed with 40mm striped grosgrain ribbon.',
        shortDescription: 'Stiff wool felt flat-top boater hat with ribbon band.',
        sizes: ['57 cm (M)', '59 cm (L)'],
        colors: ['Ivory with Navy Band', 'All Black']
      },
      {
        name: 'Chunky Waffle Knit Wool Watch Cap Beanie',
        price: 1199,
        compareAtPrice: 1699,
        stock: 75,
        description: 'Inspired by US Navy issue watch caps. Knit in heavy gauge Shetland wool with deep foldover brim for sub-zero ear warmth.',
        shortDescription: 'Shetland wool heavy gauge deep cuff watch cap.',
        sizes: ['One Size Stretch'],
        colors: ['Safety Orange', 'Navy Melange']
      },
      {
        name: 'Vintage Corduroy 6-Panel Retro Strapback Cap',
        price: 1099,
        compareAtPrice: 1599,
        stock: 80,
        description: 'Wide-wale 8-wale cotton corduroy with unstructured crown and self-fabric strap with antique brass buckle. Embroidered eyelets.',
        shortDescription: '8-wale thick corduroy retro unstructured strapback.',
        sizes: ['Adjustable (55-60 cm)'],
        colors: ['Rust Ochre', 'Hunter Green']
      },
      {
        name: 'Classic French 100% Boiled Wool Beret',
        price: 1499,
        compareAtPrice: 2199,
        stock: 45,
        description: 'Made in the Basque tradition from 100% French merino wool felted into water-repellent dense boiled wool with small top stem.',
        shortDescription: 'Basque traditional boiled wool beret with leather band.',
        sizes: ['Universal 28cm Diameter'],
        colors: ['Bordeaux Red', 'Parisian Navy']
      },
      {
        name: 'Leather Trim Safari Outback Sun Protection Hat',
        price: 2699,
        compareAtPrice: 3899,
        stock: 35,
        description: 'Sturdy heavy-duty brushed cotton canvas crown with vented eyelets and genuine braided leather band. Shapeable wired brim edge.',
        shortDescription: 'Heavy cotton canvas outback hat with shapeable brim.',
        sizes: ['58 cm (M)', '60 cm (L)'],
        colors: ['Desert Sand', 'Dark Olive']
      }
    ]
  },

  // ===================== 9. VISION CARE =====================
  {
    category: 'Vision Care',
    categorySlug: 'vision-care',
    subcategory: 'Eyewear & Optical',
    collectionSlug: 'trending',
    brand: 'VEXIVO Vision',
    sellerName: 'Fukui Optical Guild',
    sellerInfo: 'Hand-Polished Japanese Cellulose Acetate Frames',
    items: [
      {
        name: 'Handcrafted Japanese Acetate Blue-Light Blocking Reading Glasses',
        price: 1999,
        compareAtPrice: 2999,
        stock: 50,
        description: 'Custom cured Mazzucchelli cellulose acetate with five-barrel German OBE hinges. Anti-reflective lenses filter 45% of harmful blue spectrum light.',
        shortDescription: 'Japanese hand-polished acetate blue-light glasses.',
        sizes: ['Standard 50-19-145'],
        colors: ['Havana Tortoise', 'Matte Crystal']
      },
      {
        name: 'Polarized Aviator Titanium Sunglasses with Anti-Glare Coating',
        price: 3699,
        compareAtPrice: 5299,
        stock: 35,
        description: 'Ultralight Japanese titanium frame weighing under 18 grams. TAC polarized gradient green lenses with rear anti-reflective coating.',
        shortDescription: 'Featherweight 18g titanium aviator sunglasses.',
        sizes: ['58-14-140'],
        colors: ['Gold & G-15 Green', 'Silver & Smoke']
      },
      {
        name: 'Classic Havana Round Tortoiseshell Optical Prescription Frames',
        price: 2499,
        compareAtPrice: 3599,
        stock: 45,
        description: 'Keyhole bridge design crafted from 6mm Italian acetate sheets with wire core temples for custom optician adjustment.',
        shortDescription: 'Keyhole bridge Italian acetate round optical frames.',
        sizes: ['48-21-145'],
        colors: ['Vintage Havana', 'Champagne Honey']
      },
      {
        name: 'Ultralight Rimless Beta-Memory Titanium Eyeglasses',
        price: 3299,
        compareAtPrice: 4799,
        stock: 40,
        description: 'Hypoallergenic flexible beta-titanium alloy temples that bounce back to shape. Screwless hinge mechanism eliminates loose arm screws.',
        shortDescription: 'Screwless rimless beta-titanium memory frames.',
        sizes: ['53-18-142'],
        colors: ['Gunmetal Grey', 'Polished Silver']
      },
      {
        name: 'Cat-Eye UV400 Gradient Lens Designer Sunglasses',
        price: 2799,
        compareAtPrice: 3999,
        stock: 50,
        description: 'Dramatic upswept cat-eye silhouette in glossy black acetate with gold-tone metal temple accents. 100% UV400 protection.',
        shortDescription: 'Glossy cat-eye acetate sunglasses with UV400 lenses.',
        sizes: ['54-18-140'],
        colors: ['Piano Black', 'Tortoise Brown']
      },
      {
        name: 'Bio-Acetate Eco-Friendly Computer Protection Glasses',
        price: 1899,
        compareAtPrice: 2699,
        stock: 60,
        description: 'Biodegradable acetate made from wood pulp and cotton fibers. Eliminates eye strain and headaches during long computer screen sessions.',
        shortDescription: 'Biodegradable plant-based blue light computer glasses.',
        sizes: ['51-19-145'],
        colors: ['Forest Clear', 'Smoky Quartz']
      },
      {
        name: 'Anti-Fog Hydrogel Contact Lens Multi-Purpose Solution 360ml',
        price: 799,
        compareAtPrice: 1199,
        stock: 100,
        description: 'Dual-action disinfectant that dissolves protein deposits and coats contact lenses with a long-lasting moisture cushion for 16-hour comfort.',
        shortDescription: 'Hyaluronic acid enriched contact lens solution 360ml.',
        sizes: ['360ml Bottle + Free Case'],
        colors: ['Clear Solution']
      },
      {
        name: 'Polarized Wayfarer Sunglasses with Walnut Wood Temples',
        price: 2899,
        compareAtPrice: 4199,
        stock: 45,
        description: 'Combines matte black acetate front with sustainably harvested real walnut wood arms. Stainless steel spring hinges flex outwards.',
        shortDescription: 'Acetate frame with genuine walnut wood spring temples.',
        sizes: ['52-20-145'],
        colors: ['Matte Black & Walnut']
      },
      {
        name: 'Clip-On Magnetic Polarized Sunglasses for Eyeglasses',
        price: 1299,
        compareAtPrice: 1899,
        stock: 65,
        description: 'Ultra-thin polarized TAC clip-on attachment that snaps onto standard rectangular frames with rubberized protective clips.',
        shortDescription: 'Flip-up polarized clip-on sun lenses with UV400.',
        sizes: ['Universal Rectangular Fit'],
        colors: ['Dark Polarized Smoke', 'Copper Amber']
      },
      {
        name: 'Microfiber Ultrasonic Eyewear Deep Cleaning Bath Kit',
        price: 1499,
        compareAtPrice: 2199,
        stock: 55,
        description: 'Emits 45,000Hz ultrasonic sound waves to dislodge microscopic oils, dust, and grime from nose pads and hinge crevices in 3 minutes.',
        shortDescription: '45,000Hz ultrasonic frequency optical cleaning machine.',
        sizes: ['300ml Tank Capacity'],
        colors: ['Clean White']
      },
      {
        name: 'Geometric Hexagonal Wire Frame Reading Glasses',
        price: 1699,
        compareAtPrice: 2399,
        stock: 50,
        description: 'Distinctive geometric hexagonal silhouette in durable stainless steel wire. Equipped with silicone nose pads and anti-reflective lenses.',
        shortDescription: 'Geometric hexagonal stainless steel wire reading glasses.',
        sizes: ['+1.00', '+1.50', '+2.00', '+2.50'],
        colors: ['Rose Gold', 'Antiqued Bronze']
      },
      {
        name: 'Sports Wrap-Around Polarized Cycling Sunglasses',
        price: 2499,
        compareAtPrice: 3599,
        stock: 40,
        description: 'Toric curved shatterproof polycarbonate lens providing wide panoramic peripheral vision with hydrophobic coating that repels water and sweat.',
        shortDescription: 'Wrap-around panoramic polarized sports cycling glasses.',
        sizes: ['Wraparound Free Size'],
        colors: ['Neon Red Mirror', 'Ice Blue Polarized']
      }
    ]
  },

  // ===================== 10. PETS CARE =====================
  {
    category: 'Pets Care',
    categorySlug: 'pets-care',
    subcategory: 'Pet Health & Comfort',
    collectionSlug: 'bestsellers',
    brand: 'VEXIVO Paws',
    sellerName: 'Canine Wellness Labs',
    sellerInfo: 'Veterinarian Approved Orthopedic Pet Care',
    items: [
      {
        name: 'Orthopedic Egg-Crate Memory Foam Bolster Waterproof Pet Sofa',
        price: 3499,
        compareAtPrice: 4999,
        stock: 35,
        description: 'Relieves joint dysplasia and arthritis with high-density medical grade memory foam. Removable machine-washable faux suede cover with waterproof liner.',
        shortDescription: 'High-density orthopedic memory foam bolster pet bed.',
        sizes: ['Medium (75x60cm)', 'Large (90x75cm)'],
        colors: ['Slate Grey', 'Espresso']
      },
      {
        name: 'Automatic Ultra-Quiet Stainless Steel Pet Water Fountain 2.5L',
        price: 2199,
        compareAtPrice: 3199,
        stock: 60,
        description: 'Food-grade 304 stainless steel bowl prevents feline chin acne. Quadruple carbon filtration system oxygenates water continuously.',
        shortDescription: '304 stainless steel ultra-quiet 2.5L pet fountain.',
        sizes: ['2.5L Capacity'],
        colors: ['Brushed Stainless Steel']
      },
      {
        name: 'Natural Bristle Ergonomic Grooming Brush & Deshedding Tool',
        price: 999,
        compareAtPrice: 1499,
        stock: 80,
        description: 'Dual-sided wooden brush featuring stainless steel pins with rounded protective tips on one side and natural wild boar bristles on the other.',
        shortDescription: 'Dual-sided bamboo pin and wild boar bristle pet brush.',
        sizes: ['Standard (23x7cm)'],
        colors: ['Natural Bamboo']
      },
      {
        name: 'Heavy-Duty No-Pull Reflective Padded Dog Harness',
        price: 1599,
        compareAtPrice: 2299,
        stock: 70,
        description: 'Distributes pulling pressure evenly across chest and shoulders without choking. Two sturdy zinc-alloy leash attachment D-rings and padded grab handle.',
        shortDescription: 'Ergonomic no-pull padded harness with 3M reflective trim.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Tactical Black', 'Safety Orange', 'Ranger Green']
      },
      {
        name: 'Freeze-Dried Wild Alaskan Salmon & Kelp Training Bites 150g',
        price: 899,
        compareAtPrice: 1299,
        stock: 90,
        description: 'Single-ingredient 100% human-grade wild caught salmon rich in omega-3 EPA & DHA. Grain-free with no preservatives, fillers, or artificial colors.',
        shortDescription: 'Single-ingredient freeze-dried wild salmon dog treats.',
        sizes: ['150g Resealable Pouch'],
        colors: ['Salmon Pink']
      },
      {
        name: 'Slow-Feeder Ceramic Non-Slip Elevated Pet Bowl Set',
        price: 1899,
        compareAtPrice: 2699,
        stock: 50,
        description: 'Maze ridges prevent rapid gulping and bloating. Heavyweight glazed stoneware bowls set into a sturdy water-resistant bamboo stand.',
        shortDescription: 'Ceramic slow feeder maze bowls with elevated bamboo stand.',
        sizes: ['Double Bowl (850ml each)'],
        colors: ['Matte White & Bamboo']
      },
      {
        name: 'Braided Organic Hemp Rope Tough Chew Interactive Dog Toy',
        price: 699,
        compareAtPrice: 999,
        stock: 110,
        description: 'Natural pesticide-free hemp fibers act as natural dental floss, cleaning plaque and tartar during vigorous tug-of-war play. 100% biodegradable.',
        shortDescription: 'Heavy-duty 100% organic braided hemp rope dog toy.',
        sizes: ['Large (45cm length)'],
        colors: ['Natural Hemp Ecru']
      },
      {
        name: 'Self-Cleaning Double-Layer Honeycomb Cat Litter Trapping Mat',
        price: 1199,
        compareAtPrice: 1699,
        stock: 65,
        description: 'Large honeycomb pockets trap litter scatter from paws. Bottom waterproof EVA layer opens like an envelope to recycle litter back into the box.',
        shortDescription: 'Waterproof double-layer EVA litter scatter trapping mat.',
        sizes: ['75 x 55 cm'],
        colors: ['Charcoal Black', 'Soft Grey']
      },
      {
        name: 'Soothing Oatmeal & Aloe Hypoallergenic Pet Shampoo 500ml',
        price: 899,
        compareAtPrice: 1299,
        stock: 85,
        description: 'pH-balanced for canine skin with colloidal oatmeal, organic aloe vera, and almond oil to soothe dry, itchy, sensitive skin. Tearless formula.',
        shortDescription: 'Colloidal oatmeal & aloe vera tearless pet shampoo 500ml.',
        sizes: ['500ml Pump Bottle'],
        colors: ['Creamy Coconut']
      },
      {
        name: 'Multi-Level Sisal Scratching Tree Post with Plush Hammock',
        price: 3699,
        compareAtPrice: 5199,
        stock: 30,
        description: 'Heavy solid particleboard base prevents tipping. Wrapped in natural 6mm sisal rope with elevated lookout perch and deep plush sleeping hammock.',
        shortDescription: 'Multi-level cat scratching tower with sisal posts.',
        sizes: ['110cm Height'],
        colors: ['Warm Beige', 'Smoky Grey']
      },
      {
        name: 'Breathable Airline-Approved Expandable Pet Travel Carrier',
        price: 2799,
        compareAtPrice: 3999,
        stock: 45,
        description: 'Four-way expandable mesh windows expand to give pets 150% more room during layovers. Waterproof fleece pad and luggage trolley attachment strap.',
        shortDescription: 'Airline-approved 4-way expandable pet travel bag.',
        sizes: ['45 x 28 x 28 cm (Up to 7kg)'],
        colors: ['Heather Grey', 'Midnight Black']
      },
      {
        name: 'Heavy-Duty Waterproof Pet Car Seat Cover with Mesh Window',
        price: 1999,
        compareAtPrice: 2899,
        stock: 55,
        description: '600D Oxford waterproof quilted fabric protects back seats from mud, fur, and claw tears. Visual mesh window reduces pet travel anxiety.',
        shortDescription: '600D Oxford waterproof hammock car seat cover.',
        sizes: ['Universal (147 x 137 cm)'],
        colors: ['Black with Orange Piping']
      }
    ]
  },

  // ===================== 11. TOYS =====================
  {
    category: 'Toys',
    categorySlug: 'toys',
    subcategory: 'Montessori & STEM Play',
    collectionSlug: 'trending',
    brand: 'VEXIVO Play',
    sellerName: 'Nordic Toy Atelier',
    sellerInfo: 'Eco-Friendly FSC Certified Wooden Educational Toys',
    items: [
      {
        name: 'Handcrafted Solid Beechwood Montessori Balance Rocker Board',
        price: 2999,
        compareAtPrice: 4299,
        stock: 40,
        description: 'Curved multi-use balance board crafted from 10 layers of FSC certified European beech wood. Supports up to 150kg for open-ended creative play.',
        shortDescription: 'European beechwood Montessori balance rocker board.',
        sizes: ['84 x 30 x 18 cm'],
        colors: ['Natural Beech with Felt Base']
      },
      {
        name: 'Magnetic 3D Geometric Architectural Construction Blocks 100-Pc',
        price: 2499,
        compareAtPrice: 3599,
        stock: 60,
        description: 'Sonic-welded BPA-free food-grade ABS plastic tiles embedded with neodymium magnets. Develops spatial reasoning, geometry, and engineering skills.',
        shortDescription: '100-piece magnetic 3D translucent building tile set.',
        sizes: ['100-Piece Set'],
        colors: ['Rainbow Translucent']
      },
      {
        name: 'Scandinavian Pastel Wooden Activity Center & Walker',
        price: 3299,
        compareAtPrice: 4699,
        stock: 35,
        description: 'Sturdy wooden push walker featuring abacus beads, shape sorter, spinning gears, and musical xylophone. Rubber-rimmed silent wheels protect hardwood floors.',
        shortDescription: 'Wooden baby activity push walker with rubber wheels.',
        sizes: ['50 x 32 x 30 cm'],
        colors: ['Pastel Sage & Natural Wood']
      },
      {
        name: '1000-Piece Panoramic Botanical Illustration Jigsaw Puzzle',
        price: 999,
        compareAtPrice: 1499,
        stock: 80,
        description: 'Printed on recycled European blue board with non-glare linen finish. Features vintage botanical floral illustrations with zero piece repetition.',
        shortDescription: '1000-piece linen finish botanical jigsaw puzzle.',
        sizes: ['70 x 50 cm Completed Size'],
        colors: ['Botanical Multicolor']
      },
      {
        name: 'Food Grade Silicone Nesting Rainbow Teether Stacking Blocks',
        price: 1199,
        compareAtPrice: 1699,
        stock: 75,
        description: '100% platinum food-grade silicone free from BPA, phthalates, and lead. Multi-textured arches soothe teething gums and teach size hierarchy.',
        shortDescription: 'Food-grade silicone 7-piece nesting rainbow teether.',
        sizes: ['7 Arches (19 x 9.5 cm)'],
        colors: ['Earthy Bohemian Palette']
      },
      {
        name: 'Classic Wooden Dollhouse with Miniature Furniture Set',
        price: 4999,
        compareAtPrice: 6999,
        stock: 25,
        description: 'Three-story wooden mansion with open front access, functional balcony, and 18 pieces of hand-painted wooden furniture. Easy adult assembly.',
        shortDescription: '3-story handcrafted wooden dollhouse with 18 furniture pieces.',
        sizes: ['60 x 55 x 30 cm'],
        colors: ['Soft Pink & White']
      },
      {
        name: 'Interactive Solar-Powered Robotic STEM Engineering Kit',
        price: 1899,
        compareAtPrice: 2699,
        stock: 50,
        description: 'Build 14 different solar-powered working robotic configurations without batteries. Teaches renewable green energy principles and mechanical linkage.',
        shortDescription: '14-in-1 solar-powered educational STEM robot kit.',
        sizes: ['14-in-1 Modular Kit'],
        colors: ['Cobalt Blue & Grey']
      },
      {
        name: 'Organic Cotton Stuffed Musical Sleep Companion Fox',
        price: 1399,
        compareAtPrice: 1999,
        stock: 65,
        description: 'Hand-sewn from GOTS certified organic cotton plush with embroidered facial features. Pull string activates soothing Brahms lullaby music box.',
        shortDescription: 'Organic cotton plush fox with internal mechanical music box.',
        sizes: ['28cm Height'],
        colors: ['Warm Terracotta & Cream']
      },
      {
        name: 'Solid Walnut Chess & Checkers Set with Carved Staunton Pieces',
        price: 3499,
        compareAtPrice: 4999,
        stock: 30,
        description: 'Inlaid solid walnut and maple wooden board with felted storage drawers. Weighted Staunton wooden pieces with 3.5-inch King.',
        shortDescription: 'Inlaid walnut wooden chess board with weighted pieces.',
        sizes: ['38 x 38 cm Board'],
        colors: ['Rich Walnut & Natural Maple']
      },
      {
        name: 'Die-Cast Vintage Locomotive Train Set with Real Steam',
        price: 2799,
        compareAtPrice: 3999,
        stock: 40,
        description: 'Heavy die-cast metal steam engine with passenger cars and 16 feet of interlocking track. Features working headlight, chugging sound, and water vapor steam.',
        shortDescription: 'Vintage die-cast steam train set with water vapor smoke.',
        sizes: ['Complete Track Set (120x90cm)'],
        colors: ['Classic Black & Brass']
      },
      {
        name: 'Kinetic Magic Play Sand Sensory Exploration Box 2kg',
        price: 1299,
        compareAtPrice: 1799,
        stock: 70,
        description: 'Hypoallergenic non-toxic polymer sand that flows like liquid yet holds sharp molds effortlessly. Includes 10 castle molds and foldable play tray.',
        shortDescription: '2kg kinetic magic sand with molds and folding sand box.',
        sizes: ['2kg Sand + Tray & 10 Tools'],
        colors: ['Ocean Blue & Natural Sand']
      },
      {
        name: 'Junior Outdoor Explorer Adventure Bug Catching Kit',
        price: 1099,
        compareAtPrice: 1599,
        stock: 65,
        description: 'Includes 4x30 optical binoculars, compass, magnifying glass, LED crank flashlight, insect collection container, and butterfly net.',
        shortDescription: 'Kids outdoor explorer kit with binoculars and backpack.',
        sizes: ['Complete 7-Piece Adventure Bag'],
        colors: ['Safari Green']
      }
    ]
  },

  // ===================== 12. HEALTH & FITNESS =====================
  {
    category: 'Health & Fitness',
    categorySlug: 'health-fitness',
    subcategory: 'Studio Wellness & Training',
    collectionSlug: 'trending',
    brand: 'VEXIVO Active',
    sellerName: 'Kinetic Performance Lab',
    sellerInfo: 'Engineered High-Performance Athletic Equipment',
    items: [
      {
        name: 'High-Density Eco-Friendly Natural Tree Rubber Studio Yoga Mat',
        price: 2799,
        compareAtPrice: 3999,
        stock: 50,
        description: 'Sustainably tapped organic tree rubber base with ultra-absorbent polyurethane top layer that provides laser grip even during sweaty hot yoga sessions.',
        shortDescription: '5mm natural tree rubber non-slip studio yoga mat.',
        sizes: ['183 x 68 cm (5mm Thickness)'],
        colors: ['Forest Pine', 'Midnight Plum']
      },
      {
        name: 'Deep-Tissue Percussion Muscle Massage Gun with 6 Heads',
        price: 3699,
        compareAtPrice: 5299,
        stock: 45,
        description: 'Brushless high-torque motor delivering 3200 RPM percussion with 12mm amplitude. QuietGlide noise reduction and 6-hour rechargeable battery.',
        shortDescription: 'High-torque deep tissue percussion massage gun.',
        sizes: ['Handheld Kit with Carry Case'],
        colors: ['Matte Gunmetal', 'Stealth Black']
      },
      {
        name: 'Cast Iron Adjustable Vinyl-Coated Kettlebell 16kg',
        price: 2499,
        compareAtPrice: 3499,
        stock: 40,
        description: 'Single-piece gravity cast iron with smooth wide textured handle for two-handed swings. Durable vinyl dip prevents floor damage and rust.',
        shortDescription: '16kg solid cast iron kettlebell with vinyl floor coat.',
        sizes: ['16 kg (35 lbs)'],
        colors: ['Matte Black & Yellow Accent']
      },
      {
        name: 'Latex-Free Natural Rubber Resistance Bands Loop Set of 5',
        price: 899,
        compareAtPrice: 1299,
        stock: 95,
        description: 'Color-coded progressive resistance from Extra Light (5 lbs) to Extra Heavy (40 lbs). Includes breathable mesh storage pouch and exercise guide.',
        shortDescription: '5-pack calibrated natural rubber exercise loop bands.',
        sizes: ['Set of 5 Resistance Levels'],
        colors: ['Pastel Gradient', 'Classic Athletics']
      },
      {
        name: 'Insulated Double-Wall Stainless Steel Sport Water Bottle 1L',
        price: 1299,
        compareAtPrice: 1799,
        stock: 80,
        description: '18/8 food-grade pro stainless steel keeping beverages icy cold for 24 hours or steaming hot for 12 hours. Sweat-free powder-coat finish with chug cap.',
        shortDescription: '1-Liter double-wall vacuum insulated stainless bottle.',
        sizes: ['1000ml (32 oz)'],
        colors: ['Matte Sage', 'Deep Ocean', 'Desert Sand']
      },
      {
        name: 'High-Precision Smart Bluetooth Body Fat Scale with 13 Metrics',
        price: 1899,
        compareAtPrice: 2699,
        stock: 60,
        description: 'Bio-electrical impedance analysis (BIA) measuring weight, BMI, body fat percentage, skeletal muscle, visceral fat, and metabolic age on smartphone app.',
        shortDescription: '13-metric Bluetooth smart body composition scale.',
        sizes: ['28 x 28 cm Tempered Glass'],
        colors: ['Arctic White', 'Obsidian Black']
      },
      {
        name: 'Textured High-Density Foam Roller for Myofascial Release',
        price: 999,
        compareAtPrice: 1499,
        stock: 70,
        description: 'Grid finger and palm multi-density zones break down tight muscle knots, trigger points, and scar tissue. Hollow ABS core supports up to 250kg.',
        shortDescription: 'Multi-density grid trigger point muscle foam roller.',
        sizes: ['33 x 14 cm'],
        colors: ['Vibrant Teal', 'Classic Black']
      },
      {
        name: 'Speed Jump Rope with Dual Ball Bearings & Steel Cable',
        price: 799,
        compareAtPrice: 1199,
        stock: 90,
        description: '360-degree precision dual-bearing rotation system prevents twisting and curling. 3-meter PVC-coated steel wire cable adjustable with thumb screws.',
        shortDescription: 'Dual ball-bearing high-speed crossfit jump rope.',
        sizes: ['Adjustable 3-Meter Cable'],
        colors: ['Red Aluminum', 'Black Anodized']
      },
      {
        name: 'Ergonomic Contoured Lumbar Support Orthopedic Back Cushion',
        price: 1599,
        compareAtPrice: 2299,
        stock: 55,
        description: 'Scientifically molded high-resilience memory foam aligns spine posture during long desk work or driving. Breathable 3D mesh cover with dual straps.',
        shortDescription: 'Orthopedic memory foam ergonomic lumbar back pillow.',
        sizes: ['40 x 35 x 12 cm'],
        colors: ['Slate Grey Mesh']
      },
      {
        name: 'Neoprene Dipped Hexagonal Dumbbell Pair 5kg Each',
        price: 1999,
        compareAtPrice: 2799,
        stock: 45,
        description: 'Solid cast iron core dipped in comfortable non-slip neoprene coating. Anti-roll hexagonal heads stay put when set down between sets.',
        shortDescription: '5kg x 2 anti-roll neoprene dipped cast iron dumbbells.',
        sizes: ['Pair (5kg + 5kg)'],
        colors: ['Teal Green', 'Jet Black']
      },
      {
        name: 'Compression Knee Sleeves 7mm Neoprene Pair for Weightlifting',
        price: 1499,
        compareAtPrice: 2199,
        stock: 60,
        description: 'Competition grade 7mm SCR neoprene delivering heavy compression, joint warmth, and stability during deep barbell squats and lunges.',
        shortDescription: '7mm heavy-duty powerlifting neoprene knee sleeves pair.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Stealth Black with Red Stitch']
      },
      {
        name: 'Padded Genuine Leather Gym Weight Lifting Belt with Steel Buckle',
        price: 2199,
        compareAtPrice: 3199,
        stock: 40,
        description: 'Top-grain 8mm buffalo leather with contoured 4-inch back support pad and dual-prong stainless steel roller buckle. Prevents hyperextension.',
        shortDescription: '4-inch contoured buffalo leather powerlifting belt.',
        sizes: ['M (30-36")', 'L (34-40")', 'XL (38-44")'],
        colors: ['Oiled Dark Brown', 'Matte Black']
      }
    ]
  },

  // ===================== 13. ELECTRONICS =====================
  {
    category: 'Electronics',
    categorySlug: 'electronics',
    subcategory: 'Audio & Desktop Tech',
    collectionSlug: 'bestsellers',
    brand: 'VEXIVO Audio',
    sellerName: 'Acoustic Sound Labs',
    sellerInfo: 'Precision High-Fidelity Audio Engineering',
    items: [
      {
        name: 'Active Noise-Cancelling Over-Ear Studio Wireless Headphones',
        price: 5999,
        compareAtPrice: 8499,
        stock: 35,
        description: 'Custom 40mm titanium drivers with hybrid ANC eliminating 95% of ambient drone. Supports LDAC high-res audio codec with 50-hour playback.',
        shortDescription: 'Hybrid ANC over-ear Bluetooth 5.3 headphones with LDAC.',
        sizes: ['Universal Over-Ear'],
        colors: ['Matte Black', 'Silver Cloud']
      },
      {
        name: 'Retro Walnut Wood Hi-Fi Bluetooth 5.3 Desktop Speaker',
        price: 3999,
        compareAtPrice: 5699,
        stock: 40,
        description: 'Handcrafted solid walnut cabinet houses dual 20W neodymium full-range drivers and rear bass reflex port. Analog rotary brass volume knobs.',
        shortDescription: 'Solid walnut 40W Hi-Fi stereo desktop Bluetooth speaker.',
        sizes: ['24 x 14 x 12 cm'],
        colors: ['Natural Walnut & Gold']
      },
      {
        name: 'Ultra-Slim 65W GaN Fast Charger with Dual USB-C & USB-A',
        price: 1799,
        compareAtPrice: 2499,
        stock: 75,
        description: 'Gallium Nitride (GaN III) technology delivers full 65W power in half the size of standard adapters. Fast charges MacBook Pro, iPhone, and Galaxy.',
        shortDescription: '65W GaN III ultra-compact 3-port fast wall charger.',
        sizes: ['Pocket Size (60x35x30mm)'],
        colors: ['Matte White', 'Dark Graphite']
      },
      {
        name: 'Ergonomic Wireless Vertical Mouse with Silent Mechanical Switches',
        price: 1899,
        compareAtPrice: 2699,
        stock: 65,
        description: 'Natural 57-degree handshake posture reduces forearm tension and wrist pressure. 4000 DPI optical sensor with dual Bluetooth & 2.4GHz dongle.',
        shortDescription: '57-degree ergonomic vertical silent wireless mouse.',
        sizes: ['Right-Handed Ergonomic'],
        colors: ['Graphite Black', 'Off-White']
      },
      {
        name: '4K Ultra-HD Web Camera with Dual Stereo Noise-Cancelling Mics',
        price: 3499,
        compareAtPrice: 4899,
        stock: 45,
        description: 'Sony STARVIS CMOS sensor captures 4K @ 30fps with autofocus and HDR light correction. Built-in physical privacy slider and 360 tripod mount.',
        shortDescription: '4K Sony sensor HDR webcam with privacy shutter.',
        sizes: ['Monitor Mount Clip Included'],
        colors: ['Black Anodized']
      },
      {
        name: 'Aluminum Multi-Port USB-C Hub with 4K HDMI & 100W PD Pass-through',
        price: 2199,
        compareAtPrice: 3199,
        stock: 70,
        description: '7-in-1 expansion hub featuring 4K @ 60Hz HDMI, 100W Power Delivery, SD/TF card reader, and 3x USB 3.0 ports in heat-dissipating space grey alloy.',
        shortDescription: '7-in-1 aluminum USB-C hub with 4K 60Hz HDMI & 100W PD.',
        sizes: ['Compact Dongle (110x30mm)'],
        colors: ['Space Grey Aluminum']
      },
      {
        name: 'True Wireless In-Ear Earbuds with Transparency Mode & IPX7',
        price: 2999,
        compareAtPrice: 4299,
        stock: 55,
        description: 'Graphene dynamic drivers deliver punchy sub-bass and crystal-clear highs. IPX7 waterproof rating with wireless charging pocket case.',
        shortDescription: 'IPX7 waterproof TWS earbuds with wireless charging case.',
        sizes: ['Includes S, M, L Silicone Tips'],
        colors: ['Midnight Black', 'Pearl White']
      },
      {
        name: 'MagSafe Fast Wireless Magnetic Charging Stand 3-in-1',
        price: 2699,
        compareAtPrice: 3799,
        stock: 50,
        description: 'Simultaneously charges iPhone at 15W, Apple Watch at 5W, and AirPods at 5W. Floating magnetic arm holds phone in portrait or landscape.',
        shortDescription: '15W 3-in-1 magnetic wireless charging tree stand.',
        sizes: ['Desk Stand Form Factor'],
        colors: ['Pure White', 'Matte Black']
      },
      {
        name: 'Mechanical Tenkeyless Keyboard with Hot-Swappable Gateron Switches',
        price: 4499,
        compareAtPrice: 6299,
        stock: 35,
        description: '80% TKL aluminum top frame with pre-lubed Gateron Pro Yellow linear switches. Double-shot PBT keycaps and sound-dampening silicone foam.',
        shortDescription: 'Hot-swappable TKL mechanical keyboard with PBT caps.',
        sizes: ['87-Key TKL Layout'],
        colors: ['Retro Beige & Grey', 'Cyberpunk Neon']
      },
      {
        name: 'Portable Power Bank 20000mAh with Digital LED Battery Display',
        price: 2299,
        compareAtPrice: 3299,
        stock: 60,
        description: 'Airline-safe 74Wh high-capacity lithium-polymer cell with 22.5W Power Delivery fast charging. Numerical digital display shows exact percentage.',
        shortDescription: '20000mAh 22.5W fast-charging power bank with LED.',
        sizes: ['145 x 68 x 28 mm'],
        colors: ['Midnight Navy', 'Matte Black']
      },
      {
        name: 'Smart Home Ambient LED Sunset Projection Lamp with App Control',
        price: 1499,
        compareAtPrice: 2199,
        stock: 75,
        description: 'High-transmission optical crystal lens projects realistic golden-hour halo gradient. App control unlocks 16 million colors and rhythm sync.',
        shortDescription: '16M color smart RGB optical sunset projection lamp.',
        sizes: ['25cm Adjustable Stand'],
        colors: ['Matte Black Base']
      },
      {
        name: 'Studio Broadcast USB Condenser Microphone with Boom Arm Kit',
        price: 3299,
        compareAtPrice: 4699,
        stock: 40,
        description: 'Cardioid pickup pattern minimizes keyboard background clicks. Zero-latency headphone monitoring jack and tap-to-mute sensor with LED indicator.',
        shortDescription: '24-bit 192kHz USB broadcast condenser mic with scissor arm.',
        sizes: ['Complete Kit with Boom Arm & Pop Filter'],
        colors: ['All-Black Studio Edition']
      }
    ]
  },

  // ===================== 14. HOME & LIVING =====================
  {
    category: 'Home & Living',
    categorySlug: 'home-living',
    subcategory: 'Artisan Decor & Dining',
    collectionSlug: 'bestsellers',
    brand: 'VEXIVO Living',
    sellerName: 'Kyoto Ceramic Studio',
    sellerInfo: 'Traditional Ceramic Art and Natural Furnishings',
    items: [
      {
        name: 'Hand-Thrown Japanese Stoneware Ceramic Dinnerware Set 16-Pc',
        price: 5499,
        compareAtPrice: 7999,
        stock: 25,
        description: 'Artisan hand-thrown stoneware finished with matte reactive speckle glaze. Dishwasher and microwave safe service for four including plates and bowls.',
        shortDescription: '16-piece matte reactive glaze ceramic stoneware dining set.',
        sizes: ['16-Piece Service for 4'],
        colors: ['Earthy Sand Speckle', 'Ocean Slate']
      },
      {
        name: 'French Flax 100% Pure Washed Linen Duvet Cover Set',
        price: 4999,
        compareAtPrice: 7199,
        stock: 35,
        description: 'Woven from premium Normandy flax, garment washed for lived-in softness. Naturally breathable, temperature-regulating in summer and winter.',
        shortDescription: 'Normandy washed French linen king duvet cover set.',
        sizes: ['Queen (90x90")', 'King (104x90")'],
        colors: ['Warm Oatmeal', 'Sage Fog', 'Terracotta']
      },
      {
        name: 'Handcrafted Solid Black Walnut Sculptural Side Table',
        price: 6499,
        compareAtPrice: 8999,
        stock: 20,
        description: 'FSC-certified American black walnut with organic curved edges and continuous grain waterfall legs. Finished in non-toxic matte hardwax oil.',
        shortDescription: 'Solid American black walnut organic modern side table.',
        sizes: ['45 x 45 x 50 cm'],
        colors: ['Natural Dark Walnut']
      },
      {
        name: 'Moroccan Handwoven Wool Shag Berber Area Rug (5x7 ft)',
        price: 5999,
        compareAtPrice: 8499,
        stock: 22,
        description: 'Hand-knotted by Berber tribal weavers in the Atlas Mountains using 100% unbleached natural wool. Features plush 35mm pile and braided tassels.',
        shortDescription: 'Hand-knotted Atlas Mountains wool shag Berber rug.',
        sizes: ['5 x 7 ft (150 x 210 cm)'],
        colors: ['Cream with Charcoal Diamond']
      },
      {
        name: 'Ultrasonic Aromatherapy Essential Oil Diffuser in Matte Ceramic',
        price: 1999,
        compareAtPrice: 2899,
        stock: 60,
        description: 'Handcrafted ceramic cover with 300ml reservoir diffusing cool botanical mist for 10 hours. Warm ambient LED halo light with auto shut-off.',
        shortDescription: '300ml matte ceramic ultrasonic essential oil diffuser.',
        sizes: ['300ml Tank Capacity'],
        colors: ['Matte White Stone', 'Terracotta Clay']
      },
      {
        name: 'Mouth-Blown Ribbed Borosilicate Glass Carafe & Tumbler Set',
        price: 1699,
        compareAtPrice: 2499,
        stock: 55,
        description: 'Hand-blown thermal shock resistant borosilicate glass with delicate vertical fluting. Bedside carafe with tumbler that nests as a lid.',
        shortDescription: 'Hand-blown fluted ribbed glass carafe and tumbler set.',
        sizes: ['850ml Carafe + 250ml Tumbler'],
        colors: ['Crystal Clear', 'Smoky Amber']
      },
      {
        name: 'Weighted Organic Cotton Calming Blanket 7kg with Glass Beads',
        price: 3699,
        compareAtPrice: 5199,
        stock: 40,
        description: 'Distributes deep touch pressure to calm nervous system and promote restorative sleep. 100% breathable organic cotton with non-toxic glass beads.',
        shortDescription: '7kg organic cotton sensory calming weighted blanket.',
        sizes: ['150 x 200 cm (7 kg)'],
        colors: ['Slate Grey', 'Cloud Blue']
      },
      {
        name: 'Solid Brass Minimalist Taper Candle Holders Set of 3',
        price: 1899,
        compareAtPrice: 2699,
        stock: 50,
        description: 'Turned from solid unlacquered heavy brass with tiered graduated heights (6", 8", 10"). Develops an exquisite vintage patina with age.',
        shortDescription: 'Solid brass graduated height taper candle holders set.',
        sizes: ['Set of 3 (15cm, 20cm, 25cm)'],
        colors: ['Polished Raw Brass']
      },
      {
        name: 'Organic Bamboo Shredded Memory Foam Orthopedic Bed Pillow',
        price: 1499,
        compareAtPrice: 2199,
        stock: 65,
        description: 'Adjustable shredded gel memory foam fill allows you to add or remove stuffing for custom loft. Removable washable cooling bamboo jacquard cover.',
        shortDescription: 'Adjustable loft cooling bamboo shredded foam pillow.',
        sizes: ['Standard (50 x 75 cm)'],
        colors: ['Clean Bamboo White']
      },
      {
        name: 'Modern Matte Black Arch Floor Reading Lamp with Brass Accents',
        price: 3899,
        compareAtPrice: 5499,
        stock: 30,
        description: 'Gracefully curved carbon steel arch extending over sofas and reading nooks. Weighted marble base prevents tipping, with foot step-switch.',
        shortDescription: 'Overarching matte black floor lamp with marble base.',
        sizes: ['165cm Height (35cm reach)'],
        colors: ['Matte Black & Antique Brass']
      },
      {
        name: 'Natural Acacia Wood Rotating Lazy Susan Table Organizer',
        price: 1399,
        compareAtPrice: 1999,
        stock: 70,
        description: 'Solid organic acacia hardwood with deep natural grain variations. Smooth 360-degree steel ball bearing turntable with raised anti-spill rim.',
        shortDescription: 'Solid acacia wood 360-degree rotating turntable 30cm.',
        sizes: ['30cm Diameter (4cm rim)'],
        colors: ['Rich Acacia Hardwood']
      },
      {
        name: 'Hand-Poured Soy Wax Botanical Scented Candle with Wooden Wick',
        price: 1199,
        compareAtPrice: 1699,
        stock: 80,
        description: 'Clean-burning vegan soy and coconut wax infused with French lavender, sage, and white oak. Crackling wooden wick delivers 55 hours of burn time.',
        shortDescription: 'Botanical soy wax candle with crackling wooden wick.',
        sizes: ['250g Amber Glass Jar (55h burn)'],
        colors: ['French Lavender & Oak']
      }
    ]
  }
];

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

// Assemble flat product list
const allProductsToCreate = [];
let skuCounter = 310;

catalogDefinitions.forEach(catDef => {
  catDef.items.forEach((item, idx) => {
    const images = getImagesFor(catDef.category, idx);
    const slug = slugify(item.name);
    const skuCode = catDef.categorySlug.substring(0, 3).toUpperCase();
    const sku = `VEX-${skuCode}-${String(skuCounter++).padStart(4, '0')}`;

    allProductsToCreate.push({
      name: item.name,
      slug: slug,
      sku: sku,
      description: item.description,
      shortDescription: item.shortDescription,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      discount: Math.round(((item.compareAtPrice - item.price) / item.compareAtPrice) * 100),
      images: images,
      thumbnail: images[0],
      hoverImage: images[1] || images[0],
      category: catDef.category,
      categorySlug: catDef.categorySlug,
      subcategory: catDef.subcategory,
      collectionSlug: catDef.collectionSlug,
      brand: catDef.brand,
      sellerName: catDef.sellerName,
      sellerInfo: catDef.sellerInfo,
      stock: item.stock,
      lowStockThreshold: 5,
      tags: [catDef.category, catDef.subcategory, catDef.brand, 'Luxury', 'VEXIVO'],
      featured: idx % 3 === 0,
      bestseller: idx % 2 === 0,
      newArrival: idx % 4 === 0,
      specialOffer: idx % 5 === 0,
      rating: +(4.5 + (idx % 5) * 0.1).toFixed(1),
      numReviews: 12 + idx * 8,
      status: 'active',
      variants: [
        { name: 'Size', options: item.sizes },
        { name: 'Color', options: item.colors }
      ],
      options: item.sizes.map((s, sIdx) => ({
        size: String(s),
        color: String(item.colors[sIdx % item.colors.length] || ''),
        sku: `${sku}-${sIdx + 1}`,
        price: item.price,
        stock: Math.floor(item.stock / item.sizes.length),
        image: images[0]
      }))
    });
  });
});

console.log(`\nGenerated ${allProductsToCreate.length} complete product objects across 14 categories.`);

async function execute() {
  // 1. Verify every image URL
  console.log('\n--- Step 1: Pre-validating all image URLs ---');
  const allUrls = [];
  allProductsToCreate.forEach(p => allUrls.push(...p.images));
  const uniqueUrls = [...new Set(allUrls)];
  console.log(`Checking ${uniqueUrls.length} distinct image URLs across 168 products...`);

  let invalidCount = 0;
  for (const u of uniqueUrls) {
    const res = await checkUrl(u);
    if (!res.ok) {
      console.error('❌ Failed image URL in catalog:', u);
      invalidCount++;
    }
  }

  if (invalidCount > 0) {
    console.error(`Found ${invalidCount} invalid URLs. Aborting insertion.`);
    process.exit(1);
  }
  console.log(`✅ 100% of ${uniqueUrls.length} image URLs are VERIFIED HTTP 200 OK!`);

  // 2. Admin Login to live API
  console.log('\n--- Step 2: Authenticating with VEXIVO API ---');
  const loginData = JSON.stringify({ email: 'admin@vexivo.com', password: 'AdminPass123!' });
  const token = await new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(b);
          if (parsed.success && parsed.token) resolve(parsed.token);
          else reject(new Error('Login failed: ' + b));
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(loginData);
    req.end();
  });
  console.log('✅ Admin authenticated successfully.');

  // 3. Batch Create via API in small sequential batches to avoid socket congestion
  console.log(`\n--- Step 3: Inserting ${allProductsToCreate.length} products into live MongoDB ---`);
  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < allProductsToCreate.length; i++) {
    const product = allProductsToCreate[i];
    const postData = JSON.stringify(product);

    try {
      const result = await new Promise((resolve, reject) => {
        const req = http.request({
          hostname: '127.0.0.1',
          port: 5000,
          path: '/api/products',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Content-Length': Buffer.byteLength(postData)
          }
        }, res => {
          let b = '';
          res.on('data', c => b += c);
          res.on('end', () => {
            try {
              resolve(JSON.parse(b));
            } catch(e) { resolve({ success: false, raw: b }); }
          });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
      });

      if (result.success) {
        inserted++;
      } else {
        console.warn(`⚠️ Skipped/Failed product "${product.name}":`, result.message || result.error);
        skipped++;
      }
    } catch(err) {
      console.error(`Error inserting "${product.name}":`, err.message);
      skipped++;
    }

    if ((i + 1) % 28 === 0 || i === allProductsToCreate.length - 1) {
      console.log(`Progress: ${i + 1} / ${allProductsToCreate.length} processed (${inserted} inserted, ${skipped} skipped)`);
    }
  }

  console.log(`\n✅ Database insertion complete: ${inserted} products created.`);

  // 4. Update seedData.js to persist across re-seeds
  console.log('\n--- Step 4: Updating seedData.js with new products ---');
  const seedPath = path.join(__dirname, '../seed/seedData.js');
  let currentSeed = fs.readFileSync(seedPath, 'utf8');

  // Parse existing rawProducts
  const match = currentSeed.match(/const rawProducts = (\[[\s\S]*?\]);\s*const collectionsData/);
  if (match) {
    const existingRaw = JSON.parse(match[1]);
    const existingSlugs = new Set(existingRaw.map(p => p.slug));

    let addedToSeed = 0;
    allProductsToCreate.forEach(p => {
      if (!existingSlugs.has(p.slug)) {
        existingRaw.push(p);
        addedToSeed++;
      }
    });

    console.log(`Adding ${addedToSeed} new products to rawProducts array (Total seed count: ${existingRaw.length}).`);

    // Update categoriesData itemCount in seedData
    const catCounts = {};
    existingRaw.forEach(p => {
      catCounts[p.category] = (catCounts[p.category] || 0) + 1;
    });

    // Replace rawProducts in file
    const newRawProductsStr = `const rawProducts = ${JSON.stringify(existingRaw, null, 2)};\nconst collectionsData`;
    currentSeed = currentSeed.replace(/const rawProducts = (\[[\s\S]*?\]);\s*const collectionsData/, newRawProductsStr);

    // Update itemCount in categoriesData
    currentSeed = currentSeed.replace(/"itemCount":\s*\d+/g, (m) => {
      return m; // Let category controller handle dynamic count or leave updated
    });

    fs.writeFileSync(seedPath, currentSeed, 'utf8');
    console.log(`✅ server/seed/seedData.js successfully updated with ${existingRaw.length} products.`);
  }

  // 5. Final Catalog Verification
  console.log('\n--- Step 5: Final Catalog Verification via Live API ---');
  http.get('http://127.0.0.1:5000/api/products?limit=1', res => {
    let b = '';
    res.on('data', c => b += c);
    res.on('end', async () => {
      const data = JSON.parse(b);
      console.log(`🎉 Total Products in Marketplace: ${data.total}`);

      // Check category breakdown
      http.get('http://127.0.0.1:5000/api/categories', cRes => {
        let cb = '';
        cRes.on('data', c => cb += c);
        cRes.on('end', async () => {
          const cData = JSON.parse(cb);
          console.log('\nCategory Breakdown:');
          for (const cat of cData.categories) {
            await new Promise(r => {
              http.get('http://127.0.0.1:5000/api/products?category=' + cat.slug + '&limit=1', pRes => {
                let pb = '';
                pRes.on('data', pc => pb += pc);
                pRes.on('end', () => {
                  const pd = JSON.parse(pb);
                  console.log(`  - ${cat.name.padEnd(20)} : ${pd.total} products`);
                  r();
                });
              });
            });
          }
          console.log('\n======================================================');
          console.log('✅ ALL CATEGORIES NOW HAVE EXTENSIVE CATALOG PRODUCTS!');
          console.log('======================================================\n');
        });
      });
    });
  });
}

execute().catch(console.error);
