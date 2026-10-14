import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const defaultCategories = [
  { name: 'Women Wear', slug: 'women-wear', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80', status: 'active' },
  { name: 'Sarees', slug: 'sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80', status: 'active' },
  { name: 'Men Wear', slug: 'men-wear', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80', status: 'active' },
  { name: 'Kids Wear', slug: 'kids-wear', image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=400&q=80', status: 'active' },
  { name: 'Shoes', slug: 'shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80', status: 'active' },
  { name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80', status: 'active' },
  { name: 'Jewellery', slug: 'jewellery', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80', status: 'active' },
  { name: 'Bags', slug: 'bags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80', status: 'active' },
  { name: 'Hats', slug: 'hats', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=400&q=80', status: 'active' },
  { name: 'Vision Care', slug: 'vision-care', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80', status: 'active' },
  { name: 'Pets Care', slug: 'pets-care', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80', status: 'active' },
  { name: 'Toys', slug: 'toys', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80', status: 'active' },
  { name: 'Health & Fitness', slug: 'health-fitness', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80', status: 'active' },
  { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80', status: 'active' },
  { name: 'Home & Living', slug: 'home-living', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80', status: 'active' },
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
