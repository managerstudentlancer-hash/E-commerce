const Product = require('../models/Product');
const Category = require('../models/Category');

const escapeRegex = (str = '') => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc Unified search & autocomplete
// @route GET /api/search
const search = async (req, res, next) => {
  try {
    const { q = '', category = '' } = req.query;
    const queryStr = q.trim();
    const categoryStr = category.trim();

    if (!queryStr && (!categoryStr || categoryStr === 'All Categories')) {
      // Return popular categories and trending suggestions
      const categories = await Category.find({ status: 'active' }).limit(6).select('name slug');
      const popularProducts = await Product.find({ status: 'active', bestseller: true })
        .limit(8)
        .select('name slug price compareAtPrice thumbnail category');

      return res.json({
        success: true,
        query: '',
        suggestions: ['Leather Bags', 'Wireless Earbuds', 'Smart Watches', 'Cashmere Sweaters', 'Minimalist Jewellery'],
        categories,
        products: popularProducts,
      });
    }

    const andConditions = [{ status: 'active' }];

    if (queryStr) {
      const safeQuery = escapeRegex(queryStr);
      const regex = new RegExp(safeQuery, 'i');
      andConditions.push({
        $or: [
          { name: regex },
          { description: regex },
          { tags: regex },
          { brand: regex },
          { category: regex },
          { subcategory: regex },
          { sku: regex },
        ],
      });
    }

    if (categoryStr && categoryStr !== 'All Categories') {
      const safeCat = escapeRegex(categoryStr);
      const catRegex = new RegExp(safeCat, 'i');
      const catSlug = categoryStr.toLowerCase().replace(/\s+/g, '-');
      andConditions.push({
        $or: [
          { category: catRegex },
          { categorySlug: catSlug },
          { subcategory: catRegex },
        ],
      });
    }

    const products = await Product.find({ $and: andConditions })
      .limit(24)
      .select('name slug price compareAtPrice thumbnail category discount rating sku');

    let catQuery = { status: 'active' };
    if (categoryStr && categoryStr !== 'All Categories') {
      const safeCat = escapeRegex(categoryStr);
      catQuery.$or = [
        { name: new RegExp(safeCat, 'i') },
        { slug: categoryStr.toLowerCase().replace(/\s+/g, '-') },
      ];
    } else if (queryStr) {
      const safeQuery = escapeRegex(queryStr);
      const regex = new RegExp(safeQuery, 'i');
      catQuery.$or = [{ name: regex }, { description: regex }];
    }

    const categories = await Category.find(catQuery)
      .limit(6)
      .select('name slug image');

    // Extract autocomplete keyword suggestions
    const suggestions = Array.from(
      new Set(
        products
          .map((p) => p.name)
          .concat(categories.map((c) => c.name))
      )
    ).slice(0, 5);

    res.json({
      success: true,
      query: queryStr,
      category: categoryStr,
      count: products.length,
      suggestions,
      categories,
      products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { search };
