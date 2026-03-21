import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { productsApi } from '../api';
import ProductCard from '../Components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.getAll()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const visible = showMore ? products : products.slice(0, 4);

  return (
    <div className="animate-fadeIn">
      <div className="relative h-[85vh] w-full">
        <div className="absolute inset-0 bg-gray-900">
          <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2000"
            className="w-full h-full object-cover opacity-60" alt="LIMA Hero" />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8">Quiet Luxury.</h1>
          <div className="flex gap-6 flex-wrap justify-center">
            <Link to="/shop/Men" className="bg-white text-black px-12 py-4 rounded-full font-bold hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg">
              SHOP MEN
            </Link>
            <Link to="/shop/Women" className="border-2 border-white text-white px-12 py-4 rounded-full font-bold hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 shadow-lg">
              SHOP WOMEN
            </Link>
          </div>
        </div>
      </div>

      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-wrap justify-center gap-6">
          {[
            { to: '/new', label: '✨ New Arrivals' },
            { to: '/weekly', label: '⭐ Weekly Favorites' },
            { to: '/shop/Men', label: '👔 Men' },
            { to: '/shop/Women', label: '👗 Women' },
            { to: '/stories', label: '📖 Our Stories' },
          ].map(c => (
            <Link key={c.to} to={c.to}
              className="text-sm font-semibold text-gray-600 hover:text-black transition-colors flex items-center gap-1 group">
              {c.label}
              <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-serif font-bold mb-12">Weekly Favorites</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-[400px] w-full mb-3 rounded" />
                <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded" />
                <div className="bg-gray-200 h-4 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {visible.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            {products.length > 4 && (
              <div className="flex justify-center mt-12">
                <button onClick={() => setShowMore(!showMore)}
                  className="group bg-white border border-gray-300 px-8 py-4 rounded-full text-sm font-bold tracking-wide hover:border-black hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-2">
                  {showMore ? 'SHOW LESS' : 'SHOW MORE'}
                  <ChevronDown size={16} className={`transition-transform ${showMore ? 'rotate-180' : 'group-hover:translate-y-1'}`} />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
