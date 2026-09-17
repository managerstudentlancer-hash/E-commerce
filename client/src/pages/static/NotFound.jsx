import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-neutral-50 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-neutral-200 shadow-card space-y-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-800">
          <Compass className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C4301C]">
            404 ERROR
          </span>
          <h1 className="text-3xl font-extrabold text-neutral-900 mt-1">Page Not Found</h1>
          <p className="text-xs text-neutral-500 mt-2">
            The page you are trying to visit may have moved or no longer exists.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Link to="/" className="btn-pill-dark w-full py-3 text-xs flex items-center justify-center space-x-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
          <Link to="/shop" className="btn-pill-light w-full py-3 text-xs">
            Browse Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
