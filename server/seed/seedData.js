const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Collection = require('../models/Collection');
const Banner = require('../models/Banner');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');

const categoriesData = [
  {
    "name": "Women Wear",
    "slug": "women-wear",
    "description": "Effortless silhouettes, fine tailoring, dresses, and everyday luxury essentials.",
    "image": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
    "icon": "Sparkles",
    "sortOrder": 1,
    "featured": true,
    "itemCount": 34
  },
  {
    "name": "Men Wear",
    "slug": "men-wear",
    "description": "Modern structured menswear, organic cotton essentials, bespoke wool tailoring, and overcoats.",
    "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    "icon": "User",
    "sortOrder": 2,
    "featured": true,
    "itemCount": 34
  },
  {
    "name": "Kids Wear",
    "slug": "kids-wear",
    "description": "Certified organic bamboo cotton essentials, comfortable playwear, and everyday children sets.",
    "image": "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80",
    "icon": "Baby",
    "sortOrder": 3,
    "featured": true,
    "itemCount": 34
  },
  {
    "name": "Shoes",
    "slug": "shoes",
    "description": "Artisanal Italian calfskin leather loafers, minimalist runners, sandals, and ankle boots.",
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    "icon": "Footprints",
    "sortOrder": 4,
    "featured": true,
    "itemCount": 34
  },
  {
    "name": "Beauty",
    "slug": "beauty",
    "description": "Botanical extracts, clinical skincare elixirs, niche fragrances, and facial sculpting tools.",
    "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    "icon": "Heart",
    "sortOrder": 5,
    "featured": true,
    "itemCount": 34
  },
  {
    "name": "Jewellery",
    "slug": "jewellery",
    "description": "Recycled 18k solid gold vermeil, sterling silver statement rings, chains, and earrings.",
    "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    "icon": "Gem",
    "sortOrder": 6,
    "featured": true,
    "itemCount": 34
  },
  {
    "name": "Bags",
    "slug": "bags",
    "description": "Full-grain Tuscan vegetable-tanned leather totes, structured crossbody bags, and weekenders.",
    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    "icon": "ShoppingBag",
    "sortOrder": 7,
    "featured": true,
    "itemCount": 35
  },
  {
    "name": "Hats",
    "slug": "hats",
    "description": "Pure Australian merino wool beanies, straw Panama hats, caps, and classic British headwear.",
    "image": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    "icon": "Crown",
    "sortOrder": 8,
    "featured": true,
    "itemCount": 34
  },
  {
    "name": "Vision Care",
    "slug": "vision-care",
    "description": "Precision Japanese titanium eyewear, polarized UV400 sunglasses, and blue light spectacles.",
    "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "icon": "Eye",
    "sortOrder": 9,
    "featured": true,
    "itemCount": 34
  },
  {
    "name": "Pets Care",
    "slug": "pets-care",
    "description": "Eco-friendly bamboo pet bedding, vegetable-tanned collars, organic grooming, and wellness.",
    "image": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    "icon": "Activity",
    "sortOrder": 10,
    "featured": true,
    "itemCount": 34
  },
  {
    "name": "Toys",
    "slug": "toys",
    "description": "Sustainably crafted wooden toys, family tabletop board games, educational puzzles, and plush.",
    "image": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    "icon": "Sparkles",
    "sortOrder": 11,
    "featured": true,
    "itemCount": 34
  },
  {
    "name": "Health & Fitness",
    "slug": "health-fitness",
    "description": "Studio yoga mats, premium resistance equipment, recovery massage tools, and athletic wellness.",
    "image": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "icon": "Activity",
    "sortOrder": 12,
    "featured": true,
    "itemCount": 34
  },
  {
    "name": "Electronics",
    "slug": "electronics",
    "description": "Acoustic engineering, studio headphones, precision audio, and contemporary desktop tech.",
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    "icon": "Radio",
    "sortOrder": 13,
    "featured": true,
    "itemCount": 34
  },
  {
    "name": "Home & Living",
    "slug": "home-living",
    "description": "Modern sculptural ceramics, walnut furniture, organic textiles, and ambient home decor.",
    "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    "icon": "Home",
    "sortOrder": 14,
    "featured": true,
    "itemCount": 34
  }
];
const rawProducts = [
  {
    "name": "Silk Charmeuse Bias Cut Slip Dress",
    "slug": "silk-charmeuse-bias-cut-slip-dress",
    "sku": "VEX-WOM-0001",
    "description": "Experience the exceptional craftsmanship of the Silk Charmeuse Bias Cut Slip Dress. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury Silk Charmeuse Bias Cut Slip Dress engineered with uncompromising material quality and British standards.",
    "price": 4099,
    "compareAtPrice": 5499,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Dresses",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Women",
    "stock": 30,
    "tags": [
      "Women Wear",
      "Dresses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 25,
    "status": "active"
  },
  {
    "name": "French Floral Lantern Sleeve Midi Dress",
    "slug": "french-floral-lantern-sleeve-midi-dress",
    "sku": "VEX-WOM-0002",
    "description": "Experience the exceptional craftsmanship of the French Floral Lantern Sleeve Midi Dress. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury French Floral Lantern Sleeve Midi Dress engineered with uncompromising material quality and British standards.",
    "price": 3499,
    "compareAtPrice": 4699,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Dresses",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Women",
    "stock": 37,
    "tags": [
      "Women Wear",
      "Dresses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 38,
    "status": "active"
  },
  {
    "name": "Velvet Draped Evening Cocktail Gown",
    "slug": "velvet-draped-evening-cocktail-gown",
    "sku": "VEX-WOM-0003",
    "description": "Experience the exceptional craftsmanship of the Velvet Draped Evening Cocktail Gown. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury Velvet Draped Evening Cocktail Gown engineered with uncompromising material quality and British standards.",
    "price": 5899,
    "compareAtPrice": 7999,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Dresses",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Women",
    "stock": 44,
    "tags": [
      "Women Wear",
      "Dresses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 51,
    "status": "active"
  },
  {
    "name": "Pleated Georgette Tiered Maxi Dress",
    "slug": "pleated-georgette-tiered-maxi-dress",
    "sku": "VEX-WOM-0004",
    "description": "Experience the exceptional craftsmanship of the Pleated Georgette Tiered Maxi Dress. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury Pleated Georgette Tiered Maxi Dress engineered with uncompromising material quality and British standards.",
    "price": 4599,
    "compareAtPrice": 6199,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Dresses",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Women",
    "stock": 51,
    "tags": [
      "Women Wear",
      "Dresses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 64,
    "status": "active"
  },
  {
    "name": "Cashmere Ribbed Knit Mockneck Top",
    "slug": "cashmere-ribbed-knit-mockneck-top",
    "sku": "VEX-WOM-0005",
    "description": "Experience the exceptional craftsmanship of the Cashmere Ribbed Knit Mockneck Top. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury Cashmere Ribbed Knit Mockneck Top engineered with uncompromising material quality and British standards.",
    "price": 2399,
    "compareAtPrice": 3199,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Tops",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Women",
    "stock": 58,
    "tags": [
      "Women Wear",
      "Tops",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 77,
    "status": "active"
  },
  {
    "name": "Crisp Poplin Oversized Tailored Shirt",
    "slug": "crisp-poplin-oversized-tailored-shirt",
    "sku": "VEX-WOM-0006",
    "description": "Experience the exceptional craftsmanship of the Crisp Poplin Oversized Tailored Shirt. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury Crisp Poplin Oversized Tailored Shirt engineered with uncompromising material quality and British standards.",
    "price": 2099,
    "compareAtPrice": 2799,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Tops",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Women",
    "stock": 65,
    "tags": [
      "Women Wear",
      "Tops",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 90,
    "status": "active"
  },
  {
    "name": "Organic Pima Cotton Relaxed Tank Top",
    "slug": "organic-pima-cotton-relaxed-tank-top",
    "sku": "VEX-WOM-0007",
    "description": "Experience the exceptional craftsmanship of the Organic Pima Cotton Relaxed Tank Top. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury Organic Pima Cotton Relaxed Tank Top engineered with uncompromising material quality and British standards.",
    "price": 1099,
    "compareAtPrice": 1499,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1562137369-1a1a0bc66744?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Tops",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Women",
    "stock": 72,
    "tags": [
      "Women Wear",
      "Tops",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 103,
    "status": "active"
  },
  {
    "name": "Silk Crepe de Chine Cap Sleeve Blouse",
    "slug": "silk-crepe-de-chine-cap-sleeve-blouse",
    "sku": "VEX-WOM-0008",
    "description": "Experience the exceptional craftsmanship of the Silk Crepe de Chine Cap Sleeve Blouse. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury Silk Crepe de Chine Cap Sleeve Blouse engineered with uncompromising material quality and British standards.",
    "price": 2699,
    "compareAtPrice": 3599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Tops",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Women",
    "stock": 79,
    "tags": [
      "Women Wear",
      "Tops",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 116,
    "status": "active"
  },
  {
    "name": "A-Line High-Waisted Linen Midi Skirt",
    "slug": "a-line-high-waisted-linen-midi-skirt",
    "sku": "VEX-WOM-0009",
    "description": "Experience the exceptional craftsmanship of the A-Line High-Waisted Linen Midi Skirt. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury A-Line High-Waisted Linen Midi Skirt engineered with uncompromising material quality and British standards.",
    "price": 2299,
    "compareAtPrice": 3099,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Skirts",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Women",
    "stock": 86,
    "tags": [
      "Women Wear",
      "Skirts",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 129,
    "status": "active"
  },
  {
    "name": "Satin Asymmetric Bias Cut Slip Skirt",
    "slug": "satin-asymmetric-bias-cut-slip-skirt",
    "sku": "VEX-WOM-0010",
    "description": "Experience the exceptional craftsmanship of the Satin Asymmetric Bias Cut Slip Skirt. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury Satin Asymmetric Bias Cut Slip Skirt engineered with uncompromising material quality and British standards.",
    "price": 2199,
    "compareAtPrice": 2999,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Skirts",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Women",
    "stock": 93,
    "tags": [
      "Women Wear",
      "Skirts",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 142,
    "status": "active"
  },
  {
    "name": "Pleated Wool Crepe Accordion Skirt",
    "slug": "pleated-wool-crepe-accordion-skirt",
    "sku": "VEX-WOM-0011",
    "description": "Experience the exceptional craftsmanship of the Pleated Wool Crepe Accordion Skirt. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury Pleated Wool Crepe Accordion Skirt engineered with uncompromising material quality and British standards.",
    "price": 3099,
    "compareAtPrice": 4199,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Skirts",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Women",
    "stock": 100,
    "tags": [
      "Women Wear",
      "Skirts",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 155,
    "status": "active"
  },
  {
    "name": "Double-Breasted Wool Atelier Blazer",
    "slug": "double-breasted-wool-atelier-blazer",
    "sku": "VEX-WOM-0012",
    "description": "Experience the exceptional craftsmanship of the Double-Breasted Wool Atelier Blazer. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury Double-Breasted Wool Atelier Blazer engineered with uncompromising material quality and British standards.",
    "price": 5499,
    "compareAtPrice": 7399,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Jackets",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Women",
    "stock": 107,
    "tags": [
      "Women Wear",
      "Jackets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 168,
    "status": "active"
  },
  {
    "name": "Structured Boiled Shetland Wool Coat",
    "slug": "structured-boiled-shetland-wool-coat",
    "sku": "VEX-WOM-0013",
    "description": "Experience the exceptional craftsmanship of the Structured Boiled Shetland Wool Coat. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury Structured Boiled Shetland Wool Coat engineered with uncompromising material quality and British standards.",
    "price": 6899,
    "compareAtPrice": 9299,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Jackets",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Women",
    "stock": 114,
    "tags": [
      "Women Wear",
      "Jackets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 181,
    "status": "active"
  },
  {
    "name": "Batwing Sleeve Minimalist Trench Coat",
    "slug": "batwing-sleeve-minimalist-trench-coat",
    "sku": "VEX-WOM-0014",
    "description": "Experience the exceptional craftsmanship of the Batwing Sleeve Minimalist Trench Coat. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury Batwing Sleeve Minimalist Trench Coat engineered with uncompromising material quality and British standards.",
    "price": 5199,
    "compareAtPrice": 6999,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Jackets",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Women",
    "stock": 31,
    "tags": [
      "Women Wear",
      "Jackets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 194,
    "status": "active"
  },
  {
    "name": "Tailored Peaked Lapel Tuxedo Jacket",
    "slug": "tailored-peaked-lapel-tuxedo-jacket",
    "sku": "VEX-WOM-0015",
    "description": "Experience the exceptional craftsmanship of the Tailored Peaked Lapel Tuxedo Jacket. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury Tailored Peaked Lapel Tuxedo Jacket engineered with uncompromising material quality and British standards.",
    "price": 6199,
    "compareAtPrice": 8399,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Jackets",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Women",
    "stock": 38,
    "tags": [
      "Women Wear",
      "Jackets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 27,
    "status": "active"
  },
  {
    "name": "Wide-Leg Knife-Pleated Wool Trousers",
    "slug": "wide-leg-knife-pleated-wool-trousers",
    "sku": "VEX-WOM-0016",
    "description": "Experience the exceptional craftsmanship of the Wide-Leg Knife-Pleated Wool Trousers. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury Wide-Leg Knife-Pleated Wool Trousers engineered with uncompromising material quality and British standards.",
    "price": 3199,
    "compareAtPrice": 4299,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Trousers",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Women",
    "stock": 45,
    "tags": [
      "Women Wear",
      "Trousers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 40,
    "status": "active"
  },
  {
    "name": "High-Rise Fluid Tencel Cigarette Pants",
    "slug": "high-rise-fluid-tencel-cigarette-pants",
    "sku": "VEX-WOM-0017",
    "description": "Experience the exceptional craftsmanship of the High-Rise Fluid Tencel Cigarette Pants. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury High-Rise Fluid Tencel Cigarette Pants engineered with uncompromising material quality and British standards.",
    "price": 2599,
    "compareAtPrice": 3499,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Trousers",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Women",
    "stock": 52,
    "tags": [
      "Women Wear",
      "Trousers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 53,
    "status": "active"
  },
  {
    "name": "Relaxed Straight-Leg Italian Linen Pants",
    "slug": "relaxed-straight-leg-italian-linen-pants",
    "sku": "VEX-WOM-0018",
    "description": "Experience the exceptional craftsmanship of the Relaxed Straight-Leg Italian Linen Pants. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury Relaxed Straight-Leg Italian Linen Pants engineered with uncompromising material quality and British standards.",
    "price": 2499,
    "compareAtPrice": 3399,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Trousers",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Women",
    "stock": 59,
    "tags": [
      "Women Wear",
      "Trousers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 66,
    "status": "active"
  },
  {
    "name": "Tailored Darted Crepe Evening Trousers",
    "slug": "tailored-darted-crepe-evening-trousers",
    "sku": "VEX-WOM-0019",
    "description": "Experience the exceptional craftsmanship of the Tailored Darted Crepe Evening Trousers. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury Tailored Darted Crepe Evening Trousers engineered with uncompromising material quality and British standards.",
    "price": 2899,
    "compareAtPrice": 3899,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Trousers",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Women",
    "stock": 66,
    "tags": [
      "Women Wear",
      "Trousers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 79,
    "status": "active"
  },
  {
    "name": "Hand-Rolled Mulberry Silk Twill Scarf",
    "slug": "hand-rolled-mulberry-silk-twill-scarf",
    "sku": "VEX-WOM-0020",
    "description": "Experience the exceptional craftsmanship of the Hand-Rolled Mulberry Silk Twill Scarf. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury Hand-Rolled Mulberry Silk Twill Scarf engineered with uncompromising material quality and British standards.",
    "price": 1799,
    "compareAtPrice": 2399,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Accessories",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Women",
    "stock": 73,
    "tags": [
      "Women Wear",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 92,
    "status": "active"
  },
  {
    "name": "Sculpted Italian Calfskin Waist Belt",
    "slug": "sculpted-italian-calfskin-waist-belt",
    "sku": "VEX-WOM-0021",
    "description": "Experience the exceptional craftsmanship of the Sculpted Italian Calfskin Waist Belt. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury Sculpted Italian Calfskin Waist Belt engineered with uncompromising material quality and British standards.",
    "price": 1499,
    "compareAtPrice": 1999,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Accessories",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Women",
    "stock": 80,
    "tags": [
      "Women Wear",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 105,
    "status": "active"
  },
  {
    "name": "Summer Flowy Lace Trim Linen Halter Top",
    "slug": "summer-flowy-lace-trim-linen-halter-top",
    "sku": "VEX-WOM-0022",
    "description": "Experience the exceptional craftsmanship of the Summer Flowy Lace Trim Linen Halter Top. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Women Wear collection.",
    "shortDescription": "Curated luxury Summer Flowy Lace Trim Linen Halter Top engineered with uncompromising material quality and British standards.",
    "price": 1699,
    "compareAtPrice": 2299,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Tops",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Women",
    "stock": 87,
    "tags": [
      "Women Wear",
      "Tops",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 118,
    "status": "active"
  },
  {
    "name": "The Savile Row Oxford Cotton Button-Down",
    "slug": "the-savile-row-oxford-cotton-button-down",
    "sku": "VEX-MEN-0023",
    "description": "Experience the exceptional craftsmanship of the The Savile Row Oxford Cotton Button-Down. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury The Savile Row Oxford Cotton Button-Down engineered with uncompromising material quality and British standards.",
    "price": 2199,
    "compareAtPrice": 2999,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Shirts",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Men",
    "stock": 30,
    "tags": [
      "Men Wear",
      "Shirts",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 25,
    "status": "active"
  },
  {
    "name": "Egyptian Giza Long-Staple Linen Overshirt",
    "slug": "egyptian-giza-long-staple-linen-overshirt",
    "sku": "VEX-MEN-0024",
    "description": "Experience the exceptional craftsmanship of the Egyptian Giza Long-Staple Linen Overshirt. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury Egyptian Giza Long-Staple Linen Overshirt engineered with uncompromising material quality and British standards.",
    "price": 2599,
    "compareAtPrice": 3499,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Shirts",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Men",
    "stock": 37,
    "tags": [
      "Men Wear",
      "Shirts",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 38,
    "status": "active"
  },
  {
    "name": "Bespoke Tailored Spread Collar Dress Shirt",
    "slug": "bespoke-tailored-spread-collar-dress-shirt",
    "sku": "VEX-MEN-0025",
    "description": "Experience the exceptional craftsmanship of the Bespoke Tailored Spread Collar Dress Shirt. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury Bespoke Tailored Spread Collar Dress Shirt engineered with uncompromising material quality and British standards.",
    "price": 3099,
    "compareAtPrice": 4199,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Shirts",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Men",
    "stock": 44,
    "tags": [
      "Men Wear",
      "Shirts",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 51,
    "status": "active"
  },
  {
    "name": "Camp Collar Slub Linen Summer Shirt",
    "slug": "camp-collar-slub-linen-summer-shirt",
    "sku": "VEX-MEN-0026",
    "description": "Experience the exceptional craftsmanship of the Camp Collar Slub Linen Summer Shirt. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury Camp Collar Slub Linen Summer Shirt engineered with uncompromising material quality and British standards.",
    "price": 1899,
    "compareAtPrice": 2599,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Shirts",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Men",
    "stock": 51,
    "tags": [
      "Men Wear",
      "Shirts",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 64,
    "status": "active"
  },
  {
    "name": "Combed Organic Heavyweight 280gsm Crewneck Tee",
    "slug": "combed-organic-heavyweight-280gsm-crewneck-tee",
    "sku": "VEX-MEN-0027",
    "description": "Experience the exceptional craftsmanship of the Combed Organic Heavyweight 280gsm Crewneck Tee. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury Combed Organic Heavyweight 280gsm Crewneck Tee engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "T-shirts",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Men",
    "stock": 58,
    "tags": [
      "Men Wear",
      "T-shirts",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 77,
    "status": "active"
  },
  {
    "name": "Pima Cotton Minimalist Relaxed Pocket Tee",
    "slug": "pima-cotton-minimalist-relaxed-pocket-tee",
    "sku": "VEX-MEN-0028",
    "description": "Experience the exceptional craftsmanship of the Pima Cotton Minimalist Relaxed Pocket Tee. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury Pima Cotton Minimalist Relaxed Pocket Tee engineered with uncompromising material quality and British standards.",
    "price": 1099,
    "compareAtPrice": 1499,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "T-shirts",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Men",
    "stock": 65,
    "tags": [
      "Men Wear",
      "T-shirts",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 90,
    "status": "active"
  },
  {
    "name": "Washed Vintage Heavyweight Texture Tee",
    "slug": "washed-vintage-heavyweight-texture-tee",
    "sku": "VEX-MEN-0029",
    "description": "Experience the exceptional craftsmanship of the Washed Vintage Heavyweight Texture Tee. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury Washed Vintage Heavyweight Texture Tee engineered with uncompromising material quality and British standards.",
    "price": 1199,
    "compareAtPrice": 1599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "T-shirts",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Men",
    "stock": 72,
    "tags": [
      "Men Wear",
      "T-shirts",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 103,
    "status": "active"
  },
  {
    "name": "Supima Cotton Slub Texture Henley Shirt",
    "slug": "supima-cotton-slub-texture-henley-shirt",
    "sku": "VEX-MEN-0030",
    "description": "Experience the exceptional craftsmanship of the Supima Cotton Slub Texture Henley Shirt. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury Supima Cotton Slub Texture Henley Shirt engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "T-shirts",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Men",
    "stock": 79,
    "tags": [
      "Men Wear",
      "T-shirts",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 116,
    "status": "active"
  },
  {
    "name": "The Kensington Super 120s Double-Pleat Trouser",
    "slug": "the-kensington-super-120s-double-pleat-trouser",
    "sku": "VEX-MEN-0031",
    "description": "Experience the exceptional craftsmanship of the The Kensington Super 120s Double-Pleat Trouser. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury The Kensington Super 120s Double-Pleat Trouser engineered with uncompromising material quality and British standards.",
    "price": 3799,
    "compareAtPrice": 5099,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Trousers",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Men",
    "stock": 86,
    "tags": [
      "Men Wear",
      "Trousers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 129,
    "status": "active"
  },
  {
    "name": "Relaxed Italian Wool Flannel Drawstring Pant",
    "slug": "relaxed-italian-wool-flannel-drawstring-pant",
    "sku": "VEX-MEN-0032",
    "description": "Experience the exceptional craftsmanship of the Relaxed Italian Wool Flannel Drawstring Pant. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury Relaxed Italian Wool Flannel Drawstring Pant engineered with uncompromising material quality and British standards.",
    "price": 3399,
    "compareAtPrice": 4599,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Trousers",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Men",
    "stock": 93,
    "tags": [
      "Men Wear",
      "Trousers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 142,
    "status": "active"
  },
  {
    "name": "Organic Heavy Cotton Chino Straight Trousers",
    "slug": "organic-heavy-cotton-chino-straight-trousers",
    "sku": "VEX-MEN-0033",
    "description": "Experience the exceptional craftsmanship of the Organic Heavy Cotton Chino Straight Trousers. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury Organic Heavy Cotton Chino Straight Trousers engineered with uncompromising material quality and British standards.",
    "price": 2499,
    "compareAtPrice": 3399,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Trousers",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Men",
    "stock": 100,
    "tags": [
      "Men Wear",
      "Trousers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 155,
    "status": "active"
  },
  {
    "name": "Tailored Herringbone Wool Sartorial Trouser",
    "slug": "tailored-herringbone-wool-sartorial-trouser",
    "sku": "VEX-MEN-0034",
    "description": "Experience the exceptional craftsmanship of the Tailored Herringbone Wool Sartorial Trouser. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury Tailored Herringbone Wool Sartorial Trouser engineered with uncompromising material quality and British standards.",
    "price": 3899,
    "compareAtPrice": 5299,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Trousers",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Men",
    "stock": 107,
    "tags": [
      "Men Wear",
      "Trousers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 168,
    "status": "active"
  },
  {
    "name": "The Mayfair Double-Faced Camel Wool Overcoat",
    "slug": "the-mayfair-double-faced-camel-wool-overcoat",
    "sku": "VEX-MEN-0035",
    "description": "Experience the exceptional craftsmanship of the The Mayfair Double-Faced Camel Wool Overcoat. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury The Mayfair Double-Faced Camel Wool Overcoat engineered with uncompromising material quality and British standards.",
    "price": 8299,
    "compareAtPrice": 11199,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Jackets",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Men",
    "stock": 114,
    "tags": [
      "Men Wear",
      "Jackets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 181,
    "status": "active"
  },
  {
    "name": "Architectural 500gsm GOTS French Terry Hoodie",
    "slug": "architectural-500gsm-gots-french-terry-hoodie",
    "sku": "VEX-MEN-0036",
    "description": "Experience the exceptional craftsmanship of the Architectural 500gsm GOTS French Terry Hoodie. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury Architectural 500gsm GOTS French Terry Hoodie engineered with uncompromising material quality and British standards.",
    "price": 2699,
    "compareAtPrice": 3599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Jackets",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Men",
    "stock": 31,
    "tags": [
      "Men Wear",
      "Jackets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 194,
    "status": "active"
  },
  {
    "name": "Minimalist Lambskin Leather Bomber Jacket",
    "slug": "minimalist-lambskin-leather-bomber-jacket",
    "sku": "VEX-MEN-0037",
    "description": "Experience the exceptional craftsmanship of the Minimalist Lambskin Leather Bomber Jacket. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury Minimalist Lambskin Leather Bomber Jacket engineered with uncompromising material quality and British standards.",
    "price": 8999,
    "compareAtPrice": 12199,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Jackets",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Men",
    "stock": 38,
    "tags": [
      "Men Wear",
      "Jackets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 27,
    "status": "active"
  },
  {
    "name": "Water-Resistant Technical Mac Field Coat",
    "slug": "water-resistant-technical-mac-field-coat",
    "sku": "VEX-MEN-0038",
    "description": "Experience the exceptional craftsmanship of the Water-Resistant Technical Mac Field Coat. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury Water-Resistant Technical Mac Field Coat engineered with uncompromising material quality and British standards.",
    "price": 5899,
    "compareAtPrice": 7999,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Jackets",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Men",
    "stock": 45,
    "tags": [
      "Men Wear",
      "Jackets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 40,
    "status": "active"
  },
  {
    "name": "British Wool Tweed Tailored Single-Breasted Blazer",
    "slug": "british-wool-tweed-tailored-single-breasted-blazer",
    "sku": "VEX-MEN-0039",
    "description": "Experience the exceptional craftsmanship of the British Wool Tweed Tailored Single-Breasted Blazer. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury British Wool Tweed Tailored Single-Breasted Blazer engineered with uncompromising material quality and British standards.",
    "price": 6699,
    "compareAtPrice": 9099,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Jackets",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Men",
    "stock": 52,
    "tags": [
      "Men Wear",
      "Jackets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 53,
    "status": "active"
  },
  {
    "name": "Soft Suede Harrington Zip-Up Overshirt",
    "slug": "soft-suede-harrington-zip-up-overshirt",
    "sku": "VEX-MEN-0040",
    "description": "Experience the exceptional craftsmanship of the Soft Suede Harrington Zip-Up Overshirt. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury Soft Suede Harrington Zip-Up Overshirt engineered with uncompromising material quality and British standards.",
    "price": 4999,
    "compareAtPrice": 6799,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Jackets",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Men",
    "stock": 59,
    "tags": [
      "Men Wear",
      "Jackets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 66,
    "status": "active"
  },
  {
    "name": "Full-Grain Bridle Leather Dress Belt",
    "slug": "full-grain-bridle-leather-dress-belt",
    "sku": "VEX-MEN-0041",
    "description": "Experience the exceptional craftsmanship of the Full-Grain Bridle Leather Dress Belt. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury Full-Grain Bridle Leather Dress Belt engineered with uncompromising material quality and British standards.",
    "price": 1599,
    "compareAtPrice": 2199,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=800&q=80&sig=118",
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=800&q=80&sig=118",
    "hoverImage": "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Accessories",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Men",
    "stock": 66,
    "tags": [
      "Men Wear",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 79,
    "status": "active"
  },
  {
    "name": "Merino Wool Fine-Rib Knitted Tie",
    "slug": "merino-wool-fine-rib-knitted-tie",
    "sku": "VEX-MEN-0042",
    "description": "Experience the exceptional craftsmanship of the Merino Wool Fine-Rib Knitted Tie. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury Merino Wool Fine-Rib Knitted Tie engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Accessories",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Men",
    "stock": 73,
    "tags": [
      "Men Wear",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 92,
    "status": "active"
  },
  {
    "name": "Polished Solid Brass Minimalist Cufflinks",
    "slug": "polished-solid-brass-minimalist-cufflinks",
    "sku": "VEX-MEN-0043",
    "description": "Experience the exceptional craftsmanship of the Polished Solid Brass Minimalist Cufflinks. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury Polished Solid Brass Minimalist Cufflinks engineered with uncompromising material quality and British standards.",
    "price": 1199,
    "compareAtPrice": 1599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Accessories",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Men",
    "stock": 80,
    "tags": [
      "Men Wear",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 105,
    "status": "active"
  },
  {
    "name": "Handcrafted Pebble Grain Cardholder Case",
    "slug": "handcrafted-pebble-grain-cardholder-case",
    "sku": "VEX-MEN-0044",
    "description": "Experience the exceptional craftsmanship of the Handcrafted Pebble Grain Cardholder Case. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Men Wear collection.",
    "shortDescription": "Curated luxury Handcrafted Pebble Grain Cardholder Case engineered with uncompromising material quality and British standards.",
    "price": 1099,
    "compareAtPrice": 1499,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Accessories",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Men",
    "stock": 87,
    "tags": [
      "Men Wear",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 118,
    "status": "active"
  },
  {
    "name": "Italian Nappa Leather Low-Top Minimalist Sneaker",
    "slug": "italian-nappa-leather-low-top-minimalist-sneaker",
    "sku": "VEX-SHO-0045",
    "description": "Experience the exceptional craftsmanship of the Italian Nappa Leather Low-Top Minimalist Sneaker. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Italian Nappa Leather Low-Top Minimalist Sneaker engineered with uncompromising material quality and British standards.",
    "price": 3799,
    "compareAtPrice": 5099,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Sneakers",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Shoes",
    "stock": 30,
    "tags": [
      "Shoes",
      "Sneakers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 25,
    "status": "active"
  },
  {
    "name": "Retro Court Gumsole Perforated Leather Trainer",
    "slug": "retro-court-gumsole-perforated-leather-trainer",
    "sku": "VEX-SHO-0046",
    "description": "Experience the exceptional craftsmanship of the Retro Court Gumsole Perforated Leather Trainer. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Retro Court Gumsole Perforated Leather Trainer engineered with uncompromising material quality and British standards.",
    "price": 3399,
    "compareAtPrice": 4599,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Sneakers",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Shoes",
    "stock": 37,
    "tags": [
      "Shoes",
      "Sneakers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 38,
    "status": "active"
  },
  {
    "name": "Monochrome Triple-White Vulcanized Cupsole Sneaker",
    "slug": "monochrome-triple-white-vulcanized-cupsole-sneaker",
    "sku": "VEX-SHO-0047",
    "description": "Experience the exceptional craftsmanship of the Monochrome Triple-White Vulcanized Cupsole Sneaker. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Monochrome Triple-White Vulcanized Cupsole Sneaker engineered with uncompromising material quality and British standards.",
    "price": 3099,
    "compareAtPrice": 4199,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Sneakers",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Shoes",
    "stock": 44,
    "tags": [
      "Shoes",
      "Sneakers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 51,
    "status": "active"
  },
  {
    "name": "Suede Contrast-Collar City Walking Sneaker",
    "slug": "suede-contrast-collar-city-walking-sneaker",
    "sku": "VEX-SHO-0048",
    "description": "Experience the exceptional craftsmanship of the Suede Contrast-Collar City Walking Sneaker. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Suede Contrast-Collar City Walking Sneaker engineered with uncompromising material quality and British standards.",
    "price": 3499,
    "compareAtPrice": 4699,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Sneakers",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Shoes",
    "stock": 51,
    "tags": [
      "Shoes",
      "Sneakers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 64,
    "status": "active"
  },
  {
    "name": "Aero-Knit High Performance Cushion Road Runner",
    "slug": "aero-knit-high-performance-cushion-road-runner",
    "sku": "VEX-SHO-0049",
    "description": "Experience the exceptional craftsmanship of the Aero-Knit High Performance Cushion Road Runner. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Aero-Knit High Performance Cushion Road Runner engineered with uncompromising material quality and British standards.",
    "price": 3899,
    "compareAtPrice": 5299,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Running",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Shoes",
    "stock": 58,
    "tags": [
      "Shoes",
      "Running",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 77,
    "status": "active"
  },
  {
    "name": "Trail-Grip All-Weather Outdoor Athletic Trainer",
    "slug": "trail-grip-all-weather-outdoor-athletic-trainer",
    "sku": "VEX-SHO-0050",
    "description": "Experience the exceptional craftsmanship of the Trail-Grip All-Weather Outdoor Athletic Trainer. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Trail-Grip All-Weather Outdoor Athletic Trainer engineered with uncompromising material quality and British standards.",
    "price": 4299,
    "compareAtPrice": 5799,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Running",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Shoes",
    "stock": 65,
    "tags": [
      "Shoes",
      "Running",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 90,
    "status": "active"
  },
  {
    "name": "Breathable Mesh Lightweight Training Sneakers",
    "slug": "breathable-mesh-lightweight-training-sneakers",
    "sku": "VEX-SHO-0051",
    "description": "Experience the exceptional craftsmanship of the Breathable Mesh Lightweight Training Sneakers. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Breathable Mesh Lightweight Training Sneakers engineered with uncompromising material quality and British standards.",
    "price": 2699,
    "compareAtPrice": 3599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Running",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Shoes",
    "stock": 72,
    "tags": [
      "Shoes",
      "Running",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 103,
    "status": "active"
  },
  {
    "name": "Carbon Plate Responsive Marathon Racing Shoe",
    "slug": "carbon-plate-responsive-marathon-racing-shoe",
    "sku": "VEX-SHO-0052",
    "description": "Experience the exceptional craftsmanship of the Carbon Plate Responsive Marathon Racing Shoe. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Carbon Plate Responsive Marathon Racing Shoe engineered with uncompromising material quality and British standards.",
    "price": 5199,
    "compareAtPrice": 6999,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Running",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Shoes",
    "stock": 79,
    "tags": [
      "Shoes",
      "Running",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 116,
    "status": "active"
  },
  {
    "name": "Artisanal Tuscan Leather Chelsea Ankle Boot",
    "slug": "artisanal-tuscan-leather-chelsea-ankle-boot",
    "sku": "VEX-SHO-0053",
    "description": "Experience the exceptional craftsmanship of the Artisanal Tuscan Leather Chelsea Ankle Boot. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Artisanal Tuscan Leather Chelsea Ankle Boot engineered with uncompromising material quality and British standards.",
    "price": 5499,
    "compareAtPrice": 7399,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1465453869711-7e174808ace9?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Boots",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Shoes",
    "stock": 86,
    "tags": [
      "Shoes",
      "Boots",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 129,
    "status": "active"
  },
  {
    "name": "Goodyear-Welted Cap Toe Combat Leather Boot",
    "slug": "goodyear-welted-cap-toe-combat-leather-boot",
    "sku": "VEX-SHO-0054",
    "description": "Experience the exceptional craftsmanship of the Goodyear-Welted Cap Toe Combat Leather Boot. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Goodyear-Welted Cap Toe Combat Leather Boot engineered with uncompromising material quality and British standards.",
    "price": 6199,
    "compareAtPrice": 8399,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Boots",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Shoes",
    "stock": 93,
    "tags": [
      "Shoes",
      "Boots",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 142,
    "status": "active"
  },
  {
    "name": "Waterproof Nubuck Vibram Lug Sole Field Boot",
    "slug": "waterproof-nubuck-vibram-lug-sole-field-boot",
    "sku": "VEX-SHO-0055",
    "description": "Experience the exceptional craftsmanship of the Waterproof Nubuck Vibram Lug Sole Field Boot. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Waterproof Nubuck Vibram Lug Sole Field Boot engineered with uncompromising material quality and British standards.",
    "price": 4999,
    "compareAtPrice": 6799,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1465453869711-7e174808ace9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1465453869711-7e174808ace9?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Boots",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Shoes",
    "stock": 100,
    "tags": [
      "Shoes",
      "Boots",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 155,
    "status": "active"
  },
  {
    "name": "Desert Suede Handcrafted Crepe Sole Chukka Boot",
    "slug": "desert-suede-handcrafted-crepe-sole-chukka-boot",
    "sku": "VEX-SHO-0056",
    "description": "Experience the exceptional craftsmanship of the Desert Suede Handcrafted Crepe Sole Chukka Boot. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Desert Suede Handcrafted Crepe Sole Chukka Boot engineered with uncompromising material quality and British standards.",
    "price": 4499,
    "compareAtPrice": 6099,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Boots",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Shoes",
    "stock": 107,
    "tags": [
      "Shoes",
      "Boots",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 168,
    "status": "active"
  },
  {
    "name": "Handmade Penny Loafers in Polished Box Calfskin",
    "slug": "handmade-penny-loafers-in-polished-box-calfskin",
    "sku": "VEX-SHO-0057",
    "description": "Experience the exceptional craftsmanship of the Handmade Penny Loafers in Polished Box Calfskin. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Handmade Penny Loafers in Polished Box Calfskin engineered with uncompromising material quality and British standards.",
    "price": 4899,
    "compareAtPrice": 6599,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Loafers",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Shoes",
    "stock": 114,
    "tags": [
      "Shoes",
      "Loafers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 181,
    "status": "active"
  },
  {
    "name": "Soft Suede Venetian Driving Loafer Slippers",
    "slug": "soft-suede-venetian-driving-loafer-slippers",
    "sku": "VEX-SHO-0058",
    "description": "Experience the exceptional craftsmanship of the Soft Suede Venetian Driving Loafer Slippers. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Soft Suede Venetian Driving Loafer Slippers engineered with uncompromising material quality and British standards.",
    "price": 4099,
    "compareAtPrice": 5499,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Loafers",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Shoes",
    "stock": 31,
    "tags": [
      "Shoes",
      "Loafers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 194,
    "status": "active"
  },
  {
    "name": "Horsebit Buckle Moccasin Loafer in Espresso Brown",
    "slug": "horsebit-buckle-moccasin-loafer-in-espresso-brown",
    "sku": "VEX-SHO-0059",
    "description": "Experience the exceptional craftsmanship of the Horsebit Buckle Moccasin Loafer in Espresso Brown. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Horsebit Buckle Moccasin Loafer in Espresso Brown engineered with uncompromising material quality and British standards.",
    "price": 4599,
    "compareAtPrice": 6199,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Loafers",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Shoes",
    "stock": 38,
    "tags": [
      "Shoes",
      "Loafers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 27,
    "status": "active"
  },
  {
    "name": "Hand-Stitched Vegetable Tanned Leather Strap Sandal",
    "slug": "hand-stitched-vegetable-tanned-leather-strap-sandal",
    "sku": "VEX-SHO-0060",
    "description": "Experience the exceptional craftsmanship of the Hand-Stitched Vegetable Tanned Leather Strap Sandal. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Hand-Stitched Vegetable Tanned Leather Strap Sandal engineered with uncompromising material quality and British standards.",
    "price": 2399,
    "compareAtPrice": 3199,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Sandals",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Shoes",
    "stock": 45,
    "tags": [
      "Shoes",
      "Sandals",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 40,
    "status": "active"
  },
  {
    "name": "Ergonomic Cork-Footbed Dual Buckle Slide Sandal",
    "slug": "ergonomic-cork-footbed-dual-buckle-slide-sandal",
    "sku": "VEX-SHO-0061",
    "description": "Experience the exceptional craftsmanship of the Ergonomic Cork-Footbed Dual Buckle Slide Sandal. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Ergonomic Cork-Footbed Dual Buckle Slide Sandal engineered with uncompromising material quality and British standards.",
    "price": 2099,
    "compareAtPrice": 2799,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Sandals",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Shoes",
    "stock": 52,
    "tags": [
      "Shoes",
      "Sandals",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 53,
    "status": "active"
  },
  {
    "name": "Braided Leather Flat Summer Resort Sandal",
    "slug": "braided-leather-flat-summer-resort-sandal",
    "sku": "VEX-SHO-0062",
    "description": "Experience the exceptional craftsmanship of the Braided Leather Flat Summer Resort Sandal. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Braided Leather Flat Summer Resort Sandal engineered with uncompromising material quality and British standards.",
    "price": 1899,
    "compareAtPrice": 2599,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Sandals",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Shoes",
    "stock": 59,
    "tags": [
      "Shoes",
      "Sandals",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 66,
    "status": "active"
  },
  {
    "name": "Woven Leather Minimalist Cross-Strap Mule",
    "slug": "woven-leather-minimalist-cross-strap-mule",
    "sku": "VEX-SHO-0063",
    "description": "Experience the exceptional craftsmanship of the Woven Leather Minimalist Cross-Strap Mule. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Woven Leather Minimalist Cross-Strap Mule engineered with uncompromising material quality and British standards.",
    "price": 2199,
    "compareAtPrice": 2999,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Sandals",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Shoes",
    "stock": 66,
    "tags": [
      "Shoes",
      "Sandals",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 79,
    "status": "active"
  },
  {
    "name": "Pointed Toe Leather Ballet Flat with Bow Detail",
    "slug": "pointed-toe-leather-ballet-flat-with-bow-detail",
    "sku": "VEX-SHO-0064",
    "description": "Experience the exceptional craftsmanship of the Pointed Toe Leather Ballet Flat with Bow Detail. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Pointed Toe Leather Ballet Flat with Bow Detail engineered with uncompromising material quality and British standards.",
    "price": 2599,
    "compareAtPrice": 3499,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Flats",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Shoes",
    "stock": 73,
    "tags": [
      "Shoes",
      "Flats",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 92,
    "status": "active"
  },
  {
    "name": "Cedar Wood Adjustable Shoe Tree Keepers Pair",
    "slug": "cedar-wood-adjustable-shoe-tree-keepers-pair",
    "sku": "VEX-SHO-0065",
    "description": "Experience the exceptional craftsmanship of the Cedar Wood Adjustable Shoe Tree Keepers Pair. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Cedar Wood Adjustable Shoe Tree Keepers Pair engineered with uncompromising material quality and British standards.",
    "price": 899,
    "compareAtPrice": 1199,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Shoe Care",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Shoes",
    "stock": 80,
    "tags": [
      "Shoes",
      "Shoe Care",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 105,
    "status": "active"
  },
  {
    "name": "Organic Beeswax & Leather Nourishing Conditioner",
    "slug": "organic-beeswax-leather-nourishing-conditioner",
    "sku": "VEX-SHO-0066",
    "description": "Experience the exceptional craftsmanship of the Organic Beeswax & Leather Nourishing Conditioner. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Shoes collection.",
    "shortDescription": "Curated luxury Organic Beeswax & Leather Nourishing Conditioner engineered with uncompromising material quality and British standards.",
    "price": 699,
    "compareAtPrice": 899,
    "discount": 22,
    "images": [
      "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Shoe Care",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Shoes",
    "stock": 87,
    "tags": [
      "Shoes",
      "Shoe Care",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 118,
    "status": "active"
  },
  {
    "name": "VEXIVO Aethel Wireless ANC Studio Headphones",
    "slug": "vexivo-aethel-wireless-anc-studio-headphones",
    "sku": "VEX-ELE-0067",
    "description": "Experience the exceptional craftsmanship of the VEXIVO Aethel Wireless ANC Studio Headphones. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury VEXIVO Aethel Wireless ANC Studio Headphones engineered with uncompromising material quality and British standards.",
    "price": 6999,
    "compareAtPrice": 9499,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Headphones",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Electronics",
    "stock": 30,
    "tags": [
      "Electronics",
      "Headphones",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 25,
    "status": "active"
  },
  {
    "name": "Star Loop Spatial Audio True Wireless Earbuds",
    "slug": "star-loop-spatial-audio-true-wireless-earbuds",
    "sku": "VEX-ELE-0068",
    "description": "Experience the exceptional craftsmanship of the Star Loop Spatial Audio True Wireless Earbuds. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury Star Loop Spatial Audio True Wireless Earbuds engineered with uncompromising material quality and British standards.",
    "price": 3899,
    "compareAtPrice": 5299,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Earbuds",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Electronics",
    "stock": 37,
    "tags": [
      "Electronics",
      "Earbuds",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 38,
    "status": "active"
  },
  {
    "name": "Noise-Isolating In-Ear Reference Monitors",
    "slug": "noise-isolating-in-ear-reference-monitors",
    "sku": "VEX-ELE-0069",
    "description": "Experience the exceptional craftsmanship of the Noise-Isolating In-Ear Reference Monitors. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury Noise-Isolating In-Ear Reference Monitors engineered with uncompromising material quality and British standards.",
    "price": 2799,
    "compareAtPrice": 3799,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Earbuds",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Electronics",
    "stock": 44,
    "tags": [
      "Electronics",
      "Earbuds",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 51,
    "status": "active"
  },
  {
    "name": "Dual-Driver Wireless Gaming Headset with Boom Mic",
    "slug": "dual-driver-wireless-gaming-headset-with-boom-mic",
    "sku": "VEX-ELE-0070",
    "description": "Experience the exceptional craftsmanship of the Dual-Driver Wireless Gaming Headset with Boom Mic. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury Dual-Driver Wireless Gaming Headset with Boom Mic engineered with uncompromising material quality and British standards.",
    "price": 4699,
    "compareAtPrice": 6399,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Headphones",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Electronics",
    "stock": 51,
    "tags": [
      "Electronics",
      "Headphones",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 64,
    "status": "active"
  },
  {
    "name": "Custom Gasket-Mount Mechanical Keyboard with Brass Plate",
    "slug": "custom-gasket-mount-mechanical-keyboard-with-brass-plate",
    "sku": "VEX-ELE-0071",
    "description": "Experience the exceptional craftsmanship of the Custom Gasket-Mount Mechanical Keyboard with Brass Plate. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury Custom Gasket-Mount Mechanical Keyboard with Brass Plate engineered with uncompromising material quality and British standards.",
    "price": 5199,
    "compareAtPrice": 6999,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Keyboards",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Electronics",
    "stock": 58,
    "tags": [
      "Electronics",
      "Keyboards",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 77,
    "status": "active"
  },
  {
    "name": "Ultra-Slim Multi-Device Wireless Mechanical Keyboard",
    "slug": "ultra-slim-multi-device-wireless-mechanical-keyboard",
    "sku": "VEX-ELE-0072",
    "description": "Experience the exceptional craftsmanship of the Ultra-Slim Multi-Device Wireless Mechanical Keyboard. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury Ultra-Slim Multi-Device Wireless Mechanical Keyboard engineered with uncompromising material quality and British standards.",
    "price": 3499,
    "compareAtPrice": 4699,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Keyboards",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Electronics",
    "stock": 65,
    "tags": [
      "Electronics",
      "Keyboards",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 90,
    "status": "active"
  },
  {
    "name": "Braided Aviation USB-C Mechanical Keyboard Coiled Cable",
    "slug": "braided-aviation-usb-c-mechanical-keyboard-coiled-cable",
    "sku": "VEX-ELE-0073",
    "description": "Experience the exceptional craftsmanship of the Braided Aviation USB-C Mechanical Keyboard Coiled Cable. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury Braided Aviation USB-C Mechanical Keyboard Coiled Cable engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Keyboards",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Electronics",
    "stock": 72,
    "tags": [
      "Electronics",
      "Keyboards",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 103,
    "status": "active"
  },
  {
    "name": "Precision Wireless Ergonomic Trackball Mouse",
    "slug": "precision-wireless-ergonomic-trackball-mouse",
    "sku": "VEX-ELE-0074",
    "description": "Experience the exceptional craftsmanship of the Precision Wireless Ergonomic Trackball Mouse. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury Precision Wireless Ergonomic Trackball Mouse engineered with uncompromising material quality and British standards.",
    "price": 2499,
    "compareAtPrice": 3399,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Mice",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Electronics",
    "stock": 79,
    "tags": [
      "Electronics",
      "Mice",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 116,
    "status": "active"
  },
  {
    "name": "Titanium Smart Watch Series 8 with ECG Sensor",
    "slug": "titanium-smart-watch-series-8-with-ecg-sensor",
    "sku": "VEX-ELE-0075",
    "description": "Experience the exceptional craftsmanship of the Titanium Smart Watch Series 8 with ECG Sensor. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury Titanium Smart Watch Series 8 with ECG Sensor engineered with uncompromising material quality and British standards.",
    "price": 7799,
    "compareAtPrice": 10499,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Smartwatches",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Electronics",
    "stock": 86,
    "tags": [
      "Electronics",
      "Smartwatches",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 129,
    "status": "active"
  },
  {
    "name": "Smart Fitness Tracker Band with Heart Health Monitor",
    "slug": "smart-fitness-tracker-band-with-heart-health-monitor",
    "sku": "VEX-ELE-0076",
    "description": "Experience the exceptional craftsmanship of the Smart Fitness Tracker Band with Heart Health Monitor. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury Smart Fitness Tracker Band with Heart Health Monitor engineered with uncompromising material quality and British standards.",
    "price": 2199,
    "compareAtPrice": 2999,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Smartwatches",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Electronics",
    "stock": 93,
    "tags": [
      "Electronics",
      "Smartwatches",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 142,
    "status": "active"
  },
  {
    "name": "High-Fidelity Solid Walnut Desktop Studio Monitors",
    "slug": "high-fidelity-solid-walnut-desktop-studio-monitors",
    "sku": "VEX-ELE-0077",
    "description": "Experience the exceptional craftsmanship of the High-Fidelity Solid Walnut Desktop Studio Monitors. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury High-Fidelity Solid Walnut Desktop Studio Monitors engineered with uncompromising material quality and British standards.",
    "price": 8999,
    "compareAtPrice": 12199,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Speakers",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Electronics",
    "stock": 100,
    "tags": [
      "Electronics",
      "Speakers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 155,
    "status": "active"
  },
  {
    "name": "Portable Bluetooth 360 Acoustic Speaker in Matte Graphite",
    "slug": "portable-bluetooth-360-acoustic-speaker-in-matte-graphite",
    "sku": "VEX-ELE-0078",
    "description": "Experience the exceptional craftsmanship of the Portable Bluetooth 360 Acoustic Speaker in Matte Graphite. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury Portable Bluetooth 360 Acoustic Speaker in Matte Graphite engineered with uncompromising material quality and British standards.",
    "price": 3299,
    "compareAtPrice": 4499,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Speakers",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Electronics",
    "stock": 107,
    "tags": [
      "Electronics",
      "Speakers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 168,
    "status": "active"
  },
  {
    "name": "Broadcast USB Condenser Microphone with Pop Filter",
    "slug": "broadcast-usb-condenser-microphone-with-pop-filter",
    "sku": "VEX-ELE-0079",
    "description": "Experience the exceptional craftsmanship of the Broadcast USB Condenser Microphone with Pop Filter. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury Broadcast USB Condenser Microphone with Pop Filter engineered with uncompromising material quality and British standards.",
    "price": 3799,
    "compareAtPrice": 5099,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Audio",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Electronics",
    "stock": 114,
    "tags": [
      "Electronics",
      "Audio",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 181,
    "status": "active"
  },
  {
    "name": "High-Resolution Balanced Headphone DAC Amplifier",
    "slug": "high-resolution-balanced-headphone-dac-amplifier",
    "sku": "VEX-ELE-0080",
    "description": "Experience the exceptional craftsmanship of the High-Resolution Balanced Headphone DAC Amplifier. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury High-Resolution Balanced Headphone DAC Amplifier engineered with uncompromising material quality and British standards.",
    "price": 4499,
    "compareAtPrice": 6099,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Audio",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Electronics",
    "stock": 31,
    "tags": [
      "Electronics",
      "Audio",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 194,
    "status": "active"
  },
  {
    "name": "Studio Microphone Boom Arm with Hidden Cable Channels",
    "slug": "studio-microphone-boom-arm-with-hidden-cable-channels",
    "sku": "VEX-ELE-0081",
    "description": "Experience the exceptional craftsmanship of the Studio Microphone Boom Arm with Hidden Cable Channels. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury Studio Microphone Boom Arm with Hidden Cable Channels engineered with uncompromising material quality and British standards.",
    "price": 1799,
    "compareAtPrice": 2399,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Audio",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Electronics",
    "stock": 38,
    "tags": [
      "Electronics",
      "Audio",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 27,
    "status": "active"
  },
  {
    "name": "Magnetic Wireless Fast-Charging Stand 3-in-1",
    "slug": "magnetic-wireless-fast-charging-stand-3-in-1",
    "sku": "VEX-ELE-0082",
    "description": "Experience the exceptional craftsmanship of the Magnetic Wireless Fast-Charging Stand 3-in-1. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury Magnetic Wireless Fast-Charging Stand 3-in-1 engineered with uncompromising material quality and British standards.",
    "price": 1699,
    "compareAtPrice": 2299,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Chargers",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Electronics",
    "stock": 45,
    "tags": [
      "Electronics",
      "Chargers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 40,
    "status": "active"
  },
  {
    "name": "Compact Multi-Port GaN 100W Fast Travel Charger",
    "slug": "compact-multi-port-gan-100w-fast-travel-charger",
    "sku": "VEX-ELE-0083",
    "description": "Experience the exceptional craftsmanship of the Compact Multi-Port GaN 100W Fast Travel Charger. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury Compact Multi-Port GaN 100W Fast Travel Charger engineered with uncompromising material quality and British standards.",
    "price": 1399,
    "compareAtPrice": 1899,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Chargers",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Electronics",
    "stock": 52,
    "tags": [
      "Electronics",
      "Chargers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 53,
    "status": "active"
  },
  {
    "name": "Ambient Smart LED Desk Bar with Auto-Dimming",
    "slug": "ambient-smart-led-desk-bar-with-auto-dimming",
    "sku": "VEX-ELE-0084",
    "description": "Experience the exceptional craftsmanship of the Ambient Smart LED Desk Bar with Auto-Dimming. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury Ambient Smart LED Desk Bar with Auto-Dimming engineered with uncompromising material quality and British standards.",
    "price": 2099,
    "compareAtPrice": 2799,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Desk Accessories",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Electronics",
    "stock": 59,
    "tags": [
      "Electronics",
      "Desk Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 66,
    "status": "active"
  },
  {
    "name": "True 4K Streaming Webcam with Ring Light",
    "slug": "true-4k-streaming-webcam-with-ring-light",
    "sku": "VEX-ELE-0085",
    "description": "Experience the exceptional craftsmanship of the True 4K Streaming Webcam with Ring Light. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury True 4K Streaming Webcam with Ring Light engineered with uncompromising material quality and British standards.",
    "price": 3099,
    "compareAtPrice": 4199,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Desk Accessories",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Electronics",
    "stock": 66,
    "tags": [
      "Electronics",
      "Desk Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 79,
    "status": "active"
  },
  {
    "name": "Aluminum Adjustable Laptop & Monitor Riser Stand",
    "slug": "aluminum-adjustable-laptop-monitor-riser-stand",
    "sku": "VEX-ELE-0086",
    "description": "Experience the exceptional craftsmanship of the Aluminum Adjustable Laptop & Monitor Riser Stand. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury Aluminum Adjustable Laptop & Monitor Riser Stand engineered with uncompromising material quality and British standards.",
    "price": 1899,
    "compareAtPrice": 2599,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Desk Accessories",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Electronics",
    "stock": 73,
    "tags": [
      "Electronics",
      "Desk Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 92,
    "status": "active"
  },
  {
    "name": "Premium Top-Grain Leather Desk Mat & Mousepad",
    "slug": "premium-top-grain-leather-desk-mat-mousepad",
    "sku": "VEX-ELE-0087",
    "description": "Experience the exceptional craftsmanship of the Premium Top-Grain Leather Desk Mat & Mousepad. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury Premium Top-Grain Leather Desk Mat & Mousepad engineered with uncompromising material quality and British standards.",
    "price": 1499,
    "compareAtPrice": 1999,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Desk Accessories",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Electronics",
    "stock": 80,
    "tags": [
      "Electronics",
      "Desk Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 105,
    "status": "active"
  },
  {
    "name": "Minimalist Felt Sleeve Case for 16-Inch MacBook Pro",
    "slug": "minimalist-felt-sleeve-case-for-16-inch-macbook-pro",
    "sku": "VEX-ELE-0088",
    "description": "Experience the exceptional craftsmanship of the Minimalist Felt Sleeve Case for 16-Inch MacBook Pro. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Electronics collection.",
    "shortDescription": "Curated luxury Minimalist Felt Sleeve Case for 16-Inch MacBook Pro engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Desk Accessories",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Electronics",
    "stock": 87,
    "tags": [
      "Electronics",
      "Desk Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 118,
    "status": "active"
  },
  {
    "name": "Botanical Resurfacing 0.1% Retinal Night Serum 50ml",
    "slug": "botanical-resurfacing-0-1-retinal-night-serum-50ml",
    "sku": "VEX-BEA-0089",
    "description": "Experience the exceptional craftsmanship of the Botanical Resurfacing 0.1% Retinal Night Serum 50ml. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Botanical Resurfacing 0.1% Retinal Night Serum 50ml engineered with uncompromising material quality and British standards.",
    "price": 1799,
    "compareAtPrice": 2399,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Serums",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Beauty",
    "stock": 30,
    "tags": [
      "Beauty",
      "Serums",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 25,
    "status": "active"
  },
  {
    "name": "Bio-Fermented Squalane & Hyaluronic Hydration Dew",
    "slug": "bio-fermented-squalane-hyaluronic-hydration-dew",
    "sku": "VEX-BEA-0090",
    "description": "Experience the exceptional craftsmanship of the Bio-Fermented Squalane & Hyaluronic Hydration Dew. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Bio-Fermented Squalane & Hyaluronic Hydration Dew engineered with uncompromising material quality and British standards.",
    "price": 1499,
    "compareAtPrice": 1999,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Serums",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Beauty",
    "stock": 37,
    "tags": [
      "Beauty",
      "Serums",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 38,
    "status": "active"
  },
  {
    "name": "Vitamin C Radiance Brightening Concentrated Essence",
    "slug": "vitamin-c-radiance-brightening-concentrated-essence",
    "sku": "VEX-BEA-0091",
    "description": "Experience the exceptional craftsmanship of the Vitamin C Radiance Brightening Concentrated Essence. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Vitamin C Radiance Brightening Concentrated Essence engineered with uncompromising material quality and British standards.",
    "price": 1599,
    "compareAtPrice": 2199,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Serums",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Beauty",
    "stock": 44,
    "tags": [
      "Beauty",
      "Serums",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 51,
    "status": "active"
  },
  {
    "name": "Cold-Pressed Rosehip & Marula Restorative Facial Oil",
    "slug": "cold-pressed-rosehip-marula-restorative-facial-oil",
    "sku": "VEX-BEA-0092",
    "description": "Experience the exceptional craftsmanship of the Cold-Pressed Rosehip & Marula Restorative Facial Oil. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Cold-Pressed Rosehip & Marula Restorative Facial Oil engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Oils",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Beauty",
    "stock": 51,
    "tags": [
      "Beauty",
      "Oils",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 64,
    "status": "active"
  },
  {
    "name": "Ceramide Barrier Repair Intensive Whipped Cream",
    "slug": "ceramide-barrier-repair-intensive-whipped-cream",
    "sku": "VEX-BEA-0093",
    "description": "Experience the exceptional craftsmanship of the Ceramide Barrier Repair Intensive Whipped Cream. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Ceramide Barrier Repair Intensive Whipped Cream engineered with uncompromising material quality and British standards.",
    "price": 1699,
    "compareAtPrice": 2299,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Moisturizers",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Beauty",
    "stock": 58,
    "tags": [
      "Beauty",
      "Moisturizers",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 77,
    "status": "active"
  },
  {
    "name": "Velvet Matte Lip Pigment Longwear Formulation",
    "slug": "velvet-matte-lip-pigment-longwear-formulation",
    "sku": "VEX-BEA-0094",
    "description": "Experience the exceptional craftsmanship of the Velvet Matte Lip Pigment Longwear Formulation. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Velvet Matte Lip Pigment Longwear Formulation engineered with uncompromising material quality and British standards.",
    "price": 899,
    "compareAtPrice": 1199,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Makeup",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Beauty",
    "stock": 65,
    "tags": [
      "Beauty",
      "Makeup",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 90,
    "status": "active"
  },
  {
    "name": "Luminous Silk Featherlight Liquid Foundation",
    "slug": "luminous-silk-featherlight-liquid-foundation",
    "sku": "VEX-BEA-0095",
    "description": "Experience the exceptional craftsmanship of the Luminous Silk Featherlight Liquid Foundation. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Luminous Silk Featherlight Liquid Foundation engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Makeup",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Beauty",
    "stock": 72,
    "tags": [
      "Beauty",
      "Makeup",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 103,
    "status": "active"
  },
  {
    "name": "Mineral Terracotta Baked Bronzer & Glow Compact",
    "slug": "mineral-terracotta-baked-bronzer-glow-compact",
    "sku": "VEX-BEA-0096",
    "description": "Experience the exceptional craftsmanship of the Mineral Terracotta Baked Bronzer & Glow Compact. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Mineral Terracotta Baked Bronzer & Glow Compact engineered with uncompromising material quality and British standards.",
    "price": 1099,
    "compareAtPrice": 1499,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Makeup",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Beauty",
    "stock": 79,
    "tags": [
      "Beauty",
      "Makeup",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 116,
    "status": "active"
  },
  {
    "name": "Waterproof Smudge-Proof Liquid Precision Eyeliner",
    "slug": "waterproof-smudge-proof-liquid-precision-eyeliner",
    "sku": "VEX-BEA-0097",
    "description": "Experience the exceptional craftsmanship of the Waterproof Smudge-Proof Liquid Precision Eyeliner. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Waterproof Smudge-Proof Liquid Precision Eyeliner engineered with uncompromising material quality and British standards.",
    "price": 699,
    "compareAtPrice": 899,
    "discount": 22,
    "images": [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Makeup",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Beauty",
    "stock": 86,
    "tags": [
      "Beauty",
      "Makeup",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 129,
    "status": "active"
  },
  {
    "name": "Conditioning Peptide Volumizing Lash Mascara",
    "slug": "conditioning-peptide-volumizing-lash-mascara",
    "sku": "VEX-BEA-0098",
    "description": "Experience the exceptional craftsmanship of the Conditioning Peptide Volumizing Lash Mascara. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Conditioning Peptide Volumizing Lash Mascara engineered with uncompromising material quality and British standards.",
    "price": 799,
    "compareAtPrice": 1099,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Makeup",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Beauty",
    "stock": 93,
    "tags": [
      "Beauty",
      "Makeup",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 142,
    "status": "active"
  },
  {
    "name": "360° Dual Wave Platinum Facial Sculpting Roller",
    "slug": "360-dual-wave-platinum-facial-sculpting-roller",
    "sku": "VEX-BEA-0099",
    "description": "Experience the exceptional craftsmanship of the 360° Dual Wave Platinum Facial Sculpting Roller. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury 360° Dual Wave Platinum Facial Sculpting Roller engineered with uncompromising material quality and British standards.",
    "price": 2099,
    "compareAtPrice": 2799,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Tools",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Beauty",
    "stock": 100,
    "tags": [
      "Beauty",
      "Tools",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 155,
    "status": "active"
  },
  {
    "name": "Natural Jade Stone Contouring Gua Sha Tool",
    "slug": "natural-jade-stone-contouring-gua-sha-tool",
    "sku": "VEX-BEA-0100",
    "description": "Experience the exceptional craftsmanship of the Natural Jade Stone Contouring Gua Sha Tool. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Natural Jade Stone Contouring Gua Sha Tool engineered with uncompromising material quality and British standards.",
    "price": 799,
    "compareAtPrice": 1099,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Tools",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Beauty",
    "stock": 107,
    "tags": [
      "Beauty",
      "Tools",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 168,
    "status": "active"
  },
  {
    "name": "Sonic Pulsation Pore Cleansing Silicone Brush",
    "slug": "sonic-pulsation-pore-cleansing-silicone-brush",
    "sku": "VEX-BEA-0101",
    "description": "Experience the exceptional craftsmanship of the Sonic Pulsation Pore Cleansing Silicone Brush. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Sonic Pulsation Pore Cleansing Silicone Brush engineered with uncompromising material quality and British standards.",
    "price": 1499,
    "compareAtPrice": 1999,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Tools",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Beauty",
    "stock": 114,
    "tags": [
      "Beauty",
      "Tools",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 181,
    "status": "active"
  },
  {
    "name": "Rose Quartz Cold Therapy Eye Puffiness Wand",
    "slug": "rose-quartz-cold-therapy-eye-puffiness-wand",
    "sku": "VEX-BEA-0102",
    "description": "Experience the exceptional craftsmanship of the Rose Quartz Cold Therapy Eye Puffiness Wand. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Rose Quartz Cold Therapy Eye Puffiness Wand engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Tools",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Beauty",
    "stock": 31,
    "tags": [
      "Beauty",
      "Tools",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 194,
    "status": "active"
  },
  {
    "name": "Niche Parfum No. 4: Santal, Cardamom & Cedar 100ml",
    "slug": "niche-parfum-no-4-santal-cardamom-cedar-100ml",
    "sku": "VEX-BEA-0103",
    "description": "Experience the exceptional craftsmanship of the Niche Parfum No. 4: Santal, Cardamom & Cedar 100ml. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Niche Parfum No. 4: Santal, Cardamom & Cedar 100ml engineered with uncompromising material quality and British standards.",
    "price": 3099,
    "compareAtPrice": 4199,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Fragrance",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Beauty",
    "stock": 38,
    "tags": [
      "Beauty",
      "Fragrance",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 27,
    "status": "active"
  },
  {
    "name": "Eau de Parfum: Bergamot & White Amber 50ml",
    "slug": "eau-de-parfum-bergamot-white-amber-50ml",
    "sku": "VEX-BEA-0104",
    "description": "Experience the exceptional craftsmanship of the Eau de Parfum: Bergamot & White Amber 50ml. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Eau de Parfum: Bergamot & White Amber 50ml engineered with uncompromising material quality and British standards.",
    "price": 2399,
    "compareAtPrice": 3199,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Fragrance",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Beauty",
    "stock": 45,
    "tags": [
      "Beauty",
      "Fragrance",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 40,
    "status": "active"
  },
  {
    "name": "Nourishing Botanical Body Polish with Himalayan Salts",
    "slug": "nourishing-botanical-body-polish-with-himalayan-salts",
    "sku": "VEX-BEA-0105",
    "description": "Experience the exceptional craftsmanship of the Nourishing Botanical Body Polish with Himalayan Salts. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Nourishing Botanical Body Polish with Himalayan Salts engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Body",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Beauty",
    "stock": 52,
    "tags": [
      "Beauty",
      "Body",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 53,
    "status": "active"
  },
  {
    "name": "Revitalizing Rosemary & Mint Scalp Stimulating Oil",
    "slug": "revitalizing-rosemary-mint-scalp-stimulating-oil",
    "sku": "VEX-BEA-0106",
    "description": "Experience the exceptional craftsmanship of the Revitalizing Rosemary & Mint Scalp Stimulating Oil. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Revitalizing Rosemary & Mint Scalp Stimulating Oil engineered with uncompromising material quality and British standards.",
    "price": 1099,
    "compareAtPrice": 1499,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Hair",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Beauty",
    "stock": 59,
    "tags": [
      "Beauty",
      "Hair",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 66,
    "status": "active"
  },
  {
    "name": "Silky Argan & Keratin Leave-In Hair Hydrator",
    "slug": "silky-argan-keratin-leave-in-hair-hydrator",
    "sku": "VEX-BEA-0107",
    "description": "Experience the exceptional craftsmanship of the Silky Argan & Keratin Leave-In Hair Hydrator. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Silky Argan & Keratin Leave-In Hair Hydrator engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Hair",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Beauty",
    "stock": 66,
    "tags": [
      "Beauty",
      "Hair",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 79,
    "status": "active"
  },
  {
    "name": "Aromatherapy Lavender & Chamomile Sleep Mist",
    "slug": "aromatherapy-lavender-chamomile-sleep-mist",
    "sku": "VEX-BEA-0108",
    "description": "Experience the exceptional craftsmanship of the Aromatherapy Lavender & Chamomile Sleep Mist. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Aromatherapy Lavender & Chamomile Sleep Mist engineered with uncompromising material quality and British standards.",
    "price": 799,
    "compareAtPrice": 1099,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Wellness",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Beauty",
    "stock": 73,
    "tags": [
      "Beauty",
      "Wellness",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 92,
    "status": "active"
  },
  {
    "name": "Exfoliating Bamboo Fibre Body Dry Brush",
    "slug": "exfoliating-bamboo-fibre-body-dry-brush",
    "sku": "VEX-BEA-0109",
    "description": "Experience the exceptional craftsmanship of the Exfoliating Bamboo Fibre Body Dry Brush. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Exfoliating Bamboo Fibre Body Dry Brush engineered with uncompromising material quality and British standards.",
    "price": 599,
    "compareAtPrice": 799,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Body",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Beauty",
    "stock": 80,
    "tags": [
      "Beauty",
      "Body",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 105,
    "status": "active"
  },
  {
    "name": "Handcrafted Organic Shea Butter Intensive Balm",
    "slug": "handcrafted-organic-shea-butter-intensive-balm",
    "sku": "VEX-BEA-0110",
    "description": "Experience the exceptional craftsmanship of the Handcrafted Organic Shea Butter Intensive Balm. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Beauty collection.",
    "shortDescription": "Curated luxury Handcrafted Organic Shea Butter Intensive Balm engineered with uncompromising material quality and British standards.",
    "price": 699,
    "compareAtPrice": 899,
    "discount": 22,
    "images": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Body",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Beauty",
    "stock": 87,
    "tags": [
      "Beauty",
      "Body",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 118,
    "status": "active"
  },
  {
    "name": "Sculptural Ceramic Asymmetric Flora Vase in Sandstone",
    "slug": "sculptural-ceramic-asymmetric-flora-vase-in-sandstone",
    "sku": "VEX-HOM-0111",
    "description": "Experience the exceptional craftsmanship of the Sculptural Ceramic Asymmetric Flora Vase in Sandstone. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Sculptural Ceramic Asymmetric Flora Vase in Sandstone engineered with uncompromising material quality and British standards.",
    "price": 1899,
    "compareAtPrice": 2599,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Decor",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Home",
    "stock": 30,
    "tags": [
      "Home & Living",
      "Decor",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 25,
    "status": "active"
  },
  {
    "name": "Hand-Blown Borosilicate Fluted Glass Flower Vase",
    "slug": "hand-blown-borosilicate-fluted-glass-flower-vase",
    "sku": "VEX-HOM-0112",
    "description": "Experience the exceptional craftsmanship of the Hand-Blown Borosilicate Fluted Glass Flower Vase. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Hand-Blown Borosilicate Fluted Glass Flower Vase engineered with uncompromising material quality and British standards.",
    "price": 1499,
    "compareAtPrice": 1999,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Decor",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Home",
    "stock": 37,
    "tags": [
      "Home & Living",
      "Decor",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 38,
    "status": "active"
  },
  {
    "name": "Solid American Walnut Round Low Coffee Table",
    "slug": "solid-american-walnut-round-low-coffee-table",
    "sku": "VEX-HOM-0113",
    "description": "Experience the exceptional craftsmanship of the Solid American Walnut Round Low Coffee Table. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Solid American Walnut Round Low Coffee Table engineered with uncompromising material quality and British standards.",
    "price": 7999,
    "compareAtPrice": 10799,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Furniture",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Home",
    "stock": 44,
    "tags": [
      "Home & Living",
      "Furniture",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 51,
    "status": "active"
  },
  {
    "name": "Solid Oak Minimalist Dining Chair with Curved Back",
    "slug": "solid-oak-minimalist-dining-chair-with-curved-back",
    "sku": "VEX-HOM-0114",
    "description": "Experience the exceptional craftsmanship of the Solid Oak Minimalist Dining Chair with Curved Back. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Solid Oak Minimalist Dining Chair with Curved Back engineered with uncompromising material quality and British standards.",
    "price": 5499,
    "compareAtPrice": 7399,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Furniture",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Home",
    "stock": 51,
    "tags": [
      "Home & Living",
      "Furniture",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 64,
    "status": "active"
  },
  {
    "name": "Linen Upholstered Round Footstool Storage Ottoman",
    "slug": "linen-upholstered-round-footstool-storage-ottoman",
    "sku": "VEX-HOM-0115",
    "description": "Experience the exceptional craftsmanship of the Linen Upholstered Round Footstool Storage Ottoman. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Linen Upholstered Round Footstool Storage Ottoman engineered with uncompromising material quality and British standards.",
    "price": 3499,
    "compareAtPrice": 4699,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Furniture",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Home",
    "stock": 58,
    "tags": [
      "Home & Living",
      "Furniture",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 77,
    "status": "active"
  },
  {
    "name": "Emerald Green Velvet Luxury Mid-Century Lounge Chair",
    "slug": "emerald-green-velvet-luxury-mid-century-lounge-chair",
    "sku": "VEX-HOM-0116",
    "description": "Experience the exceptional craftsmanship of the Emerald Green Velvet Luxury Mid-Century Lounge Chair. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Emerald Green Velvet Luxury Mid-Century Lounge Chair engineered with uncompromising material quality and British standards.",
    "price": 9499,
    "compareAtPrice": 12799,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Furniture",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Home",
    "stock": 65,
    "tags": [
      "Home & Living",
      "Furniture",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 90,
    "status": "active"
  },
  {
    "name": "Minimalist Scandinavian Floating Wall Shelf Set of 2",
    "slug": "minimalist-scandinavian-floating-wall-shelf-set-of-2",
    "sku": "VEX-HOM-0117",
    "description": "Experience the exceptional craftsmanship of the Minimalist Scandinavian Floating Wall Shelf Set of 2. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Minimalist Scandinavian Floating Wall Shelf Set of 2 engineered with uncompromising material quality and British standards.",
    "price": 2199,
    "compareAtPrice": 2999,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1597072689227-8882273e8f6a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1597072689227-8882273e8f6a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Furniture",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Home",
    "stock": 72,
    "tags": [
      "Home & Living",
      "Furniture",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 103,
    "status": "active"
  },
  {
    "name": "Architectural Travertine Marble Table Lamp with Linen Shade",
    "slug": "architectural-travertine-marble-table-lamp-with-linen-shade",
    "sku": "VEX-HOM-0118",
    "description": "Experience the exceptional craftsmanship of the Architectural Travertine Marble Table Lamp with Linen Shade. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Architectural Travertine Marble Table Lamp with Linen Shade engineered with uncompromising material quality and British standards.",
    "price": 4099,
    "compareAtPrice": 5499,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80&sig=107",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80&sig=107",
    "hoverImage": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Lighting",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Home",
    "stock": 79,
    "tags": [
      "Home & Living",
      "Lighting",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 116,
    "status": "active"
  },
  {
    "name": "Brushed Brass Minimalist Pendant Ceiling Light",
    "slug": "brushed-brass-minimalist-pendant-ceiling-light",
    "sku": "VEX-HOM-0119",
    "description": "Experience the exceptional craftsmanship of the Brushed Brass Minimalist Pendant Ceiling Light. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Brushed Brass Minimalist Pendant Ceiling Light engineered with uncompromising material quality and British standards.",
    "price": 3099,
    "compareAtPrice": 4199,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1532009324734-20a7a5813719?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Lighting",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Home",
    "stock": 86,
    "tags": [
      "Home & Living",
      "Lighting",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 129,
    "status": "active"
  },
  {
    "name": "Matte Black Steel Bauhaus Candle Holder Candelabra",
    "slug": "matte-black-steel-bauhaus-candle-holder-candelabra",
    "sku": "VEX-HOM-0120",
    "description": "Experience the exceptional craftsmanship of the Matte Black Steel Bauhaus Candle Holder Candelabra. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Matte Black Steel Bauhaus Candle Holder Candelabra engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Decor",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Home",
    "stock": 93,
    "tags": [
      "Home & Living",
      "Decor",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 142,
    "status": "active"
  },
  {
    "name": "Natural Soy Wax & Amber Essential Oil Scented Candle",
    "slug": "natural-soy-wax-amber-essential-oil-scented-candle",
    "sku": "VEX-HOM-0121",
    "description": "Experience the exceptional craftsmanship of the Natural Soy Wax & Amber Essential Oil Scented Candle. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Natural Soy Wax & Amber Essential Oil Scented Candle engineered with uncompromising material quality and British standards.",
    "price": 899,
    "compareAtPrice": 1199,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Decor",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Home",
    "stock": 100,
    "tags": [
      "Home & Living",
      "Decor",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 155,
    "status": "active"
  },
  {
    "name": "Hand-Carved White Marble Geometric Bookends Pair",
    "slug": "hand-carved-white-marble-geometric-bookends-pair",
    "sku": "VEX-HOM-0122",
    "description": "Experience the exceptional craftsmanship of the Hand-Carved White Marble Geometric Bookends Pair. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Hand-Carved White Marble Geometric Bookends Pair engineered with uncompromising material quality and British standards.",
    "price": 1599,
    "compareAtPrice": 2199,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Decor",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Home",
    "stock": 107,
    "tags": [
      "Home & Living",
      "Decor",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 168,
    "status": "active"
  },
  {
    "name": "Minimalist Silent Sweep Walnut Wall Clock 30cm",
    "slug": "minimalist-silent-sweep-walnut-wall-clock-30cm",
    "sku": "VEX-HOM-0123",
    "description": "Experience the exceptional craftsmanship of the Minimalist Silent Sweep Walnut Wall Clock 30cm. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Minimalist Silent Sweep Walnut Wall Clock 30cm engineered with uncompromising material quality and British standards.",
    "price": 1799,
    "compareAtPrice": 2399,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Decor",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Home",
    "stock": 114,
    "tags": [
      "Home & Living",
      "Decor",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 181,
    "status": "active"
  },
  {
    "name": "Arch Wall Mirror with Brushed Aluminum Frame 80cm",
    "slug": "arch-wall-mirror-with-brushed-aluminum-frame-80cm",
    "sku": "VEX-HOM-0124",
    "description": "Experience the exceptional craftsmanship of the Arch Wall Mirror with Brushed Aluminum Frame 80cm. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Arch Wall Mirror with Brushed Aluminum Frame 80cm engineered with uncompromising material quality and British standards.",
    "price": 3799,
    "compareAtPrice": 5099,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Decor",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Home",
    "stock": 31,
    "tags": [
      "Home & Living",
      "Decor",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 194,
    "status": "active"
  },
  {
    "name": "Hand-Knotted Pure New Zealand Wool Textured Area Rug",
    "slug": "hand-knotted-pure-new-zealand-wool-textured-area-rug",
    "sku": "VEX-HOM-0125",
    "description": "Experience the exceptional craftsmanship of the Hand-Knotted Pure New Zealand Wool Textured Area Rug. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Hand-Knotted Pure New Zealand Wool Textured Area Rug engineered with uncompromising material quality and British standards.",
    "price": 7299,
    "compareAtPrice": 9899,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Textiles",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Home",
    "stock": 38,
    "tags": [
      "Home & Living",
      "Textiles",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 27,
    "status": "active"
  },
  {
    "name": "Belgian Washed Linen Herringbone Throw Blanket",
    "slug": "belgian-washed-linen-herringbone-throw-blanket",
    "sku": "VEX-HOM-0126",
    "description": "Experience the exceptional craftsmanship of the Belgian Washed Linen Herringbone Throw Blanket. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Belgian Washed Linen Herringbone Throw Blanket engineered with uncompromising material quality and British standards.",
    "price": 2399,
    "compareAtPrice": 3199,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Textiles",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Home",
    "stock": 45,
    "tags": [
      "Home & Living",
      "Textiles",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 40,
    "status": "active"
  },
  {
    "name": "Organic Double-Gauze Cotton Duvet Quilt & Sham Set",
    "slug": "organic-double-gauze-cotton-duvet-quilt-sham-set",
    "sku": "VEX-HOM-0127",
    "description": "Experience the exceptional craftsmanship of the Organic Double-Gauze Cotton Duvet Quilt & Sham Set. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Organic Double-Gauze Cotton Duvet Quilt & Sham Set engineered with uncompromising material quality and British standards.",
    "price": 3899,
    "compareAtPrice": 5299,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Textiles",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Home",
    "stock": 52,
    "tags": [
      "Home & Living",
      "Textiles",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 53,
    "status": "active"
  },
  {
    "name": "Organic Turkish Cotton Waffle Bath Sheet 2-Pack",
    "slug": "organic-turkish-cotton-waffle-bath-sheet-2-pack",
    "sku": "VEX-HOM-0128",
    "description": "Experience the exceptional craftsmanship of the Organic Turkish Cotton Waffle Bath Sheet 2-Pack. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Organic Turkish Cotton Waffle Bath Sheet 2-Pack engineered with uncompromising material quality and British standards.",
    "price": 1499,
    "compareAtPrice": 1999,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Textiles",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Home",
    "stock": 59,
    "tags": [
      "Home & Living",
      "Textiles",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 66,
    "status": "active"
  },
  {
    "name": "Handcrafted Stoneware Ceramic Dinnerware 16-Piece Set",
    "slug": "handcrafted-stoneware-ceramic-dinnerware-16-piece-set",
    "sku": "VEX-HOM-0129",
    "description": "Experience the exceptional craftsmanship of the Handcrafted Stoneware Ceramic Dinnerware 16-Piece Set. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Handcrafted Stoneware Ceramic Dinnerware 16-Piece Set engineered with uncompromising material quality and British standards.",
    "price": 4599,
    "compareAtPrice": 6199,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Kitchen & Dining",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Home",
    "stock": 66,
    "tags": [
      "Home & Living",
      "Kitchen & Dining",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 79,
    "status": "active"
  },
  {
    "name": "Solid Acacia Wood Live-Edge Serving Charcuterie Board",
    "slug": "solid-acacia-wood-live-edge-serving-charcuterie-board",
    "sku": "VEX-HOM-0130",
    "description": "Experience the exceptional craftsmanship of the Solid Acacia Wood Live-Edge Serving Charcuterie Board. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Solid Acacia Wood Live-Edge Serving Charcuterie Board engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Kitchen & Dining",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Home",
    "stock": 73,
    "tags": [
      "Home & Living",
      "Kitchen & Dining",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 92,
    "status": "active"
  },
  {
    "name": "Smoked Glass Ribbed Beverage Pitcher & Tumbler Set",
    "slug": "smoked-glass-ribbed-beverage-pitcher-tumbler-set",
    "sku": "VEX-HOM-0131",
    "description": "Experience the exceptional craftsmanship of the Smoked Glass Ribbed Beverage Pitcher & Tumbler Set. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Smoked Glass Ribbed Beverage Pitcher & Tumbler Set engineered with uncompromising material quality and British standards.",
    "price": 1599,
    "compareAtPrice": 2199,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Kitchen & Dining",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Home",
    "stock": 80,
    "tags": [
      "Home & Living",
      "Kitchen & Dining",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 105,
    "status": "active"
  },
  {
    "name": "Rattan & Teak Wood Woven Magazine Storage Rack",
    "slug": "rattan-teak-wood-woven-magazine-storage-rack",
    "sku": "VEX-HOM-0132",
    "description": "Experience the exceptional craftsmanship of the Rattan & Teak Wood Woven Magazine Storage Rack. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Home & Living collection.",
    "shortDescription": "Curated luxury Rattan & Teak Wood Woven Magazine Storage Rack engineered with uncompromising material quality and British standards.",
    "price": 1999,
    "compareAtPrice": 2699,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Decor",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Home",
    "stock": 87,
    "tags": [
      "Home & Living",
      "Decor",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 118,
    "status": "active"
  },
  {
    "name": "The Aurelia 18K Gold Vermeil Bold Link Chain Necklace",
    "slug": "the-aurelia-18k-gold-vermeil-bold-link-chain-necklace",
    "sku": "VEX-JEW-0133",
    "description": "Experience the exceptional craftsmanship of the The Aurelia 18K Gold Vermeil Bold Link Chain Necklace. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury The Aurelia 18K Gold Vermeil Bold Link Chain Necklace engineered with uncompromising material quality and British standards.",
    "price": 3799,
    "compareAtPrice": 5099,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Necklaces",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Jewellery",
    "stock": 30,
    "tags": [
      "Jewellery",
      "Necklaces",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 25,
    "status": "active"
  },
  {
    "name": "Baroque Freshwater Pearl Floating Pendant Necklace",
    "slug": "baroque-freshwater-pearl-floating-pendant-necklace",
    "sku": "VEX-JEW-0134",
    "description": "Experience the exceptional craftsmanship of the Baroque Freshwater Pearl Floating Pendant Necklace. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Baroque Freshwater Pearl Floating Pendant Necklace engineered with uncompromising material quality and British standards.",
    "price": 2699,
    "compareAtPrice": 3599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Necklaces",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Jewellery",
    "stock": 37,
    "tags": [
      "Jewellery",
      "Necklaces",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 38,
    "status": "active"
  },
  {
    "name": "Layered Delicate Rope Chain Duo in 18K Solid Gold",
    "slug": "layered-delicate-rope-chain-duo-in-18k-solid-gold",
    "sku": "VEX-JEW-0135",
    "description": "Experience the exceptional craftsmanship of the Layered Delicate Rope Chain Duo in 18K Solid Gold. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Layered Delicate Rope Chain Duo in 18K Solid Gold engineered with uncompromising material quality and British standards.",
    "price": 4999,
    "compareAtPrice": 6799,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Necklaces",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Jewellery",
    "stock": 44,
    "tags": [
      "Jewellery",
      "Necklaces",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 51,
    "status": "active"
  },
  {
    "name": "Sculpted Teardrop Solitaire Gemstone Choker",
    "slug": "sculpted-teardrop-solitaire-gemstone-choker",
    "sku": "VEX-JEW-0136",
    "description": "Experience the exceptional craftsmanship of the Sculpted Teardrop Solitaire Gemstone Choker. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Sculpted Teardrop Solitaire Gemstone Choker engineered with uncompromising material quality and British standards.",
    "price": 3499,
    "compareAtPrice": 4699,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Necklaces",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Jewellery",
    "stock": 51,
    "tags": [
      "Jewellery",
      "Necklaces",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 64,
    "status": "active"
  },
  {
    "name": "Solid 925 Sterling Silver Beveled Figaro Chain",
    "slug": "solid-925-sterling-silver-beveled-figaro-chain",
    "sku": "VEX-JEW-0137",
    "description": "Experience the exceptional craftsmanship of the Solid 925 Sterling Silver Beveled Figaro Chain. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Solid 925 Sterling Silver Beveled Figaro Chain engineered with uncompromising material quality and British standards.",
    "price": 2499,
    "compareAtPrice": 3399,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Necklaces",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Jewellery",
    "stock": 58,
    "tags": [
      "Jewellery",
      "Necklaces",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 77,
    "status": "active"
  },
  {
    "name": "Chunky Sculptural Gold Vermeil Hoop Earrings",
    "slug": "chunky-sculptural-gold-vermeil-hoop-earrings",
    "sku": "VEX-JEW-0138",
    "description": "Experience the exceptional craftsmanship of the Chunky Sculptural Gold Vermeil Hoop Earrings. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Chunky Sculptural Gold Vermeil Hoop Earrings engineered with uncompromising material quality and British standards.",
    "price": 2099,
    "compareAtPrice": 2799,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Earrings",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Jewellery",
    "stock": 65,
    "tags": [
      "Jewellery",
      "Earrings",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 90,
    "status": "active"
  },
  {
    "name": "Diamond Pavé Micro Huggie Earrings in White Gold",
    "slug": "diamond-pav-micro-huggie-earrings-in-white-gold",
    "sku": "VEX-JEW-0139",
    "description": "Experience the exceptional craftsmanship of the Diamond Pavé Micro Huggie Earrings in White Gold. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Diamond Pavé Micro Huggie Earrings in White Gold engineered with uncompromising material quality and British standards.",
    "price": 4099,
    "compareAtPrice": 5499,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Earrings",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Jewellery",
    "stock": 72,
    "tags": [
      "Jewellery",
      "Earrings",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 103,
    "status": "active"
  },
  {
    "name": "Cascading Freshwater Pearl Threader Drop Earrings",
    "slug": "cascading-freshwater-pearl-threader-drop-earrings",
    "sku": "VEX-JEW-0140",
    "description": "Experience the exceptional craftsmanship of the Cascading Freshwater Pearl Threader Drop Earrings. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Cascading Freshwater Pearl Threader Drop Earrings engineered with uncompromising material quality and British standards.",
    "price": 2299,
    "compareAtPrice": 3099,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Earrings",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Jewellery",
    "stock": 79,
    "tags": [
      "Jewellery",
      "Earrings",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 116,
    "status": "active"
  },
  {
    "name": "Handcrafted Textured Molten Gold Stud Earrings",
    "slug": "handcrafted-textured-molten-gold-stud-earrings",
    "sku": "VEX-JEW-0141",
    "description": "Experience the exceptional craftsmanship of the Handcrafted Textured Molten Gold Stud Earrings. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Handcrafted Textured Molten Gold Stud Earrings engineered with uncompromising material quality and British standards.",
    "price": 1899,
    "compareAtPrice": 2599,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Earrings",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Jewellery",
    "stock": 86,
    "tags": [
      "Jewellery",
      "Earrings",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 129,
    "status": "active"
  },
  {
    "name": "Geometric Baguette Cut Emerald Huggie Hoops",
    "slug": "geometric-baguette-cut-emerald-huggie-hoops",
    "sku": "VEX-JEW-0142",
    "description": "Experience the exceptional craftsmanship of the Geometric Baguette Cut Emerald Huggie Hoops. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Geometric Baguette Cut Emerald Huggie Hoops engineered with uncompromising material quality and British standards.",
    "price": 3199,
    "compareAtPrice": 4299,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Earrings",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Jewellery",
    "stock": 93,
    "tags": [
      "Jewellery",
      "Earrings",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 142,
    "status": "active"
  },
  {
    "name": "Heirloom Classic Tennis Bracelet with Lab Diamonds",
    "slug": "heirloom-classic-tennis-bracelet-with-lab-diamonds",
    "sku": "VEX-JEW-0143",
    "description": "Experience the exceptional craftsmanship of the Heirloom Classic Tennis Bracelet with Lab Diamonds. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Heirloom Classic Tennis Bracelet with Lab Diamonds engineered with uncompromising material quality and British standards.",
    "price": 6699,
    "compareAtPrice": 9099,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611955167811-4711904bb9f8?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Bracelets",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Jewellery",
    "stock": 100,
    "tags": [
      "Jewellery",
      "Bracelets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 155,
    "status": "active"
  },
  {
    "name": "Sculpted Minimalist Bangle in 18K Brushed Gold",
    "slug": "sculpted-minimalist-bangle-in-18k-brushed-gold",
    "sku": "VEX-JEW-0144",
    "description": "Experience the exceptional craftsmanship of the Sculpted Minimalist Bangle in 18K Brushed Gold. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Sculpted Minimalist Bangle in 18K Brushed Gold engineered with uncompromising material quality and British standards.",
    "price": 4499,
    "compareAtPrice": 6099,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611955167811-4711904bb9f8?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Bracelets",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Jewellery",
    "stock": 107,
    "tags": [
      "Jewellery",
      "Bracelets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 168,
    "status": "active"
  },
  {
    "name": "Sterling Silver Cuban Curb Link Chain Bracelet",
    "slug": "sterling-silver-cuban-curb-link-chain-bracelet",
    "sku": "VEX-JEW-0145",
    "description": "Experience the exceptional craftsmanship of the Sterling Silver Cuban Curb Link Chain Bracelet. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Sterling Silver Cuban Curb Link Chain Bracelet engineered with uncompromising material quality and British standards.",
    "price": 2699,
    "compareAtPrice": 3599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1611955167811-4711904bb9f8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1611955167811-4711904bb9f8?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Bracelets",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Jewellery",
    "stock": 114,
    "tags": [
      "Jewellery",
      "Bracelets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 181,
    "status": "active"
  },
  {
    "name": "Dual Cable Woven Gold Vermeil Adjustable Cuff",
    "slug": "dual-cable-woven-gold-vermeil-adjustable-cuff",
    "sku": "VEX-JEW-0146",
    "description": "Experience the exceptional craftsmanship of the Dual Cable Woven Gold Vermeil Adjustable Cuff. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Dual Cable Woven Gold Vermeil Adjustable Cuff engineered with uncompromising material quality and British standards.",
    "price": 3099,
    "compareAtPrice": 4199,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Bracelets",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Jewellery",
    "stock": 31,
    "tags": [
      "Jewellery",
      "Bracelets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 194,
    "status": "active"
  },
  {
    "name": "Stackable Twisted Rope Band Ring in Yellow Gold",
    "slug": "stackable-twisted-rope-band-ring-in-yellow-gold",
    "sku": "VEX-JEW-0147",
    "description": "Experience the exceptional craftsmanship of the Stackable Twisted Rope Band Ring in Yellow Gold. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Stackable Twisted Rope Band Ring in Yellow Gold engineered with uncompromising material quality and British standards.",
    "price": 1799,
    "compareAtPrice": 2399,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Rings",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Jewellery",
    "stock": 38,
    "tags": [
      "Jewellery",
      "Rings",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 27,
    "status": "active"
  },
  {
    "name": "Solitaire Moissanite Cushion Cut Signet Ring",
    "slug": "solitaire-moissanite-cushion-cut-signet-ring",
    "sku": "VEX-JEW-0148",
    "description": "Experience the exceptional craftsmanship of the Solitaire Moissanite Cushion Cut Signet Ring. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Solitaire Moissanite Cushion Cut Signet Ring engineered with uncompromising material quality and British standards.",
    "price": 5499,
    "compareAtPrice": 7399,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Rings",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Jewellery",
    "stock": 45,
    "tags": [
      "Jewellery",
      "Rings",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 40,
    "status": "active"
  },
  {
    "name": "Chunky Dome Ring in 925 Recycled Sterling Silver",
    "slug": "chunky-dome-ring-in-925-recycled-sterling-silver",
    "sku": "VEX-JEW-0149",
    "description": "Experience the exceptional craftsmanship of the Chunky Dome Ring in 925 Recycled Sterling Silver. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Chunky Dome Ring in 925 Recycled Sterling Silver engineered with uncompromising material quality and British standards.",
    "price": 2199,
    "compareAtPrice": 2999,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Rings",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Jewellery",
    "stock": 52,
    "tags": [
      "Jewellery",
      "Rings",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 53,
    "status": "active"
  },
  {
    "name": "Organic Molten Contour Wave Ring Set of Three",
    "slug": "organic-molten-contour-wave-ring-set-of-three",
    "sku": "VEX-JEW-0150",
    "description": "Experience the exceptional craftsmanship of the Organic Molten Contour Wave Ring Set of Three. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Organic Molten Contour Wave Ring Set of Three engineered with uncompromising material quality and British standards.",
    "price": 2499,
    "compareAtPrice": 3399,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1619119069152-a2b331eb392a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1619119069152-a2b331eb392a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Rings",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Jewellery",
    "stock": 59,
    "tags": [
      "Jewellery",
      "Rings",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 66,
    "status": "active"
  },
  {
    "name": "Lab Emerald & Diamond Accent Cocktail Statement Ring",
    "slug": "lab-emerald-diamond-accent-cocktail-statement-ring",
    "sku": "VEX-JEW-0151",
    "description": "Experience the exceptional craftsmanship of the Lab Emerald & Diamond Accent Cocktail Statement Ring. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Lab Emerald & Diamond Accent Cocktail Statement Ring engineered with uncompromising material quality and British standards.",
    "price": 5999,
    "compareAtPrice": 8099,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Rings",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Jewellery",
    "stock": 66,
    "tags": [
      "Jewellery",
      "Rings",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 79,
    "status": "active"
  },
  {
    "name": "Engraved Initial Oval Signet Ring in 18K Vermeil",
    "slug": "engraved-initial-oval-signet-ring-in-18k-vermeil",
    "sku": "VEX-JEW-0152",
    "description": "Experience the exceptional craftsmanship of the Engraved Initial Oval Signet Ring in 18K Vermeil. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Engraved Initial Oval Signet Ring in 18K Vermeil engineered with uncompromising material quality and British standards.",
    "price": 2399,
    "compareAtPrice": 3199,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Rings",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Jewellery",
    "stock": 73,
    "tags": [
      "Jewellery",
      "Rings",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 92,
    "status": "active"
  },
  {
    "name": "Water Drop Sapphire & Teardrop Earring Gala 4-Piece Set",
    "slug": "water-drop-sapphire-teardrop-earring-gala-4-piece-set",
    "sku": "VEX-JEW-0153",
    "description": "Experience the exceptional craftsmanship of the Water Drop Sapphire & Teardrop Earring Gala 4-Piece Set. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Water Drop Sapphire & Teardrop Earring Gala 4-Piece Set engineered with uncompromising material quality and British standards.",
    "price": 6399,
    "compareAtPrice": 8599,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Sets",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Jewellery",
    "stock": 80,
    "tags": [
      "Jewellery",
      "Sets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 105,
    "status": "active"
  },
  {
    "name": "Travel Zip Velvet Jewelry Organizer & Watch Box",
    "slug": "travel-zip-velvet-jewelry-organizer-watch-box",
    "sku": "VEX-JEW-0154",
    "description": "Experience the exceptional craftsmanship of the Travel Zip Velvet Jewelry Organizer & Watch Box. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Jewellery collection.",
    "shortDescription": "Curated luxury Travel Zip Velvet Jewelry Organizer & Watch Box engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Storage",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Jewellery",
    "stock": 87,
    "tags": [
      "Jewellery",
      "Storage",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 118,
    "status": "active"
  },
  {
    "name": "Structured Pebbled Leather Tote Handbag",
    "slug": "structured-pebbled-leather-tote-handbag",
    "sku": "VEX-BAG-0154B",
    "description": "Expertly crafted from full-grain pebbled leather, this structured tote handbag features reinforced tubular handles, interior multi-compartment dividers, a protective metallic base stud foundation, and gold-tone hardware. The quintessential daily workhorse and evening luxury companion.",
    "shortDescription": "Structured full-grain pebbled leather tote handbag with multi-compartment interior.",
    "price": 1099,
    "compareAtPrice": 1899,
    "discount": 42,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Totes",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Bags",
    "stock": 50,
    "tags": [
      "Bags",
      "Totes",
      "Handbag",
      "Pebbled Leather",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.95,
    "numReviews": 128,
    "status": "active"
  },
  {
    "name": "The Sovereign Vegetable-Tanned Tuscan Leather Tote",
    "slug": "the-sovereign-vegetable-tanned-tuscan-leather-tote",
    "sku": "VEX-BAG-0155",
    "description": "Experience the exceptional craftsmanship of the The Sovereign Vegetable-Tanned Tuscan Leather Tote. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury The Sovereign Vegetable-Tanned Tuscan Leather Tote engineered with uncompromising material quality and British standards.",
    "price": 5199,
    "compareAtPrice": 6999,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Totes",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Bags",
    "stock": 30,
    "tags": [
      "Bags",
      "Totes",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 25,
    "status": "active"
  },
  {
    "name": "The Mayfair Structured Top-Handle Everyday Satchel",
    "slug": "the-mayfair-structured-top-handle-everyday-satchel",
    "sku": "VEX-BAG-0156",
    "description": "Experience the exceptional craftsmanship of the The Mayfair Structured Top-Handle Everyday Satchel. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury The Mayfair Structured Top-Handle Everyday Satchel engineered with uncompromising material quality and British standards.",
    "price": 4599,
    "compareAtPrice": 6199,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Satchels",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Bags",
    "stock": 37,
    "tags": [
      "Bags",
      "Satchels",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 38,
    "status": "active"
  },
  {
    "name": "Supple Pebbled Leather Shoulder Hobo Carryall",
    "slug": "supple-pebbled-leather-shoulder-hobo-carryall",
    "sku": "VEX-BAG-0157",
    "description": "Experience the exceptional craftsmanship of the Supple Pebbled Leather Shoulder Hobo Carryall. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Supple Pebbled Leather Shoulder Hobo Carryall engineered with uncompromising material quality and British standards.",
    "price": 4299,
    "compareAtPrice": 5799,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Shoulder Bags",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Bags",
    "stock": 44,
    "tags": [
      "Bags",
      "Shoulder Bags",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 51,
    "status": "active"
  },
  {
    "name": "Woven Raffia & Saddle Leather Summer Beach Tote",
    "slug": "woven-raffia-saddle-leather-summer-beach-tote",
    "sku": "VEX-BAG-0158",
    "description": "Experience the exceptional craftsmanship of the Woven Raffia & Saddle Leather Summer Beach Tote. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Woven Raffia & Saddle Leather Summer Beach Tote engineered with uncompromising material quality and British standards.",
    "price": 3099,
    "compareAtPrice": 4199,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Totes",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Bags",
    "stock": 51,
    "tags": [
      "Bags",
      "Totes",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 64,
    "status": "active"
  },
  {
    "name": "Modular 16-Inch Laptop Commuter Leather Backpack",
    "slug": "modular-16-inch-laptop-commuter-leather-backpack",
    "sku": "VEX-BAG-0159",
    "description": "Experience the exceptional craftsmanship of the Modular 16-Inch Laptop Commuter Leather Backpack. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Modular 16-Inch Laptop Commuter Leather Backpack engineered with uncompromising material quality and British standards.",
    "price": 5499,
    "compareAtPrice": 7399,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Backpacks",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Bags",
    "stock": 58,
    "tags": [
      "Bags",
      "Backpacks",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 77,
    "status": "active"
  },
  {
    "name": "Waxed Canvas & Bridle Leather Heritage Daypack",
    "slug": "waxed-canvas-bridle-leather-heritage-daypack",
    "sku": "VEX-BAG-0160",
    "description": "Experience the exceptional craftsmanship of the Waxed Canvas & Bridle Leather Heritage Daypack. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Waxed Canvas & Bridle Leather Heritage Daypack engineered with uncompromising material quality and British standards.",
    "price": 3899,
    "compareAtPrice": 5299,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Backpacks",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Bags",
    "stock": 65,
    "tags": [
      "Bags",
      "Backpacks",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 90,
    "status": "active"
  },
  {
    "name": "Minimalist Waterproof Technical Urban Roll-Top Pack",
    "slug": "minimalist-waterproof-technical-urban-roll-top-pack",
    "sku": "VEX-BAG-0161",
    "description": "Experience the exceptional craftsmanship of the Minimalist Waterproof Technical Urban Roll-Top Pack. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Minimalist Waterproof Technical Urban Roll-Top Pack engineered with uncompromising material quality and British standards.",
    "price": 3499,
    "compareAtPrice": 4699,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Backpacks",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Bags",
    "stock": 72,
    "tags": [
      "Bags",
      "Backpacks",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 103,
    "status": "active"
  },
  {
    "name": "Ultra-Slim Executive Leather Laptop Briefcase Backpack",
    "slug": "ultra-slim-executive-leather-laptop-briefcase-backpack",
    "sku": "VEX-BAG-0162",
    "description": "Experience the exceptional craftsmanship of the Ultra-Slim Executive Leather Laptop Briefcase Backpack. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Ultra-Slim Executive Leather Laptop Briefcase Backpack engineered with uncompromising material quality and British standards.",
    "price": 4899,
    "compareAtPrice": 6599,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Backpacks",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Bags",
    "stock": 79,
    "tags": [
      "Bags",
      "Backpacks",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 116,
    "status": "active"
  },
  {
    "name": "Italian Top-Grain Saddle Leather Flap Crossbody Bag",
    "slug": "italian-top-grain-saddle-leather-flap-crossbody-bag",
    "sku": "VEX-BAG-0163",
    "description": "Experience the exceptional craftsmanship of the Italian Top-Grain Saddle Leather Flap Crossbody Bag. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Italian Top-Grain Saddle Leather Flap Crossbody Bag engineered with uncompromising material quality and British standards.",
    "price": 3799,
    "compareAtPrice": 5099,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Crossbody",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Bags",
    "stock": 86,
    "tags": [
      "Bags",
      "Crossbody",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 129,
    "status": "active"
  },
  {
    "name": "Camera Silhouette Boxy Camera Crossbody in Cognac",
    "slug": "camera-silhouette-boxy-camera-crossbody-in-cognac",
    "sku": "VEX-BAG-0164",
    "description": "Experience the exceptional craftsmanship of the Camera Silhouette Boxy Camera Crossbody in Cognac. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Camera Silhouette Boxy Camera Crossbody in Cognac engineered with uncompromising material quality and British standards.",
    "price": 3199,
    "compareAtPrice": 4299,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Crossbody",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Bags",
    "stock": 93,
    "tags": [
      "Bags",
      "Crossbody",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 142,
    "status": "active"
  },
  {
    "name": "Quilted Nappa Leather Chain Strap Evening Crossbody",
    "slug": "quilted-nappa-leather-chain-strap-evening-crossbody",
    "sku": "VEX-BAG-0165",
    "description": "Experience the exceptional craftsmanship of the Quilted Nappa Leather Chain Strap Evening Crossbody. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Quilted Nappa Leather Chain Strap Evening Crossbody engineered with uncompromising material quality and British standards.",
    "price": 4099,
    "compareAtPrice": 5499,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Crossbody",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Bags",
    "stock": 100,
    "tags": [
      "Bags",
      "Crossbody",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 155,
    "status": "active"
  },
  {
    "name": "Half-Moon Smooth Calfskin Mini Crossbody Pouch",
    "slug": "half-moon-smooth-calfskin-mini-crossbody-pouch",
    "sku": "VEX-BAG-0166",
    "description": "Experience the exceptional craftsmanship of the Half-Moon Smooth Calfskin Mini Crossbody Pouch. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Half-Moon Smooth Calfskin Mini Crossbody Pouch engineered with uncompromising material quality and British standards.",
    "price": 2699,
    "compareAtPrice": 3599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Crossbody",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Bags",
    "stock": 107,
    "tags": [
      "Bags",
      "Crossbody",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 168,
    "status": "active"
  },
  {
    "name": "Handcrafted Bifold Pebble Grain Leather Wallet",
    "slug": "handcrafted-bifold-pebble-grain-leather-wallet",
    "sku": "VEX-BAG-0167",
    "description": "Experience the exceptional craftsmanship of the Handcrafted Bifold Pebble Grain Leather Wallet. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Handcrafted Bifold Pebble Grain Leather Wallet engineered with uncompromising material quality and British standards.",
    "price": 1499,
    "compareAtPrice": 1999,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80&sig=112",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80&sig=112",
    "hoverImage": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Wallets",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Bags",
    "stock": 114,
    "tags": [
      "Bags",
      "Wallets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 181,
    "status": "active"
  },
  {
    "name": "Zip-Around Accordion Multiple Card Continental Wallet",
    "slug": "zip-around-accordion-multiple-card-continental-wallet",
    "sku": "VEX-BAG-0168",
    "description": "Experience the exceptional craftsmanship of the Zip-Around Accordion Multiple Card Continental Wallet. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Zip-Around Accordion Multiple Card Continental Wallet engineered with uncompromising material quality and British standards.",
    "price": 1899,
    "compareAtPrice": 2599,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80&sig=113",
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80&sig=113",
    "hoverImage": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Wallets",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Bags",
    "stock": 31,
    "tags": [
      "Bags",
      "Wallets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 194,
    "status": "active"
  },
  {
    "name": "Slim Magnetic Front-Pocket RFID Blocking Cardholder",
    "slug": "slim-magnetic-front-pocket-rfid-blocking-cardholder",
    "sku": "VEX-BAG-0169",
    "description": "Experience the exceptional craftsmanship of the Slim Magnetic Front-Pocket RFID Blocking Cardholder. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Slim Magnetic Front-Pocket RFID Blocking Cardholder engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=800&q=80&sig=114",
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=800&q=80&sig=114",
    "hoverImage": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Wallets",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Bags",
    "stock": 38,
    "tags": [
      "Bags",
      "Wallets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 27,
    "status": "active"
  },
  {
    "name": "Tri-Fold Smooth Vachetta Leather Pocket Wallet",
    "slug": "tri-fold-smooth-vachetta-leather-pocket-wallet",
    "sku": "VEX-BAG-0170",
    "description": "Experience the exceptional craftsmanship of the Tri-Fold Smooth Vachetta Leather Pocket Wallet. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Tri-Fold Smooth Vachetta Leather Pocket Wallet engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Wallets",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Bags",
    "stock": 45,
    "tags": [
      "Bags",
      "Wallets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 40,
    "status": "active"
  },
  {
    "name": "Waxed Canvas & Solid Brass Overnighter Duffle Bag",
    "slug": "waxed-canvas-solid-brass-overnighter-duffle-bag",
    "sku": "VEX-BAG-0171",
    "description": "Experience the exceptional craftsmanship of the Waxed Canvas & Solid Brass Overnighter Duffle Bag. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Waxed Canvas & Solid Brass Overnighter Duffle Bag engineered with uncompromising material quality and British standards.",
    "price": 4899,
    "compareAtPrice": 6599,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1553895501-af9e282e7fc1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1553895501-af9e282e7fc1?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Luggage",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Bags",
    "stock": 52,
    "tags": [
      "Bags",
      "Luggage",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 53,
    "status": "active"
  },
  {
    "name": "Full-Grain Leather 48-Hour Weekend Holdall Bag",
    "slug": "full-grain-leather-48-hour-weekend-holdall-bag",
    "sku": "VEX-BAG-0172",
    "description": "Experience the exceptional craftsmanship of the Full-Grain Leather 48-Hour Weekend Holdall Bag. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Full-Grain Leather 48-Hour Weekend Holdall Bag engineered with uncompromising material quality and British standards.",
    "price": 7399,
    "compareAtPrice": 9999,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553895501-af9e282e7fc1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1553895501-af9e282e7fc1?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Luggage",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Bags",
    "stock": 59,
    "tags": [
      "Bags",
      "Luggage",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 66,
    "status": "active"
  },
  {
    "name": "Top-Grain Leather Hanging Toiletry Washbag Kit",
    "slug": "top-grain-leather-hanging-toiletry-washbag-kit",
    "sku": "VEX-BAG-0173",
    "description": "Experience the exceptional craftsmanship of the Top-Grain Leather Hanging Toiletry Washbag Kit. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Top-Grain Leather Hanging Toiletry Washbag Kit engineered with uncompromising material quality and British standards.",
    "price": 1599,
    "compareAtPrice": 2199,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553895501-af9e282e7fc1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1575032617751-6ddec2089882?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1553895501-af9e282e7fc1?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Luggage",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Bags",
    "stock": 66,
    "tags": [
      "Bags",
      "Luggage",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 79,
    "status": "active"
  },
  {
    "name": "Pebbled Leather Passport & Boarding Pass Wallet Case",
    "slug": "pebbled-leather-passport-boarding-pass-wallet-case",
    "sku": "VEX-BAG-0174",
    "description": "Experience the exceptional craftsmanship of the Pebbled Leather Passport & Boarding Pass Wallet Case. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Pebbled Leather Passport & Boarding Pass Wallet Case engineered with uncompromising material quality and British standards.",
    "price": 1199,
    "compareAtPrice": 1599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Luggage",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Bags",
    "stock": 73,
    "tags": [
      "Bags",
      "Luggage",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 92,
    "status": "active"
  },
  {
    "name": "Adjustable Braided Webbing Crossbody Guitar Strap",
    "slug": "adjustable-braided-webbing-crossbody-guitar-strap",
    "sku": "VEX-BAG-0175",
    "description": "Experience the exceptional craftsmanship of the Adjustable Braided Webbing Crossbody Guitar Strap. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Adjustable Braided Webbing Crossbody Guitar Strap engineered with uncompromising material quality and British standards.",
    "price": 799,
    "compareAtPrice": 1099,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80&sig=120",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80&sig=120",
    "hoverImage": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Accessories",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Bags",
    "stock": 80,
    "tags": [
      "Bags",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 105,
    "status": "active"
  },
  {
    "name": "Leather Luggage Tag with Solid Brass Monogram Buckle",
    "slug": "leather-luggage-tag-with-solid-brass-monogram-buckle",
    "sku": "VEX-BAG-0176",
    "description": "Experience the exceptional craftsmanship of the Leather Luggage Tag with Solid Brass Monogram Buckle. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Bags collection.",
    "shortDescription": "Curated luxury Leather Luggage Tag with Solid Brass Monogram Buckle engineered with uncompromising material quality and British standards.",
    "price": 599,
    "compareAtPrice": 799,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=800&q=80&sig=121",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553895501-af9e282e7fc1?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=800&q=80&sig=121",
    "hoverImage": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Accessories",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Bags",
    "stock": 87,
    "tags": [
      "Bags",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 118,
    "status": "active"
  },
  {
    "name": "Pastel Floral Organic Cotton Toddler Sun Dress",
    "slug": "pastel-floral-organic-cotton-toddler-sun-dress",
    "sku": "VEX-KID-0177",
    "description": "Experience the exceptional craftsmanship of the Pastel Floral Organic Cotton Toddler Sun Dress. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Pastel Floral Organic Cotton Toddler Sun Dress engineered with uncompromising material quality and British standards.",
    "price": 1199,
    "compareAtPrice": 1599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Dresses",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Kids",
    "stock": 30,
    "tags": [
      "Kids Wear",
      "Dresses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 25,
    "status": "active"
  },
  {
    "name": "Linen Tiered Smocked Sleeveless Girls Dress",
    "slug": "linen-tiered-smocked-sleeveless-girls-dress",
    "sku": "VEX-KID-0178",
    "description": "Experience the exceptional craftsmanship of the Linen Tiered Smocked Sleeveless Girls Dress. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Linen Tiered Smocked Sleeveless Girls Dress engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Dresses",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Kids",
    "stock": 37,
    "tags": [
      "Kids Wear",
      "Dresses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 38,
    "status": "active"
  },
  {
    "name": "Embroidered Chambray Peter Pan Collar Dress",
    "slug": "embroidered-chambray-peter-pan-collar-dress",
    "sku": "VEX-KID-0179",
    "description": "Experience the exceptional craftsmanship of the Embroidered Chambray Peter Pan Collar Dress. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Embroidered Chambray Peter Pan Collar Dress engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Dresses",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Kids",
    "stock": 44,
    "tags": [
      "Kids Wear",
      "Dresses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 51,
    "status": "active"
  },
  {
    "name": "Rib-Knit Sweetheart Toddler Pinafore Dress",
    "slug": "rib-knit-sweetheart-toddler-pinafore-dress",
    "sku": "VEX-KID-0180",
    "description": "Experience the exceptional craftsmanship of the Rib-Knit Sweetheart Toddler Pinafore Dress. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Rib-Knit Sweetheart Toddler Pinafore Dress engineered with uncompromising material quality and British standards.",
    "price": 1099,
    "compareAtPrice": 1499,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Dresses",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Kids",
    "stock": 51,
    "tags": [
      "Kids Wear",
      "Dresses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 64,
    "status": "active"
  },
  {
    "name": "Soft Gauze Cotton Button-Front Kids Shirt",
    "slug": "soft-gauze-cotton-button-front-kids-shirt",
    "sku": "VEX-KID-0181",
    "description": "Experience the exceptional craftsmanship of the Soft Gauze Cotton Button-Front Kids Shirt. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Soft Gauze Cotton Button-Front Kids Shirt engineered with uncompromising material quality and British standards.",
    "price": 899,
    "compareAtPrice": 1199,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Tops",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Kids",
    "stock": 58,
    "tags": [
      "Kids Wear",
      "Tops",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 77,
    "status": "active"
  },
  {
    "name": "Striped Breton Nautical Long-Sleeve Shirt",
    "slug": "striped-breton-nautical-long-sleeve-shirt",
    "sku": "VEX-KID-0182",
    "description": "Experience the exceptional craftsmanship of the Striped Breton Nautical Long-Sleeve Shirt. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Striped Breton Nautical Long-Sleeve Shirt engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Tops",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Kids",
    "stock": 65,
    "tags": [
      "Kids Wear",
      "Tops",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 90,
    "status": "active"
  },
  {
    "name": "Organic Slub Cotton Graphic Adventure Tee",
    "slug": "organic-slub-cotton-graphic-adventure-tee",
    "sku": "VEX-KID-0183",
    "description": "Experience the exceptional craftsmanship of the Organic Slub Cotton Graphic Adventure Tee. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Organic Slub Cotton Graphic Adventure Tee engineered with uncompromising material quality and British standards.",
    "price": 699,
    "compareAtPrice": 899,
    "discount": 22,
    "images": [
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80&sig=106",
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80&sig=106",
    "hoverImage": "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Tops",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Kids",
    "stock": 72,
    "tags": [
      "Kids Wear",
      "Tops",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 103,
    "status": "active"
  },
  {
    "name": "Preppy Gingham Check Lightweight Boys Shirt",
    "slug": "preppy-gingham-check-lightweight-boys-shirt",
    "sku": "VEX-KID-0184",
    "description": "Experience the exceptional craftsmanship of the Preppy Gingham Check Lightweight Boys Shirt. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Preppy Gingham Check Lightweight Boys Shirt engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Tops",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Kids",
    "stock": 79,
    "tags": [
      "Kids Wear",
      "Tops",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 116,
    "status": "active"
  },
  {
    "name": "Organic Bamboo Viscose Two-Way Zip Romper Sleepsuit",
    "slug": "organic-bamboo-viscose-two-way-zip-romper-sleepsuit",
    "sku": "VEX-KID-0185",
    "description": "Experience the exceptional craftsmanship of the Organic Bamboo Viscose Two-Way Zip Romper Sleepsuit. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Organic Bamboo Viscose Two-Way Zip Romper Sleepsuit engineered with uncompromising material quality and British standards.",
    "price": 1099,
    "compareAtPrice": 1499,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Sets",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Kids",
    "stock": 86,
    "tags": [
      "Kids Wear",
      "Sets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 129,
    "status": "active"
  },
  {
    "name": "Waffle Knit 2-Piece Cozy Loungewear Set",
    "slug": "waffle-knit-2-piece-cozy-loungewear-set",
    "sku": "VEX-KID-0186",
    "description": "Experience the exceptional craftsmanship of the Waffle Knit 2-Piece Cozy Loungewear Set. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Waffle Knit 2-Piece Cozy Loungewear Set engineered with uncompromising material quality and British standards.",
    "price": 1199,
    "compareAtPrice": 1599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Sets",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Kids",
    "stock": 93,
    "tags": [
      "Kids Wear",
      "Sets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 142,
    "status": "active"
  },
  {
    "name": "French Terry Kangaroo Pocket Hoodie & Jogger Set",
    "slug": "french-terry-kangaroo-pocket-hoodie-jogger-set",
    "sku": "VEX-KID-0187",
    "description": "Experience the exceptional craftsmanship of the French Terry Kangaroo Pocket Hoodie & Jogger Set. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury French Terry Kangaroo Pocket Hoodie & Jogger Set engineered with uncompromising material quality and British standards.",
    "price": 1399,
    "compareAtPrice": 1899,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Sets",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Kids",
    "stock": 100,
    "tags": [
      "Kids Wear",
      "Sets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 155,
    "status": "active"
  },
  {
    "name": "Summer Cotton Muslin Overall Dungaree Set",
    "slug": "summer-cotton-muslin-overall-dungaree-set",
    "sku": "VEX-KID-0188",
    "description": "Experience the exceptional craftsmanship of the Summer Cotton Muslin Overall Dungaree Set. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Summer Cotton Muslin Overall Dungaree Set engineered with uncompromising material quality and British standards.",
    "price": 1199,
    "compareAtPrice": 1599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Sets",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Kids",
    "stock": 107,
    "tags": [
      "Kids Wear",
      "Sets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 168,
    "status": "active"
  },
  {
    "name": "Cozy Fleece Zip Pullover and Sweatpant Duo",
    "slug": "cozy-fleece-zip-pullover-and-sweatpant-duo",
    "sku": "VEX-KID-0189",
    "description": "Experience the exceptional craftsmanship of the Cozy Fleece Zip Pullover and Sweatpant Duo. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Cozy Fleece Zip Pullover and Sweatpant Duo engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1590086782957-93c06ef21604?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1590086782957-93c06ef21604?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Sets",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Kids",
    "stock": 114,
    "tags": [
      "Kids Wear",
      "Sets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 181,
    "status": "active"
  },
  {
    "name": "Bamboo Cotton Swaddle Bodysuit 3-Pack",
    "slug": "bamboo-cotton-swaddle-bodysuit-3-pack",
    "sku": "VEX-KID-0190",
    "description": "Experience the exceptional craftsmanship of the Bamboo Cotton Swaddle Bodysuit 3-Pack. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Bamboo Cotton Swaddle Bodysuit 3-Pack engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Sets",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Kids",
    "stock": 31,
    "tags": [
      "Kids Wear",
      "Sets",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 194,
    "status": "active"
  },
  {
    "name": "Mini Canvas Flexible Grip Toddler Sneakers",
    "slug": "mini-canvas-flexible-grip-toddler-sneakers",
    "sku": "VEX-KID-0191",
    "description": "Experience the exceptional craftsmanship of the Mini Canvas Flexible Grip Toddler Sneakers. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Mini Canvas Flexible Grip Toddler Sneakers engineered with uncompromising material quality and British standards.",
    "price": 1099,
    "compareAtPrice": 1499,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555009393-f20bdb245c4d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1555009393-f20bdb245c4d?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Footwear",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Kids",
    "stock": 38,
    "tags": [
      "Kids Wear",
      "Footwear",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 27,
    "status": "active"
  },
  {
    "name": "Soft Suede First-Walker Crib Booties",
    "slug": "soft-suede-first-walker-crib-booties",
    "sku": "VEX-KID-0192",
    "description": "Experience the exceptional craftsmanship of the Soft Suede First-Walker Crib Booties. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Soft Suede First-Walker Crib Booties engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1555009393-f20bdb245c4d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1555009393-f20bdb245c4d?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Footwear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Kids",
    "stock": 45,
    "tags": [
      "Kids Wear",
      "Footwear",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 40,
    "status": "active"
  },
  {
    "name": "Waterproof Breathable Rain Boots for Puddle Play",
    "slug": "waterproof-breathable-rain-boots-for-puddle-play",
    "sku": "VEX-KID-0193",
    "description": "Experience the exceptional craftsmanship of the Waterproof Breathable Rain Boots for Puddle Play. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Waterproof Breathable Rain Boots for Puddle Play engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555009393-f20bdb245c4d?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1602407294553-6ac9170b3ed0?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Footwear",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Kids",
    "stock": 52,
    "tags": [
      "Kids Wear",
      "Footwear",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 53,
    "status": "active"
  },
  {
    "name": "Breathable Mesh Hook-and-Loop Play Runners",
    "slug": "breathable-mesh-hook-and-loop-play-runners",
    "sku": "VEX-KID-0194",
    "description": "Experience the exceptional craftsmanship of the Breathable Mesh Hook-and-Loop Play Runners. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Breathable Mesh Hook-and-Loop Play Runners engineered with uncompromising material quality and British standards.",
    "price": 1099,
    "compareAtPrice": 1499,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555009393-f20bdb245c4d?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Footwear",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Kids",
    "stock": 59,
    "tags": [
      "Kids Wear",
      "Footwear",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 66,
    "status": "active"
  },
  {
    "name": "Ribbed Organic Cotton Pom-Pom Beanie Cap",
    "slug": "ribbed-organic-cotton-pom-pom-beanie-cap",
    "sku": "VEX-KID-0195",
    "description": "Experience the exceptional craftsmanship of the Ribbed Organic Cotton Pom-Pom Beanie Cap. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Ribbed Organic Cotton Pom-Pom Beanie Cap engineered with uncompromising material quality and British standards.",
    "price": 599,
    "compareAtPrice": 799,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Accessories",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Kids",
    "stock": 66,
    "tags": [
      "Kids Wear",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 79,
    "status": "active"
  },
  {
    "name": "Breathable Cotton Muslin Baby Bib 4-Pack",
    "slug": "breathable-cotton-muslin-baby-bib-4-pack",
    "sku": "VEX-KID-0196",
    "description": "Experience the exceptional craftsmanship of the Breathable Cotton Muslin Baby Bib 4-Pack. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Breathable Cotton Muslin Baby Bib 4-Pack engineered with uncompromising material quality and British standards.",
    "price": 499,
    "compareAtPrice": 699,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Accessories",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Kids",
    "stock": 73,
    "tags": [
      "Kids Wear",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 92,
    "status": "active"
  },
  {
    "name": "Sun-Safe Wide Brim Children Bucket Hat",
    "slug": "sun-safe-wide-brim-children-bucket-hat",
    "sku": "VEX-KID-0197",
    "description": "Experience the exceptional craftsmanship of the Sun-Safe Wide Brim Children Bucket Hat. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Sun-Safe Wide Brim Children Bucket Hat engineered with uncompromising material quality and British standards.",
    "price": 599,
    "compareAtPrice": 799,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Accessories",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Kids",
    "stock": 80,
    "tags": [
      "Kids Wear",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 105,
    "status": "active"
  },
  {
    "name": "Ultra-Soft Merino Wool Baby Knit Cardigan",
    "slug": "ultra-soft-merino-wool-baby-knit-cardigan",
    "sku": "VEX-KID-0198",
    "description": "Experience the exceptional craftsmanship of the Ultra-Soft Merino Wool Baby Knit Cardigan. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Kids Wear collection.",
    "shortDescription": "Curated luxury Ultra-Soft Merino Wool Baby Knit Cardigan engineered with uncompromising material quality and British standards.",
    "price": 1499,
    "compareAtPrice": 1999,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80&sig=121",
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80&sig=121",
    "hoverImage": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Tops",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Kids",
    "stock": 87,
    "tags": [
      "Kids Wear",
      "Tops",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 118,
    "status": "active"
  },
  {
    "name": "Washed Organic Cotton 6-Panel Dad Baseball Cap",
    "slug": "washed-organic-cotton-6-panel-dad-baseball-cap",
    "sku": "VEX-HAT-0199",
    "description": "Experience the exceptional craftsmanship of the Washed Organic Cotton 6-Panel Dad Baseball Cap. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Washed Organic Cotton 6-Panel Dad Baseball Cap engineered with uncompromising material quality and British standards.",
    "price": 899,
    "compareAtPrice": 1199,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Caps",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Hats",
    "stock": 30,
    "tags": [
      "Hats",
      "Caps",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 25,
    "status": "active"
  },
  {
    "name": "Heavyweight Cotton Twill Minimalist Unstructured Cap",
    "slug": "heavyweight-cotton-twill-minimalist-unstructured-cap",
    "sku": "VEX-HAT-0200",
    "description": "Experience the exceptional craftsmanship of the Heavyweight Cotton Twill Minimalist Unstructured Cap. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Heavyweight Cotton Twill Minimalist Unstructured Cap engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Caps",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Hats",
    "stock": 37,
    "tags": [
      "Hats",
      "Caps",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 38,
    "status": "active"
  },
  {
    "name": "Water-Resistant Technical Nylon Running Sport Cap",
    "slug": "water-resistant-technical-nylon-running-sport-cap",
    "sku": "VEX-HAT-0201",
    "description": "Experience the exceptional craftsmanship of the Water-Resistant Technical Nylon Running Sport Cap. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Water-Resistant Technical Nylon Running Sport Cap engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Caps",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Hats",
    "stock": 44,
    "tags": [
      "Hats",
      "Caps",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 51,
    "status": "active"
  },
  {
    "name": "Corduroy Vintage-Toned Curved Brim Streetwear Cap",
    "slug": "corduroy-vintage-toned-curved-brim-streetwear-cap",
    "sku": "VEX-HAT-0202",
    "description": "Experience the exceptional craftsmanship of the Corduroy Vintage-Toned Curved Brim Streetwear Cap. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Corduroy Vintage-Toned Curved Brim Streetwear Cap engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Caps",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Hats",
    "stock": 51,
    "tags": [
      "Hats",
      "Caps",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 64,
    "status": "active"
  },
  {
    "name": "Handwoven Ecuadorian Toquilla Straw Panama Hat",
    "slug": "handwoven-ecuadorian-toquilla-straw-panama-hat",
    "sku": "VEX-HAT-0203",
    "description": "Experience the exceptional craftsmanship of the Handwoven Ecuadorian Toquilla Straw Panama Hat. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Handwoven Ecuadorian Toquilla Straw Panama Hat engineered with uncompromising material quality and British standards.",
    "price": 2399,
    "compareAtPrice": 3199,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Hats",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Hats",
    "stock": 58,
    "tags": [
      "Hats",
      "Hats",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 77,
    "status": "active"
  },
  {
    "name": "Wide Brim Wool Felt Rancher Fedora in Camel",
    "slug": "wide-brim-wool-felt-rancher-fedora-in-camel",
    "sku": "VEX-HAT-0204",
    "description": "Experience the exceptional craftsmanship of the Wide Brim Wool Felt Rancher Fedora in Camel. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Wide Brim Wool Felt Rancher Fedora in Camel engineered with uncompromising material quality and British standards.",
    "price": 3099,
    "compareAtPrice": 4199,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Hats",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Hats",
    "stock": 65,
    "tags": [
      "Hats",
      "Hats",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 90,
    "status": "active"
  },
  {
    "name": "Reversible Cotton Canvas Casual Bucket Hat",
    "slug": "reversible-cotton-canvas-casual-bucket-hat",
    "sku": "VEX-HAT-0205",
    "description": "Experience the exceptional craftsmanship of the Reversible Cotton Canvas Casual Bucket Hat. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Reversible Cotton Canvas Casual Bucket Hat engineered with uncompromising material quality and British standards.",
    "price": 1099,
    "compareAtPrice": 1499,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533827432537-70133748f5c8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1533827432537-70133748f5c8?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Hats",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Hats",
    "stock": 72,
    "tags": [
      "Hats",
      "Hats",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 103,
    "status": "active"
  },
  {
    "name": "Sun-Protection UPF 50+ Packable Safari Sun Hat",
    "slug": "sun-protection-upf-50-packable-safari-sun-hat",
    "sku": "VEX-HAT-0206",
    "description": "Experience the exceptional craftsmanship of the Sun-Protection UPF 50+ Packable Safari Sun Hat. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Sun-Protection UPF 50+ Packable Safari Sun Hat engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1533827432537-70133748f5c8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1533827432537-70133748f5c8?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Hats",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Hats",
    "stock": 79,
    "tags": [
      "Hats",
      "Hats",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 116,
    "status": "active"
  },
  {
    "name": "Pure Australian Merino Wool Rib-Knit Watch Beanie",
    "slug": "pure-australian-merino-wool-rib-knit-watch-beanie",
    "sku": "VEX-HAT-0207",
    "description": "Experience the exceptional craftsmanship of the Pure Australian Merino Wool Rib-Knit Watch Beanie. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Pure Australian Merino Wool Rib-Knit Watch Beanie engineered with uncompromising material quality and British standards.",
    "price": 1199,
    "compareAtPrice": 1599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Beanies",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Hats",
    "stock": 86,
    "tags": [
      "Hats",
      "Beanies",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 129,
    "status": "active"
  },
  {
    "name": "Cashmere Cable-Knit Slouchy Winter Cuffed Beanie",
    "slug": "cashmere-cable-knit-slouchy-winter-cuffed-beanie",
    "sku": "VEX-HAT-0208",
    "description": "Experience the exceptional craftsmanship of the Cashmere Cable-Knit Slouchy Winter Cuffed Beanie. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Cashmere Cable-Knit Slouchy Winter Cuffed Beanie engineered with uncompromising material quality and British standards.",
    "price": 1799,
    "compareAtPrice": 2399,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Beanies",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Hats",
    "stock": 93,
    "tags": [
      "Hats",
      "Beanies",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 142,
    "status": "active"
  },
  {
    "name": "Waffle Knit Fisherman Short Rolled Cuff Beanie",
    "slug": "waffle-knit-fisherman-short-rolled-cuff-beanie",
    "sku": "VEX-HAT-0209",
    "description": "Experience the exceptional craftsmanship of the Waffle Knit Fisherman Short Rolled Cuff Beanie. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Waffle Knit Fisherman Short Rolled Cuff Beanie engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Beanies",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Hats",
    "stock": 100,
    "tags": [
      "Hats",
      "Beanies",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 155,
    "status": "active"
  },
  {
    "name": "Chunky Alpaca Wool Turn-Up Cozy Snow Beanie",
    "slug": "chunky-alpaca-wool-turn-up-cozy-snow-beanie",
    "sku": "VEX-HAT-0210",
    "description": "Experience the exceptional craftsmanship of the Chunky Alpaca Wool Turn-Up Cozy Snow Beanie. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Chunky Alpaca Wool Turn-Up Cozy Snow Beanie engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Beanies",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Hats",
    "stock": 107,
    "tags": [
      "Hats",
      "Beanies",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 168,
    "status": "active"
  },
  {
    "name": "British Donegal Tweed 8-Piece Baker Boy Flat Cap",
    "slug": "british-donegal-tweed-8-piece-baker-boy-flat-cap",
    "sku": "VEX-HAT-0211",
    "description": "Experience the exceptional craftsmanship of the British Donegal Tweed 8-Piece Baker Boy Flat Cap. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury British Donegal Tweed 8-Piece Baker Boy Flat Cap engineered with uncompromising material quality and British standards.",
    "price": 1599,
    "compareAtPrice": 2199,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1542327897-d73f4005b533?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1542327897-d73f4005b533?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Caps",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Hats",
    "stock": 114,
    "tags": [
      "Hats",
      "Caps",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 181,
    "status": "active"
  },
  {
    "name": "Traditional Newsboy Wool Blend Heritage Driving Cap",
    "slug": "traditional-newsboy-wool-blend-heritage-driving-cap",
    "sku": "VEX-HAT-0212",
    "description": "Experience the exceptional craftsmanship of the Traditional Newsboy Wool Blend Heritage Driving Cap. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Traditional Newsboy Wool Blend Heritage Driving Cap engineered with uncompromising material quality and British standards.",
    "price": 1499,
    "compareAtPrice": 1999,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542327897-d73f4005b533?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1542327897-d73f4005b533?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Caps",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Hats",
    "stock": 31,
    "tags": [
      "Hats",
      "Caps",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 194,
    "status": "active"
  },
  {
    "name": "Fleece-Lined Thermal Windproof Outdoor Beanie",
    "slug": "fleece-lined-thermal-windproof-outdoor-beanie",
    "sku": "VEX-HAT-0213",
    "description": "Experience the exceptional craftsmanship of the Fleece-Lined Thermal Windproof Outdoor Beanie. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Fleece-Lined Thermal Windproof Outdoor Beanie engineered with uncompromising material quality and British standards.",
    "price": 1099,
    "compareAtPrice": 1499,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Beanies",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Hats",
    "stock": 38,
    "tags": [
      "Hats",
      "Beanies",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 27,
    "status": "active"
  },
  {
    "name": "Straw Boater Hat with Black Grosgrain Ribbon",
    "slug": "straw-boater-hat-with-black-grosgrain-ribbon",
    "sku": "VEX-HAT-0214",
    "description": "Experience the exceptional craftsmanship of the Straw Boater Hat with Black Grosgrain Ribbon. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Straw Boater Hat with Black Grosgrain Ribbon engineered with uncompromising material quality and British standards.",
    "price": 1899,
    "compareAtPrice": 2599,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1496942299866-9e7ab403e614?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1496942299866-9e7ab403e614?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Hats",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Hats",
    "stock": 45,
    "tags": [
      "Hats",
      "Hats",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 40,
    "status": "active"
  },
  {
    "name": "Waxed Cotton Heritage Waterproof Rain Hat",
    "slug": "waxed-cotton-heritage-waterproof-rain-hat",
    "sku": "VEX-HAT-0215",
    "description": "Experience the exceptional craftsmanship of the Waxed Cotton Heritage Waterproof Rain Hat. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Waxed Cotton Heritage Waterproof Rain Hat engineered with uncompromising material quality and British standards.",
    "price": 1499,
    "compareAtPrice": 1999,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Hats",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Hats",
    "stock": 52,
    "tags": [
      "Hats",
      "Hats",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 53,
    "status": "active"
  },
  {
    "name": "Suede Flat Brim Snapback Architectural Cap",
    "slug": "suede-flat-brim-snapback-architectural-cap",
    "sku": "VEX-HAT-0216",
    "description": "Experience the exceptional craftsmanship of the Suede Flat Brim Snapback Architectural Cap. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Suede Flat Brim Snapback Architectural Cap engineered with uncompromising material quality and British standards.",
    "price": 1199,
    "compareAtPrice": 1599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Caps",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Hats",
    "stock": 59,
    "tags": [
      "Hats",
      "Caps",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 66,
    "status": "active"
  },
  {
    "name": "Merino Wool Balaclava Hood Neck Warmer Combo",
    "slug": "merino-wool-balaclava-hood-neck-warmer-combo",
    "sku": "VEX-HAT-0217",
    "description": "Experience the exceptional craftsmanship of the Merino Wool Balaclava Hood Neck Warmer Combo. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Merino Wool Balaclava Hood Neck Warmer Combo engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1517941823-815bea90d291?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1517941823-815bea90d291?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Beanies",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Hats",
    "stock": 66,
    "tags": [
      "Hats",
      "Beanies",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 79,
    "status": "active"
  },
  {
    "name": "Open-Weave Linen Breathable Summer Ivy Flat Cap",
    "slug": "open-weave-linen-breathable-summer-ivy-flat-cap",
    "sku": "VEX-HAT-0218",
    "description": "Experience the exceptional craftsmanship of the Open-Weave Linen Breathable Summer Ivy Flat Cap. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Open-Weave Linen Breathable Summer Ivy Flat Cap engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1621075160523-b936ad96132a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542327897-d73f4005b533?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1621075160523-b936ad96132a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1542327897-d73f4005b533?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Caps",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Hats",
    "stock": 73,
    "tags": [
      "Hats",
      "Caps",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 92,
    "status": "active"
  },
  {
    "name": "Foldable Packable Crushable Travel Bucket Sun Hat",
    "slug": "foldable-packable-crushable-travel-bucket-sun-hat",
    "sku": "VEX-HAT-0219",
    "description": "Experience the exceptional craftsmanship of the Foldable Packable Crushable Travel Bucket Sun Hat. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Foldable Packable Crushable Travel Bucket Sun Hat engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533827432537-70133748f5c8?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Hats",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Hats",
    "stock": 80,
    "tags": [
      "Hats",
      "Hats",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 105,
    "status": "active"
  },
  {
    "name": "Wool Felt Pork Pie Hat with Silk Interior Lining",
    "slug": "wool-felt-pork-pie-hat-with-silk-interior-lining",
    "sku": "VEX-HAT-0220",
    "description": "Experience the exceptional craftsmanship of the Wool Felt Pork Pie Hat with Silk Interior Lining. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Hats collection.",
    "shortDescription": "Curated luxury Wool Felt Pork Pie Hat with Silk Interior Lining engineered with uncompromising material quality and British standards.",
    "price": 2599,
    "compareAtPrice": 3499,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80&sig=121",
      "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80&sig=121",
    "hoverImage": "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Hats",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Hats",
    "stock": 87,
    "tags": [
      "Hats",
      "Hats",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 118,
    "status": "active"
  },
  {
    "name": "VEXIVO Solstice Polarised Beta-Titanium Sunglasses 18g",
    "slug": "vexivo-solstice-polarised-beta-titanium-sunglasses-18g",
    "sku": "VEX-VIS-0221",
    "description": "Experience the exceptional craftsmanship of the VEXIVO Solstice Polarised Beta-Titanium Sunglasses 18g. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury VEXIVO Solstice Polarised Beta-Titanium Sunglasses 18g engineered with uncompromising material quality and British standards.",
    "price": 4099,
    "compareAtPrice": 5499,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Sunglasses",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Vision",
    "stock": 30,
    "tags": [
      "Vision Care",
      "Sunglasses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 25,
    "status": "active"
  },
  {
    "name": "Hexagonal Architectural Gold Frame Gradient Sunglasses",
    "slug": "hexagonal-architectural-gold-frame-gradient-sunglasses",
    "sku": "VEX-VIS-0222",
    "description": "Experience the exceptional craftsmanship of the Hexagonal Architectural Gold Frame Gradient Sunglasses. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Hexagonal Architectural Gold Frame Gradient Sunglasses engineered with uncompromising material quality and British standards.",
    "price": 3499,
    "compareAtPrice": 4699,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80&sig=101",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80&sig=101",
    "hoverImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Sunglasses",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Vision",
    "stock": 37,
    "tags": [
      "Vision Care",
      "Sunglasses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 38,
    "status": "active"
  },
  {
    "name": "Classic Wayfarer Tortoiseshell CR-39 Polarised Shades",
    "slug": "classic-wayfarer-tortoiseshell-cr-39-polarised-shades",
    "sku": "VEX-VIS-0223",
    "description": "Experience the exceptional craftsmanship of the Classic Wayfarer Tortoiseshell CR-39 Polarised Shades. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Classic Wayfarer Tortoiseshell CR-39 Polarised Shades engineered with uncompromising material quality and British standards.",
    "price": 3099,
    "compareAtPrice": 4199,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Sunglasses",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Vision",
    "stock": 44,
    "tags": [
      "Vision Care",
      "Sunglasses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 51,
    "status": "active"
  },
  {
    "name": "Rimless Titanium Aviator Sunglasses with Mirror Lens",
    "slug": "rimless-titanium-aviator-sunglasses-with-mirror-lens",
    "sku": "VEX-VIS-0224",
    "description": "Experience the exceptional craftsmanship of the Rimless Titanium Aviator Sunglasses with Mirror Lens. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Rimless Titanium Aviator Sunglasses with Mirror Lens engineered with uncompromising material quality and British standards.",
    "price": 3799,
    "compareAtPrice": 5099,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Sunglasses",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Vision",
    "stock": 51,
    "tags": [
      "Vision Care",
      "Sunglasses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 64,
    "status": "active"
  },
  {
    "name": "Cat-Eye Acetate Sculpted Vintage UV400 Sunglasses",
    "slug": "cat-eye-acetate-sculpted-vintage-uv400-sunglasses",
    "sku": "VEX-VIS-0225",
    "description": "Experience the exceptional craftsmanship of the Cat-Eye Acetate Sculpted Vintage UV400 Sunglasses. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Cat-Eye Acetate Sculpted Vintage UV400 Sunglasses engineered with uncompromising material quality and British standards.",
    "price": 2699,
    "compareAtPrice": 3599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Sunglasses",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Vision",
    "stock": 58,
    "tags": [
      "Vision Care",
      "Sunglasses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 77,
    "status": "active"
  },
  {
    "name": "Bold Rectangular 90s Silhouette Matte Black Shades",
    "slug": "bold-rectangular-90s-silhouette-matte-black-shades",
    "sku": "VEX-VIS-0226",
    "description": "Experience the exceptional craftsmanship of the Bold Rectangular 90s Silhouette Matte Black Shades. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Bold Rectangular 90s Silhouette Matte Black Shades engineered with uncompromising material quality and British standards.",
    "price": 2599,
    "compareAtPrice": 3499,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Sunglasses",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Vision",
    "stock": 65,
    "tags": [
      "Vision Care",
      "Sunglasses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 90,
    "status": "active"
  },
  {
    "name": "Blue Light Filter Computer Spectacles in Clear Acetate",
    "slug": "blue-light-filter-computer-spectacles-in-clear-acetate",
    "sku": "VEX-VIS-0227",
    "description": "Experience the exceptional craftsmanship of the Blue Light Filter Computer Spectacles in Clear Acetate. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Blue Light Filter Computer Spectacles in Clear Acetate engineered with uncompromising material quality and British standards.",
    "price": 2199,
    "compareAtPrice": 2999,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Glasses",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Vision",
    "stock": 72,
    "tags": [
      "Vision Care",
      "Glasses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 103,
    "status": "active"
  },
  {
    "name": "Round Horn-Rimmed Blue Light Blocking Reading Glasses",
    "slug": "round-horn-rimmed-blue-light-blocking-reading-glasses",
    "sku": "VEX-VIS-0228",
    "description": "Experience the exceptional craftsmanship of the Round Horn-Rimmed Blue Light Blocking Reading Glasses. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Round Horn-Rimmed Blue Light Blocking Reading Glasses engineered with uncompromising material quality and British standards.",
    "price": 2299,
    "compareAtPrice": 3099,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Glasses",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Vision",
    "stock": 79,
    "tags": [
      "Vision Care",
      "Glasses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 116,
    "status": "active"
  },
  {
    "name": "Titanium Wire Ultra-Lightweight Everyday Optical Frames",
    "slug": "titanium-wire-ultra-lightweight-everyday-optical-frames",
    "sku": "VEX-VIS-0229",
    "description": "Experience the exceptional craftsmanship of the Titanium Wire Ultra-Lightweight Everyday Optical Frames. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Titanium Wire Ultra-Lightweight Everyday Optical Frames engineered with uncompromising material quality and British standards.",
    "price": 3599,
    "compareAtPrice": 4899,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Glasses",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Vision",
    "stock": 86,
    "tags": [
      "Vision Care",
      "Glasses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 129,
    "status": "active"
  },
  {
    "name": "Keyhole Bridge Circular Heritage Spectacle Frames",
    "slug": "keyhole-bridge-circular-heritage-spectacle-frames",
    "sku": "VEX-VIS-0230",
    "description": "Experience the exceptional craftsmanship of the Keyhole Bridge Circular Heritage Spectacle Frames. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Keyhole Bridge Circular Heritage Spectacle Frames engineered with uncompromising material quality and British standards.",
    "price": 2699,
    "compareAtPrice": 3599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Glasses",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Vision",
    "stock": 93,
    "tags": [
      "Vision Care",
      "Glasses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 142,
    "status": "active"
  },
  {
    "name": "Square Minimalist Matte Titanium Optical Eyeglasses",
    "slug": "square-minimalist-matte-titanium-optical-eyeglasses",
    "sku": "VEX-VIS-0231",
    "description": "Experience the exceptional craftsmanship of the Square Minimalist Matte Titanium Optical Eyeglasses. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Square Minimalist Matte Titanium Optical Eyeglasses engineered with uncompromising material quality and British standards.",
    "price": 3199,
    "compareAtPrice": 4299,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Glasses",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Vision",
    "stock": 100,
    "tags": [
      "Vision Care",
      "Glasses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 155,
    "status": "active"
  },
  {
    "name": "Clip-On Magnetic Polarised Sun Shade Attachments",
    "slug": "clip-on-magnetic-polarised-sun-shade-attachments",
    "sku": "VEX-VIS-0232",
    "description": "Experience the exceptional craftsmanship of the Clip-On Magnetic Polarised Sun Shade Attachments. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Clip-On Magnetic Polarised Sun Shade Attachments engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Glasses",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Vision",
    "stock": 107,
    "tags": [
      "Vision Care",
      "Glasses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 168,
    "status": "active"
  },
  {
    "name": "Full-Grain Leather Hard Eyewear Clamshell Case",
    "slug": "full-grain-leather-hard-eyewear-clamshell-case",
    "sku": "VEX-VIS-0233",
    "description": "Experience the exceptional craftsmanship of the Full-Grain Leather Hard Eyewear Clamshell Case. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Full-Grain Leather Hard Eyewear Clamshell Case engineered with uncompromising material quality and British standards.",
    "price": 1099,
    "compareAtPrice": 1499,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80&sig=112",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80&sig=112",
    "hoverImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Accessories",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Vision",
    "stock": 114,
    "tags": [
      "Vision Care",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 181,
    "status": "active"
  },
  {
    "name": "Microfibre Anti-Fog Optical Lens Cleaning Cloth 3-Pack",
    "slug": "microfibre-anti-fog-optical-lens-cleaning-cloth-3-pack",
    "sku": "VEX-VIS-0234",
    "description": "Experience the exceptional craftsmanship of the Microfibre Anti-Fog Optical Lens Cleaning Cloth 3-Pack. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Microfibre Anti-Fog Optical Lens Cleaning Cloth 3-Pack engineered with uncompromising material quality and British standards.",
    "price": 499,
    "compareAtPrice": 699,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80&sig=113",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80&sig=113",
    "hoverImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Accessories",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Vision",
    "stock": 31,
    "tags": [
      "Vision Care",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 194,
    "status": "active"
  },
  {
    "name": "Handcrafted Braided Leather Glasses Neck Cord Strap",
    "slug": "handcrafted-braided-leather-glasses-neck-cord-strap",
    "sku": "VEX-VIS-0235",
    "description": "Experience the exceptional craftsmanship of the Handcrafted Braided Leather Glasses Neck Cord Strap. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Handcrafted Braided Leather Glasses Neck Cord Strap engineered with uncompromising material quality and British standards.",
    "price": 699,
    "compareAtPrice": 899,
    "discount": 22,
    "images": [
      "https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=800&q=80&sig=114",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=800&q=80&sig=114",
    "hoverImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Accessories",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Vision",
    "stock": 38,
    "tags": [
      "Vision Care",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 27,
    "status": "active"
  },
  {
    "name": "Precision Ultrasonic Eyewear & Jewelry Cleaner Basin",
    "slug": "precision-ultrasonic-eyewear-jewelry-cleaner-basin",
    "sku": "VEX-VIS-0236",
    "description": "Experience the exceptional craftsmanship of the Precision Ultrasonic Eyewear & Jewelry Cleaner Basin. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Precision Ultrasonic Eyewear & Jewelry Cleaner Basin engineered with uncompromising material quality and British standards.",
    "price": 1899,
    "compareAtPrice": 2599,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Accessories",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Vision",
    "stock": 45,
    "tags": [
      "Vision Care",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 40,
    "status": "active"
  },
  {
    "name": "Gold-Plated Stainless Steel Eyewear Lanyard Chain",
    "slug": "gold-plated-stainless-steel-eyewear-lanyard-chain",
    "sku": "VEX-VIS-0237",
    "description": "Experience the exceptional craftsmanship of the Gold-Plated Stainless Steel Eyewear Lanyard Chain. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Gold-Plated Stainless Steel Eyewear Lanyard Chain engineered with uncompromising material quality and British standards.",
    "price": 699,
    "compareAtPrice": 899,
    "discount": 22,
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80&sig=116",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80&sig=116",
    "hoverImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Accessories",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Vision",
    "stock": 52,
    "tags": [
      "Vision Care",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 53,
    "status": "active"
  },
  {
    "name": "Over-the-Glasses UV400 Driving Glare Reduction Shield",
    "slug": "over-the-glasses-uv400-driving-glare-reduction-shield",
    "sku": "VEX-VIS-0238",
    "description": "Experience the exceptional craftsmanship of the Over-the-Glasses UV400 Driving Glare Reduction Shield. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Over-the-Glasses UV400 Driving Glare Reduction Shield engineered with uncompromising material quality and British standards.",
    "price": 1199,
    "compareAtPrice": 1599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80&sig=117",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80&sig=117",
    "hoverImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Sunglasses",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Vision",
    "stock": 59,
    "tags": [
      "Vision Care",
      "Sunglasses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 66,
    "status": "active"
  },
  {
    "name": "Compact Folding Pocket Reading Glasses with Slim Sleeve",
    "slug": "compact-folding-pocket-reading-glasses-with-slim-sleeve",
    "sku": "VEX-VIS-0239",
    "description": "Experience the exceptional craftsmanship of the Compact Folding Pocket Reading Glasses with Slim Sleeve. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Compact Folding Pocket Reading Glasses with Slim Sleeve engineered with uncompromising material quality and British standards.",
    "price": 1399,
    "compareAtPrice": 1899,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80&sig=118",
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80&sig=118",
    "hoverImage": "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Glasses",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Vision",
    "stock": 66,
    "tags": [
      "Vision Care",
      "Glasses",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 79,
    "status": "active"
  },
  {
    "name": "Sport Floating Strap for Water Outdoor Sunglasses",
    "slug": "sport-floating-strap-for-water-outdoor-sunglasses",
    "sku": "VEX-VIS-0240",
    "description": "Experience the exceptional craftsmanship of the Sport Floating Strap for Water Outdoor Sunglasses. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Sport Floating Strap for Water Outdoor Sunglasses engineered with uncompromising material quality and British standards.",
    "price": 499,
    "compareAtPrice": 699,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80&sig=119",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80&sig=119",
    "hoverImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Accessories",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Vision",
    "stock": 73,
    "tags": [
      "Vision Care",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 92,
    "status": "active"
  },
  {
    "name": "Anti-Scratch Lens Cleaning Spray Solution 100ml Kit",
    "slug": "anti-scratch-lens-cleaning-spray-solution-100ml-kit",
    "sku": "VEX-VIS-0241",
    "description": "Experience the exceptional craftsmanship of the Anti-Scratch Lens Cleaning Spray Solution 100ml Kit. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Anti-Scratch Lens Cleaning Spray Solution 100ml Kit engineered with uncompromising material quality and British standards.",
    "price": 499,
    "compareAtPrice": 699,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80&sig=120",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80&sig=120",
    "hoverImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Accessories",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Vision",
    "stock": 80,
    "tags": [
      "Vision Care",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 105,
    "status": "active"
  },
  {
    "name": "Eyewear Screwdriver & Silicone Nosepad Repair Toolkit",
    "slug": "eyewear-screwdriver-silicone-nosepad-repair-toolkit",
    "sku": "VEX-VIS-0242",
    "description": "Experience the exceptional craftsmanship of the Eyewear Screwdriver & Silicone Nosepad Repair Toolkit. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Vision Care collection.",
    "shortDescription": "Curated luxury Eyewear Screwdriver & Silicone Nosepad Repair Toolkit engineered with uncompromising material quality and British standards.",
    "price": 499,
    "compareAtPrice": 699,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80&sig=121",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=800&q=80&sig=121",
    "hoverImage": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Accessories",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Vision",
    "stock": 87,
    "tags": [
      "Vision Care",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 118,
    "status": "active"
  },
  {
    "name": "Orthopedic Memory Foam Ergonomic Pet Lounger Bed",
    "slug": "orthopedic-memory-foam-ergonomic-pet-lounger-bed",
    "sku": "VEX-PET-0243",
    "description": "Experience the exceptional craftsmanship of the Orthopedic Memory Foam Ergonomic Pet Lounger Bed. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Orthopedic Memory Foam Ergonomic Pet Lounger Bed engineered with uncompromising material quality and British standards.",
    "price": 2699,
    "compareAtPrice": 3599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Beds",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Pets",
    "stock": 30,
    "tags": [
      "Pets Care",
      "Beds",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 25,
    "status": "active"
  },
  {
    "name": "Washable Organic Bamboo Fibre Calming Donut Pet Bed",
    "slug": "washable-organic-bamboo-fibre-calming-donut-pet-bed",
    "sku": "VEX-PET-0244",
    "description": "Experience the exceptional craftsmanship of the Washable Organic Bamboo Fibre Calming Donut Pet Bed. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Washable Organic Bamboo Fibre Calming Donut Pet Bed engineered with uncompromising material quality and British standards.",
    "price": 2199,
    "compareAtPrice": 2999,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Beds",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Pets",
    "stock": 37,
    "tags": [
      "Pets Care",
      "Beds",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 38,
    "status": "active"
  },
  {
    "name": "Ceramic Weighted Elevated Pet Feeding Bowl Duo",
    "slug": "ceramic-weighted-elevated-pet-feeding-bowl-duo",
    "sku": "VEX-PET-0245",
    "description": "Experience the exceptional craftsmanship of the Ceramic Weighted Elevated Pet Feeding Bowl Duo. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Ceramic Weighted Elevated Pet Feeding Bowl Duo engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Feeding",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Pets",
    "stock": 44,
    "tags": [
      "Pets Care",
      "Feeding",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 51,
    "status": "active"
  },
  {
    "name": "Stainless Steel Automatic Circulating Pet Water Fountain",
    "slug": "stainless-steel-automatic-circulating-pet-water-fountain",
    "sku": "VEX-PET-0246",
    "description": "Experience the exceptional craftsmanship of the Stainless Steel Automatic Circulating Pet Water Fountain. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Stainless Steel Automatic Circulating Pet Water Fountain engineered with uncompromising material quality and British standards.",
    "price": 1499,
    "compareAtPrice": 1999,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Feeding",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Pets",
    "stock": 51,
    "tags": [
      "Pets Care",
      "Feeding",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 64,
    "status": "active"
  },
  {
    "name": "Travel Packable Water-Resistant Dog Car Seat Cover",
    "slug": "travel-packable-water-resistant-dog-car-seat-cover",
    "sku": "VEX-PET-0247",
    "description": "Experience the exceptional craftsmanship of the Travel Packable Water-Resistant Dog Car Seat Cover. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Travel Packable Water-Resistant Dog Car Seat Cover engineered with uncompromising material quality and British standards.",
    "price": 1599,
    "compareAtPrice": 2199,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Travel",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Pets",
    "stock": 58,
    "tags": [
      "Pets Care",
      "Travel",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 77,
    "status": "active"
  },
  {
    "name": "English Bridle Leather Brass Hardware Dog Collar",
    "slug": "english-bridle-leather-brass-hardware-dog-collar",
    "sku": "VEX-PET-0248",
    "description": "Experience the exceptional craftsmanship of the English Bridle Leather Brass Hardware Dog Collar. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury English Bridle Leather Brass Hardware Dog Collar engineered with uncompromising material quality and British standards.",
    "price": 1099,
    "compareAtPrice": 1499,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Collars",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Pets",
    "stock": 65,
    "tags": [
      "Pets Care",
      "Collars",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 90,
    "status": "active"
  },
  {
    "name": "Shock-Absorbing Bungee Running Dog Leash 6ft",
    "slug": "shock-absorbing-bungee-running-dog-leash-6ft",
    "sku": "VEX-PET-0249",
    "description": "Experience the exceptional craftsmanship of the Shock-Absorbing Bungee Running Dog Leash 6ft. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Shock-Absorbing Bungee Running Dog Leash 6ft engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Collars",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Pets",
    "stock": 72,
    "tags": [
      "Pets Care",
      "Collars",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 103,
    "status": "active"
  },
  {
    "name": "Breathable No-Pull Mesh Comfort Dog Chest Harness",
    "slug": "breathable-no-pull-mesh-comfort-dog-chest-harness",
    "sku": "VEX-PET-0250",
    "description": "Experience the exceptional craftsmanship of the Breathable No-Pull Mesh Comfort Dog Chest Harness. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Breathable No-Pull Mesh Comfort Dog Chest Harness engineered with uncompromising material quality and British standards.",
    "price": 1199,
    "compareAtPrice": 1599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Collars",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Pets",
    "stock": 79,
    "tags": [
      "Pets Care",
      "Collars",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 116,
    "status": "active"
  },
  {
    "name": "Reflective Night-Walk Adjustable Pet Safety Vest",
    "slug": "reflective-night-walk-adjustable-pet-safety-vest",
    "sku": "VEX-PET-0251",
    "description": "Experience the exceptional craftsmanship of the Reflective Night-Walk Adjustable Pet Safety Vest. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Reflective Night-Walk Adjustable Pet Safety Vest engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Clothing",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Pets",
    "stock": 86,
    "tags": [
      "Pets Care",
      "Clothing",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 129,
    "status": "active"
  },
  {
    "name": "Vegetable-Tanned Leather Poop Bag Dispenser Pouch",
    "slug": "vegetable-tanned-leather-poop-bag-dispenser-pouch",
    "sku": "VEX-PET-0252",
    "description": "Experience the exceptional craftsmanship of the Vegetable-Tanned Leather Poop Bag Dispenser Pouch. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Vegetable-Tanned Leather Poop Bag Dispenser Pouch engineered with uncompromising material quality and British standards.",
    "price": 699,
    "compareAtPrice": 899,
    "discount": 22,
    "images": [
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Accessories",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Pets",
    "stock": 93,
    "tags": [
      "Pets Care",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 142,
    "status": "active"
  },
  {
    "name": "Organic Oatmeal & Aloe Hypoallergenic Pet Shampoo",
    "slug": "organic-oatmeal-aloe-hypoallergenic-pet-shampoo",
    "sku": "VEX-PET-0253",
    "description": "Experience the exceptional craftsmanship of the Organic Oatmeal & Aloe Hypoallergenic Pet Shampoo. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Organic Oatmeal & Aloe Hypoallergenic Pet Shampoo engineered with uncompromising material quality and British standards.",
    "price": 599,
    "compareAtPrice": 799,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Grooming",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Pets",
    "stock": 100,
    "tags": [
      "Pets Care",
      "Grooming",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 155,
    "status": "active"
  },
  {
    "name": "Detangling Stainless Steel Dual-Sided Undercoat Rake",
    "slug": "detangling-stainless-steel-dual-sided-undercoat-rake",
    "sku": "VEX-PET-0254",
    "description": "Experience the exceptional craftsmanship of the Detangling Stainless Steel Dual-Sided Undercoat Rake. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Detangling Stainless Steel Dual-Sided Undercoat Rake engineered with uncompromising material quality and British standards.",
    "price": 699,
    "compareAtPrice": 899,
    "discount": 22,
    "images": [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Grooming",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Pets",
    "stock": 107,
    "tags": [
      "Pets Care",
      "Grooming",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 168,
    "status": "active"
  },
  {
    "name": "Self-Cleaning Slicker Pet Grooming Deshedding Brush",
    "slug": "self-cleaning-slicker-pet-grooming-deshedding-brush",
    "sku": "VEX-PET-0255",
    "description": "Experience the exceptional craftsmanship of the Self-Cleaning Slicker Pet Grooming Deshedding Brush. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Self-Cleaning Slicker Pet Grooming Deshedding Brush engineered with uncompromising material quality and British standards.",
    "price": 799,
    "compareAtPrice": 1099,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Grooming",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Pets",
    "stock": 114,
    "tags": [
      "Pets Care",
      "Grooming",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 181,
    "status": "active"
  },
  {
    "name": "Gentle Silicone Toothbrush & Enzymatic Pet Toothpaste",
    "slug": "gentle-silicone-toothbrush-enzymatic-pet-toothpaste",
    "sku": "VEX-PET-0256",
    "description": "Experience the exceptional craftsmanship of the Gentle Silicone Toothbrush & Enzymatic Pet Toothpaste. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Gentle Silicone Toothbrush & Enzymatic Pet Toothpaste engineered with uncompromising material quality and British standards.",
    "price": 499,
    "compareAtPrice": 699,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Grooming",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Pets",
    "stock": 31,
    "tags": [
      "Pets Care",
      "Grooming",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 194,
    "status": "active"
  },
  {
    "name": "Natural Shea Butter & Beeswax Soothing Paw Balm",
    "slug": "natural-shea-butter-beeswax-soothing-paw-balm",
    "sku": "VEX-PET-0257",
    "description": "Experience the exceptional craftsmanship of the Natural Shea Butter & Beeswax Soothing Paw Balm. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Natural Shea Butter & Beeswax Soothing Paw Balm engineered with uncompromising material quality and British standards.",
    "price": 499,
    "compareAtPrice": 699,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Grooming",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Pets",
    "stock": 38,
    "tags": [
      "Pets Care",
      "Grooming",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 27,
    "status": "active"
  },
  {
    "name": "Professional Quiet Rechargeable Pet Nail Grinder",
    "slug": "professional-quiet-rechargeable-pet-nail-grinder",
    "sku": "VEX-PET-0258",
    "description": "Experience the exceptional craftsmanship of the Professional Quiet Rechargeable Pet Nail Grinder. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Professional Quiet Rechargeable Pet Nail Grinder engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Grooming",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Pets",
    "stock": 45,
    "tags": [
      "Pets Care",
      "Grooming",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 40,
    "status": "active"
  },
  {
    "name": "Natural Rubber Treat-Dispensing Enrichment Chew Toy",
    "slug": "natural-rubber-treat-dispensing-enrichment-chew-toy",
    "sku": "VEX-PET-0259",
    "description": "Experience the exceptional craftsmanship of the Natural Rubber Treat-Dispensing Enrichment Chew Toy. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Natural Rubber Treat-Dispensing Enrichment Chew Toy engineered with uncompromising material quality and British standards.",
    "price": 599,
    "compareAtPrice": 799,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80&sig=116",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80&sig=116",
    "hoverImage": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Toys",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Pets",
    "stock": 52,
    "tags": [
      "Pets Care",
      "Toys",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 53,
    "status": "active"
  },
  {
    "name": "Braided Cotton Rope Interactive Tug Dental Play Toy",
    "slug": "braided-cotton-rope-interactive-tug-dental-play-toy",
    "sku": "VEX-PET-0260",
    "description": "Experience the exceptional craftsmanship of the Braided Cotton Rope Interactive Tug Dental Play Toy. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Braided Cotton Rope Interactive Tug Dental Play Toy engineered with uncompromising material quality and British standards.",
    "price": 499,
    "compareAtPrice": 699,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80&sig=117",
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80&sig=117",
    "hoverImage": "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Toys",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Pets",
    "stock": 59,
    "tags": [
      "Pets Care",
      "Toys",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 66,
    "status": "active"
  },
  {
    "name": "Catnip-Infused Natural Wood & Sisal Scratching Post",
    "slug": "catnip-infused-natural-wood-sisal-scratching-post",
    "sku": "VEX-PET-0261",
    "description": "Experience the exceptional craftsmanship of the Catnip-Infused Natural Wood & Sisal Scratching Post. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Catnip-Infused Natural Wood & Sisal Scratching Post engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Toys",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Pets",
    "stock": 66,
    "tags": [
      "Pets Care",
      "Toys",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 79,
    "status": "active"
  },
  {
    "name": "Warm Water-Repellent Winter Dog Puffer Jacket Vest",
    "slug": "warm-water-repellent-winter-dog-puffer-jacket-vest",
    "sku": "VEX-PET-0262",
    "description": "Experience the exceptional craftsmanship of the Warm Water-Repellent Winter Dog Puffer Jacket Vest. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Warm Water-Repellent Winter Dog Puffer Jacket Vest engineered with uncompromising material quality and British standards.",
    "price": 1199,
    "compareAtPrice": 1599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80&sig=119",
      "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80&sig=119",
    "hoverImage": "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Clothing",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Pets",
    "stock": 73,
    "tags": [
      "Pets Care",
      "Clothing",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 92,
    "status": "active"
  },
  {
    "name": "Microfibre Ultra-Absorbent Quick-Dry Pet Towel",
    "slug": "microfibre-ultra-absorbent-quick-dry-pet-towel",
    "sku": "VEX-PET-0263",
    "description": "Experience the exceptional craftsmanship of the Microfibre Ultra-Absorbent Quick-Dry Pet Towel. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Microfibre Ultra-Absorbent Quick-Dry Pet Towel engineered with uncompromising material quality and British standards.",
    "price": 599,
    "compareAtPrice": 799,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80&sig=120",
      "https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80&sig=120",
    "hoverImage": "https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Grooming",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Pets",
    "stock": 80,
    "tags": [
      "Pets Care",
      "Grooming",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 105,
    "status": "active"
  },
  {
    "name": "Portable Silicone Collapsible Travel Pet Water Bottle",
    "slug": "portable-silicone-collapsible-travel-pet-water-bottle",
    "sku": "VEX-PET-0264",
    "description": "Experience the exceptional craftsmanship of the Portable Silicone Collapsible Travel Pet Water Bottle. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Pets Care collection.",
    "shortDescription": "Curated luxury Portable Silicone Collapsible Travel Pet Water Bottle engineered with uncompromising material quality and British standards.",
    "price": 699,
    "compareAtPrice": 899,
    "discount": 22,
    "images": [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80&sig=121",
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80&sig=121",
    "hoverImage": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Travel",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Pets",
    "stock": 87,
    "tags": [
      "Pets Care",
      "Travel",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 118,
    "status": "active"
  },
  {
    "name": "Hand-Carved Sustainable Beechwood Building Blocks 60-Piece",
    "slug": "hand-carved-sustainable-beechwood-building-blocks-60-piece",
    "sku": "VEX-TOY-0265",
    "description": "Experience the exceptional craftsmanship of the Hand-Carved Sustainable Beechwood Building Blocks 60-Piece. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Hand-Carved Sustainable Beechwood Building Blocks 60-Piece engineered with uncompromising material quality and British standards.",
    "price": 1499,
    "compareAtPrice": 1999,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Wooden Toys",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Toys",
    "stock": 30,
    "tags": [
      "Toys",
      "Wooden Toys",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 25,
    "status": "active"
  },
  {
    "name": "Montessori Geometric Shape Stacker & Sorter Wood Toy",
    "slug": "montessori-geometric-shape-stacker-sorter-wood-toy",
    "sku": "VEX-TOY-0266",
    "description": "Experience the exceptional craftsmanship of the Montessori Geometric Shape Stacker & Sorter Wood Toy. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Montessori Geometric Shape Stacker & Sorter Wood Toy engineered with uncompromising material quality and British standards.",
    "price": 1099,
    "compareAtPrice": 1499,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Wooden Toys",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Toys",
    "stock": 37,
    "tags": [
      "Toys",
      "Wooden Toys",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 38,
    "status": "active"
  },
  {
    "name": "Organic Cotton Velvet Classic Heirloom Teddy Bear",
    "slug": "organic-cotton-velvet-classic-heirloom-teddy-bear",
    "sku": "VEX-TOY-0267",
    "description": "Experience the exceptional craftsmanship of the Organic Cotton Velvet Classic Heirloom Teddy Bear. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Organic Cotton Velvet Classic Heirloom Teddy Bear engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Plush",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Toys",
    "stock": 44,
    "tags": [
      "Toys",
      "Plush",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 51,
    "status": "active"
  },
  {
    "name": "Wooden Magnetic Train Engine & Carriages Track Set",
    "slug": "wooden-magnetic-train-engine-carriages-track-set",
    "sku": "VEX-TOY-0268",
    "description": "Experience the exceptional craftsmanship of the Wooden Magnetic Train Engine & Carriages Track Set. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Wooden Magnetic Train Engine & Carriages Track Set engineered with uncompromising material quality and British standards.",
    "price": 1899,
    "compareAtPrice": 2599,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80&sig=103",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80&sig=103",
    "hoverImage": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Wooden Toys",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Toys",
    "stock": 51,
    "tags": [
      "Toys",
      "Wooden Toys",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 64,
    "status": "active"
  },
  {
    "name": "Handcrafted Pull-Along Wooden Puppy Toy with Wheels",
    "slug": "handcrafted-pull-along-wooden-puppy-toy-with-wheels",
    "sku": "VEX-TOY-0269",
    "description": "Experience the exceptional craftsmanship of the Handcrafted Pull-Along Wooden Puppy Toy with Wheels. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Handcrafted Pull-Along Wooden Puppy Toy with Wheels engineered with uncompromising material quality and British standards.",
    "price": 899,
    "compareAtPrice": 1199,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Wooden Toys",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Toys",
    "stock": 58,
    "tags": [
      "Toys",
      "Wooden Toys",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 77,
    "status": "active"
  },
  {
    "name": "Handmade Felt Animal Safari Puppet Collection",
    "slug": "handmade-felt-animal-safari-puppet-collection",
    "sku": "VEX-TOY-0270",
    "description": "Experience the exceptional craftsmanship of the Handmade Felt Animal Safari Puppet Collection. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Handmade Felt Animal Safari Puppet Collection engineered with uncompromising material quality and British standards.",
    "price": 1099,
    "compareAtPrice": 1499,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Plush",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Toys",
    "stock": 65,
    "tags": [
      "Toys",
      "Plush",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 90,
    "status": "active"
  },
  {
    "name": "Solid Walnut Luxury Hand-Carved Chess & Checkers Set",
    "slug": "solid-walnut-luxury-hand-carved-chess-checkers-set",
    "sku": "VEX-TOY-0271",
    "description": "Experience the exceptional craftsmanship of the Solid Walnut Luxury Hand-Carved Chess & Checkers Set. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Solid Walnut Luxury Hand-Carved Chess & Checkers Set engineered with uncompromising material quality and British standards.",
    "price": 3799,
    "compareAtPrice": 5099,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Board Games",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Toys",
    "stock": 72,
    "tags": [
      "Toys",
      "Board Games",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 103,
    "status": "active"
  },
  {
    "name": "Tactile Wooden Tumble Tower Balancing Block Game",
    "slug": "tactile-wooden-tumble-tower-balancing-block-game",
    "sku": "VEX-TOY-0272",
    "description": "Experience the exceptional craftsmanship of the Tactile Wooden Tumble Tower Balancing Block Game. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Tactile Wooden Tumble Tower Balancing Block Game engineered with uncompromising material quality and British standards.",
    "price": 1199,
    "compareAtPrice": 1599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Board Games",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Toys",
    "stock": 79,
    "tags": [
      "Toys",
      "Board Games",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 116,
    "status": "active"
  },
  {
    "name": "Family Strategy Board Game of Expeditions & Discovery",
    "slug": "family-strategy-board-game-of-expeditions-discovery",
    "sku": "VEX-TOY-0273",
    "description": "Experience the exceptional craftsmanship of the Family Strategy Board Game of Expeditions & Discovery. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Family Strategy Board Game of Expeditions & Discovery engineered with uncompromising material quality and British standards.",
    "price": 1399,
    "compareAtPrice": 1899,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Board Games",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Toys",
    "stock": 86,
    "tags": [
      "Toys",
      "Board Games",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 129,
    "status": "active"
  },
  {
    "name": "Cast Brass Vintage Dominoes Set in Wooden Case",
    "slug": "cast-brass-vintage-dominoes-set-in-wooden-case",
    "sku": "VEX-TOY-0274",
    "description": "Experience the exceptional craftsmanship of the Cast Brass Vintage Dominoes Set in Wooden Case. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Cast Brass Vintage Dominoes Set in Wooden Case engineered with uncompromising material quality and British standards.",
    "price": 1599,
    "compareAtPrice": 2199,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Board Games",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Toys",
    "stock": 93,
    "tags": [
      "Toys",
      "Board Games",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 142,
    "status": "active"
  },
  {
    "name": "Interactive 1000-Piece Architectural Panorama Jigsaw Puzzle",
    "slug": "interactive-1000-piece-architectural-panorama-jigsaw-puzzle",
    "sku": "VEX-TOY-0275",
    "description": "Experience the exceptional craftsmanship of the Interactive 1000-Piece Architectural Panorama Jigsaw Puzzle. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Interactive 1000-Piece Architectural Panorama Jigsaw Puzzle engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1611604548018-d56bbd85d681?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1611604548018-d56bbd85d681?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Puzzles",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Toys",
    "stock": 100,
    "tags": [
      "Toys",
      "Puzzles",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 155,
    "status": "active"
  },
  {
    "name": "Classic Backgammon Set in Leather Folding Briefcase",
    "slug": "classic-backgammon-set-in-leather-folding-briefcase",
    "sku": "VEX-TOY-0276",
    "description": "Experience the exceptional craftsmanship of the Classic Backgammon Set in Leather Folding Briefcase. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Classic Backgammon Set in Leather Folding Briefcase engineered with uncompromising material quality and British standards.",
    "price": 2499,
    "compareAtPrice": 3399,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Board Games",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Toys",
    "stock": 107,
    "tags": [
      "Toys",
      "Board Games",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 168,
    "status": "active"
  },
  {
    "name": "STEM Magnetic 3D Geometric Architectural Tile Set",
    "slug": "stem-magnetic-3d-geometric-architectural-tile-set",
    "sku": "VEX-TOY-0277",
    "description": "Experience the exceptional craftsmanship of the STEM Magnetic 3D Geometric Architectural Tile Set. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury STEM Magnetic 3D Geometric Architectural Tile Set engineered with uncompromising material quality and British standards.",
    "price": 1699,
    "compareAtPrice": 2299,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "STEM Toys",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Toys",
    "stock": 114,
    "tags": [
      "Toys",
      "STEM Toys",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 181,
    "status": "active"
  },
  {
    "name": "Wooden Play Kitchen Utensils & Fresh Harvest Food Basket",
    "slug": "wooden-play-kitchen-utensils-fresh-harvest-food-basket",
    "sku": "VEX-TOY-0278",
    "description": "Experience the exceptional craftsmanship of the Wooden Play Kitchen Utensils & Fresh Harvest Food Basket. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Wooden Play Kitchen Utensils & Fresh Harvest Food Basket engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80&sig=113",
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80&sig=113",
    "hoverImage": "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Wooden Toys",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Toys",
    "stock": 31,
    "tags": [
      "Toys",
      "Wooden Toys",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 194,
    "status": "active"
  },
  {
    "name": "Interactive Astronomy Starlight Constellation Projector",
    "slug": "interactive-astronomy-starlight-constellation-projector",
    "sku": "VEX-TOY-0279",
    "description": "Experience the exceptional craftsmanship of the Interactive Astronomy Starlight Constellation Projector. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Interactive Astronomy Starlight Constellation Projector engineered with uncompromising material quality and British standards.",
    "price": 2099,
    "compareAtPrice": 2799,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80&sig=114",
      "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80&sig=114",
    "hoverImage": "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "STEM Toys",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Toys",
    "stock": 38,
    "tags": [
      "Toys",
      "STEM Toys",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 27,
    "status": "active"
  },
  {
    "name": "Wooden Mechanical Gear Clock Construction Craft Kit",
    "slug": "wooden-mechanical-gear-clock-construction-craft-kit",
    "sku": "VEX-TOY-0280",
    "description": "Experience the exceptional craftsmanship of the Wooden Mechanical Gear Clock Construction Craft Kit. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Wooden Mechanical Gear Clock Construction Craft Kit engineered with uncompromising material quality and British standards.",
    "price": 1499,
    "compareAtPrice": 1999,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80&sig=115",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80&sig=115",
    "hoverImage": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "STEM Toys",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Toys",
    "stock": 45,
    "tags": [
      "Toys",
      "STEM Toys",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 40,
    "status": "active"
  },
  {
    "name": "Watercolor Painting Studio Tin with 36 Pigment Pans",
    "slug": "watercolor-painting-studio-tin-with-36-pigment-pans",
    "sku": "VEX-TOY-0281",
    "description": "Experience the exceptional craftsmanship of the Watercolor Painting Studio Tin with 36 Pigment Pans. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Watercolor Painting Studio Tin with 36 Pigment Pans engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Arts & Crafts",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Toys",
    "stock": 52,
    "tags": [
      "Toys",
      "Arts & Crafts",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 53,
    "status": "active"
  },
  {
    "name": "Musical Wooden Xylophone with Precision Tuned Metal Bars",
    "slug": "musical-wooden-xylophone-with-precision-tuned-metal-bars",
    "sku": "VEX-TOY-0282",
    "description": "Experience the exceptional craftsmanship of the Musical Wooden Xylophone with Precision Tuned Metal Bars. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Musical Wooden Xylophone with Precision Tuned Metal Bars engineered with uncompromising material quality and British standards.",
    "price": 1199,
    "compareAtPrice": 1599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80&sig=117",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80&sig=117",
    "hoverImage": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Musical Toys",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Toys",
    "stock": 59,
    "tags": [
      "Toys",
      "Musical Toys",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 66,
    "status": "active"
  },
  {
    "name": "Indoor Sensory Cotton Canvas Play Teepee Tent",
    "slug": "indoor-sensory-cotton-canvas-play-teepee-tent",
    "sku": "VEX-TOY-0283",
    "description": "Experience the exceptional craftsmanship of the Indoor Sensory Cotton Canvas Play Teepee Tent. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Indoor Sensory Cotton Canvas Play Teepee Tent engineered with uncompromising material quality and British standards.",
    "price": 2499,
    "compareAtPrice": 3399,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80&sig=118",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80&sig=118",
    "hoverImage": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Playhouse",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Toys",
    "stock": 66,
    "tags": [
      "Toys",
      "Playhouse",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 79,
    "status": "active"
  },
  {
    "name": "Eco-Friendly Non-Toxic Modeling Clay 12-Color Bucket",
    "slug": "eco-friendly-non-toxic-modeling-clay-12-color-bucket",
    "sku": "VEX-TOY-0284",
    "description": "Experience the exceptional craftsmanship of the Eco-Friendly Non-Toxic Modeling Clay 12-Color Bucket. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Eco-Friendly Non-Toxic Modeling Clay 12-Color Bucket engineered with uncompromising material quality and British standards.",
    "price": 699,
    "compareAtPrice": 899,
    "discount": 22,
    "images": [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80&sig=119",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80&sig=119",
    "hoverImage": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Arts & Crafts",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Toys",
    "stock": 73,
    "tags": [
      "Toys",
      "Arts & Crafts",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 92,
    "status": "active"
  },
  {
    "name": "Hand-Spun Bamboo Balance Board for Active Kids Play",
    "slug": "hand-spun-bamboo-balance-board-for-active-kids-play",
    "sku": "VEX-TOY-0285",
    "description": "Experience the exceptional craftsmanship of the Hand-Spun Bamboo Balance Board for Active Kids Play. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Hand-Spun Bamboo Balance Board for Active Kids Play engineered with uncompromising material quality and British standards.",
    "price": 1799,
    "compareAtPrice": 2399,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Active Play",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Toys",
    "stock": 80,
    "tags": [
      "Toys",
      "Active Play",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 105,
    "status": "active"
  },
  {
    "name": "Miniature Wooden Dollhouse with Modular Furniture Set",
    "slug": "miniature-wooden-dollhouse-with-modular-furniture-set",
    "sku": "VEX-TOY-0286",
    "description": "Experience the exceptional craftsmanship of the Miniature Wooden Dollhouse with Modular Furniture Set. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Toys collection.",
    "shortDescription": "Curated luxury Miniature Wooden Dollhouse with Modular Furniture Set engineered with uncompromising material quality and British standards.",
    "price": 3099,
    "compareAtPrice": 4199,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80&sig=121",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80&sig=121",
    "hoverImage": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Playhouse",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Toys",
    "stock": 87,
    "tags": [
      "Toys",
      "Playhouse",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 118,
    "status": "active"
  },
  {
    "name": "Eco-Friendly Natural Tree Rubber & Cork Non-Slip Yoga Mat",
    "slug": "eco-friendly-natural-tree-rubber-cork-non-slip-yoga-mat",
    "sku": "VEX-HEA-0287",
    "description": "Experience the exceptional craftsmanship of the Eco-Friendly Natural Tree Rubber & Cork Non-Slip Yoga Mat. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Eco-Friendly Natural Tree Rubber & Cork Non-Slip Yoga Mat engineered with uncompromising material quality and British standards.",
    "price": 2199,
    "compareAtPrice": 2999,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Yoga",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Health",
    "stock": 30,
    "tags": [
      "Health & Fitness",
      "Yoga",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 25,
    "status": "active"
  },
  {
    "name": "Cotton Yoga Strap with Dual D-Ring Alignment Buckles",
    "slug": "cotton-yoga-strap-with-dual-d-ring-alignment-buckles",
    "sku": "VEX-HEA-0288",
    "description": "Experience the exceptional craftsmanship of the Cotton Yoga Strap with Dual D-Ring Alignment Buckles. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Cotton Yoga Strap with Dual D-Ring Alignment Buckles engineered with uncompromising material quality and British standards.",
    "price": 599,
    "compareAtPrice": 799,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Yoga",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Health",
    "stock": 37,
    "tags": [
      "Health & Fitness",
      "Yoga",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 38,
    "status": "active"
  },
  {
    "name": "Microfibre Ultra-Absorbent Quick-Dry Yoga Towel",
    "slug": "microfibre-ultra-absorbent-quick-dry-yoga-towel",
    "sku": "VEX-HEA-0289",
    "description": "Experience the exceptional craftsmanship of the Microfibre Ultra-Absorbent Quick-Dry Yoga Towel. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Microfibre Ultra-Absorbent Quick-Dry Yoga Towel engineered with uncompromising material quality and British standards.",
    "price": 799,
    "compareAtPrice": 1099,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Yoga",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Health",
    "stock": 44,
    "tags": [
      "Health & Fitness",
      "Yoga",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 51,
    "status": "active"
  },
  {
    "name": "High-Density EVA Foam Roller with Trigger-Point Ribbing",
    "slug": "high-density-eva-foam-roller-with-trigger-point-ribbing",
    "sku": "VEX-HEA-0290",
    "description": "Experience the exceptional craftsmanship of the High-Density EVA Foam Roller with Trigger-Point Ribbing. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury High-Density EVA Foam Roller with Trigger-Point Ribbing engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616803689943-5601631c7fec?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Recovery",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Health",
    "stock": 51,
    "tags": [
      "Health & Fitness",
      "Recovery",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 64,
    "status": "active"
  },
  {
    "name": "Deep-Tissue Percussive Muscle Massage Gun with 6 Heads",
    "slug": "deep-tissue-percussive-muscle-massage-gun-with-6-heads",
    "sku": "VEX-HEA-0291",
    "description": "Experience the exceptional craftsmanship of the Deep-Tissue Percussive Muscle Massage Gun with 6 Heads. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Deep-Tissue Percussive Muscle Massage Gun with 6 Heads engineered with uncompromising material quality and British standards.",
    "price": 3899,
    "compareAtPrice": 5299,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616803689943-5601631c7fec?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Recovery",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Health",
    "stock": 58,
    "tags": [
      "Health & Fitness",
      "Recovery",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 77,
    "status": "active"
  },
  {
    "name": "Acupressure Spike Mat & Cervical Neck Relieving Pillow",
    "slug": "acupressure-spike-mat-cervical-neck-relieving-pillow",
    "sku": "VEX-HEA-0292",
    "description": "Experience the exceptional craftsmanship of the Acupressure Spike Mat & Cervical Neck Relieving Pillow. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Acupressure Spike Mat & Cervical Neck Relieving Pillow engineered with uncompromising material quality and British standards.",
    "price": 1399,
    "compareAtPrice": 1899,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1616803689943-5601631c7fec?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1616803689943-5601631c7fec?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Recovery",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Health",
    "stock": 65,
    "tags": [
      "Health & Fitness",
      "Recovery",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 90,
    "status": "active"
  },
  {
    "name": "Therapy Lacrosse Massage Ball Duo for Myofascial Release",
    "slug": "therapy-lacrosse-massage-ball-duo-for-myofascial-release",
    "sku": "VEX-HEA-0293",
    "description": "Experience the exceptional craftsmanship of the Therapy Lacrosse Massage Ball Duo for Myofascial Release. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Therapy Lacrosse Massage Ball Duo for Myofascial Release engineered with uncompromising material quality and British standards.",
    "price": 699,
    "compareAtPrice": 899,
    "discount": 22,
    "images": [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616803689943-5601631c7fec?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Recovery",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Health",
    "stock": 72,
    "tags": [
      "Health & Fitness",
      "Recovery",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 103,
    "status": "active"
  },
  {
    "name": "Infrared Heated Shiatsu Back & Shoulder Massager",
    "slug": "infrared-heated-shiatsu-back-shoulder-massager",
    "sku": "VEX-HEA-0294",
    "description": "Experience the exceptional craftsmanship of the Infrared Heated Shiatsu Back & Shoulder Massager. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Infrared Heated Shiatsu Back & Shoulder Massager engineered with uncompromising material quality and British standards.",
    "price": 2399,
    "compareAtPrice": 3199,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Recovery",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Health",
    "stock": 79,
    "tags": [
      "Health & Fitness",
      "Recovery",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 116,
    "status": "active"
  },
  {
    "name": "Ice Compression Cryotherapy Knee & Joint Wrap",
    "slug": "ice-compression-cryotherapy-knee-joint-wrap",
    "sku": "VEX-HEA-0295",
    "description": "Experience the exceptional craftsmanship of the Ice Compression Cryotherapy Knee & Joint Wrap. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Ice Compression Cryotherapy Knee & Joint Wrap engineered with uncompromising material quality and British standards.",
    "price": 1099,
    "compareAtPrice": 1499,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Recovery",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Health",
    "stock": 86,
    "tags": [
      "Health & Fitness",
      "Recovery",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 129,
    "status": "active"
  },
  {
    "name": "Organic Botanical Epsom Bath Salts for Muscle Recovery",
    "slug": "organic-botanical-epsom-bath-salts-for-muscle-recovery",
    "sku": "VEX-HEA-0296",
    "description": "Experience the exceptional craftsmanship of the Organic Botanical Epsom Bath Salts for Muscle Recovery. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Organic Botanical Epsom Bath Salts for Muscle Recovery engineered with uncompromising material quality and British standards.",
    "price": 699,
    "compareAtPrice": 899,
    "discount": 22,
    "images": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80&sig=109",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80&sig=109",
    "hoverImage": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Wellness",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Health",
    "stock": 93,
    "tags": [
      "Health & Fitness",
      "Wellness",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 142,
    "status": "active"
  },
  {
    "name": "Natural Bamboo Essential Oil Ultrasonic Diffuser",
    "slug": "natural-bamboo-essential-oil-ultrasonic-diffuser",
    "sku": "VEX-HEA-0297",
    "description": "Experience the exceptional craftsmanship of the Natural Bamboo Essential Oil Ultrasonic Diffuser. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Natural Bamboo Essential Oil Ultrasonic Diffuser engineered with uncompromising material quality and British standards.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=800&q=80&sig=110",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=800&q=80&sig=110",
    "hoverImage": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Wellness",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Health",
    "stock": 100,
    "tags": [
      "Health & Fitness",
      "Wellness",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 155,
    "status": "active"
  },
  {
    "name": "Smart Body Composition Scale with Bluetooth Heart Rate",
    "slug": "smart-body-composition-scale-with-bluetooth-heart-rate",
    "sku": "VEX-HEA-0298",
    "description": "Experience the exceptional craftsmanship of the Smart Body Composition Scale with Bluetooth Heart Rate. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Smart Body Composition Scale with Bluetooth Heart Rate engineered with uncompromising material quality and British standards.",
    "price": 1899,
    "compareAtPrice": 2599,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Wellness",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Health",
    "stock": 107,
    "tags": [
      "Health & Fitness",
      "Wellness",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 168,
    "status": "active"
  },
  {
    "name": "Ergonomic Cast-Iron Vinyl Dipped Kettlebell 16kg",
    "slug": "ergonomic-cast-iron-vinyl-dipped-kettlebell-16kg",
    "sku": "VEX-HEA-0299",
    "description": "Experience the exceptional craftsmanship of the Ergonomic Cast-Iron Vinyl Dipped Kettlebell 16kg. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Ergonomic Cast-Iron Vinyl Dipped Kettlebell 16kg engineered with uncompromising material quality and British standards.",
    "price": 1799,
    "compareAtPrice": 2399,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Strength",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Health",
    "stock": 114,
    "tags": [
      "Health & Fitness",
      "Strength",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 181,
    "status": "active"
  },
  {
    "name": "Hexagonal Rubber Encased Dumbbell Pair 12.5kg",
    "slug": "hexagonal-rubber-encased-dumbbell-pair-12-5kg",
    "sku": "VEX-HEA-0300",
    "description": "Experience the exceptional craftsmanship of the Hexagonal Rubber Encased Dumbbell Pair 12.5kg. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Hexagonal Rubber Encased Dumbbell Pair 12.5kg engineered with uncompromising material quality and British standards.",
    "price": 2499,
    "compareAtPrice": 3399,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Strength",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Health",
    "stock": 31,
    "tags": [
      "Health & Fitness",
      "Strength",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 194,
    "status": "active"
  },
  {
    "name": "Heavy-Duty Adjustable Doorway Pull-Up Training Bar",
    "slug": "heavy-duty-adjustable-doorway-pull-up-training-bar",
    "sku": "VEX-HEA-0301",
    "description": "Experience the exceptional craftsmanship of the Heavy-Duty Adjustable Doorway Pull-Up Training Bar. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Heavy-Duty Adjustable Doorway Pull-Up Training Bar engineered with uncompromising material quality and British standards.",
    "price": 1499,
    "compareAtPrice": 1999,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Strength",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Health",
    "stock": 38,
    "tags": [
      "Health & Fitness",
      "Strength",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 27,
    "status": "active"
  },
  {
    "name": "Non-Slip Wooden Push-Up Parallette Workout Bars",
    "slug": "non-slip-wooden-push-up-parallette-workout-bars",
    "sku": "VEX-HEA-0302",
    "description": "Experience the exceptional craftsmanship of the Non-Slip Wooden Push-Up Parallette Workout Bars. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Non-Slip Wooden Push-Up Parallette Workout Bars engineered with uncompromising material quality and British standards.",
    "price": 1199,
    "compareAtPrice": 1599,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80&sig=115",
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80&sig=115",
    "hoverImage": "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Strength",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Health",
    "stock": 45,
    "tags": [
      "Health & Fitness",
      "Strength",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 40,
    "status": "active"
  },
  {
    "name": "Pilates Core Balance Ring with Dual Padded Handles",
    "slug": "pilates-core-balance-ring-with-dual-padded-handles",
    "sku": "VEX-HEA-0303",
    "description": "Experience the exceptional craftsmanship of the Pilates Core Balance Ring with Dual Padded Handles. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Pilates Core Balance Ring with Dual Padded Handles engineered with uncompromising material quality and British standards.",
    "price": 899,
    "compareAtPrice": 1199,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80&sig=116",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80&sig=116",
    "hoverImage": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Strength",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Health",
    "stock": 52,
    "tags": [
      "Health & Fitness",
      "Strength",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 53,
    "status": "active"
  },
  {
    "name": "Braided Natural Latex Resistance Loop Bands 5-Strength Set",
    "slug": "braided-natural-latex-resistance-loop-bands-5-strength-set",
    "sku": "VEX-HEA-0304",
    "description": "Experience the exceptional craftsmanship of the Braided Natural Latex Resistance Loop Bands 5-Strength Set. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Braided Natural Latex Resistance Loop Bands 5-Strength Set engineered with uncompromising material quality and British standards.",
    "price": 799,
    "compareAtPrice": 1099,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Resistance",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Health",
    "stock": 59,
    "tags": [
      "Health & Fitness",
      "Resistance",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 66,
    "status": "active"
  },
  {
    "name": "Weighted Fast-Spin Ball-Bearing Speed Skipping Rope",
    "slug": "weighted-fast-spin-ball-bearing-speed-skipping-rope",
    "sku": "VEX-HEA-0305",
    "description": "Experience the exceptional craftsmanship of the Weighted Fast-Spin Ball-Bearing Speed Skipping Rope. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Weighted Fast-Spin Ball-Bearing Speed Skipping Rope engineered with uncompromising material quality and British standards.",
    "price": 699,
    "compareAtPrice": 899,
    "discount": 22,
    "images": [
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=80&sig=118",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=80&sig=118",
    "hoverImage": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Cardio",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Health",
    "stock": 66,
    "tags": [
      "Health & Fitness",
      "Cardio",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 79,
    "status": "active"
  },
  {
    "name": "Neoprene Wrist Wraps & Padded Weightlifting Grips",
    "slug": "neoprene-wrist-wraps-padded-weightlifting-grips",
    "sku": "VEX-HEA-0306",
    "description": "Experience the exceptional craftsmanship of the Neoprene Wrist Wraps & Padded Weightlifting Grips. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Neoprene Wrist Wraps & Padded Weightlifting Grips engineered with uncompromising material quality and British standards.",
    "price": 599,
    "compareAtPrice": 799,
    "discount": 25,
    "images": [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80&sig=119",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80&sig=119",
    "hoverImage": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Accessories",
    "collectionSlug": "minimalist-luxury",
    "brand": "VEXIVO Health",
    "stock": 73,
    "tags": [
      "Health & Fitness",
      "Accessories",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 5,
    "numReviews": 92,
    "status": "active"
  },
  {
    "name": "Stainless Steel Insulated 32oz Gym Sports Hydration Flask",
    "slug": "stainless-steel-insulated-32oz-gym-sports-hydration-flask",
    "sku": "VEX-HEA-0307",
    "description": "Experience the exceptional craftsmanship of the Stainless Steel Insulated 32oz Gym Sports Hydration Flask. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Stainless Steel Insulated 32oz Gym Sports Hydration Flask engineered with uncompromising material quality and British standards.",
    "price": 999,
    "compareAtPrice": 1399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Hydration",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Health",
    "stock": 80,
    "tags": [
      "Health & Fitness",
      "Hydration",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.7,
    "numReviews": 105,
    "status": "active"
  },
  {
    "name": "Athletic Gym Duffel Bag with Vented Shoe Compartment",
    "slug": "athletic-gym-duffel-bag-with-vented-shoe-compartment",
    "sku": "VEX-HEA-0308",
    "description": "Experience the exceptional craftsmanship of the Athletic Gym Duffel Bag with Vented Shoe Compartment. Crafted from carefully selected materials engineered for enduring style, maximum durability, and refined aesthetics. Belongs exclusively to our genuine Health & Fitness collection.",
    "shortDescription": "Curated luxury Athletic Gym Duffel Bag with Vented Shoe Compartment engineered with uncompromising material quality and British standards.",
    "price": 1899,
    "compareAtPrice": 2599,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80&sig=121",
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80&sig=121",
    "hoverImage": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Bags",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Health",
    "stock": 87,
    "tags": [
      "Health & Fitness",
      "Bags",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 118,
    "status": "active"
  },
  {
    "name": "Handcrafted Banarasi Silk Zari Festive Anarkali",
    "slug": "handcrafted-banarasi-silk-zari-festive-anarkali",
    "sku": "VEX-WOM-0310",
    "description": "Woven with pure gold and silver zari thread on fine Mulberry silk. Features a flared silhouette with hand-embroidered gota patti work on the neckline and hem.",
    "shortDescription": "Pure Banarasi silk zari festive anarkali suit.",
    "price": 4499,
    "compareAtPrice": 6999,
    "discount": 36,
    "images": [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Ethnic Wear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Couture",
    "sellerName": "Varanasi Weavers Co-op",
    "sellerInfo": "Certified GI Authentic Banarasi Silk Artisans",
    "stock": 45,
    "lowStockThreshold": 5,
    "tags": [
      "Women Wear",
      "Ethnic Wear",
      "VEXIVO Couture",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 12,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Maroon Gold",
          "Emerald Green"
        ]
      }
    ]
  },
  {
    "name": "Chanderi Handloom Floral Block Print Kurta Set",
    "slug": "chanderi-handloom-floral-block-print-kurta-set",
    "sku": "VEX-WOM-0311",
    "description": "Lightweight gossamer Chanderi cotton-silk fabric adorned with traditional Bagru botanical block prints. Paired with scalloped organza dupatta.",
    "shortDescription": "Lightweight Chanderi floral kurta with organza dupatta.",
    "price": 2299,
    "compareAtPrice": 3499,
    "discount": 34,
    "images": [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Ethnic Wear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Couture",
    "sellerName": "Varanasi Weavers Co-op",
    "sellerInfo": "Certified GI Authentic Banarasi Silk Artisans",
    "stock": 60,
    "lowStockThreshold": 5,
    "tags": [
      "Women Wear",
      "Ethnic Wear",
      "VEXIVO Couture",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 20,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "XS",
          "S",
          "M",
          "L",
          "XL"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Sage Green",
          "Dusty Rose"
        ]
      }
    ]
  },
  {
    "name": "Tailored Italian Crepe Double-Breasted Blazer",
    "slug": "tailored-italian-crepe-double-breasted-blazer",
    "sku": "VEX-WOM-0312",
    "description": "Cut with structured peaked lapels, padded shoulders, and tortoiseshell horn buttons. Fully lined in silky cupro with internal passport pocket.",
    "shortDescription": "Sharp double-breasted crepe blazer with peak lapels.",
    "price": 3899,
    "compareAtPrice": 5499,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Ethnic Wear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Couture",
    "sellerName": "Varanasi Weavers Co-op",
    "sellerInfo": "Certified GI Authentic Banarasi Silk Artisans",
    "stock": 30,
    "lowStockThreshold": 5,
    "tags": [
      "Women Wear",
      "Ethnic Wear",
      "VEXIVO Couture",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 28,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Oatmeal Beige",
          "Midnight Black"
        ]
      }
    ]
  },
  {
    "name": "Tiered Bohemian Broderie Anglaise Maxi Sundress",
    "slug": "tiered-bohemian-broderie-anglaise-maxi-sundress",
    "sku": "VEX-WOM-0313",
    "description": "Crafted from 100% breathable organic cotton eyelet lace with tiered flutter ruffle hem, smocked back bodice, and adjustable tie straps.",
    "shortDescription": "Organic cotton eyelet lace tiered maxi dress.",
    "price": 2799,
    "compareAtPrice": 3999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Ethnic Wear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Couture",
    "sellerName": "Varanasi Weavers Co-op",
    "sellerInfo": "Certified GI Authentic Banarasi Silk Artisans",
    "stock": 55,
    "lowStockThreshold": 5,
    "tags": [
      "Women Wear",
      "Ethnic Wear",
      "VEXIVO Couture",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 36,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "XS",
          "S",
          "M",
          "L"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Ivory Cream",
          "Sky Blue"
        ]
      }
    ]
  },
  {
    "name": "Mulberry Silk Hand-Pleated Evening Cocktail Gown",
    "slug": "mulberry-silk-hand-pleated-evening-cocktail-gown",
    "sku": "VEX-WOM-0314",
    "description": "Sensational Grecian draped gown in high-luster mulberry silk charmeuse with asymmetrical shoulder detail and concealed side zipper.",
    "shortDescription": "Draped Grecian gown in pure mulberry silk charmeuse.",
    "price": 5999,
    "compareAtPrice": 8499,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Ethnic Wear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Couture",
    "sellerName": "Varanasi Weavers Co-op",
    "sellerInfo": "Certified GI Authentic Banarasi Silk Artisans",
    "stock": 25,
    "lowStockThreshold": 5,
    "tags": [
      "Women Wear",
      "Ethnic Wear",
      "VEXIVO Couture",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 44,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Burgundy Wine",
          "Sapphire Blue"
        ]
      }
    ]
  },
  {
    "name": "Cashmere Knit High-Neck Tunic Sweater",
    "slug": "cashmere-knit-high-neck-tunic-sweater",
    "sku": "VEX-WOM-0315",
    "description": "Spun from pure grade-A Mongolian cashmere with ribbed funnel neckline and drop shoulder seams. Effortless slouchy cold-weather warmth.",
    "shortDescription": "Grade-A Mongolian cashmere funnel neck tunic.",
    "price": 3499,
    "compareAtPrice": 4999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Ethnic Wear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Couture",
    "sellerName": "Varanasi Weavers Co-op",
    "sellerInfo": "Certified GI Authentic Banarasi Silk Artisans",
    "stock": 40,
    "lowStockThreshold": 5,
    "tags": [
      "Women Wear",
      "Ethnic Wear",
      "VEXIVO Couture",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 52,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Heather Camel",
          "Charcoal Grey"
        ]
      }
    ]
  },
  {
    "name": "Belgian Linen Wrap Utility Trench Coat",
    "slug": "belgian-linen-wrap-utility-trench-coat",
    "sku": "VEX-WOM-0316",
    "description": "Pre-washed heavy Belgian flax linen trench featuring storm flaps, tortoiseshell double buckle belt, and deep welt pockets.",
    "shortDescription": "Relaxed unlined utility trench in Belgian flax linen.",
    "price": 4299,
    "compareAtPrice": 5999,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Ethnic Wear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Couture",
    "sellerName": "Varanasi Weavers Co-op",
    "sellerInfo": "Certified GI Authentic Banarasi Silk Artisans",
    "stock": 35,
    "lowStockThreshold": 5,
    "tags": [
      "Women Wear",
      "Ethnic Wear",
      "VEXIVO Couture",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 60,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Khaki Tan",
          "Olive Moss"
        ]
      }
    ]
  },
  {
    "name": "Organza Embroidered Festive Dupatta Set",
    "slug": "organza-embroidered-festive-dupatta-set",
    "sku": "VEX-WOM-0317",
    "description": "Sheer gossamer organza with hand-embroidered sequin border and floral motifs. Pairs effortlessly with raw silk and velvet kurtas.",
    "shortDescription": "Hand-embroidered organza dupatta with sequin border.",
    "price": 1999,
    "compareAtPrice": 2899,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Ethnic Wear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Couture",
    "sellerName": "Varanasi Weavers Co-op",
    "sellerInfo": "Certified GI Authentic Banarasi Silk Artisans",
    "stock": 50,
    "lowStockThreshold": 5,
    "tags": [
      "Women Wear",
      "Ethnic Wear",
      "VEXIVO Couture",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 68,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Free Size (2.5m)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Blush Pink",
          "Champagne Gold"
        ]
      }
    ]
  },
  {
    "name": "Pleated Satin Wide-Leg Palazzo Trousers",
    "slug": "pleated-satin-wide-leg-palazzo-trousers",
    "sku": "VEX-WOM-0318",
    "description": "High-waisted fluid crepe satin palazzo pants with sharp knife pleats and an elasticated back waistband for all-day comfort.",
    "shortDescription": "High-rise knife pleated satin wide-leg trousers.",
    "price": 2199,
    "compareAtPrice": 3199,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Ethnic Wear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Couture",
    "sellerName": "Varanasi Weavers Co-op",
    "sellerInfo": "Certified GI Authentic Banarasi Silk Artisans",
    "stock": 48,
    "lowStockThreshold": 5,
    "tags": [
      "Women Wear",
      "Ethnic Wear",
      "VEXIVO Couture",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 76,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Champagne",
          "Obsidian Black"
        ]
      }
    ]
  },
  {
    "name": "Parisian Fluted Sleeve Floral Chiffon Blouse",
    "slug": "parisian-fluted-sleeve-floral-chiffon-blouse",
    "sku": "VEX-WOM-0319",
    "description": "Semi-sheer vintage floral chiffon with delicate fluted cuffs, keyhole button closure at back, and camisole slip included.",
    "shortDescription": "Vintage floral chiffon blouse with fluted cuffs.",
    "price": 1799,
    "compareAtPrice": 2499,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Ethnic Wear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Couture",
    "sellerName": "Varanasi Weavers Co-op",
    "sellerInfo": "Certified GI Authentic Banarasi Silk Artisans",
    "stock": 65,
    "lowStockThreshold": 5,
    "tags": [
      "Women Wear",
      "Ethnic Wear",
      "VEXIVO Couture",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 84,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "XS",
          "S",
          "M",
          "L"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Vintage Rose",
          "Midnight Floral"
        ]
      }
    ]
  },
  {
    "name": "Merino Wool Cardigan with Tortoiseshell Buttons",
    "slug": "merino-wool-cardigan-with-tortoiseshell-buttons",
    "sku": "VEX-WOM-0320",
    "description": "Extra-fine Australian merino wool cardigan knit in a delicate micro-waffle stitch with reinforced grosgrain ribbon button placket.",
    "shortDescription": "Extra-fine merino wool cardigan with horn buttons.",
    "price": 2699,
    "compareAtPrice": 3899,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Ethnic Wear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Couture",
    "sellerName": "Varanasi Weavers Co-op",
    "sellerInfo": "Certified GI Authentic Banarasi Silk Artisans",
    "stock": 52,
    "lowStockThreshold": 5,
    "tags": [
      "Women Wear",
      "Ethnic Wear",
      "VEXIVO Couture",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 92,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Oatmeal",
          "Sage Mist"
        ]
      }
    ]
  },
  {
    "name": "Raw Silk Embroidered Crop Top and Lehenga Skirt",
    "slug": "raw-silk-embroidered-crop-top-and-lehenga-skirt",
    "sku": "VEX-WOM-0321",
    "description": "Rich raw dupioni silk set with heavy hand-embroidered zardozi and mirror work. Complete with can-can lining for voluminous flare.",
    "shortDescription": "Handcrafted zardozi embroidered raw silk lehenga set.",
    "price": 6499,
    "compareAtPrice": 9499,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    "category": "Women Wear",
    "categorySlug": "women-wear",
    "subcategory": "Ethnic Wear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Couture",
    "sellerName": "Varanasi Weavers Co-op",
    "sellerInfo": "Certified GI Authentic Banarasi Silk Artisans",
    "stock": 20,
    "lowStockThreshold": 5,
    "tags": [
      "Women Wear",
      "Ethnic Wear",
      "VEXIVO Couture",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 100,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Royal Rust",
          "Peacock Teal"
        ]
      }
    ]
  },
  {
    "name": "Savile Row Tailored Double-Breasted Wool Blazer",
    "slug": "savile-row-tailored-double-breasted-wool-blazer",
    "sku": "VEX-MEN-0322",
    "description": "Constructed from English worsted wool with floating half-canvas chest piece and surgeon cuffs. Sharp peaked lapels offer enduring power tailoring.",
    "shortDescription": "English worsted wool half-canvas double-breasted blazer.",
    "price": 5499,
    "compareAtPrice": 7999,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Tailoring & Casuals",
    "collectionSlug": "trending",
    "brand": "VEXIVO Sartorial",
    "sellerName": "Savile Row Tailors",
    "sellerInfo": "Master Craftsmen in British Heritage Menswear",
    "stock": 35,
    "lowStockThreshold": 5,
    "tags": [
      "Men Wear",
      "Tailoring & Casuals",
      "VEXIVO Sartorial",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 12,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "38R",
          "40R",
          "42R",
          "44R"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Navy Pinhead",
          "Charcoal Melange"
        ]
      }
    ]
  },
  {
    "name": "Egyptian Long-Staple Cotton Oxford Dress Shirt",
    "slug": "egyptian-long-staple-cotton-oxford-dress-shirt",
    "sku": "VEX-MEN-0323",
    "description": "100% Giza 87 Egyptian long-staple cotton woven in a durable royal Oxford weave. Features genuine Australian mother-of-pearl buttons.",
    "shortDescription": "Giza 87 Egyptian cotton royal Oxford button-down.",
    "price": 1999,
    "compareAtPrice": 2899,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Tailoring & Casuals",
    "collectionSlug": "trending",
    "brand": "VEXIVO Sartorial",
    "sellerName": "Savile Row Tailors",
    "sellerInfo": "Master Craftsmen in British Heritage Menswear",
    "stock": 75,
    "lowStockThreshold": 5,
    "tags": [
      "Men Wear",
      "Tailoring & Casuals",
      "VEXIVO Sartorial",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 20,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "39",
          "40",
          "42",
          "44"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Crisp White",
          "Ice Blue"
        ]
      }
    ]
  },
  {
    "name": "Heavyweight 450GSM Loopback French Terry Crewneck",
    "slug": "heavyweight-450gsm-loopback-french-terry-crewneck",
    "sku": "VEX-MEN-0324",
    "description": "Knitted on vintage flatbed machines in 100% organic combed cotton. Pre-shrunk with ribbed side gussets for unrestricted movement.",
    "shortDescription": "Heavyweight 450GSM loopback organic cotton sweatshirt.",
    "price": 2499,
    "compareAtPrice": 3499,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Tailoring & Casuals",
    "collectionSlug": "trending",
    "brand": "VEXIVO Sartorial",
    "sellerName": "Savile Row Tailors",
    "sellerInfo": "Master Craftsmen in British Heritage Menswear",
    "stock": 50,
    "lowStockThreshold": 5,
    "tags": [
      "Men Wear",
      "Tailoring & Casuals",
      "VEXIVO Sartorial",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 28,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Heather Grey",
          "Washed Olive"
        ]
      }
    ]
  },
  {
    "name": "Selvedge Raw Indigo 14oz Japanese Denim Jeans",
    "slug": "selvedge-raw-indigo-14oz-japanese-denim-jeans",
    "sku": "VEX-MEN-0325",
    "description": "Woven on vintage Toyoda shuttle looms in Okayama, Japan. Features redline selvedge ID, hidden copper rivets, and vegetable-tanned leather patch.",
    "shortDescription": "Okayama 14oz redline selvedge raw indigo denim.",
    "price": 3699,
    "compareAtPrice": 4999,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Tailoring & Casuals",
    "collectionSlug": "trending",
    "brand": "VEXIVO Sartorial",
    "sellerName": "Savile Row Tailors",
    "sellerInfo": "Master Craftsmen in British Heritage Menswear",
    "stock": 40,
    "lowStockThreshold": 5,
    "tags": [
      "Men Wear",
      "Tailoring & Casuals",
      "VEXIVO Sartorial",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 36,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "30x32",
          "32x32",
          "34x32",
          "36x32"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Deep Indigo Raw"
        ]
      }
    ]
  },
  {
    "name": "Merino Wool Mock-Neck Ribbed Pullover",
    "slug": "merino-wool-mock-neck-ribbed-pullover",
    "sku": "VEX-MEN-0326",
    "description": "Spun from 19.5-micron Australian merino wool with thermo-regulating properties. Modern minimalist mock neck for sleek layered looks.",
    "shortDescription": "Australian 19.5-micron merino wool mock neck knit.",
    "price": 2899,
    "compareAtPrice": 3999,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Tailoring & Casuals",
    "collectionSlug": "trending",
    "brand": "VEXIVO Sartorial",
    "sellerName": "Savile Row Tailors",
    "sellerInfo": "Master Craftsmen in British Heritage Menswear",
    "stock": 45,
    "lowStockThreshold": 5,
    "tags": [
      "Men Wear",
      "Tailoring & Casuals",
      "VEXIVO Sartorial",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 44,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Espresso Brown",
          "Black Onyx"
        ]
      }
    ]
  },
  {
    "name": "British Showerproof Gabardine Trench Overcoat",
    "slug": "british-showerproof-gabardine-trench-overcoat",
    "sku": "VEX-MEN-0327",
    "description": "Tightly woven cotton gabardine engineered to repel torrential rain while remaining breathable. Fully lined in custom check cotton twill.",
    "shortDescription": "Weatherproof cotton gabardine tailored trench coat.",
    "price": 6499,
    "compareAtPrice": 8999,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Tailoring & Casuals",
    "collectionSlug": "trending",
    "brand": "VEXIVO Sartorial",
    "sellerName": "Savile Row Tailors",
    "sellerInfo": "Master Craftsmen in British Heritage Menswear",
    "stock": 28,
    "lowStockThreshold": 5,
    "tags": [
      "Men Wear",
      "Tailoring & Casuals",
      "VEXIVO Sartorial",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 52,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "38R",
          "40R",
          "42R",
          "44R"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Honey Beige",
          "Ink Navy"
        ]
      }
    ]
  },
  {
    "name": "Tailored Relaxed Cuban Collar Pure Linen Shirt",
    "slug": "tailored-relaxed-cuban-collar-pure-linen-shirt",
    "sku": "VEX-MEN-0328",
    "description": "Normandy flax linen woven into a light, airy weave. Cut with an open camp collar, straight vented hem, and natural shell buttons.",
    "shortDescription": "Normandy flax linen relaxed Cuban collar summer shirt.",
    "price": 2199,
    "compareAtPrice": 3199,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Tailoring & Casuals",
    "collectionSlug": "trending",
    "brand": "VEXIVO Sartorial",
    "sellerName": "Savile Row Tailors",
    "sellerInfo": "Master Craftsmen in British Heritage Menswear",
    "stock": 60,
    "lowStockThreshold": 5,
    "tags": [
      "Men Wear",
      "Tailoring & Casuals",
      "VEXIVO Sartorial",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 60,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL",
          "XXL"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Terracotta",
          "Parchment Sand"
        ]
      }
    ]
  },
  {
    "name": "Italian Wool Houndstooth Double-Breasted Overcoat",
    "slug": "italian-wool-houndstooth-double-breasted-overcoat",
    "sku": "VEX-MEN-0329",
    "description": "Spun in Prato, Italy from a heavy wool-cashmere blend with classic monochrome houndstooth motif. Back vent allows easy walking stride.",
    "shortDescription": "Italian wool-cashmere houndstooth long overcoat.",
    "price": 6999,
    "compareAtPrice": 9999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Tailoring & Casuals",
    "collectionSlug": "trending",
    "brand": "VEXIVO Sartorial",
    "sellerName": "Savile Row Tailors",
    "sellerInfo": "Master Craftsmen in British Heritage Menswear",
    "stock": 22,
    "lowStockThreshold": 5,
    "tags": [
      "Men Wear",
      "Tailoring & Casuals",
      "VEXIVO Sartorial",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 68,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "38R",
          "40R",
          "42R",
          "44R"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Black & Ivory Houndstooth"
        ]
      }
    ]
  },
  {
    "name": "Brushed Cotton Flannel Buffalo Check Casual Shirt",
    "slug": "brushed-cotton-flannel-buffalo-check-casual-shirt",
    "sku": "VEX-MEN-0330",
    "description": "Double-brushed cotton flannel offering supreme softness and insulation. Features reinforced twin buttoned chest pockets and triple-needle stitching.",
    "shortDescription": "Double-brushed heavyweight cotton flannel shirt.",
    "price": 1899,
    "compareAtPrice": 2699,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Tailoring & Casuals",
    "collectionSlug": "trending",
    "brand": "VEXIVO Sartorial",
    "sellerName": "Savile Row Tailors",
    "sellerInfo": "Master Craftsmen in British Heritage Menswear",
    "stock": 65,
    "lowStockThreshold": 5,
    "tags": [
      "Men Wear",
      "Tailoring & Casuals",
      "VEXIVO Sartorial",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 76,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Red & Black Check",
          "Forest Green Plaid"
        ]
      }
    ]
  },
  {
    "name": "Single-Pleat Tapered Stretch Cotton Chinos",
    "slug": "single-pleat-tapered-stretch-cotton-chinos",
    "sku": "VEX-MEN-0331",
    "description": "Tailored with a single forward pleat, mid-rise waist, and gentle taper through the ankle. Woven with 2% elastane for flexible mobility.",
    "shortDescription": "Single-pleat tailored stretch cotton chinos.",
    "price": 2299,
    "compareAtPrice": 3199,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Tailoring & Casuals",
    "collectionSlug": "trending",
    "brand": "VEXIVO Sartorial",
    "sellerName": "Savile Row Tailors",
    "sellerInfo": "Master Craftsmen in British Heritage Menswear",
    "stock": 55,
    "lowStockThreshold": 5,
    "tags": [
      "Men Wear",
      "Tailoring & Casuals",
      "VEXIVO Sartorial",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 84,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "30",
          "32",
          "34",
          "36"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Stone Beige",
          "Dark Navy"
        ]
      }
    ]
  },
  {
    "name": "Fine Gauge Cashmere Blend Ribbed V-Neck Sweater",
    "slug": "fine-gauge-cashmere-blend-ribbed-v-neck-sweater",
    "sku": "VEX-MEN-0332",
    "description": "Plush blend of 70% merino wool and 30% Mongolian cashmere. Classic V-neck depth designed to frame dress shirt collars perfectly.",
    "shortDescription": "Merino-cashmere blend fine gauge V-neck sweater.",
    "price": 3299,
    "compareAtPrice": 4599,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Tailoring & Casuals",
    "collectionSlug": "trending",
    "brand": "VEXIVO Sartorial",
    "sellerName": "Savile Row Tailors",
    "sellerInfo": "Master Craftsmen in British Heritage Menswear",
    "stock": 38,
    "lowStockThreshold": 5,
    "tags": [
      "Men Wear",
      "Tailoring & Casuals",
      "VEXIVO Sartorial",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 92,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Dark Pine Green",
          "Burgundy"
        ]
      }
    ]
  },
  {
    "name": "Technical Waterproof Commuter Field Jacket",
    "slug": "technical-waterproof-commuter-field-jacket",
    "sku": "VEX-MEN-0333",
    "description": "Three-layer waterproof breathable shell with fully taped seams, four utility bellows pockets, and a stowaway emergency hood.",
    "shortDescription": "3-layer waterproof breathable commuter field jacket.",
    "price": 4799,
    "compareAtPrice": 6499,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=800&q=80",
    "category": "Men Wear",
    "categorySlug": "men-wear",
    "subcategory": "Tailoring & Casuals",
    "collectionSlug": "trending",
    "brand": "VEXIVO Sartorial",
    "sellerName": "Savile Row Tailors",
    "sellerInfo": "Master Craftsmen in British Heritage Menswear",
    "stock": 30,
    "lowStockThreshold": 5,
    "tags": [
      "Men Wear",
      "Tailoring & Casuals",
      "VEXIVO Sartorial",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 100,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Matte Black",
          "Deep Khaki"
        ]
      }
    ]
  },
  {
    "name": "Certified GOTS Organic Bamboo Cotton Toddler Romper 2-Pack",
    "slug": "certified-gots-organic-bamboo-cotton-toddler-romper-2-pack",
    "sku": "VEX-KID-0334",
    "description": "Buttery soft thermo-regulating bamboo viscose with two-way ankle-to-chin zip for effortless diaper changes. Tagless with foldover scratch mittens.",
    "shortDescription": "GOTS organic bamboo cotton 2-way zip sleep romper.",
    "price": 1499,
    "compareAtPrice": 2199,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Infant & Children Essentials",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Tiny",
    "sellerName": "Pure Baby Essentials",
    "sellerInfo": "Certified GOTS Organic Children Clothing",
    "stock": 70,
    "lowStockThreshold": 5,
    "tags": [
      "Kids Wear",
      "Infant & Children Essentials",
      "VEXIVO Tiny",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 12,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "0-3M",
          "3-6M",
          "6-12M",
          "12-18M"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Oatmeal & Sage"
        ]
      }
    ]
  },
  {
    "name": "Organic Muslin Cotton Frill Sleeve Toddler Dress",
    "slug": "organic-muslin-cotton-frill-sleeve-toddler-dress",
    "sku": "VEX-KID-0335",
    "description": "Four-layer breathable organic cotton muslin that grows softer with every wash. Delicately gathered flutter sleeves with coconut shell back buttons.",
    "shortDescription": "4-layer organic cotton muslin flutter sleeve dress.",
    "price": 1299,
    "compareAtPrice": 1899,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Infant & Children Essentials",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Tiny",
    "sellerName": "Pure Baby Essentials",
    "sellerInfo": "Certified GOTS Organic Children Clothing",
    "stock": 60,
    "lowStockThreshold": 5,
    "tags": [
      "Kids Wear",
      "Infant & Children Essentials",
      "VEXIVO Tiny",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 20,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "1-2Y",
          "2-3Y",
          "3-4Y",
          "4-5Y"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Dusty Blush",
          "Mustard Yellow"
        ]
      }
    ]
  },
  {
    "name": "Brushed Fleece Kangaroo Pocket Unisex Kids Hoodie",
    "slug": "brushed-fleece-kangaroo-pocket-unisex-kids-hoodie",
    "sku": "VEX-KID-0336",
    "description": "Thick organic cotton brushed fleece with double-layer hood (no drawstrings for safety). Roomy front kangaroo pocket for little treasures.",
    "shortDescription": "Plush organic cotton brushed fleece kids hoodie.",
    "price": 1399,
    "compareAtPrice": 1999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Infant & Children Essentials",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Tiny",
    "sellerName": "Pure Baby Essentials",
    "sellerInfo": "Certified GOTS Organic Children Clothing",
    "stock": 65,
    "lowStockThreshold": 5,
    "tags": [
      "Kids Wear",
      "Infant & Children Essentials",
      "VEXIVO Tiny",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 28,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "2-3Y",
          "4-5Y",
          "6-7Y",
          "8-9Y"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Sky Heather",
          "Forest Green"
        ]
      }
    ]
  },
  {
    "name": "Ribbed Organic Cotton Co-ord Loungewear Set",
    "slug": "ribbed-organic-cotton-co-ord-loungewear-set",
    "sku": "VEX-KID-0337",
    "description": "Ultra-stretchy wide ribbed organic cotton long-sleeve top and elasticated drawstring leggings. Ideal for play and all-day lounging.",
    "shortDescription": "Stretchy wide-ribbed organic cotton 2-piece lounge set.",
    "price": 1599,
    "compareAtPrice": 2299,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Infant & Children Essentials",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Tiny",
    "sellerName": "Pure Baby Essentials",
    "sellerInfo": "Certified GOTS Organic Children Clothing",
    "stock": 55,
    "lowStockThreshold": 5,
    "tags": [
      "Kids Wear",
      "Infant & Children Essentials",
      "VEXIVO Tiny",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 36,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "1-2Y",
          "2-3Y",
          "3-4Y",
          "5-6Y"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Caramel",
          "Sage Mist"
        ]
      }
    ]
  },
  {
    "name": "Hand-Smocked Heritage Linen Party Dress",
    "slug": "hand-smocked-heritage-linen-party-dress",
    "sku": "VEX-KID-0338",
    "description": "Traditional English smocking embroidered by hand across the bodice in fine French linen. Finished with Peter Pan collar and back sash tie.",
    "shortDescription": "Hand-smocked French linen vintage party dress.",
    "price": 1899,
    "compareAtPrice": 2799,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Infant & Children Essentials",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Tiny",
    "sellerName": "Pure Baby Essentials",
    "sellerInfo": "Certified GOTS Organic Children Clothing",
    "stock": 40,
    "lowStockThreshold": 5,
    "tags": [
      "Kids Wear",
      "Infant & Children Essentials",
      "VEXIVO Tiny",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 44,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "2-3Y",
          "3-4Y",
          "4-5Y",
          "6-7Y"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Cornflower Blue",
          "Pure White"
        ]
      }
    ]
  },
  {
    "name": "Soft Chambray Denim Overalls with Wooden Buttons",
    "slug": "soft-chambray-denim-overalls-with-wooden-buttons",
    "sku": "VEX-KID-0339",
    "description": "Lightweight washed indigo chambray overalls with adjustable shoulder crossover straps and nickel-free leg snaps for quick changes.",
    "shortDescription": "Washed soft chambray overalls with wooden buttons.",
    "price": 1499,
    "compareAtPrice": 2199,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Infant & Children Essentials",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Tiny",
    "sellerName": "Pure Baby Essentials",
    "sellerInfo": "Certified GOTS Organic Children Clothing",
    "stock": 50,
    "lowStockThreshold": 5,
    "tags": [
      "Kids Wear",
      "Infant & Children Essentials",
      "VEXIVO Tiny",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 52,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "6-12M",
          "1-2Y",
          "2-3Y",
          "3-4Y"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Light Washed Indigo"
        ]
      }
    ]
  },
  {
    "name": "Breathable Cotton Waffle Knit Sleepsuit Pajamas",
    "slug": "breathable-cotton-waffle-knit-sleepsuit-pajamas",
    "sku": "VEX-KID-0340",
    "description": "Textured thermal waffle knit that traps warm air without overheating. Features non-slip silicone gripper soles on toddler sizes.",
    "shortDescription": "Thermal waffle knit footed organic sleepsuit.",
    "price": 1199,
    "compareAtPrice": 1699,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Infant & Children Essentials",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Tiny",
    "sellerName": "Pure Baby Essentials",
    "sellerInfo": "Certified GOTS Organic Children Clothing",
    "stock": 60,
    "lowStockThreshold": 5,
    "tags": [
      "Kids Wear",
      "Infant & Children Essentials",
      "VEXIVO Tiny",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 60,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "3-6M",
          "6-12M",
          "12-18M",
          "18-24M"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Cloud Grey",
          "Butter Cream"
        ]
      }
    ]
  },
  {
    "name": "Pastel Merino Wool Knit Baby Cardigan",
    "slug": "pastel-merino-wool-knit-baby-cardigan",
    "sku": "VEX-KID-0341",
    "description": "Knit from non-scratchy 100% fine merino wool with adorable cable knit details and engraved wooden buttons. Naturally odor resistant.",
    "shortDescription": "Non-scratchy fine merino wool baby cable cardigan.",
    "price": 1699,
    "compareAtPrice": 2499,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Infant & Children Essentials",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Tiny",
    "sellerName": "Pure Baby Essentials",
    "sellerInfo": "Certified GOTS Organic Children Clothing",
    "stock": 45,
    "lowStockThreshold": 5,
    "tags": [
      "Kids Wear",
      "Infant & Children Essentials",
      "VEXIVO Tiny",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 68,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "0-6M",
          "6-12M",
          "1-2Y"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Powder Blue",
          "Rose Dawn"
        ]
      }
    ]
  },
  {
    "name": "UPF 50+ Sun Protection Striped Swimwear 2-Piece",
    "slug": "upf-50-sun-protection-striped-swimwear-2-piece",
    "sku": "VEX-KID-0342",
    "description": "Chlorine-resistant quick-drying recycled polyester swim set blocking 98% of UVA/UVB rays. Raglan long sleeves for maximum shoulder cover.",
    "shortDescription": "UPF 50+ quick-dry long sleeve kids swim set.",
    "price": 1399,
    "compareAtPrice": 1999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Infant & Children Essentials",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Tiny",
    "sellerName": "Pure Baby Essentials",
    "sellerInfo": "Certified GOTS Organic Children Clothing",
    "stock": 50,
    "lowStockThreshold": 5,
    "tags": [
      "Kids Wear",
      "Infant & Children Essentials",
      "VEXIVO Tiny",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 76,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "1-2Y",
          "2-3Y",
          "3-4Y",
          "5-6Y"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Navy Nautical Stripe",
          "Coral Reef"
        ]
      }
    ]
  },
  {
    "name": "Elasticated Soft Corduroy Tapered Joggers",
    "slug": "elasticated-soft-corduroy-tapered-joggers",
    "sku": "VEX-KID-0343",
    "description": "Fine needlecord cotton with reinforced knees for active crawlers and climbers. Gentle elastic waist with functional cotton drawcord.",
    "shortDescription": "Reinforced knee fine needlecord cotton joggers.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80&sig=106"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Infant & Children Essentials",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Tiny",
    "sellerName": "Pure Baby Essentials",
    "sellerInfo": "Certified GOTS Organic Children Clothing",
    "stock": 55,
    "lowStockThreshold": 5,
    "tags": [
      "Kids Wear",
      "Infant & Children Essentials",
      "VEXIVO Tiny",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 84,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "2-3Y",
          "3-4Y",
          "4-5Y",
          "6-7Y"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Cinnamon Brown",
          "Teal Blue"
        ]
      }
    ]
  },
  {
    "name": "Organic Cotton Quilted Winter Puffer Vest",
    "slug": "organic-cotton-quilted-winter-puffer-vest",
    "sku": "VEX-KID-0344",
    "description": "Insulated with hypoallergenic recycled fill and lined in organic cotton flannel. High chin guard and smooth zip with zipper garage.",
    "shortDescription": "Hypoallergenic quilted lightweight winter vest.",
    "price": 1799,
    "compareAtPrice": 2599,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80&sig=106",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80&sig=106",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Infant & Children Essentials",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Tiny",
    "sellerName": "Pure Baby Essentials",
    "sellerInfo": "Certified GOTS Organic Children Clothing",
    "stock": 40,
    "lowStockThreshold": 5,
    "tags": [
      "Kids Wear",
      "Infant & Children Essentials",
      "VEXIVO Tiny",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 92,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "2-3Y",
          "3-4Y",
          "5-6Y",
          "7-8Y"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Mustard Ochre",
          "Deep Navy"
        ]
      }
    ]
  },
  {
    "name": "Fairisle Jacquard Knit Heritage Children Sweater",
    "slug": "fairisle-jacquard-knit-heritage-children-sweater",
    "sku": "VEX-KID-0345",
    "description": "Traditional Nordic Fairisle geometric pattern knitted in soft cotton-wool yarn. Ribbed cuffs and hem retain their shape wash after wash.",
    "shortDescription": "Nordic Fairisle patterned cotton-wool children sweater.",
    "price": 1599,
    "compareAtPrice": 2299,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80&sig=106",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=800&q=80&sig=106",
    "hoverImage": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80",
    "category": "Kids Wear",
    "categorySlug": "kids-wear",
    "subcategory": "Infant & Children Essentials",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Tiny",
    "sellerName": "Pure Baby Essentials",
    "sellerInfo": "Certified GOTS Organic Children Clothing",
    "stock": 48,
    "lowStockThreshold": 5,
    "tags": [
      "Kids Wear",
      "Infant & Children Essentials",
      "VEXIVO Tiny",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 100,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "3-4Y",
          "5-6Y",
          "7-8Y",
          "9-10Y"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Cranberry Red",
          "Snow Pine"
        ]
      }
    ]
  },
  {
    "name": "Italian Calfskin Hand-Burnished Penny Loafers",
    "slug": "italian-calfskin-hand-burnished-penny-loafers",
    "sku": "VEX-SHO-0346",
    "description": "Full-grain Florentine calfskin hand-burnished for rich multidimensional patina. Blake stitched leather sole with stacked heel and rubber tap.",
    "shortDescription": "Hand-burnished Florentine calfskin Blake loafers.",
    "price": 5499,
    "compareAtPrice": 7999,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Luxury Footwear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Calzature",
    "sellerName": "Tuscan Cobblers Guild",
    "sellerInfo": "Artisanal Hand-Crafted Footwear from Florence",
    "stock": 35,
    "lowStockThreshold": 5,
    "tags": [
      "Shoes",
      "Luxury Footwear",
      "VEXIVO Calzature",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 12,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "UK 7",
          "UK 8",
          "UK 9",
          "UK 10",
          "UK 11"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Antique Cognac",
          "Ebony Black"
        ]
      }
    ]
  },
  {
    "name": "Full-Grain Nappa Leather Minimalist Low Sneakers",
    "slug": "full-grain-nappa-leather-minimalist-low-sneakers",
    "sku": "VEX-SHO-0347",
    "description": "Buttery soft Italian Nappa leather upper stitched directly to an authentic Margom rubber cupsole. Fully lined in calfskin with removable foam insole.",
    "shortDescription": "Italian Nappa leather Margom sole court sneakers.",
    "price": 4299,
    "compareAtPrice": 5999,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Luxury Footwear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Calzature",
    "sellerName": "Tuscan Cobblers Guild",
    "sellerInfo": "Artisanal Hand-Crafted Footwear from Florence",
    "stock": 50,
    "lowStockThreshold": 5,
    "tags": [
      "Shoes",
      "Luxury Footwear",
      "VEXIVO Calzature",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 20,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "UK 6",
          "UK 7",
          "UK 8",
          "UK 9",
          "UK 10",
          "UK 11"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Triple White",
          "Off-White & Gum"
        ]
      }
    ]
  },
  {
    "name": "Blake-Stitched Goodyear Welted Suede Chelsea Boots",
    "slug": "blake-stitched-goodyear-welted-suede-chelsea-boots",
    "sku": "VEX-SHO-0348",
    "description": "Repello water-resistant split suede with heavy-duty elasticated side gussets and dual nylon pull tabs. Durable studded rubber Dainite sole.",
    "shortDescription": "Water-resistant suede Chelsea boots with Dainite sole.",
    "price": 5999,
    "compareAtPrice": 8499,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Luxury Footwear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Calzature",
    "sellerName": "Tuscan Cobblers Guild",
    "sellerInfo": "Artisanal Hand-Crafted Footwear from Florence",
    "stock": 30,
    "lowStockThreshold": 5,
    "tags": [
      "Shoes",
      "Luxury Footwear",
      "VEXIVO Calzature",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 28,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "UK 7",
          "UK 8",
          "UK 9",
          "UK 10"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Snuff Brown",
          "Charcoal Suede"
        ]
      }
    ]
  },
  {
    "name": "Handwoven Leather Huarache Summer Slip-On Sandals",
    "slug": "handwoven-leather-huarache-summer-slip-on-sandals",
    "sku": "VEX-SHO-0349",
    "description": "Individually hand-woven vegetable-tanned leather strips that conform uniquely to your foot shape over time. Flexible non-slip crepe sole.",
    "shortDescription": "Hand-woven vegetable-tanned leather huarache sandals.",
    "price": 2999,
    "compareAtPrice": 4199,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Luxury Footwear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Calzature",
    "sellerName": "Tuscan Cobblers Guild",
    "sellerInfo": "Artisanal Hand-Crafted Footwear from Florence",
    "stock": 45,
    "lowStockThreshold": 5,
    "tags": [
      "Shoes",
      "Luxury Footwear",
      "VEXIVO Calzature",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 36,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "UK 7",
          "UK 8",
          "UK 9",
          "UK 10"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Caramel Tan",
          "Dark Walnut"
        ]
      }
    ]
  },
  {
    "name": "Suede Double Monk Strap Dress Shoes",
    "slug": "suede-double-monk-strap-dress-shoes",
    "sku": "VEX-SHO-0350",
    "description": "Velvety English calf suede adorned with polished silver-finish buckles. Chiseled toe shape with channel-stitched leather outsoles.",
    "shortDescription": "Calf suede double monk shoes with silver buckles.",
    "price": 4999,
    "compareAtPrice": 6999,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Luxury Footwear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Calzature",
    "sellerName": "Tuscan Cobblers Guild",
    "sellerInfo": "Artisanal Hand-Crafted Footwear from Florence",
    "stock": 28,
    "lowStockThreshold": 5,
    "tags": [
      "Shoes",
      "Luxury Footwear",
      "VEXIVO Calzature",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 44,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "UK 7",
          "UK 8",
          "UK 9",
          "UK 10"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Tobacco Suede",
          "Navy Suede"
        ]
      }
    ]
  },
  {
    "name": "Vibram Commando Sole Weatherproof Derby Boots",
    "slug": "vibram-commando-sole-weatherproof-derby-boots",
    "sku": "VEX-SHO-0351",
    "description": "Waxy pull-up Horween leather with speed hooks, bellows tongue, and Goodyear storm welt. Built atop rugged Italian Vibram commando lugs.",
    "shortDescription": "Horween waxy pull-up leather Vibram storm boots.",
    "price": 6499,
    "compareAtPrice": 8999,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Luxury Footwear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Calzature",
    "sellerName": "Tuscan Cobblers Guild",
    "sellerInfo": "Artisanal Hand-Crafted Footwear from Florence",
    "stock": 25,
    "lowStockThreshold": 5,
    "tags": [
      "Shoes",
      "Luxury Footwear",
      "VEXIVO Calzature",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 52,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "UK 8",
          "UK 9",
          "UK 10",
          "UK 11"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Dark Oxblood",
          "Matte Black"
        ]
      }
    ]
  },
  {
    "name": "Ergonomic Breathable Knit Performance Running Trainers",
    "slug": "ergonomic-breathable-knit-performance-running-trainers",
    "sku": "VEX-SHO-0352",
    "description": "Seamless engineered mesh upper with carbon-infused TPU midfoot shank and bouncy supercritical nitrogen-infused foam midsole.",
    "shortDescription": "Supercritical nitrogen foam knit running shoes.",
    "price": 3499,
    "compareAtPrice": 4899,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Luxury Footwear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Calzature",
    "sellerName": "Tuscan Cobblers Guild",
    "sellerInfo": "Artisanal Hand-Crafted Footwear from Florence",
    "stock": 60,
    "lowStockThreshold": 5,
    "tags": [
      "Shoes",
      "Luxury Footwear",
      "VEXIVO Calzature",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 60,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "UK 6",
          "UK 7",
          "UK 8",
          "UK 9",
          "UK 10",
          "UK 11"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Triple Black",
          "Glacier White"
        ]
      }
    ]
  },
  {
    "name": "Velvet Venetian Slippers with Grosgrain Ribbon Trim",
    "slug": "velvet-venetian-slippers-with-grosgrain-ribbon-trim",
    "sku": "VEX-SHO-0353",
    "description": "Lush Italian cotton velvet lined in quilted ruby red satin. Finished with hand-stitched grosgrain binding and leather bottom.",
    "shortDescription": "Italian velvet Venetian slipper with satin lining.",
    "price": 3899,
    "compareAtPrice": 5499,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Luxury Footwear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Calzature",
    "sellerName": "Tuscan Cobblers Guild",
    "sellerInfo": "Artisanal Hand-Crafted Footwear from Florence",
    "stock": 35,
    "lowStockThreshold": 5,
    "tags": [
      "Shoes",
      "Luxury Footwear",
      "VEXIVO Calzature",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 68,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "UK 7",
          "UK 8",
          "UK 9",
          "UK 10"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Midnight Navy",
          "Emerald Velvet"
        ]
      }
    ]
  },
  {
    "name": "Handcrafted Mediterranean Espadrilles with Jute Rope",
    "slug": "handcrafted-mediterranean-espadrilles-with-jute-rope",
    "sku": "VEX-SHO-0354",
    "description": "Organic heavyweight cotton canvas hand-stitched to a natural braided jute sole vulcanized with natural rubber for all-weather grip.",
    "shortDescription": "Braided jute rope vulcanized canvas espadrilles.",
    "price": 2499,
    "compareAtPrice": 3499,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Luxury Footwear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Calzature",
    "sellerName": "Tuscan Cobblers Guild",
    "sellerInfo": "Artisanal Hand-Crafted Footwear from Florence",
    "stock": 50,
    "lowStockThreshold": 5,
    "tags": [
      "Shoes",
      "Luxury Footwear",
      "VEXIVO Calzature",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 76,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "UK 7",
          "UK 8",
          "UK 9",
          "UK 10"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Navy Blue",
          "Natural Sand"
        ]
      }
    ]
  },
  {
    "name": "Lightweight Trail-Walking All-Weather Sneaker",
    "slug": "lightweight-trail-walking-all-weather-sneaker",
    "sku": "VEX-SHO-0355",
    "description": "Ripstop Cordura upper reinforced with TPU mudguards and waterproof inner bootie membrane. Multi-directional traction outsole.",
    "shortDescription": "Cordura waterproof trail sneaker with high grip sole.",
    "price": 3999,
    "compareAtPrice": 5499,
    "discount": 27,
    "images": [
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Luxury Footwear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Calzature",
    "sellerName": "Tuscan Cobblers Guild",
    "sellerInfo": "Artisanal Hand-Crafted Footwear from Florence",
    "stock": 40,
    "lowStockThreshold": 5,
    "tags": [
      "Shoes",
      "Luxury Footwear",
      "VEXIVO Calzature",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 84,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "UK 7",
          "UK 8",
          "UK 9",
          "UK 10",
          "UK 11"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Desert Clay",
          "Shadow Olive"
        ]
      }
    ]
  },
  {
    "name": "Orthopedic Arch-Support Italian Driving Loafers",
    "slug": "orthopedic-arch-support-italian-driving-loafers",
    "sku": "VEX-SHO-0356",
    "description": "Unlined supple deer-skin leather with pebbled rubber split driving sole wrapping up the heel. Integrated podiatrist-approved arch support.",
    "shortDescription": "Supple deerskin Italian driving moccasin with arch bed.",
    "price": 4499,
    "compareAtPrice": 6299,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1465453869711-7e174808ace9?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Luxury Footwear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Calzature",
    "sellerName": "Tuscan Cobblers Guild",
    "sellerInfo": "Artisanal Hand-Crafted Footwear from Florence",
    "stock": 35,
    "lowStockThreshold": 5,
    "tags": [
      "Shoes",
      "Luxury Footwear",
      "VEXIVO Calzature",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 92,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "UK 7",
          "UK 8",
          "UK 9",
          "UK 10"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Chestnut Tan",
          "Navy Blue"
        ]
      }
    ]
  },
  {
    "name": "Hand-Polished Goodyear Wingtip Oxford Brogues",
    "slug": "hand-polished-goodyear-wingtip-oxford-brogues",
    "sku": "VEX-SHO-0357",
    "description": "Classic full brogue wingtip detailing carved into premium French box calf leather. Traditional closed lacing with leather mid-sole.",
    "shortDescription": "French box calf Goodyear welted full wingtip brogues.",
    "price": 5899,
    "compareAtPrice": 8299,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1465453869711-7e174808ace9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1465453869711-7e174808ace9?auto=format&fit=crop&w=800&q=80",
    "category": "Shoes",
    "categorySlug": "shoes",
    "subcategory": "Luxury Footwear",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Calzature",
    "sellerName": "Tuscan Cobblers Guild",
    "sellerInfo": "Artisanal Hand-Crafted Footwear from Florence",
    "stock": 25,
    "lowStockThreshold": 5,
    "tags": [
      "Shoes",
      "Luxury Footwear",
      "VEXIVO Calzature",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 100,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "UK 7",
          "UK 8",
          "UK 9",
          "UK 10"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Rich Walnut",
          "Glossy Black"
        ]
      }
    ]
  },
  {
    "name": "Cold-Pressed Botanical Marula Facial Oil 50ml",
    "slug": "cold-pressed-botanical-marula-facial-oil-50ml",
    "sku": "VEX-BEA-0358",
    "description": "Virgin unrefined cold-pressed marula seed oil loaded with antioxidants, Vitamin C, and omega fatty acids. Instantly absorbs for luminous radiance.",
    "shortDescription": "Pure unrefined cold-pressed marula facial glow oil.",
    "price": 1899,
    "compareAtPrice": 2699,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Skincare & Perfumery",
    "collectionSlug": "trending",
    "brand": "VEXIVO Botanicals",
    "sellerName": "Provence Herbal Laboratories",
    "sellerInfo": "Cold-Pressed Botanical Skincare Specialists",
    "stock": 80,
    "lowStockThreshold": 5,
    "tags": [
      "Beauty",
      "Skincare & Perfumery",
      "VEXIVO Botanicals",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 12,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "50ml Dropper"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Golden Nectar"
        ]
      }
    ]
  },
  {
    "name": "Niacinamide 10% & Zinc 1% Clinical Clarifying Serum 30ml",
    "slug": "niacinamide-10-zinc-1-clinical-clarifying-serum-30ml",
    "sku": "VEX-BEA-0359",
    "description": "High-potency clinical formulation that refines enlarged pores, regulates sebum production, and evens post-inflammatory hyperpigmentation.",
    "shortDescription": "Niacinamide 10% clarifying pore reduction serum.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Skincare & Perfumery",
    "collectionSlug": "trending",
    "brand": "VEXIVO Botanicals",
    "sellerName": "Provence Herbal Laboratories",
    "sellerInfo": "Cold-Pressed Botanical Skincare Specialists",
    "stock": 100,
    "lowStockThreshold": 5,
    "tags": [
      "Beauty",
      "Skincare & Perfumery",
      "VEXIVO Botanicals",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 20,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "30ml Pipette"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Clear Gel"
        ]
      }
    ]
  },
  {
    "name": "Rose Damascena Hydrosol Refreshing Face Mist 100ml",
    "slug": "rose-damascena-hydrosol-refreshing-face-mist-100ml",
    "sku": "VEX-BEA-0360",
    "description": "100% steam-distilled Bulgarian Rose Damascena flower water. Tightens pores, rebalances skin pH, and delivers instant botanical hydration.",
    "shortDescription": "Steam-distilled Bulgarian rose water hydrating mist.",
    "price": 1099,
    "compareAtPrice": 1599,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Skincare & Perfumery",
    "collectionSlug": "trending",
    "brand": "VEXIVO Botanicals",
    "sellerName": "Provence Herbal Laboratories",
    "sellerInfo": "Cold-Pressed Botanical Skincare Specialists",
    "stock": 90,
    "lowStockThreshold": 5,
    "tags": [
      "Beauty",
      "Skincare & Perfumery",
      "VEXIVO Botanicals",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 28,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "100ml Fine Spray"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Clear Rose"
        ]
      }
    ]
  },
  {
    "name": "Shea & Murumuru Butter Deep Nourishing Body Balm 200g",
    "slug": "shea-murumuru-butter-deep-nourishing-body-balm-200g",
    "sku": "VEX-BEA-0361",
    "description": "Whipped raw Ghanaian shea butter blended with Amazonian murumuru and sweet almond oil. Melts upon skin contact to heal parched skin.",
    "shortDescription": "Whipped raw shea and murumuru deep moisture body balm.",
    "price": 1499,
    "compareAtPrice": 2199,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Skincare & Perfumery",
    "collectionSlug": "trending",
    "brand": "VEXIVO Botanicals",
    "sellerName": "Provence Herbal Laboratories",
    "sellerInfo": "Cold-Pressed Botanical Skincare Specialists",
    "stock": 65,
    "lowStockThreshold": 5,
    "tags": [
      "Beauty",
      "Skincare & Perfumery",
      "VEXIVO Botanicals",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 36,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "200g Glass Jar"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Whipped Ivory"
        ]
      }
    ]
  },
  {
    "name": "Bakuchiol Botanical Retinol Alternative Night Elixir 30ml",
    "slug": "bakuchiol-botanical-retinol-alternative-night-elixir-30ml",
    "sku": "VEX-BEA-0362",
    "description": "Plant-derived 2% bakuchiol combined with squalane and rosehip fruit oil. Stimulates cellular renewal and collagen synthesis without irritation.",
    "shortDescription": "2% Bakuchiol plant-based gentle retinol alternative oil.",
    "price": 2199,
    "compareAtPrice": 3199,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Skincare & Perfumery",
    "collectionSlug": "trending",
    "brand": "VEXIVO Botanicals",
    "sellerName": "Provence Herbal Laboratories",
    "sellerInfo": "Cold-Pressed Botanical Skincare Specialists",
    "stock": 55,
    "lowStockThreshold": 5,
    "tags": [
      "Beauty",
      "Skincare & Perfumery",
      "VEXIVO Botanicals",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 44,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "30ml Dropper"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Amber Glow"
        ]
      }
    ]
  },
  {
    "name": "Brazilian Green Jade Facial Sculpting Gua Sha Tool",
    "slug": "brazilian-green-jade-facial-sculpting-gua-sha-tool",
    "sku": "VEX-BEA-0363",
    "description": "Hand-carved from genuine grade-A Brazilian green jade crystal. Ergonomic curved edges sculpt cheekbones and drain lymphatic fluid.",
    "shortDescription": "Authentic hand-carved Brazilian jade gua sha stone.",
    "price": 999,
    "compareAtPrice": 1499,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Skincare & Perfumery",
    "collectionSlug": "trending",
    "brand": "VEXIVO Botanicals",
    "sellerName": "Provence Herbal Laboratories",
    "sellerInfo": "Cold-Pressed Botanical Skincare Specialists",
    "stock": 120,
    "lowStockThreshold": 5,
    "tags": [
      "Beauty",
      "Skincare & Perfumery",
      "VEXIVO Botanicals",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 52,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "One Size (8.5x5.5cm)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Natural Jade Green"
        ]
      }
    ]
  },
  {
    "name": "Moroccan Rhassoul Clay Detoxifying Face Mask 120ml",
    "slug": "moroccan-rhassoul-clay-detoxifying-face-mask-120ml",
    "sku": "VEX-BEA-0364",
    "description": "Sourced from the Atlas Mountains of Morocco. Enriched with silica and magnesium to draw out deep impurities without drying out the skin barrier.",
    "shortDescription": "Atlas Mountains mineral-rich rhassoul detox clay mask.",
    "price": 1399,
    "compareAtPrice": 1999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Skincare & Perfumery",
    "collectionSlug": "trending",
    "brand": "VEXIVO Botanicals",
    "sellerName": "Provence Herbal Laboratories",
    "sellerInfo": "Cold-Pressed Botanical Skincare Specialists",
    "stock": 70,
    "lowStockThreshold": 5,
    "tags": [
      "Beauty",
      "Skincare & Perfumery",
      "VEXIVO Botanicals",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 60,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "120ml Jar"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Earthy Clay"
        ]
      }
    ]
  },
  {
    "name": "Multi-Molecular Hyaluronic Acid Plumping Cream 50ml",
    "slug": "multi-molecular-hyaluronic-acid-plumping-cream-50ml",
    "sku": "VEX-BEA-0365",
    "description": "Combines five molecular weights of hyaluronic acid to hydrate epidermal layers from surface to deep dermis. Ceramides seal in moisture.",
    "shortDescription": "5-weight hyaluronic acid deep plumping barrier cream.",
    "price": 1699,
    "compareAtPrice": 2399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Skincare & Perfumery",
    "collectionSlug": "trending",
    "brand": "VEXIVO Botanicals",
    "sellerName": "Provence Herbal Laboratories",
    "sellerInfo": "Cold-Pressed Botanical Skincare Specialists",
    "stock": 75,
    "lowStockThreshold": 5,
    "tags": [
      "Beauty",
      "Skincare & Perfumery",
      "VEXIVO Botanicals",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 68,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "50ml Airless Pump"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Velvet Cream"
        ]
      }
    ]
  },
  {
    "name": "Centella Asiatica Cica Calming Barrier Repair Gel 80ml",
    "slug": "centella-asiatica-cica-calming-barrier-repair-gel-80ml",
    "sku": "VEX-BEA-0366",
    "description": "Formulated with 70% Madagascar Centella Asiatica leaf water and panthenol to instantly soothe redness, sunburn, and skin irritation.",
    "shortDescription": "70% Madagascar cica soothing barrier gel moisturizer.",
    "price": 1399,
    "compareAtPrice": 1899,
    "discount": 26,
    "images": [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Skincare & Perfumery",
    "collectionSlug": "trending",
    "brand": "VEXIVO Botanicals",
    "sellerName": "Provence Herbal Laboratories",
    "sellerInfo": "Cold-Pressed Botanical Skincare Specialists",
    "stock": 85,
    "lowStockThreshold": 5,
    "tags": [
      "Beauty",
      "Skincare & Perfumery",
      "VEXIVO Botanicals",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 76,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "80ml Tube"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Translucent Aqua"
        ]
      }
    ]
  },
  {
    "name": "Artisan Cedarwood & Vetiver Niche Eau De Parfum 50ml",
    "slug": "artisan-cedarwood-vetiver-niche-eau-de-parfum-50ml",
    "sku": "VEX-BEA-0367",
    "description": "Handcrafted in Grasse, France. Opens with bergamot and pink pepper, transitioning into smoky Atlas cedar and Haitian vetiver base.",
    "shortDescription": "Niche eau de parfum with cedarwood and Haitian vetiver.",
    "price": 3299,
    "compareAtPrice": 4799,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Skincare & Perfumery",
    "collectionSlug": "trending",
    "brand": "VEXIVO Botanicals",
    "sellerName": "Provence Herbal Laboratories",
    "sellerInfo": "Cold-Pressed Botanical Skincare Specialists",
    "stock": 45,
    "lowStockThreshold": 5,
    "tags": [
      "Beauty",
      "Skincare & Perfumery",
      "VEXIVO Botanicals",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 84,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "50ml Spray"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Smoky Amber"
        ]
      }
    ]
  },
  {
    "name": "Japanese Camellia Tsubaki Hair Rejuvenating Treatment 100ml",
    "slug": "japanese-camellia-tsubaki-hair-rejuvenating-treatment-100ml",
    "sku": "VEX-BEA-0368",
    "description": "Cold-pressed Camellia Japonica seed oil traditionally used by Geishas to restore mirror-like shine and repair heat-damaged hair cuticles.",
    "shortDescription": "Cold-pressed Tsubaki seed hair nourishing elixir.",
    "price": 1799,
    "compareAtPrice": 2499,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Skincare & Perfumery",
    "collectionSlug": "trending",
    "brand": "VEXIVO Botanicals",
    "sellerName": "Provence Herbal Laboratories",
    "sellerInfo": "Cold-Pressed Botanical Skincare Specialists",
    "stock": 60,
    "lowStockThreshold": 5,
    "tags": [
      "Beauty",
      "Skincare & Perfumery",
      "VEXIVO Botanicals",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 92,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "100ml Glass Bottle"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Golden Tsubaki"
        ]
      }
    ]
  },
  {
    "name": "Vitamin C 20% + Ferulic Acid Radiance Glow Serum 30ml",
    "slug": "vitamin-c-20-ferulic-acid-radiance-glow-serum-30ml",
    "sku": "VEX-BEA-0369",
    "description": "Pure L-Ascorbic acid stabilized with ferulic acid and Vitamin E at optimal pH 3.0. Fades stubborn sunspots and protects against free radicals.",
    "shortDescription": "20% L-Ascorbic Acid + Ferulic brightening glow serum.",
    "price": 1999,
    "compareAtPrice": 2899,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
    "category": "Beauty",
    "categorySlug": "beauty",
    "subcategory": "Skincare & Perfumery",
    "collectionSlug": "trending",
    "brand": "VEXIVO Botanicals",
    "sellerName": "Provence Herbal Laboratories",
    "sellerInfo": "Cold-Pressed Botanical Skincare Specialists",
    "stock": 65,
    "lowStockThreshold": 5,
    "tags": [
      "Beauty",
      "Skincare & Perfumery",
      "VEXIVO Botanicals",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 100,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "30ml UV-Proof Bottle"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Pale Gold"
        ]
      }
    ]
  },
  {
    "name": "18K Solid Gold Vermeil Dainty Paperclip Chain Necklace",
    "slug": "18k-solid-gold-vermeil-dainty-paperclip-chain-necklace",
    "sku": "VEX-JEW-0370",
    "description": "Thick 2.5-micron layer of 18K gold electroplated over recycled 925 sterling silver. Lobster claw clasp with 2-inch extender chain.",
    "shortDescription": "18K gold vermeil rectangular paperclip link necklace.",
    "price": 3299,
    "compareAtPrice": 4899,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Fine Metals & Gems",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Orfèvrerie",
    "sellerName": "Geneva Goldsmiths Guild",
    "sellerInfo": "Master Goldsmiths and Gemologists Since 1984",
    "stock": 40,
    "lowStockThreshold": 5,
    "tags": [
      "Jewellery",
      "Fine Metals & Gems",
      "VEXIVO Orfèvrerie",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 12,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "16 inch + 2 inch extender"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Yellow Gold Vermeil",
          "Rose Gold Vermeil"
        ]
      }
    ]
  },
  {
    "name": "Natural Freshwater Baroque Pearl Drop Earrings",
    "slug": "natural-freshwater-baroque-pearl-drop-earrings",
    "sku": "VEX-JEW-0371",
    "description": "Hand-selected luminous freshwater baroque pearls with organic contours. Mounted on hypoallergenic 14K solid gold post hooks.",
    "shortDescription": "Organic freshwater baroque pearl drops on 14K hooks.",
    "price": 2499,
    "compareAtPrice": 3699,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Fine Metals & Gems",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Orfèvrerie",
    "sellerName": "Geneva Goldsmiths Guild",
    "sellerInfo": "Master Goldsmiths and Gemologists Since 1984",
    "stock": 45,
    "lowStockThreshold": 5,
    "tags": [
      "Jewellery",
      "Fine Metals & Gems",
      "VEXIVO Orfèvrerie",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 20,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "One Size (Approx 20mm pearl)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Lustrous White Pearl"
        ]
      }
    ]
  },
  {
    "name": "Swiss Movement Minimalist Sapphire Crystal Watch",
    "slug": "swiss-movement-minimalist-sapphire-crystal-watch",
    "sku": "VEX-JEW-0372",
    "description": "Swiss Ronda quartz movement housed in 38mm surgical-grade 316L stainless steel case. Scratch-proof antireflective sapphire crystal glass.",
    "shortDescription": "Swiss Ronda quartz 38mm watch with sapphire crystal.",
    "price": 6999,
    "compareAtPrice": 9999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Fine Metals & Gems",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Orfèvrerie",
    "sellerName": "Geneva Goldsmiths Guild",
    "sellerInfo": "Master Goldsmiths and Gemologists Since 1984",
    "stock": 25,
    "lowStockThreshold": 5,
    "tags": [
      "Jewellery",
      "Fine Metals & Gems",
      "VEXIVO Orfèvrerie",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 28,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "38mm Case (20mm strap)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Silver & Black Leather",
          "Rose Gold & Mesh"
        ]
      }
    ]
  },
  {
    "name": "Sterling Silver 925 Braided Herringbone Chain Bracelet",
    "slug": "sterling-silver-925-braided-herringbone-chain-bracelet",
    "sku": "VEX-JEW-0373",
    "description": "Italian crafted high-polish herringbone links that drape like liquid silver along the wrist. Finished with sturdy lobster clasp.",
    "shortDescription": "Italian 925 sterling silver fluid herringbone bracelet.",
    "price": 1999,
    "compareAtPrice": 2899,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Fine Metals & Gems",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Orfèvrerie",
    "sellerName": "Geneva Goldsmiths Guild",
    "sellerInfo": "Master Goldsmiths and Gemologists Since 1984",
    "stock": 55,
    "lowStockThreshold": 5,
    "tags": [
      "Jewellery",
      "Fine Metals & Gems",
      "VEXIVO Orfèvrerie",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 36,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "7 inch",
          "7.5 inch",
          "8 inch"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Bright Sterling Silver"
        ]
      }
    ]
  },
  {
    "name": "Hand-Set Baguette Cut Zirconia Eternity Band Ring",
    "slug": "hand-set-baguette-cut-zirconia-eternity-band-ring",
    "sku": "VEX-JEW-0374",
    "description": "Continuous band of precision-cut AAAAA baguette cubic zirconia stones channel-set into sterling silver coated in rhodium.",
    "shortDescription": "Channel-set AAAAA baguette zirconia eternity band.",
    "price": 2199,
    "compareAtPrice": 3299,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Fine Metals & Gems",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Orfèvrerie",
    "sellerName": "Geneva Goldsmiths Guild",
    "sellerInfo": "Master Goldsmiths and Gemologists Since 1984",
    "stock": 50,
    "lowStockThreshold": 5,
    "tags": [
      "Jewellery",
      "Fine Metals & Gems",
      "VEXIVO Orfèvrerie",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 44,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "US 6",
          "US 7",
          "US 8",
          "US 9"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Platinum Rhodium",
          "18K Yellow Gold"
        ]
      }
    ]
  },
  {
    "name": "Hand-Hammered Sculptural Statement Dome Ring",
    "slug": "hand-hammered-sculptural-statement-dome-ring",
    "sku": "VEX-JEW-0375",
    "description": "Chunky organic dome ring with hand-hammered faceted dimples that catch the light from all angles. Lightweight hollow-core comfort fit.",
    "shortDescription": "Hand-hammered textured dome ring in 18K vermeil.",
    "price": 1799,
    "compareAtPrice": 2599,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Fine Metals & Gems",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Orfèvrerie",
    "sellerName": "Geneva Goldsmiths Guild",
    "sellerInfo": "Master Goldsmiths and Gemologists Since 1984",
    "stock": 48,
    "lowStockThreshold": 5,
    "tags": [
      "Jewellery",
      "Fine Metals & Gems",
      "VEXIVO Orfèvrerie",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 52,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "US 6",
          "US 7",
          "US 8"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Polished Gold",
          "Oxidized Silver"
        ]
      }
    ]
  },
  {
    "name": "Pavé Diamond Look Huggie Hoop Earrings in 14K Gold",
    "slug": "pav-diamond-look-huggie-hoop-earrings-in-14k-gold",
    "sku": "VEX-JEW-0376",
    "description": "Dainty 12mm huggies lined with double rows of pavé micro-crystals. Secure click-closure mechanism designed for daily wear.",
    "shortDescription": "12mm double row pavé crystal huggie hoop earrings.",
    "price": 2299,
    "compareAtPrice": 3399,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Fine Metals & Gems",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Orfèvrerie",
    "sellerName": "Geneva Goldsmiths Guild",
    "sellerInfo": "Master Goldsmiths and Gemologists Since 1984",
    "stock": 60,
    "lowStockThreshold": 5,
    "tags": [
      "Jewellery",
      "Fine Metals & Gems",
      "VEXIVO Orfèvrerie",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 60,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "12mm Diameter"
        ]
      },
      {
        "name": "Color",
        "options": [
          "14K Gold Finish",
          "White Gold Finish"
        ]
      }
    ]
  },
  {
    "name": "Minimalist Titanium Ultra-Thin Mesh Strap Watch",
    "slug": "minimalist-titanium-ultra-thin-mesh-strap-watch",
    "sku": "VEX-JEW-0377",
    "description": "Featherweight aerospace-grade titanium case measuring just 6.5mm in thickness. Integrated quick-release stainless steel Milanese mesh bracelet.",
    "shortDescription": "6.5mm ultra-thin titanium watch with Milanese mesh band.",
    "price": 5499,
    "compareAtPrice": 7999,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Fine Metals & Gems",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Orfèvrerie",
    "sellerName": "Geneva Goldsmiths Guild",
    "sellerInfo": "Master Goldsmiths and Gemologists Since 1984",
    "stock": 30,
    "lowStockThreshold": 5,
    "tags": [
      "Jewellery",
      "Fine Metals & Gems",
      "VEXIVO Orfèvrerie",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 68,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "40mm Case"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Matte Titanium Gunmetal",
          "Brushed Silver"
        ]
      }
    ]
  },
  {
    "name": "Constellation Zodiac Engraved Medallion Pendant",
    "slug": "constellation-zodiac-engraved-medallion-pendant",
    "sku": "VEX-JEW-0378",
    "description": "Coin pendant featuring hand-drawn zodiac constellations illuminated with sparkling micro-zirconia stars. Suspended on rope chain.",
    "shortDescription": "Zodiac constellation coin medallion on rope chain.",
    "price": 2199,
    "compareAtPrice": 3199,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Fine Metals & Gems",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Orfèvrerie",
    "sellerName": "Geneva Goldsmiths Guild",
    "sellerInfo": "Master Goldsmiths and Gemologists Since 1984",
    "stock": 50,
    "lowStockThreshold": 5,
    "tags": [
      "Jewellery",
      "Fine Metals & Gems",
      "VEXIVO Orfèvrerie",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 76,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "18 inch + 2 inch"
        ]
      },
      {
        "name": "Color",
        "options": [
          "18K Gold Vermeil"
        ]
      }
    ]
  },
  {
    "name": "Tahitian Black Mother-of-Pearl Cufflinks",
    "slug": "tahitian-black-mother-of-pearl-cufflinks",
    "sku": "VEX-JEW-0379",
    "description": "Natural iridescent Polynesian black mother-of-pearl cabochons set into solid rhodium-plated brass swivel-bar toggle mounts.",
    "shortDescription": "Tahitian black mother-of-pearl swivel-back cufflinks.",
    "price": 2799,
    "compareAtPrice": 3999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Fine Metals & Gems",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Orfèvrerie",
    "sellerName": "Geneva Goldsmiths Guild",
    "sellerInfo": "Master Goldsmiths and Gemologists Since 1984",
    "stock": 35,
    "lowStockThreshold": 5,
    "tags": [
      "Jewellery",
      "Fine Metals & Gems",
      "VEXIVO Orfèvrerie",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 84,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "16mm Round"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Iridescent Peacock Black"
        ]
      }
    ]
  },
  {
    "name": "Double Layer Figaro Link Sterling Silver Anklet",
    "slug": "double-layer-figaro-link-sterling-silver-anklet",
    "sku": "VEX-JEW-0380",
    "description": "Delicate dual-strand anklet pairing an Italian Figaro link with a shimmering diamond-cut ball chain. Hypoallergenic nickel-free.",
    "shortDescription": "Italian Figaro and diamond-cut bead double anklet.",
    "price": 1599,
    "compareAtPrice": 2299,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Fine Metals & Gems",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Orfèvrerie",
    "sellerName": "Geneva Goldsmiths Guild",
    "sellerInfo": "Master Goldsmiths and Gemologists Since 1984",
    "stock": 55,
    "lowStockThreshold": 5,
    "tags": [
      "Jewellery",
      "Fine Metals & Gems",
      "VEXIVO Orfèvrerie",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 92,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "9 inch + 2 inch extender"
        ]
      },
      {
        "name": "Color",
        "options": [
          "925 Sterling Silver"
        ]
      }
    ]
  },
  {
    "name": "Natural Untreated Emerald Solitaire Ring in Gold",
    "slug": "natural-untreated-emerald-solitaire-ring-in-gold",
    "sku": "VEX-JEW-0381",
    "description": "Ethically sourced 1-carat oval cut Zambian emerald set in four-prong 14K yellow gold vermeil basket on a micro-pavé band.",
    "shortDescription": "1-carat oval Zambian emerald solitaire cocktail ring.",
    "price": 4999,
    "compareAtPrice": 7499,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80",
    "category": "Jewellery",
    "categorySlug": "jewellery",
    "subcategory": "Fine Metals & Gems",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Orfèvrerie",
    "sellerName": "Geneva Goldsmiths Guild",
    "sellerInfo": "Master Goldsmiths and Gemologists Since 1984",
    "stock": 20,
    "lowStockThreshold": 5,
    "tags": [
      "Jewellery",
      "Fine Metals & Gems",
      "VEXIVO Orfèvrerie",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 100,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "US 6",
          "US 7",
          "US 8"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Deep Emerald Green"
        ]
      }
    ]
  },
  {
    "name": "Full-Grain Vegetable-Tanned Italian Leather Briefcase",
    "slug": "full-grain-vegetable-tanned-italian-leather-briefcase",
    "sku": "VEX-BAG-0382",
    "description": "Handcrafted from 2.2mm Tuscan vegetable-tanned bridle leather with solid antiqued brass hardware. Padded sleeve protects 15.6-inch laptops.",
    "shortDescription": "Tuscan bridle leather 15.6-inch laptop briefcase.",
    "price": 6999,
    "compareAtPrice": 9999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Leather & Travel Goods",
    "collectionSlug": "trending",
    "brand": "VEXIVO Cuir",
    "sellerName": "Florence Leathercraft",
    "sellerInfo": "Certified Tuscan Vegetable-Tanned Leather Guild",
    "stock": 25,
    "lowStockThreshold": 5,
    "tags": [
      "Bags",
      "Leather & Travel Goods",
      "VEXIVO Cuir",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 12,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "40 x 29 x 10 cm"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Cognac Tan",
          "Dark Espresso"
        ]
      }
    ]
  },
  {
    "name": "Handcrafted Woven Straw Beach Tote with Leather Handles",
    "slug": "handcrafted-woven-straw-beach-tote-with-leather-handles",
    "sku": "VEX-BAG-0383",
    "description": "Hand-woven natural palm straw with tubular saddle leather shoulder straps and an internal cotton drawstring canvas lining for security.",
    "shortDescription": "Natural palm straw tote with saddle leather straps.",
    "price": 2499,
    "compareAtPrice": 3699,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Leather & Travel Goods",
    "collectionSlug": "trending",
    "brand": "VEXIVO Cuir",
    "sellerName": "Florence Leathercraft",
    "sellerInfo": "Certified Tuscan Vegetable-Tanned Leather Guild",
    "stock": 45,
    "lowStockThreshold": 5,
    "tags": [
      "Bags",
      "Leather & Travel Goods",
      "VEXIVO Cuir",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 20,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "46 x 32 x 15 cm"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Natural Straw & Tan"
        ]
      }
    ]
  },
  {
    "name": "Minimalist Waterproof Roll-Top Commuter Backpack",
    "slug": "minimalist-waterproof-roll-top-commuter-backpack",
    "sku": "VEX-BAG-0384",
    "description": "Welded TPU waterproof fabric with roll-top buckle closure, magnetic side bottle pockets, and breathable ergonomic airflow back panel.",
    "shortDescription": "Waterproof TPU roll-top urban commuter backpack.",
    "price": 3899,
    "compareAtPrice": 5499,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Leather & Travel Goods",
    "collectionSlug": "trending",
    "brand": "VEXIVO Cuir",
    "sellerName": "Florence Leathercraft",
    "sellerInfo": "Certified Tuscan Vegetable-Tanned Leather Guild",
    "stock": 40,
    "lowStockThreshold": 5,
    "tags": [
      "Bags",
      "Leather & Travel Goods",
      "VEXIVO Cuir",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 28,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "25L Capacity"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Matte Black",
          "Slate Grey"
        ]
      }
    ]
  },
  {
    "name": "Structured Saddle Crossbody Bag with Brass Hardware",
    "slug": "structured-saddle-crossbody-bag-with-brass-hardware",
    "sku": "VEX-BAG-0385",
    "description": "Equestrian-inspired curved saddle silhouette made from firm box calf leather. Front flap secures with magnetic stirrup brass buckle.",
    "shortDescription": "Box calf leather curved saddle crossbody bag.",
    "price": 3499,
    "compareAtPrice": 4999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Leather & Travel Goods",
    "collectionSlug": "trending",
    "brand": "VEXIVO Cuir",
    "sellerName": "Florence Leathercraft",
    "sellerInfo": "Certified Tuscan Vegetable-Tanned Leather Guild",
    "stock": 35,
    "lowStockThreshold": 5,
    "tags": [
      "Bags",
      "Leather & Travel Goods",
      "VEXIVO Cuir",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 36,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "22 x 18 x 7 cm"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Chestnut Brown",
          "Black Onyx"
        ]
      }
    ]
  },
  {
    "name": "Genuine Pebble-Grain Leather Compact Cardholder Wallet",
    "slug": "genuine-pebble-grain-leather-compact-cardholder-wallet",
    "sku": "VEX-BAG-0386",
    "description": "Slimline pocket card case with 6 card slots and central cash sleeve. Integrated RFID blocking metallic mesh protects against scans.",
    "shortDescription": "RFID blocking pebble leather 6-slot slim card case.",
    "price": 1299,
    "compareAtPrice": 1899,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Leather & Travel Goods",
    "collectionSlug": "trending",
    "brand": "VEXIVO Cuir",
    "sellerName": "Florence Leathercraft",
    "sellerInfo": "Certified Tuscan Vegetable-Tanned Leather Guild",
    "stock": 80,
    "lowStockThreshold": 5,
    "tags": [
      "Bags",
      "Leather & Travel Goods",
      "VEXIVO Cuir",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 44,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "10 x 7.5 cm"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Midnight Black",
          "Forest Green"
        ]
      }
    ]
  },
  {
    "name": "Quilted Nylon Convertible Gym & Weekender Duffel",
    "slug": "quilted-nylon-convertible-gym-weekender-duffel",
    "sku": "VEX-BAG-0387",
    "description": "Water-resistant diamond quilted nylon with separate ventilated shoe compartment, trolley sleeve for luggage, and padded shoulder strap.",
    "shortDescription": "Quilted nylon weekender duffel with shoe compartment.",
    "price": 2999,
    "compareAtPrice": 4299,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Leather & Travel Goods",
    "collectionSlug": "trending",
    "brand": "VEXIVO Cuir",
    "sellerName": "Florence Leathercraft",
    "sellerInfo": "Certified Tuscan Vegetable-Tanned Leather Guild",
    "stock": 50,
    "lowStockThreshold": 5,
    "tags": [
      "Bags",
      "Leather & Travel Goods",
      "VEXIVO Cuir",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 52,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "35L Capacity (50 x 28 x 25 cm)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Glossy Black",
          "Olive Drab"
        ]
      }
    ]
  },
  {
    "name": "Artisan Slouchy Nappa Leather Shoulder Hobo Bag",
    "slug": "artisan-slouchy-nappa-leather-shoulder-hobo-bag",
    "sku": "VEX-BAG-0388",
    "description": "Drapes effortlessly with a curved slouch top and wide padded shoulder strap. Lined in soft suede microfiber with zippered interior organizer.",
    "shortDescription": "Soft Italian Nappa leather slouchy hobo shoulder bag.",
    "price": 4499,
    "compareAtPrice": 6299,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80&sig=112"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Leather & Travel Goods",
    "collectionSlug": "trending",
    "brand": "VEXIVO Cuir",
    "sellerName": "Florence Leathercraft",
    "sellerInfo": "Certified Tuscan Vegetable-Tanned Leather Guild",
    "stock": 30,
    "lowStockThreshold": 5,
    "tags": [
      "Bags",
      "Leather & Travel Goods",
      "VEXIVO Cuir",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 60,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "38 x 30 x 12 cm"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Caramel Toffee",
          "Pebbled Black"
        ]
      }
    ]
  },
  {
    "name": "Rugged Waxed Canvas Travel Rucksack with Leather Straps",
    "slug": "rugged-waxed-canvas-travel-rucksack-with-leather-straps",
    "sku": "VEX-BAG-0389",
    "description": "Heavy 18oz water-repellent Scottish waxed canvas trimmed with thick oil-tanned leather straps and quick-release brass snap buckles.",
    "shortDescription": "18oz waxed canvas rugged rucksack with leather straps.",
    "price": 4699,
    "compareAtPrice": 6499,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80&sig=112",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80&sig=112",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Leather & Travel Goods",
    "collectionSlug": "trending",
    "brand": "VEXIVO Cuir",
    "sellerName": "Florence Leathercraft",
    "sellerInfo": "Certified Tuscan Vegetable-Tanned Leather Guild",
    "stock": 32,
    "lowStockThreshold": 5,
    "tags": [
      "Bags",
      "Leather & Travel Goods",
      "VEXIVO Cuir",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 68,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "28L (45 x 32 x 16 cm)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Field Tan",
          "Dark Forest"
        ]
      }
    ]
  },
  {
    "name": "Ergonomic Crossbody Sling Bag with RFID Protection",
    "slug": "ergonomic-crossbody-sling-bag-with-rfid-protection",
    "sku": "VEX-BAG-0390",
    "description": "Compact chest pack designed for travel essentials. YKK waterproof zippers, magnetic key leash, and hidden rear passport pocket.",
    "shortDescription": "Water-resistant tactical everyday carry chest sling.",
    "price": 2199,
    "compareAtPrice": 3199,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80&sig=112",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80&sig=112",
    "hoverImage": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Leather & Travel Goods",
    "collectionSlug": "trending",
    "brand": "VEXIVO Cuir",
    "sellerName": "Florence Leathercraft",
    "sellerInfo": "Certified Tuscan Vegetable-Tanned Leather Guild",
    "stock": 55,
    "lowStockThreshold": 5,
    "tags": [
      "Bags",
      "Leather & Travel Goods",
      "VEXIVO Cuir",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 76,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "4L (31 x 17 x 8 cm)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Charcoal Heather",
          "Jet Black"
        ]
      }
    ]
  },
  {
    "name": "Hand-Stitched Leather Passport Wallet & Luggage Tag Set",
    "slug": "hand-stitched-leather-passport-wallet-luggage-tag-set",
    "sku": "VEX-BAG-0391",
    "description": "Crafted from oiled crazy horse leather that develops unique personal character. Includes matching buckle-strap luggage privacy tag.",
    "shortDescription": "Crazy horse leather passport travel wallet and tag set.",
    "price": 1699,
    "compareAtPrice": 2499,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80&sig=113"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Leather & Travel Goods",
    "collectionSlug": "trending",
    "brand": "VEXIVO Cuir",
    "sellerName": "Florence Leathercraft",
    "sellerInfo": "Certified Tuscan Vegetable-Tanned Leather Guild",
    "stock": 65,
    "lowStockThreshold": 5,
    "tags": [
      "Bags",
      "Leather & Travel Goods",
      "VEXIVO Cuir",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 84,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Standard Passport Size"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Vintage Tan",
          "Espresso"
        ]
      }
    ]
  },
  {
    "name": "Elegant Velvet Evening Clutch with Detachable Chain",
    "slug": "elegant-velvet-evening-clutch-with-detachable-chain",
    "sku": "VEX-BAG-0392",
    "description": "Hard-case minaudière enveloped in plush emerald velvet with polished golden ball clasp and removable 120cm drop snake chain.",
    "shortDescription": "Plush velvet hard-case evening minaudière clutch.",
    "price": 2299,
    "compareAtPrice": 3299,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80&sig=113",
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80&sig=113",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Leather & Travel Goods",
    "collectionSlug": "trending",
    "brand": "VEXIVO Cuir",
    "sellerName": "Florence Leathercraft",
    "sellerInfo": "Certified Tuscan Vegetable-Tanned Leather Guild",
    "stock": 45,
    "lowStockThreshold": 5,
    "tags": [
      "Bags",
      "Leather & Travel Goods",
      "VEXIVO Cuir",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 92,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "20 x 12 x 5 cm"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Emerald Green",
          "Royal Navy"
        ]
      }
    ]
  },
  {
    "name": "Technical Ripstop Modular Lightweight Belt Bag",
    "slug": "technical-ripstop-modular-lightweight-belt-bag",
    "sku": "VEX-BAG-0393",
    "description": "Diamond ripstop Cordura nylon with Duraflex buckle and adjustable webbing strap. Can be worn as fanny pack or crossbody.",
    "shortDescription": "Cordura ripstop lightweight modular waist pack.",
    "price": 1499,
    "compareAtPrice": 2199,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80&sig=113",
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=800&q=80&sig=114"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80&sig=113",
    "hoverImage": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    "category": "Bags",
    "categorySlug": "bags",
    "subcategory": "Leather & Travel Goods",
    "collectionSlug": "trending",
    "brand": "VEXIVO Cuir",
    "sellerName": "Florence Leathercraft",
    "sellerInfo": "Certified Tuscan Vegetable-Tanned Leather Guild",
    "stock": 70,
    "lowStockThreshold": 5,
    "tags": [
      "Bags",
      "Leather & Travel Goods",
      "VEXIVO Cuir",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 100,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "2.5L (24 x 14 x 6 cm)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Blackout",
          "Coyote Brown"
        ]
      }
    ]
  },
  {
    "name": "Genuine Grade-8 Handwoven Ecuadorian Toquilla Straw Panama Hat",
    "slug": "genuine-grade-8-handwoven-ecuadorian-toquilla-straw-panama-hat",
    "sku": "VEX-HAT-0394",
    "description": "Hand-woven over two months from split jipijapa palm fronds. Lightweight UPF 50+ sun protection trimmed with black grosgrain ribbon.",
    "shortDescription": "Grade 8 authentic handwoven Ecuadorian Panama hat.",
    "price": 3499,
    "compareAtPrice": 5199,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Millinery & Headwear",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Millinery",
    "sellerName": "Montecristi Hat Artisans",
    "sellerInfo": "UNESCO Intangible Heritage Toquilla Weavers",
    "stock": 25,
    "lowStockThreshold": 5,
    "tags": [
      "Hats",
      "Millinery & Headwear",
      "VEXIVO Millinery",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 12,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "57 cm (M)",
          "59 cm (L)",
          "61 cm (XL)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Bleached Natural"
        ]
      }
    ]
  },
  {
    "name": "100% Australian Merino Wool Wide-Brim Fedora",
    "slug": "100-australian-merino-wool-wide-brim-fedora",
    "sku": "VEX-HAT-0395",
    "description": "Structured wool felt blocked on wooden forms. Features a stiff flat 8cm brim, pinched teardrop crown, and genuine leather hat band.",
    "shortDescription": "Australian wool felt stiff flat-brim fedora hat.",
    "price": 2899,
    "compareAtPrice": 4199,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Millinery & Headwear",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Millinery",
    "sellerName": "Montecristi Hat Artisans",
    "sellerInfo": "UNESCO Intangible Heritage Toquilla Weavers",
    "stock": 35,
    "lowStockThreshold": 5,
    "tags": [
      "Hats",
      "Millinery & Headwear",
      "VEXIVO Millinery",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 20,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "56 cm (S)",
          "58 cm (M)",
          "60 cm (L)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Pecan Brown",
          "Obsidian Black"
        ]
      }
    ]
  },
  {
    "name": "Washed Cotton Twill Unstructured Dad Baseball Cap",
    "slug": "washed-cotton-twill-unstructured-dad-baseball-cap",
    "sku": "VEX-HAT-0396",
    "description": "Heavyweight pre-washed cotton twill with low-profile 6-panel crown and curved bill. Antiqued brass tri-glide sliding closure buckle.",
    "shortDescription": "Pre-washed cotton twill low-profile dad cap.",
    "price": 999,
    "compareAtPrice": 1499,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Millinery & Headwear",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Millinery",
    "sellerName": "Montecristi Hat Artisans",
    "sellerInfo": "UNESCO Intangible Heritage Toquilla Weavers",
    "stock": 90,
    "lowStockThreshold": 5,
    "tags": [
      "Hats",
      "Millinery & Headwear",
      "VEXIVO Millinery",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 28,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Adjustable (54-61 cm)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Faded Navy",
          "Washed Olive",
          "Vintage Black"
        ]
      }
    ]
  },
  {
    "name": "Hand-Knitted Ribbed Cashmere Slouchy Winter Beanie",
    "slug": "hand-knitted-ribbed-cashmere-slouchy-winter-beanie",
    "sku": "VEX-HAT-0397",
    "description": "Spun from 100% 2-ply Mongolian cashmere. Knit in a chunky 7-gauge fisherman rib that can be worn cuffed or slouchy.",
    "shortDescription": "Pure Mongolian 2-ply cashmere fisherman ribbed beanie.",
    "price": 1899,
    "compareAtPrice": 2699,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Millinery & Headwear",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Millinery",
    "sellerName": "Montecristi Hat Artisans",
    "sellerInfo": "UNESCO Intangible Heritage Toquilla Weavers",
    "stock": 50,
    "lowStockThreshold": 5,
    "tags": [
      "Hats",
      "Millinery & Headwear",
      "VEXIVO Millinery",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 36,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "One Size Stretch"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Oatmeal Heather",
          "Charcoal Grey"
        ]
      }
    ]
  },
  {
    "name": "Heritage Wool Herringbone Newsboy Baker Boy Cap",
    "slug": "heritage-wool-herringbone-newsboy-baker-boy-cap",
    "sku": "VEX-HAT-0398",
    "description": "8-panel traditional British newsboy cap crafted from Scottish wool tweed in a classic chevron weave. Sewn-down peak with satin lining.",
    "shortDescription": "Scottish wool tweed 8-panel heritage newsboy cap.",
    "price": 1799,
    "compareAtPrice": 2499,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Millinery & Headwear",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Millinery",
    "sellerName": "Montecristi Hat Artisans",
    "sellerInfo": "UNESCO Intangible Heritage Toquilla Weavers",
    "stock": 40,
    "lowStockThreshold": 5,
    "tags": [
      "Hats",
      "Millinery & Headwear",
      "VEXIVO Millinery",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 44,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "57 cm (M)",
          "59 cm (L)",
          "61 cm (XL)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Grey Herringbone",
          "Brown Tweed"
        ]
      }
    ]
  },
  {
    "name": "Packable Floppy Linen Summer Sun Hat with Chiffon Tie",
    "slug": "packable-floppy-linen-summer-sun-hat-with-chiffon-tie",
    "sku": "VEX-HAT-0399",
    "description": "10cm wide brim woven from breathable washed French linen. Folds compactly into your beach tote without losing its shape.",
    "shortDescription": "Packable French linen wide-brim sun protection hat.",
    "price": 1599,
    "compareAtPrice": 2299,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533827432537-70133748f5c8?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1582791694770-cbdc9dda338f?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Millinery & Headwear",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Millinery",
    "sellerName": "Montecristi Hat Artisans",
    "sellerInfo": "UNESCO Intangible Heritage Toquilla Weavers",
    "stock": 55,
    "lowStockThreshold": 5,
    "tags": [
      "Hats",
      "Millinery & Headwear",
      "VEXIVO Millinery",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 52,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "One Size with internal drawstring"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Natural Ecru",
          "Terracotta"
        ]
      }
    ]
  },
  {
    "name": "UPF 50+ Waterproof Outdoor Trekking Bucket Hat",
    "slug": "upf-50-waterproof-outdoor-trekking-bucket-hat",
    "sku": "VEX-HAT-0400",
    "description": "Hydrophobic quick-dry nylon with mesh ventilation crown and moisture-wicking sweatband. Adjustable chin cord keeps it secure in gale winds.",
    "shortDescription": "UPF 50+ quick-dry waterproof boonie bucket hat.",
    "price": 1299,
    "compareAtPrice": 1899,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1533827432537-70133748f5c8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1533827432537-70133748f5c8?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Millinery & Headwear",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Millinery",
    "sellerName": "Montecristi Hat Artisans",
    "sellerInfo": "UNESCO Intangible Heritage Toquilla Weavers",
    "stock": 65,
    "lowStockThreshold": 5,
    "tags": [
      "Hats",
      "Millinery & Headwear",
      "VEXIVO Millinery",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 60,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "M/L (57-59 cm)",
          "L/XL (60-62 cm)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Khaki Camo",
          "Dark Charcoal"
        ]
      }
    ]
  },
  {
    "name": "Structured Wool Felt Boater Hat with Grosgrain Band",
    "slug": "structured-wool-felt-boater-hat-with-grosgrain-band",
    "sku": "VEX-HAT-0401",
    "description": "Classic flat top crown and flat circular brim stiffened with natural shellac. Trimmed with 40mm striped grosgrain ribbon.",
    "shortDescription": "Stiff wool felt flat-top boater hat with ribbon band.",
    "price": 2499,
    "compareAtPrice": 3599,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1533827432537-70133748f5c8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1533827432537-70133748f5c8?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Millinery & Headwear",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Millinery",
    "sellerName": "Montecristi Hat Artisans",
    "sellerInfo": "UNESCO Intangible Heritage Toquilla Weavers",
    "stock": 30,
    "lowStockThreshold": 5,
    "tags": [
      "Hats",
      "Millinery & Headwear",
      "VEXIVO Millinery",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 68,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "57 cm (M)",
          "59 cm (L)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Ivory with Navy Band",
          "All Black"
        ]
      }
    ]
  },
  {
    "name": "Chunky Waffle Knit Wool Watch Cap Beanie",
    "slug": "chunky-waffle-knit-wool-watch-cap-beanie",
    "sku": "VEX-HAT-0402",
    "description": "Inspired by US Navy issue watch caps. Knit in heavy gauge Shetland wool with deep foldover brim for sub-zero ear warmth.",
    "shortDescription": "Shetland wool heavy gauge deep cuff watch cap.",
    "price": 1199,
    "compareAtPrice": 1699,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Millinery & Headwear",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Millinery",
    "sellerName": "Montecristi Hat Artisans",
    "sellerInfo": "UNESCO Intangible Heritage Toquilla Weavers",
    "stock": 75,
    "lowStockThreshold": 5,
    "tags": [
      "Hats",
      "Millinery & Headwear",
      "VEXIVO Millinery",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 76,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "One Size Stretch"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Safety Orange",
          "Navy Melange"
        ]
      }
    ]
  },
  {
    "name": "Vintage Corduroy 6-Panel Retro Strapback Cap",
    "slug": "vintage-corduroy-6-panel-retro-strapback-cap",
    "sku": "VEX-HAT-0403",
    "description": "Wide-wale 8-wale cotton corduroy with unstructured crown and self-fabric strap with antique brass buckle. Embroidered eyelets.",
    "shortDescription": "8-wale thick corduroy retro unstructured strapback.",
    "price": 1099,
    "compareAtPrice": 1599,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Millinery & Headwear",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Millinery",
    "sellerName": "Montecristi Hat Artisans",
    "sellerInfo": "UNESCO Intangible Heritage Toquilla Weavers",
    "stock": 80,
    "lowStockThreshold": 5,
    "tags": [
      "Hats",
      "Millinery & Headwear",
      "VEXIVO Millinery",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 84,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Adjustable (55-60 cm)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Rust Ochre",
          "Hunter Green"
        ]
      }
    ]
  },
  {
    "name": "Classic French 100% Boiled Wool Beret",
    "slug": "classic-french-100-boiled-wool-beret",
    "sku": "VEX-HAT-0404",
    "description": "Made in the Basque tradition from 100% French merino wool felted into water-repellent dense boiled wool with small top stem.",
    "shortDescription": "Basque traditional boiled wool beret with leather band.",
    "price": 1499,
    "compareAtPrice": 2199,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542327897-d73f4005b533?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Millinery & Headwear",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Millinery",
    "sellerName": "Montecristi Hat Artisans",
    "sellerInfo": "UNESCO Intangible Heritage Toquilla Weavers",
    "stock": 45,
    "lowStockThreshold": 5,
    "tags": [
      "Hats",
      "Millinery & Headwear",
      "VEXIVO Millinery",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 92,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Universal 28cm Diameter"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Bordeaux Red",
          "Parisian Navy"
        ]
      }
    ]
  },
  {
    "name": "Leather Trim Safari Outback Sun Protection Hat",
    "slug": "leather-trim-safari-outback-sun-protection-hat",
    "sku": "VEX-HAT-0405",
    "description": "Sturdy heavy-duty brushed cotton canvas crown with vented eyelets and genuine braided leather band. Shapeable wired brim edge.",
    "shortDescription": "Heavy cotton canvas outback hat with shapeable brim.",
    "price": 2699,
    "compareAtPrice": 3899,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1542327897-d73f4005b533?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1496942299866-9e7ab403e614?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1542327897-d73f4005b533?auto=format&fit=crop&w=800&q=80",
    "category": "Hats",
    "categorySlug": "hats",
    "subcategory": "Millinery & Headwear",
    "collectionSlug": "new-arrivals",
    "brand": "VEXIVO Millinery",
    "sellerName": "Montecristi Hat Artisans",
    "sellerInfo": "UNESCO Intangible Heritage Toquilla Weavers",
    "stock": 35,
    "lowStockThreshold": 5,
    "tags": [
      "Hats",
      "Millinery & Headwear",
      "VEXIVO Millinery",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 100,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "58 cm (M)",
          "60 cm (L)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Desert Sand",
          "Dark Olive"
        ]
      }
    ]
  },
  {
    "name": "Handcrafted Japanese Acetate Blue-Light Blocking Reading Glasses",
    "slug": "handcrafted-japanese-acetate-blue-light-blocking-reading-glasses",
    "sku": "VEX-VIS-0406",
    "description": "Custom cured Mazzucchelli cellulose acetate with five-barrel German OBE hinges. Anti-reflective lenses filter 45% of harmful blue spectrum light.",
    "shortDescription": "Japanese hand-polished acetate blue-light glasses.",
    "price": 1999,
    "compareAtPrice": 2999,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Eyewear & Optical",
    "collectionSlug": "trending",
    "brand": "VEXIVO Vision",
    "sellerName": "Fukui Optical Guild",
    "sellerInfo": "Hand-Polished Japanese Cellulose Acetate Frames",
    "stock": 50,
    "lowStockThreshold": 5,
    "tags": [
      "Vision Care",
      "Eyewear & Optical",
      "VEXIVO Vision",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 12,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Standard 50-19-145"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Havana Tortoise",
          "Matte Crystal"
        ]
      }
    ]
  },
  {
    "name": "Polarized Aviator Titanium Sunglasses with Anti-Glare Coating",
    "slug": "polarized-aviator-titanium-sunglasses-with-anti-glare-coating",
    "sku": "VEX-VIS-0407",
    "description": "Ultralight Japanese titanium frame weighing under 18 grams. TAC polarized gradient green lenses with rear anti-reflective coating.",
    "shortDescription": "Featherweight 18g titanium aviator sunglasses.",
    "price": 3699,
    "compareAtPrice": 5299,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Eyewear & Optical",
    "collectionSlug": "trending",
    "brand": "VEXIVO Vision",
    "sellerName": "Fukui Optical Guild",
    "sellerInfo": "Hand-Polished Japanese Cellulose Acetate Frames",
    "stock": 35,
    "lowStockThreshold": 5,
    "tags": [
      "Vision Care",
      "Eyewear & Optical",
      "VEXIVO Vision",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 20,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "58-14-140"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Gold & G-15 Green",
          "Silver & Smoke"
        ]
      }
    ]
  },
  {
    "name": "Classic Havana Round Tortoiseshell Optical Prescription Frames",
    "slug": "classic-havana-round-tortoiseshell-optical-prescription-frames",
    "sku": "VEX-VIS-0408",
    "description": "Keyhole bridge design crafted from 6mm Italian acetate sheets with wire core temples for custom optician adjustment.",
    "shortDescription": "Keyhole bridge Italian acetate round optical frames.",
    "price": 2499,
    "compareAtPrice": 3599,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Eyewear & Optical",
    "collectionSlug": "trending",
    "brand": "VEXIVO Vision",
    "sellerName": "Fukui Optical Guild",
    "sellerInfo": "Hand-Polished Japanese Cellulose Acetate Frames",
    "stock": 45,
    "lowStockThreshold": 5,
    "tags": [
      "Vision Care",
      "Eyewear & Optical",
      "VEXIVO Vision",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 28,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "48-21-145"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Vintage Havana",
          "Champagne Honey"
        ]
      }
    ]
  },
  {
    "name": "Ultralight Rimless Beta-Memory Titanium Eyeglasses",
    "slug": "ultralight-rimless-beta-memory-titanium-eyeglasses",
    "sku": "VEX-VIS-0409",
    "description": "Hypoallergenic flexible beta-titanium alloy temples that bounce back to shape. Screwless hinge mechanism eliminates loose arm screws.",
    "shortDescription": "Screwless rimless beta-titanium memory frames.",
    "price": 3299,
    "compareAtPrice": 4799,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Eyewear & Optical",
    "collectionSlug": "trending",
    "brand": "VEXIVO Vision",
    "sellerName": "Fukui Optical Guild",
    "sellerInfo": "Hand-Polished Japanese Cellulose Acetate Frames",
    "stock": 40,
    "lowStockThreshold": 5,
    "tags": [
      "Vision Care",
      "Eyewear & Optical",
      "VEXIVO Vision",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 36,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "53-18-142"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Gunmetal Grey",
          "Polished Silver"
        ]
      }
    ]
  },
  {
    "name": "Cat-Eye UV400 Gradient Lens Designer Sunglasses",
    "slug": "cat-eye-uv400-gradient-lens-designer-sunglasses",
    "sku": "VEX-VIS-0410",
    "description": "Dramatic upswept cat-eye silhouette in glossy black acetate with gold-tone metal temple accents. 100% UV400 protection.",
    "shortDescription": "Glossy cat-eye acetate sunglasses with UV400 lenses.",
    "price": 2799,
    "compareAtPrice": 3999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80&sig=101"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Eyewear & Optical",
    "collectionSlug": "trending",
    "brand": "VEXIVO Vision",
    "sellerName": "Fukui Optical Guild",
    "sellerInfo": "Hand-Polished Japanese Cellulose Acetate Frames",
    "stock": 50,
    "lowStockThreshold": 5,
    "tags": [
      "Vision Care",
      "Eyewear & Optical",
      "VEXIVO Vision",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 44,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "54-18-140"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Piano Black",
          "Tortoise Brown"
        ]
      }
    ]
  },
  {
    "name": "Bio-Acetate Eco-Friendly Computer Protection Glasses",
    "slug": "bio-acetate-eco-friendly-computer-protection-glasses",
    "sku": "VEX-VIS-0411",
    "description": "Biodegradable acetate made from wood pulp and cotton fibers. Eliminates eye strain and headaches during long computer screen sessions.",
    "shortDescription": "Biodegradable plant-based blue light computer glasses.",
    "price": 1899,
    "compareAtPrice": 2699,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80&sig=101",
      "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80&sig=101",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Eyewear & Optical",
    "collectionSlug": "trending",
    "brand": "VEXIVO Vision",
    "sellerName": "Fukui Optical Guild",
    "sellerInfo": "Hand-Polished Japanese Cellulose Acetate Frames",
    "stock": 60,
    "lowStockThreshold": 5,
    "tags": [
      "Vision Care",
      "Eyewear & Optical",
      "VEXIVO Vision",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 52,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "51-19-145"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Forest Clear",
          "Smoky Quartz"
        ]
      }
    ]
  },
  {
    "name": "Anti-Fog Hydrogel Contact Lens Multi-Purpose Solution 360ml",
    "slug": "anti-fog-hydrogel-contact-lens-multi-purpose-solution-360ml",
    "sku": "VEX-VIS-0412",
    "description": "Dual-action disinfectant that dissolves protein deposits and coats contact lenses with a long-lasting moisture cushion for 16-hour comfort.",
    "shortDescription": "Hyaluronic acid enriched contact lens solution 360ml.",
    "price": 799,
    "compareAtPrice": 1199,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80&sig=101",
      "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80&sig=101",
    "hoverImage": "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Eyewear & Optical",
    "collectionSlug": "trending",
    "brand": "VEXIVO Vision",
    "sellerName": "Fukui Optical Guild",
    "sellerInfo": "Hand-Polished Japanese Cellulose Acetate Frames",
    "stock": 100,
    "lowStockThreshold": 5,
    "tags": [
      "Vision Care",
      "Eyewear & Optical",
      "VEXIVO Vision",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 60,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "360ml Bottle + Free Case"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Clear Solution"
        ]
      }
    ]
  },
  {
    "name": "Polarized Wayfarer Sunglasses with Walnut Wood Temples",
    "slug": "polarized-wayfarer-sunglasses-with-walnut-wood-temples",
    "sku": "VEX-VIS-0413",
    "description": "Combines matte black acetate front with sustainably harvested real walnut wood arms. Stainless steel spring hinges flex outwards.",
    "shortDescription": "Acetate frame with genuine walnut wood spring temples.",
    "price": 2899,
    "compareAtPrice": 4199,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Eyewear & Optical",
    "collectionSlug": "trending",
    "brand": "VEXIVO Vision",
    "sellerName": "Fukui Optical Guild",
    "sellerInfo": "Hand-Polished Japanese Cellulose Acetate Frames",
    "stock": 45,
    "lowStockThreshold": 5,
    "tags": [
      "Vision Care",
      "Eyewear & Optical",
      "VEXIVO Vision",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 68,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "52-20-145"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Matte Black & Walnut"
        ]
      }
    ]
  },
  {
    "name": "Clip-On Magnetic Polarized Sunglasses for Eyeglasses",
    "slug": "clip-on-magnetic-polarized-sunglasses-for-eyeglasses",
    "sku": "VEX-VIS-0414",
    "description": "Ultra-thin polarized TAC clip-on attachment that snaps onto standard rectangular frames with rubberized protective clips.",
    "shortDescription": "Flip-up polarized clip-on sun lenses with UV400.",
    "price": 1299,
    "compareAtPrice": 1899,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Eyewear & Optical",
    "collectionSlug": "trending",
    "brand": "VEXIVO Vision",
    "sellerName": "Fukui Optical Guild",
    "sellerInfo": "Hand-Polished Japanese Cellulose Acetate Frames",
    "stock": 65,
    "lowStockThreshold": 5,
    "tags": [
      "Vision Care",
      "Eyewear & Optical",
      "VEXIVO Vision",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 76,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Universal Rectangular Fit"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Dark Polarized Smoke",
          "Copper Amber"
        ]
      }
    ]
  },
  {
    "name": "Microfiber Ultrasonic Eyewear Deep Cleaning Bath Kit",
    "slug": "microfiber-ultrasonic-eyewear-deep-cleaning-bath-kit",
    "sku": "VEX-VIS-0415",
    "description": "Emits 45,000Hz ultrasonic sound waves to dislodge microscopic oils, dust, and grime from nose pads and hinge crevices in 3 minutes.",
    "shortDescription": "45,000Hz ultrasonic frequency optical cleaning machine.",
    "price": 1499,
    "compareAtPrice": 2199,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80&sig=112"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=800&q=80",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Eyewear & Optical",
    "collectionSlug": "trending",
    "brand": "VEXIVO Vision",
    "sellerName": "Fukui Optical Guild",
    "sellerInfo": "Hand-Polished Japanese Cellulose Acetate Frames",
    "stock": 55,
    "lowStockThreshold": 5,
    "tags": [
      "Vision Care",
      "Eyewear & Optical",
      "VEXIVO Vision",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 84,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "300ml Tank Capacity"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Clean White"
        ]
      }
    ]
  },
  {
    "name": "Geometric Hexagonal Wire Frame Reading Glasses",
    "slug": "geometric-hexagonal-wire-frame-reading-glasses",
    "sku": "VEX-VIS-0416",
    "description": "Distinctive geometric hexagonal silhouette in durable stainless steel wire. Equipped with silicone nose pads and anti-reflective lenses.",
    "shortDescription": "Geometric hexagonal stainless steel wire reading glasses.",
    "price": 1699,
    "compareAtPrice": 2399,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80&sig=112",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80&sig=113"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80&sig=112",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Eyewear & Optical",
    "collectionSlug": "trending",
    "brand": "VEXIVO Vision",
    "sellerName": "Fukui Optical Guild",
    "sellerInfo": "Hand-Polished Japanese Cellulose Acetate Frames",
    "stock": 50,
    "lowStockThreshold": 5,
    "tags": [
      "Vision Care",
      "Eyewear & Optical",
      "VEXIVO Vision",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 92,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "+1.00",
          "+1.50",
          "+2.00",
          "+2.50"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Rose Gold",
          "Antiqued Bronze"
        ]
      }
    ]
  },
  {
    "name": "Sports Wrap-Around Polarized Cycling Sunglasses",
    "slug": "sports-wrap-around-polarized-cycling-sunglasses",
    "sku": "VEX-VIS-0417",
    "description": "Toric curved shatterproof polycarbonate lens providing wide panoramic peripheral vision with hydrophobic coating that repels water and sweat.",
    "shortDescription": "Wrap-around panoramic polarized sports cycling glasses.",
    "price": 2499,
    "compareAtPrice": 3599,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80&sig=112",
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80&sig=113",
      "https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=800&q=80&sig=114"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80&sig=112",
    "hoverImage": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80&sig=113",
    "category": "Vision Care",
    "categorySlug": "vision-care",
    "subcategory": "Eyewear & Optical",
    "collectionSlug": "trending",
    "brand": "VEXIVO Vision",
    "sellerName": "Fukui Optical Guild",
    "sellerInfo": "Hand-Polished Japanese Cellulose Acetate Frames",
    "stock": 40,
    "lowStockThreshold": 5,
    "tags": [
      "Vision Care",
      "Eyewear & Optical",
      "VEXIVO Vision",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 100,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Wraparound Free Size"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Neon Red Mirror",
          "Ice Blue Polarized"
        ]
      }
    ]
  },
  {
    "name": "Orthopedic Egg-Crate Memory Foam Bolster Waterproof Pet Sofa",
    "slug": "orthopedic-egg-crate-memory-foam-bolster-waterproof-pet-sofa",
    "sku": "VEX-PET-0418",
    "description": "Relieves joint dysplasia and arthritis with high-density medical grade memory foam. Removable machine-washable faux suede cover with waterproof liner.",
    "shortDescription": "High-density orthopedic memory foam bolster pet bed.",
    "price": 3499,
    "compareAtPrice": 4999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Pet Health & Comfort",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Paws",
    "sellerName": "Canine Wellness Labs",
    "sellerInfo": "Veterinarian Approved Orthopedic Pet Care",
    "stock": 35,
    "lowStockThreshold": 5,
    "tags": [
      "Pets Care",
      "Pet Health & Comfort",
      "VEXIVO Paws",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 12,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Medium (75x60cm)",
          "Large (90x75cm)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Slate Grey",
          "Espresso"
        ]
      }
    ]
  },
  {
    "name": "Automatic Ultra-Quiet Stainless Steel Pet Water Fountain 2.5L",
    "slug": "automatic-ultra-quiet-stainless-steel-pet-water-fountain-25l",
    "sku": "VEX-PET-0419",
    "description": "Food-grade 304 stainless steel bowl prevents feline chin acne. Quadruple carbon filtration system oxygenates water continuously.",
    "shortDescription": "304 stainless steel ultra-quiet 2.5L pet fountain.",
    "price": 2199,
    "compareAtPrice": 3199,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Pet Health & Comfort",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Paws",
    "sellerName": "Canine Wellness Labs",
    "sellerInfo": "Veterinarian Approved Orthopedic Pet Care",
    "stock": 60,
    "lowStockThreshold": 5,
    "tags": [
      "Pets Care",
      "Pet Health & Comfort",
      "VEXIVO Paws",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 20,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "2.5L Capacity"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Brushed Stainless Steel"
        ]
      }
    ]
  },
  {
    "name": "Natural Bristle Ergonomic Grooming Brush & Deshedding Tool",
    "slug": "natural-bristle-ergonomic-grooming-brush-deshedding-tool",
    "sku": "VEX-PET-0420",
    "description": "Dual-sided wooden brush featuring stainless steel pins with rounded protective tips on one side and natural wild boar bristles on the other.",
    "shortDescription": "Dual-sided bamboo pin and wild boar bristle pet brush.",
    "price": 999,
    "compareAtPrice": 1499,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Pet Health & Comfort",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Paws",
    "sellerName": "Canine Wellness Labs",
    "sellerInfo": "Veterinarian Approved Orthopedic Pet Care",
    "stock": 80,
    "lowStockThreshold": 5,
    "tags": [
      "Pets Care",
      "Pet Health & Comfort",
      "VEXIVO Paws",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 28,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Standard (23x7cm)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Natural Bamboo"
        ]
      }
    ]
  },
  {
    "name": "Heavy-Duty No-Pull Reflective Padded Dog Harness",
    "slug": "heavy-duty-no-pull-reflective-padded-dog-harness",
    "sku": "VEX-PET-0421",
    "description": "Distributes pulling pressure evenly across chest and shoulders without choking. Two sturdy zinc-alloy leash attachment D-rings and padded grab handle.",
    "shortDescription": "Ergonomic no-pull padded harness with 3M reflective trim.",
    "price": 1599,
    "compareAtPrice": 2299,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Pet Health & Comfort",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Paws",
    "sellerName": "Canine Wellness Labs",
    "sellerInfo": "Veterinarian Approved Orthopedic Pet Care",
    "stock": 70,
    "lowStockThreshold": 5,
    "tags": [
      "Pets Care",
      "Pet Health & Comfort",
      "VEXIVO Paws",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 36,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Tactical Black",
          "Safety Orange",
          "Ranger Green"
        ]
      }
    ]
  },
  {
    "name": "Freeze-Dried Wild Alaskan Salmon & Kelp Training Bites 150g",
    "slug": "freeze-dried-wild-alaskan-salmon-kelp-training-bites-150g",
    "sku": "VEX-PET-0422",
    "description": "Single-ingredient 100% human-grade wild caught salmon rich in omega-3 EPA & DHA. Grain-free with no preservatives, fillers, or artificial colors.",
    "shortDescription": "Single-ingredient freeze-dried wild salmon dog treats.",
    "price": 899,
    "compareAtPrice": 1299,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Pet Health & Comfort",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Paws",
    "sellerName": "Canine Wellness Labs",
    "sellerInfo": "Veterinarian Approved Orthopedic Pet Care",
    "stock": 90,
    "lowStockThreshold": 5,
    "tags": [
      "Pets Care",
      "Pet Health & Comfort",
      "VEXIVO Paws",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 44,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "150g Resealable Pouch"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Salmon Pink"
        ]
      }
    ]
  },
  {
    "name": "Slow-Feeder Ceramic Non-Slip Elevated Pet Bowl Set",
    "slug": "slow-feeder-ceramic-non-slip-elevated-pet-bowl-set",
    "sku": "VEX-PET-0423",
    "description": "Maze ridges prevent rapid gulping and bloating. Heavyweight glazed stoneware bowls set into a sturdy water-resistant bamboo stand.",
    "shortDescription": "Ceramic slow feeder maze bowls with elevated bamboo stand.",
    "price": 1899,
    "compareAtPrice": 2699,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Pet Health & Comfort",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Paws",
    "sellerName": "Canine Wellness Labs",
    "sellerInfo": "Veterinarian Approved Orthopedic Pet Care",
    "stock": 50,
    "lowStockThreshold": 5,
    "tags": [
      "Pets Care",
      "Pet Health & Comfort",
      "VEXIVO Paws",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 52,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Double Bowl (850ml each)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Matte White & Bamboo"
        ]
      }
    ]
  },
  {
    "name": "Braided Organic Hemp Rope Tough Chew Interactive Dog Toy",
    "slug": "braided-organic-hemp-rope-tough-chew-interactive-dog-toy",
    "sku": "VEX-PET-0424",
    "description": "Natural pesticide-free hemp fibers act as natural dental floss, cleaning plaque and tartar during vigorous tug-of-war play. 100% biodegradable.",
    "shortDescription": "Heavy-duty 100% organic braided hemp rope dog toy.",
    "price": 699,
    "compareAtPrice": 999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Pet Health & Comfort",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Paws",
    "sellerName": "Canine Wellness Labs",
    "sellerInfo": "Veterinarian Approved Orthopedic Pet Care",
    "stock": 110,
    "lowStockThreshold": 5,
    "tags": [
      "Pets Care",
      "Pet Health & Comfort",
      "VEXIVO Paws",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 60,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Large (45cm length)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Natural Hemp Ecru"
        ]
      }
    ]
  },
  {
    "name": "Self-Cleaning Double-Layer Honeycomb Cat Litter Trapping Mat",
    "slug": "self-cleaning-double-layer-honeycomb-cat-litter-trapping-mat",
    "sku": "VEX-PET-0425",
    "description": "Large honeycomb pockets trap litter scatter from paws. Bottom waterproof EVA layer opens like an envelope to recycle litter back into the box.",
    "shortDescription": "Waterproof double-layer EVA litter scatter trapping mat.",
    "price": 1199,
    "compareAtPrice": 1699,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Pet Health & Comfort",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Paws",
    "sellerName": "Canine Wellness Labs",
    "sellerInfo": "Veterinarian Approved Orthopedic Pet Care",
    "stock": 65,
    "lowStockThreshold": 5,
    "tags": [
      "Pets Care",
      "Pet Health & Comfort",
      "VEXIVO Paws",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 68,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "75 x 55 cm"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Charcoal Black",
          "Soft Grey"
        ]
      }
    ]
  },
  {
    "name": "Soothing Oatmeal & Aloe Hypoallergenic Pet Shampoo 500ml",
    "slug": "soothing-oatmeal-aloe-hypoallergenic-pet-shampoo-500ml",
    "sku": "VEX-PET-0426",
    "description": "pH-balanced for canine skin with colloidal oatmeal, organic aloe vera, and almond oil to soothe dry, itchy, sensitive skin. Tearless formula.",
    "shortDescription": "Colloidal oatmeal & aloe vera tearless pet shampoo 500ml.",
    "price": 899,
    "compareAtPrice": 1299,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Pet Health & Comfort",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Paws",
    "sellerName": "Canine Wellness Labs",
    "sellerInfo": "Veterinarian Approved Orthopedic Pet Care",
    "stock": 85,
    "lowStockThreshold": 5,
    "tags": [
      "Pets Care",
      "Pet Health & Comfort",
      "VEXIVO Paws",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 76,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "500ml Pump Bottle"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Creamy Coconut"
        ]
      }
    ]
  },
  {
    "name": "Multi-Level Sisal Scratching Tree Post with Plush Hammock",
    "slug": "multi-level-sisal-scratching-tree-post-with-plush-hammock",
    "sku": "VEX-PET-0427",
    "description": "Heavy solid particleboard base prevents tipping. Wrapped in natural 6mm sisal rope with elevated lookout perch and deep plush sleeping hammock.",
    "shortDescription": "Multi-level cat scratching tower with sisal posts.",
    "price": 3699,
    "compareAtPrice": 5199,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Pet Health & Comfort",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Paws",
    "sellerName": "Canine Wellness Labs",
    "sellerInfo": "Veterinarian Approved Orthopedic Pet Care",
    "stock": 30,
    "lowStockThreshold": 5,
    "tags": [
      "Pets Care",
      "Pet Health & Comfort",
      "VEXIVO Paws",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 84,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "110cm Height"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Warm Beige",
          "Smoky Grey"
        ]
      }
    ]
  },
  {
    "name": "Breathable Airline-Approved Expandable Pet Travel Carrier",
    "slug": "breathable-airline-approved-expandable-pet-travel-carrier",
    "sku": "VEX-PET-0428",
    "description": "Four-way expandable mesh windows expand to give pets 150% more room during layovers. Waterproof fleece pad and luggage trolley attachment strap.",
    "shortDescription": "Airline-approved 4-way expandable pet travel bag.",
    "price": 2799,
    "compareAtPrice": 3999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Pet Health & Comfort",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Paws",
    "sellerName": "Canine Wellness Labs",
    "sellerInfo": "Veterinarian Approved Orthopedic Pet Care",
    "stock": 45,
    "lowStockThreshold": 5,
    "tags": [
      "Pets Care",
      "Pet Health & Comfort",
      "VEXIVO Paws",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 92,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "45 x 28 x 28 cm (Up to 7kg)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Heather Grey",
          "Midnight Black"
        ]
      }
    ]
  },
  {
    "name": "Heavy-Duty Waterproof Pet Car Seat Cover with Mesh Window",
    "slug": "heavy-duty-waterproof-pet-car-seat-cover-with-mesh-window",
    "sku": "VEX-PET-0429",
    "description": "600D Oxford waterproof quilted fabric protects back seats from mud, fur, and claw tears. Visual mesh window reduces pet travel anxiety.",
    "shortDescription": "600D Oxford waterproof hammock car seat cover.",
    "price": 1999,
    "compareAtPrice": 2899,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
    "category": "Pets Care",
    "categorySlug": "pets-care",
    "subcategory": "Pet Health & Comfort",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Paws",
    "sellerName": "Canine Wellness Labs",
    "sellerInfo": "Veterinarian Approved Orthopedic Pet Care",
    "stock": 55,
    "lowStockThreshold": 5,
    "tags": [
      "Pets Care",
      "Pet Health & Comfort",
      "VEXIVO Paws",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 100,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Universal (147 x 137 cm)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Black with Orange Piping"
        ]
      }
    ]
  },
  {
    "name": "Handcrafted Solid Beechwood Montessori Balance Rocker Board",
    "slug": "handcrafted-solid-beechwood-montessori-balance-rocker-board",
    "sku": "VEX-TOY-0430",
    "description": "Curved multi-use balance board crafted from 10 layers of FSC certified European beech wood. Supports up to 150kg for open-ended creative play.",
    "shortDescription": "European beechwood Montessori balance rocker board.",
    "price": 2999,
    "compareAtPrice": 4299,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Montessori & STEM Play",
    "collectionSlug": "trending",
    "brand": "VEXIVO Play",
    "sellerName": "Nordic Toy Atelier",
    "sellerInfo": "Eco-Friendly FSC Certified Wooden Educational Toys",
    "stock": 40,
    "lowStockThreshold": 5,
    "tags": [
      "Toys",
      "Montessori & STEM Play",
      "VEXIVO Play",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 12,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "84 x 30 x 18 cm"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Natural Beech with Felt Base"
        ]
      }
    ]
  },
  {
    "name": "Magnetic 3D Geometric Architectural Construction Blocks 100-Pc",
    "slug": "magnetic-3d-geometric-architectural-construction-blocks-100-pc",
    "sku": "VEX-TOY-0431",
    "description": "Sonic-welded BPA-free food-grade ABS plastic tiles embedded with neodymium magnets. Develops spatial reasoning, geometry, and engineering skills.",
    "shortDescription": "100-piece magnetic 3D translucent building tile set.",
    "price": 2499,
    "compareAtPrice": 3599,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Montessori & STEM Play",
    "collectionSlug": "trending",
    "brand": "VEXIVO Play",
    "sellerName": "Nordic Toy Atelier",
    "sellerInfo": "Eco-Friendly FSC Certified Wooden Educational Toys",
    "stock": 60,
    "lowStockThreshold": 5,
    "tags": [
      "Toys",
      "Montessori & STEM Play",
      "VEXIVO Play",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 20,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "100-Piece Set"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Rainbow Translucent"
        ]
      }
    ]
  },
  {
    "name": "Scandinavian Pastel Wooden Activity Center & Walker",
    "slug": "scandinavian-pastel-wooden-activity-center-walker",
    "sku": "VEX-TOY-0432",
    "description": "Sturdy wooden push walker featuring abacus beads, shape sorter, spinning gears, and musical xylophone. Rubber-rimmed silent wheels protect hardwood floors.",
    "shortDescription": "Wooden baby activity push walker with rubber wheels.",
    "price": 3299,
    "compareAtPrice": 4699,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Montessori & STEM Play",
    "collectionSlug": "trending",
    "brand": "VEXIVO Play",
    "sellerName": "Nordic Toy Atelier",
    "sellerInfo": "Eco-Friendly FSC Certified Wooden Educational Toys",
    "stock": 35,
    "lowStockThreshold": 5,
    "tags": [
      "Toys",
      "Montessori & STEM Play",
      "VEXIVO Play",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 28,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "50 x 32 x 30 cm"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Pastel Sage & Natural Wood"
        ]
      }
    ]
  },
  {
    "name": "1000-Piece Panoramic Botanical Illustration Jigsaw Puzzle",
    "slug": "1000-piece-panoramic-botanical-illustration-jigsaw-puzzle",
    "sku": "VEX-TOY-0433",
    "description": "Printed on recycled European blue board with non-glare linen finish. Features vintage botanical floral illustrations with zero piece repetition.",
    "shortDescription": "1000-piece linen finish botanical jigsaw puzzle.",
    "price": 999,
    "compareAtPrice": 1499,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80&sig=103"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Montessori & STEM Play",
    "collectionSlug": "trending",
    "brand": "VEXIVO Play",
    "sellerName": "Nordic Toy Atelier",
    "sellerInfo": "Eco-Friendly FSC Certified Wooden Educational Toys",
    "stock": 80,
    "lowStockThreshold": 5,
    "tags": [
      "Toys",
      "Montessori & STEM Play",
      "VEXIVO Play",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 36,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "70 x 50 cm Completed Size"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Botanical Multicolor"
        ]
      }
    ]
  },
  {
    "name": "Food Grade Silicone Nesting Rainbow Teether Stacking Blocks",
    "slug": "food-grade-silicone-nesting-rainbow-teether-stacking-blocks",
    "sku": "VEX-TOY-0434",
    "description": "100% platinum food-grade silicone free from BPA, phthalates, and lead. Multi-textured arches soothe teething gums and teach size hierarchy.",
    "shortDescription": "Food-grade silicone 7-piece nesting rainbow teether.",
    "price": 1199,
    "compareAtPrice": 1699,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80&sig=103",
      "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80&sig=103",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Montessori & STEM Play",
    "collectionSlug": "trending",
    "brand": "VEXIVO Play",
    "sellerName": "Nordic Toy Atelier",
    "sellerInfo": "Eco-Friendly FSC Certified Wooden Educational Toys",
    "stock": 75,
    "lowStockThreshold": 5,
    "tags": [
      "Toys",
      "Montessori & STEM Play",
      "VEXIVO Play",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 44,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "7 Arches (19 x 9.5 cm)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Earthy Bohemian Palette"
        ]
      }
    ]
  },
  {
    "name": "Classic Wooden Dollhouse with Miniature Furniture Set",
    "slug": "classic-wooden-dollhouse-with-miniature-furniture-set",
    "sku": "VEX-TOY-0435",
    "description": "Three-story wooden mansion with open front access, functional balcony, and 18 pieces of hand-painted wooden furniture. Easy adult assembly.",
    "shortDescription": "3-story handcrafted wooden dollhouse with 18 furniture pieces.",
    "price": 4999,
    "compareAtPrice": 6999,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80&sig=103",
      "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80&sig=103",
    "hoverImage": "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Montessori & STEM Play",
    "collectionSlug": "trending",
    "brand": "VEXIVO Play",
    "sellerName": "Nordic Toy Atelier",
    "sellerInfo": "Eco-Friendly FSC Certified Wooden Educational Toys",
    "stock": 25,
    "lowStockThreshold": 5,
    "tags": [
      "Toys",
      "Montessori & STEM Play",
      "VEXIVO Play",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 52,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "60 x 55 x 30 cm"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Soft Pink & White"
        ]
      }
    ]
  },
  {
    "name": "Interactive Solar-Powered Robotic STEM Engineering Kit",
    "slug": "interactive-solar-powered-robotic-stem-engineering-kit",
    "sku": "VEX-TOY-0436",
    "description": "Build 14 different solar-powered working robotic configurations without batteries. Teaches renewable green energy principles and mechanical linkage.",
    "shortDescription": "14-in-1 solar-powered educational STEM robot kit.",
    "price": 1899,
    "compareAtPrice": 2699,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Montessori & STEM Play",
    "collectionSlug": "trending",
    "brand": "VEXIVO Play",
    "sellerName": "Nordic Toy Atelier",
    "sellerInfo": "Eco-Friendly FSC Certified Wooden Educational Toys",
    "stock": 50,
    "lowStockThreshold": 5,
    "tags": [
      "Toys",
      "Montessori & STEM Play",
      "VEXIVO Play",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 60,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "14-in-1 Modular Kit"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Cobalt Blue & Grey"
        ]
      }
    ]
  },
  {
    "name": "Organic Cotton Stuffed Musical Sleep Companion Fox",
    "slug": "organic-cotton-stuffed-musical-sleep-companion-fox",
    "sku": "VEX-TOY-0437",
    "description": "Hand-sewn from GOTS certified organic cotton plush with embroidered facial features. Pull string activates soothing Brahms lullaby music box.",
    "shortDescription": "Organic cotton plush fox with internal mechanical music box.",
    "price": 1399,
    "compareAtPrice": 1999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Montessori & STEM Play",
    "collectionSlug": "trending",
    "brand": "VEXIVO Play",
    "sellerName": "Nordic Toy Atelier",
    "sellerInfo": "Eco-Friendly FSC Certified Wooden Educational Toys",
    "stock": 65,
    "lowStockThreshold": 5,
    "tags": [
      "Toys",
      "Montessori & STEM Play",
      "VEXIVO Play",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 68,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "28cm Height"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Warm Terracotta & Cream"
        ]
      }
    ]
  },
  {
    "name": "Solid Walnut Chess & Checkers Set with Carved Staunton Pieces",
    "slug": "solid-walnut-chess-checkers-set-with-carved-staunton-pieces",
    "sku": "VEX-TOY-0438",
    "description": "Inlaid solid walnut and maple wooden board with felted storage drawers. Weighted Staunton wooden pieces with 3.5-inch King.",
    "shortDescription": "Inlaid walnut wooden chess board with weighted pieces.",
    "price": 3499,
    "compareAtPrice": 4999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611604548018-d56bbd85d681?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Montessori & STEM Play",
    "collectionSlug": "trending",
    "brand": "VEXIVO Play",
    "sellerName": "Nordic Toy Atelier",
    "sellerInfo": "Eco-Friendly FSC Certified Wooden Educational Toys",
    "stock": 30,
    "lowStockThreshold": 5,
    "tags": [
      "Toys",
      "Montessori & STEM Play",
      "VEXIVO Play",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 76,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "38 x 38 cm Board"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Rich Walnut & Natural Maple"
        ]
      }
    ]
  },
  {
    "name": "Die-Cast Vintage Locomotive Train Set with Real Steam",
    "slug": "die-cast-vintage-locomotive-train-set-with-real-steam",
    "sku": "VEX-TOY-0439",
    "description": "Heavy die-cast metal steam engine with passenger cars and 16 feet of interlocking track. Features working headlight, chugging sound, and water vapor steam.",
    "shortDescription": "Vintage die-cast steam train set with water vapor smoke.",
    "price": 2799,
    "compareAtPrice": 3999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611604548018-d56bbd85d681?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1611604548018-d56bbd85d681?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Montessori & STEM Play",
    "collectionSlug": "trending",
    "brand": "VEXIVO Play",
    "sellerName": "Nordic Toy Atelier",
    "sellerInfo": "Eco-Friendly FSC Certified Wooden Educational Toys",
    "stock": 40,
    "lowStockThreshold": 5,
    "tags": [
      "Toys",
      "Montessori & STEM Play",
      "VEXIVO Play",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 84,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Complete Track Set (120x90cm)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Classic Black & Brass"
        ]
      }
    ]
  },
  {
    "name": "Kinetic Magic Play Sand Sensory Exploration Box 2kg",
    "slug": "kinetic-magic-play-sand-sensory-exploration-box-2kg",
    "sku": "VEX-TOY-0440",
    "description": "Hypoallergenic non-toxic polymer sand that flows like liquid yet holds sharp molds effortlessly. Includes 10 castle molds and foldable play tray.",
    "shortDescription": "2kg kinetic magic sand with molds and folding sand box.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1611604548018-d56bbd85d681?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1611604548018-d56bbd85d681?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Montessori & STEM Play",
    "collectionSlug": "trending",
    "brand": "VEXIVO Play",
    "sellerName": "Nordic Toy Atelier",
    "sellerInfo": "Eco-Friendly FSC Certified Wooden Educational Toys",
    "stock": 70,
    "lowStockThreshold": 5,
    "tags": [
      "Toys",
      "Montessori & STEM Play",
      "VEXIVO Play",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 92,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "2kg Sand + Tray & 10 Tools"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Ocean Blue & Natural Sand"
        ]
      }
    ]
  },
  {
    "name": "Junior Outdoor Explorer Adventure Bug Catching Kit",
    "slug": "junior-outdoor-explorer-adventure-bug-catching-kit",
    "sku": "VEX-TOY-0441",
    "description": "Includes 4x30 optical binoculars, compass, magnifying glass, LED crank flashlight, insect collection container, and butterfly net.",
    "shortDescription": "Kids outdoor explorer kit with binoculars and backpack.",
    "price": 1099,
    "compareAtPrice": 1599,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80&sig=113"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80",
    "category": "Toys",
    "categorySlug": "toys",
    "subcategory": "Montessori & STEM Play",
    "collectionSlug": "trending",
    "brand": "VEXIVO Play",
    "sellerName": "Nordic Toy Atelier",
    "sellerInfo": "Eco-Friendly FSC Certified Wooden Educational Toys",
    "stock": 65,
    "lowStockThreshold": 5,
    "tags": [
      "Toys",
      "Montessori & STEM Play",
      "VEXIVO Play",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 100,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Complete 7-Piece Adventure Bag"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Safari Green"
        ]
      }
    ]
  },
  {
    "name": "High-Density Eco-Friendly Natural Tree Rubber Studio Yoga Mat",
    "slug": "high-density-eco-friendly-natural-tree-rubber-studio-yoga-mat",
    "sku": "VEX-HEA-0442",
    "description": "Sustainably tapped organic tree rubber base with ultra-absorbent polyurethane top layer that provides laser grip even during sweaty hot yoga sessions.",
    "shortDescription": "5mm natural tree rubber non-slip studio yoga mat.",
    "price": 2799,
    "compareAtPrice": 3999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Studio Wellness & Training",
    "collectionSlug": "trending",
    "brand": "VEXIVO Active",
    "sellerName": "Kinetic Performance Lab",
    "sellerInfo": "Engineered High-Performance Athletic Equipment",
    "stock": 50,
    "lowStockThreshold": 5,
    "tags": [
      "Health & Fitness",
      "Studio Wellness & Training",
      "VEXIVO Active",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 12,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "183 x 68 cm (5mm Thickness)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Forest Pine",
          "Midnight Plum"
        ]
      }
    ]
  },
  {
    "name": "Deep-Tissue Percussion Muscle Massage Gun with 6 Heads",
    "slug": "deep-tissue-percussion-muscle-massage-gun-with-6-heads",
    "sku": "VEX-HEA-0443",
    "description": "Brushless high-torque motor delivering 3200 RPM percussion with 12mm amplitude. QuietGlide noise reduction and 6-hour rechargeable battery.",
    "shortDescription": "High-torque deep tissue percussion massage gun.",
    "price": 3699,
    "compareAtPrice": 5299,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Studio Wellness & Training",
    "collectionSlug": "trending",
    "brand": "VEXIVO Active",
    "sellerName": "Kinetic Performance Lab",
    "sellerInfo": "Engineered High-Performance Athletic Equipment",
    "stock": 45,
    "lowStockThreshold": 5,
    "tags": [
      "Health & Fitness",
      "Studio Wellness & Training",
      "VEXIVO Active",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 20,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Handheld Kit with Carry Case"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Matte Gunmetal",
          "Stealth Black"
        ]
      }
    ]
  },
  {
    "name": "Cast Iron Adjustable Vinyl-Coated Kettlebell 16kg",
    "slug": "cast-iron-adjustable-vinyl-coated-kettlebell-16kg",
    "sku": "VEX-HEA-0444",
    "description": "Single-piece gravity cast iron with smooth wide textured handle for two-handed swings. Durable vinyl dip prevents floor damage and rust.",
    "shortDescription": "16kg solid cast iron kettlebell with vinyl floor coat.",
    "price": 2499,
    "compareAtPrice": 3499,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Studio Wellness & Training",
    "collectionSlug": "trending",
    "brand": "VEXIVO Active",
    "sellerName": "Kinetic Performance Lab",
    "sellerInfo": "Engineered High-Performance Athletic Equipment",
    "stock": 40,
    "lowStockThreshold": 5,
    "tags": [
      "Health & Fitness",
      "Studio Wellness & Training",
      "VEXIVO Active",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 28,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "16 kg (35 lbs)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Matte Black & Yellow Accent"
        ]
      }
    ]
  },
  {
    "name": "Latex-Free Natural Rubber Resistance Bands Loop Set of 5",
    "slug": "latex-free-natural-rubber-resistance-bands-loop-set-of-5",
    "sku": "VEX-HEA-0445",
    "description": "Color-coded progressive resistance from Extra Light (5 lbs) to Extra Heavy (40 lbs). Includes breathable mesh storage pouch and exercise guide.",
    "shortDescription": "5-pack calibrated natural rubber exercise loop bands.",
    "price": 899,
    "compareAtPrice": 1299,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Studio Wellness & Training",
    "collectionSlug": "trending",
    "brand": "VEXIVO Active",
    "sellerName": "Kinetic Performance Lab",
    "sellerInfo": "Engineered High-Performance Athletic Equipment",
    "stock": 95,
    "lowStockThreshold": 5,
    "tags": [
      "Health & Fitness",
      "Studio Wellness & Training",
      "VEXIVO Active",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 36,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Set of 5 Resistance Levels"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Pastel Gradient",
          "Classic Athletics"
        ]
      }
    ]
  },
  {
    "name": "Insulated Double-Wall Stainless Steel Sport Water Bottle 1L",
    "slug": "insulated-double-wall-stainless-steel-sport-water-bottle-1l",
    "sku": "VEX-HEA-0446",
    "description": "18/8 food-grade pro stainless steel keeping beverages icy cold for 24 hours or steaming hot for 12 hours. Sweat-free powder-coat finish with chug cap.",
    "shortDescription": "1-Liter double-wall vacuum insulated stainless bottle.",
    "price": 1299,
    "compareAtPrice": 1799,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Studio Wellness & Training",
    "collectionSlug": "trending",
    "brand": "VEXIVO Active",
    "sellerName": "Kinetic Performance Lab",
    "sellerInfo": "Engineered High-Performance Athletic Equipment",
    "stock": 80,
    "lowStockThreshold": 5,
    "tags": [
      "Health & Fitness",
      "Studio Wellness & Training",
      "VEXIVO Active",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 44,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "1000ml (32 oz)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Matte Sage",
          "Deep Ocean",
          "Desert Sand"
        ]
      }
    ]
  },
  {
    "name": "High-Precision Smart Bluetooth Body Fat Scale with 13 Metrics",
    "slug": "high-precision-smart-bluetooth-body-fat-scale-with-13-metrics",
    "sku": "VEX-HEA-0447",
    "description": "Bio-electrical impedance analysis (BIA) measuring weight, BMI, body fat percentage, skeletal muscle, visceral fat, and metabolic age on smartphone app.",
    "shortDescription": "13-metric Bluetooth smart body composition scale.",
    "price": 1899,
    "compareAtPrice": 2699,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Studio Wellness & Training",
    "collectionSlug": "trending",
    "brand": "VEXIVO Active",
    "sellerName": "Kinetic Performance Lab",
    "sellerInfo": "Engineered High-Performance Athletic Equipment",
    "stock": 60,
    "lowStockThreshold": 5,
    "tags": [
      "Health & Fitness",
      "Studio Wellness & Training",
      "VEXIVO Active",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 52,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "28 x 28 cm Tempered Glass"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Arctic White",
          "Obsidian Black"
        ]
      }
    ]
  },
  {
    "name": "Textured High-Density Foam Roller for Myofascial Release",
    "slug": "textured-high-density-foam-roller-for-myofascial-release",
    "sku": "VEX-HEA-0448",
    "description": "Grid finger and palm multi-density zones break down tight muscle knots, trigger points, and scar tissue. Hollow ABS core supports up to 250kg.",
    "shortDescription": "Multi-density grid trigger point muscle foam roller.",
    "price": 999,
    "compareAtPrice": 1499,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Studio Wellness & Training",
    "collectionSlug": "trending",
    "brand": "VEXIVO Active",
    "sellerName": "Kinetic Performance Lab",
    "sellerInfo": "Engineered High-Performance Athletic Equipment",
    "stock": 70,
    "lowStockThreshold": 5,
    "tags": [
      "Health & Fitness",
      "Studio Wellness & Training",
      "VEXIVO Active",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 60,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "33 x 14 cm"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Vibrant Teal",
          "Classic Black"
        ]
      }
    ]
  },
  {
    "name": "Speed Jump Rope with Dual Ball Bearings & Steel Cable",
    "slug": "speed-jump-rope-with-dual-ball-bearings-steel-cable",
    "sku": "VEX-HEA-0449",
    "description": "360-degree precision dual-bearing rotation system prevents twisting and curling. 3-meter PVC-coated steel wire cable adjustable with thumb screws.",
    "shortDescription": "Dual ball-bearing high-speed crossfit jump rope.",
    "price": 799,
    "compareAtPrice": 1199,
    "discount": 33,
    "images": [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616803689943-5601631c7fec?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Studio Wellness & Training",
    "collectionSlug": "trending",
    "brand": "VEXIVO Active",
    "sellerName": "Kinetic Performance Lab",
    "sellerInfo": "Engineered High-Performance Athletic Equipment",
    "stock": 90,
    "lowStockThreshold": 5,
    "tags": [
      "Health & Fitness",
      "Studio Wellness & Training",
      "VEXIVO Active",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 68,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Adjustable 3-Meter Cable"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Red Aluminum",
          "Black Anodized"
        ]
      }
    ]
  },
  {
    "name": "Ergonomic Contoured Lumbar Support Orthopedic Back Cushion",
    "slug": "ergonomic-contoured-lumbar-support-orthopedic-back-cushion",
    "sku": "VEX-HEA-0450",
    "description": "Scientifically molded high-resilience memory foam aligns spine posture during long desk work or driving. Breathable 3D mesh cover with dual straps.",
    "shortDescription": "Orthopedic memory foam ergonomic lumbar back pillow.",
    "price": 1599,
    "compareAtPrice": 2299,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616803689943-5601631c7fec?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1616803689943-5601631c7fec?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Studio Wellness & Training",
    "collectionSlug": "trending",
    "brand": "VEXIVO Active",
    "sellerName": "Kinetic Performance Lab",
    "sellerInfo": "Engineered High-Performance Athletic Equipment",
    "stock": 55,
    "lowStockThreshold": 5,
    "tags": [
      "Health & Fitness",
      "Studio Wellness & Training",
      "VEXIVO Active",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 76,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "40 x 35 x 12 cm"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Slate Grey Mesh"
        ]
      }
    ]
  },
  {
    "name": "Neoprene Dipped Hexagonal Dumbbell Pair 5kg Each",
    "slug": "neoprene-dipped-hexagonal-dumbbell-pair-5kg-each",
    "sku": "VEX-HEA-0451",
    "description": "Solid cast iron core dipped in comfortable non-slip neoprene coating. Anti-roll hexagonal heads stay put when set down between sets.",
    "shortDescription": "5kg x 2 anti-roll neoprene dipped cast iron dumbbells.",
    "price": 1999,
    "compareAtPrice": 2799,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1616803689943-5601631c7fec?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1616803689943-5601631c7fec?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Studio Wellness & Training",
    "collectionSlug": "trending",
    "brand": "VEXIVO Active",
    "sellerName": "Kinetic Performance Lab",
    "sellerInfo": "Engineered High-Performance Athletic Equipment",
    "stock": 45,
    "lowStockThreshold": 5,
    "tags": [
      "Health & Fitness",
      "Studio Wellness & Training",
      "VEXIVO Active",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 84,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Pair (5kg + 5kg)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Teal Green",
          "Jet Black"
        ]
      }
    ]
  },
  {
    "name": "Compression Knee Sleeves 7mm Neoprene Pair for Weightlifting",
    "slug": "compression-knee-sleeves-7mm-neoprene-pair-for-weightlifting",
    "sku": "VEX-HEA-0452",
    "description": "Competition grade 7mm SCR neoprene delivering heavy compression, joint warmth, and stability during deep barbell squats and lunges.",
    "shortDescription": "7mm heavy-duty powerlifting neoprene knee sleeves pair.",
    "price": 1499,
    "compareAtPrice": 2199,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80&sig=109"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Studio Wellness & Training",
    "collectionSlug": "trending",
    "brand": "VEXIVO Active",
    "sellerName": "Kinetic Performance Lab",
    "sellerInfo": "Engineered High-Performance Athletic Equipment",
    "stock": 60,
    "lowStockThreshold": 5,
    "tags": [
      "Health & Fitness",
      "Studio Wellness & Training",
      "VEXIVO Active",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 92,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "S",
          "M",
          "L",
          "XL"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Stealth Black with Red Stitch"
        ]
      }
    ]
  },
  {
    "name": "Padded Genuine Leather Gym Weight Lifting Belt with Steel Buckle",
    "slug": "padded-genuine-leather-gym-weight-lifting-belt-with-steel-buckle",
    "sku": "VEX-HEA-0453",
    "description": "Top-grain 8mm buffalo leather with contoured 4-inch back support pad and dual-prong stainless steel roller buckle. Prevents hyperextension.",
    "shortDescription": "4-inch contoured buffalo leather powerlifting belt.",
    "price": 2199,
    "compareAtPrice": 3199,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80&sig=109",
      "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=800&q=80&sig=110"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80&sig=109",
    "category": "Health & Fitness",
    "categorySlug": "health-fitness",
    "subcategory": "Studio Wellness & Training",
    "collectionSlug": "trending",
    "brand": "VEXIVO Active",
    "sellerName": "Kinetic Performance Lab",
    "sellerInfo": "Engineered High-Performance Athletic Equipment",
    "stock": 40,
    "lowStockThreshold": 5,
    "tags": [
      "Health & Fitness",
      "Studio Wellness & Training",
      "VEXIVO Active",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 100,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "M (30-36\")",
          "L (34-40\")",
          "XL (38-44\")"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Oiled Dark Brown",
          "Matte Black"
        ]
      }
    ]
  },
  {
    "name": "Active Noise-Cancelling Over-Ear Studio Wireless Headphones",
    "slug": "active-noise-cancelling-over-ear-studio-wireless-headphones",
    "sku": "VEX-ELE-0454",
    "description": "Custom 40mm titanium drivers with hybrid ANC eliminating 95% of ambient drone. Supports LDAC high-res audio codec with 50-hour playback.",
    "shortDescription": "Hybrid ANC over-ear Bluetooth 5.3 headphones with LDAC.",
    "price": 5999,
    "compareAtPrice": 8499,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Audio & Desktop Tech",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Audio",
    "sellerName": "Acoustic Sound Labs",
    "sellerInfo": "Precision High-Fidelity Audio Engineering",
    "stock": 35,
    "lowStockThreshold": 5,
    "tags": [
      "Electronics",
      "Audio & Desktop Tech",
      "VEXIVO Audio",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 12,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Universal Over-Ear"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Matte Black",
          "Silver Cloud"
        ]
      }
    ]
  },
  {
    "name": "Retro Walnut Wood Hi-Fi Bluetooth 5.3 Desktop Speaker",
    "slug": "retro-walnut-wood-hi-fi-bluetooth-53-desktop-speaker",
    "sku": "VEX-ELE-0455",
    "description": "Handcrafted solid walnut cabinet houses dual 20W neodymium full-range drivers and rear bass reflex port. Analog rotary brass volume knobs.",
    "shortDescription": "Solid walnut 40W Hi-Fi stereo desktop Bluetooth speaker.",
    "price": 3999,
    "compareAtPrice": 5699,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Audio & Desktop Tech",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Audio",
    "sellerName": "Acoustic Sound Labs",
    "sellerInfo": "Precision High-Fidelity Audio Engineering",
    "stock": 40,
    "lowStockThreshold": 5,
    "tags": [
      "Electronics",
      "Audio & Desktop Tech",
      "VEXIVO Audio",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 20,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "24 x 14 x 12 cm"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Natural Walnut & Gold"
        ]
      }
    ]
  },
  {
    "name": "Ultra-Slim 65W GaN Fast Charger with Dual USB-C & USB-A",
    "slug": "ultra-slim-65w-gan-fast-charger-with-dual-usb-c-usb-a",
    "sku": "VEX-ELE-0456",
    "description": "Gallium Nitride (GaN III) technology delivers full 65W power in half the size of standard adapters. Fast charges MacBook Pro, iPhone, and Galaxy.",
    "shortDescription": "65W GaN III ultra-compact 3-port fast wall charger.",
    "price": 1799,
    "compareAtPrice": 2499,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Audio & Desktop Tech",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Audio",
    "sellerName": "Acoustic Sound Labs",
    "sellerInfo": "Precision High-Fidelity Audio Engineering",
    "stock": 75,
    "lowStockThreshold": 5,
    "tags": [
      "Electronics",
      "Audio & Desktop Tech",
      "VEXIVO Audio",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 28,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Pocket Size (60x35x30mm)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Matte White",
          "Dark Graphite"
        ]
      }
    ]
  },
  {
    "name": "Ergonomic Wireless Vertical Mouse with Silent Mechanical Switches",
    "slug": "ergonomic-wireless-vertical-mouse-with-silent-mechanical-switches",
    "sku": "VEX-ELE-0457",
    "description": "Natural 57-degree handshake posture reduces forearm tension and wrist pressure. 4000 DPI optical sensor with dual Bluetooth & 2.4GHz dongle.",
    "shortDescription": "57-degree ergonomic vertical silent wireless mouse.",
    "price": 1899,
    "compareAtPrice": 2699,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Audio & Desktop Tech",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Audio",
    "sellerName": "Acoustic Sound Labs",
    "sellerInfo": "Precision High-Fidelity Audio Engineering",
    "stock": 65,
    "lowStockThreshold": 5,
    "tags": [
      "Electronics",
      "Audio & Desktop Tech",
      "VEXIVO Audio",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 36,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Right-Handed Ergonomic"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Graphite Black",
          "Off-White"
        ]
      }
    ]
  },
  {
    "name": "4K Ultra-HD Web Camera with Dual Stereo Noise-Cancelling Mics",
    "slug": "4k-ultra-hd-web-camera-with-dual-stereo-noise-cancelling-mics",
    "sku": "VEX-ELE-0458",
    "description": "Sony STARVIS CMOS sensor captures 4K @ 30fps with autofocus and HDR light correction. Built-in physical privacy slider and 360 tripod mount.",
    "shortDescription": "4K Sony sensor HDR webcam with privacy shutter.",
    "price": 3499,
    "compareAtPrice": 4899,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Audio & Desktop Tech",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Audio",
    "sellerName": "Acoustic Sound Labs",
    "sellerInfo": "Precision High-Fidelity Audio Engineering",
    "stock": 45,
    "lowStockThreshold": 5,
    "tags": [
      "Electronics",
      "Audio & Desktop Tech",
      "VEXIVO Audio",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 44,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Monitor Mount Clip Included"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Black Anodized"
        ]
      }
    ]
  },
  {
    "name": "Aluminum Multi-Port USB-C Hub with 4K HDMI & 100W PD Pass-through",
    "slug": "aluminum-multi-port-usb-c-hub-with-4k-hdmi-100w-pd-pass-through",
    "sku": "VEX-ELE-0459",
    "description": "7-in-1 expansion hub featuring 4K @ 60Hz HDMI, 100W Power Delivery, SD/TF card reader, and 3x USB 3.0 ports in heat-dissipating space grey alloy.",
    "shortDescription": "7-in-1 aluminum USB-C hub with 4K 60Hz HDMI & 100W PD.",
    "price": 2199,
    "compareAtPrice": 3199,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Audio & Desktop Tech",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Audio",
    "sellerName": "Acoustic Sound Labs",
    "sellerInfo": "Precision High-Fidelity Audio Engineering",
    "stock": 70,
    "lowStockThreshold": 5,
    "tags": [
      "Electronics",
      "Audio & Desktop Tech",
      "VEXIVO Audio",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 52,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Compact Dongle (110x30mm)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Space Grey Aluminum"
        ]
      }
    ]
  },
  {
    "name": "True Wireless In-Ear Earbuds with Transparency Mode & IPX7",
    "slug": "true-wireless-in-ear-earbuds-with-transparency-mode-ipx7",
    "sku": "VEX-ELE-0460",
    "description": "Graphene dynamic drivers deliver punchy sub-bass and crystal-clear highs. IPX7 waterproof rating with wireless charging pocket case.",
    "shortDescription": "IPX7 waterproof TWS earbuds with wireless charging case.",
    "price": 2999,
    "compareAtPrice": 4299,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Audio & Desktop Tech",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Audio",
    "sellerName": "Acoustic Sound Labs",
    "sellerInfo": "Precision High-Fidelity Audio Engineering",
    "stock": 55,
    "lowStockThreshold": 5,
    "tags": [
      "Electronics",
      "Audio & Desktop Tech",
      "VEXIVO Audio",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 60,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Includes S, M, L Silicone Tips"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Midnight Black",
          "Pearl White"
        ]
      }
    ]
  },
  {
    "name": "MagSafe Fast Wireless Magnetic Charging Stand 3-in-1",
    "slug": "magsafe-fast-wireless-magnetic-charging-stand-3-in-1",
    "sku": "VEX-ELE-0461",
    "description": "Simultaneously charges iPhone at 15W, Apple Watch at 5W, and AirPods at 5W. Floating magnetic arm holds phone in portrait or landscape.",
    "shortDescription": "15W 3-in-1 magnetic wireless charging tree stand.",
    "price": 2699,
    "compareAtPrice": 3799,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Audio & Desktop Tech",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Audio",
    "sellerName": "Acoustic Sound Labs",
    "sellerInfo": "Precision High-Fidelity Audio Engineering",
    "stock": 50,
    "lowStockThreshold": 5,
    "tags": [
      "Electronics",
      "Audio & Desktop Tech",
      "VEXIVO Audio",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 68,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Desk Stand Form Factor"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Pure White",
          "Matte Black"
        ]
      }
    ]
  },
  {
    "name": "Mechanical Tenkeyless Keyboard with Hot-Swappable Gateron Switches",
    "slug": "mechanical-tenkeyless-keyboard-with-hot-swappable-gateron-switches",
    "sku": "VEX-ELE-0462",
    "description": "80% TKL aluminum top frame with pre-lubed Gateron Pro Yellow linear switches. Double-shot PBT keycaps and sound-dampening silicone foam.",
    "shortDescription": "Hot-swappable TKL mechanical keyboard with PBT caps.",
    "price": 4499,
    "compareAtPrice": 6299,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Audio & Desktop Tech",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Audio",
    "sellerName": "Acoustic Sound Labs",
    "sellerInfo": "Precision High-Fidelity Audio Engineering",
    "stock": 35,
    "lowStockThreshold": 5,
    "tags": [
      "Electronics",
      "Audio & Desktop Tech",
      "VEXIVO Audio",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 76,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "87-Key TKL Layout"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Retro Beige & Grey",
          "Cyberpunk Neon"
        ]
      }
    ]
  },
  {
    "name": "Portable Power Bank 20000mAh with Digital LED Battery Display",
    "slug": "portable-power-bank-20000mah-with-digital-led-battery-display",
    "sku": "VEX-ELE-0463",
    "description": "Airline-safe 74Wh high-capacity lithium-polymer cell with 22.5W Power Delivery fast charging. Numerical digital display shows exact percentage.",
    "shortDescription": "20000mAh 22.5W fast-charging power bank with LED.",
    "price": 2299,
    "compareAtPrice": 3299,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Audio & Desktop Tech",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Audio",
    "sellerName": "Acoustic Sound Labs",
    "sellerInfo": "Precision High-Fidelity Audio Engineering",
    "stock": 60,
    "lowStockThreshold": 5,
    "tags": [
      "Electronics",
      "Audio & Desktop Tech",
      "VEXIVO Audio",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 84,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "145 x 68 x 28 mm"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Midnight Navy",
          "Matte Black"
        ]
      }
    ]
  },
  {
    "name": "Smart Home Ambient LED Sunset Projection Lamp with App Control",
    "slug": "smart-home-ambient-led-sunset-projection-lamp-with-app-control",
    "sku": "VEX-ELE-0464",
    "description": "High-transmission optical crystal lens projects realistic golden-hour halo gradient. App control unlocks 16 million colors and rhythm sync.",
    "shortDescription": "16M color smart RGB optical sunset projection lamp.",
    "price": 1499,
    "compareAtPrice": 2199,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Audio & Desktop Tech",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Audio",
    "sellerName": "Acoustic Sound Labs",
    "sellerInfo": "Precision High-Fidelity Audio Engineering",
    "stock": 75,
    "lowStockThreshold": 5,
    "tags": [
      "Electronics",
      "Audio & Desktop Tech",
      "VEXIVO Audio",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 92,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "25cm Adjustable Stand"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Matte Black Base"
        ]
      }
    ]
  },
  {
    "name": "Studio Broadcast USB Condenser Microphone with Boom Arm Kit",
    "slug": "studio-broadcast-usb-condenser-microphone-with-boom-arm-kit",
    "sku": "VEX-ELE-0465",
    "description": "Cardioid pickup pattern minimizes keyboard background clicks. Zero-latency headphone monitoring jack and tap-to-mute sensor with LED indicator.",
    "shortDescription": "24-bit 192kHz USB broadcast condenser mic with scissor arm.",
    "price": 3299,
    "compareAtPrice": 4699,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    "category": "Electronics",
    "categorySlug": "electronics",
    "subcategory": "Audio & Desktop Tech",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Audio",
    "sellerName": "Acoustic Sound Labs",
    "sellerInfo": "Precision High-Fidelity Audio Engineering",
    "stock": 40,
    "lowStockThreshold": 5,
    "tags": [
      "Electronics",
      "Audio & Desktop Tech",
      "VEXIVO Audio",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 100,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Complete Kit with Boom Arm & Pop Filter"
        ]
      },
      {
        "name": "Color",
        "options": [
          "All-Black Studio Edition"
        ]
      }
    ]
  },
  {
    "name": "Hand-Thrown Japanese Stoneware Ceramic Dinnerware Set 16-Pc",
    "slug": "hand-thrown-japanese-stoneware-ceramic-dinnerware-set-16-pc",
    "sku": "VEX-HOM-0466",
    "description": "Artisan hand-thrown stoneware finished with matte reactive speckle glaze. Dishwasher and microwave safe service for four including plates and bowls.",
    "shortDescription": "16-piece matte reactive glaze ceramic stoneware dining set.",
    "price": 5499,
    "compareAtPrice": 7999,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Artisan Decor & Dining",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Living",
    "sellerName": "Kyoto Ceramic Studio",
    "sellerInfo": "Traditional Ceramic Art and Natural Furnishings",
    "stock": 25,
    "lowStockThreshold": 5,
    "tags": [
      "Home & Living",
      "Artisan Decor & Dining",
      "VEXIVO Living",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 12,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "16-Piece Service for 4"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Earthy Sand Speckle",
          "Ocean Slate"
        ]
      }
    ]
  },
  {
    "name": "French Flax 100% Pure Washed Linen Duvet Cover Set",
    "slug": "french-flax-100-pure-washed-linen-duvet-cover-set",
    "sku": "VEX-HOM-0467",
    "description": "Woven from premium Normandy flax, garment washed for lived-in softness. Naturally breathable, temperature-regulating in summer and winter.",
    "shortDescription": "Normandy washed French linen king duvet cover set.",
    "price": 4999,
    "compareAtPrice": 7199,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Artisan Decor & Dining",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Living",
    "sellerName": "Kyoto Ceramic Studio",
    "sellerInfo": "Traditional Ceramic Art and Natural Furnishings",
    "stock": 35,
    "lowStockThreshold": 5,
    "tags": [
      "Home & Living",
      "Artisan Decor & Dining",
      "VEXIVO Living",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 20,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Queen (90x90\")",
          "King (104x90\")"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Warm Oatmeal",
          "Sage Fog",
          "Terracotta"
        ]
      }
    ]
  },
  {
    "name": "Handcrafted Solid Black Walnut Sculptural Side Table",
    "slug": "handcrafted-solid-black-walnut-sculptural-side-table",
    "sku": "VEX-HOM-0468",
    "description": "FSC-certified American black walnut with organic curved edges and continuous grain waterfall legs. Finished in non-toxic matte hardwax oil.",
    "shortDescription": "Solid American black walnut organic modern side table.",
    "price": 6499,
    "compareAtPrice": 8999,
    "discount": 28,
    "images": [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Artisan Decor & Dining",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Living",
    "sellerName": "Kyoto Ceramic Studio",
    "sellerInfo": "Traditional Ceramic Art and Natural Furnishings",
    "stock": 20,
    "lowStockThreshold": 5,
    "tags": [
      "Home & Living",
      "Artisan Decor & Dining",
      "VEXIVO Living",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 28,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "45 x 45 x 50 cm"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Natural Dark Walnut"
        ]
      }
    ]
  },
  {
    "name": "Moroccan Handwoven Wool Shag Berber Area Rug (5x7 ft)",
    "slug": "moroccan-handwoven-wool-shag-berber-area-rug-5x7-ft",
    "sku": "VEX-HOM-0469",
    "description": "Hand-knotted by Berber tribal weavers in the Atlas Mountains using 100% unbleached natural wool. Features plush 35mm pile and braided tassels.",
    "shortDescription": "Hand-knotted Atlas Mountains wool shag Berber rug.",
    "price": 5999,
    "compareAtPrice": 8499,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Artisan Decor & Dining",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Living",
    "sellerName": "Kyoto Ceramic Studio",
    "sellerInfo": "Traditional Ceramic Art and Natural Furnishings",
    "stock": 22,
    "lowStockThreshold": 5,
    "tags": [
      "Home & Living",
      "Artisan Decor & Dining",
      "VEXIVO Living",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 36,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "5 x 7 ft (150 x 210 cm)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Cream with Charcoal Diamond"
        ]
      }
    ]
  },
  {
    "name": "Ultrasonic Aromatherapy Essential Oil Diffuser in Matte Ceramic",
    "slug": "ultrasonic-aromatherapy-essential-oil-diffuser-in-matte-ceramic",
    "sku": "VEX-HOM-0470",
    "description": "Handcrafted ceramic cover with 300ml reservoir diffusing cool botanical mist for 10 hours. Warm ambient LED halo light with auto shut-off.",
    "shortDescription": "300ml matte ceramic ultrasonic essential oil diffuser.",
    "price": 1999,
    "compareAtPrice": 2899,
    "discount": 31,
    "images": [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Artisan Decor & Dining",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Living",
    "sellerName": "Kyoto Ceramic Studio",
    "sellerInfo": "Traditional Ceramic Art and Natural Furnishings",
    "stock": 60,
    "lowStockThreshold": 5,
    "tags": [
      "Home & Living",
      "Artisan Decor & Dining",
      "VEXIVO Living",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 44,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "300ml Tank Capacity"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Matte White Stone",
          "Terracotta Clay"
        ]
      }
    ]
  },
  {
    "name": "Mouth-Blown Ribbed Borosilicate Glass Carafe & Tumbler Set",
    "slug": "mouth-blown-ribbed-borosilicate-glass-carafe-tumbler-set",
    "sku": "VEX-HOM-0471",
    "description": "Hand-blown thermal shock resistant borosilicate glass with delicate vertical fluting. Bedside carafe with tumbler that nests as a lid.",
    "shortDescription": "Hand-blown fluted ribbed glass carafe and tumbler set.",
    "price": 1699,
    "compareAtPrice": 2499,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Artisan Decor & Dining",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Living",
    "sellerName": "Kyoto Ceramic Studio",
    "sellerInfo": "Traditional Ceramic Art and Natural Furnishings",
    "stock": 55,
    "lowStockThreshold": 5,
    "tags": [
      "Home & Living",
      "Artisan Decor & Dining",
      "VEXIVO Living",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 52,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "850ml Carafe + 250ml Tumbler"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Crystal Clear",
          "Smoky Amber"
        ]
      }
    ]
  },
  {
    "name": "Weighted Organic Cotton Calming Blanket 7kg with Glass Beads",
    "slug": "weighted-organic-cotton-calming-blanket-7kg-with-glass-beads",
    "sku": "VEX-HOM-0472",
    "description": "Distributes deep touch pressure to calm nervous system and promote restorative sleep. 100% breathable organic cotton with non-toxic glass beads.",
    "shortDescription": "7kg organic cotton sensory calming weighted blanket.",
    "price": 3699,
    "compareAtPrice": 5199,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Artisan Decor & Dining",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Living",
    "sellerName": "Kyoto Ceramic Studio",
    "sellerInfo": "Traditional Ceramic Art and Natural Furnishings",
    "stock": 40,
    "lowStockThreshold": 5,
    "tags": [
      "Home & Living",
      "Artisan Decor & Dining",
      "VEXIVO Living",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 60,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "150 x 200 cm (7 kg)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Slate Grey",
          "Cloud Blue"
        ]
      }
    ]
  },
  {
    "name": "Solid Brass Minimalist Taper Candle Holders Set of 3",
    "slug": "solid-brass-minimalist-taper-candle-holders-set-of-3",
    "sku": "VEX-HOM-0473",
    "description": "Turned from solid unlacquered heavy brass with tiered graduated heights (6\", 8\", 10\"). Develops an exquisite vintage patina with age.",
    "shortDescription": "Solid brass graduated height taper candle holders set.",
    "price": 1899,
    "compareAtPrice": 2699,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Artisan Decor & Dining",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Living",
    "sellerName": "Kyoto Ceramic Studio",
    "sellerInfo": "Traditional Ceramic Art and Natural Furnishings",
    "stock": 50,
    "lowStockThreshold": 5,
    "tags": [
      "Home & Living",
      "Artisan Decor & Dining",
      "VEXIVO Living",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.7,
    "numReviews": 68,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Set of 3 (15cm, 20cm, 25cm)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Polished Raw Brass"
        ]
      }
    ]
  },
  {
    "name": "Organic Bamboo Shredded Memory Foam Orthopedic Bed Pillow",
    "slug": "organic-bamboo-shredded-memory-foam-orthopedic-bed-pillow",
    "sku": "VEX-HOM-0474",
    "description": "Adjustable shredded gel memory foam fill allows you to add or remove stuffing for custom loft. Removable washable cooling bamboo jacquard cover.",
    "shortDescription": "Adjustable loft cooling bamboo shredded foam pillow.",
    "price": 1499,
    "compareAtPrice": 2199,
    "discount": 32,
    "images": [
      "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Artisan Decor & Dining",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Living",
    "sellerName": "Kyoto Ceramic Studio",
    "sellerInfo": "Traditional Ceramic Art and Natural Furnishings",
    "stock": 65,
    "lowStockThreshold": 5,
    "tags": [
      "Home & Living",
      "Artisan Decor & Dining",
      "VEXIVO Living",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": true,
    "specialOffer": false,
    "rating": 4.8,
    "numReviews": 76,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "Standard (50 x 75 cm)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Clean Bamboo White"
        ]
      }
    ]
  },
  {
    "name": "Modern Matte Black Arch Floor Reading Lamp with Brass Accents",
    "slug": "modern-matte-black-arch-floor-reading-lamp-with-brass-accents",
    "sku": "VEX-HOM-0475",
    "description": "Gracefully curved carbon steel arch extending over sofas and reading nooks. Weighted marble base prevents tipping, with foot step-switch.",
    "shortDescription": "Overarching matte black floor lamp with marble base.",
    "price": 3899,
    "compareAtPrice": 5499,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Artisan Decor & Dining",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Living",
    "sellerName": "Kyoto Ceramic Studio",
    "sellerInfo": "Traditional Ceramic Art and Natural Furnishings",
    "stock": 30,
    "lowStockThreshold": 5,
    "tags": [
      "Home & Living",
      "Artisan Decor & Dining",
      "VEXIVO Living",
      "Luxury",
      "VEXIVO"
    ],
    "featured": true,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.9,
    "numReviews": 84,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "165cm Height (35cm reach)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Matte Black & Antique Brass"
        ]
      }
    ]
  },
  {
    "name": "Natural Acacia Wood Rotating Lazy Susan Table Organizer",
    "slug": "natural-acacia-wood-rotating-lazy-susan-table-organizer",
    "sku": "VEX-HOM-0476",
    "description": "Solid organic acacia hardwood with deep natural grain variations. Smooth 360-degree steel ball bearing turntable with raised anti-spill rim.",
    "shortDescription": "Solid acacia wood 360-degree rotating turntable 30cm.",
    "price": 1399,
    "compareAtPrice": 1999,
    "discount": 30,
    "images": [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1597072689227-8882273e8f6a?auto=format&fit=crop&w=800&q=80"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Artisan Decor & Dining",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Living",
    "sellerName": "Kyoto Ceramic Studio",
    "sellerInfo": "Traditional Ceramic Art and Natural Furnishings",
    "stock": 70,
    "lowStockThreshold": 5,
    "tags": [
      "Home & Living",
      "Artisan Decor & Dining",
      "VEXIVO Living",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": true,
    "newArrival": false,
    "specialOffer": true,
    "rating": 4.5,
    "numReviews": 92,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "30cm Diameter (4cm rim)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "Rich Acacia Hardwood"
        ]
      }
    ]
  },
  {
    "name": "Hand-Poured Soy Wax Botanical Scented Candle with Wooden Wick",
    "slug": "hand-poured-soy-wax-botanical-scented-candle-with-wooden-wick",
    "sku": "VEX-HOM-0477",
    "description": "Clean-burning vegan soy and coconut wax infused with French lavender, sage, and white oak. Crackling wooden wick delivers 55 hours of burn time.",
    "shortDescription": "Botanical soy wax candle with crackling wooden wick.",
    "price": 1199,
    "compareAtPrice": 1699,
    "discount": 29,
    "images": [
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1597072689227-8882273e8f6a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80&sig=107"
    ],
    "thumbnail": "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
    "hoverImage": "https://images.unsplash.com/photo-1597072689227-8882273e8f6a?auto=format&fit=crop&w=800&q=80",
    "category": "Home & Living",
    "categorySlug": "home-living",
    "subcategory": "Artisan Decor & Dining",
    "collectionSlug": "bestsellers",
    "brand": "VEXIVO Living",
    "sellerName": "Kyoto Ceramic Studio",
    "sellerInfo": "Traditional Ceramic Art and Natural Furnishings",
    "stock": 80,
    "lowStockThreshold": 5,
    "tags": [
      "Home & Living",
      "Artisan Decor & Dining",
      "VEXIVO Living",
      "Luxury",
      "VEXIVO"
    ],
    "featured": false,
    "bestseller": false,
    "newArrival": false,
    "specialOffer": false,
    "rating": 4.6,
    "numReviews": 100,
    "status": "active",
    "options": [],
    "variants": [
      {
        "name": "Size",
        "options": [
          "250g Amber Glass Jar (55h burn)"
        ]
      },
      {
        "name": "Color",
        "options": [
          "French Lavender & Oak"
        ]
      }
    ]
  }
];
const collectionsData = [
  {
    "name": "Bestsellers",
    "slug": "bestsellers",
    "description": "Our most sought-after signature pieces, celebrated for craft and durability.",
    "image": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    "featured": true,
    "sortOrder": 1
  },
  {
    "name": "New Arrivals",
    "slug": "new-arrivals",
    "description": "Latest contemporary releases and fresh seasonal arrivals.",
    "image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    "featured": true,
    "sortOrder": 2
  },
  {
    "name": "Special Offers",
    "slug": "special-offers",
    "description": "Limited seasonal promotions and exceptional reductions.",
    "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    "featured": true,
    "sortOrder": 3
  },
  {
    "name": "Minimalist Luxury",
    "slug": "minimalist-luxury",
    "description": "Refined essentials crafted from uncompromised raw fibres.",
    "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    "featured": false,
    "sortOrder": 4
  }
];
const bannersData = [
  {
    "title": "Autumn Winter 2026 Collection",
    "subtitle": "MODERN MINIMALIST LUXURY",
    "description": "Explore the definitive new-season edit featuring Savile Row tailoring and architectural silhouettes.",
    "image": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85",
    "link": "/collection/new-arrivals",
    "buttonText": "Discover Collection",
    "type": "hero",
    "active": true,
    "order": 1
  },
  {
    "title": "Italian Nappa Footwear Capsule",
    "subtitle": "HANDCRAFTED IN TUSCANY",
    "description": "Minimalist low-top trainers and Chelsea boots constructed with Goodyear-welted precision.",
    "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=85",
    "link": "/category/shoes",
    "buttonText": "Shop Footwear",
    "type": "hero",
    "active": true,
    "order": 2
  },
  {
    "title": "Curated Architectural Living",
    "subtitle": "SCULPTURAL HOME OBJECTS",
    "description": "Elevate your private sanctuary with travertine stone lighting, hand-knotted wool rugs, and minimalist furniture.",
    "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85",
    "link": "/category/home-living",
    "buttonText": "Explore Living",
    "type": "hero",
    "active": true,
    "order": 3
  }
];
const couponsData = [
  {
    "code": "VEX10",
    "type": "percentage",
    "value": 10,
    "minimumOrder": 999,
    "maximumDiscount": 500,
    "usageLimit": 1000,
    "active": true
  },
  {
    "code": "WELCOME20",
    "type": "percentage",
    "value": 20,
    "minimumOrder": 1499,
    "maximumDiscount": 1000,
    "usageLimit": 500,
    "active": true
  },
  {
    "code": "FREESHIP",
    "type": "fixed",
    "value": 99,
    "minimumOrder": 499,
    "maximumDiscount": 99,
    "usageLimit": 2000,
    "active": true
  },
  {
    "code": "AUTUMN30",
    "type": "percentage",
    "value": 30,
    "minimumOrder": 1999,
    "maximumDiscount": 1500,
    "usageLimit": 2000,
    "active": true
  }
];

const seedAll = async () => {
  try {
    console.log('[VEXIVO Seed] Purging existing database collections...');
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Collection.deleteMany(),
      Banner.deleteMany(),
      Coupon.deleteMany(),
      Review.deleteMany(),
    ]);

    console.log('[VEXIVO Seed] Collections cleared. Seeding fresh VEXIVO catalog with 308 products...');

    // 1. Seed Users
    const adminUser = await User.create({
      name: 'VEXIVO Administrator',
      email: 'admin@vexivo.com',
      passwordHash: 'AdminPass123!',
      role: 'admin',
      phone: '+919999999999',
    });

    const customerUser = await User.create({
      name: 'Arpit Customer',
      email: 'arpit123@gmail.com',
      passwordHash: 'Arpit123!',
      role: 'customer',
      phone: '+919876543210',
      addresses: [
        {
          fullName: 'Arpit Sharma',
          phone: '+919876543210',
          street: 'Flat 402, Royal Palms, Malviya Nagar',
          city: 'Jaipur',
          state: 'Rajasthan',
          postalCode: '302017',
          landmark: 'Near World Trade Park (WTP)',
          country: 'India',
          addressType: 'Home',
          isDefault: true,
        },
        {
          fullName: 'Arpit Sharma (Work)',
          phone: '+919876543210',
          street: 'Tower B, 7th Floor, DLF Cyber City',
          city: 'Gurugram',
          state: 'Haryana',
          postalCode: '122002',
          landmark: 'Opposite Cyber Hub Metro',
          country: 'India',
          addressType: 'Work',
          isDefault: false,
        },
      ],
    });
    console.log('[VEXIVO Seed] Seeded Admin & Customer accounts.');

    // 2. Seed Categories
    const categories = await Category.insertMany(categoriesData);
    console.log(`[VEXIVO Seed] Seeded ${categories.length} categories.`);

    // 3. Seed Products with seller reference
    const productsToInsert = rawProducts.map((p, idx) => ({
      ...p,
      seller: idx % 4 === 0 ? adminUser._id : customerUser._id,
    }));

    const products = await Product.insertMany(productsToInsert);
    console.log(`[VEXIVO Seed] Seeded ${products.length} distinct multi-seller products.`);

    // 4. Seed Collections
    await Collection.insertMany(collectionsData);
    console.log('[VEXIVO Seed] Seeded 4 collections.');

    // 5. Seed Banners
    await Banner.insertMany(bannersData);
    console.log('[VEXIVO Seed] Seeded Hero & Promotional Banners.');

    // 6. Seed Coupons
    await Coupon.insertMany(couponsData);
    console.log('[VEXIVO Seed] Seeded discount coupons (AUTUMN30, VEX10, WELCOME20, FREESHIP).');

    // 7. Seed Sample Reviews
    const sampleReviews = [
      {
        product: products[0]._id,
        user: customerUser._id,
        userName: 'Julie Mathers',
        userEmail: 'julie.m@example.com',
        rating: 5,
        title: 'Exquisite silk drape and flawless finish',
        comment: 'The French silk bias cut falls like water. Worth every penny. Exceptional craftsmanship and timeless silhouette.',
        verifiedPurchase: true,
        status: 'approved',
      },
      {
        product: products[22]._id,
        user: customerUser._id,
        userName: 'Jenny Wilson',
        userEmail: 'jenny.w@example.com',
        rating: 5,
        title: 'Authentic Savile Row tailoring standards',
        comment: 'Incredible texture, double-pleat precision, and luxurious weight. Fits impeccably.',
        verifiedPurchase: true,
        status: 'approved',
      },
      {
        product: products[44]._id,
        user: customerUser._id,
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
    console.log(`📦 Total Products Seeded: ${products.length}`);
    console.log(`🏷️  Categories Seeded: ${categories.length}`);
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
  // Connect to DB and run seed
  const dotenv = require('dotenv');
  dotenv.config({ path: path.join(__dirname, '../.env') });
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vexivo';
  mongoose.connect(uri)
    .then(() => seedAll())
    .catch((err) => {
      console.error('Failed to connect to database:', err);
      process.exit(1);
    });
}

module.exports = { seedAll };
