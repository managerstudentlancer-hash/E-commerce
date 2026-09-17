import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';

const CollectionPage = () => {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);
      try {
        const res = await api.collections.getBySlug(slug);
        if (res && res.success && res.collection) {
          setCollection(res.collection);
        } else {
          // If no specific collection model, fallback to query products
          const prodRes = await api.products.getAll({ collection: slug });
          if (prodRes && prodRes.success) {
            setCollection({
              name: slug.replace(/-/g, ' ').toUpperCase(),
              description: 'Curated seasonal collection',
              products: prodRes.products || [],
            });
          }
        }
      } catch (err) {
        console.error('Failed to load collection:', err);
        // Resilient fallback: fetch all products and filter
        try {
          const prodRes = await api.products.getAll();
          if (prodRes && prodRes.success) {
            const all = prodRes.products || [];
            const filtered = all.filter(
              (p) =>
                p.collectionSlug === slug ||
                (slug === 'bestsellers' && p.bestseller) ||
                (slug === 'trending' && (p.bestseller || p.featured)) ||
                (slug === 'new-arrivals' && p.newArrival) ||
                (slug === 'special-offers' && p.specialOffer)
            );
            setCollection({
              name: slug.replace(/-/g, ' ').toUpperCase(),
              description: 'Curated seasonal collection',
              products: filtered.length > 0 ? filtered : all.slice(0, 16),
            });
          }
        } catch (fbErr) {
          console.error('Fallback failed:', fbErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        <p className="text-xs font-semibold text-neutral-500">Loading collection...</p>
      </div>
    );
  }

  const products = collection?.products || [];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-neutral-100 bg-neutral-50/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-neutral-500 mb-2 flex items-center space-x-2">
            <Link to="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-black">Collections</Link>
            <span>/</span>
            <span className="text-black font-semibold">{collection?.name || slug}</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 uppercase">
            {collection?.name || slug}
          </h1>
          {collection?.description && (
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-xl">
              {collection.description}
            </p>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-4">
            <p className="text-base font-bold text-neutral-900">
              No products found in this collection currently.
            </p>
            <Link to="/shop" className="btn-pill-dark text-xs py-2.5 px-6">
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
