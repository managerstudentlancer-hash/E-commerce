import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const BrandStory = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual Column */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1000&q=85"
                alt="VEXIVO London Design Studio"
                className="w-full h-[460px] sm:h-[540px] object-cover object-center"
              />
            </div>
            {/* Overlay Quote Badge */}
            <div className="absolute -bottom-6 -right-6 sm:bottom-8 sm:-right-8 bg-neutral-950 text-white p-6 rounded-2xl shadow-xl max-w-xs hidden sm:block border border-neutral-800">
              <span className="text-[11px] font-bold text-[#F4F691] uppercase tracking-widest block mb-1">
                OUR PROMISE
              </span>
              <p className="text-xs font-medium text-neutral-300 leading-snug">
                "We discard the disposable and engineer only what endures through decade-long wear."
              </p>
              <p className="text-[10px] text-neutral-500 mt-2 font-mono">
                — VEXIVO Atelier, Covent Garden
              </p>
            </div>
          </div>

          {/* Text Content Column */}
          <div className="space-y-6">
            <div className="inline-block px-3.5 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-widest">
              THE VEXIVO PHILOSOPHY
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.15]">
              Form Meets Acoustic & Sartorial Mastery
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Founded in London, VEXIVO was conceived with a clear thesis: everyday objects
              deserve the same acoustic precision and architectural discipline as high-end industrial design.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#0D8756] flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-neutral-700">
                  <strong>Uncompromising Materials:</strong> Full-grain vegetable-tanned Tuscan leather, 680gsm Mongolian cashmere, and Grade 5 aerospace titanium.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#0D8756] flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-neutral-700">
                  <strong>Acoustic Architecture:</strong> Custom neodymium 40mm transducers fine-tuned in London for unmatched spatial staging and micro-detail.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#0D8756] flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-neutral-700">
                  <strong>Sustainable Longevity:</strong> Small-batch seasonal capsules minimizing deadstock and backed by lifetime hardware repair support.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center space-x-4">
              <Link
                to="/about"
                className="btn-pill-dark text-xs uppercase tracking-wider inline-flex items-center space-x-2"
              >
                <span>Read Full Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/shop"
                className="btn-pill-light text-xs uppercase tracking-wider"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
