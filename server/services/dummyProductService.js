const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const Category = require('../models/Category');

const dummyProductsPath = path.join(
  __dirname,
  '../data/dummy-products.json'
);

const createSlug = (text) => {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const categoryMapping = {
  // --- Women Fashion ---
  'womens-dresses': {
    category: 'womens-dresses',
    categorySlug: 'womens-dresses',
    gender: 'women',
    subcategory: 'dresses',
    collectionSlug: 'women-dresses',
    displayName: "Women's Dresses",
    parentCategory: 'Women Wear',
    categoryIcon: 'Sparkles',
  },
  'womens-shoes': {
    category: 'womens-shoes',
    categorySlug: 'womens-shoes',
    gender: 'women',
    subcategory: 'shoes',
    collectionSlug: 'women-shoes',
    displayName: "Women's Shoes & Heels",
    parentCategory: 'Women Wear',
    categoryIcon: 'Footprints',
  },
  'womens-bags': {
    category: 'womens-bags',
    categorySlug: 'womens-bags',
    gender: 'women',
    subcategory: 'bags',
    collectionSlug: 'women-bags',
    displayName: "Women's Bags & Luggage",
    parentCategory: 'Women Wear',
    categoryIcon: 'ShoppingBag',
  },
  'womens-jewellery': {
    category: 'womens-jewellery',
    categorySlug: 'womens-jewellery',
    gender: 'women',
    subcategory: 'jewellery',
    collectionSlug: 'women-jewellery',
    displayName: "Women's Fine Jewellery",
    parentCategory: 'Women Wear',
    categoryIcon: 'Gem',
  },
  'womens-watches': {
    category: 'womens-watches',
    categorySlug: 'womens-watches',
    gender: 'women',
    subcategory: 'watches',
    collectionSlug: 'women-watches',
    displayName: "Women's Luxury Watches",
    parentCategory: 'Women Wear',
    categoryIcon: 'Watch',
  },
  tops: {
    category: 'tops',
    categorySlug: 'tops',
    gender: 'women',
    subcategory: 'tops',
    collectionSlug: 'women-tops',
    displayName: "Women's Tops & Shirts",
    parentCategory: 'Women Wear',
    categoryIcon: 'Sparkles',
  },

  // --- Men Fashion ---
  'mens-shirts': {
    category: 'mens-shirts',
    categorySlug: 'mens-shirts',
    gender: 'men',
    subcategory: 'shirts',
    collectionSlug: 'men-shirts',
    displayName: "Men's Shirts",
    parentCategory: 'Men Wear',
    categoryIcon: 'User',
  },
  'mens-shoes': {
    category: 'mens-shoes',
    categorySlug: 'mens-shoes',
    gender: 'men',
    subcategory: 'shoes',
    collectionSlug: 'men-shoes',
    displayName: "Men's Shoes",
    parentCategory: 'Men Wear',
    categoryIcon: 'Footprints',
  },
  'mens-watches': {
    category: 'mens-watches',
    categorySlug: 'mens-watches',
    gender: 'men',
    subcategory: 'watches',
    collectionSlug: 'men-watches',
    displayName: "Men's Watches",
    parentCategory: 'Men Wear',
    categoryIcon: 'Watch',
  },

  // --- Non-Fashion / General Categories ---
  beauty: {
    category: 'beauty',
    categorySlug: 'beauty',
    gender: 'unisex',
    subcategory: 'beauty',
    collectionSlug: 'beauty',
    displayName: 'Beauty & Cosmetics',
    parentCategory: 'Beauty',
    categoryIcon: 'Heart',
  },
  fragrances: {
    category: 'fragrances',
    categorySlug: 'fragrances',
    gender: 'unisex',
    subcategory: 'fragrances',
    collectionSlug: 'fragrances',
    displayName: 'Fragrances & Perfumes',
    parentCategory: 'Beauty',
    categoryIcon: 'Sparkles',
  },
  'skin-care': {
    category: 'skin-care',
    categorySlug: 'skin-care',
    gender: 'unisex',
    subcategory: 'skin-care',
    collectionSlug: 'skin-care',
    displayName: 'Skincare & Elixirs',
    parentCategory: 'Beauty',
    categoryIcon: 'Heart',
  },
  sunglasses: {
    category: 'sunglasses',
    categorySlug: 'sunglasses',
    gender: 'unisex',
    subcategory: 'sunglasses',
    collectionSlug: 'sunglasses',
    displayName: 'Sunglasses & Eyewear',
    parentCategory: 'Vision Care',
    categoryIcon: 'Eye',
  },
  furniture: {
    category: 'furniture',
    categorySlug: 'furniture',
    gender: 'unisex',
    subcategory: 'furniture',
    collectionSlug: 'furniture',
    displayName: 'Furniture & Living',
    parentCategory: 'Home & Living',
    categoryIcon: 'Home',
  },
  'home-decoration': {
    category: 'home-decoration',
    categorySlug: 'home-decoration',
    gender: 'unisex',
    subcategory: 'home-decoration',
    collectionSlug: 'home-decoration',
    displayName: 'Home Decoration & Accents',
    parentCategory: 'Home & Living',
    categoryIcon: 'Home',
  },
  'kitchen-accessories': {
    category: 'kitchen-accessories',
    categorySlug: 'kitchen-accessories',
    gender: 'unisex',
    subcategory: 'kitchen-accessories',
    collectionSlug: 'kitchen-accessories',
    displayName: 'Kitchen & Dining',
    parentCategory: 'Home & Living',
    categoryIcon: 'Utensils',
  },
  groceries: {
    category: 'groceries',
    categorySlug: 'groceries',
    gender: 'unisex',
    subcategory: 'groceries',
    collectionSlug: 'groceries',
    displayName: 'Groceries & Gourmet',
    parentCategory: 'Groceries',
    categoryIcon: 'ShoppingBag',
  },
  laptops: {
    category: 'laptops',
    categorySlug: 'laptops',
    gender: 'unisex',
    subcategory: 'laptops',
    collectionSlug: 'laptops',
    displayName: 'Laptops & Computers',
    parentCategory: 'Electronics',
    categoryIcon: 'Laptop',
  },
  smartphones: {
    category: 'smartphones',
    categorySlug: 'smartphones',
    gender: 'unisex',
    subcategory: 'smartphones',
    collectionSlug: 'smartphones',
    displayName: 'Smartphones',
    parentCategory: 'Electronics',
    categoryIcon: 'Smartphone',
  },
  tablets: {
    category: 'tablets',
    categorySlug: 'tablets',
    gender: 'unisex',
    subcategory: 'tablets',
    collectionSlug: 'tablets',
    displayName: 'Tablets & E-Readers',
    parentCategory: 'Electronics',
    categoryIcon: 'Tablet',
  },
  'mobile-accessories': {
    category: 'mobile-accessories',
    categorySlug: 'mobile-accessories',
    gender: 'unisex',
    subcategory: 'mobile-accessories',
    collectionSlug: 'mobile-accessories',
    displayName: 'Mobile Accessories',
    parentCategory: 'Electronics',
    categoryIcon: 'Headphones',
  },
  'sports-accessories': {
    category: 'sports-accessories',
    categorySlug: 'sports-accessories',
    gender: 'unisex',
    subcategory: 'sports-accessories',
    collectionSlug: 'sports-accessories',
    displayName: 'Sports & Fitness Accessories',
    parentCategory: 'Health & Fitness',
    categoryIcon: 'Activity',
  },
  motorcycle: {
    category: 'motorcycle',
    categorySlug: 'motorcycle',
    gender: 'unisex',
    subcategory: 'motorcycle',
    collectionSlug: 'motorcycle',
    displayName: 'Motorcycles & Riding Gear',
    parentCategory: 'Automotive',
    categoryIcon: 'Gauge',
  },
  vehicle: {
    category: 'vehicle',
    categorySlug: 'vehicle',
    gender: 'unisex',
    subcategory: 'vehicle',
    collectionSlug: 'vehicle',
    displayName: 'Vehicles & Automotive',
    parentCategory: 'Automotive',
    categoryIcon: 'Car',
  },
};

const getCategoryInfo = (rawCategory) => {
  if (categoryMapping[rawCategory]) {
    return categoryMapping[rawCategory];
  }
  const slug = createSlug(rawCategory);
  return {
    category: rawCategory,
    categorySlug: slug,
    gender: 'unisex',
    subcategory: rawCategory,
    collectionSlug: slug,
    displayName: rawCategory
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' '),
    parentCategory: 'General',
    categoryIcon: 'Tag',
  };
};

