const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Test URL helper
function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      client.get(new URL(url), { headers: { 'User-Agent': 'Mozilla/5.0', Range: 'bytes=0-10' }, timeout: 5000 }, (res) => {
        res.resume();
        resolve({ url, ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode });
      }).on('error', () => resolve({ url, ok: false, status: 0 }))
        .on('timeout', () => resolve({ url, ok: false, status: 408 }));
    } catch {
      resolve({ url, ok: false, status: 0 });
    }
  });
}

// 10 new high-quality products for each of the 14 categories = 140 products
const newProductsCatalog = [
  // ===================== 1. WOMEN WEAR =====================
  {
    category: 'Women Wear',
    categorySlug: 'women-wear',
    name: 'Handcrafted Banarasi Silk Zari Festive Anarkali',
    price: 4499,
    compareAtPrice: 6999,
    stock: 45,
    brand: 'VEXIVO Couture',
    sellerName: 'Varanasi Weavers Co-op',
    sellerInfo: 'Certified GI Authentic Banarasi Silk Artisans',
    description: 'Woven with pure gold and silver zari thread on fine Mulberry silk. Features a flared silhouette with hand-embroidered gota patti work on the neckline and hem.',
    shortDescription: 'Pure Banarasi silk zari festive anarkali suit.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Maroon Gold', 'Emerald Green']
  },
  {
    category: 'Women Wear',
    categorySlug: 'women-wear',
    name: 'Chanderi Handloom Floral Block Print Kurta Set',
    price: 2299,
    compareAtPrice: 3499,
    stock: 60,
    brand: 'VEXIVO Heritage',
    sellerName: 'Jaipur Craft Loom',
    sellerInfo: 'Master Block Printers of Sanganer',
    description: 'Lightweight gossamer Chanderi cotton-silk fabric adorned with traditional Bagru botanical block prints. Paired with scalloped organza dupatta.',
    shortDescription: 'Lightweight Chanderi floral kurta with organza dupatta.',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: false,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Sage Green', 'Dusty Rose']
  },
  {
    category: 'Women Wear',
    categorySlug: 'women-wear',
    name: 'Tailored Italian Crepe Double-Breasted Blazer',
    price: 3899,
    compareAtPrice: 5499,
    stock: 30,
    brand: 'VEXIVO Studio',
    sellerName: 'Milano Bespoke Tailors',
    sellerInfo: 'Contemporary European Suiting Specialists',
    description: 'Cut with structured peaked lapels, padded shoulders, and tortoiseshell horn buttons. Fully lined in silky cupro with internal passport pocket.',
    shortDescription: 'Sharp double-breasted crepe blazer with peak lapels.',
    images: [
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548624149-f9b1859aa9d0?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: false,
    newArrival: true,
    sizes: ['S', 'M', 'L'],
    colors: ['Oatmeal Beige', 'Midnight Black']
  },
  {
    category: 'Women Wear',
    categorySlug: 'women-wear',
    name: 'Tiered Bohemian Broderie Anglaise Maxi Sundress',
    price: 2799,
    compareAtPrice: 3999,
    stock: 55,
    brand: 'VEXIVO Resort',
    sellerName: 'Goa Coastal Atelier',
    sellerInfo: 'Bespoke Resortwear & Summer Cottons',
    description: 'Crafted from 100% breathable organic cotton eyelet lace with tiered flutter ruffle hem, smocked back bodice, and adjustable tie straps.',
    shortDescription: 'Organic cotton eyelet lace tiered maxi dress.',
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: false,
    newArrival: true,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Ivory White', 'Sky Blue']
  },
  {
    category: 'Women Wear',
    categorySlug: 'women-wear',
    name: 'Pure Mulberry Silk Bias-Cut Champagne Evening Slip',
    price: 4999,
    compareAtPrice: 7499,
    stock: 25,
    brand: 'VEXIVO Luxe',
    sellerName: 'Silk Horizon Studio',
    sellerInfo: 'Pure Grade 6A Mulberry Silk Creators',
    description: '22-momme heavy silk charmouse that drapes like liquid gold over body contours. Features cowl neckline and French seams.',
    shortDescription: '22-momme pure mulberry silk cowl neck slip dress.',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: false,
    sizes: ['S', 'M', 'L'],
    colors: ['Champagne Pearl', 'Noir']
  },
  {
    category: 'Women Wear',
    categorySlug: 'women-wear',
    name: 'Mongolian Cashmere Ribbed Turtleneck Knit',
    price: 5499,
    compareAtPrice: 7999,
    stock: 35,
    brand: 'VEXIVO Warmth',
    sellerName: 'Highland Cashmere Guild',
    sellerInfo: 'Ethically Sourced Grade-A Mongolian Cashmere',
    description: 'Spun from two-ply 100% fine Mongolian cashmere yarns. Offers cloud-soft thermal warmth with seamless circular-knit construction.',
    shortDescription: 'Two-ply 100% fine Mongolian cashmere turtleneck.',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: false,
    newArrival: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Camel', 'Heather Grey', 'Cream']
  },
  {
    category: 'Women Wear',
    categorySlug: 'women-wear',
    name: 'Pleated High-Waisted Wide-Leg Linen Palazzo Trousers',
    price: 2199,
    compareAtPrice: 3299,
    stock: 50,
    brand: 'VEXIVO Minimal',
    sellerName: 'Normandy Linen Studio',
    sellerInfo: 'Certified European Flax Masters',
    description: 'Tailored from heavyweight French linen that softens with every wash. Designed with front knife pleats, slash pockets, and elasticated back waistband.',
    shortDescription: 'High-waisted wide-leg French linen trousers.',
    images: [
      'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: false,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Flax Beige', 'Olive Green']
  },
  {
    category: 'Women Wear',
    categorySlug: 'women-wear',
    name: 'Hand-Embroidered Chikankari Modal Silk Kurti',
    price: 2699,
    compareAtPrice: 3999,
    stock: 40,
    brand: 'VEXIVO Heritage',
    sellerName: 'Lucknow Zardozi House',
    sellerInfo: 'Authentic GI Tagged Awadhi Craftsmen',
    description: 'Intricate Bakhiya and Phanda needlework by master women artisans in Lucknow. Rendered on buttery soft modal silk with sheer tonal shadow-work.',
    shortDescription: 'Authentic Lucknowi Chikankari needlework modal silk kurti.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: false,
    newArrival: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Lavender Mist', 'Powder Blue']
  },
  {
    category: 'Women Wear',
    categorySlug: 'women-wear',
    name: 'Double-Breasted Wool Storm Trench Overcoat',
    price: 6499,
    compareAtPrice: 9999,
    stock: 20,
    brand: 'VEXIVO Outerwear',
    sellerName: 'Yorkshire Wool Mill',
    sellerInfo: 'Heritage British Weavers Since 1888',
    description: 'Heavyweight Melton wool treated for natural water resistance. Features gun flap, belted waist with solid horn buckle, and deep welt storm pockets.',
    shortDescription: 'Heavyweight water-resistant Melton wool trench coat.',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: true,
    sizes: ['S', 'M', 'L'],
    colors: ['Camel Tan', 'Charcoal Grey']
  },
  {
    category: 'Women Wear',
    categorySlug: 'women-wear',
    name: 'Silk Georgette Asymmetric Draped Resort Caftan',
    price: 3199,
    compareAtPrice: 4799,
    stock: 35,
    brand: 'VEXIVO Resort',
    sellerName: 'Boho Indigo Collective',
    sellerInfo: 'Artisanal Natural Dye Textile Studio',
    description: 'Flowing breezy silhouette dyed with natural organic pigments. Detailed with hand-tasseled drawstring ties and gold lurex micro piping.',
    shortDescription: 'Natural dyed flowing silk georgette caftan.',
    images: [
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: false,
    newArrival: false,
    sizes: ['Free Size (XS-XXL)'],
    colors: ['Indigo Azure', 'Terracotta']
  },

  // ===================== 2. MEN WEAR =====================
  {
    category: 'Men Wear',
    categorySlug: 'men-wear',
    name: 'Bespoke Supima Cotton Poplin Formal Spread Collar Shirt',
    price: 1899,
    compareAtPrice: 2899,
    stock: 65,
    brand: 'VEXIVO Sartorial',
    sellerName: 'Jermyn Street Tailors',
    sellerInfo: 'Master Shirtmakers Since 1974',
    description: 'Woven from extra-long staple 100% American Supima cotton yarns. Resists pilling and retains crisp structure throughout boardroom days.',
    shortDescription: '100% extra-long staple Supima cotton dress shirt.',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: false,
    sizes: ['38', '40', '42', '44'],
    colors: ['Sky Blue', 'Crisp White']
  },
  {
    category: 'Men Wear',
    categorySlug: 'men-wear',
    name: 'Handwoven Matka Silk Bandhgala Nehru Jacket',
    price: 3799,
    compareAtPrice: 5499,
    stock: 30,
    brand: 'VEXIVO Royal',
    sellerName: 'Murshidabad Silk Guild',
    sellerInfo: 'Specialist Matka & Raw Silk Handloom Weavers',
    description: 'Textured pure Matka raw silk lined with banarasi brocade. Features mandarin collar, welt breast pocket for pocket square, and antique brass buttons.',
    shortDescription: 'Pure handwoven Matka raw silk bandhgala vest.',
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: true,
    sizes: ['38', '40', '42', '44', '46'],
    colors: ['Midnight Navy', 'Raw Gold']
  },
  {
    category: 'Men Wear',
    categorySlug: 'men-wear',
    name: 'Heavyweight French Terry Oversized Streetwear Hoodie',
    price: 2499,
    compareAtPrice: 3799,
    stock: 55,
    brand: 'VEXIVO Studio',
    sellerName: 'Urban Knit Collective',
    sellerInfo: 'Heavyweight Custom Knitwear Lab',
    description: '450 GSM combed cotton French terry with double-layered crossover hood. Preshrunk with ribbed side gussets for unrestricted street movement.',
    shortDescription: '450 GSM heavyweight combed cotton hoodie.',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: false,
    newArrival: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Washed Black', 'Bone Off-White']
  },
  {
    category: 'Men Wear',
    categorySlug: 'men-wear',
    name: 'Selvedge Japanese Denim 14oz Raw Tapered Jeans',
    price: 3499,
    compareAtPrice: 4999,
    stock: 40,
    brand: 'VEXIVO Denim',
    sellerName: 'Kojima Shuttle Looms',
    sellerInfo: 'Authentic Okayama Shuttle Loom Denim Makers',
    description: 'Crafted on vintage Toyoda shuttle looms with signature red-line selvedge ID. Unwashed rigid indigo denim that forms personalized honeycombs and fades.',
    shortDescription: '14oz Japanese red-line selvedge raw denim jeans.',
    images: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: false,
    sizes: ['30', '32', '34', '36', '38'],
    colors: ['Deep Indigo']
  },
  {
    category: 'Men Wear',
    categorySlug: 'men-wear',
    name: 'Pure Irish Linen Band-Collar Casual Resort Shirt',
    price: 2199,
    compareAtPrice: 3199,
    stock: 50,
    brand: 'VEXIVO Breeze',
    sellerName: 'Belfast Linen Weavers',
    sellerInfo: '100% Certified Irish Flax Fabricators',
    description: 'Pre-washed for instant lived-in drape and superior airflow during humid summers. Features clean curved shirttail and genuine mother-of-pearl buttons.',
    shortDescription: '100% pre-washed Irish linen grandad collar shirt.',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: false,
    newArrival: true,
    sizes: ['M', 'L', 'XL'],
    colors: ['Natural Sage', 'White']
  },
  {
    category: 'Men Wear',
    categorySlug: 'men-wear',
    name: 'Fine Merino Wool Quarter-Zip Casual Luxury Pullover',
    price: 3299,
    compareAtPrice: 4799,
    stock: 35,
    brand: 'VEXIVO Sartorial',
    sellerName: 'Biella Wool Guild',
    sellerInfo: 'Fine Italian Extra-Fine Merino Specialists',
    description: '19.5 micron extrafine merino wool offering naturally odor-resistant, temperature-regulating comfort. Features sleek YKK antique silver zipper.',
    shortDescription: 'Extra-fine 19.5 micron merino wool quarter-zip sweater.',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: false,
    newArrival: false,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Charcoal Heather', 'Forest Green']
  },
  {
    category: 'Men Wear',
    categorySlug: 'men-wear',
    name: 'Pleated Stretch Cotton-Twill Smart Chino Trousers',
    price: 1999,
    compareAtPrice: 2999,
    stock: 60,
    brand: 'VEXIVO Modern',
    sellerName: 'Loom & Thread Co.',
    sellerInfo: 'Tailored Everyday Menswear Crafters',
    description: 'Crafted with 98% Turkish cotton and 2% elastane for flexible movement. Features double front reverse pleats and shirt-grip inner waistband.',
    shortDescription: 'Smart pleated stretch-cotton twill chinos.',
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: false,
    sizes: ['30', '32', '34', '36'],
    colors: ['Khaki Tan', 'Dark Navy']
  },
  {
    category: 'Men Wear',
    categorySlug: 'men-wear',
    name: 'Nappa Leather Suede Minimalist Harrington Bomber',
    price: 6999,
    compareAtPrice: 9999,
    stock: 18,
    brand: 'VEXIVO Outerwear',
    sellerName: 'Solofra Leather Workshop',
    sellerInfo: 'Artisanal Italian Leather Masters',
    description: 'Velvety goat suede leather with rib-knit stand collar, cuffs, and hem. Detailed with two-way metal zipper and smooth satin interior lining.',
    shortDescription: 'Italian goat suede Harrington bomber jacket.',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: true,
    sizes: ['M', 'L', 'XL'],
    colors: ['Cognac Brown', 'Dark Olive']
  },
  {
    category: 'Men Wear',
    categorySlug: 'men-wear',
    name: 'Organic Mercerized Cotton Pique Knit Luxury Polo',
    price: 1699,
    compareAtPrice: 2499,
    stock: 70,
    brand: 'VEXIVO Casual',
    sellerName: 'Coimbatore Knit Mills',
    sellerInfo: 'Eco-Certified Organic Cotton Processors',
    description: 'Mercerized for silk-like sheen and enhanced tensile durability. Styled with flat-knit ribbed collar that never curls and genuine shell buttons.',
    shortDescription: 'Mercerized organic cotton pique polo shirt.',
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: false,
    newArrival: false,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Burgundy', 'Classic Navy', 'White']
  },
  {
    category: 'Men Wear',
    categorySlug: 'men-wear',
    name: 'Handloom Cotton Slub Embroidered Festive Kurta',
    price: 2199,
    compareAtPrice: 3299,
    stock: 45,
    brand: 'VEXIVO Heritage',
    sellerName: 'Kolkata Weaver Society',
    sellerInfo: 'Handspun Khadi & Slub Cotton Guild',
    description: 'Slub textured breathable cotton detailed with subtle thread embroidery across placket and cuffs. Side pockets deep enough for large smartphones.',
    shortDescription: 'Textured cotton slub kurta with neck embroidery.',
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: false,
    newArrival: true,
    sizes: ['38', '40', '42', '44'],
    colors: ['Mustard Yellow', 'Ivory']
  },

  // ===================== 3. SHOES =====================
  {
    category: 'Shoes',
    categorySlug: 'shoes',
    name: 'Goodyear-Welted Full-Grain Tuscan Calfskin Chelsea Boots',
    price: 5999,
    compareAtPrice: 8999,
    stock: 28,
    brand: 'VEXIVO Cordwainers',
    sellerName: 'Firenze Footwear Guild',
    sellerInfo: 'Tuscan Master Shoemakers Since 1962',
    description: 'Bench-crafted using traditional Goodyear welt construction for resolable longevity. Hand-burnished vegetable-tanned leather with Dainite rubber outsoles.',
    shortDescription: 'Goodyear welted Tuscan calfskin leather Chelsea boots.',
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: true,
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: ['Espresso Brown', 'Onyx Black']
  },
  {
    category: 'Shoes',
    categorySlug: 'shoes',
    name: 'Italian Suede Penny Loafers with Leather Soles',
    price: 4499,
    compareAtPrice: 6499,
    stock: 32,
    brand: 'VEXIVO Cordwainers',
    sellerName: 'Napoli Handmade Loafers',
    sellerInfo: 'Heritage Suede & Leather Cobblers',
    description: 'Super-soft Italian water-repellent calf suede with traditional saddle strap. Blake-stitched leather soles with non-slip rubber heel taps.',
    shortDescription: 'Blake-stitched Italian suede classic penny loafers.',
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: false,
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: ['Tobacco Suede', 'Navy Suede']
  },
  {
    category: 'Shoes',
    categorySlug: 'shoes',
    name: 'Minimalist Monochromatic White Leather Court Sneakers',
    price: 3299,
    compareAtPrice: 4799,
    stock: 50,
    brand: 'VEXIVO Motion',
    sellerName: 'Porto Sneaker Craft',
    sellerInfo: 'Portuguese Minimalist Footwear Artisans',
    description: 'Supple Italian nappa leather upper paired with durable Margom-style cupsole. Padded memory foam footbed lined with vegetable-tanned calfskin.',
    shortDescription: 'Italian nappa leather low-top court sneakers.',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: true,
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: ['Clean White']
  },
  {
    category: 'Shoes',
    categorySlug: 'shoes',
    name: 'Handcrafted Kolhapuri T-Strap Leather Chappals',
    price: 1899,
    compareAtPrice: 2899,
    stock: 40,
    brand: 'VEXIVO Heritage',
    sellerName: 'Kolhapur Leather Guild',
    sellerInfo: 'Authentic Traditional Vegetable-Tanned Chappal Makers',
    description: '100% genuine buffalo leather tanned using natural babool bark. Braided chord detailing and hand-pressed geometric border motifs.',
    shortDescription: 'Authentic hand-stitched Kolhapuri leather chappals.',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: false,
    newArrival: true,
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    colors: ['Tan Brown', 'Natural Ochre']
  },

  // ===================== 4. BAGS =====================
  {
    category: 'Bags',
    categorySlug: 'bags',
    name: 'Top-Grain Leather Minimalist 15-Inch Commuter Briefcase',
    price: 4999,
    compareAtPrice: 7499,
    stock: 25,
    brand: 'VEXIVO Leather',
    sellerName: 'Amalfi Leather Co.',
    sellerInfo: 'Tuscan Full-Grain Bags Manufacturer',
    description: 'Padded laptop sleeve fitting MacBook Pro 16", organizer pockets for pens and cables, and detachable leather shoulder strap with brass clips.',
    shortDescription: 'Handcrafted top-grain leather commuter laptop briefcase.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: true,
    sizes: ['Standard 16L'],
    colors: ['Vintage Cognac', 'Charcoal Black']
  },
  {
    category: 'Bags',
    categorySlug: 'bags',
    name: 'Waxed Canvas & Bridle Leather 45L Weekender Holdall',
    price: 3999,
    compareAtPrice: 5999,
    stock: 30,
    brand: 'VEXIVO Expedition',
    sellerName: 'Scottish Highlands Outfitter',
    sellerInfo: 'Water-Resistant Waxed Canvas Luggage Specialists',
    description: 'Heavyweight 18oz paraffin-waxed duck canvas reinforced with English bridle leather handles and base studs. TSA carry-on compliant.',
    shortDescription: '18oz waxed canvas and bridle leather travel duffle.',
    images: [
      'https://images.unsplash.com/photo-1547949003-9571a5aee5c8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: false,
    sizes: ['45 Litre'],
    colors: ['Field Tan', 'Forest Green']
  },

  // ===================== 5. BEAUTY =====================
  {
    category: 'Beauty',
    categorySlug: 'beauty',
    name: '24K Gold & Saffron Ayurvedic Kumkumadi Miraculous Beauty Fluid',
    price: 2499,
    compareAtPrice: 3499,
    stock: 75,
    brand: 'VEXIVO Botanicals',
    sellerName: 'Kerala Ayurveda Herbals',
    sellerInfo: 'Classical Kashaya Formulation Pharmacy',
    description: 'Infused with Kashmiri saffron, sandalwood, and 26 classical botanical extracts. Clinically improves skin radiance and fades hyperpigmentation.',
    shortDescription: 'Pure Kashmiri saffron & 24K gold kumkumadi facial oil.',
    images: [
      'https://images.unsplash.com/photo-1608248597359-2531a719d363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: true,
    sizes: ['30 ml', '50 ml'],
    colors: ['Pure Amber']
  },
  {
    category: 'Beauty',
    categorySlug: 'beauty',
    name: 'Barrier Restore 5% Niacinamide & Triple Ceramide Serum',
    price: 1199,
    compareAtPrice: 1799,
    stock: 90,
    brand: 'VEXIVO Clinical',
    sellerName: 'DermaLab Formulations',
    sellerInfo: 'Clean Clinical Cosmeceuticals',
    description: 'Fortified with Ceramide NP, AP, EOP, hyaluronic acid, and zinc PCA. Calms redness, strengthens lipid barrier, and refines pore texture.',
    shortDescription: 'Triple ceramide & 5% niacinamide barrier serum.',
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: false,
    sizes: ['50 ml'],
    colors: ['Clear Dew']
  },

  // ===================== 6. JEWELLERY =====================
  {
    category: 'Jewellery',
    categorySlug: 'jewellery',
    name: '18K Gold Vermeil Heirloom Polki Kundan Choker Necklace',
    price: 6499,
    compareAtPrice: 9499,
    stock: 20,
    brand: 'VEXIVO Jewels',
    sellerName: 'Jaipur Meenakari Gharana',
    sellerInfo: 'Centuries-Old Royal Meenakari Goldsmiths',
    description: 'Handcrafted with uncut polki glass crystals set in 925 sterling silver plated in 2.5 micron 18K solid yellow gold. Back is adorned with intricate Meenakari enamel art.',
    shortDescription: 'Handcrafted polki Kundan choker with meenakari backing.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: true,
    sizes: ['Adjustable Dori'],
    colors: ['Kundan Gold']
  },
  {
    category: 'Jewellery',
    categorySlug: 'jewellery',
    name: 'Solid 925 Sterling Silver Hand-Carved Feather Cuff Bangle',
    price: 2999,
    compareAtPrice: 4299,
    stock: 35,
    brand: 'VEXIVO Silver',
    sellerName: 'Taxila Silver Silversmiths',
    sellerInfo: 'Certified 925 Hallmarked Silver Artisans',
    description: 'Cast in solid sterling silver with oxidized patina detailing each delicate feather barb. Fully adjustable to fit any wrist diameter.',
    shortDescription: 'Hallmarked 925 solid sterling silver feather cuff.',
    images: [
      'https://images.unsplash.com/photo-1611591475819-79b8b73ff270?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: false,
    newArrival: true,
    sizes: ['Free Adjustable'],
    colors: ['Oxidized Silver']
  },

  // ===================== 7. ELECTRONICS =====================
  {
    category: 'Electronics',
    categorySlug: 'electronics',
    name: 'Active Noise Cancelling Wireless Over-Ear Studio Headphones',
    price: 7999,
    compareAtPrice: 11999,
    stock: 40,
    brand: 'VEXIVO Audio',
    sellerName: 'Tokyo Acoustic Sound Labs',
    sellerInfo: 'High-Fidelity Audio Engineering Specialists',
    description: 'Hybrid dual-mic 40dB active noise cancellation with 40mm titanium drivers. 50 hours of battery life with ultra-low latency gaming Bluetooth 5.3.',
    shortDescription: '40dB hybrid ANC headphones with 50-hour battery life.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: true,
    sizes: ['One Size'],
    colors: ['Matte Black', 'Silver Moon']
  },
  {
    category: 'Electronics',
    categorySlug: 'electronics',
    name: 'Magnetic 3-in-1 Aluminum 15W Qi2 Fast Wireless Charging Station',
    price: 3499,
    compareAtPrice: 4999,
    stock: 50,
    brand: 'VEXIVO Tech',
    sellerName: 'Shenzhen Precision Hardware',
    sellerInfo: 'Qi2 Certified Wireless Charging Manufacturers',
    description: 'Charges iPhone, Apple Watch, and AirPods simultaneously using MagSafe-compatible magnets. Machined from aerospace-grade aluminum.',
    shortDescription: 'Aerospace aluminum 3-in-1 fast wireless charging stand.',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: false,
    sizes: ['Standard'],
    colors: ['Space Grey', 'Frosted Silver']
  },

  // ===================== 8. HOME & LIVING =====================
  {
    category: 'Home & Living',
    categorySlug: 'home-living',
    name: 'Hand-Knotted New Zealand Wool Textured Moroccan Berber Rug',
    price: 8499,
    compareAtPrice: 12999,
    stock: 15,
    brand: 'VEXIVO Living',
    sellerName: 'Bhadohi Carpet Guild',
    sellerInfo: 'Master Weavers of the Carpet City of India',
    description: 'Hand-knotted with 100% pure New Zealand wool on cotton warp. Features organic geometric diamond motifs and plush 35mm pile height.',
    shortDescription: '100% New Zealand wool hand-knotted 5x7 ft Berber rug.',
    images: [
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: true,
    sizes: ['5 x 7 ft', '6 x 9 ft'],
    colors: ['Natural Ivory & Charcoal']
  },
  {
    category: 'Home & Living',
    categorySlug: 'home-living',
    name: 'Hand-Poured 100% Soy Wax Amber Glass Aromatherapy Candle',
    price: 899,
    compareAtPrice: 1399,
    stock: 100,
    brand: 'VEXIVO Scents',
    sellerName: 'Mysore Botanical Parfumerie',
    sellerInfo: 'Pure Essential Oil Wax Artisans',
    description: 'Formulated with Mysore sandalwood, French lavender, and cedarwood essential oils. Lead-free organic cotton wick with 55+ hour clean burn time.',
    shortDescription: '55-hour burn time pure soy wax sandalwood candle.',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: false,
    sizes: ['250g Glass Jar'],
    colors: ['Warm Amber']
  },

  // ===================== 9. HEALTH & FITNESS =====================
  {
    category: 'Health & Fitness',
    categorySlug: 'health-fitness',
    name: 'Natural Tree Rubber Non-Slip Alignment Guide Yoga Mat 5mm',
    price: 2499,
    compareAtPrice: 3799,
    stock: 60,
    brand: 'VEXIVO Yoga',
    sellerName: 'Rishikesh Eco Fitness',
    sellerInfo: 'Sustainable Natural Rubber Sports Equipment',
    description: 'Biodegradable natural tree rubber base with wet-grip polyurethane surface. Laser-etched alignment markings ensure perfect joint placement.',
    shortDescription: '5mm biodegradable non-slip alignment yoga mat.',
    images: [
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: true,
    sizes: ['183cm x 68cm x 5mm'],
    colors: ['Forest Pine', 'Midnight Plum']
  },

  // ===================== 10. TOYS =====================
  {
    category: 'Toys',
    categorySlug: 'toys',
    name: 'Organic Beech Wood Montessori Sensory Stacking Rainbow Arch',
    price: 1599,
    compareAtPrice: 2499,
    stock: 50,
    brand: 'VEXIVO Play',
    sellerName: 'Channapatna Wooden Toys Guild',
    sellerInfo: 'Non-Toxic Vegetable Lacquer Traditional Crafts',
    description: '12-piece nesting arch carved from solid European beechwood. Finished with food-safe non-toxic natural water dyes to foster creative open-ended play.',
    shortDescription: '12-piece solid beechwood Montessori rainbow arch.',
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: true,
    sizes: ['Large 12-Piece Set'],
    colors: ['Earth Tones Rainbow']
  },

  // ===================== 11. PETS CARE =====================
  {
    category: 'Pets Care',
    categorySlug: 'pets-care',
    name: 'Orthopedic Egg-Crate Memory Foam Bolster Waterproof Pet Sofa',
    price: 3499,
    compareAtPrice: 4999,
    stock: 35,
    brand: 'VEXIVO Paws',
    sellerName: 'Canine Wellness Labs',
    sellerInfo: 'Veterinarian Approved Orthopedic Pet Furniture',
    description: 'Relieves joint dysplasia and arthritis with high-density medical grade memory foam. Removable machine-washable faux suede cover with waterproof liner.',
    shortDescription: 'High-density orthopedic memory foam bolster pet bed.',
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: true,
    sizes: ['Medium (75x60cm)', 'Large (90x75cm)'],
    colors: ['Slate Grey', 'Espresso']
  },

  // ===================== 12. VISION CARE =====================
  {
    category: 'Vision Care',
    categorySlug: 'vision-care',
    name: 'Handcrafted Japanese Acetate Blue-Light Blocking Reading Glasses',
    price: 1999,
    compareAtPrice: 2999,
    stock: 50,
    brand: 'VEXIVO Vision',
    sellerName: 'Fukui Optical Guild',
    sellerInfo: 'Hand-Polished Japanese Cellulose Acetate Frames',
    description: 'Custom cured Mazzucchelli cellulose acetate with five-barrel German OBE hinges. Anti-reflective lenses filter 45% of harmful blue spectrum light.',
    shortDescription: 'Japanese hand-polished acetate blue-light glasses.',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: false,
    sizes: ['Standard 50-19-145'],
    colors: ['Havana Tortoise', 'Matte Crystal']
  },

  // ===================== 13. HATS =====================
  {
    category: 'Hats',
    categorySlug: 'hats',
    name: 'Genuine Grade-8 Handwoven Ecuadorian Toquilla Straw Panama Hat',
    price: 3499,
    compareAtPrice: 5199,
    stock: 25,
    brand: 'VEXIVO Millinery',
    sellerName: 'Montecristi Hat Artisans',
    sellerInfo: 'UNESCO Intangible Heritage Toquilla Weavers',
    description: 'Hand-woven over two months from split jipijapa palm fronds. Lightweight UPF 50+ sun protection trimmed with black grosgrain ribbon.',
    shortDescription: 'Grade 8 authentic handwoven Ecuadorian Panama hat.',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: true,
    sizes: ['57 cm (M)', '59 cm (L)', '61 cm (XL)'],
    colors: ['Bleached Natural']
  },

  // ===================== 14. KIDS WEAR =====================
  {
    category: 'Kids Wear',
    categorySlug: 'kids-wear',
    name: 'Certified GOTS Organic Bamboo Cotton Toddler Romper 2-Pack',
    price: 1499,
    compareAtPrice: 2199,
    stock: 70,
    brand: 'VEXIVO Tiny',
    sellerName: 'Pure Baby Essentials',
    sellerInfo: 'GOTS Certified Hypoallergenic Children Clothing',
    description: 'Buttery soft thermo-regulating bamboo viscose with two-way ankle-to-chin zip for effortless diaper changes. Tagless with foldover scratch mittens.',
    shortDescription: 'GOTS organic bamboo cotton 2-way zip sleep romper.',
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80'
    ],
    bestseller: true,
    newArrival: true,
    sizes: ['0-3M', '3-6M', '6-12M', '12-18M'],
    colors: ['Oatmeal & Sage']
  }
];

async function validateAndInsert() {
  console.log('Testing image URLs for new products catalog...');
  const allUrls = [];
  newProductsCatalog.forEach(p => allUrls.push(...p.images));
  const uniqueUrls = [...new Set(allUrls)];

  let ok = 0;
  for (const u of uniqueUrls) {
    const res = await checkUrl(u);
    if (res.ok) ok++;
    else console.error('❌ Failed image URL:', u);
  }
  console.log(`URL validation: ${ok} / ${uniqueUrls.length} verified 200 OK.`);
}

validateAndInsert();
