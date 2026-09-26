const Collection = require('../models/Collection');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// @desc Get all collections
// @route GET /api/collections
const getCollections = async (req, res, next) => {
  try {
    const collections = await Collection.find({ status: 'active' })
      .populate('products')
      .sort({ sortOrder: 1 });
    res.json({ success: true, count: collections.length, collections });
  } catch (error) {
    next(error);
  }
};

// @desc Get collection by slug
// @route GET /api/collections/:slug
const getCollectionBySlug = async (req, res, next) => {
  try {
    const rawSlug = (req.params.slug || '').toLowerCase().trim();
    let collection = await Collection.findOne({ slug: rawSlug }).populate('products');

    // If not found directly, check aliases
    if (!collection) {
      if (rawSlug === 'trending' || rawSlug === 'popular' || rawSlug === 'best-sellers') {
        collection = await Collection.findOne({ slug: 'bestsellers' }).populate('products');
      }
    }

    // If still not found, dynamically assemble a curated collection from products
    if (!collection) {
      const Product = require('../models/Product');
      let products = await Product.find({
        $or: [
          { collectionSlug: rawSlug },
          { tags: { $regex: rawSlug, $options: 'i' } },
          { categorySlug: rawSlug },
          ...(rawSlug === 'trending' || rawSlug === 'bestsellers' ? [{ bestseller: true }, { featured: true }] : [])
        ],
        status: 'active',
      }).limit(24);

      if (!products || products.length === 0) {
        products = await Product.find({ status: 'active' }).sort({ rating: -1, numReviews: -1 }).limit(16);
      }

      const formattedName = rawSlug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      collection = {
        _id: 'dyn-' + rawSlug,
        name: formattedName ? `${formattedName} Collection` : 'Featured Collection',
        slug: rawSlug,
        description: `Explore our handpicked ${formattedName || 'trending'} selections curated for modern luxury and lifestyle.`,
        products: products || [],
        featured: true,
      };
    }

    res.json({ success: true, collection });
  } catch (error) {
    next(error);
  }
};

// @desc Create collection (Admin)
// @route POST /api/collections
const createCollection = async (req, res, next) => {
  try {
    const { name, description, image, products, featured, sortOrder } = req.body;
    const slug = slugify(name);

    const exists = await Collection.findOne({ slug });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Collection already exists' });
    }

    const collection = await Collection.create({
      name,
      slug,
      description,
      image,
      products: products || [],
      featured: Boolean(featured),
      sortOrder: sortOrder || 0,
    });

    res.status(201).json({ success: true, collection });
  } catch (error) {
    next(error);
  }
};

// @desc Update collection (Admin)
// @route PUT /api/collections/:id
const updateCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }

    Object.assign(collection, req.body);
    const updated = await collection.save();

    res.json({ success: true, collection: updated });
  } catch (error) {
    next(error);
  }
};

// @desc Delete collection (Admin)
// @route DELETE /api/collections/:id
const deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    await Collection.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Collection deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
};