const getDummyProducts = () => {
  if (!fs.existsSync(dummyProductsPath)) {
    throw new Error('dummy-products.json not found');
  }

  const data = JSON.parse(
    fs.readFileSync(dummyProductsPath, 'utf-8')
  );

  return data.products || (Array.isArray(data) ? data : []);
};

const mapProduct = (product) => {
  const categoryInfo = getCategoryInfo(product.category);

  const discount = Number(product.discountPercentage || 0);
  let compareAtPrice = Number(product.price || 0);

  if (discount > 0 && discount < 100) {
    compareAtPrice = Math.round(product.price / (1 - discount / 100));
  }

  const primaryImage = product.thumbnail || (product.images?.[0] || '');
  const hoverImage = product.images?.[1] || product.images?.[0] || primaryImage;

  return {
    name: product.title,
    slug: `dummy-${categoryInfo.gender}-${product.id}-${createSlug(product.title)}`,
    sku: product.sku || `DUMMY-${product.id}`,
    description: product.description || product.title,
    shortDescription: product.description ? product.description.substring(0, 150) : '',
    price: Number(product.price || 0),
    compareAtPrice,
    discount,
    images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [primaryImage].filter(Boolean),
    thumbnail: primaryImage,
    hoverImage: hoverImage,
    category: categoryInfo.category,
    categorySlug: categoryInfo.categorySlug,
    subcategory: categoryInfo.subcategory,
    collectionSlug: categoryInfo.collectionSlug,
    gender: categoryInfo.gender,
    source: 'dummyjson',
    sourceProductId: product.id,
    brand: product.brand || 'VEXIVO',
    sellerName: 'VEXIVO Official',
    sellerInfo: 'DummyJSON Verified Catalog',
    stock: Number(product.stock || 0),
    lowStockThreshold: 5,
    tags: [
      ...(Array.isArray(product.tags) ? product.tags : []),
      product.category,
      categoryInfo.category,
      categoryInfo.categorySlug,
      categoryInfo.subcategory,
      categoryInfo.collectionSlug,
      categoryInfo.gender,
    ].filter(Boolean),
    featured: false,
    bestseller: false,
    newArrival: true,
    specialOffer: discount > 0,
    rating: Number(product.rating || 0),
    numReviews: Array.isArray(product.reviews) ? product.reviews.length : 0,
    status: 'active',
    seoTitle: `${product.title} | VEXIVO Luxury Catalog`,
    seoDescription: product.description || '',
  };
};

