import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Sparkles, User, LogOut, Package, Star, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ cartCount, toggleCart }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => {
    const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
    return active
      ? "text-olive-600 font-semibold relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-olive-600"
      : "text-gray-700 font-medium hover:text-olive-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-olive-600 after:transition-all after:duration-300 hover:after:w-full";
  };

  const handleLogout = () => { logout(); setIsUserMenuOpen(false); navigate('/'); };
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <button onClick={() => setIsMenuOpen(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-serif font-bold tracking-tighter">LIMA<span className="text-olive-600">.</span></div>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`text-sm tracking-widest uppercase transition-all ${isActive('/')}`}>Home</Link>
          <Link to="/shop/Men" className={`text-sm tracking-widest uppercase transition-all ${isActive('/shop/Men')}`}>Men</Link>
          <Link to="/shop/Women" className={`text-sm tracking-widest uppercase transition-all ${isActive('/shop/Women')}`}>Women</Link>
          <Link to="/new" className={`text-sm tracking-widest uppercase transition-all flex items-center gap-1 ${isActive('/new')}`}>
            <Sparkles size={13} className="text-olive-600" />New
          </Link>
          <Link to="/weekly" className={`text-sm tracking-widest uppercase transition-all flex items-center gap-1 ${isActive('/weekly')}`}>
            <Star size={13} className="text-olive-600" />Weekly
          </Link>
          <Link to="/stories" className={`text-sm tracking-widest uppercase transition-all ${isActive('/stories')}`}>Stories</Link>
          <Link to="/about" className={`text-sm tracking-widest uppercase transition-all ${isActive('/about')}`}>About</Link>
          <Link to="/contact" className={`text-sm tracking-widest uppercase transition-all ${isActive('/contact')}`}>Contact</Link>
        </div>

        <div className="flex items-center gap-1">
          <div className="relative">
            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
              <User className="w-6 h-6 text-gray-700 hover:text-olive-600 transition-colors" />
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {user ? (
                  <>
                    <div className="px-4 py-3 bg-gray-50 border-b">
                      <p className="text-sm font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      {user.role === 'admin' && <span className="text-xs bg-olive-100 text-olive-700 px-2 py-0.5 rounded-full font-bold mt-1 inline-block">Admin</span>}
                    </div>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-olive-700 hover:bg-olive-50 transition-colors border-b">
                        <LayoutDashboard size={15} />Admin Dashboard
                      </Link>
                    )}
                    <Link to="/my-orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 transition-colors">
                      <Package size={15} />My Orders
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut size={15} />Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors">Sign In</Link>
                    <Link to="/register" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-3 text-sm font-medium text-olive-600 hover:bg-olive-50 transition-colors">Create Account</Link>
                  </>
                )}
              </div>
            )}
          </div>

          <button onClick={toggleCart} className="relative group p-2 hover:bg-gray-100 rounded-lg transition-all">
            <ShoppingBag className="w-6 h-6 text-gray-700 group-hover:text-olive-600 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-olive-600 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full">{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeMenu} />
          <div className="relative bg-white w-4/5 max-w-sm h-screen overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex justify-between items-center px-6 py-5 border-b sticky top-0 bg-white z-10">
              <span className="font-serif text-xl font-bold">LIMA<span className="text-olive-600">.</span></span>
              <button onClick={closeMenu} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col p-4 space-y-1 flex-grow">
              {[
                { to: '/', label: 'Home' },
                { to: '/shop/Men', label: 'Men' },
                { to: '/shop/Women', label: 'Women' },
                { to: '/new', label: '✨ New Arrivals' },
                { to: '/weekly', label: '⭐ Weekly Favorites' },
                { to: '/stories', label: '📖 Stories' },
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact Us' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} onClick={closeMenu}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all font-medium ${location.pathname === to ? 'bg-olive-50 text-olive-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}>
                  {label}
                </Link>
              ))}
              <div className="border-t pt-3 mt-2 space-y-1">
                {user ? (
                  <>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-lg text-olive-700 bg-olive-50 font-semibold">
                        <LayoutDashboard size={16} />Admin Dashboard
                      </Link>
                    )}
                    <Link to="/my-orders" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                      <Package size={16} />My Orders
                    </Link>
                    <button onClick={() => { logout(); closeMenu(); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50">
                      <LogOut size={16} />Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50"><User size={16} />Sign In</Link>
                    <Link to="/register" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-lg text-olive-700 bg-olive-50"><User size={16} />Create Account</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
