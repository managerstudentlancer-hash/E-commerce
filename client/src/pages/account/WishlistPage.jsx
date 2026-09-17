import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/common/ProductCard';

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="text-xs text-neutral-500 mb-2 flex items-center space-x-2">
          <Link to="/account" className="hover:text-black">Account</Link>
          <span>/</span>
          <span className="text-black font-semibold">Wishlist</span>
        </nav>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 uppercase tracking-tight mb-8">
          Saved Wishlist ({wishlist.length})
        </h1>

        {wishlist.length === 0 ? (
          <div className="p-12 text-center bg-neutral-50 rounded-3xl border border-neutral-200 space-y-4">
            <Heart className="w-12 h-12 text-neutral-400 mx-auto" />
            <h3 className="text-base font-bold text-neutral-900">Your wishlist is currently empty</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Save your favorite pieces by clicking the heart icon on any product card.
            </p>
            <Link to="/shop" className="btn-pill-dark text-xs py-2.5 px-6 inline-block">
              Discover Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
