/**
 * Category & Product Size Intelligence Helper
 * Automatically analyzes product metadata (category, subcategory, tags, name)
 * to determine available size variants, size guide measurements, and default selections.
 */

export const analyzeProductSizes = (product) => {
  if (!product) {
    return {
      sizes: ['Standard / Free Size'],
      label: 'Size',
      categoryType: 'standard',
      hasSizeGuide: false,
      defaultSize: 'Standard / Free Size',
      guideHeaders: [],
      guideRows: [],
    };
  }

  // 1. If explicit variants are configured on product
  if (product.variants && Array.isArray(product.variants) && product.variants.length > 0) {
    const sizeVariant = product.variants.find(
      (v) =>
        v.name?.toLowerCase().includes('size') ||
        v.name?.toLowerCase().includes('fit') ||
        v.name?.toLowerCase().includes('dimension')
    ) || product.variants[0];

    if (sizeVariant && sizeVariant.options && sizeVariant.options.length > 0) {
      return {
        sizes: sizeVariant.options,
        label: sizeVariant.name || 'Select Size',
        categoryType: 'custom',
        hasSizeGuide: true,
        defaultSize: sizeVariant.options[0],
        guideHeaders: ['Size', 'Fit / Dimension', 'Recommended Standard'],
        guideRows: sizeVariant.options.map((opt) => ({
          col1: opt,
          col2: 'Standard Comfort Fit',
          col3: 'True to size',
        })),
      };
    }
  }

  // 2. Intelligent Category Keyword Analysis
  const searchCorpus = [
    product.category || '',
    product.categorySlug || '',
    product.subcategory || '',
    product.name || '',
    ...(Array.isArray(product.tags) ? product.tags : []),
  ]
    .join(' ')
    .toLowerCase();

  // A. Footwear / Shoes
  const isFootwear =
    /\b(footwear|shoes?|sneakers?|boots?|heels?|loafers?|sandals?|slides?|slippers?|brogues?|oxford)\b/i.test(
      searchCorpus
    );
  if (isFootwear) {
    return {
      sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
      label: 'Select Shoe Size (UK / IND)',
      categoryType: 'shoes',
      hasSizeGuide: true,
      defaultSize: 'UK 8',
      guideHeaders: ['UK / IND', 'EU Size', 'US Men', 'Foot Length (cm)'],
      guideRows: [
        { col1: 'UK 6', col2: 'EU 40', col3: 'US 7', col4: '25.0 cm' },
        { col1: 'UK 7', col2: 'EU 41', col3: 'US 8', col4: '25.7 cm' },
        { col1: 'UK 8', col2: 'EU 42', col3: 'US 9', col4: '26.5 cm' },
        { col1: 'UK 9', col2: 'EU 43', col3: 'US 10', col4: '27.3 cm' },
        { col1: 'UK 10', col2: 'EU 44.5', col3: 'US 11', col4: '28.0 cm' },
        { col1: 'UK 11', col2: 'EU 46', col3: 'US 12', col4: '28.8 cm' },
      ],
    };
  }

  // B. Bottomwear / Jeans / Pants / Trousers / Shorts
  const isBottomwear =
    /\b(jeans?|denim|trousers?|pants?|chinos?|shorts?|joggers?|cargos?|leggings?|skirt)\b/i.test(
      searchCorpus
    );
  if (isBottomwear) {
    return {
      sizes: ['28', '30', '32', '34', '36', '38'],
      label: 'Select Waist Size (Inches)',
      categoryType: 'bottoms',
      hasSizeGuide: true,
      defaultSize: '32',
      guideHeaders: ['Waist (in)', 'Waist (cm)', 'Hip (in)', 'Inseam (in)'],
      guideRows: [
        { col1: '28', col2: '71 cm', col3: '35 in', col4: '30 in' },
        { col1: '30', col2: '76 cm', col3: '37 in', col4: '31 in' },
        { col1: '32', col2: '81 cm', col3: '39 in', col4: '32 in' },
        { col1: '34', col2: '86 cm', col3: '41 in', col4: '32 in' },
        { col1: '36', col2: '91 cm', col3: '43 in', col4: '33 in' },
        { col1: '38', col2: '96 cm', col3: '45 in', col4: '33 in' },
      ],
    };
  }

  // C. Kids Wear
  const isKids = /\b(kid|kids|baby|toddler|children|child|boys?|girls?|infant)\b/i.test(
    searchCorpus
  );
  if (isKids) {
    return {
      sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-12Y'],
      label: 'Select Age Group / Size',
      categoryType: 'kids',
      hasSizeGuide: true,
      defaultSize: '4-5Y',
      guideHeaders: ['Age Group', 'Height (cm)', 'Chest (in)', 'Waist (in)'],
      guideRows: [
        { col1: '2-3Y', col2: '92 - 98 cm', col3: '21 in', col4: '20 in' },
        { col1: '4-5Y', col2: '104 - 110 cm', col3: '22 in', col4: '21 in' },
        { col1: '6-7Y', col2: '116 - 122 cm', col3: '24 in', col4: '22 in' },
        { col1: '8-9Y', col2: '128 - 134 cm', col3: '26 in', col4: '23 in' },
        { col1: '10-12Y', col2: '140 - 152 cm', col3: '28 in', col4: '25 in' },
      ],
    };
  }

  // D. Fragrance / Perfume / Beauty / Skincare
  const isBeauty =
    /\b(perfume|fragrance|cologne|eau de parfum|eau de toilette|serum|skincare|beauty|lotion|cream|mist|scent)\b/i.test(
      searchCorpus
    );
  if (isBeauty) {
    return {
      sizes: ['30ml', '50ml', '100ml'],
      label: 'Select Bottle Volume',
      categoryType: 'beauty',
      hasSizeGuide: false,
      defaultSize: '50ml',
      guideHeaders: ['Volume', 'Spray Count', 'Ideal For'],
      guideRows: [
        { col1: '30ml', col2: '~350 Sprays', col3: 'Travel & Daily Carry' },
        { col1: '50ml', col2: '~600 Sprays', col3: 'Regular 2-Month Use' },
        { col1: '100ml', col2: '~1200 Sprays', col3: 'Signature Best Value' },
      ],
    };
  }

  // E. Watches / Timepieces
  const isWatch = /\b(watch|watches|chronograph|timepiece|dial|horology)\b/i.test(
    searchCorpus
  );
  if (isWatch) {
    return {
      sizes: ['38mm Dial', '40mm Dial', '42mm Dial'],
      label: 'Select Case Diameter',
      categoryType: 'watch',
      hasSizeGuide: false,
      defaultSize: '40mm Dial',
      guideHeaders: ['Case Size', 'Wrist Circumference', 'Look & Feel'],
      guideRows: [
        { col1: '38mm Dial', col2: '14 - 16 cm (Slender)', col3: 'Classic Vintage' },
        { col1: '40mm Dial', col2: '16 - 18 cm (Medium)', col3: 'Universal Contemporary' },
        { col1: '42mm Dial', col2: '18 - 20 cm (Broad)', col3: 'Bold Statement Fit' },
      ],
    };
  }

  // F. Bags / Backpacks / Luggage
  const isBag = /\b(bag|backpack|luggage|suitcase|duffel|tote|handbag|crossbody|briefcase)\b/i.test(
    searchCorpus
  );
  if (isBag) {
    return {
      sizes: ['Compact / Cabin', 'Standard (25L)', 'Weekend / Large (40L)'],
      label: 'Select Bag Size / Volume',
      categoryType: 'bag',
      hasSizeGuide: false,
      defaultSize: 'Standard (25L)',
      guideHeaders: ['Bag Size', 'Capacity', 'Suitability'],
      guideRows: [
        { col1: 'Compact / Cabin', col2: '15 - 20 Litres', col3: 'Daily Commute & Flights' },
        { col1: 'Standard (25L)', col2: '25 Litres', col3: 'Work, Gym & Weekend' },
        { col1: 'Weekend / Large', col2: '40 Litres', col3: 'Long Travel & Overnights' },
      ],
    };
  }

  // G. Eyewear / Sunglasses
  const isEyewear = /\b(sunglasses?|eyewear|glasses?|frame|spectacles?)\b/i.test(
    searchCorpus
  );
  if (isEyewear) {
    return {
      sizes: ['Standard Fit (52mm)', 'Wide Fit (56mm)'],
      label: 'Select Frame Width',
      categoryType: 'eyewear',
      hasSizeGuide: false,
      defaultSize: 'Standard Fit (52mm)',
      guideHeaders: ['Frame Size', 'Lens Width', 'Face Profile'],
      guideRows: [
        { col1: 'Standard Fit', col2: '52 - 54 mm', col3: 'Narrow to Regular Faces' },
        { col1: 'Wide Fit', col2: '55 - 58 mm', col3: 'Medium to Broad Faces' },
      ],
    };
  }

  // H. Topwear / Clothing / Fashion / Apparel (Default for Men, Women, Fashion, or generic apparel)
  const isApparel =
    /\b(men|women|clothing|apparel|fashion|shirt|t-shirt|tshirt|top|dress|kurta|jacket|hoodie|coat|sweater|blazer|suit|gown)\b/i.test(
      searchCorpus
    );
  if (isApparel) {
    return {
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      label: 'Select Garment Size',
      categoryType: 'apparel',
      hasSizeGuide: true,
      defaultSize: 'M',
      guideHeaders: ['Standard Size', 'Chest (in / cm)', 'Waist (in / cm)', 'Hips (in / cm)'],
      guideRows: [
        { col1: 'S (UK 36)', col2: '36" / 91cm', col3: '30" / 76cm', col4: '36" / 91cm' },
        { col1: 'M (UK 38)', col2: '38" / 96cm', col3: '32" / 81cm', col4: '38" / 96cm' },
        { col1: 'L (UK 40)', col2: '40" / 102cm', col3: '34" / 86cm', col4: '40" / 102cm' },
        { col1: 'XL (UK 42)', col2: '42" / 107cm', col3: '36" / 91cm', col4: '42" / 107cm' },
        { col1: 'XXL (UK 44)', col2: '44" / 112cm', col3: '38" / 96cm', col4: '44" / 112cm' },
      ],
    };
  }

  // I. Default Standard Size for Electronics, Gadgets, Health & Fitness, Home & Living
  return {
    sizes: ['Standard / Free Size'],
    label: 'Select Size / Specification',
    categoryType: 'standard',
    hasSizeGuide: false,
    defaultSize: 'Standard / Free Size',
    guideHeaders: ['Specification', 'Fit Details'],
    guideRows: [
      { col1: 'Standard / Free Size', col2: 'Ergonomic universal fit tailored for all standard requirements' },
    ],
  };
};
