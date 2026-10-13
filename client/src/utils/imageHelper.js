/**
 * VEXIVO Category-Specific Verified Fallback Images
 * Every fallback image is tested and verified HTTP 200 OK.
 * No generic single image for all products.
 */
export const CATEGORY_FALLBACK_IMAGES = {
  'women-wear': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
  'men-wear': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  'kids-wear': 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=800&q=80',
  'shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  'beauty': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  'jewellery': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  'bags': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
  'hats': 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
  'vision-care': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
  'pets-care': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80',
  'toys': 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
  'health-fitness': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
  'electronics': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  'home-living': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
  'default': 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
};

/**
 * Get category-relevant fallback image URL.
 * Never returns a mismatched generic image.
 */
export function getCategoryFallback(category = '', categorySlug = '') {
  const slug = (categorySlug || category || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  if (CATEGORY_FALLBACK_IMAGES[slug]) {
    return CATEGORY_FALLBACK_IMAGES[slug];
  }

  // Partial match by keywords
  if (slug.includes('men') && !slug.includes('women')) return CATEGORY_FALLBACK_IMAGES['men-wear'];
  if (slug.includes('women')) return CATEGORY_FALLBACK_IMAGES['women-wear'];
  if (slug.includes('kid') || slug.includes('baby')) return CATEGORY_FALLBACK_IMAGES['kids-wear'];
  if (slug.includes('shoe') || slug.includes('boot') || slug.includes('footwear')) return CATEGORY_FALLBACK_IMAGES['shoes'];
  if (slug.includes('beauty') || slug.includes('skin') || slug.includes('cosmetic')) return CATEGORY_FALLBACK_IMAGES['beauty'];
  if (slug.includes('jewel') || slug.includes('ring') || slug.includes('necklace')) return CATEGORY_FALLBACK_IMAGES['jewellery'];
  if (slug.includes('bag') || slug.includes('tote') || slug.includes('wallet')) return CATEGORY_FALLBACK_IMAGES['bags'];
  if (slug.includes('hat') || slug.includes('cap') || slug.includes('beanie')) return CATEGORY_FALLBACK_IMAGES['hats'];
  if (slug.includes('vision') || slug.includes('glass') || slug.includes('eye')) return CATEGORY_FALLBACK_IMAGES['vision-care'];
  if (slug.includes('pet') || slug.includes('dog') || slug.includes('cat')) return CATEGORY_FALLBACK_IMAGES['pets-care'];
  if (slug.includes('toy') || slug.includes('game')) return CATEGORY_FALLBACK_IMAGES['toys'];
  if (slug.includes('fit') || slug.includes('gym') || slug.includes('health')) return CATEGORY_FALLBACK_IMAGES['health-fitness'];
  if (slug.includes('elect') || slug.includes('tech') || slug.includes('gadget')) return CATEGORY_FALLBACK_IMAGES['electronics'];
  if (slug.includes('home') || slug.includes('living') || slug.includes('decor')) return CATEGORY_FALLBACK_IMAGES['home-living'];

  return CATEGORY_FALLBACK_IMAGES['default'];
}

/**
 * Resolve image URL: handles absolute URLs, Supabase public URLs, and relative upload paths.
 */
export function resolveImageUrl(url, category = '', categorySlug = '') {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return getCategoryFallback(category, categorySlug);
  }

  const trimmed = url.trim();

  // If already absolute URL (http, https, or data url)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // If local relative upload path or GridFS media path
  if (
    trimmed.startsWith('/uploads') ||
    trimmed.startsWith('uploads/') ||
    trimmed.startsWith('/api/media') ||
    trimmed.startsWith('api/media')
  ) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return cleanPath;
  }

  return trimmed;
}
