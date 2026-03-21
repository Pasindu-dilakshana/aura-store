import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, CreditCard, CheckCircle, Loader } from 'lucide-react';
import { newsletterApi } from '../api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) { setStatus('error'); setMessage('Please enter a valid email'); return; }
    setStatus('loading');
    try {
      await newsletterApi.subscribe(email);
      setStatus('success');
      setMessage('You\'re subscribed!');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.message === 'Already subscribed' ? 'You\'re already subscribed!' : 'Subscription failed. Try again.');
    }
  };

  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="space-y-6">
            <h3 className="text-3xl font-serif font-bold tracking-tighter">AURA<span className="text-olive-600">.</span></h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Bridging the gap between Sri Lankan craftsmanship and global fashion trends. Sustainable, stylish, and timeless.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Instagram size={20} />} href="#" />
              <SocialIcon icon={<Facebook size={20} />} href="#" />
              <SocialIcon icon={<Twitter size={20} />} href="#" />
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 tracking-widest text-xs uppercase text-gray-500">Shop</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><FooterLink to="/shop/Men">Men's Collection</FooterLink></li>
              <li><FooterLink to="/shop/Women">Women's Collection</FooterLink></li>
              <li><FooterLink to="/new">New Arrivals</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 tracking-widest text-xs uppercase text-gray-500">Customer Care</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><FooterLink to="/about">Our Story</FooterLink></li>
              <li><FooterLink to="/contact">Contact Us</FooterLink></li>
              <li><FooterLink to="/my-orders">My Orders</FooterLink></li>
              <li><FooterLink to="/login">Sign In</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 tracking-widest text-xs uppercase text-gray-500">Stay in the loop</h4>
            <p className="text-gray-400 text-sm mb-4">Be the first to know about new drops and exclusive offers.</p>
            <div className="flex flex-col gap-3">
              {status === 'success' ? (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle size={16} />{message}
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-500" size={16} />
                    <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                      className="w-full bg-gray-900 border border-gray-800 rounded px-10 py-3 text-sm focus:outline-none focus:border-olive-600 transition-colors placeholder:text-gray-600" />
                  </div>
                  {status === 'error' && <p className="text-red-400 text-xs">{message}</p>}
                  <button onClick={handleSubscribe} disabled={status === 'loading'}
                    className="bg-white text-black text-sm font-bold py-3 rounded hover:bg-olive-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50">
                    {status === 'loading' ? <Loader size={15} className="animate-spin" /> : null}
                    SUBSCRIBE
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">© 2024 Aura Fashion Store. All rights reserved.</p>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="text-xs uppercase tracking-wider">Secure Payment</span>
            <div className="flex gap-2">
              <CreditCard size={20} />
              <div className="font-bold text-xs border border-gray-700 px-1 rounded">VISA</div>
              <div className="font-bold text-xs border border-gray-700 px-1 rounded">MC</div>
            </div>
          </div>
          <div className="flex gap-6 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const FooterLink = ({ to, children }) => (
  <Link to={to} className="hover:text-olive-500 hover:translate-x-1 transition-all duration-300 inline-block">{children}</Link>
);
const SocialIcon = ({ icon, href }) => (
  <a href={href} className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-olive-600 transition-all duration-300">{icon}</a>
);
