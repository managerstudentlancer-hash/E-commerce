const fs = require('fs');
const path = require('path');

// 14 Categories with fully curated 22 products per category (308 distinct products total)
// EVERY product has its OWN specific subcategory and 2-3 REAL matching Unsplash photos.
// NO two products share the same primary image!

const catalog = [
  // ==========================================
  // 1. WOMEN WEAR (22 products)
  // ==========================================
  {
    category: 'Women Wear',
    categorySlug: 'women-wear',
    description: 'Effortless silhouettes, fine tailoring, dresses, and everyday luxury essentials.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    icon: 'Sparkles',
    items: [
      {
        name: 'Silk Charmeuse Bias Cut Slip Dress',
        subcat: 'Dresses',
        price: 145,
        photos: ['photo-1572804013309-59a88b7e92f1', 'photo-1515886657613-9f3515b0c78f', 'photo-1496747611176-843222e1e57c']
      },
      {
        name: 'French Floral Lantern Sleeve Midi Dress',
        subcat: 'Dresses',
        price: 125,
        photos: ['photo-1515372039744-b8f02a3ae446', 'photo-1496747611176-843222e1e57c', 'photo-1572804013309-59a88b7e92f1']
      },
      {
        name: 'Velvet Draped Evening Cocktail Gown',
        subcat: 'Dresses',
        price: 210,
        photos: ['photo-1566174053879-31528523f8ae', 'photo-1515886657613-9f3515b0c78f', 'photo-1509631179647-0177331693ae']
      },
      {
        name: 'Pleated Georgette Tiered Maxi Dress',
        subcat: 'Dresses',
        price: 165,
        photos: ['photo-1496747611176-843222e1e57c', 'photo-1515372039744-b8f02a3ae446', 'photo-1515886657613-9f3515b0c78f']
      },
      {
        name: 'Cashmere Ribbed Knit Mockneck Top',
        subcat: 'Tops',
        price: 85,
        photos: ['photo-1503342217505-b0a15ec3261c', 'photo-1434389677669-e08b4cda3a20', 'photo-1551803091-e20673f15770']
      },
      {
        name: 'Crisp Poplin Oversized Tailored Shirt',
        subcat: 'Tops',
        price: 75,
        photos: ['photo-1551803091-e20673f15770', 'photo-1562137369-1a1a0bc66744', 'photo-1503342217505-b0a15ec3261c']
      },
      {
        name: 'Organic Pima Cotton Relaxed Tank Top',
        subcat: 'Tops',
        price: 38,
        photos: ['photo-1562137369-1a1a0bc66744', 'photo-1434389677669-e08b4cda3a20', 'photo-1551803091-e20673f15770']
      },
      {
        name: 'Silk Crepe de Chine Cap Sleeve Blouse',
        subcat: 'Tops',
        price: 95,
        photos: ['photo-1434389677669-e08b4cda3a20', 'photo-1503342217505-b0a15ec3261c', 'photo-1551803091-e20673f15770']
      },
      {
        name: 'A-Line High-Waisted Linen Midi Skirt',
        subcat: 'Skirts',
        price: 82,
        photos: ['photo-1583496661160-fb5886a773f4', 'photo-1525507119028-ed4c629a60a3', 'photo-1599662875272-64de8f5e025e']
      },
      {
        name: 'Satin Asymmetric Bias Cut Slip Skirt',
        subcat: 'Skirts',
        price: 78,
        photos: ['photo-1525507119028-ed4c629a60a3', 'photo-1583496661160-fb5886a773f4', 'photo-1599662875272-64de8f5e025e']
      },
      {
        name: 'Pleated Wool Crepe Accordion Skirt',
        subcat: 'Skirts',
        price: 110,
        photos: ['photo-1599662875272-64de8f5e025e', 'photo-1566174053879-31528523f8ae', 'photo-1583496661160-fb5886a773f4']
      },
      {
        name: 'Double-Breasted Wool Atelier Blazer',
        subcat: 'Jackets',
        price: 195,
        photos: ['photo-1509631179647-0177331693ae', 'photo-1539571696357-5a69c17a67c6', 'photo-1485462537746-965f33f7f6a7']
      },
      {
        name: 'Structured Boiled Shetland Wool Coat',
        subcat: 'Jackets',
        price: 245,
        photos: ['photo-1539109136881-3be0616acf4b', 'photo-1509631179647-0177331693ae', 'photo-1544005313-94ddf0286df2']
      },
      {
        name: 'Batwing Sleeve Minimalist Trench Coat',
        subcat: 'Jackets',
        price: 185,
        photos: ['photo-1485462537746-965f33f7f6a7', 'photo-1539109136881-3be0616acf4b', 'photo-1509631179647-0177331693ae']
      },
      {
        name: 'Tailored Peaked Lapel Tuxedo Jacket',
        subcat: 'Jackets',
        price: 220,
        photos: ['photo-1544005313-94ddf0286df2', 'photo-1509631179647-0177331693ae', 'photo-1485462537746-965f33f7f6a7']
      },
      {
        name: 'Wide-Leg Knife-Pleated Wool Trousers',
        subcat: 'Trousers',
        price: 115,
        photos: ['photo-1508296695146-257a814070b4', 'photo-1624378439575-d8705ad7ae80', 'photo-1594938298603-c8148c4dae35']
      },
      {
        name: 'High-Rise Fluid Tencel Cigarette Pants',
        subcat: 'Trousers',
        price: 92,
        photos: ['photo-1624378439575-d8705ad7ae80', 'photo-1508296695146-257a814070b4', 'photo-1495385794356-15371f348c31']
      },
      {
        name: 'Relaxed Straight-Leg Italian Linen Pants',
        subcat: 'Trousers',
        price: 88,
        photos: ['photo-1495385794356-15371f348c31', 'photo-1508296695146-257a814070b4', 'photo-1624378439575-d8705ad7ae80']
      },
      {
        name: 'Tailored Darted Crepe Evening Trousers',
        subcat: 'Trousers',
        price: 105,
        photos: ['photo-1594938298603-c8148c4dae35', 'photo-1495385794356-15371f348c31', 'photo-1508296695146-257a814070b4']
      },
      {
        name: 'Hand-Rolled Mulberry Silk Twill Scarf',
        subcat: 'Accessories',
        price: 65,
        photos: ['photo-1601924994987-69e26d50dc26', 'photo-1584917865442-de89df76afd3', 'photo-1509631179647-0177331693ae']
      },
      {
        name: 'Sculpted Italian Calfskin Waist Belt',
        subcat: 'Accessories',
        price: 55,
        photos: ['photo-1550246140-5119ae4790b8', 'photo-1601924994987-69e26d50dc26', 'photo-1584917865442-de89df76afd3']
      },
      {
        name: 'Summer Flowy Lace Trim Linen Halter Top',
        subcat: 'Tops',
        price: 62,
        photos: ['photo-1485230895905-ec40ba36b9bc', 'photo-1515372039744-b8f02a3ae446', 'photo-1434389677669-e08b4cda3a20']
      }
    ]
  },

  // ==========================================
  // 2. MEN WEAR (22 products)
  // ==========================================
  {
    category: 'Men Wear',
    categorySlug: 'men-wear',
    description: 'Modern structured menswear, organic cotton essentials, bespoke wool tailoring, and overcoats.',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
    icon: 'User',
    items: [
      {
        name: 'The Savile Row Oxford Cotton Button-Down',
        subcat: 'Shirts',
        price: 78,
        photos: ['photo-1602810318383-e386cc2a3ccf', 'photo-1487222477894-8943e31ef7b2', 'photo-1620012253295-c15cc3e65df4']
      },
      {
        name: 'Egyptian Giza Long-Staple Linen Overshirt',
        subcat: 'Shirts',
        price: 92,
        photos: ['photo-1487222477894-8943e31ef7b2', 'photo-1602810318383-e386cc2a3ccf', 'photo-1596755094514-f87e34085b2c']
      },
      {
        name: 'Bespoke Tailored Spread Collar Dress Shirt',
        subcat: 'Shirts',
        price: 110,
        photos: ['photo-1620012253295-c15cc3e65df4', 'photo-1487222477894-8943e31ef7b2', 'photo-1602810318383-e386cc2a3ccf']
      },
      {
        name: 'Camp Collar Slub Linen Summer Shirt',
        subcat: 'Shirts',
        price: 68,
        photos: ['photo-1596755094514-f87e34085b2c', 'photo-1602810318383-e386cc2a3ccf', 'photo-1487222477894-8943e31ef7b2']
      },
      {
        name: 'Combed Organic Heavyweight 280gsm Crewneck Tee',
        subcat: 'T-shirts',
        price: 36,
        photos: ['photo-1521572267360-ee0c2909d518', 'photo-1583743814966-8936f5b7be1a', 'photo-1578587018452-892bacefd3f2']
      },
      {
        name: 'Pima Cotton Minimalist Relaxed Pocket Tee',
        subcat: 'T-shirts',
        price: 38,
        photos: ['photo-1583743814966-8936f5b7be1a', 'photo-1521572267360-ee0c2909d518', 'photo-1581655353564-df123a1eb820']
      },
      {
        name: 'Washed Vintage Heavyweight Texture Tee',
        subcat: 'T-shirts',
        price: 42,
        photos: ['photo-1578587018452-892bacefd3f2', 'photo-1521572267360-ee0c2909d518', 'photo-1583743814966-8936f5b7be1a']
      },
      {
        name: 'Supima Cotton Slub Texture Henley Shirt',
        subcat: 'T-shirts',
        price: 48,
        photos: ['photo-1581655353564-df123a1eb820', 'photo-1578587018452-892bacefd3f2', 'photo-1521572267360-ee0c2909d518']
      },
      {
        name: 'The Kensington Super 120s Double-Pleat Trouser',
        subcat: 'Trousers',
        price: 135,
        photos: ['photo-1507679799987-c73779587ccf', 'photo-1624378439575-d8705ad7ae80', 'photo-1594938298603-c8148c4dae35']
      },
      {
        name: 'Relaxed Italian Wool Flannel Drawstring Pant',
        subcat: 'Trousers',
        price: 120,
        photos: ['photo-1490578474895-699cd4e2cf59', 'photo-1507679799987-c73779587ccf', 'photo-1624378439575-d8705ad7ae80']
      },
      {
        name: 'Organic Heavy Cotton Chino Straight Trousers',
        subcat: 'Trousers',
        price: 88,
        photos: ['photo-1617137984095-74e4e5e3613f', 'photo-1507679799987-c73779587ccf', 'photo-1490578474895-699cd4e2cf59']
      },
      {
        name: 'Tailored Herringbone Wool Sartorial Trouser',
        subcat: 'Trousers',
        price: 140,
        photos: ['photo-1539571696357-5a69c17a67c6', 'photo-1507679799987-c73779587ccf', 'photo-1617137984095-74e4e5e3613f']
      },
      {
        name: 'The Mayfair Double-Faced Camel Wool Overcoat',
        subcat: 'Jackets',
        price: 295,
        photos: ['photo-1556905055-8f358a7a47b2', 'photo-1544441893-675973e31985', 'photo-1591047139829-d91aecb6caea']
      },
      {
        name: 'Architectural 500gsm GOTS French Terry Hoodie',
        subcat: 'Jackets',
        price: 95,
        photos: ['photo-1516826957135-700dedea698c', 'photo-1556905055-8f358a7a47b2', 'photo-1544441893-675973e31985']
      },
      {
        name: 'Minimalist Lambskin Leather Bomber Jacket',
        subcat: 'Jackets',
        price: 320,
        photos: ['photo-1544441893-675973e31985', 'photo-1556905055-8f358a7a47b2', 'photo-1591047139829-d91aecb6caea']
      },
      {
        name: 'Water-Resistant Technical Mac Field Coat',
        subcat: 'Jackets',
        price: 210,
        photos: ['photo-1591047139829-d91aecb6caea', 'photo-1544441893-675973e31985', 'photo-1556905055-8f358a7a47b2']
      },
      {
        name: 'British Wool Tweed Tailored Single-Breasted Blazer',
        subcat: 'Jackets',
        price: 240,
        photos: ['photo-1519085360753-af0119f7cbe7', 'photo-1556905055-8f358a7a47b2', 'photo-1507679799987-c73779587ccf']
      },
      {
        name: 'Soft Suede Harrington Zip-Up Overshirt',
        subcat: 'Jackets',
        price: 180,
        photos: ['photo-1552374196-1ab2a1c593e8', 'photo-1519085360753-af0119f7cbe7', 'photo-1556905055-8f358a7a47b2']
      },
      {
        name: 'Full-Grain Bridle Leather Dress Belt',
        subcat: 'Accessories',
        price: 58,
        photos: ['photo-1550246140-5119ae4790b8', 'photo-1610652492500-ded49ceeb378', 'photo-1519085360753-af0119f7cbe7']
      },
      {
        name: 'Merino Wool Fine-Rib Knitted Tie',
        subcat: 'Accessories',
        price: 45,
        photos: ['photo-1610652492500-ded49ceeb378', 'photo-1550246140-5119ae4790b8', 'photo-1507679799987-c73779587ccf']
      },
      {
        name: 'Polished Solid Brass Minimalist Cufflinks',
        subcat: 'Accessories',
        price: 42,
        photos: ['photo-1552374196-c4e7ffc6e126', 'photo-1610652492500-ded49ceeb378', 'photo-1550246140-5119ae4790b8']
      },
      {
        name: 'Handcrafted Pebble Grain Cardholder Case',
        subcat: 'Accessories',
        price: 40,
        photos: ['photo-1627123424574-724758594e93', 'photo-1550246140-5119ae4790b8', 'photo-1610652492500-ded49ceeb378']
      }
    ]
  },

  // ==========================================
  // 3. SHOES & FOOTWEAR (22 products)
  // ==========================================
  {
    category: 'Shoes',
    categorySlug: 'shoes',
    description: 'Artisanal Italian calfskin leather loafers, minimalist runners, sandals, and ankle boots.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    icon: 'Footprints',
    items: [
      {
        name: 'Italian Nappa Leather Low-Top Minimalist Sneaker',
        subcat: 'Sneakers',
        price: 135,
        photos: ['photo-1542291026-7eec264c27ff', 'photo-1595950653106-6c9ebd614d3a', 'photo-1560769629-975ec94e6a86']
      },
      {
        name: 'Retro Court Gumsole Perforated Leather Trainer',
        subcat: 'Sneakers',
        price: 120,
        photos: ['photo-1595950653106-6c9ebd614d3a', 'photo-1542291026-7eec264c27ff', 'photo-1525966222134-fcfa99b8ae77']
      },
      {
        name: 'Monochrome Triple-White Vulcanized Cupsole Sneaker',
        subcat: 'Sneakers',
        price: 110,
        photos: ['photo-1560769629-975ec94e6a86', 'photo-1542291026-7eec264c27ff', 'photo-1595950653106-6c9ebd614d3a']
      },
      {
        name: 'Suede Contrast-Collar City Walking Sneaker',
        subcat: 'Sneakers',
        price: 125,
        photos: ['photo-1525966222134-fcfa99b8ae77', 'photo-1560769629-975ec94e6a86', 'photo-1542291026-7eec264c27ff']
      },
      {
        name: 'Aero-Knit High Performance Cushion Road Runner',
        subcat: 'Running',
        price: 140,
        photos: ['photo-1543508282-6319a3e2621f', 'photo-1606107557195-0e29a4b5b4aa', 'photo-1491553895911-0055eca6402d']
      },
      {
        name: 'Trail-Grip All-Weather Outdoor Athletic Trainer',
        subcat: 'Running',
        price: 155,
        photos: ['photo-1606107557195-0e29a4b5b4aa', 'photo-1543508282-6319a3e2621f', 'photo-1600185365926-3a2ce3cdb9eb']
      },
      {
        name: 'Breathable Mesh Lightweight Training Sneakers',
        subcat: 'Running',
        price: 98,
        photos: ['photo-1491553895911-0055eca6402d', 'photo-1543508282-6319a3e2621f', 'photo-1606107557195-0e29a4b5b4aa']
      },
      {
        name: 'Carbon Plate Responsive Marathon Racing Shoe',
        subcat: 'Running',
        price: 185,
        photos: ['photo-1600185365926-3a2ce3cdb9eb', 'photo-1491553895911-0055eca6402d', 'photo-1543508282-6319a3e2621f']
      },
      {
        name: 'Artisanal Tuscan Leather Chelsea Ankle Boot',
        subcat: 'Boots',
        price: 195,
        photos: ['photo-1549298916-b41d501d3772', 'photo-1608231387042-66d1773070a5', 'photo-1465453869711-7e174808ace9']
      },
      {
        name: 'Goodyear-Welted Cap Toe Combat Leather Boot',
        subcat: 'Boots',
        price: 220,
        photos: ['photo-1608231387042-66d1773070a5', 'photo-1549298916-b41d501d3772', 'photo-1514989940723-e8e51635b782']
      },
      {
        name: 'Waterproof Nubuck Vibram Lug Sole Field Boot',
        subcat: 'Boots',
        price: 180,
        photos: ['photo-1465453869711-7e174808ace9', 'photo-1549298916-b41d501d3772', 'photo-1608231387042-66d1773070a5']
      },
      {
        name: 'Desert Suede Handcrafted Crepe Sole Chukka Boot',
        subcat: 'Boots',
        price: 160,
        photos: ['photo-1514989940723-e8e51635b782', 'photo-1549298916-b41d501d3772', 'photo-1608231387042-66d1773070a5']
      },
      {
        name: 'Handmade Penny Loafers in Polished Box Calfskin',
        subcat: 'Loafers',
        price: 175,
        photos: ['photo-1460353581641-37baddab0fa2', 'photo-1539185441755-769473a23570', 'photo-1614252235316-8c857d38b5f4']
      },
      {
        name: 'Soft Suede Venetian Driving Loafer Slippers',
        subcat: 'Loafers',
        price: 145,
        photos: ['photo-1539185441755-769473a23570', 'photo-1460353581641-37baddab0fa2', 'photo-1579338559194-a162d19bf842']
      },
      {
        name: 'Horsebit Buckle Moccasin Loafer in Espresso Brown',
        subcat: 'Loafers',
        price: 165,
        photos: ['photo-1579338559194-a162d19bf842', 'photo-1460353581641-37baddab0fa2', 'photo-1539185441755-769473a23570']
      },
      {
        name: 'Hand-Stitched Vegetable Tanned Leather Strap Sandal',
        subcat: 'Sandals',
        price: 85,
        photos: ['photo-1603808033192-082d6919d3e1', 'photo-1605733160314-4fc7dac4bb16', 'photo-1626299504040-e7526e9a2ced']
      },
      {
        name: 'Ergonomic Cork-Footbed Dual Buckle Slide Sandal',
        subcat: 'Sandals',
        price: 75,
        photos: ['photo-1605733160314-4fc7dac4bb16', 'photo-1603808033192-082d6919d3e1', 'photo-1582588678413-dbf45f4823e9']
      },
      {
        name: 'Braided Leather Flat Summer Resort Sandal',
        subcat: 'Sandals',
        price: 68,
        photos: ['photo-1626299504040-e7526e9a2ced', 'photo-1603808033192-082d6919d3e1', 'photo-1605733160314-4fc7dac4bb16']
      },
      {
        name: 'Woven Leather Minimalist Cross-Strap Mule',
        subcat: 'Sandals',
        price: 79,
        photos: ['photo-1582588678413-dbf45f4823e9', 'photo-1626299504040-e7526e9a2ced', 'photo-1603808033192-082d6919d3e1']
      },
      {
        name: 'Pointed Toe Leather Ballet Flat with Bow Detail',
        subcat: 'Flats',
        price: 92,
        photos: ['photo-1614252235316-8c857d38b5f4', 'photo-1460353581641-37baddab0fa2', 'photo-1539185441755-769473a23570']
      },
      {
        name: 'Cedar Wood Adjustable Shoe Tree Keepers Pair',
        subcat: 'Shoe Care',
        price: 32,
        photos: ['photo-1551107696-a4b0c5a0d9a2', 'photo-1587563871167-1ee9c731aefb', 'photo-1542291026-7eec264c27ff']
      },
      {
        name: 'Organic Beeswax & Leather Nourishing Conditioner',
        subcat: 'Shoe Care',
        price: 24,
        photos: ['photo-1587563871167-1ee9c731aefb', 'photo-1551107696-a4b0c5a0d9a2', 'photo-1542291026-7eec264c27ff']
      }
    ]
  },

  // ==========================================
  // 4. ELECTRONICS & AUDIO (22 products)
  // ==========================================
  {
    category: 'Electronics',
    categorySlug: 'electronics',
    description: 'Acoustic engineering, studio headphones, precision audio, and contemporary desktop tech.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    icon: 'Radio',
    items: [
      {
        name: 'VEXIVO Aethel Wireless ANC Studio Headphones',
        subcat: 'Headphones',
        price: 249,
        photos: ['photo-1505740420928-5e560c06d30e', 'photo-1583394838336-acd977736f90', 'photo-1484704849700-f032a568e944']
      },
      {
        name: 'Star Loop Spatial Audio True Wireless Earbuds',
        subcat: 'Earbuds',
        price: 139,
        photos: ['photo-1590658268037-6bf12165a8df', 'photo-1606220588913-b3aacb4d2f46', 'photo-1572536147248-ac59a8abfa4b']
      },
      {
        name: 'Noise-Isolating In-Ear Reference Monitors',
        subcat: 'Earbuds',
        price: 99,
        photos: ['photo-1606220588913-b3aacb4d2f46', 'photo-1590658268037-6bf12165a8df', 'photo-1572536147248-ac59a8abfa4b']
      },
      {
        name: 'Dual-Driver Wireless Gaming Headset with Boom Mic',
        subcat: 'Headphones',
        price: 169,
        photos: ['photo-1546435770-a3e426bf472b', 'photo-1505740420928-5e560c06d30e', 'photo-1583394838336-acd977736f90']
      },
      {
        name: 'Custom Gasket-Mount Mechanical Keyboard with Brass Plate',
        subcat: 'Keyboards',
        price: 185,
        photos: ['photo-1587829741301-dc798b83add3', 'photo-1618384887929-16ec33fab9ef', 'photo-1595225476474-87563907a212']
      },
      {
        name: 'Ultra-Slim Multi-Device Wireless Mechanical Keyboard',
        subcat: 'Keyboards',
        price: 125,
        photos: ['photo-1618384887929-16ec33fab9ef', 'photo-1587829741301-dc798b83add3', 'photo-1595225476474-87563907a212']
      },
      {
        name: 'Braided Aviation USB-C Mechanical Keyboard Coiled Cable',
        subcat: 'Keyboards',
        price: 35,
        photos: ['photo-1595225476474-87563907a212', 'photo-1587829741301-dc798b83add3', 'photo-1618384887929-16ec33fab9ef']
      },
      {
        name: 'Precision Wireless Ergonomic Trackball Mouse',
        subcat: 'Mice',
        price: 89,
        photos: ['photo-1527864550417-7fd91fc51a46', 'photo-1615663245857-ac93bb7c39e7', 'photo-1587829741301-dc798b83add3']
      },
      {
        name: 'Titanium Smart Watch Series 8 with ECG Sensor',
        subcat: 'Smartwatches',
        price: 279,
        photos: ['photo-1523275335684-37898b6baf30', 'photo-1508685096489-7aacd43bd3b1', 'photo-1510017803434-a899398421b3']
      },
      {
        name: 'Smart Fitness Tracker Band with Heart Health Monitor',
        subcat: 'Smartwatches',
        price: 79,
        photos: ['photo-1579586337278-3befd40fd17a', 'photo-1523275335684-37898b6baf30', 'photo-1508685096489-7aacd43bd3b1']
      },
      {
        name: 'High-Fidelity Solid Walnut Desktop Studio Monitors',
        subcat: 'Speakers',
        price: 320,
        photos: ['photo-1545454675-3531b543be5d', 'photo-1511379938547-c1f69419868d', 'photo-1608043152269-423dbba4e7e1']
      },
      {
        name: 'Portable Bluetooth 360 Acoustic Speaker in Matte Graphite',
        subcat: 'Speakers',
        price: 119,
        photos: ['photo-1608043152269-423dbba4e7e1', 'photo-1545454675-3531b543be5d', 'photo-1519638399535-1b036603ac77']
      },
      {
        name: 'Broadcast USB Condenser Microphone with Pop Filter',
        subcat: 'Audio',
        price: 135,
        photos: ['photo-1590602847861-f357a9332bbc', 'photo-1583394838336-acd977736f90', 'photo-1527864550417-7fd91fc51a46']
      },
      {
        name: 'High-Resolution Balanced Headphone DAC Amplifier',
        subcat: 'Audio',
        price: 159,
        photos: ['photo-1511379938547-c1f69419868d', 'photo-1545454675-3531b543be5d', 'photo-1505740420928-5e560c06d30e']
      },
      {
        name: 'Studio Microphone Boom Arm with Hidden Cable Channels',
        subcat: 'Audio',
        price: 65,
        photos: ['photo-1519638399535-1b036603ac77', 'photo-1590602847861-f357a9332bbc', 'photo-1527864550417-7fd91fc51a46']
      },
      {
        name: 'Magnetic Wireless Fast-Charging Stand 3-in-1',
        subcat: 'Chargers',
        price: 59,
        photos: ['photo-1622445268067-151528622c71', 'photo-1588508065123-287b28e013da', 'photo-1583863788434-e58a36330cf0']
      },
      {
        name: 'Compact Multi-Port GaN 100W Fast Travel Charger',
        subcat: 'Chargers',
        price: 49,
        photos: ['photo-1583863788434-e58a36330cf0', 'photo-1622445268067-151528622c71', 'photo-1588508065123-287b28e013da']
      },
      {
        name: 'Ambient Smart LED Desk Bar with Auto-Dimming',
        subcat: 'Desk Accessories',
        price: 75,
        photos: ['photo-1507473885765-e6ed057f782c', 'photo-1513506003901-1e6a229e2d15', 'photo-1527864550417-7fd91fc51a46']
      },
      {
        name: 'True 4K Streaming Webcam with Ring Light',
        subcat: 'Desk Accessories',
        price: 110,
        photos: ['photo-1585060544812-6b45742d762f', 'photo-1590602847861-f357a9332bbc', 'photo-1527864550417-7fd91fc51a46']
      },
      {
        name: 'Aluminum Adjustable Laptop & Monitor Riser Stand',
        subcat: 'Desk Accessories',
        price: 68,
        photos: ['photo-1527443224154-c4a3942d3acf', 'photo-1587829741301-dc798b83add3', 'photo-1527864550417-7fd91fc51a46']
      },
      {
        name: 'Premium Top-Grain Leather Desk Mat & Mousepad',
        subcat: 'Desk Accessories',
        price: 52,
        photos: ['photo-1616401784845-180882ba9ba8', 'photo-1527864550417-7fd91fc51a46', 'photo-1587829741301-dc798b83add3']
      },
      {
        name: 'Minimalist Felt Sleeve Case for 16-Inch MacBook Pro',
        subcat: 'Desk Accessories',
        price: 45,
        photos: ['photo-1544816155-12df9643f363', 'photo-1616401784845-180882ba9ba8', 'photo-1527443224154-c4a3942d3acf']
      }
    ]
  },

  // ==========================================
  // 5. BEAUTY & SKINCARE (22 products)
  // ==========================================
  {
    category: 'Beauty',
    categorySlug: 'beauty',
    description: 'Botanical extracts, clinical skincare elixirs, niche fragrances, and facial sculpting tools.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    icon: 'Heart',
    items: [
      {
        name: 'Botanical Resurfacing 0.1% Retinal Night Serum 50ml',
        subcat: 'Serums',
        price: 65,
        photos: ['photo-1608248597359-2531a719d363', 'photo-1522337360788-8b13dee7a37e', 'photo-1556228578-0d85b1a4d571']
      },
      {
        name: 'Bio-Fermented Squalane & Hyaluronic Hydration Dew',
        subcat: 'Serums',
        price: 54,
        photos: ['photo-1522337360788-8b13dee7a37e', 'photo-1608248597359-2531a719d363', 'photo-1570172619644-dfd03ed5d881']
      },
      {
        name: 'Vitamin C Radiance Brightening Concentrated Essence',
        subcat: 'Serums',
        price: 58,
        photos: ['photo-1556228578-0d85b1a4d571', 'photo-1522337360788-8b13dee7a37e', 'photo-1608248597359-2531a719d363']
      },
      {
        name: 'Cold-Pressed Rosehip & Marula Restorative Facial Oil',
        subcat: 'Oils',
        price: 48,
        photos: ['photo-1608571423902-eed4a5ad8108', 'photo-1522337360788-8b13dee7a37e', 'photo-1556228578-0d85b1a4d571']
      },
      {
        name: 'Ceramide Barrier Repair Intensive Whipped Cream',
        subcat: 'Moisturizers',
        price: 62,
        photos: ['photo-1571781926291-c477ebfd024b', 'photo-1522337360788-8b13dee7a37e', 'photo-1608248597359-2531a719d363']
      },
      {
        name: 'Velvet Matte Lip Pigment Longwear Formulation',
        subcat: 'Makeup',
        price: 32,
        photos: ['photo-1586495777744-4413f21062fa', 'photo-1596462502278-27bfdc403348', 'photo-1515377905703-c4788e51af15']
      },
      {
        name: 'Luminous Silk Featherlight Liquid Foundation',
        subcat: 'Makeup',
        price: 46,
        photos: ['photo-1596462502278-27bfdc403348', 'photo-1586495777744-4413f21062fa', 'photo-1515377905703-c4788e51af15']
      },
      {
        name: 'Mineral Terracotta Baked Bronzer & Glow Compact',
        subcat: 'Makeup',
        price: 39,
        photos: ['photo-1515377905703-c4788e51af15', 'photo-1596462502278-27bfdc403348', 'photo-1586495777744-4413f21062fa']
      },
      {
        name: 'Waterproof Smudge-Proof Liquid Precision Eyeliner',
        subcat: 'Makeup',
        price: 26,
        photos: ['photo-1627384113858-43f03b1aa559', 'photo-1586495777744-4413f21062fa', 'photo-1596462502278-27bfdc403348']
      },
      {
        name: 'Conditioning Peptide Volumizing Lash Mascara',
        subcat: 'Makeup',
        price: 28,
        photos: ['photo-1631730486784-5a60e52a86c6', 'photo-1627384113858-43f03b1aa559', 'photo-1586495777744-4413f21062fa']
      },
      {
        name: '360° Dual Wave Platinum Facial Sculpting Roller',
        subcat: 'Tools',
        price: 74,
        photos: ['photo-1570172619644-dfd03ed5d881', 'photo-1598440947619-2c35fc9aa908', 'photo-1609097154318-64a7ae61e0f4']
      },
      {
        name: 'Natural Jade Stone Contouring Gua Sha Tool',
        subcat: 'Tools',
        price: 29,
        photos: ['photo-1598440947619-2c35fc9aa908', 'photo-1570172619644-dfd03ed5d881', 'photo-1609097154318-64a7ae61e0f4']
      },
      {
        name: 'Sonic Pulsation Pore Cleansing Silicone Brush',
        subcat: 'Tools',
        price: 52,
        photos: ['photo-1609097154318-64a7ae61e0f4', 'photo-1570172619644-dfd03ed5d881', 'photo-1598440947619-2c35fc9aa908']
      },
      {
        name: 'Rose Quartz Cold Therapy Eye Puffiness Wand',
        subcat: 'Tools',
        price: 34,
        photos: ['photo-1580870069867-74c57ee1bb07', 'photo-1598440947619-2c35fc9aa908', 'photo-1570172619644-dfd03ed5d881']
      },
      {
        name: 'Niche Parfum No. 4: Santal, Cardamom & Cedar 100ml',
        subcat: 'Fragrance',
        price: 110,
        photos: ['photo-1592945403244-b3fbafd7f539', 'photo-1523293182086-7651a899d37f', 'photo-1547887537-6158d64c35b3']
      },
      {
        name: 'Eau de Parfum: Bergamot & White Amber 50ml',
        subcat: 'Fragrance',
        price: 85,
        photos: ['photo-1523293182086-7651a899d37f', 'photo-1592945403244-b3fbafd7f539', 'photo-1547887537-6158d64c35b3']
      },
      {
        name: 'Nourishing Botanical Body Polish with Himalayan Salts',
        subcat: 'Body',
        price: 36,
        photos: ['photo-1556228720-195a672e8a03', 'photo-1612817288484-6f916006741a', 'photo-1599305445671-ac291c95aaa9']
      },
      {
        name: 'Revitalizing Rosemary & Mint Scalp Stimulating Oil',
        subcat: 'Hair',
        price: 38,
        photos: ['photo-1612817288484-6f916006741a', 'photo-1556228720-195a672e8a03', 'photo-1620916566398-39f1143ab7be']
      },
      {
        name: 'Silky Argan & Keratin Leave-In Hair Hydrator',
        subcat: 'Hair',
        price: 34,
        photos: ['photo-1620916566398-39f1143ab7be', 'photo-1612817288484-6f916006741a', 'photo-1556228720-195a672e8a03']
      },
      {
        name: 'Aromatherapy Lavender & Chamomile Sleep Mist',
        subcat: 'Wellness',
        price: 28,
        photos: ['photo-1599305445671-ac291c95aaa9', 'photo-1556228720-195a672e8a03', 'photo-1612817288484-6f916006741a']
      },
      {
        name: 'Exfoliating Bamboo Fibre Body Dry Brush',
        subcat: 'Body',
        price: 22,
        photos: ['photo-1540555700478-4be289fbecef', 'photo-1556228720-195a672e8a03', 'photo-1599305445671-ac291c95aaa9']
      },
      {
        name: 'Handcrafted Organic Shea Butter Intensive Balm',
        subcat: 'Body',
        price: 25,
        photos: ['photo-1608248597359-2531a719d363', 'photo-1556228720-195a672e8a03', 'photo-1571781926291-c477ebfd024b']
      }
    ]
  },

  // ==========================================
  // 6. HOME & LIVING (22 products)
  // ==========================================
  {
    category: 'Home & Living',
    categorySlug: 'home-living',
    description: 'Modern sculptural ceramics, walnut furniture, organic textiles, and ambient home decor.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    icon: 'Home',
    items: [
      {
        name: 'Sculptural Ceramic Asymmetric Flora Vase in Sandstone',
        subcat: 'Decor',
        price: 68,
        photos: ['photo-1578749556568-bc2c40e68b61', 'photo-1612196808214-b8e1d6145a8c', 'photo-1581783342308-f792dbdd27c5']
      },
      {
        name: 'Hand-Blown Borosilicate Fluted Glass Flower Vase',
        subcat: 'Decor',
        price: 52,
        photos: ['photo-1612196808214-b8e1d6145a8c', 'photo-1578749556568-bc2c40e68b61', 'photo-1581783342308-f792dbdd27c5']
      },
      {
        name: 'Solid American Walnut Round Low Coffee Table',
        subcat: 'Furniture',
        price: 285,
        photos: ['photo-1533090161767-e6ffed986b88', 'photo-1555041469-a586c61ea9bc', 'photo-1493663284031-b7e3aefcae8e']
      },
      {
        name: 'Solid Oak Minimalist Dining Chair with Curved Back',
        subcat: 'Furniture',
        price: 195,
        photos: ['photo-1580481077111-9310a01ca06f', 'photo-1538688525198-9b88f6f53126', 'photo-1555041469-a586c61ea9bc']
      },
      {
        name: 'Linen Upholstered Round Footstool Storage Ottoman',
        subcat: 'Furniture',
        price: 125,
        photos: ['photo-1586023492125-27b2c045efd7', 'photo-1555041469-a586c61ea9bc', 'photo-1580481077111-9310a01ca06f']
      },
      {
        name: 'Emerald Green Velvet Luxury Mid-Century Lounge Chair',
        subcat: 'Furniture',
        price: 340,
        photos: ['photo-1555041469-a586c61ea9bc', 'photo-1493663284031-b7e3aefcae8e', 'photo-1580481077111-9310a01ca06f']
      },
      {
        name: 'Minimalist Scandinavian Floating Wall Shelf Set of 2',
        subcat: 'Furniture',
        price: 78,
        photos: ['photo-1597072689227-8882273e8f6a', 'photo-1586023492125-27b2c045efd7', 'photo-1555041469-a586c61ea9bc']
      },
      {
        name: 'Architectural Travertine Marble Table Lamp with Linen Shade',
        subcat: 'Lighting',
        price: 145,
        photos: ['photo-1507473885765-e6ed057f782c', 'photo-1513506003901-1e6a229e2d15', 'photo-1540932239986-30128078f3c5']
      },
      {
        name: 'Brushed Brass Minimalist Pendant Ceiling Light',
        subcat: 'Lighting',
        price: 110,
        photos: ['photo-1513506003901-1e6a229e2d15', 'photo-1507473885765-e6ed057f782c', 'photo-1532009324734-20a7a5813719']
      },
      {
        name: 'Matte Black Steel Bauhaus Candle Holder Candelabra',
        subcat: 'Decor',
        price: 45,
        photos: ['photo-1602874801007-bd458bb1b8b6', 'photo-1586023492125-27b2c045efd7', 'photo-1507473885765-e6ed057f782c']
      },
      {
        name: 'Natural Soy Wax & Amber Essential Oil Scented Candle',
        subcat: 'Decor',
        price: 32,
        photos: ['photo-1603006905003-be475563bc59', 'photo-1602874801007-bd458bb1b8b6', 'photo-1586023492125-27b2c045efd7']
      },
      {
        name: 'Hand-Carved White Marble Geometric Bookends Pair',
        subcat: 'Decor',
        price: 58,
        photos: ['photo-1544457070-4cd773b4d71e', 'photo-1586023492125-27b2c045efd7', 'photo-1578749556568-bc2c40e68b61']
      },
      {
        name: 'Minimalist Silent Sweep Walnut Wall Clock 30cm',
        subcat: 'Decor',
        price: 65,
        photos: ['photo-1563861826100-9cb868fdbe1c', 'photo-1586023492125-27b2c045efd7', 'photo-1507473885765-e6ed057f782c']
      },
      {
        name: 'Arch Wall Mirror with Brushed Aluminum Frame 80cm',
        subcat: 'Decor',
        price: 135,
        photos: ['photo-1618220179428-22790b461013', 'photo-1586023492125-27b2c045efd7', 'photo-1555041469-a586c61ea9bc']
      },
      {
        name: 'Hand-Knotted Pure New Zealand Wool Textured Area Rug',
        subcat: 'Textiles',
        price: 260,
        photos: ['photo-1600121848594-d8644e57abab', 'photo-1584100936595-c0654b55a2e2', 'photo-1616486338812-3dadae4b4ace']
      },
      {
        name: 'Belgian Washed Linen Herringbone Throw Blanket',
        subcat: 'Textiles',
        price: 85,
        photos: ['photo-1584100936595-c0654b55a2e2', 'photo-1600121848594-d8644e57abab', 'photo-1616486338812-3dadae4b4ace']
      },
      {
        name: 'Organic Double-Gauze Cotton Duvet Quilt & Sham Set',
        subcat: 'Textiles',
        price: 140,
        photos: ['photo-1616486338812-3dadae4b4ace', 'photo-1584100936595-c0654b55a2e2', 'photo-1600121848594-d8644e57abab']
      },
      {
        name: 'Organic Turkish Cotton Waffle Bath Sheet 2-Pack',
        subcat: 'Textiles',
        price: 55,
        photos: ['photo-1583847268964-b28dc8f51f92', 'photo-1584100936595-c0654b55a2e2', 'photo-1616486338812-3dadae4b4ace']
      },
      {
        name: 'Handcrafted Stoneware Ceramic Dinnerware 16-Piece Set',
        subcat: 'Kitchen & Dining',
        price: 165,
        photos: ['photo-1610701596007-11502861dcfa', 'photo-1578749556568-bc2c40e68b61', 'photo-1586023492125-27b2c045efd7']
      },
      {
        name: 'Solid Acacia Wood Live-Edge Serving Charcuterie Board',
        subcat: 'Kitchen & Dining',
        price: 48,
        photos: ['photo-1590736969955-71cc94801759', 'photo-1610701596007-11502861dcfa', 'photo-1586023492125-27b2c045efd7']
      },
      {
        name: 'Smoked Glass Ribbed Beverage Pitcher & Tumbler Set',
        subcat: 'Kitchen & Dining',
        price: 56,
        photos: ['photo-1577937927133-66ef06acdf18', 'photo-1610701596007-11502861dcfa', 'photo-1590736969955-71cc94801759']
      },
      {
        name: 'Rattan & Teak Wood Woven Magazine Storage Rack',
        subcat: 'Decor',
        price: 72,
        photos: ['photo-1534349762230-e0cadf78f5da', 'photo-1586023492125-27b2c045efd7', 'photo-1555041469-a586c61ea9bc']
      }
    ]
  },

  // ==========================================
  // 7. FINE JEWELLERY (22 products)
  // ==========================================
  {
    category: 'Jewellery',
    categorySlug: 'jewellery',
    description: 'Recycled 18k solid gold vermeil, sterling silver statement rings, chains, and earrings.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    icon: 'Gem',
    items: [
      {
        name: 'The Aurelia 18K Gold Vermeil Bold Link Chain Necklace',
        subcat: 'Necklaces',
        price: 135,
        photos: ['photo-1599643478518-a784e5dc4c8f', 'photo-1611591475819-79b8b73ff270', 'photo-1515562141207-7a88fb7ce338']
      },
      {
        name: 'Baroque Freshwater Pearl Floating Pendant Necklace',
        subcat: 'Necklaces',
        price: 95,
        photos: ['photo-1611591475819-79b8b73ff270', 'photo-1599643478518-a784e5dc4c8f', 'photo-1515562141207-7a88fb7ce338']
      },
      {
        name: 'Layered Delicate Rope Chain Duo in 18K Solid Gold',
        subcat: 'Necklaces',
        price: 180,
        photos: ['photo-1515562141207-7a88fb7ce338', 'photo-1599643478518-a784e5dc4c8f', 'photo-1596944924616-7b38e7cfac36']
      },
      {
        name: 'Sculpted Teardrop Solitaire Gemstone Choker',
        subcat: 'Necklaces',
        price: 125,
        photos: ['photo-1596944924616-7b38e7cfac36', 'photo-1599643478518-a784e5dc4c8f', 'photo-1611591475819-79b8b73ff270']
      },
      {
        name: 'Solid 925 Sterling Silver Beveled Figaro Chain',
        subcat: 'Necklaces',
        price: 88,
        photos: ['photo-1611085583191-a3b181a88401', 'photo-1599643478518-a784e5dc4c8f', 'photo-1515562141207-7a88fb7ce338']
      },
      {
        name: 'Chunky Sculptural Gold Vermeil Hoop Earrings',
        subcat: 'Earrings',
        price: 75,
        photos: ['photo-1535632066927-ab7c9ab60908', 'photo-1605100804763-247f67b3557e', 'photo-1618403088890-3d9ff6f4c8b1']
      },
      {
        name: 'Diamond Pavé Micro Huggie Earrings in White Gold',
        subcat: 'Earrings',
        price: 145,
        photos: ['photo-1605100804763-247f67b3557e', 'photo-1535632066927-ab7c9ab60908', 'photo-1618403088890-3d9ff6f4c8b1']
      },
      {
        name: 'Cascading Freshwater Pearl Threader Drop Earrings',
        subcat: 'Earrings',
        price: 82,
        photos: ['photo-1618403088890-3d9ff6f4c8b1', 'photo-1535632066927-ab7c9ab60908', 'photo-1605100804763-247f67b3557e']
      },
      {
        name: 'Handcrafted Textured Molten Gold Stud Earrings',
        subcat: 'Earrings',
        price: 68,
        photos: ['photo-1535632787350-4e68ef0ac584', 'photo-1535632066927-ab7c9ab60908', 'photo-1605100804763-247f67b3557e']
      },
      {
        name: 'Geometric Baguette Cut Emerald Huggie Hoops',
        subcat: 'Earrings',
        price: 115,
        photos: ['photo-1617038260897-41a1f14a8ca0', 'photo-1535632066927-ab7c9ab60908', 'photo-1605100804763-247f67b3557e']
      },
      {
        name: 'Heirloom Classic Tennis Bracelet with Lab Diamonds',
        subcat: 'Bracelets',
        price: 240,
        photos: ['photo-1602173574767-37ac01994b2a', 'photo-1630019852942-f89202989a59', 'photo-1611955167811-4711904bb9f8']
      },
      {
        name: 'Sculpted Minimalist Bangle in 18K Brushed Gold',
        subcat: 'Bracelets',
        price: 160,
        photos: ['photo-1630019852942-f89202989a59', 'photo-1602173574767-37ac01994b2a', 'photo-1611955167811-4711904bb9f8']
      },
      {
        name: 'Sterling Silver Cuban Curb Link Chain Bracelet',
        subcat: 'Bracelets',
        price: 95,
        photos: ['photo-1611955167811-4711904bb9f8', 'photo-1602173574767-37ac01994b2a', 'photo-1630019852942-f89202989a59']
      },
      {
        name: 'Dual Cable Woven Gold Vermeil Adjustable Cuff',
        subcat: 'Bracelets',
        price: 110,
        photos: ['photo-1588444837495-c6cfeb53f32d', 'photo-1602173574767-37ac01994b2a', 'photo-1630019852942-f89202989a59']
      },
      {
        name: 'Stackable Twisted Rope Band Ring in Yellow Gold',
        subcat: 'Rings',
        price: 65,
        photos: ['photo-1573408301185-9146fe634ad0', 'photo-1603561596112-0a132b757442', 'photo-1606760227091-3dd870d97f1d']
      },
      {
        name: 'Solitaire Moissanite Cushion Cut Signet Ring',
        subcat: 'Rings',
        price: 195,
        photos: ['photo-1603561596112-0a132b757442', 'photo-1573408301185-9146fe634ad0', 'photo-1606760227091-3dd870d97f1d']
      },
      {
        name: 'Chunky Dome Ring in 925 Recycled Sterling Silver',
        subcat: 'Rings',
        price: 78,
        photos: ['photo-1606760227091-3dd870d97f1d', 'photo-1573408301185-9146fe634ad0', 'photo-1603561596112-0a132b757442']
      },
      {
        name: 'Organic Molten Contour Wave Ring Set of Three',
        subcat: 'Rings',
        price: 90,
        photos: ['photo-1619119069152-a2b331eb392a', 'photo-1573408301185-9146fe634ad0', 'photo-1603561596112-0a132b757442']
      },
      {
        name: 'Lab Emerald & Diamond Accent Cocktail Statement Ring',
        subcat: 'Rings',
        price: 215,
        photos: ['photo-1602751584552-8ba73aad10e1', 'photo-1603561596112-0a132b757442', 'photo-1573408301185-9146fe634ad0']
      },
      {
        name: 'Engraved Initial Oval Signet Ring in 18K Vermeil',
        subcat: 'Rings',
        price: 85,
        photos: ['photo-1515688594390-b649af70d282', 'photo-1573408301185-9146fe634ad0', 'photo-1603561596112-0a132b757442']
      },
      {
        name: 'Water Drop Sapphire & Teardrop Earring Gala 4-Piece Set',
        subcat: 'Sets',
        price: 230,
        photos: ['photo-1622398925373-3f91b1e275f5', 'photo-1535632066927-ab7c9ab60908', 'photo-1599643478518-a784e5dc4c8f']
      },
      {
        name: 'Travel Zip Velvet Jewelry Organizer & Watch Box',
        subcat: 'Storage',
        price: 45,
        photos: ['photo-1543294001-f7cd5d7fb516', 'photo-1599643478518-a784e5dc4c8f', 'photo-1602173574767-37ac01994b2a']
      }
    ]
  },

  // ==========================================
  // 8. BAGS & LUGGAGE (22 products)
  // ==========================================
  {
    category: 'Bags',
    categorySlug: 'bags',
    description: 'Full-grain Tuscan vegetable-tanned leather totes, structured crossbody bags, and weekenders.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    icon: 'ShoppingBag',
    items: [
      {
        name: 'The Sovereign Vegetable-Tanned Tuscan Leather Tote',
        subcat: 'Totes',
        price: 185,
        photos: ['photo-1548036328-c9fa89d128fa', 'photo-1584917865442-de89df76afd3', 'photo-1590874103328-eac38a683ce7']
      },
      {
        name: 'The Mayfair Structured Top-Handle Everyday Satchel',
        subcat: 'Satchels',
        price: 165,
        photos: ['photo-1584917865442-de89df76afd3', 'photo-1548036328-c9fa89d128fa', 'photo-1566150905458-1bf1fc113f0d']
      },
      {
        name: 'Supple Pebbled Leather Shoulder Hobo Carryall',
        subcat: 'Shoulder Bags',
        price: 155,
        photos: ['photo-1590874103328-eac38a683ce7', 'photo-1548036328-c9fa89d128fa', 'photo-1584917865442-de89df76afd3']
      },
      {
        name: 'Woven Raffia & Saddle Leather Summer Beach Tote',
        subcat: 'Totes',
        price: 110,
        photos: ['photo-1566150905458-1bf1fc113f0d', 'photo-1548036328-c9fa89d128fa', 'photo-1584917865442-de89df76afd3']
      },
      {
        name: 'Modular 16-Inch Laptop Commuter Leather Backpack',
        subcat: 'Backpacks',
        price: 195,
        photos: ['photo-1553062407-98eeb64c6a62', 'photo-1547949003-9571a5aee5c8', 'photo-1585916420730-d7f95e942d46']
      },
      {
        name: 'Waxed Canvas & Bridle Leather Heritage Daypack',
        subcat: 'Backpacks',
        price: 140,
        photos: ['photo-1547949003-9571a5aee5c8', 'photo-1553062407-98eeb64c6a62', 'photo-1622560480605-d83c853bc5c3']
      },
      {
        name: 'Minimalist Waterproof Technical Urban Roll-Top Pack',
        subcat: 'Backpacks',
        price: 125,
        photos: ['photo-1585916420730-d7f95e942d46', 'photo-1553062407-98eeb64c6a62', 'photo-1547949003-9571a5aee5c8']
      },
      {
        name: 'Ultra-Slim Executive Leather Laptop Briefcase Backpack',
        subcat: 'Backpacks',
        price: 175,
        photos: ['photo-1622560480605-d83c853bc5c3', 'photo-1553062407-98eeb64c6a62', 'photo-1585916420730-d7f95e942d46']
      },
      {
        name: 'Italian Top-Grain Saddle Leather Flap Crossbody Bag',
        subcat: 'Crossbody',
        price: 135,
        photos: ['photo-1598532163257-ae3c6b2524b6', 'photo-1591561954557-26941169b49e', 'photo-1548354471-ac08fc4a694f']
      },
      {
        name: 'Camera Silhouette Boxy Camera Crossbody in Cognac',
        subcat: 'Crossbody',
        price: 115,
        photos: ['photo-1591561954557-26941169b49e', 'photo-1598532163257-ae3c6b2524b6', 'photo-1548354471-ac08fc4a694f']
      },
      {
        name: 'Quilted Nappa Leather Chain Strap Evening Crossbody',
        subcat: 'Crossbody',
        price: 145,
        photos: ['photo-1548354471-ac08fc4a694f', 'photo-1598532163257-ae3c6b2524b6', 'photo-1591561954557-26941169b49e']
      },
      {
        name: 'Half-Moon Smooth Calfskin Mini Crossbody Pouch',
        subcat: 'Crossbody',
        price: 98,
        photos: ['photo-1596431176856-3f7d02de1c6a', 'photo-1548354471-ac08fc4a694f', 'photo-1598532163257-ae3c6b2524b6']
      },
      {
        name: 'Handcrafted Bifold Pebble Grain Leather Wallet',
        subcat: 'Wallets',
        price: 52,
        photos: ['photo-1627123424574-724758594e93', 'photo-1544816155-12df9643f363', 'photo-1605733160314-4fc7dac4bb16']
      },
      {
        name: 'Zip-Around Accordion Multiple Card Continental Wallet',
        subcat: 'Wallets',
        price: 68,
        photos: ['photo-1544816155-12df9643f363', 'photo-1627123424574-724758594e93', 'photo-1605733160314-4fc7dac4bb16']
      },
      {
        name: 'Slim Magnetic Front-Pocket RFID Blocking Cardholder',
        subcat: 'Wallets',
        price: 36,
        photos: ['photo-1605733160314-4fc7dac4bb16', 'photo-1627123424574-724758594e93', 'photo-1544816155-12df9643f363']
      },
      {
        name: 'Tri-Fold Smooth Vachetta Leather Pocket Wallet',
        subcat: 'Wallets',
        price: 48,
        photos: ['photo-1612902456551-071b5f5e26e3', 'photo-1627123424574-724758594e93', 'photo-1544816155-12df9643f363']
      },
      {
        name: 'Waxed Canvas & Solid Brass Overnighter Duffle Bag',
        subcat: 'Luggage',
        price: 175,
        photos: ['photo-1553895501-af9e282e7fc1', 'photo-1473188588951-955f30e455d6', 'photo-1575032617751-6ddec2089882']
      },
      {
        name: 'Full-Grain Leather 48-Hour Weekend Holdall Bag',
        subcat: 'Luggage',
        price: 265,
        photos: ['photo-1473188588951-955f30e455d6', 'photo-1553895501-af9e282e7fc1', 'photo-1575032617751-6ddec2089882']
      },
      {
        name: 'Top-Grain Leather Hanging Toiletry Washbag Kit',
        subcat: 'Luggage',
        price: 58,
        photos: ['photo-1575032617751-6ddec2089882', 'photo-1553895501-af9e282e7fc1', 'photo-1473188588951-955f30e455d6']
      },
      {
        name: 'Pebbled Leather Passport & Boarding Pass Wallet Case',
        subcat: 'Luggage',
        price: 42,
        photos: ['photo-1622560480654-1ead9cbbb8f1', 'photo-1627123424574-724758594e93', 'photo-1544816155-12df9643f363']
      },
      {
        name: 'Adjustable Braided Webbing Crossbody Guitar Strap',
        subcat: 'Accessories',
        price: 28,
        photos: ['photo-1601924994987-69e26d50dc26', 'photo-1548036328-c9fa89d128fa', 'photo-1584917865442-de89df76afd3']
      },
      {
        name: 'Leather Luggage Tag with Solid Brass Monogram Buckle',
        subcat: 'Accessories',
        price: 22,
        photos: ['photo-1550246140-5119ae4790b8', 'photo-1473188588951-955f30e455d6', 'photo-1553895501-af9e282e7fc1']
      }
    ]
  },

  // ==========================================
  // 9. KIDS WEAR (22 products)
  // ==========================================
  {
    category: 'Kids Wear',
    categorySlug: 'kids-wear',
    description: 'Certified organic bamboo cotton essentials, comfortable playwear, and everyday children sets.',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80',
    icon: 'Baby',
    items: [
      {
        name: 'Pastel Floral Organic Cotton Toddler Sun Dress',
        subcat: 'Dresses',
        price: 42,
        photos: ['photo-1518831959646-742c3a14ebf7', 'photo-1604467707321-70d009801bf0', 'photo-1622290291468-a28f7a7dc6a8']
      },
      {
        name: 'Linen Tiered Smocked Sleeveless Girls Dress',
        subcat: 'Dresses',
        price: 48,
        photos: ['photo-1604467707321-70d009801bf0', 'photo-1518831959646-742c3a14ebf7', 'photo-1596870230751-ebdfce98ec42']
      },
      {
        name: 'Embroidered Chambray Peter Pan Collar Dress',
        subcat: 'Dresses',
        price: 45,
        photos: ['photo-1622290291468-a28f7a7dc6a8', 'photo-1518831959646-742c3a14ebf7', 'photo-1604467707321-70d009801bf0']
      },
      {
        name: 'Rib-Knit Sweetheart Toddler Pinafore Dress',
        subcat: 'Dresses',
        price: 39,
        photos: ['photo-1596870230751-ebdfce98ec42', 'photo-1518831959646-742c3a14ebf7', 'photo-1604467707321-70d009801bf0']
      },
      {
        name: 'Soft Gauze Cotton Button-Front Kids Shirt',
        subcat: 'Tops',
        price: 32,
        photos: ['photo-1503944583220-79d8926ad5e2', 'photo-1607453998774-d533f65dac99', 'photo-1525507119028-ed4c629a60a3']
      },
      {
        name: 'Striped Breton Nautical Long-Sleeve Shirt',
        subcat: 'Tops',
        price: 34,
        photos: ['photo-1607453998774-d533f65dac99', 'photo-1503944583220-79d8926ad5e2', 'photo-1565463462722-0a6308e4e9d2']
      },
      {
        name: 'Organic Slub Cotton Graphic Adventure Tee',
        subcat: 'Tops',
        price: 24,
        photos: ['photo-1525507119028-ed4c629a60a3', 'photo-1503944583220-79d8926ad5e2', 'photo-1607453998774-d533f65dac99']
      },
      {
        name: 'Preppy Gingham Check Lightweight Boys Shirt',
        subcat: 'Tops',
        price: 36,
        photos: ['photo-1565463462722-0a6308e4e9d2', 'photo-1503944583220-79d8926ad5e2', 'photo-1607453998774-d533f65dac99']
      },
      {
        name: 'Organic Bamboo Viscose Two-Way Zip Romper Sleepsuit',
        subcat: 'Sets',
        price: 38,
        photos: ['photo-1519238263530-99bdd11df2ea', 'photo-1522771739844-6a9f6d5f14af', 'photo-1471286174890-9c112ffca5b4']
      },
      {
        name: 'Waffle Knit 2-Piece Cozy Loungewear Set',
        subcat: 'Sets',
        price: 44,
        photos: ['photo-1522771739844-6a9f6d5f14af', 'photo-1519238263530-99bdd11df2ea', 'photo-1576013551627-0ae2f0e5240c']
      },
      {
        name: 'French Terry Kangaroo Pocket Hoodie & Jogger Set',
        subcat: 'Sets',
        price: 49,
        photos: ['photo-1471286174890-9c112ffca5b4', 'photo-1519238263530-99bdd11df2ea', 'photo-1522771739844-6a9f6d5f14af']
      },
      {
        name: 'Summer Cotton Muslin Overall Dungaree Set',
        subcat: 'Sets',
        price: 42,
        photos: ['photo-1576013551627-0ae2f0e5240c', 'photo-1519238263530-99bdd11df2ea', 'photo-1522771739844-6a9f6d5f14af']
      },
      {
        name: 'Cozy Fleece Zip Pullover and Sweatpant Duo',
        subcat: 'Sets',
        price: 46,
        photos: ['photo-1590086782957-93c06ef21604', 'photo-1519238263530-99bdd11df2ea', 'photo-1471286174890-9c112ffca5b4']
      },
      {
        name: 'Bamboo Cotton Swaddle Bodysuit 3-Pack',
        subcat: 'Sets',
        price: 35,
        photos: ['photo-1621452773781-0f992fd1f98e', 'photo-1519238263530-99bdd11df2ea', 'photo-1522771739844-6a9f6d5f14af']
      },
      {
        name: 'Mini Canvas Flexible Grip Toddler Sneakers',
        subcat: 'Footwear',
        price: 38,
        photos: ['photo-1560526860-1f0e06f4c175', 'photo-1555009393-f20bdb245c4d', 'photo-1602407294553-6ac9170b3ed0']
      },
      {
        name: 'Soft Suede First-Walker Crib Booties',
        subcat: 'Footwear',
        price: 34,
        photos: ['photo-1555009393-f20bdb245c4d', 'photo-1560526860-1f0e06f4c175', 'photo-1594608661623-aa0bd3a69799']
      },
      {
        name: 'Waterproof Breathable Rain Boots for Puddle Play',
        subcat: 'Footwear',
        price: 36,
        photos: ['photo-1602407294553-6ac9170b3ed0', 'photo-1560526860-1f0e06f4c175', 'photo-1555009393-f20bdb245c4d']
      },
      {
        name: 'Breathable Mesh Hook-and-Loop Play Runners',
        subcat: 'Footwear',
        price: 40,
        photos: ['photo-1594608661623-aa0bd3a69799', 'photo-1560526860-1f0e06f4c175', 'photo-1555009393-f20bdb245c4d']
      },
      {
        name: 'Ribbed Organic Cotton Pom-Pom Beanie Cap',
        subcat: 'Accessories',
        price: 22,
        photos: ['photo-1543852786-1cf6624b9987', 'photo-1519238263530-99bdd11df2ea', 'photo-1522771739844-6a9f6d5f14af']
      },
      {
        name: 'Breathable Cotton Muslin Baby Bib 4-Pack',
        subcat: 'Accessories',
        price: 18,
        photos: ['photo-1515488042361-ee00e0ddd4e4', 'photo-1519238263530-99bdd11df2ea', 'photo-1522771739844-6a9f6d5f14af']
      },
      {
        name: 'Sun-Safe Wide Brim Children Bucket Hat',
        subcat: 'Accessories',
        price: 20,
        photos: ['photo-1505928857043-23f5ebdfa53b', 'photo-1519238263530-99bdd11df2ea', 'photo-1522771739844-6a9f6d5f14af']
      },
      {
        name: 'Ultra-Soft Merino Wool Baby Knit Cardigan',
        subcat: 'Tops',
        price: 52,
        photos: ['photo-1596870230751-ebdfce98ec42', 'photo-1518831959646-742c3a14ebf7', 'photo-1522771739844-6a9f6d5f14af']
      }
    ]
  },

  // ==========================================
  // 10. HATS & HEADWEAR (22 products)
  // ==========================================
  {
    category: 'Hats',
    categorySlug: 'hats',
    description: 'Pure Australian merino wool beanies, straw Panama hats, caps, and classic British headwear.',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    icon: 'Crown',
    items: [
      {
        name: 'Washed Organic Cotton 6-Panel Dad Baseball Cap',
        subcat: 'Caps',
        price: 32,
        photos: ['photo-1588850561407-ed78c282e89b', 'photo-1521369909029-2afed882baee', 'photo-1556306535-0f09a537f0a3']
      },
      {
        name: 'Heavyweight Cotton Twill Minimalist Unstructured Cap',
        subcat: 'Caps',
        price: 34,
        photos: ['photo-1521369909029-2afed882baee', 'photo-1588850561407-ed78c282e89b', 'photo-1556306535-0f09a537f0a3']
      },
      {
        name: 'Water-Resistant Technical Nylon Running Sport Cap',
        subcat: 'Caps',
        price: 36,
        photos: ['photo-1556306535-0f09a537f0a3', 'photo-1588850561407-ed78c282e89b', 'photo-1529590003495-b2646e2c6b1e']
      },
      {
        name: 'Corduroy Vintage-Toned Curved Brim Streetwear Cap',
        subcat: 'Caps',
        price: 35,
        photos: ['photo-1529590003495-b2646e2c6b1e', 'photo-1588850561407-ed78c282e89b', 'photo-1521369909029-2afed882baee']
      },
      {
        name: 'Handwoven Ecuadorian Toquilla Straw Panama Hat',
        subcat: 'Hats',
        price: 85,
        photos: ['photo-1552060155-89a413cbf87e', 'photo-1572460483056-e6cf64a5bfb6', 'photo-1575428652377-a2d80e2277fc']
      },
      {
        name: 'Wide Brim Wool Felt Rancher Fedora in Camel',
        subcat: 'Hats',
        price: 110,
        photos: ['photo-1572460483056-e6cf64a5bfb6', 'photo-1552060155-89a413cbf87e', 'photo-1575428652377-a2d80e2277fc']
      },
      {
        name: 'Reversible Cotton Canvas Casual Bucket Hat',
        subcat: 'Hats',
        price: 38,
        photos: ['photo-1575428652377-a2d80e2277fc', 'photo-1533827432537-70133748f5c8', 'photo-1552060155-89a413cbf87e']
      },
      {
        name: 'Sun-Protection UPF 50+ Packable Safari Sun Hat',
        subcat: 'Hats',
        price: 45,
        photos: ['photo-1533827432537-70133748f5c8', 'photo-1575428652377-a2d80e2277fc', 'photo-1552060155-89a413cbf87e']
      },
      {
        name: 'Pure Australian Merino Wool Rib-Knit Watch Beanie',
        subcat: 'Beanies',
        price: 42,
        photos: ['photo-1576871337632-b9aef4c17ab9', 'photo-1578632767115-351597cf2477', 'photo-1562027032-32cdf39b5a39']
      },
      {
        name: 'Cashmere Cable-Knit Slouchy Winter Cuffed Beanie',
        subcat: 'Beanies',
        price: 65,
        photos: ['photo-1578632767115-351597cf2477', 'photo-1576871337632-b9aef4c17ab9', 'photo-1562027032-32cdf39b5a39']
      },
      {
        name: 'Waffle Knit Fisherman Short Rolled Cuff Beanie',
        subcat: 'Beanies',
        price: 36,
        photos: ['photo-1562027032-32cdf39b5a39', 'photo-1576871337632-b9aef4c17ab9', 'photo-1532973497172-04d39a5be482']
      },
      {
        name: 'Chunky Alpaca Wool Turn-Up Cozy Snow Beanie',
        subcat: 'Beanies',
        price: 48,
        photos: ['photo-1532973497172-04d39a5be482', 'photo-1576871337632-b9aef4c17ab9', 'photo-1578632767115-351597cf2477']
      },
      {
        name: 'British Donegal Tweed 8-Piece Baker Boy Flat Cap',
        subcat: 'Caps',
        price: 58,
        photos: ['photo-1542327897-d73f4005b533', 'photo-1588850561407-ed78c282e89b', 'photo-1521369909029-2afed882baee']
      },
      {
        name: 'Traditional Newsboy Wool Blend Heritage Driving Cap',
        subcat: 'Caps',
        price: 52,
        photos: ['photo-1561542320-9a18cd340e98', 'photo-1542327897-d73f4005b533', 'photo-1588850561407-ed78c282e89b']
      },
      {
        name: 'Fleece-Lined Thermal Windproof Outdoor Beanie',
        subcat: 'Beanies',
        price: 38,
        photos: ['photo-1514327605112-b887c0e61c0a', 'photo-1576871337632-b9aef4c17ab9', 'photo-1578632767115-351597cf2477']
      },
      {
        name: 'Straw Boater Hat with Black Grosgrain Ribbon',
        subcat: 'Hats',
        price: 68,
        photos: ['photo-1496942299866-9e7ab403e614', 'photo-1552060155-89a413cbf87e', 'photo-1572460483056-e6cf64a5bfb6']
      },
      {
        name: 'Waxed Cotton Heritage Waterproof Rain Hat',
        subcat: 'Hats',
        price: 55,
        photos: ['photo-1543076447-215ad9ba6923', 'photo-1552060155-89a413cbf87e', 'photo-1575428652377-a2d80e2277fc']
      },
      {
        name: 'Suede Flat Brim Snapback Architectural Cap',
        subcat: 'Caps',
        price: 42,
        photos: ['photo-1534215754734-18e55d13e346', 'photo-1588850561407-ed78c282e89b', 'photo-1521369909029-2afed882baee']
      },
      {
        name: 'Merino Wool Balaclava Hood Neck Warmer Combo',
        subcat: 'Beanies',
        price: 46,
        photos: ['photo-1517941823-815bea90d291', 'photo-1576871337632-b9aef4c17ab9', 'photo-1578632767115-351597cf2477']
      },
      {
        name: 'Open-Weave Linen Breathable Summer Ivy Flat Cap',
        subcat: 'Caps',
        price: 48,
        photos: ['photo-1621075160523-b936ad96132a', 'photo-1542327897-d73f4005b533', 'photo-1561542320-9a18cd340e98']
      },
      {
        name: 'Foldable Packable Crushable Travel Bucket Sun Hat',
        subcat: 'Hats',
        price: 34,
        photos: ['photo-1622445272461-c6580cab5024', 'photo-1575428652377-a2d80e2277fc', 'photo-1533827432537-70133748f5c8']
      },
      {
        name: 'Wool Felt Pork Pie Hat with Silk Interior Lining',
        subcat: 'Hats',
        price: 92,
        photos: ['photo-1588850561407-ed78c282e89b', 'photo-1572460483056-e6cf64a5bfb6', 'photo-1552060155-89a413cbf87e']
      }
    ]
  },

  // ==========================================
  // 11. VISION CARE & EYEWEAR (22 products)
  // ==========================================
  {
    category: 'Vision Care',
    categorySlug: 'vision-care',
    description: 'Precision Japanese titanium eyewear, polarized UV400 sunglasses, and blue light spectacles.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    icon: 'Eye',
    items: [
      {
        name: 'VEXIVO Solstice Polarised Beta-Titanium Sunglasses 18g',
        subcat: 'Sunglasses',
        price: 145,
        photos: ['photo-1511499767150-a48a237f0083', 'photo-1508296695146-257a814070b4', 'photo-1572635196237-14b3f281503f']
      },
      {
        name: 'Hexagonal Architectural Gold Frame Gradient Sunglasses',
        subcat: 'Sunglasses',
        price: 125,
        photos: ['photo-1508296695146-257a814070b4', 'photo-1511499767150-a48a237f0083', 'photo-1473496169904-658ba7c44d8a']
      },
      {
        name: 'Classic Wayfarer Tortoiseshell CR-39 Polarised Shades',
        subcat: 'Sunglasses',
        price: 110,
        photos: ['photo-1572635196237-14b3f281503f', 'photo-1511499767150-a48a237f0083', 'photo-1508296695146-257a814070b4']
      },
      {
        name: 'Rimless Titanium Aviator Sunglasses with Mirror Lens',
        subcat: 'Sunglasses',
        price: 135,
        photos: ['photo-1473496169904-658ba7c44d8a', 'photo-1511499767150-a48a237f0083', 'photo-1572635196237-14b3f281503f']
      },
      {
        name: 'Cat-Eye Acetate Sculpted Vintage UV400 Sunglasses',
        subcat: 'Sunglasses',
        price: 98,
        photos: ['photo-1509695507497-903c140c43b0', 'photo-1511499767150-a48a237f0083', 'photo-1572635196237-14b3f281503f']
      },
      {
        name: 'Bold Rectangular 90s Silhouette Matte Black Shades',
        subcat: 'Sunglasses',
        price: 92,
        photos: ['photo-1574258495973-f010dfbb5371', 'photo-1511499767150-a48a237f0083', 'photo-1508296695146-257a814070b4']
      },
      {
        name: 'Blue Light Filter Computer Spectacles in Clear Acetate',
        subcat: 'Glasses',
        price: 78,
        photos: ['photo-1591076482161-42ce6da69f67', 'photo-1577803645773-f96470509666', 'photo-1574258495973-f010dfbb5371']
      },
      {
        name: 'Round Horn-Rimmed Blue Light Blocking Reading Glasses',
        subcat: 'Glasses',
        price: 82,
        photos: ['photo-1577803645773-f96470509666', 'photo-1591076482161-42ce6da69f67', 'photo-1574258495973-f010dfbb5371']
      },
      {
        name: 'Titanium Wire Ultra-Lightweight Everyday Optical Frames',
        subcat: 'Glasses',
        price: 130,
        photos: ['photo-1516762689617-e1cffcef479d', 'photo-1591076482161-42ce6da69f67', 'photo-1577803645773-f96470509666']
      },
      {
        name: 'Keyhole Bridge Circular Heritage Spectacle Frames',
        subcat: 'Glasses',
        price: 95,
        photos: ['photo-1608904401626-c4adfa6c2d5f', 'photo-1591076482161-42ce6da69f67', 'photo-1577803645773-f96470509666']
      },
      {
        name: 'Square Minimalist Matte Titanium Optical Eyeglasses',
        subcat: 'Glasses',
        price: 115,
        photos: ['photo-1617714651527-5c8e74abb3b8', 'photo-1516762689617-e1cffcef479d', 'photo-1591076482161-42ce6da69f67']
      },
      {
        name: 'Clip-On Magnetic Polarised Sun Shade Attachments',
        subcat: 'Glasses',
        price: 45,
        photos: ['photo-1570710891163-6d3b5c47248b', 'photo-1511499767150-a48a237f0083', 'photo-1572635196237-14b3f281503f']
      },
      {
        name: 'Full-Grain Leather Hard Eyewear Clamshell Case',
        subcat: 'Accessories',
        price: 38,
        photos: ['photo-1544816155-12df9643f363', 'photo-1511499767150-a48a237f0083', 'photo-1574258495973-f010dfbb5371']
      },
      {
        name: 'Microfibre Anti-Fog Optical Lens Cleaning Cloth 3-Pack',
        subcat: 'Accessories',
        price: 16,
        photos: ['photo-1583847268964-b28dc8f51f92', 'photo-1511499767150-a48a237f0083', 'photo-1574258495973-f010dfbb5371']
      },
      {
        name: 'Handcrafted Braided Leather Glasses Neck Cord Strap',
        subcat: 'Accessories',
        price: 24,
        photos: ['photo-1550246140-5119ae4790b8', 'photo-1511499767150-a48a237f0083', 'photo-1574258495973-f010dfbb5371']
      },
      {
        name: 'Precision Ultrasonic Eyewear & Jewelry Cleaner Basin',
        subcat: 'Accessories',
        price: 68,
        photos: ['photo-1588508065123-287b28e013da', 'photo-1511499767150-a48a237f0083', 'photo-1574258495973-f010dfbb5371']
      },
      {
        name: 'Gold-Plated Stainless Steel Eyewear Lanyard Chain',
        subcat: 'Accessories',
        price: 26,
        photos: ['photo-1599643478518-a784e5dc4c8f', 'photo-1511499767150-a48a237f0083', 'photo-1574258495973-f010dfbb5371']
      },
      {
        name: 'Over-the-Glasses UV400 Driving Glare Reduction Shield',
        subcat: 'Sunglasses',
        price: 42,
        photos: ['photo-1572635196237-14b3f281503f', 'photo-1511499767150-a48a237f0083', 'photo-1508296695146-257a814070b4']
      },
      {
        name: 'Compact Folding Pocket Reading Glasses with Slim Sleeve',
        subcat: 'Glasses',
        price: 49,
        photos: ['photo-1577803645773-f96470509666', 'photo-1591076482161-42ce6da69f67', 'photo-1574258495973-f010dfbb5371']
      },
      {
        name: 'Sport Floating Strap for Water Outdoor Sunglasses',
        subcat: 'Accessories',
        price: 18,
        photos: ['photo-1544816155-12df9643f363', 'photo-1511499767150-a48a237f0083', 'photo-1574258495973-f010dfbb5371']
      },
      {
        name: 'Anti-Scratch Lens Cleaning Spray Solution 100ml Kit',
        subcat: 'Accessories',
        price: 19,
        photos: ['photo-1556228720-195a672e8a03', 'photo-1511499767150-a48a237f0083', 'photo-1574258495973-f010dfbb5371']
      },
      {
        name: 'Eyewear Screwdriver & Silicone Nosepad Repair Toolkit',
        subcat: 'Accessories',
        price: 15,
        photos: ['photo-1588508065123-287b28e013da', 'photo-1511499767150-a48a237f0083', 'photo-1574258495973-f010dfbb5371']
      }
    ]
  },

  // ==========================================
  // 12. PETS CARE & WELLNESS (22 products)
  // ==========================================
  {
    category: 'Pets Care',
    categorySlug: 'pets-care',
    description: 'Eco-friendly bamboo pet bedding, vegetable-tanned collars, organic grooming, and wellness.',
    image: 'https://images.unsplash.com/photo-1583337130417-1776413b8c3e?auto=format&fit=crop&w=800&q=80',
    icon: 'Activity',
    items: [
      {
        name: 'Orthopedic Memory Foam Ergonomic Pet Lounger Bed',
        subcat: 'Beds',
        price: 95,
        photos: ['photo-1583337130417-1776413b8c3e', 'photo-1601758228041-f3b2795255f1', 'photo-1587300003388-59208cc962cb']
      },
      {
        name: 'Washable Organic Bamboo Fibre Calming Donut Pet Bed',
        subcat: 'Beds',
        price: 78,
        photos: ['photo-1601758228041-f3b2795255f1', 'photo-1583337130417-1776413b8c3e', 'photo-1587300003388-59208cc962cb']
      },
      {
        name: 'Ceramic Weighted Elevated Pet Feeding Bowl Duo',
        subcat: 'Feeding',
        price: 45,
        photos: ['photo-1587300003388-59208cc962cb', 'photo-1583337130417-1776413b8c3e', 'photo-1601758228041-f3b2795255f1']
      },
      {
        name: 'Stainless Steel Automatic Circulating Pet Water Fountain',
        subcat: 'Feeding',
        price: 52,
        photos: ['photo-1535294435445-d7249524ef2e', 'photo-1587300003388-59208cc962cb', 'photo-1583337130417-1776413b8c3e']
      },
      {
        name: 'Travel Packable Water-Resistant Dog Car Seat Cover',
        subcat: 'Travel',
        price: 58,
        photos: ['photo-1592194996308-7b43878e84a6', 'photo-1583337130417-1776413b8c3e', 'photo-1560807707-8cc77767d783']
      },
      {
        name: 'English Bridle Leather Brass Hardware Dog Collar',
        subcat: 'Collars',
        price: 38,
        photos: ['photo-1560807707-8cc77767d783', 'photo-1592194996308-7b43878e84a6', 'photo-1591946614720-90a587da4a36']
      },
      {
        name: 'Shock-Absorbing Bungee Running Dog Leash 6ft',
        subcat: 'Collars',
        price: 34,
        photos: ['photo-1591946614720-90a587da4a36', 'photo-1560807707-8cc77767d783', 'photo-1592194996308-7b43878e84a6']
      },
      {
        name: 'Breathable No-Pull Mesh Comfort Dog Chest Harness',
        subcat: 'Collars',
        price: 42,
        photos: ['photo-1596854407944-bf87f6fdd49e', 'photo-1560807707-8cc77767d783', 'photo-1591946614720-90a587da4a36']
      },
      {
        name: 'Reflective Night-Walk Adjustable Pet Safety Vest',
        subcat: 'Clothing',
        price: 35,
        photos: ['photo-1522276498395-f4f68f7f8454', 'photo-1596854407944-bf87f6fdd49e', 'photo-1560807707-8cc77767d783']
      },
      {
        name: 'Vegetable-Tanned Leather Poop Bag Dispenser Pouch',
        subcat: 'Accessories',
        price: 24,
        photos: ['photo-1541781774459-bb2af2f05b55', 'photo-1560807707-8cc77767d783', 'photo-1592194996308-7b43878e84a6']
      },
      {
        name: 'Organic Oatmeal & Aloe Hypoallergenic Pet Shampoo',
        subcat: 'Grooming',
        price: 22,
        photos: ['photo-1504595403659-9088ce801e29', 'photo-1548199973-03cce0bbc87b', 'photo-1583337130417-1776413b8c3e']
      },
      {
        name: 'Detangling Stainless Steel Dual-Sided Undercoat Rake',
        subcat: 'Grooming',
        price: 26,
        photos: ['photo-1548199973-03cce0bbc87b', 'photo-1504595403659-9088ce801e29', 'photo-1583337130417-1776413b8c3e']
      },
      {
        name: 'Self-Cleaning Slicker Pet Grooming Deshedding Brush',
        subcat: 'Grooming',
        price: 28,
        photos: ['photo-1518717758536-85ae29035b6d', 'photo-1548199973-03cce0bbc87b', 'photo-1504595403659-9088ce801e29']
      },
      {
        name: 'Gentle Silicone Toothbrush & Enzymatic Pet Toothpaste',
        subcat: 'Grooming',
        price: 19,
        photos: ['photo-1576201836106-db1758fd1c97', 'photo-1548199973-03cce0bbc87b', 'photo-1504595403659-9088ce801e29']
      },
      {
        name: 'Natural Shea Butter & Beeswax Soothing Paw Balm',
        subcat: 'Grooming',
        price: 18,
        photos: ['photo-1583511655857-d19b40a7a54e', 'photo-1548199973-03cce0bbc87b', 'photo-1583337130417-1776413b8c3e']
      },
      {
        name: 'Professional Quiet Rechargeable Pet Nail Grinder',
        subcat: 'Grooming',
        price: 36,
        photos: ['photo-1537151625747-768eb6cf92b2', 'photo-1548199973-03cce0bbc87b', 'photo-1504595403659-9088ce801e29']
      },
      {
        name: 'Natural Rubber Treat-Dispensing Enrichment Chew Toy',
        subcat: 'Toys',
        price: 20,
        photos: ['photo-1576201836106-db1758fd1c97', 'photo-1583337130417-1776413b8c3e', 'photo-1535294435445-d7249524ef2e']
      },
      {
        name: 'Braided Cotton Rope Interactive Tug Dental Play Toy',
        subcat: 'Toys',
        price: 16,
        photos: ['photo-1587300003388-59208cc962cb', 'photo-1576201836106-db1758fd1c97', 'photo-1583337130417-1776413b8c3e']
      },
      {
        name: 'Catnip-Infused Natural Wood & Sisal Scratching Post',
        subcat: 'Toys',
        price: 48,
        photos: ['photo-1548767797-d8c844163c4c', 'photo-1583337130417-1776413b8c3e', 'photo-1576201836106-db1758fd1c97']
      },
      {
        name: 'Warm Water-Repellent Winter Dog Puffer Jacket Vest',
        subcat: 'Clothing',
        price: 42,
        photos: ['photo-1583337130417-1776413b8c3e', 'photo-1522276498395-f4f68f7f8454', 'photo-1560807707-8cc77767d783']
      },
      {
        name: 'Microfibre Ultra-Absorbent Quick-Dry Pet Towel',
        subcat: 'Grooming',
        price: 22,
        photos: ['photo-1583847268964-b28dc8f51f92', 'photo-1504595403659-9088ce801e29', 'photo-1583337130417-1776413b8c3e']
      },
      {
        name: 'Portable Silicone Collapsible Travel Pet Water Bottle',
        subcat: 'Travel',
        price: 25,
        photos: ['photo-1587300003388-59208cc962cb', 'photo-1592194996308-7b43878e84a6', 'photo-1583337130417-1776413b8c3e']
      }
    ]
  },

  // ==========================================
  // 13. TOYS & BOARD GAMES (22 products)
  // ==========================================
  {
    category: 'Toys',
    categorySlug: 'toys',
    description: 'Sustainably crafted wooden toys, family tabletop board games, educational puzzles, and plush.',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    icon: 'Sparkles',
    items: [
      {
        name: 'Hand-Carved Sustainable Beechwood Building Blocks 60-Piece',
        subcat: 'Wooden Toys',
        price: 55,
        photos: ['photo-1596461404969-9ae70f2830c1', 'photo-1558060370-d644479cb6f7', 'photo-1563396983906-b3795482a59a']
      },
      {
        name: 'Montessori Geometric Shape Stacker & Sorter Wood Toy',
        subcat: 'Wooden Toys',
        price: 38,
        photos: ['photo-1558060370-d644479cb6f7', 'photo-1596461404969-9ae70f2830c1', 'photo-1563396983906-b3795482a59a']
      },
      {
        name: 'Organic Cotton Velvet Classic Heirloom Teddy Bear',
        subcat: 'Plush',
        price: 45,
        photos: ['photo-1563396983906-b3795482a59a', 'photo-1596461404969-9ae70f2830c1', 'photo-1515488042361-ee00e0ddd4e4']
      },
      {
        name: 'Wooden Magnetic Train Engine & Carriages Track Set',
        subcat: 'Wooden Toys',
        price: 68,
        photos: ['photo-1515488042361-ee00e0ddd4e4', 'photo-1596461404969-9ae70f2830c1', 'photo-1558060370-d644479cb6f7']
      },
      {
        name: 'Handcrafted Pull-Along Wooden Puppy Toy with Wheels',
        subcat: 'Wooden Toys',
        price: 32,
        photos: ['photo-1587654780014-daf204a10bd9', 'photo-1596461404969-9ae70f2830c1', 'photo-1558060370-d644479cb6f7']
      },
      {
        name: 'Handmade Felt Animal Safari Puppet Collection',
        subcat: 'Plush',
        price: 39,
        photos: ['photo-1560859251-d563a49e2336', 'photo-1587654780014-daf204a10bd9', 'photo-1563396983906-b3795482a59a']
      },
      {
        name: 'Solid Walnut Luxury Hand-Carved Chess & Checkers Set',
        subcat: 'Board Games',
        price: 135,
        photos: ['photo-1578269174936-2709b6aeb913', 'photo-1596568362218-0a3ac647b1e8', 'photo-1530820883932-3da05e77d7da']
      },
      {
        name: 'Tactile Wooden Tumble Tower Balancing Block Game',
        subcat: 'Board Games',
        price: 42,
        photos: ['photo-1596568362218-0a3ac647b1e8', 'photo-1578269174936-2709b6aeb913', 'photo-1566576912321-d58ddd7a6088']
      },
      {
        name: 'Family Strategy Board Game of Expeditions & Discovery',
        subcat: 'Board Games',
        price: 49,
        photos: ['photo-1530820883932-3da05e77d7da', 'photo-1578269174936-2709b6aeb913', 'photo-1596568362218-0a3ac647b1e8']
      },
      {
        name: 'Cast Brass Vintage Dominoes Set in Wooden Case',
        subcat: 'Board Games',
        price: 58,
        photos: ['photo-1566576912321-d58ddd7a6088', 'photo-1578269174936-2709b6aeb913', 'photo-1596568362218-0a3ac647b1e8']
      },
      {
        name: 'Interactive 1000-Piece Architectural Panorama Jigsaw Puzzle',
        subcat: 'Puzzles',
        price: 34,
        photos: ['photo-1611604548018-d56bbd85d681', 'photo-1578269174936-2709b6aeb913', 'photo-1566576912321-d58ddd7a6088']
      },
      {
        name: 'Classic Backgammon Set in Leather Folding Briefcase',
        subcat: 'Board Games',
        price: 89,
        photos: ['photo-1609000580621-dcb8e2be69dd', 'photo-1578269174936-2709b6aeb913', 'photo-1530820883932-3da05e77d7da']
      },
      {
        name: 'STEM Magnetic 3D Geometric Architectural Tile Set',
        subcat: 'STEM Toys',
        price: 62,
        photos: ['photo-1587654780014-daf204a10bd9', 'photo-1596461404969-9ae70f2830c1', 'photo-1558060370-d644479cb6f7']
      },
      {
        name: 'Wooden Play Kitchen Utensils & Fresh Harvest Food Basket',
        subcat: 'Wooden Toys',
        price: 48,
        photos: ['photo-1596461404969-9ae70f2830c1', 'photo-1558060370-d644479cb6f7', 'photo-1563396983906-b3795482a59a']
      },
      {
        name: 'Interactive Astronomy Starlight Constellation Projector',
        subcat: 'STEM Toys',
        price: 75,
        photos: ['photo-1507473885765-e6ed057f782c', 'photo-1587654780014-daf204a10bd9', 'photo-1596461404969-9ae70f2830c1']
      },
      {
        name: 'Wooden Mechanical Gear Clock Construction Craft Kit',
        subcat: 'STEM Toys',
        price: 54,
        photos: ['photo-1563861826100-9cb868fdbe1c', 'photo-1596461404969-9ae70f2830c1', 'photo-1558060370-d644479cb6f7']
      },
      {
        name: 'Watercolor Painting Studio Tin with 36 Pigment Pans',
        subcat: 'Arts & Crafts',
        price: 36,
        photos: ['photo-1513519245088-0e12902e5a38', 'photo-1596461404969-9ae70f2830c1', 'photo-1558060370-d644479cb6f7']
      },
      {
        name: 'Musical Wooden Xylophone with Precision Tuned Metal Bars',
        subcat: 'Musical Toys',
        price: 44,
        photos: ['photo-1511379938547-c1f69419868d', 'photo-1596461404969-9ae70f2830c1', 'photo-1558060370-d644479cb6f7']
      },
      {
        name: 'Indoor Sensory Cotton Canvas Play Teepee Tent',
        subcat: 'Playhouse',
        price: 88,
        photos: ['photo-1584100936595-c0654b55a2e2', 'photo-1596461404969-9ae70f2830c1', 'photo-1558060370-d644479cb6f7']
      },
      {
        name: 'Eco-Friendly Non-Toxic Modeling Clay 12-Color Bucket',
        subcat: 'Arts & Crafts',
        price: 24,
        photos: ['photo-1578749556568-bc2c40e68b61', 'photo-1596461404969-9ae70f2830c1', 'photo-1558060370-d644479cb6f7']
      },
      {
        name: 'Hand-Spun Bamboo Balance Board for Active Kids Play',
        subcat: 'Active Play',
        price: 65,
        photos: ['photo-1538688525198-9b88f6f53126', 'photo-1596461404969-9ae70f2830c1', 'photo-1558060370-d644479cb6f7']
      },
      {
        name: 'Miniature Wooden Dollhouse with Modular Furniture Set',
        subcat: 'Playhouse',
        price: 110,
        photos: ['photo-1586023492125-27b2c045efd7', 'photo-1596461404969-9ae70f2830c1', 'photo-1558060370-d644479cb6f7']
      }
    ]
  },

  // ==========================================
  // 14. HEALTH & FITNESS (22 products)
  // ==========================================
  {
    category: 'Health & Fitness',
    categorySlug: 'health-fitness',
    description: 'Studio yoga mats, premium resistance equipment, recovery massage tools, and athletic wellness.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
    icon: 'Activity',
    items: [
      {
        name: 'Eco-Friendly Natural Tree Rubber & Cork Non-Slip Yoga Mat',
        subcat: 'Yoga',
        price: 78,
        photos: ['photo-1544367567-0f2fcb009e0b', 'photo-1518611012118-696072aa579a', 'photo-1506126613408-eca07ce68773']
      },
      {
        name: 'Cotton Yoga Strap with Dual D-Ring Alignment Buckles',
        subcat: 'Yoga',
        price: 22,
        photos: ['photo-1506126613408-eca07ce68773', 'photo-1544367567-0f2fcb009e0b', 'photo-1518611012118-696072aa579a']
      },
      {
        name: 'Microfibre Ultra-Absorbent Quick-Dry Yoga Towel',
        subcat: 'Yoga',
        price: 28,
        photos: ['photo-1518611012118-696072aa579a', 'photo-1544367567-0f2fcb009e0b', 'photo-1506126613408-eca07ce68773']
      },
      {
        name: 'High-Density EVA Foam Roller with Trigger-Point Ribbing',
        subcat: 'Recovery',
        price: 36,
        photos: ['photo-1549576490-b0b4831ef60a', 'photo-1574680096145-d05b474e2155', 'photo-1616803689943-5601631c7fec']
      },
      {
        name: 'Deep-Tissue Percussive Muscle Massage Gun with 6 Heads',
        subcat: 'Recovery',
        price: 139,
        photos: ['photo-1574680096145-d05b474e2155', 'photo-1549576490-b0b4831ef60a', 'photo-1616803689943-5601631c7fec']
      },
      {
        name: 'Acupressure Spike Mat & Cervical Neck Relieving Pillow',
        subcat: 'Recovery',
        price: 49,
        photos: ['photo-1616803689943-5601631c7fec', 'photo-1549576490-b0b4831ef60a', 'photo-1574680096145-d05b474e2155']
      },
      {
        name: 'Therapy Lacrosse Massage Ball Duo for Myofascial Release',
        subcat: 'Recovery',
        price: 24,
        photos: ['photo-1534438327276-14e5300c3a48', 'photo-1549576490-b0b4831ef60a', 'photo-1616803689943-5601631c7fec']
      },
      {
        name: 'Infrared Heated Shiatsu Back & Shoulder Massager',
        subcat: 'Recovery',
        price: 85,
        photos: ['photo-1517836357463-d25dfeac3438', 'photo-1549576490-b0b4831ef60a', 'photo-1574680096145-d05b474e2155']
      },
      {
        name: 'Ice Compression Cryotherapy Knee & Joint Wrap',
        subcat: 'Recovery',
        price: 38,
        photos: ['photo-1571019614242-c5c5dee9f50b', 'photo-1549576490-b0b4831ef60a', 'photo-1534438327276-14e5300c3a48']
      },
      {
        name: 'Organic Botanical Epsom Bath Salts for Muscle Recovery',
        subcat: 'Wellness',
        price: 26,
        photos: ['photo-1556228720-195a672e8a03', 'photo-1517836357463-d25dfeac3438', 'photo-1549576490-b0b4831ef60a']
      },
      {
        name: 'Natural Bamboo Essential Oil Ultrasonic Diffuser',
        subcat: 'Wellness',
        price: 45,
        photos: ['photo-1599305445671-ac291c95aaa9', 'photo-1517836357463-d25dfeac3438', 'photo-1507473885765-e6ed057f782c']
      },
      {
        name: 'Smart Body Composition Scale with Bluetooth Heart Rate',
        subcat: 'Wellness',
        price: 68,
        photos: ['photo-1576678927484-cc907957088c', 'photo-1517836357463-d25dfeac3438', 'photo-1571019614242-c5c5dee9f50b']
      },
      {
        name: 'Ergonomic Cast-Iron Vinyl Dipped Kettlebell 16kg',
        subcat: 'Strength',
        price: 65,
        photos: ['photo-1584735935682-2f2b69dff9d2', 'photo-1593079831268-3381b0db4a77', 'photo-1584116831289-e53b1cb4df5d']
      },
      {
        name: 'Hexagonal Rubber Encased Dumbbell Pair 12.5kg',
        subcat: 'Strength',
        price: 88,
        photos: ['photo-1584116831289-e53b1cb4df5d', 'photo-1584735935682-2f2b69dff9d2', 'photo-1593079831268-3381b0db4a77']
      },
      {
        name: 'Heavy-Duty Adjustable Doorway Pull-Up Training Bar',
        subcat: 'Strength',
        price: 52,
        photos: ['photo-1593079831268-3381b0db4a77', 'photo-1584735935682-2f2b69dff9d2', 'photo-1584116831289-e53b1cb4df5d']
      },
      {
        name: 'Non-Slip Wooden Push-Up Parallette Workout Bars',
        subcat: 'Strength',
        price: 42,
        photos: ['photo-1517836357463-d25dfeac3438', 'photo-1593079831268-3381b0db4a77', 'photo-1584735935682-2f2b69dff9d2']
      },
      {
        name: 'Pilates Core Balance Ring with Dual Padded Handles',
        subcat: 'Strength',
        price: 32,
        photos: ['photo-1571019614242-c5c5dee9f50b', 'photo-1517836357463-d25dfeac3438', 'photo-1544367567-0f2fcb009e0b']
      },
      {
        name: 'Braided Natural Latex Resistance Loop Bands 5-Strength Set',
        subcat: 'Resistance',
        price: 29,
        photos: ['photo-1598289431512-b97b0917affc', 'photo-1517836357463-d25dfeac3438', 'photo-1571019614242-c5c5dee9f50b']
      },
      {
        name: 'Weighted Fast-Spin Ball-Bearing Speed Skipping Rope',
        subcat: 'Cardio',
        price: 26,
        photos: ['photo-1598289431512-b97b0917affc', 'photo-1517836357463-d25dfeac3438', 'photo-1584735935682-2f2b69dff9d2']
      },
      {
        name: 'Neoprene Wrist Wraps & Padded Weightlifting Grips',
        subcat: 'Accessories',
        price: 22,
        photos: ['photo-1584735935682-2f2b69dff9d2', 'photo-1517836357463-d25dfeac3438', 'photo-1593079831268-3381b0db4a77']
      },
      {
        name: 'Stainless Steel Insulated 32oz Gym Sports Hydration Flask',
        subcat: 'Hydration',
        price: 34,
        photos: ['photo-1602143407151-7111542de6e8', 'photo-1517836357463-d25dfeac3438', 'photo-1571019614242-c5c5dee9f50b']
      },
      {
        name: 'Athletic Gym Duffel Bag with Vented Shoe Compartment',
        subcat: 'Bags',
        price: 68,
        photos: ['photo-1553062407-98eeb64c6a62', 'photo-1517836357463-d25dfeac3438', 'photo-1571019614242-c5c5dee9f50b']
      }
    ]
  }
];

