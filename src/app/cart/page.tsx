'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { user, loading: authLoading } = useAuth();
  const { cartItems, loading: cartLoading, updateQuantity, removeFromCart, cartTotal } = useCart();
  const router = useRouter();
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const handleQtyChange = async (itemId: number, currentQty: number, change: number) => {
    await updateQuantity(itemId, currentQty + change);
  };

  const handleRemove = async (itemId: number) => {
    await removeFromCart(itemId);
  };

  const handleCheckoutRedirect = () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent('/checkout')}`);
      return;
    }
    router.push('/checkout');
  };

  const isLoading = authLoading || cartLoading;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Decorative gradients */}
      <div className="absolute top-24 left-1/4 w-[500px] h-[500px] rounded-full bg-neonCyan/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-24 right-1/4 w-[500px] h-[500px] rounded-full bg-neonBlue/5 blur-[120px] pointer-events-none" />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 w-full">
        
        {/* Page title */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-xl bg-neonCyan/10 border border-neonCyan/20 shadow-[0_0_10px_rgba(0,255,255,0.2)] flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-neonCyan" />
          </div>
          <div>
            <h1 className="font-orbitron font-extrabold text-2xl sm:text-4xl tracking-widest text-glow-cyan uppercase">
              TWÓJ <span className="text-gradient">KOSZYK</span>
            </h1>
            <p className="font-rajdhani text-gray-400 font-semibold tracking-wider text-sm">
              Skompletuj zamówienie i zacznij pobierać cyfrowe licencje.
            </p>
          </div>
        </div>

        {/* Main section */}
        {isLoading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-t-neonCyan border-white/10 animate-spin shadow-[0_0_15px_#00ffff]" />
          </div>
        ) : !user ? (
          /* Unauthenticated state */
          <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-16 text-center shadow-lg space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-500">
              <Gamepad2 className="w-8 h-8 text-neonCyan animate-pulse" />
            </div>
            <h3 className="font-orbitron font-bold text-xl text-white tracking-widest uppercase">
              Nie jesteś zalogowany
            </h3>
            <p className="font-rajdhani text-gray-400 max-w-sm mx-auto font-semibold">
              Musisz zalogować się do swojego konta Xbox 360, aby zarządzać koszykiem i sfinalizować zakupy.
            </p>
            <Link
              href="/login?redirect=/cart"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neonCyan to-neonBlue text-black font-rajdhani text-sm font-bold tracking-wider rounded-xl shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>Zaloguj się teraz</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-16 text-center shadow-lg space-y-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-500">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-orbitron font-bold text-xl text-white tracking-widest uppercase">
              Koszyk jest pusty
            </h3>
            <p className="font-rajdhani text-gray-400 max-w-sm mx-auto font-semibold">
              Nie dodałeś jeszcze żadnych gier do swojego koszyka. Odkryj kultową klasykę w naszym sklepie.
            </p>
            <Link
              href="/store"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neonCyan to-neonBlue text-black font-rajdhani text-sm font-bold tracking-wider rounded-xl shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <span>Przejdź do Sklepu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          /* Cart contents layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Cart Items Grid (2/3 width) */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cartItems.map((item) => {
                  const unitPrice = parseFloat(item.products.price);
                  const finalUnitPrice = item.products.is_on_deal
                    ? unitPrice * (1 - item.products.discount_percent / 100)
                    : unitPrice;
                  const itemTotalPrice = finalUnitPrice * item.quantity;

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      key={item.id}
                      className="group flex flex-col sm:flex-row items-center gap-6 p-4 backdrop-blur-md bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl shadow-md transition-all"
                    >
                      {/* Image Preview */}
                      <div className="relative w-full sm:w-32 aspect-video sm:aspect-square rounded-xl overflow-hidden shrink-0 bg-black/40">
                        <Image
                          src={failedImages[item.id] ? `https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80&text=${encodeURIComponent(item.products.name)}` : item.products.image_url}
                          alt={item.products.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 128px"
                          className="object-cover"
                          onError={() => {
                            setFailedImages(prev => ({ ...prev, [item.id]: true }));
                          }}
                        />
                        {item.products.is_on_deal && (
                          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-neonPink text-black font-orbitron text-[10px] font-black rounded shadow-[0_0_8px_#ff69b4]">
                            -{item.products.discount_percent}%
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-grow text-center sm:text-left space-y-1">
                        <h3 className="font-orbitron font-bold text-lg text-white group-hover:text-neonCyan transition-colors">
                          {item.products.name}
                        </h3>
                        <p className="font-rajdhani text-sm text-gray-500 font-semibold tracking-wider">
                          Dystrybucja Cyfrowa (Klucz)
                        </p>
                        
                        <div className="flex items-center justify-center sm:justify-start gap-2 pt-1.5">
                          {item.products.is_on_deal ? (
                            <>
                              <span className="font-orbitron font-bold text-sm text-neonPink">
                                {finalUnitPrice.toFixed(2)} PLN
                              </span>
                              <span className="font-rajdhani text-xs text-gray-600 line-through">
                                {unitPrice.toFixed(2)} PLN
                              </span>
                            </>
                          ) : (
                            <span className="font-orbitron font-bold text-sm text-gray-300">
                              {unitPrice.toFixed(2)} PLN
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stepper Component and Pricing */}
                      <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-end gap-6 w-full sm:w-auto self-stretch sm:self-auto border-t border-white/5 sm:border-0 pt-4 sm:pt-0 shrink-0">
                        
                        {/* Stepper */}
                        <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-1 shrink-0">
                          <button
                            onClick={() => handleQtyChange(item.id, item.quantity, -1)}
                            className="p-1.5 rounded-lg hover:bg-white/5 hover:text-neonPink active:scale-90 transition-all"
                            title="Zmniejsz ilość"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <span className="font-orbitron font-extrabold text-sm px-3 select-none text-white w-8 text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                            className="p-1.5 rounded-lg hover:bg-white/5 hover:text-neonCyan active:scale-90 transition-all"
                            title="Zwiększ ilość"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Summary for Item */}
                        <div className="text-right flex sm:flex-col items-baseline sm:items-end gap-2 sm:gap-0 select-none">
                          <span className="text-xs text-gray-500 font-rajdhani font-semibold tracking-wider hidden sm:block">SUMA:</span>
                          <span className="font-orbitron font-extrabold text-lg text-white">
                            {itemTotalPrice.toFixed(2)} <span className="text-xs font-bold">PLN</span>
                          </span>
                        </div>

                        {/* Trash button */}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-2 border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-xl transition-all self-stretch sm:self-auto flex items-center justify-center gap-2 sm:gap-0"
                          title="Usuń z koszyka"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="sm:hidden font-rajdhani text-xs font-bold tracking-widest uppercase">USUŃ</span>
                        </button>

                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Cart Summary Card (1/3 width) */}
            <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <h3 className="font-orbitron font-bold text-lg tracking-wider text-neonCyan uppercase">
                PODSUMOWANIE
              </h3>
              <div className="h-0.5 bg-gradient-to-r from-neonCyan to-neonBlue shadow-[0_0_8px_#00ffff]" />

              {/* Breakdown */}
              <div className="space-y-4 font-rajdhani font-semibold tracking-wider text-base">
                <div className="flex justify-between text-gray-400">
                  <span>Suma przedmiotów</span>
                  <span className="text-white font-bold">
                    {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} szt.
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Dostawa</span>
                  <span className="text-neonCyan text-glow-cyan font-orbitron text-xs font-black uppercase">BEZPŁATNA (EMAIL)</span>
                </div>
                
                <div className="border-t border-white/5 pt-4 flex justify-between items-end">
                  <span className="text-gray-300 font-bold">ŁĄCZNA KWOTA</span>
                  <div className="text-right">
                    <span className="font-orbitron font-black text-2xl text-white text-glow-cyan">
                      {cartTotal.toFixed(2)} <span className="text-sm font-bold">PLN</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={handleCheckoutRedirect}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-neonCyan to-neonBlue text-black font-rajdhani text-lg font-bold tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
              >
                <span>Przejdź do kasy</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-center text-xs font-rajdhani font-semibold text-gray-500 tracking-wider">
                <p>Bezpieczne płatności z certyfikatem SSL</p>
              </div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
