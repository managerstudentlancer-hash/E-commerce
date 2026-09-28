const Product = require('../models/Product');
const Category = require('../models/Category');

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
      const regex = new RegExp(queryStr, 'i');
      andConditions.push({
        $or: [{ name: regex }, { description: regex }, { tags: regex }, { brand: regex }, { category: regex }],
      });
    }

    if (categoryStr && categoryStr !== 'All Categories') {
      const catRegex = new RegExp(categoryStr, 'i');
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
      .select('name slug price compareAtPrice thumbnail category discount rating');

    let catQuery = { status: 'active' };
    if (categoryStr && categoryStr !== 'All Categories') {
      catQuery.$or = [
        { name: new RegExp(categoryStr, 'i') },
        { slug: categoryStr.toLowerCase().replace(/\s+/g, '-') },
      ];
    } else if (queryStr) {
      const regex = new RegExp(queryStr, 'i');
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