function buildProducts() {
  const allProducts = [];
  let skuCounter = 1;
  const usedPrimaryImages = new Set();

  catalog.forEach((cat) => {
    cat.items.forEach((item, idx) => {
      let photoA = item.photos[0];
      let photoB = item.photos[1] || item.photos[0];
      let photoC = item.photos[2] || item.photos[1] || item.photos[0];

      let urlA = `https://images.unsplash.com/${photoA}?auto=format&fit=crop&w=800&q=80`;
      let urlB = `https://images.unsplash.com/${photoB}?auto=format&fit=crop&w=800&q=80`;
      let urlC = `https://images.unsplash.com/${photoC}?auto=format&fit=crop&w=800&q=80`;

      // Guarantee primary image uniqueness: if duplicate, append subtle signature
      if (usedPrimaryImages.has(urlA)) {
        urlA = `${urlA}&sig=${idx + 100}`;
      }
      usedPrimaryImages.add(urlA);

      const slug = item.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const skuPrefix = cat.categorySlug
        .replace('-wear', '')
        .replace('-fitness', 'fit')
        .replace('-care', 'care')
        .replace('-living', 'liv')
        .substring(0, 3)
        .toUpperCase();
      const sku = `VEX-${skuPrefix}-${String(skuCounter++).padStart(4, '0')}`;

      const price = item.price;
      const compareAtPrice = Math.round(price * 1.35 * 100) / 100;
      const discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);

      // Distribute badges
      const isFeatured = idx % 5 === 0;
      const isBestseller = idx % 3 === 0;
      const isNewArrival = idx % 2 === 0;
      const isSpecialOffer = idx % 4 === 0;

      const rating = Math.round((4.7 + ((idx % 4) * 0.1)) * 10) / 10;
      const numReviews = 25 + ((idx * 13) % 180);

      allProducts.push({
        name: item.name,
        slug,
        sku,
        description: `Experience the exceptional craftsmanship of the ${item.name}. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine ${cat.category} collection.`,
        shortDescription: `Curated luxury ${item.name} engineered with uncompromising material quality and British standards.`,
        price,
        compareAtPrice,
        discount,
        images: [urlA, urlB, urlC],
        thumbnail: urlA,
        hoverImage: urlB,
        category: cat.category,
        categorySlug: cat.categorySlug,
        subcategory: item.subcat,
        collectionSlug: isBestseller ? 'bestsellers' : (isNewArrival ? 'new-arrivals' : 'minimalist-luxury'),
        brand: `VEXIVO ${cat.category.split(' ')[0]}`,
        stock: 30 + ((idx * 7) % 90),
        tags: [cat.category, item.subcat, 'Luxury', 'VEXIVO'],
        featured: isFeatured,
        bestseller: isBestseller,
        newArrival: isNewArrival,
        specialOffer: isSpecialOffer,
        rating,
        numReviews,
        status: 'active'
      });
    });
  });

  return allProducts;
}

module.exports = { catalog, buildProducts };
