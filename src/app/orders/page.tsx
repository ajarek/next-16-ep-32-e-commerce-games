'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { insforge } from '@/lib/insforge';
import { 
  Package, 
  Gamepad, 
  Copy, 
  Check, 
  Clock, 
  ShoppingBag, 
  ArrowRight,
  Calendar,
  CreditCard,
  KeyRound,
  MapPin,
  PartyPopper
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: string;
  image_url: string;
}

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: string;
  products: Product;
}

interface Order {
  id: number;
  user_id: string;
  total_amount: string;
  status: string;
  shipping_address: {
    street: string;
    city: string;
    zip: string;
    country: string;
  } | null;
  created_at: string;
  order_items: OrderItem[];
}

function OrdersContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const showSuccessBanner = searchParams.get('success') === 'true';

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        // Fetch orders and join order_items, then products
        const { data, error } = await insforge.database
          .from('orders')
          .select('*, order_items(*, products(*))')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Failed to fetch orders:', error);
        } else if (data) {
          setOrders(data as Order[]);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (user) {
      fetchOrders();
    } else if (!authLoading) {
      setLoadingOrders(false);
    }
  }, [user, authLoading]);

  // Copy helper
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Pseudo key generator for classic Xbox 360 25-digit code experience
  const generateGameKey = (orderId: number, productId: number) => {
    const seed = (orderId * 9301 + productId * 49297) % 233280;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid lookalikes (0/O, 1/I)
    
    let key = '';
    for (let i = 0; i < 25; i++) {
      if (i > 0 && i % 5 === 0) key += '-';
      const charIndex = Math.floor(((seed * (i + 13)) % 1000) / 1000 * chars.length);
      key += chars[charIndex % chars.length];
    }
    return key;
  };

  const isLoading = authLoading || loadingOrders;

  return (
    <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 w-full">
      
      {/* Success Notification Banner */}
      <AnimatePresence>
        {showSuccessBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="mb-10 p-6 rounded-2xl bg-xboxGreen/10 border border-xboxGreen/30 shadow-[0_0_20px_rgba(16,124,16,0.2)] flex flex-col sm:flex-row items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-xboxGreen shadow-[0_0_15px_#107c10] flex items-center justify-center shrink-0">
              <PartyPopper className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div className="text-center sm:text-left flex-grow">
              <h3 className="font-orbitron font-extrabold text-lg text-white tracking-widest uppercase">
                ZAMÓWIENIE ZAKOŃCZONE SUKCESEM!
              </h3>
              <p className="font-rajdhani text-sm text-gray-300 font-semibold tracking-wider mt-1">
                Dziękujemy za zakup! Twoje licencje zostały aktywowane i przypisane do Twojego konta. Poniżej znajdziesz klucze aktywacyjne.
              </p>
            </div>
            <div className="px-4 py-1.5 bg-xboxGreen/20 border border-xboxGreen/40 rounded-lg text-xs font-orbitron font-black text-white uppercase tracking-widest animate-pulse">
              ODBLOKOWANO
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Title */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 rounded-xl bg-neonPink/10 border border-neonPink/20 shadow-[0_0_10px_rgba(255,105,180,0.2)] flex items-center justify-center">
          <Package className="w-6 h-6 text-neonPink" />
        </div>
        <div>
          <h1 className="font-orbitron font-extrabold text-2xl sm:text-4xl tracking-widest text-glow-pink uppercase">
            MOJE <span className="text-gradient-orange-pink">ZAMÓWIENIA</span>
          </h1>
          <p className="font-rajdhani text-gray-400 font-semibold tracking-wider text-sm">
            Przeglądaj historię zakupów i zarządzaj swoimi cyfrowymi licencjami gier.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-neonPink border-white/10 animate-spin shadow-[0_0_15px_rgba(255,105,180,0.4)]" />
        </div>
      ) : !user ? (
        /* Not logged in redirect indicator just in case */
        <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-16 text-center shadow-lg space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-500">
            <Gamepad className="w-8 h-8 text-neonPink animate-pulse" />
          </div>
          <h3 className="font-orbitron font-bold text-xl text-white tracking-widest uppercase">
            Brak dostępu
          </h3>
          <p className="font-rajdhani text-gray-400 max-w-sm mx-auto font-semibold">
            Musisz być zalogowany, aby przeglądać swoje zamówienia.
          </p>
          <Link
            href="/login?redirect=/orders"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neonCyan to-neonBlue text-black font-rajdhani text-sm font-bold tracking-wider rounded-xl"
          >
            <span>Zaloguj się</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : orders.length === 0 ? (
        /* Empty history state */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-16 text-center shadow-lg space-y-6 max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-500">
            <ShoppingBag className="w-8 h-8 text-neonPink" />
          </div>
          <h3 className="font-orbitron font-bold text-xl text-white tracking-widest uppercase">
            Brak zakupionych gier
          </h3>
          <p className="font-rajdhani text-gray-400 max-w-sm mx-auto font-semibold">
            Nie dokonałeś jeszcze żadnych zakupów w naszym sklepie. Zobacz naszą ofertę kultowych tytułów!
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
        /* Orders list */
        <div className="space-y-8">
          {orders.map((order, orderIdx) => {
            const formattedDate = new Date(order.created_at).toLocaleDateString('pl-PL', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: orderIdx * 0.1 }}
                className="backdrop-blur-md bg-black/40 border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all"
              >
                
                {/* Order Top Banner */}
                <div className="bg-white/5 border-b border-white/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
                  
                  {/* ID and Date info */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <span className="font-rajdhani text-xs font-bold text-gray-500 tracking-wider block uppercase">Numer Zamówienia</span>
                      <span className="font-orbitron font-extrabold text-white text-glow-cyan text-base">
                        #X360-{10000 + order.id}
                      </span>
                    </div>
                    
                    <div className="h-8 w-px bg-white/10 hidden sm:block" />

                    <div>
                      <span className="font-rajdhani text-xs font-bold text-gray-500 tracking-wider block uppercase">Data Zakupu</span>
                      <span className="font-rajdhani text-sm font-bold text-gray-300 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-neonCyan" />
                        {formattedDate}
                      </span>
                    </div>
                  </div>

                  {/* Pricing and status info */}
                  <div className="flex items-center gap-6 self-start md:self-auto">
                    <div>
                      <span className="font-rajdhani text-xs font-bold text-gray-500 tracking-wider block text-left md:text-right uppercase">Suma</span>
                      <span className="font-orbitron font-black text-lg text-white">
                        {parseFloat(order.total_amount).toFixed(2)} <span className="text-xs font-bold text-gray-400">PLN</span>
                      </span>
                    </div>

                    <div className="h-8 w-px bg-white/10" />

                    <div>
                      <span className="font-rajdhani text-xs font-bold text-gray-500 tracking-wider block text-left md:text-right uppercase">Status</span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-orbitron font-black bg-xboxGreen/10 border border-xboxGreen/30 text-xboxGreen tracking-widest uppercase shadow-[0_0_8px_rgba(16,124,16,0.1)]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Zrealizowane</span>
                      </span>
                    </div>
                  </div>

                </div>

                {/* Details layout: Left: items list & keys, Right: shipping address */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Items column */}
                  <div className="lg:col-span-8 space-y-6">
                    <h4 className="font-orbitron font-bold text-xs text-gray-400 tracking-widest uppercase">
                      ZAKUPIONE KLUCZE DO GIER
                    </h4>
                    
                    <div className="space-y-4">
                      {order.order_items.map((item) => {
                        const generatedKey = generateGameKey(order.id, item.product_id);
                        const isCopied = copiedKey === generatedKey;

                        return (
                          <div 
                            key={item.id} 
                            className="p-4 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                          >
                            
                            {/* Product Info */}
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-12 h-12 relative rounded-lg overflow-hidden shrink-0 border border-white/5 bg-black/60">
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
                              <div className="min-w-0">
                                <h5 className="font-orbitron font-extrabold text-sm text-white truncate">
                                  {item.products.name}
                                </h5>
                                <p className="font-rajdhani text-xs font-semibold text-gray-500 tracking-wider">
                                  Ilość: {item.quantity} x {parseFloat(item.price_at_purchase).toFixed(2)} PLN
                                </p>
                              </div>
                            </div>

                            {/* Product Activation Key Card */}
                            <div className="flex-grow max-w-full md:max-w-md">
                              <div className="bg-black/60 border border-white/10 rounded-xl p-2.5 flex items-center justify-between gap-3 shadow-inner">
                                <div className="flex items-center gap-2 min-w-0">
                                  <KeyRound className="w-4 h-4 text-neonPink shrink-0" />
                                  <code className="font-orbitron font-bold text-xs sm:text-sm text-neonPink text-glow-pink tracking-wider select-all truncate">
                                    {generatedKey}
                                  </code>
                                </div>
                                
                                <button
                                  onClick={() => handleCopyKey(generatedKey)}
                                  className={`p-2 rounded-lg border transition-all shrink-0 ${
                                    isCopied
                                      ? 'border-xboxGreen bg-xboxGreen/10 text-xboxGreen'
                                      : 'border-white/10 hover:border-neonPink bg-white/5 text-gray-400 hover:text-white'
                                  }`}
                                  title="Skopiuj klucz"
                                >
                                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shipping address details (4/12) */}
                  <div className="lg:col-span-4 lg:border-l lg:border-white/5 lg:pl-8 space-y-4">
                    <h4 className="font-orbitron font-bold text-xs text-gray-400 tracking-widest uppercase flex items-center gap-1.5 select-none">
                      <MapPin className="w-4 h-4 text-neonCyan" />
                      <span>ADRES DOSTAWY</span>
                    </h4>

                    {order.shipping_address ? (
                      <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2 font-rajdhani text-sm font-semibold tracking-wider text-gray-300">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Ulica:</span>
                          <span className="text-white text-right">{order.shipping_address.street}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Kod pocztowy:</span>
                          <span className="text-white text-right">{order.shipping_address.zip}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Miasto:</span>
                          <span className="text-white text-right">{order.shipping_address.city}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Kraj:</span>
                          <span className="text-white text-right">{order.shipping_address.country}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-white/5 border border-white/5 rounded-xl font-rajdhani text-xs text-gray-500 italic">
                        Brak informacji adresowej.
                      </div>
                    )}

                    {/* Quick play tips */}
                    <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-2">
                      <h5 className="font-orbitron font-bold text-[10px] text-white tracking-widest uppercase flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-neonCyan" />
                        <span>INSTRUKCJA AKTYWACJI</span>
                      </h5>
                      <ol className="list-decimal pl-4 font-rajdhani text-xs text-gray-400 font-semibold tracking-wider space-y-1.5">
                        <li>Zaloguj się na konsoli Xbox lub xbox.com</li>
                        <li>Przejdź do zakładki &quot;Redeem Code&quot; (Zrealizuj kod)</li>
                        <li>Wklej skopiowany 25-cyfrowy kod aktywacyjny</li>
                        <li>Pobierz i ciesz się kultową klasyką!</li>
                      </ol>
                    </div>
                  </div>

                </div>

              </motion.div>
            );
          })}
        </div>
      )}

    </main>
  );
}

export default function OrdersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white relative">
      <Navbar />

      {/* Retro Sci-fi Ambient Glows */}
      <div className="absolute top-24 left-1/4 w-[600px] h-[600px] rounded-full bg-neonCyan/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-24 right-1/4 w-[600px] h-[600px] rounded-full bg-neonPink/5 blur-[120px] pointer-events-none" />

      <Suspense fallback={
        <div className="flex-grow flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-t-neonPink border-white/10 animate-spin shadow-[0_0_15px_rgba(255,105,180,0.4)]" />
        </div>
      }>
        <OrdersContent />
      </Suspense>

      <Footer />
    </div>
  );
}
