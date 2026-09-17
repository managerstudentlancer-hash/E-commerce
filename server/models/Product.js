const mongoose = require('mongoose');

const variantOptionSchema = new mongoose.Schema({
  size: { type: String, default: '' },
  color: { type: String, default: '' },
  sku: { type: String, default: '' },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  image: { type: String, default: '' },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, default: '' },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    images: [{ type: String }],
    thumbnail: { type: String, default: '' },
    category: { type: String, required: true },
    categorySlug: { type: String, default: '' },
    subcategory: { type: String, default: '' },
    collectionSlug: { type: String, default: '' },
    brand: { type: String, default: 'VEXIVO' },
    variants: [
      {
        name: { type: String },
        options: [{ type: String }],
      },
    ],
    options: [variantOptionSchema],
    stock: { type: Number, default: 50 },
    lowStockThreshold: { type: Number, default: 5 },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    bestseller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    specialOffer: { type: Boolean, default: false },
    rating: { type: Number, default: 4.8 },
    numReviews: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
  },
  { timestamps: true }
);

// Calculate discount percentage before save
productSchema.pre('save', function (next) {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    this.discount = Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  } else {
    this.discount = 0;
  }
  if (!this.thumbnail && this.images && this.images.length > 0) {
    this.thumbnail = this.images[0];
  }
  next();
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
