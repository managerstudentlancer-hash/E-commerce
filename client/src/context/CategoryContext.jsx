import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const defaultCategories = [
  { name: 'Women Wear', slug: 'women', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=80', status: 'active' },
  { name: 'Mens Wear', slug: 'men', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80', status: 'active' },
  { name: 'Kids Wear', slug: 'kids', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=300&q=80', status: 'active' },
  { name: 'Shoes', slug: 'shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80', status: 'active' },
  { name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80', status: 'active' },
  { name: 'Jewellery', slug: 'jewellery', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80', status: 'active' },
  { name: 'Bags', slug: 'bags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80', status: 'active' },
  { name: 'Hats', slug: 'hats', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=300&q=80', status: 'active' },
  { name: 'Watches', slug: 'watches', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=300&q=80', status: 'active' },
  { name: 'Audio & Tech', slug: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80', status: 'active' },
];

const CategoryContext = createContext({
  categories: defaultCategories,
  loading: false,
  refreshCategories: () => {},
});

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState(defaultCategories);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.categories.getAll();
      if (res.success && res.categories && res.categories.length > 0) {
        setCategories(res.categories);
      }
    } catch (err) {
      console.warn('[CategoryContext] Failed to load categories from API:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <CategoryContext.Provider value={{ categories, loading, refreshCategories: fetchCategories }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => useContext(CategoryContext);
export default CategoryContext;
