const fs = require('fs');
const path = require('path');

// 12 Mandatory Categories with rich subcategories, item descriptions, and REAL Unsplash image photo IDs
const categoriesDef = [
  {
    name: 'Women Wear',
    slug: 'women-wear',
    description: 'Effortless silhouettes, fine tailoring, dresses, and everyday luxury essentials.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    icon: 'Sparkles',
    sortOrder: 1,
    subcategories: [
      { name: 'Dresses', prefix: 'Dress', photos: ['1515886657613-9f3515b0c78f', '1496747611176-843222e1e57c', '1572804013309-59a88b7e92f1', '1515372039744-b8f02a3ae446'] },
      { name: 'Tops', prefix: 'Top', photos: ['1503342217505-b0a15ec3261c', '1434389677669-e08b4cda3a20', '1551803091-e20673f15770', '1562137369-1a1a0bc66744'] },
      { name: 'Skirts', prefix: 'Skirt', photos: ['1583496661160-fb5886a773f4', '1525507119028-ed4c629a60a3', '1599662875272-64de8f5e025e', '1566174053879-31528523f8ae'] },
      { name: 'Jackets', prefix: 'Jacket', photos: ['1509631179647-0177331693ae', '1539571696357-5a69c17a67c6', '1485462537746-965f33f7f6a7', '1544005313-94ddf0286df2'] },
      { name: 'Trousers', prefix: 'Trousers', photos: ['1508296695146-257a814070b4', '1624378439575-d8705ad7ae80', '1594938298603-c8148c4dae35', '1495385794356-15371f348c31'] },
      { name: 'Women Accessories', prefix: 'Silk Scarf', photos: ['1601924994987-69e26d50dc26', '1584917865442-de89df76afd3', '1509631179647-0177331693ae', '1539109136881-3be0616acf4b'] },
    ],
    productNames: [
      'Silk Charmeuse Bias Cut Slip Dress',
      'French Floral Lantern Sleeve Midi Dress',
      'Velvet Draped Evening Cocktail Gown',
      'Pleated Georgette Tiered Maxi Dress',
      'Cashmere Ribbed Knit Mockneck Top',
      'Crisp Poplin Oversized Tailored Shirt',
      'Organic Pima Cotton Relaxed Tank Top',
      'Silk Crepe de Chine Cap Sleeve Blouse',
      'A-Line High-Waisted Linen Midi Skirt',
      'Satin Asymmetric Bias Cut Slip Skirt',
      'Pleated Wool Crepe Accordion Skirt',
      'Denim Contrast-Stitch Flared Midi Skirt',
      'Double-Breasted Wool Atelier Blazer',
      'Structured Boiled Shetland Wool Coat',
      'Batwing Sleeve Minimalist Trench Coat',
      'Tailored Peaked Lapel Tuxedo Jacket',
      'Wide-Leg Knife-Pleated Wool Trousers',
      'High-Rise Fluid Tencel Cigarette Pants',
      'Relaxed Straight-Leg Italian Linen Pants',
      'Tailored Darted Crepe Evening Trousers',
      'Hand-Rolled Silk Twill Heritage Scarf',
      'Sculpted Italian Calfskin Waist Belt',
    ],
  },
  {
    name: 'Men Wear',
    slug: 'men-wear',
    description: 'Modern structured menswear, organic cotton essentials, bespoke wool tailoring, and overcoats.',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
    icon: 'User',
    sortOrder: 2,
    subcategories: [
      { name: 'Shirts', prefix: 'Shirt', photos: ['1602810318383-e386cc2a3ccf', '1487222477894-8943e31ef7b2', '1620012253295-c15cc3e65df4', '1596755094514-f87e34085b2c'] },
      { name: 'T-shirts', prefix: 'Tee', photos: ['1521572267360-ee0c2909d518', '1583743814966-8936f5b7be1a', '1578587018452-892bacefd3f2', '1581655353564-df123a1eb820'] },
      { name: 'Trousers', prefix: 'Trousers', photos: ['1507679799987-c73779587ccf', '1624378439575-d8705ad7ae80', '1594938298603-c8148c4dae35', '1490578474895-699cd4e2cf59'] },
      { name: 'Jackets', prefix: 'Jacket', photos: ['1556905055-8f358a7a47b2', '1544441893-675973e31985', '1591047139829-d91aecb6caea', '1516826957135-700dedea698c'] },
      { name: 'Mens Accessories', prefix: 'Accessory', photos: ['1550246140-5119ae4790b8', '1519085360753-af0119f7cbe7', '1610652492500-ded49ceeb378', '1552374196-1ab2a1c593e8'] },
    ],
    productNames: [
      'The Savile Row Oxford Cotton Button-Down',
      'Egyptian Giza Long-Staple Linen Overshirt',
      'Bespoke Tailored Spread Collar Dress Shirt',
      'Camp Collar Slub Linen Summer Shirt',
      'Combed Organic Heavyweight 280gsm Crewneck Tee',
      'Pima Cotton Minimalist Relaxed Pocket Tee',
      'Washed Vintage Vintage-Feel Graphic Tee',
      'Supima Cotton Slub Texture Henley Shirt',
      'The Kensington Super 120s Double-Pleat Trouser',
      'Relaxed Italian Wool Flannel Drawstring Pant',
      'Organic Heavy Cotton Chino Straight Trousers',
      'Tailored Herringbone Wool Sartorial Trouser',
      'The Mayfair Double-Faced Camel Wool Overcoat',
      'Architectural 500gsm GOTS French Terry Hoodie',
      'Minimalist Lambskin Leather Bomber Jacket',
      'Water-Resistant Technical Mac Field Coat',
      'British Wool Tweed Tailored Single-Breasted Blazer',
      'Soft Suede Harrington Zip-Up Overshirt',
      'Full-Grain Bridle Leather Dress Belt',
      'Merino Wool Fine-Rib Knitted Tie',
      'Polished Solid Brass Minimalist Cufflinks',
      'Handcrafted Pebble Grain Cardholder Case',
    ],
  },
  {
    name: 'Kids Wear',
    slug: 'kids-wear',
    description: 'Certified organic bamboo cotton essentials, comfortable playwear, and everyday children sets.',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80',
    icon: 'Baby',
    sortOrder: 3,
    subcategories: [
      { name: 'Kids Dresses', prefix: 'Dress', photos: ['1518831959646-742c3a14ebf7', '1604467707321-70d009801bf0', '1622290291468-a28f7a7dc6a8', '1596870230751-ebdfce98ec42'] },
      { name: 'Kids Shirts', prefix: 'Shirt', photos: ['1503944583220-79d8926ad5e2', '1607453998774-d533f65dac99', '1525507119028-ed4c629a60a3', '1565463462722-0a6308e4e9d2'] },
      { name: 'Kids Sets', prefix: 'Set', photos: ['1519238263530-99bdd11df2ea', '1522771739844-6a9f6d5f14af', '1471286174890-9c112ffca5b4', '1576013551627-0ae2f0e5240c'] },
      { name: 'Kids Footwear', prefix: 'Shoes', photos: ['1560526860-1f0e06f4c175', '1555009393-f20bdb245c4d', '1602407294553-6ac9170b3ed0', '1594608661623-aa0bd3a69799'] },
    ],
    productNames: [
      'Pastel Floral Organic Cotton Toddler Sun Dress',
      'Linen Tiered Smocked Sleeveless Girls Dress',
      'Embroidered Chambray Peter Pan Collar Dress',
      'Rib-Knit Sweetheart Toddler Pinafore Dress',
      'Soft Gauze Cotton Button-Front Kids Shirt',
      'Striped Breton Nautical Long-Sleeve Shirt',
      'Organic Slub Cotton Graphic Adventure Tee',
      'Preppy Gingham Check Lightweight Boys Shirt',
      'Organic Bamboo Viscose Two-Way Zip Romper Sleepsuit',
      'Waffle Knit 2-Piece Cozy Loungewear Set',
      'French Terry Kangaroo Pocket Hoodie & Jogger Set',
      'Summer Cotton Muslin Overall Dungaree Set',
      'Cozy Fleece Zip Pullover and Sweatpant Duo',
      'Bamboo Cotton Swaddle Bodysuit 3-Pack',
      'Mini Canvas Flexible Grip Toddler Sneakers',
      'Soft Suede First-Walker Crib Booties',
      'Waterproof Breathable Rain Boots for Puddle Play',
      'Breathable Mesh Hook-and-Loop Play Runners',
      'Ribbed Organic Cotton Pom-Pom Beanie Cap',
      'Breathable Cotton Muslin Baby Bib 4-Pack',
      'Sun-Safe Wide Brim Children Bucket Hat',
      'Ultra-Soft Merino Wool Baby Knit Cardigan',
    ],
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    description: 'Artisanal Italian calfskin leather loafers, minimalist runners, sandals, and ankle boots.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    icon: 'Footprints',
    sortOrder: 4,
    subcategories: [
      { name: 'Sneakers', prefix: 'Sneaker', photos: ['1542291026-7eec264c27ff', '1595950653106-6c9ebd614d3a', '1560769629-975ec94e6a86', '1525966222134-fcfa99b8ae77'] },
      { name: 'Sandals', prefix: 'Sandal', photos: ['1603808033192-082d6919d3e1', '1605733160314-4fc7dac4bb16', '1626299504040-e7526e9a2ced', '1582588678413-dbf45f4823e9'] },
      { name: 'Boots', prefix: 'Boot', photos: ['1549298916-b41d501d3772', '1608231387042-66d1773070a5', '1465453869711-7e174808ace9', '1514989940723-e8e51635b782'] },
      { name: 'Flats', prefix: 'Loafer', photos: ['1460353581641-37baddab0fa2', '1539185441755-769473a23570', '1614252235316-8c857d38b5f4', '1579338559194-a162d19bf842'] },
      { name: 'Sports Shoes', prefix: 'Sport', photos: ['1543508282-6319a3e2621f', '1606107557195-0e29a4b5b4aa', '1491553895911-0055eca6402d', '1600185365926-3a2ce3cdb9eb'] },
    ],
    productNames: [
      'Italian Nappa Leather Low-Top Minimalist Sneaker',
      'Retro Court Gumsole Perforated Leather Trainer',
      'Monochrome Triple-White Vulcanized Cupsole Sneaker',
      'Suede Contrast-Collar City Walking Sneaker',
      'Hand-Stitched Vegetable Tanned Leather Strap Sandal',
      'Ergonomic Cork-Footbed Dual Buckle Slide Sandal',
      'Braided Leather Flat Summer Resort Sandal',
      'Woven Leather Minimalist Cross-Strap Mule',
      'Artisanal Tuscan Leather Chelsea Ankle Boot',
      'Goodyear-Welted Cap Toe Combat Leather Boot',
      'Waterproof Nubuck Vibram Lug Sole Field Boot',
      'Desert Suede Handcrafted Crepe Sole Chukka Boot',
      'Handmade Penny Loafers in Polished Box Calfskin',
      'Soft Suede Venetian Driving Loafer Slippers',
      'Pointed Toe Leather Ballet Flat with Bow Detail',
      'Horsebit Buckle Moccasin Loafer in Espresso Brown',
      'Aero-Knit High Performance Cushion Road Runner',
      'Trail-Grip All-Weather Outdoor Athletic Trainer',
      'Breathable Mesh Lightweight Training Sneakers',
      'Carbon Plate Responsive Marathon Racing Shoe',
      'Cedar Wood Adjustable Shoe Tree Keepers',
      'Organic Beeswax & Leather Nourishing Conditioner',
    ],
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    description: 'Botanical extracts, clinical skincare elixirs, niche fragrances, and facial sculpting tools.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    icon: 'Heart',
    sortOrder: 5,
    subcategories: [
      { name: 'Skincare', prefix: 'Serum', photos: ['1522337360788-8b13dee7a37e', '1608248597359-2531a719d363', '1556228578-0d85b1a4d571', '1571781926291-c477ebfd024b'] },
      { name: 'Makeup', prefix: 'Cosmetic', photos: ['1596462502278-27bfdc403348', '1586495777744-4413f21062fa', '1515377905703-c4788e51af15', '1627384113858-43f03b1aa559'] },
      { name: 'Beauty Tools', prefix: 'Tool', photos: ['1570172619644-dfd03ed5d881', '1598440947619-2c35fc9aa908', '1631730486784-5a60e52a86c6', '1609097154318-64a7ae61e0f4'] },
      { name: 'Personal Care', prefix: 'Care', photos: ['1612817288484-6f916006741a', '1580870069867-74c57ee1bb07', '1599305445671-ac291c95aaa9', '1620916566398-39f1143ab7be'] },
    ],
    productNames: [
      'Botanical Resurfacing 0.1% Retinal Night Serum 50ml',
      'Bio-Fermented Squalane & Hyaluronic Hydration Dew',
      'Vitamin C Radiance Brightening Concentrated Essence',
      'Cold-Pressed Rosehip & Marula Restorative Facial Oil',
      'Ceramide Barrier Repair Intensive Whipped Cream',
      'Velvet Matte Lip Pigment Longwear Formulation',
      'Luminous Silk Featherlight Liquid Foundation',
      'Mineral Terracotta Baked Bronzer & Glow Compact',
      'Waterproof Smudge-Proof Liquid Precision Eyeliner',
      'Conditioning Peptide Volumizing Lash Mascara',
      '360° Dual Wave Platinum Facial Sculpting Roller',
      'Natural Jade Stone Contouring Gua Sha Tool',
      'Sonic Pulsation Pore Cleansing Silicone Brush',
      'Rose Quartz Cold Therapy Eye Puffiness Wand',
      'Niche Parfum No. 4: Santal, Cardamom & Cedar 100ml',
      'Eau de Parfum: Bergamot & White Amber 50ml',
      'Nourishing Botanical Body Polish with Pink Himalayan Salts',
      'Revitalizing Rosemary & Mint Scalp Stimulating Oil',
      'Silky Argan & Keratin Leave-In Hair Hydrator',
      'Aromatherapy Lavender & Chamomile Sleep Mist',
      'Exfoliating Bamboo Fibre Body Dry Brush',
      'Handcrafted Organic Shea Butter Intensive Balm',
    ],
  },
  {
    name: 'Jewellery',
    slug: 'jewellery',
    description: 'Recycled 18k solid gold vermeil, sterling silver statement rings, chains, and earrings.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    icon: 'Gem',
    sortOrder: 6,
    subcategories: [
      { name: 'Necklaces', prefix: 'Necklace', photos: ['1599643478518-a784e5dc4c8f', '1611591475819-79b8b73ff270', '1515562141207-7a88fb7ce338', '1596944924616-7b38e7cfac36'] },
      { name: 'Earrings', prefix: 'Earrings', photos: ['1535632066927-ab7c9ab60908', '1605100804763-247f67b3557e', '1611085583191-a3b181a88401', '1618403088890-3d9ff6f4c8b1'] },
      { name: 'Bracelets', prefix: 'Bracelet', photos: ['1602173574767-37ac01994b2a', '1630019852942-f89202989a59', '1611955167811-4711904bb9f8', '1588444837495-c6cfeb53f32d'] },
      { name: 'Rings', prefix: 'Ring', photos: ['1573408301185-9146fe634ad0', '1603561596112-0a132b757442', '1617038260897-41a1f14a8ca0', '1606760227091-3dd870d97f1d'] },
    ],
    productNames: [
      'The Aurelia 18K Gold Vermeil Bold Link Chain Necklace',
      'Baroque Freshwater Pearl Floating Pendant Necklace',
      'Layered Delicate Rope Chain Duo in 18K Solid Gold',
      'Sculpted Teardrop Solitaire Gemstone Choker',
      'Solid 925 Sterling Silver Beveled Figaro Chain',
      'Chunky Sculptural Gold Vermeil Hoop Earrings',
      'Diamond Pavé Micro Huggie Earrings in White Gold',
      'Cascading Freshwater Pearl Threader Drop Earrings',
      'Handcrafted Textured Molten Gold Stud Earrings',
      'Geometric Baguette Cut Emerald Huggie Hoops',
      'Heirloom Classic Tennis Bracelet with Lab Diamonds',
      'Sculpted Minimalist Bangle in 18K Brushed Gold',
      'Sterling Silver Cuban Curb Link Chain Bracelet',
      'Dual Cable Woven Gold Vermeil Adjustable Cuff',
      'Stackable Twisted Rope Band Ring in Yellow Gold',
      'Solitaire Moissanite Cushion Cut Signet Ring',
      'Chunky Dome Ring in 925 Recycled Sterling Silver',
      'Organic Molten Contour Wave Ring Set of Three',
      'Lab Emerald & Diamond Accent Cocktail Statement Ring',
      'Engraved Initial Oval Signet Ring in 18K Vermeil',
      'Water Drop Sapphire & Teardrop Earring Gala 4-Piece Set',
      'Travel Zip Velvet Jewelry Organizer & Watch Box',
    ],
  },
  {
    name: 'Bags',
    slug: 'bags',
    description: 'Full-grain Tuscan vegetable-tanned leather totes, structured crossbody bags, and weekenders.',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    icon: 'ShoppingBag',
    sortOrder: 7,
    subcategories: [
      { name: 'Handbags', prefix: 'Tote', photos: ['1548036328-c9fa89d128fa', '1584917865442-de89df76afd3', '1590874103328-eac38a683ce7', '1566150905458-1bf1fc113f0d'] },
      { name: 'Backpacks', prefix: 'Backpack', photos: ['1553062407-98eeb64c6a62', '1547949003-9571a5aee5c8', '1585916420730-d7f95e942d46', '1622560480605-d83c853bc5c3'] },
      { name: 'Crossbody Bags', prefix: 'Crossbody', photos: ['1548036328-c9fa89d128fa', '1598532163257-ae3c6b2524b6', '1591561954557-26941169b49e', '1548354471-ac08fc4a694f'] },
      { name: 'Wallets', prefix: 'Wallet', photos: ['1627123424574-724758594e93', '1544816155-12df9643f363', '1605733160314-4fc7dac4bb16', '1612902456551-071b5f5e26e3'] },
    ],
    productNames: [
      'The Sovereign Vegetable-Tanned Tuscan Leather Tote',
      'The Mayfair Structured Top-Handle Everyday Satchel',
      'Supple Pebbled Leather Shoulder Hobo Carryall',
      'Woven Raffia & Saddle Leather Summer Beach Tote',
      'Modular 16-Inch Laptop Commuter Leather Backpack',
      'Waxed Canvas & Bridle Leather Heritage Daypack',
      'Minimalist Waterproof Technical Urban Roll-Top Pack',
      'Ultra-Slim Executive Leather Laptop Briefcase Backpack',
      'Italian Top-Grain Saddle Leather Flap Crossbody Bag',
      'Camera Silhouette Boxy Camera Crossbody in Cognac',
      'Quilted Nappa Leather Chain Strap Evening Crossbody',
      'Half-Moon Smooth Calfskin Mini Crossbody Pouch',
      'Handcrafted Bifold Pebble Grain Leather Wallet',
      'Zip-Around Accordion Multiple Card Continental Wallet',
      'Slim Magnetic Front-Pocket RFID Blocking Cardholder',
      'Tri-Fold Smooth Vachetta Leather Pocket Wallet',
      'Waxed Canvas & Solid Brass Overnighter Duffle Bag',
      'Full-Grain Leather 48-Hour Weekend Holdall Bag',
      'Top-Grain Leather Hanging Toiletry Washbag Kit',
      'Pebbled Leather Passport & Boarding Pass Wallet Case',
      'Adjustable Braided Webbing Crossbody Guitar Strap',
      'Leather Luggage Tag with Solid Brass Monogram Buckle',
    ],
  },
  {
    name: 'Hats',
    slug: 'hats',
    description: 'Pure Australian merino wool beanies, straw Panama hats, caps, and classic British headwear.',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    icon: 'Crown',
    sortOrder: 8,
    subcategories: [
      { name: 'Caps', prefix: 'Cap', photos: ['1588850561407-ed78c282e89b', '1521369909029-2afed882baee', '1556306535-0f09a537f0a3', '1529590003495-b2646e2c6b1e'] },
      { name: 'Hats', prefix: 'Hat', photos: ['1552060155-89a413cbf87e', '1572460483056-e6cf64a5bfb6', '1575428652377-a2d80e2277fc', '1533827432537-70133748f5c8'] },
      { name: 'Beanies', prefix: 'Beanie', photos: ['1576871337632-b9aef4c17ab9', '1578632767115-351597cf2477', '1562027032-32cdf39b5a39', '1532973497172-04d39a5be482'] },
    ],
    productNames: [
      'Washed Organic Cotton 6-Panel Dad Baseball Cap',
      'Heavyweight Cotton Twill Minimalist Unstructured Cap',
      'Water-Resistant Technical Nylon Running Sport Cap',
      'Corduroy Vintage-Toned Curved Brim Streetwear Cap',
      'Handwoven Ecuadorian Toquilla Straw Panama Hat',
      'Wide Brim Wool Felt Rancher Fedora in Camel',
      'Reversible Cotton Canvas Casual Bucket Hat',
      'Sun-Protection UPF 50+ Packable Safari Sun Hat',
      'Pure Australian Merino Wool Rib-Knit Watch Beanie',
      'Cashmere Cable-Knit Slouchy Winter Cuffed Beanie',
      'Waffle Knit Fisherman Short Rolled Cuff Beanie',
      'Chunky Alpaca Wool Turn-Up Cozy Snow Beanie',
      'British Donegal Tweed 8-Piece Baker Boy Flat Cap',
      'Traditional Newsboy Wool Blend Heritage Driving Cap',
      'Fleece-Lined Thermal Windproof Outdoor Beanie',
      'Straw Boater Hat with Black Grosgrain Ribbon',
      'Waxed Cotton Heritage Waterproof Rain Hat',
      'Suede Flat Brim Snapback Architectural Cap',
      'Merino Wool Balaclava Hood Neck Warmer Combo',
      'Open-Weave Linen Breathable Summer Ivy Flat Cap',
      'Foldable Packable Crushable Travel Bucket Sun Hat',
      'Wool Felt Pork Pie Hat with Silk Interior Lining',
    ],
  },
  {
    name: 'Vision Care',
    slug: 'vision-care',
    description: 'Precision Japanese titanium eyewear, polarized UV400 sunglasses, and blue light spectacles.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    icon: 'Eye',
    sortOrder: 9,
    subcategories: [
      { name: 'Glasses', prefix: 'Glasses', photos: ['1574258495973-f010dfbb5371', '1591076482161-42ce6da69f67', '1577803645773-f96470509666', '1509695507497-903c140c43b0'] },
      { name: 'Sunglasses', prefix: 'Sunglasses', photos: ['1511499767150-a48a237f0083', '1508296695146-257a814070b4', '1572635196237-14b3f281503f', '1473496169904-658ba7c44d8a'] },
      { name: 'Vision Accessories', prefix: 'Vision Accessory', photos: ['1516762689617-e1cffcef479d', '1608904401626-c4adfa6c2d5f', '1617714651527-5c8e74abb3b8', '1570710891163-6d3b5c47248b'] },
    ],
    productNames: [
      'VEXIVO Solstice Polarised Beta-Titanium Sunglasses 18g',
      'Hexagonal Architectural Gold Frame Gradient Sunglasses',
      'Classic Wayfarer Tortoiseshell CR-39 Polarised Shades',
      'Rimless Titanium Aviator Sunglasses with Mirror Lens',
      'Cat-Eye Acetate Sculpted Vintage UV400 Sunglasses',
      'Bold Rectangular 90s Silhouette Matte Black Shades',
      'Blue Light Filter Computer Spectacles in Clear Acetate',
      'Round Horn-Rimmed Blue Light Blocking Reading Glasses',
      'Titanium Wire Ultra-Lightweight Everyday Optical Frames',
      'Keyhole Bridge Circular Heritage Spectacle Frames',
      'Square Minimalist Matte Titanium Optical Eyeglasses',
      'Clip-On Magnetic Polarised Sun Shade Attachments',
      'Full-Grain Leather Hard Eyewear Clamshell Case',
      'Microfibre Anti-Fog Optical Lens Cleaning Cloth 3-Pack',
      'Handcrafted Braided Leather Glasses Neck Cord Strap',
      'Precision Ultrasonic Eyewear & Jewelry Cleaner Basin',
      'Gold-Plated Stainless Steel Eyewear Lanyard Chain',
      'Over-the-Glasses UV400 Driving Glare Reduction Shield',
      'Compact Folding Pocket Reading Glasses with Slim Sleeve',
      'Sport Floating Strap for Water Outdoor Sunglasses',
      'Anti-Scratch Lens Cleaning Spray Solution 100ml Kit',
      'Eyewear Screwdriver & Silicone Nosepad Repair Toolkit',
    ],
  },
  {
    name: 'Pets Care',
    slug: 'pets-care',
    description: 'Eco-friendly bamboo pet bedding, vegetable-tanned collars, organic grooming, and wellness.',
    image: 'https://images.unsplash.com/photo-1583337130417-1776413b8c3e?auto=format&fit=crop&w=800&q=80',
    icon: 'Activity',
    sortOrder: 10,
    subcategories: [
      { name: 'Pet Products', prefix: 'Bedding', photos: ['1583337130417-1776413b8c3e', '1601758228041-f3b2795255f1', '1587300003388-59208cc962cb', '1535294435445-d7249524ef2e'] },
      { name: 'Pet Accessories', prefix: 'Accessory', photos: ['1592194996308-7b43878e84a6', '1560807707-8cc77767d783', '1591946614720-90a587da4a36', '1596854407944-bf87f6fdd49e'] },
      { name: 'Pet Grooming Products', prefix: 'Grooming', photos: ['1522276498395-f4f68f7f8454', '1541781774459-bb2af2f05b55', '1504595403659-9088ce801e29', '1548199973-03cce0bbc87b'] },
    ],
    productNames: [
      'Orthopedic Memory Foam Ergonomic Pet Lounger Bed',
      'Washable Organic Bamboo Fibre Calming Donut Pet Bed',
      'Ceramic Weighted Elevated Pet Feeding Bowl Duo',
      'Stainless Steel Automatic Circulating Pet Water Fountain',
      'Travel Packable Water-Resistant Dog Car Seat Cover',
      'English Bridle Leather Brass Hardware Dog Collar',
      'Shock-Absorbing Bungee Running Dog Leash 6ft',
      'Breathable No-Pull Mesh Comfort Dog Chest Harness',
      'Reflective Night-Walk Adjustable Pet Safety Vest',
      'Vegetable-Tanned Leather Poop Bag Dispenser Pouch',
      'Organic Oatmeal & Aloe Hypoallergenic Pet Shampoo',
      'Detangling Stainless Steel Dual-Sided Undercoat Rake',
      'Self-Cleaning Slicker Pet Grooming Deshedding Brush',
      'Gentle Silicone Toothbrush & Enzymatic Pet Toothpaste',
      'Natural Shea Butter & Beeswax Soothing Paw Balm',
      'Professional Quiet Rechargeable Pet Nail Grinder',
      'Natural Rubber Treat-Dispensing Enrichment Chew Toy',
      'Braided Cotton Rope Interactive Tug Dental Play Toy',
      'Catnip-Infused Natural Wood & Sisal Scratching Post',
      'Warm Water-Repellent Winter Dog Puffer Jacket Vest',
      'Microfibre Ultra-Absorbent Quick-Dry Pet Towel',
      'Portable Silicone Collapsible Travel Pet Water Bottle',
    ],
  },
  {
    name: 'Toys',
    slug: 'toys',
    description: 'Sustainably crafted wooden toys, family tabletop board games, educational puzzles, and plush.',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    icon: 'Sparkles',
    sortOrder: 11,
    subcategories: [
      { name: 'Toys', prefix: 'Toy', photos: ['1596461404969-9ae70f2830c1', '1558060370-d644479cb6f7', '1563396983906-b3795482a59a', '1515488042361-ee00e0ddd4e4'] },
      { name: 'Games', prefix: 'Game', photos: ['1578269174936-2709b6aeb913', '1596568362218-0a3ac647b1e8', '1530820883932-3da05e77d7da', '1566576912321-d58ddd7a6088'] },
      { name: 'Kids Entertainment', prefix: 'Play', photos: ['1587654780014-daf204a10bd9', '1560859251-d563a49e2336', '1611604548018-d56bbd85d681', '1609000580621-dcb8e2be69dd'] },
    ],
    productNames: [
      'Hand-Carved Sustainable Beechwood Building Blocks 60-Piece',
      'Montessori Geometric Shape Stacker & Sorter Wood Toy',
      'Organic Cotton Velvet Classic Heirloom Teddy Bear',
      'Wooden Magnetic Train Engine & Carriages Track Set',
      'Handcrafted Pull-Along Wooden Puppy Toy with Wheels',
      'Handmade Felt Animal Safari Puppet Collection',
      'Solid Walnut Luxury Hand-Carved Chess & Checkers Set',
      'Tactile Wooden Tumble Tower Balancing Block Game',
      'Family Strategy Board Game of Expeditions & Discovery',
      'Cast Brass Vintage Dominoes Set in Wooden Case',
      'Interactive 1000-Piece Architectural Panorama Jigsaw Puzzle',
      'Classic Backgammon Set in Leather Folding Briefcase',
      'STEM Magnetic 3D Geometric Architectural Tile Set',
      'Wooden Play Kitchen Utensils & Fresh Harvest Food Basket',
      'Interactive Astronomy Starlight Constellation Projector',
      'Wooden Mechanical Gear Clock Construction Craft Kit',
      'Watercolor Painting Studio Tin with 36 Pigment Pans',
      'Musical Wooden Xylophone with Precision Tuned Metal Bars',
      'Indoor Sensory Cotton Canvas Play Teepee Tent',
      'Eco-Friendly Non-Toxic Modeling Clay 12-Color Bucket',
      'Hand-Spun Bamboo Balance Board for Active Kids Play',
      'Miniature Wooden Dollhouse with Modular Furniture Set',
    ],
  },
  {
    name: 'Health & Fitness',
    slug: 'health-fitness',
    description: 'Studio yoga mats, premium resistance equipment, recovery massage tools, and athletic wellness.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
    icon: 'Activity',
    sortOrder: 12,
    subcategories: [
      { name: 'Fitness Accessories', prefix: 'Fitness', photos: ['1517836357463-d25dfeac3438', '1571019614242-c5c5dee9f50b', '1576678927484-cc907957088c', '1518611012118-696072aa579a'] },
      { name: 'Exercise Products', prefix: 'Workout', photos: ['1593079831268-3381b0db4a77', '1584735935682-2f2b69dff9d2', '1544367567-0f2fcb009e0b', '1584116831289-e53b1cb4df5d'] },
      { name: 'Wellness Products', prefix: 'Recovery', photos: ['1549576490-b0b4831ef60a', '1574680096145-d05b474e2155', '1616803689943-5601631c7fec', '1534438327276-14e5300c3a48'] },
    ],
    productNames: [
      'Eco-Friendly Natural Tree Rubber & Cork Non-Slip Yoga Mat',
      'High-Density EVA Foam Roller with Trigger-Point Ribbing',
      'Braided Natural Latex Resistance Loop Bands 5-Strength Set',
      'Weighted Fast-Spin Ball-Bearing Speed Skipping Rope',
      'Ergonomic Cast-Iron Vinyl Dipped Kettlebell 16kg',
      'Hexagonal Rubber Encased Dumbbell Pair 12.5kg',
      'Heavy-Duty Adjustable Doorway Pull-Up Training Bar',
      'Non-Slip Wooden Push-Up Parallette Workout Bars',
      'Deep-Tissue Percussive Muscle Massage Gun with 6 Heads',
      'Acupressure Spike Mat & Cervical Neck Relieving Pillow',
      'Infrared Heated Shiatsu Back & Shoulder Massager',
      'Ice Compression Cryotherapy Knee & Joint Wrap',
      'Stainless Steel Insulated 32oz Gym Sports Hydration Flask',
      'Microfibre Ultra-Absorbent Quick-Dry Yoga Towel',
      'Athletic Gym Duffel Bag with Vented Shoe Compartment',
      'Neoprene Wrist Wraps & Padded Weightlifting Grips',
      'Pilates Core Balance Ring with Dual Padded Handles',
      'Therapy Lacrosse Massage Ball Duo for Myofascial Release',
      'Natural Bamboo Essential Oil Ultrasonic Diffuser',
      'Organic Botanical Epsom Bath Salts for Muscle Recovery',
      'Smart Body Composition Scale with Bluetooth Heart Rate',
      'Cotton Yoga Strap with Dual D-Ring Alignment Buckles',
    ],
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Acoustic engineering, studio headphones, precision audio, and contemporary desktop tech.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    icon: 'Radio',
    sortOrder: 13,
    subcategories: [
      { name: 'Headphones & Audio', prefix: 'Audio', photos: ['1505740420928-5e560c06d30e', '1583394838336-acd977736f90', '1484704849700-f032a568e944', '1546435770-a3e426bf472b'] },
      { name: 'Keyboards & Mice', prefix: 'Desk', photos: ['1587829741301-dc798b83add3', '1527864550417-7fd91fc51a46', '1618384887929-16ec33fab9ef', '1595225476474-87563907a212'] },
      { name: 'Smart Watches', prefix: 'Watch', photos: ['1523275335684-37898b6baf30', '1508685096489-7aacd43bd3b1', '1510017803434-a899398421b3', '1579586337278-3befd40fd17a'] },
      { name: 'Speakers', prefix: 'Speaker', photos: ['1545454675-3531b543be5d', '1608043152269-423dbba4e7e1', '1519638399535-1b036603ac77', '1511379938547-c1f69419868d'] },
    ],
    productNames: [
      'VEXIVO Aethel Wireless ANC Studio Headphones',
      'Star Loop Spatial Audio True Wireless Earbuds',
      'Custom Gasket-Mount Mechanical Keyboard with Brass Plate',
      'Precision Wireless Ergonomic Trackball Mouse',
      'Titanium Smart Watch Series 8 with ECG Sensor',
      'High-Fidelity Solid Walnut Desktop Studio Monitors',
      'Portable Bluetooth 360 Acoustic Speaker in Matte Graphite',
      'Broadcast USB Condenser Microphone with Pop Filter',
      'Ultra-Slim Multi-Device Wireless Mechanical Keyboard',
      'High-Resolution Balanced Headphone DAC Amplifier',
      'Magnetic Wireless Fast-Charging Stand 3-in-1',
      'Ambient Smart LED Desk Bar with Auto-Dimming',
      'Noise-Isolating In-Ear Reference Monitors',
      'Braided Aviation USB-C Mechanical Keyboard Coiled Cable',
      'Smart Fitness Tracker Band with Heart Health Monitor',
      'Premium Top-Grain Leather Desk Mat & Mousepad',
      'Dual-Driver Wireless Gaming Headset with Boom Mic',
      'True 4K Streaming Webcam with Ring Light',
      'Aluminum Adjustable Laptop & Monitor Riser Stand',
      'Compact Multi-Port GaN 100W Fast Travel Charger',
      'Minimalist Felt Sleeve Case for 16-Inch MacBook Pro',
      'Studio Microphone Boom Arm with Hidden Cable Channels',
    ],
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Modern sculptural ceramics, walnut furniture, organic textiles, and ambient home decor.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    icon: 'Home',
    sortOrder: 14,
    subcategories: [
      { name: 'Decor & Sculptures', prefix: 'Decor', photos: ['1586023492125-27b2c045efd7', '1513519245088-0e12902e5a38', '1534349762230-e0cadf78f5da', '1583847268964-b28dc8f51f92'] },
      { name: 'Furniture & Tables', prefix: 'Furniture', photos: ['1555041469-a586c61ea9bc', '1538688525198-9b88f6f53126', '1493663284031-b7e3aefcae8e', '1567016432779-094069958ea5'] },
      { name: 'Lighting', prefix: 'Lighting', photos: ['1507473885765-e6ed057f782c', '1513506003901-1e6a229e2d15', '1540932239986-30128078f3c5', '1532009324734-20a7a5813719'] },
      { name: 'Textiles & Living', prefix: 'Textiles', photos: ['1584100936595-c0654b55a2e2', '1616486338812-3dadae4b4ace', '1600121848594-d8644e57abab', '1579656381225-5ef653500c46'] },
    ],
    productNames: [
      'Sculptural Ceramic Asymmetric Flora Vase in Sandstone',
      'Solid American Walnut Round Low Coffee Table',
      'Belgian Washed Linen Herringbone Throw Blanket',
      'Architectural Travertine Marble Table Lamp with Linen Shade',
      'Natural Soy Wax & Amber Essential Oil Scented Candle',
      'Hand-Carved White Marble Geometric Bookends Pair',
      'Minimalist Silent Sweep Walnut Wall Clock 30cm',
      'Hand-Knotted Pure New Zealand Wool Textured Area Rug',
      'Matte Black Steel Bauhaus Candle Holder Candelabra',
      'Solid Oak Minimalist Dining Chair with Curved Back',
      'Handcrafted Stoneware Ceramic Dinnerware 16-Piece Set',
      'Organic Double-Gauze Cotton Duvet Quilt & Sham Set',
      'Rattan & Teak Wood Woven Magazine Storage Rack',
      'Cast Brass Incense Burner Bowl with Sand Basin',
      'Smoked Glass Ribbed Beverage Pitcher & Tumbler Set',
      'Brushed Brass Minimalist Pendant Ceiling Light',
      'Solid Acacia Wood Live-Edge Serving Charcuterie Board',
      'Linen Upholstered Round Footstool Storage Ottoman',
      'Arch Wall Mirror with Brushed Aluminum Frame 80cm',
      'Hand-Blown Borosilicate Fluted Glass Flower Vase',
      'Organic Turkish Cotton Waffle Bath Sheet 2-Pack',
      'Minimalist Scandinavian Floating Wall Shelf Set of 2',
    ],
  },
];

