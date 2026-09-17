const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc Unified search & autocomplete
// @route GET /api/search
const search = async (req, res, next) => {
  try {
    const { q = '' } = req.query;
    const queryStr = q.trim();

    if (!queryStr) {
      // Return popular categories and trending suggestions
      const categories = await Category.find({ status: 'active' }).limit(6).select('name slug');
      const popularProducts = await Product.find({ status: 'active', bestseller: true })
        .limit(4)
        .select('name slug price compareAtPrice thumbnail category');

      return res.json({
        success: true,
        query: '',
        suggestions: ['Leather Bags', 'Wireless Earbuds', 'Smart Watches', 'Cashmere Sweaters', 'Minimalist Jewellery'],
        categories,
        products: popularProducts,
      });
    }

    const regex = new RegExp(queryStr, 'i');

    const products = await Product.find({
      $or: [{ name: regex }, { description: regex }, { tags: regex }, { brand: regex }],
      status: 'active',
    })
      .limit(8)
      .select('name slug price compareAtPrice thumbnail category discount rating');

    const categories = await Category.find({
      $or: [{ name: regex }, { description: regex }],
      status: 'active',
    })
      .limit(4)
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
