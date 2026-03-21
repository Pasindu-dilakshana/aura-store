import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ordersApi } from '../api';

export default function CartDrawer({ isOpen, onClose, cart, removeFromCart, clearCart }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('cart'); // 'cart' | 'details'

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!name || !email) {
      alert('Please enter your name and email');
      return;
    }

    setLoading(true);
    try {
      // Save order to backend
      await ordersApi.place({
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        items: cart,
        total
      });
    } catch (err) {
      console.warn('Could not save order:', err.message);
    }

    // Open WhatsApp
    let message = `Hi AURA! I'd like to place an order:%0A%0A`;
    cart.forEach((item, i) => {
      message += `${i + 1}. ${item.name} (${item.selectedSize}) - LKR ${item.price.toLocaleString()}%0A`;
    });
    message += `%0A*Total: LKR ${total.toLocaleString()}*%0A%0AName: ${name}%0AEmail: ${email}`;
    if (phone) message += `%0APhone: ${phone}`;

    window.open(`https://wa.me/94771234567?text=${message}`, '_blank');
    clearCart();
    setStep('cart');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="font-serif text-xl font-bold flex items-center gap-2">
            <ShoppingBag size={20} /> Shopping Bag ({cart.length})
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
              <ShoppingBag size={48} strokeWidth={1} />
              <p className="font-medium">Your bag is empty</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <img src={item.image} className="w-20 h-24 object-cover rounded-lg" alt={item.name} />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500 mt-0.5">Size: {item.selectedSize}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="font-semibold">LKR {item.price.toLocaleString()}</p>
                    <button onClick={() => removeFromCart(idx)} className="text-red-500 hover:text-red-600 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Section */}
        {cart.length > 0 && (
          <div className="p-6 bg-gray-50 border-t space-y-4">
            {step === 'details' && (
              <div className="space-y-3">
                <input
                  value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your full name *"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black"
                />
                <input
                  value={email} onChange={e => setEmail(e.target.value)} type="email"
                  placeholder="Email address *"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black"
                />
                <input
                  value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="Phone number (optional)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black"
                />
              </div>
            )}

            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold">LKR {total.toLocaleString()}</span>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => setStep('details')}
                className="w-full bg-black text-white py-4 font-bold rounded-lg hover:bg-olive-700 transition-colors"
              >
                PROCEED TO CHECKOUT
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('cart')}
                  className="flex-1 border border-gray-300 text-gray-700 py-4 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  BACK
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="flex-2 flex-grow bg-green-600 text-white py-4 font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader size={18} className="animate-spin" /> : '📱'}
                  ORDER VIA WHATSAPP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
