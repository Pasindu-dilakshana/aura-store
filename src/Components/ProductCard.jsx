import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="group block cursor-pointer">
      <div className="relative overflow-hidden mb-3">
        <img src={product.image} alt={product.name} className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 uppercase tracking-widest ${product.type.includes('Local') ? 'bg-olive-100 text-olive-800' : 'bg-white text-gray-800'}`}>{product.type}</span>
      </div>
      <div><h3 className="font-serif text-lg text-gray-900 group-hover:text-olive-700">{product.name}</h3><p className="font-semibold text-gray-900">LKR {product.price.toLocaleString()}</p></div>
    </Link>
  );
}