const buildProducts = () => {
  const products = [];
  let skuCounter = 1;

  categoriesDef.forEach((cat) => {
    cat.productNames.forEach((name, idx) => {
      const subcat = cat.subcategories[idx % cat.subcategories.length];
      const photoA = subcat.photos[idx % subcat.photos.length];
      const photoB = subcat.photos[(idx + 1) % subcat.photos.length];
      const photoC = subcat.photos[(idx + 2) % subcat.photos.length];

      const urlA = `https://images.unsplash.com/photo-${photoA}?auto=format&fit=crop&w=800&q=80`;
      const urlB = `https://images.unsplash.com/photo-${photoB}?auto=format&fit=crop&w=800&q=80`;
      const urlC = `https://images.unsplash.com/photo-${photoC}?auto=format&fit=crop&w=800&q=80`;

      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const skuPrefix = cat.slug.replace('-wear', '').replace('-fitness', 'fit').replace('-care', 'care').substring(0, 3).toUpperCase();
      const sku = `VEX-${skuPrefix}-${String(skuCounter++).padStart(4, '0')}`;

      // Prices between 35 and 285
      const price = Math.round((35 + ((idx * 17) % 250)) * 100) / 100;
      const compareAtPrice = Math.round(price * 1.35 * 100) / 100;

      // Badges
      const isFeatured = idx % 5 === 0;
      const isBestseller = idx % 3 === 0;
      const isNewArrival = idx % 2 === 0;
      const isSpecialOffer = idx % 4 === 0;

      // Rating between 4.7 and 5.0
      const rating = Math.round((4.7 + ((idx % 4) * 0.1)) * 10) / 10;
      const numReviews = 25 + ((idx * 13) % 180);

      products.push({
        name,
        slug,
        sku,
        description: `Experience the exceptional craftsmanship of the ${name}. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine ${cat.name} collection.`,
        shortDescription: `Curated luxury ${name} engineered with uncompromising material quality and British standards.`,
        price,
        compareAtPrice,
        images: [urlA, urlB, urlC],
        thumbnail: urlA,
        hoverImage: urlB,
        category: cat.name,
        categorySlug: cat.slug,
        subcategory: subcat.name,
        collectionSlug: isBestseller ? 'bestsellers' : (isNewArrival ? 'new-arrivals' : 'minimalist-luxury'),
        brand: `VEXIVO ${cat.name.split(' ')[0]}`,
        stock: 30 + ((idx * 7) % 90),
        tags: [cat.name, subcat.name, 'Luxury', 'VEXIVO'],
        featured: isFeatured,
        bestseller: isBestseller,
        newArrival: isNewArrival,
        specialOffer: isSpecialOffer,
        rating,
        numReviews,
        status: 'active',
      });
    });
  });

  return products;
};

