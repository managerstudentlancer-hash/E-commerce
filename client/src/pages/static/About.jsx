import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, HeartHandshake, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C4301C]">
            OUR HERITAGE & DESIGN MANIFESTO
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">
            The Story of VEXIVO
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Crafted in Covent Garden, London. Uniting architectural geometry, acoustic precision, and ethical luxury tailoring.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=85"
            alt="VEXIVO Studio"
            className="w-full h-80 sm:h-96 object-cover"
          />
        </div>

        <div className="prose max-w-none text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-6">
          <p>
            VEXIVO was founded on the conviction that everyday functional items—from spatial noise-cancelling
            headphones to Tuscan leather carryalls—should achieve the exact same aesthetic discipline and material
            integrity as luxury fine art.
          </p>
          <p>
            Rather than releasing hundreds of disposable seasonal items destined for landfills, we engineer small,
            disciplined capsule collections in London. We collaborate strictly with generational family tanneries in
            Civitanova Marche (Italy) and acoustic laboratories to guarantee that every seam, dial, and transducer
            performs flawlessly for decades.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 text-center space-y-2">
            <Award className="w-8 h-8 mx-auto text-black" />
            <h3 className="text-sm font-bold text-neutral-900">London Designed</h3>
            <p className="text-xs text-neutral-500">Conceived and architected in Covent Garden, London.</p>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 text-center space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-black" />
            <h3 className="text-sm font-bold text-neutral-900">Zero Synthetic Blend</h3>
            <p className="text-xs text-neutral-500">100% GOTS cotton, Tuscan full-grain leather, solid vermeil.</p>
          </div>
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 text-center space-y-2">
            <ShieldCheck className="w-8 h-8 mx-auto text-black" />
            <h3 className="text-sm font-bold text-neutral-900">Lifetime Warranty</h3>
            <p className="text-xs text-neutral-500">Complimentary hardware repairs for all verified owners.</p>
          </div>
        </div>

        <div className="text-center pt-6">
          <Link to="/shop" className="btn-pill-dark text-xs py-3 px-8">
            Experience The Collection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
