import React, { useState, useEffect } from 'react';
import { productsApi } from '../api';
import ProductCard from '../Components/ProductCard';
import { Sparkles, ChevronDown } from 'lucide-react';

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    productsApi.getAll({ new_arrival: '1' })
      .then(setProducts).catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-12 pb-24 max-w-7xl mx-auto px-6 animate-fadeIn">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-2">
          <Sparkles size={14} /> Just Dropped
        </div>
        <h1 className="text-4xl md:text-6xl font-serif font-bold">New Arrivals</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">Be the first to wear the latest trends. Our newest collection features seasonal essentials and exclusive limited runs.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-[400px] w-full mb-3 rounded" />
              <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded" />
              <div className="bg-gray-200 h-4 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {products.slice(0, visibleCount).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {visibleCount < products.length && (
            <div className="flex justify-center mt-12">
              <button onClick={() => setVisibleCount(products.length)}
                className="group bg-white border border-gray-300 px-8 py-4 rounded-full text-sm font-bold tracking-wide hover:border-black hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-2">
                LOAD MORE STYLES <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
