'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { insforge } from '@/lib/insforge';
import { 
  CreditCard, 
  MapPin, 
  ShoppingBag, 
  ChevronRight, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Gamepad2, 
  Info,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { cartItems, loading: cartLoading, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  // Shipping form state
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('Polska');
  
  // Validation / Loading states
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading = authLoading || cartLoading;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Reset validation error
    setValidationError('');

    // Basic validation
    if (!street.trim()) return setValidationError('Podaj ulicę i numer domu/mieszkania.');
    if (!city.trim()) return setValidationError('Podaj nazwę miasta.');
    if (!zip.trim()) return setValidationError('Podaj kod pocztowy (np. 00-000).');
    if (!zip.match(/^\d{2}-\d{3}$/) && !zip.match(/^\d{5}$/)) {
      return setValidationError('Podaj poprawny format kodu pocztowego (np. 00-000 lub 00000).');
    }
    if (!country.trim()) return setValidationError('Podaj kraj dostawy.');

    setIsSubmitting(true);

    try {
      // Step 1: Insert to 'orders' table. Remember SDK inserts must be array format!
      const { data: orderData, error: orderErr } = await insforge.database
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total_amount: cartTotal.toString(),
            status: 'completed', // Complete checkout successfully
            shipping_address: { street, city, zip, country }
          }
        ])
        .select();

      if (orderErr) {
        throw new Error(orderErr.message || 'Nie udało się utworzyć zamówienia.');
      }

      if (!orderData || orderData.length === 0) {
        throw new Error('Brak danych powrotnych z bazy po utworzeniu zamówienia.');
      }

      const orderId = orderData[0].id;

      // Step 2: Prepare order_items payload
      const orderItemsPayload = cartItems.map((item) => {
        const unitPrice = parseFloat(item.products.price);
        const finalPrice = item.products.is_on_deal
          ? unitPrice * (1 - item.products.discount_percent / 100)
          : unitPrice;

        return {
          order_id: orderId,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: finalPrice.toString()
        };
      });

      // Step 3: Insert to 'order_items' table. payload is already an array
      const { error: itemsErr } = await insforge.database
        .from('order_items')
        .insert(orderItemsPayload);

      if (itemsErr) {
        throw new Error(itemsErr.message || 'Nie udało się dodać elementów do zamówienia.');
      }

      // Step 4: Clear user cart
      await clearCart();

      // Step 5: Redirect to orders success page
      router.push('/orders?success=true');
    } catch (err) {
      console.error('Checkout error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd podczas finalizacji zamówienia.';
      setValidationError(errorMessage);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-neonCyan border-white/10 animate-spin shadow-[0_0_15px_#00ffff]" />
        </div>
        <Footer />
      </div>
    );
  }

  // If user is logged in but cart is empty
  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white relative">
      <Navbar />

      {/* Retro Sci-fi Ambient Glows */}
      <div className="absolute top-24 right-1/4 w-[600px] h-[600px] rounded-full bg-neonCyan/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-24 left-1/4 w-[600px] h-[600px] rounded-full bg-neonBlue/5 blur-[120px] pointer-events-none" />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 w-full">
        
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-xl bg-neonCyan/10 border border-neonCyan/20 shadow-[0_0_10px_rgba(0,255,255,0.2)] flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-neonCyan" />
          </div>
          <div>
            <h1 className="font-orbitron font-extrabold text-2xl sm:text-4xl tracking-widest text-glow-cyan uppercase">
              BEZPIECZNA <span className="text-gradient">KASA</span>
            </h1>
            <p className="font-rajdhani text-gray-400 font-semibold tracking-wider text-sm">
              Sfinalizuj zamówienie i uzyskaj natychmiastowy dostęp do licencji.
            </p>
          </div>
        </div>

        {isCartEmpty ? (
          /* Cart is Empty Warning State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-16 text-center shadow-lg space-y-6 max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-500">
              <ShoppingBag className="w-8 h-8 text-neonCyan" />
            </div>
            <h3 className="font-orbitron font-bold text-xl text-white tracking-widest uppercase">
              Koszyk jest pusty!
            </h3>
            <p className="font-rajdhani text-gray-400 max-w-sm mx-auto font-semibold">
              Nie masz żadnych produktów w koszyku. Aby przejść do kasy, musisz najpierw dodać gry ze sklepu.
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
          /* Checkout Grid layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Column (7/12) */}
            <div className="lg:col-span-7">
              <motion.form 
                onSubmit={handleCheckoutSubmit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                
                {/* Billing details heading */}
                <div className="flex items-center gap-2 pb-4 border-b border-white/5">
                  <MapPin className="w-5 h-5 text-neonCyan shrink-0" />
                  <h3 className="font-orbitron font-bold text-lg tracking-wider text-white uppercase">
                    ADRES DOSTAWY & ROZLICZEŃ
                  </h3>
                </div>

                {/* Validation Alerts */}
                {validationError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="font-rajdhani font-semibold text-sm text-red-200 tracking-wider">
                      {validationError}
                    </p>
                  </div>
                )}

                {/* Form fields */}
                <div className="space-y-4">
                  
                  {/* Contact Info (Read-only for aesthetic validation) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block font-rajdhani text-sm font-bold tracking-wider text-gray-400 uppercase">
                        Konto Kupującego
                      </label>
                      <input
                        type="text"
                        value={user?.profile?.name || 'Gracz'}
                        disabled
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-rajdhani text-base font-semibold text-gray-400 cursor-not-allowed select-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block font-rajdhani text-sm font-bold tracking-wider text-gray-400 uppercase">
                        Adres Email
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-rajdhani text-base font-semibold text-gray-400 cursor-not-allowed select-none"
                      />
                    </div>
                  </div>

                  {/* Street address */}
                  <div className="space-y-2">
                    <label className="block font-rajdhani text-sm font-bold tracking-wider text-gray-300 uppercase">
                      Ulica i numer domu <span className="text-neonPink">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="np. Klonowa 15 m. 4"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 focus:border-neonCyan rounded-xl px-4 py-3 font-rajdhani text-base font-semibold text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-neonCyan transition-all duration-300"
                      required
                    />
                  </div>

                  {/* City and Zip */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block font-rajdhani text-sm font-bold tracking-wider text-gray-300 uppercase">
                        Kod pocztowy <span className="text-neonPink">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="np. 00-123"
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 focus:border-neonCyan rounded-xl px-4 py-3 font-rajdhani text-base font-semibold text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-neonCyan transition-all duration-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block font-rajdhani text-sm font-bold tracking-wider text-gray-300 uppercase">
                        Miasto <span className="text-neonPink">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="np. Warszawa"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 focus:border-neonCyan rounded-xl px-4 py-3 font-rajdhani text-base font-semibold text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-neonCyan transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <label className="block font-rajdhani text-sm font-bold tracking-wider text-gray-300 uppercase">
                      Kraj <span className="text-neonPink">*</span>
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 focus:border-neonCyan rounded-xl px-4 py-3 font-rajdhani text-base font-semibold text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-neonCyan transition-all duration-300"
                      required
                    />
                  </div>

                </div>

                {/* Digital Delivery info */}
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-start gap-3">
                  <Truck className="w-5 h-5 text-neonCyan shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-orbitron font-bold text-xs text-white uppercase">
                      Dystrybucja Cyfrowa (Dostawa 0s)
                    </h4>
                    <p className="font-rajdhani text-xs font-semibold text-gray-400 mt-1">
                      Klucze aktywacyjne gier są dostarczane na Twój zarejestrowany email oraz pojawiają się natychmiast po zamówieniu w zakładce &quot;Zamówienia&quot;.
                    </p>
                  </div>
                </div>

                {/* Safe purchase check */}
                <div className="flex items-center gap-2 text-xs font-rajdhani font-semibold text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-xboxGreen" />
                  <span>Certyfikat SSL chroni Twoje dane adresowe i transakcyjne.</span>
                </div>

                {/* Checkout Submit Action button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-neonCyan to-neonBlue disabled:from-gray-700 disabled:to-gray-800 text-black font-rajdhani text-lg font-bold tracking-widest uppercase rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:scale-100 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>PRZETWARZANIE ZAMÓWIENIA...</span>
                    </>
                  ) : (
                    <>
                      <span>SFINALIZUJ ZAMÓWIENIE (KUPUJĘ)</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

              </motion.form>
            </div>

            {/* Order Summary Column (5/12) */}
            <div className="lg:col-span-5 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                <h3 className="font-orbitron font-bold text-lg tracking-wider text-neonCyan uppercase">
                  PODSUMOWANIE ZAMÓWIENIA
                </h3>
                <div className="h-0.5 bg-gradient-to-r from-neonCyan to-neonBlue shadow-[0_0_8px_#00ffff]" />

                {/* Items Mini-list */}
                <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item) => {
                    const unitPrice = parseFloat(item.products.price);
                    const finalUnitPrice = item.products.is_on_deal
                      ? unitPrice * (1 - item.products.discount_percent / 100)
                      : unitPrice;
                    const itemTotal = finalUnitPrice * item.quantity;

                    return (
                      <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0 items-center">
                        {/* Mini image */}
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden shrink-0 bg-black/50 border border-white/5">
                          <Image
                            src={failedImages[item.id] ? `https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=100&auto=format&fit=crop&q=80` : item.products.image_url}
                            alt={item.products.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                            onError={() => {
                              setFailedImages(prev => ({ ...prev, [item.id]: true }));
                            }}
                          />
                        </div>
                        {/* Title and qty */}
                        <div className="flex-grow min-w-0">
                          <h4 className="font-orbitron font-bold text-sm text-white truncate">
                            {item.products.name}
                          </h4>
                          <p className="font-rajdhani text-xs font-semibold text-gray-500 tracking-wider">
                            Ilość: {item.quantity} x {finalUnitPrice.toFixed(2)} PLN
                          </p>
                        </div>
                        {/* Total price for this item */}
                        <div className="shrink-0 text-right select-none">
                          <span className="font-orbitron font-bold text-sm text-white">
                            {itemTotal.toFixed(2)} <span className="text-[10px] font-bold">PLN</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-white/5 pt-6 space-y-4 font-rajdhani font-semibold tracking-wider text-base">
                  <div className="flex justify-between text-gray-400">
                    <span>Razem produkty</span>
                    <span className="text-white font-bold">
                      {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} szt.
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Wysyłka Cyfrowa</span>
                    <span className="text-neonCyan text-glow-cyan font-orbitron text-xs font-black uppercase">BEZPŁATNA</span>
                  </div>
                  
                  <div className="border-t border-white/5 pt-4 flex justify-between items-end">
                    <span className="text-gray-300 font-bold">ŁĄCZNA CENA</span>
                    <div className="text-right">
                      <span className="font-orbitron font-black text-2xl text-white text-glow-cyan">
                        {cartTotal.toFixed(2)} <span className="text-sm font-bold">PLN</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Support info card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-neonPink/10 flex items-center justify-center shrink-0 border border-neonPink/20 text-neonPink">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-orbitron font-bold text-sm text-white uppercase">
                    GWARANCJA COMPATIBILITY
                  </h4>
                  <p className="font-rajdhani text-xs font-semibold text-gray-400 mt-1">
                    Wszystkie oferowane kody pochodzą z oficjalnej retro-dystrybucji. Gwarantujemy poprawne działanie kluczy aktywacyjnych na konsolach Xbox 360 oraz w trybie wstecznej kompatybilności na Xbox One i Xbox Series X/S.
                  </p>
                </div>
              </motion.div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
