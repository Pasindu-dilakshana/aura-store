import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsApi } from '../api';
import { ArrowLeft, ShoppingBag, Share2, Check } from 'lucide-react';

export default function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    productsApi.getOne(id)
      .then(setProduct).catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!selectedSize) { setSizeError(true); return; }
    setSizeError(false);
    addToCart({ ...product, selectedSize });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-pulse">
        <div className="bg-gray-200 aspect-[4/5] w-full rounded-lg" />
        <div className="space-y-4 pt-8">
          <div className="bg-gray-200 h-5 w-24 rounded-full" />
          <div className="bg-gray-200 h-10 w-3/4 rounded" />
          <div className="bg-gray-200 h-6 w-1/2 rounded" />
          <div className="bg-gray-200 h-4 w-full rounded mt-4" />
          <div className="bg-gray-200 h-4 w-4/5 rounded" />
          <div className="bg-gray-200 h-14 w-full rounded mt-8" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-gray-500 text-xl">Product not found.</p>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-olive-600 font-semibold hover:underline">
        <ArrowLeft size={15} />Go back
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fadeIn">
      {/* Back Button */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors mb-8 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image */}
        <div className="relative">
          <img src={product.image} className="w-full object-cover aspect-[4/5] rounded-lg shadow-sm" alt={product.name} />
          {product.is_new_arrival && (
            <span className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-3 py-1 rounded-full">NEW</span>
          )}
          {product.is_weekly_favorite && (
            <span className="absolute top-4 left-4 bg-olive-600 text-white text-xs font-bold px-3 py-1 rounded-full">⭐ WEEKLY PICK</span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-2">
            <span className="inline-block text-xs font-bold px-3 py-1 bg-gray-100 text-gray-600 rounded-full">{product.type}</span>
            <button onClick={() => { navigator.share?.({ title: product.name, url: window.location.href }).catch(()=>{}); }}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors">
              <Share2 size={16} />
            </button>
          </div>

          <h1 className="text-4xl font-serif font-bold mb-2">{product.name}</h1>
          <p className="text-gray-500 mb-4 leading-relaxed">{product.description}</p>
          <p className="text-3xl font-bold mb-8">LKR {product.price.toLocaleString()}</p>

          {/* Sizes */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Select Size</p>
              {sizeError && <p className="text-red-500 text-xs font-medium">Please select a size</p>}
            </div>
            <div className="flex gap-3 flex-wrap">
              {product.sizes.map(size => (
                <button key={size} onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  className={`min-w-[56px] h-12 border-2 text-sm font-bold transition-all rounded-lg ${
                    selectedSize === size ? 'bg-black text-white border-black' : `border-gray-200 hover:border-black ${sizeError ? 'border-red-300' : ''}`
                  }`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleAdd}
            className={`w-full py-5 font-bold rounded-full text-sm tracking-widest transition-all flex items-center justify-center gap-2 ${
              added ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-olive-700'
            }`}>
            {added ? <><Check size={18} /> ADDED TO BAG</> : <><ShoppingBag size={18} /> ADD TO BAG</>}
          </button>

          <div className="mt-6 pt-6 border-t text-sm text-gray-500 space-y-1">
            <p>📦 Category: <span className="font-medium text-gray-700">{product.category}</span></p>
            <p>📦 In Stock: <span className="font-medium text-gray-700">{product.stock} units</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
