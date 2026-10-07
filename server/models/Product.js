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
    hoverImage: { type: String, default: '' },
    videos: [{ type: String }],
    media: [
      {
        type: { type: String, enum: ['image', 'video'], default: 'image' },
        url: { type: String, required: true },
        storagePath: { type: String, default: '' },
        filename: { type: String, default: '' },
        mimeType: { type: String, default: '' },
        size: { type: Number, default: 0 },
        displayOrder: { type: Number, default: 0 },
        isPrimary: { type: Boolean, default: false },
        thumbnailUrl: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    category: { type: String, required: true },
    categorySlug: { type: String, default: '' },
    subcategory: { type: String, default: '' },
    collectionSlug: { type: String, default: '' },
    brand: { type: String, default: 'VEXIVO' },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    sellerName: { type: String, default: 'VEXIVO Official' },
    sellerInfo: { type: String, default: '' },
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
    status: { type: String, enum: ['active', 'draft', 'archived', 'discontinued'], default: 'active' },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
  },
  { timestamps: true }
);

// Calculate discount percentage & sync media before save
productSchema.pre('save', function (next) {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    this.discount = Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  } else {
    this.discount = 0;
  }

  // Ensure media array is initialized
  if (!this.media) this.media = [];

  // Sync images array to media if media is empty
  if ((!this.media || this.media.length === 0) && this.images && this.images.length > 0) {
    this.media = this.images.map((img, idx) => ({
      type: 'image',
      url: img,
      displayOrder: idx,
      isPrimary: idx === 0,
    }));
  }

  // Sync videos array to media if any videos missing from media
  if (this.videos && this.videos.length > 0) {
    for (let i = 0; i < this.videos.length; i++) {
      const vidUrl = this.videos[i];
      if (vidUrl && !this.media.some((m) => m.url === vidUrl)) {
        this.media.push({
          type: 'video',
          url: vidUrl,
          displayOrder: (this.media.length || 0) + i,
          isPrimary: false,
        });
      }
    }
  }

  // Sync media items back to images and videos arrays
  if (this.media && this.media.length > 0) {
    const mediaImages = this.media.filter((m) => m.type === 'image').map((m) => m.url);
    const mediaVideos = this.media.filter((m) => m.type === 'video').map((m) => m.url);

    if (mediaImages.length > 0) {
      this.images = Array.from(new Set([...(this.images || []), ...mediaImages]));
    }
    if (mediaVideos.length > 0) {
      this.videos = Array.from(new Set([...(this.videos || []), ...mediaVideos]));
    }
  }

  if (!this.thumbnail && this.images && this.images.length > 0) {
    this.thumbnail = this.images[0];
  }
  if (!this.hoverImage && this.images && this.images.length > 1) {
    this.hoverImage = this.images[1];
  }
  next();
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
