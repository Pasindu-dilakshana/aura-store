import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { contactApi } from '../api';
import { ArrowLeft, Send, Check, Loader, Mail } from 'lucide-react';

export default function Contact() {
  const contactEmail = 'pasindudilakshana23@gmail.com';
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await contactApi.send(form);
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch(err) {
      setError(err.message || 'Failed to send. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen py-12 max-w-2xl mx-auto px-6 animate-fadeIn">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 group transition-colors">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />Back
      </button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold mb-3">Get In Touch</h1>
        <p className="text-gray-500">Have a question or feedback? We'd love to hear from you.</p>
        <div className="mt-4 inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm">
          <Mail size={14} className="text-gray-500" />
          <span className="text-gray-600">Email us directly:</span>
          <a href={`mailto:${contactEmail}`} className="font-semibold text-black hover:underline">{contactEmail}</a>
        </div>
      </div>

      {sent ? (
        <div className="text-center py-16 space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="text-green-600" size={32} />
          </div>
          <h2 className="text-xl font-bold">Message Sent!</h2>
          <p className="text-gray-500">We'll get back to you within 1–2 business days.</p>
          <button onClick={() => setSent(false)} className="mt-4 text-sm text-olive-600 font-semibold hover:underline">Send another message</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">Your Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="John Silva" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Email Address *</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="your@email.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Subject *</label>
            <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors" placeholder="Order inquiry, product question..." />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Message *</label>
            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} required rows={6} resize="none"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
              placeholder="Tell us how we can help..." />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-olive-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <><Loader size={18} className="animate-spin" />Sending...</> : <><Send size={16} />SEND MESSAGE</>}
          </button>
        </form>
      )}
    </div>
  );
}
