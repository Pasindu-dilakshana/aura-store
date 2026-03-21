import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsApi } from '../api';
import ProductCard from '../Components/ProductCard';
import { ChevronDown, ArrowLeft } from 'lucide-react';

const CATEGORY_META = {
  Men: { emoji: '👔', desc: "Men's collection — local and international styles." },
  Women: { emoji: '👗', desc: "Women's collection — curated for every occasion." },
};

export default function Shop() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    setLoading(true);
    setVisibleCount(8);
    const params = {};
    if (category) params.category = category;
    if (typeFilter === 'local') params.type = 'local';
    if (typeFilter === 'international') params.type = 'international';
    productsApi.getAll(params)
      .then(setProducts).catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, typeFilter]);

  const meta = CATEGORY_META[category] || {};

  return (
    <div className="min-h-screen pt-8 pb-24 max-w-7xl mx-auto px-6 animate-fadeIn">
      {/* Back button */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors mb-8 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="text-center mb-10 space-y-2">
        {meta.emoji && <div className="text-4xl mb-2">{meta.emoji}</div>}
        <h1 className="text-4xl md:text-5xl font-serif font-bold">{category || 'All'} Collection</h1>
        {meta.desc && <p className="text-gray-500 text-base">{meta.desc}</p>}
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-3 mb-12 flex-wrap">
        {[
          { value: 'all', label: 'All' },
          { value: 'local', label: 'Local Brand 🇱🇰' },
          { value: 'international', label: 'International 🌍' }
        ].map(f => (
          <button key={f.value} onClick={() => { setTypeFilter(f.value); setVisibleCount(8); }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              typeFilter === f.value ? 'bg-black text-white' : 'border border-gray-300 hover:border-black'}`}>
            {f.label}
          </button>
        ))}
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
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-4">
          <div className="text-6xl">👀</div>
          <p className="text-lg font-medium">No products found</p>
          <button onClick={() => setTypeFilter('all')} className="text-sm text-olive-600 underline">Clear filters</button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-6">{products.length} items</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {products.slice(0, visibleCount).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {visibleCount < products.length && (
            <div className="flex justify-center mt-12">
              <button onClick={() => setVisibleCount(products.length)}
                className="group bg-white border border-gray-300 px-8 py-4 rounded-full text-sm font-bold tracking-wide hover:border-black hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-2">
                LOAD MORE <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
