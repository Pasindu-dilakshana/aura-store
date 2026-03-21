import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function About() {
  const [story, setStory] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/story`)
      .then(r => r.json())
      .then(setStory)
      .catch(() => {});
  }, []);

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="bg-stone-900 text-white py-24 text-center px-4">
        <p className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-3">Est. Sri Lanka</p>
        <h1 className="text-5xl font-serif font-bold mb-4">About AURA</h1>
        <p className="text-stone-400 max-w-md mx-auto">Quiet luxury, rooted in Sri Lanka.</p>
      </div>

      {/* Story content from admin */}
      <div className="max-w-2xl mx-auto px-6 py-16">
        {story ? (
          <>
            <h2 className="text-3xl font-serif font-bold mb-6">{story.title || 'Our Story'}</h2>
            <div className="text-gray-600 leading-relaxed space-y-5">
              {(story.content || '').split('\n').map((para, i) =>
                para.trim() && <p key={i}>{para}</p>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            {[...Array(4)].map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded" />)}
          </div>
        )}

        {/* CTA to Stories blog */}
        <div className="mt-16 pt-10 border-t text-center">
          <p className="text-gray-500 text-sm mb-4">Want to follow our daily journey?</p>
          <Link to="/stories"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-olive-700 transition-colors group">
            Read Our Stories
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