const allProducts = buildProducts();

const categoriesData = categoriesDef.map((c) => ({
  name: c.name,
  slug: c.slug,
  description: c.description,
  image: c.image,
  icon: c.icon,
  itemCount: 22,
  sortOrder: c.sortOrder,
  status: 'active',
}));

const seedFileContent = `const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Collection = require('../models/Collection');
const Coupon = require('../models/Coupon');
const Banner = require('../models/Banner');
const SiteSettings = require('../models/SiteSettings');
const Review = require('../models/Review');

dotenv.config();

const categoriesData = ${JSON.stringify(categoriesData, null, 2)};

const productsData = ${JSON.stringify(allProducts, null, 2)};

const seedAll = async () => {
  try {
    await connectDB();
    console.log('[VEXIVO Seed] Purging existing database collections...');

    await Promise.all([
      User.deleteMany(),
      Product.deleteMany(),
      Category.deleteMany(),
      Collection.deleteMany(),
      Coupon.deleteMany(),
      Banner.deleteMany(),
      SiteSettings.deleteMany(),
      Review.deleteMany(),
    ]);

    console.log('[VEXIVO Seed] Collections cleared. Seeding fresh VEXIVO catalog with 264 products...');

    // 1. Users
    const admin = await User.create({
      name: 'VEXIVO Administrator',
      email: 'admin@vexivo.com',
      passwordHash: 'AdminPass123!',
      phone: '+44 20 7946 0991',
      role: 'admin',
      addresses: [
        {
          street: '71-75 Shelton Street, Covent Garden',
          city: 'London',
          postalCode: 'WC2H 9JQ',
          country: 'United Kingdom',
          isDefault: true,
        },
      ],
    });

    const arpitUser = await User.create({
      name: 'Arpit',
      email: 'arpit123@gmail.com',
      passwordHash: 'Arpit123!',
      phone: '+44 7700 900555',
      role: 'customer',
      addresses: [
        {
          street: '22 Bond Street, Mayfair',
          city: 'London',
          postalCode: 'W1S 2PB',
          country: 'United Kingdom',
          isDefault: true,
        },
      ],
    });

    console.log('[VEXIVO Seed] Seeded Admin & Customer accounts.');

    // 2. Site Settings
    await SiteSettings.create({
      siteName: 'VEXIVO',
      announcementText: '✨ FREE UK NEXT-DAY DELIVERY ON ORDERS OVER £50 | USE CODE VEX10 FOR 10% OFF',
      announcements: [
        '✨ FREE UK NEXT-DAY DELIVERY ON ORDERS OVER £50',
        '🔥 SPRING / SUMMER 2026 CAPSULE HAS ARRIVED',
        '⭐ OVER 18,500+ VERIFIED 5-STAR REVIEWS ACROSS THE UK',
        '⚡ 30-DAY HASSLE-FREE RETURNS & LIFETIME HARDWARE WARRANTY',
      ],
      socialLinks: {
        instagram: 'https://instagram.com/vexivo',
        facebook: 'https://facebook.com/vexivo',
        twitter: 'https://twitter.com/vexivo',
        tiktok: 'https://tiktok.com/@vexivo',
        pinterest: 'https://pinterest.com/vexivo',
      },
      contactInfo: {
        email: 'arpit123@gmail.com',
        phone: '+44 20 7946 0991',
        address: '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ, UK',
        hours: 'Monday – Saturday: 9:00 AM – 6:00 PM GMT',
      },
      footerContent: {
        aboutText:
          'VEXIVO represents refined modern living. We engineer high-performance audio, premium apparel, and minimalist accessories with uncompromising attention to material and aesthetic precision.',
        copyrightText: '© 2026 VEXIVO International Ltd. All rights reserved. London, United Kingdom.',
      },
      freeShippingThreshold: 50,
    });

    // 3. Categories
    const categories = await Category.insertMany(categoriesData);
    console.log(\`[VEXIVO Seed] Seeded \${categories.length} categories.\`);

    // 4. Products with multi-seller ownership
    const preparedProducts = productsData.map((p, idx) => ({
      ...p,
      sellerId: idx % 5 === 0 ? arpitUser._id : admin._id,
      sellerName: idx % 5 === 0 ? "Arpit's Studio Collection" : "VEXIVO Official",
      sellerInfo: idx % 5 === 0 ? "Independent Artisan Seller on VEXIVO Marketplace" : "Direct from VEXIVO Central Mayfair Warehouse",
    }));

    const products = await Product.insertMany(preparedProducts);
    console.log(\`[VEXIVO Seed] Seeded \${products.length} distinct multi-seller products.\`);

    // 5. Collections
    const collectionsData = [
      {
        name: 'New Arrivals 2026',
        slug: 'new-arrivals',
        description: 'The newest aesthetic drops across fine tailoring, luxury leather, and modern lifestyle.',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
        featured: true,
        sortOrder: 1,
        products: products.filter((p) => p.newArrival).slice(0, 16).map((p) => p._id),
      },
      {
        name: 'VEXIVO Bestsellers',
        slug: 'bestsellers',
        description: 'Our most sought-after icons, praised by thousands of customers worldwide.',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
        featured: true,
        sortOrder: 2,
        products: products.filter((p) => p.bestseller).slice(0, 16).map((p) => p._id),
      },
      {
        name: 'Flash Sale & Special Offers',
        slug: 'special-offers',
        description: 'Limited seasonal reductions of up to 40% off selected luxury pieces.',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
        featured: true,
        sortOrder: 3,
        products: products.filter((p) => p.specialOffer).slice(0, 16).map((p) => p._id),
      },
      {
        name: 'Minimalist Luxury',
        slug: 'minimalist-luxury',
        description: 'Curated capsule pieces designed for longevity, quiet luxury, and timeless form.',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
        featured: true,
        sortOrder: 4,
        products: products.filter((p) => p.tags.includes('Luxury')).slice(0, 16).map((p) => p._id),
      },
    ];

    const collections = await Collection.insertMany(collectionsData);
    console.log(\`[VEXIVO Seed] Seeded \${collections.length} collections.\`);

    // 6. Banners
    const bannersData = [
      {
        title: 'DEFINING CONTEMPORARY LUXURY',
        subtitle: 'SPRING / SUMMER 2026 CAPSULE',
        highlight: 'NEW SEASON ARRIVALS',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85',
        mobileImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=85',
        buttonText: 'Explore Collection',
        buttonLink: '/category/women-wear',
        position: 'hero',
        sortOrder: 1,
        active: true,
      },
      {
        title: 'TUSCAN LEATHER ARTISANAL CRAFTSMANSHIP',
        subtitle: 'VEGETABLE-TANNED STRUCTURED TOTES & SADDLE BAGS',
        highlight: 'HANDMADE HERITAGE',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1600&q=85',
        mobileImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=85',
        buttonText: 'Shop Leather Goods',
        buttonLink: '/category/bags',
        position: 'hero',
        sortOrder: 2,
        active: true,
      },
      {
        title: 'SPRING FLASH EVENT: UP TO 35% OFF',
        subtitle: 'Curated designer outerwear, titanium vision care, and fine accessories.',
        highlight: 'LIMITED TIME ONLY',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85',
        mobileImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=85',
        buttonText: 'Shop Sale',
        buttonLink: '/collection/special-offers',
        position: 'promotional',
        sortOrder: 1,
        active: true,
      },
    ];

    await Banner.insertMany(bannersData);
    console.log('[VEXIVO Seed] Seeded Hero & Promotional Banners.');

    // 7. Coupons
    const couponsData = [
      {
        code: 'VEX10',
        type: 'percentage',
        value: 10,
        minimumOrder: 30,
        maximumDiscount: 50,
        usageLimit: 1000,
        active: true,
      },
      {
        code: 'WELCOME20',
        type: 'percentage',
        value: 20,
        minimumOrder: 80,
        maximumDiscount: 100,
        usageLimit: 500,
        active: true,
      },
      {
        code: 'FREESHIP',
        type: 'fixed',
        value: 5,
        minimumOrder: 40,
        maximumDiscount: 5,
        usageLimit: 2000,
        active: true,
      },
    ];

    await Coupon.insertMany(couponsData);
    console.log('[VEXIVO Seed] Seeded discount coupons (VEX10, WELCOME20, FREESHIP).');

    // 8. Reviews for top items
    const sampleReviews = [
      {
        product: products[0]._id,
        userName: 'Eleanor Sterling',
        userEmail: 'eleanor@sterling.co.uk',
        rating: 5,
        title: 'Exquisite silk drape and meticulous tailoring',
        comment: 'The quality of the fabric is astonishing. Fits like Savile Row bespoke craftsmanship with an effortless fluid silhouette.',
        verifiedPurchase: true,
        status: 'approved',
      },
      {
        product: products[22]._id, // First men item
        userName: 'Alexander Wright',
        userEmail: 'alex.wright@gmail.com',
        rating: 5,
        title: 'Superb Oxford cotton finish',
        comment: 'Substantial fabric weight, sturdy mother-of-pearl buttons, and sharp structured collar. Outstanding piece.',
        verifiedPurchase: true,
        status: 'approved',
      },
      {
        product: products[66]._id, // First shoe item
        userName: 'Julian Vance',
        userEmail: 'julian.v@live.com',
        rating: 5,
        title: 'Italian Nappa calfskin of the highest order',
        comment: 'Buttery soft straight out of the box with zero break-in period. Margom sole gives incredible grip and posture.',
        verifiedPurchase: true,
        status: 'approved',
      },
    ];

    await Review.insertMany(sampleReviews);
    console.log('[VEXIVO Seed] Seeded verified customer reviews.');

    console.log('======================================================');
    console.log('🎉 VEXIVO DATABASE SEEDING COMPLETE!');
    console.log(\`📦 Total Products Seeded: \${products.length}\`);
    console.log(\`🏷️  Categories Seeded: \${categories.length}\`);
    console.log('👤 Admin: admin@vexivo.com | AdminPass123!');
    console.log('👤 Customer: arpit123@gmail.com | Arpit123!');
    console.log('======================================================');

    if (require.main === module) {
      process.exit(0);
    }
    return true;
  } catch (error) {
    console.error('[VEXIVO Seed Error]:', error);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedAll();
}

module.exports = { seedAll };
`;

fs.writeFileSync(path.join(__dirname, 'seedData.js'), seedFileContent);
console.log(`[Success] Generated seedData.js with ${allProducts.length} unique products across ${categoriesDef.length} categories.`);
