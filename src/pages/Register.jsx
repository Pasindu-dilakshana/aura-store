import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 animate-fadeIn">
      <div className="w-full max-w-md">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 group transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />Back
        </button>
        <div className="text-center mb-10">
          <Link to="/" className="text-3xl font-serif font-bold">AURA<span className="text-olive-600">.</span></Link>
          <h1 className="text-2xl font-bold mt-4 mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm">Join AURA and track your orders</p>
        </div>

        {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold mb-2">Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-colors" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-black transition-colors" placeholder="Min. 6 characters" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-olive-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {loading && <Loader size={18} className="animate-spin" />}
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account? <Link to="/login" className="text-olive-600 font-semibold hover:text-olive-700">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