const syncCategoriesInDB = async (products) => {
  try {
    const categoryCounts = {};
    const categoryImages = {};

    for (const p of products) {
      const cat = p.category;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      if (!categoryImages[cat]) {
        categoryImages[cat] = p.thumbnail || p.images?.[0] || '';
      }
    }

    for (const [catName, count] of Object.entries(categoryCounts)) {
      const info = getCategoryInfo(catName);
      const existing = await Category.findOne({ slug: info.categorySlug });
      if (existing) {
        existing.itemCount = count;
        if (!existing.image && categoryImages[catName]) {
          existing.image = categoryImages[catName];
        }
        await existing.save();
      } else {
        await Category.create({
          name: info.displayName,
          slug: info.categorySlug,
          description: `Explore premium ${info.displayName} curated for quality and durability.`,
          image: categoryImages[catName] || '',
          icon: info.categoryIcon || 'Tag',
          itemCount: count,
          parentCategory: info.parentCategory || '',
          status: 'active',
          sortOrder: 10,
        });
      }
    }
  } catch (err) {
    console.warn('[DummyProductService] Category sync notice:', err.message);
  }
};

const importDummyProducts = async () => {
  const products = getDummyProducts();

  let imported = 0;
  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const mappedProduct = mapProduct(product);

    if (!mappedProduct) {
      skipped++;
      continue;
    }

    const existingProduct = await Product.findOne({
      source: 'dummyjson',
      sourceProductId: product.id,
    });

    if (existingProduct) {
      Object.assign(existingProduct, mappedProduct);
      await existingProduct.save();
      updated++;
    } else {
      await Product.create(mappedProduct);
      imported++;
    }
  }

  // Also synchronize category metadata
  await syncCategoriesInDB(products);

  return {
    totalProducts: products.length,
    imported,
    updated,
    skipped,
  };
};

const getDummyCategorySummary = async () => {
  const summary = await Product.aggregate([
    { $match: { source: 'dummyjson' } },
    {
      $group: {
        _id: '$category',
        categorySlug: { $first: '$categorySlug' },
        gender: { $first: '$gender' },
        subcategory: { $first: '$subcategory' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return summary;
};

module.exports = {
  categoryMapping,
  getCategoryInfo,
  getDummyProducts,
  mapProduct,
  importDummyProducts,
  getDummyCategorySummary,
};