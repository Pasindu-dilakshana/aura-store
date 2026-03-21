import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsApi } from '../api';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

const TAG_COLORS = {
  'Sale':              'bg-red-100 text-red-600',
  'Announcement':      'bg-blue-100 text-blue-600',
  'Behind the Scenes': 'bg-purple-100 text-purple-600',
  'New Drop':          'bg-olive-100 text-olive-700',
  'Update':            'bg-gray-100 text-gray-600',
  'Event':             'bg-yellow-100 text-yellow-700',
};

export default function StoryPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postsApi.getOne(id).then(setPost).catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="max-w-2xl mx-auto px-6 py-16 animate-pulse space-y-6">
      <div className="h-4 w-24 bg-gray-200 rounded" />
      <div className="h-72 bg-gray-200 rounded-2xl" />
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded" />)}
      </div>
    </div>
  );

  if (!post) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-gray-400">
      <p className="text-5xl">📭</p>
      <p className="text-lg font-medium">Post not found</p>
      <Link to="/stories" className="text-sm text-olive-600 font-semibold hover:underline">← Back to Stories</Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 animate-fadeIn">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors mb-8 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />Back to Stories
      </button>

      {post.image && (
        <img src={post.image} alt={post.title} className="w-full h-72 object-cover rounded-2xl mb-8 shadow-sm" />
      )}

      <div className="flex items-center gap-3 mb-4">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${TAG_COLORS[post.tag] || 'bg-gray-100 text-gray-600'}`}>{post.tag}</span>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <Calendar size={12} />{new Date(post.created_at).toLocaleDateString('en-LK', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6 leading-tight">{post.title}</h1>

      <div className="prose prose-lg text-gray-700 max-w-none">
        {post.content.split('\n').map((para, i) => para.trim() && (
          <p key={i} className="mb-5 leading-relaxed">{para}</p>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t text-center">
        <p className="text-gray-500 text-sm mb-4">More from AURA</p>
        <Link to="/stories" className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-olive-700 transition-colors">
          All Stories
        </Link>
      </div>
    </div>
  );
}
