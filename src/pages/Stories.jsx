import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postsApi } from '../api';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const TAG_COLORS = {
  'Sale':              'bg-red-100 text-red-600',
  'Announcement':      'bg-blue-100 text-blue-600',
  'Behind the Scenes': 'bg-purple-100 text-purple-600',
  'New Drop':          'bg-olive-100 text-olive-700',
  'Update':            'bg-gray-100 text-gray-600',
  'Event':             'bg-yellow-100 text-yellow-700',
};

export default function Stories() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tag, setTag] = useState('All');

  useEffect(() => {
    postsApi.getAll().then(setPosts).catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const tags = ['All', ...Object.keys(TAG_COLORS)];
  const filtered = tag === 'All' ? posts : posts.filter(p => p.tag === tag);

  return (
    <div className="min-h-screen pb-24 animate-fadeIn">
      {/* Header */}
      <div className="bg-stone-900 text-white py-20 text-center px-4">
        <p className="text-xs font-bold tracking-widest uppercase text-stone-400 mb-3">From AURA</p>
        <h1 className="text-5xl font-serif font-bold mb-4">Our Stories</h1>
        <p className="text-stone-400 max-w-md mx-auto">Day-to-day updates, sales, behind the scenes, and everything AURA.</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-10">
        {/* Tag filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {tags.map(t => (
            <button key={t} onClick={() => setTag(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${tag === t ? 'bg-black text-white' : 'bg-white border border-gray-200 hover:border-black text-gray-600'}`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl overflow-hidden">
                <div className="bg-gray-200 h-52 w-full" />
                <div className="p-5 space-y-3">
                  <div className="bg-gray-200 h-3 w-16 rounded-full" />
                  <div className="bg-gray-200 h-5 w-3/4 rounded" />
                  <div className="bg-gray-200 h-4 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-4xl mb-4">📭</p>
            <p className="font-medium text-lg">No stories yet</p>
            <p className="text-sm mt-2">Check back soon — we post updates regularly!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <Link key={post.id} to={`/stories/${post.id}`}
                className={`group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col ${i === 0 && tag === 'All' ? 'md:col-span-2' : ''}`}>
                {post.image && (
                  <div className="overflow-hidden">
                    <img src={post.image} alt={post.title} className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${i === 0 && tag === 'All' ? 'h-72' : 'h-52'}`} />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full mb-3 inline-block self-start ${TAG_COLORS[post.tag] || 'bg-gray-100 text-gray-600'}`}>{post.tag}</span>
                  <h3 className={`font-bold leading-snug group-hover:text-olive-700 transition-colors ${i === 0 && tag === 'All' ? 'text-2xl' : 'text-lg'}`}>{post.title}</h3>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-3 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString('en-LK', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <span className="text-xs font-bold text-olive-600 flex items-center gap-1 group-hover:gap-2 transition-all">Read <ArrowRight size={13} /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
