'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { insforge } from '@/lib/insforge';
import { Product, useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Search, SlidersHorizontal, Gamepad2, ShoppingCart, Percent, 
  ChevronDown, ArrowUpDown, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  id: number;
  name: string;
  slug: string;
}

function StoreContent() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Core API State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  // Filter & Sort State (initialized from URL if present)
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [selectedCats, setSelectedCats] = useState<number[]>(() => {
    const catsParam = searchParams.get('categories');
    return catsParam ? catsParam.split(',').map(Number) : [];
  });
  const [maxPrice, setMaxPrice] = useState<number>(() => {
    const priceParam = searchParams.get('price');
    return priceParam ? Number(priceParam) : 350;
  });
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'newest');

  // Mobile filters toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          insforge.database.from('products').select('*'),
          insforge.database.from('categories').select('*')
        ]);

        if (prodRes.data) {
          setProducts(prodRes.data as Product[]);
        }
        if (catRes.data) {
          setCategories(catRes.data as Category[]);
        }
      } catch (err) {
        console.error('Failed to load store data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update URL parameters when state changes (debounced or standard)
  const updateUrlParams = useCallback((
    q: string, 
    cats: number[], 
    price: number, 
    sort: string
  ) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (cats.length > 0) params.set('categories', cats.join(','));
    if (price !== 350) params.set('price', price.toString());
    if (sort !== 'newest') params.set('sort', sort);

    const query = params.toString();
    router.replace(`/store${query ? `?${query}` : ''}`, { scroll: false });
  }, [router]);

  // Synchronize state updates with URL
  useEffect(() => {
    updateUrlParams(search, selectedCats, maxPrice, sortBy);
  }, [search, selectedCats, maxPrice, sortBy, updateUrlParams]);

  // Toggle Category Selection
  const handleCategoryToggle = (catId: number) => {
    setSelectedCats(prev => 
      prev.includes(catId) 
        ? prev.filter(id => id !== catId) 
        : [...prev, catId]
    );
  };

  // Clear All Filters
  const handleResetFilters = () => {
    setSearch('');
    setSelectedCats([]);
    setMaxPrice(350);
    setSortBy('newest');
  };

  // Add to Cart handler
  const handleAddToCart = async (product: Product) => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent('/store')}`);
      return;
    }
    const finalPrice = product.is_on_deal
      ? parseFloat(product.price) * (1 - product.discount_percent / 100)
      : parseFloat(product.price);

    const res = await addToCart(product.id, finalPrice);
    if (!res.success) {
      alert(res.error);
    }
  };

  // Process Filtering and Sorting on Client-Side
  const filteredProducts = products.filter(product => {
    // Search query matches title or description
    const matchesSearch = search.trim() === '' || 
      product.name.toLowerCase().includes(search.toLowerCase()) || 
      (product.description && product.description.toLowerCase().includes(search.toLowerCase()));

    // Category matches
    const matchesCategory = selectedCats.length === 0 || 
      (product.category_id !== null && selectedCats.includes(product.category_id));

    // Price matches (consider deal price if discount is active)
    const currentPrice = product.is_on_deal
      ? parseFloat(product.price) * (1 - product.discount_percent / 100)
      : parseFloat(product.price);
    const matchesPrice = currentPrice <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Apply Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const getFinalPrice = (p: Product) => p.is_on_deal
      ? parseFloat(p.price) * (1 - p.discount_percent / 100)
      : parseFloat(p.price);

    switch (sortBy) {
      case 'price-asc':
        return getFinalPrice(a) - getFinalPrice(b);
      case 'price-desc':
        return getFinalPrice(b) - getFinalPrice(a);
      case 'alpha-asc':
        return a.name.localeCompare(b.name);
      case 'alpha-desc':
        return b.name.localeCompare(a.name);
      case 'newest':
      default:
        // Assume higher id is newer if no explicit date exists
        return b.id - a.id;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      
      {/* Title Header */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neonCyan/30 bg-neonCyan/5 text-neonCyan font-rajdhani text-xs sm:text-sm font-bold tracking-widest uppercase mb-4 shadow-[0_0_10px_rgba(0,255,255,0.1)]">
          <Gamepad2 className="w-4 h-4" />
          BIBLIOTEKA KLASYKÓW
        </span>
        <h1 className="font-orbitron font-extrabold text-3xl sm:text-5xl tracking-widest text-glow-cyan mb-4">
          CYFROWY <span className="text-gradient">KATALOG</span>
        </h1>
        <p className="font-rajdhani text-gray-400 max-w-2xl mx-auto font-semibold tracking-wider text-base sm:text-lg">
          Filtruj, przeszukuj i odkrywaj niesamowite dzieła minionej epoki. Błyskawiczna wysyłka cyfrowa na Twój profil gracza.
        </p>
      </div>

      {/* Grid Layout: Filters on Left, Grid on Right */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block w-80 shrink-0 backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-6 space-y-8 sticky top-24 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div>
            <h3 className="font-orbitron font-bold text-lg tracking-wider text-neonCyan mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              FILTRY
            </h3>
            <div className="h-0.5 bg-gradient-to-r from-neonCyan to-neonBlue mb-6 shadow-[0_0_8px_#00ffff]" />
          </div>

          {/* Search Box */}
          <div className="space-y-2">
            <label className="block font-rajdhani font-bold text-sm text-gray-400 tracking-wider">SZUKAJ GRY</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Napisz np. Halo, Gears..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-neonCyan focus:ring-1 focus:ring-neonCyan text-white font-rajdhani text-base tracking-wider placeholder-gray-600 focus:outline-none transition-colors"
              />
              <Search className="w-5 h-5 text-gray-500 absolute left-3 top-3" />
            </div>
          </div>

          {/* Categories checkboxes */}
          <div className="space-y-4">
            <label className="block font-rajdhani font-bold text-sm text-gray-400 tracking-wider">KATEGORIE</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {categories.map(cat => (
                <label key={cat.id} className="flex items-center gap-3 cursor-pointer group text-gray-300 hover:text-white transition-colors">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedCats.includes(cat.id)}
                      onChange={() => handleCategoryToggle(cat.id)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-md border transition-all duration-200 flex items-center justify-center ${
                      selectedCats.includes(cat.id) 
                        ? 'border-neonCyan bg-neonCyan/10 shadow-[0_0_8px_rgba(0,255,255,0.4)]' 
                        : 'border-white/20 bg-white/5 group-hover:border-white/40'
                    }`}>
                      {selectedCats.includes(cat.id) && (
                        <div className="w-2.5 h-2.5 rounded-sm bg-neonCyan" />
                      )}
                    </div>
                  </div>
                  <span className="font-rajdhani text-base tracking-wide font-semibold">
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center font-rajdhani font-bold text-sm tracking-wider">
              <span className="text-gray-400">MAKS. CENA</span>
              <span className="text-neonCyan text-glow-cyan font-orbitron">{maxPrice} PLN</span>
            </div>
            <input
              type="range"
              min="0"
              max="350"
              step="10"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neonCyan"
            />
            <div className="flex justify-between text-xs font-rajdhani font-bold text-gray-600">
              <span>0 PLN</span>
              <span>350 PLN</span>
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={handleResetFilters}
            className="w-full py-3 border border-white/10 hover:border-neonPink bg-white/5 hover:bg-neonPink/10 text-white font-rajdhani text-sm font-bold tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(255,105,180,0.2)]"
          >
            <X className="w-4 h-4 text-neonPink" />
            <span>Wyczyść Filtry</span>
          </button>
        </aside>

        {/* Content Area (Sort Bar + Products Grid) */}
        <div className="flex-grow w-full space-y-6">
          
          {/* Top Sort & Count Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 w-full">
            <span className="font-rajdhani text-base font-semibold tracking-wider text-gray-400">
              Znaleziono: <strong className="text-white font-bold">{filteredProducts.length}</strong> gier
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Mobile filter toggle trigger */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center justify-center gap-2 py-2 px-4 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 text-white font-rajdhani text-sm font-bold tracking-wider transition-all"
              >
                <SlidersHorizontal className="w-4 h-4 text-neonCyan" />
                <span>Filtry</span>
              </button>

              {/* Sort selector */}
              <div className="relative flex-grow sm:flex-grow-0 min-w-[160px]">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full appearance-none pl-10 pr-8 py-2.5 bg-black/40 border border-white/10 rounded-xl focus:border-neonCyan focus:ring-1 focus:ring-neonCyan text-white font-rajdhani text-sm font-bold tracking-wider focus:outline-none transition-colors"
                >
                  <option value="newest">Najnowsze</option>
                  <option value="price-asc">Cena: rosnąco</option>
                  <option value="price-desc">Cena: malejąco</option>
                  <option value="alpha-asc">Nazwa: A-Z</option>
                  <option value="alpha-desc">Nazwa: Z-A</option>
                </select>
                <ArrowUpDown className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Skeleton Loader while initial page load is ongoing */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div 
                  key={i} 
                  className="h-[430px] rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col justify-between p-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  <div className="space-y-4">
                    <div className="w-full aspect-video rounded-xl bg-white/5" />
                    <div className="h-4 bg-white/5 rounded w-1/3" />
                    <div className="h-6 bg-white/5 rounded w-3/4" />
                    <div className="h-4 bg-white/5 rounded w-full" />
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="h-8 bg-white/5 rounded w-1/3" />
                    <div className="h-10 bg-white/5 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            /* Premium Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-16 text-center shadow-lg space-y-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-neonPink/10 border border-neonPink/20 shadow-[0_0_15px_#ff69b4] flex items-center justify-center mx-auto">
                <Gamepad2 className="w-8 h-8 text-neonPink animate-pulse" />
              </div>
              <h3 className="font-orbitron font-bold text-xl sm:text-2xl text-white tracking-widest uppercase">
                Brak gier w wybranym filtrze
              </h3>
              <p className="font-rajdhani text-gray-400 font-semibold tracking-wider max-w-md mx-auto">
                Spróbuj złagodzić kryteria wyszukiwania, zmienić przedział cenowy lub wybrać inne kategorie, aby znaleźć to, czego szukasz.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-gradient-to-r from-neonCyan to-neonBlue text-black font-rajdhani text-sm font-bold tracking-widest uppercase rounded-xl shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:shadow-[0_0_20px_rgba(0,255,255,0.5)] active:scale-95 transition-all duration-300"
              >
                Pokaż wszystkie gry
              </button>
            </motion.div>
          ) : (
            /* Products Grid with Framer Motion Layout animations */
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {sortedProducts.map(product => {
                  const priceNum = parseFloat(product.price);
                  const discountPrice = priceNum * (1 - product.discount_percent / 100);
                  
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      key={product.id}
                      className="group relative backdrop-blur-md bg-white/5 border border-white/10 hover:border-neonCyan rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(0,255,255,0.15)] transition-all duration-300 flex flex-col h-full"
                    >
                      {/* Deal badge if product is on sale */}
                      {product.is_on_deal && (
                        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-neonPink text-black font-orbitron text-xs font-black rounded-lg shadow-[0_0_10px_#ff69b4] flex items-center gap-1 uppercase">
                          <Percent className="w-3.5 h-3.5" />
                          <span>-{product.discount_percent}%</span>
                        </div>
                      )}

                      {/* Image Area */}
                      <div className="relative aspect-[1/1] w-full overflow-hidden bg-black/40">
                        <Image
                          src={failedImages[product.id] ? `https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80&text=${encodeURIComponent(product.name)}` : product.image_url}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transform group-hover:scale-110 duration-500"
                          onError={() => {
                            setFailedImages(prev => ({ ...prev, [product.id]: true }));
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100" />
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        <span className="text-xs font-rajdhani font-bold tracking-widest text-neonCyan uppercase mb-2">
                          {categories.find(c => c.id === product.category_id)?.name || 'Xbox 360'}
                        </span>
                        
                        <h3 className="font-orbitron font-bold text-lg tracking-wide group-hover:text-neonCyan transition-colors mb-2 line-clamp-1">
                          {product.name}
                        </h3>

                        <p className="font-rajdhani text-sm text-gray-400 font-semibold tracking-wider line-clamp-2 mb-4">
                          {product.description}
                        </p>

                        {/* Pricing and Action */}
                        <div className="mt-auto flex items-end justify-between pt-2">
                          <div className="flex flex-col">
                            {product.is_on_deal ? (
                              <>
                                <span className="text-xs text-gray-500 line-through leading-none mb-1">
                                  {priceNum.toFixed(2)} PLN
                                </span>
                                <span className="font-orbitron font-extrabold text-xl text-white text-glow-pink">
                                  {discountPrice.toFixed(2)} <span className="text-xs font-bold">PLN</span>
                                </span>
                              </>
                            ) : (
                              <span className="font-orbitron font-extrabold text-xl text-white text-glow-cyan">
                                {priceNum.toFixed(2)} <span className="text-xs font-bold">PLN</span>
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`flex items-center justify-center gap-1.5 py-2 px-3.5 border font-rajdhani text-xs font-bold tracking-widest uppercase rounded-xl transition-all duration-300 active:scale-95 shadow-[0_0_10px_rgba(0,255,255,0.05)] ${
                              product.is_on_deal
                                ? 'bg-white/5 border-white/10 hover:bg-neonPink hover:border-neonPink hover:text-black hover:shadow-[0_0_15px_rgba(255,105,180,0.3)]'
                                : 'bg-white/5 border-white/10 hover:bg-neonCyan hover:border-neonCyan hover:text-black hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]'
                            }`}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Kup</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Filter (Responsive Modal) */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Sidebar content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 right-0 w-full max-w-sm bg-[#0d0d0d] border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-orbitron font-bold text-lg tracking-wider text-neonCyan flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    FILTRY
                  </h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1 rounded-full bg-white/5 border border-white/10 text-white hover:text-neonPink"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="h-0.5 bg-gradient-to-r from-neonCyan to-neonBlue shadow-[0_0_8px_#00ffff]" />

                {/* Search Box */}
                <div className="space-y-2">
                  <label className="block font-rajdhani font-bold text-xs text-gray-400 tracking-wider">SZUKAJ GRY</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Wpisz szukaną frazę..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-neonCyan text-white font-rajdhani placeholder-gray-600 focus:outline-none"
                    />
                    <Search className="w-5 h-5 text-gray-500 absolute left-3 top-3" />
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  <label className="block font-rajdhani font-bold text-xs text-gray-400 tracking-wider">KATEGORIE</label>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <label key={cat.id} className="flex items-center gap-3 cursor-pointer group text-gray-300">
                        <input
                          type="checkbox"
                          checked={selectedCats.includes(cat.id)}
                          onChange={() => handleCategoryToggle(cat.id)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                          selectedCats.includes(cat.id) 
                            ? 'border-neonCyan bg-neonCyan/10 shadow-[0_0_8px_rgba(0,255,255,0.4)]' 
                            : 'border-white/20 bg-white/5'
                        }`}>
                          {selectedCats.includes(cat.id) && (
                            <div className="w-2.5 h-2.5 rounded-sm bg-neonCyan" />
                          )}
                        </div>
                        <span className="font-rajdhani text-base font-semibold">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price range slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center font-rajdhani font-bold text-xs tracking-wider">
                    <span className="text-gray-400">MAKS. CENA</span>
                    <span className="text-neonCyan font-orbitron">{maxPrice} PLN</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="350"
                    step="10"
                    value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neonCyan"
                  />
                </div>
              </div>

              {/* Action Buttons in drawer */}
              <div className="pt-8 space-y-3">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 bg-gradient-to-r from-neonCyan to-neonBlue text-black font-rajdhani text-sm font-bold tracking-widest uppercase rounded-xl shadow-lg"
                >
                  Zastosuj Filtry
                </button>
                <button
                  onClick={() => {
                    handleResetFilters();
                    setShowMobileFilters(false);
                  }}
                  className="w-full py-3 border border-white/10 text-white font-rajdhani text-sm font-bold tracking-widest uppercase rounded-xl bg-white/5"
                >
                  Wyczyść Wszystko
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function StorePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Navbar />
      
      <main className="flex-grow relative">
        {/* Glow decoration */}
        <div className="absolute top-24 left-1/4 w-[500px] h-[500px] rounded-full bg-neonCyan/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-24 right-1/4 w-[500px] h-[500px] rounded-full bg-neonBlue/5 blur-[120px] pointer-events-none" />
        
        <Suspense fallback={
          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-t-neonCyan border-white/10 animate-spin shadow-[0_0_15px_#00ffff]" />
          </div>
        }>
          <StoreContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
