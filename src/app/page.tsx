"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { insforge } from "@/lib/insforge"
import { Product, useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { Sparkles, Tag, ArrowRight, ShoppingCart, Percent } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [deals, setDeals] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({})
  const [heroVideoFailed, setHeroVideoFailed] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchFeaturedDeals = async () => {
      try {
        const { data, error } = await insforge.database
          .from("products")
          .select("*")
          .eq("is_on_deal", true)
          .limit(3)

        if (!error && data) {
          setDeals(data as Product[])
        }
      } catch (err) {
        console.error("Failed to load featured deals:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedDeals()
  }, [])

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent("/")}`)
      return
    }
    const finalPrice = product.is_on_deal
      ? parseFloat(product.price) * (1 - product.discount_percent / 100)
      : parseFloat(product.price)

    const res = await addToCart(product.id, finalPrice)
    if (res.success) {
      // visual feedback could go here
    } else {
      alert(res.error)
    }
  }

  return (
    <div className='min-h-screen flex flex-col bg-[#0a0a0a] text-white'>
      <Navbar />

      {/* Hero Section */}
      <section className='relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8'>
        {/* Background Spline Iframe - 3D scene */}
        <div className='absolute inset-0 z-0 pointer-events-none'>
          {!heroVideoFailed ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload='auto'
              crossOrigin='anonymous'
              poster='/hero.png'
              aria-hidden='true'
              onError={() => setHeroVideoFailed(true)}
              className='w-full h-full object-cover opacity-50 absolute inset-0 z-0'
              src='/hero-video.mp4'
            />
          ) : (
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,255,255,0.18),transparent_35%),linear-gradient(180deg,#020204,_#0a0a0a)]' />
          )}
        </div>

        {/* Shadow Overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent z-[1] pointer-events-none' />

        {/* Content Container */}
        <div className='relative z-10 max-w-7xl mx-auto text-center space-y-8 select-none'>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neonCyan/30 bg-neonCyan/5 shadow-[0_0_15px_rgba(0,255,255,0.1)] text-neonCyan font-rajdhani text-sm font-bold tracking-widest uppercase'
          >
            <Sparkles className='w-4 h-4' />
            <span>Złota Generacja Powraca</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className='font-orbitron font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-wider leading-none'
          >
            KULTOWE GRY NA <br />
            <span className='text-gradient'>XBOX 360</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className='font-rajdhani text-lg sm:text-2xl text-gray-300 max-w-3xl mx-auto font-semibold tracking-wider leading-relaxed'
          >
            Odkryj na nowo niesamowite emocje. Oryginalne hity, legendarne
            edycje i epickie kampanie z generacji konsoli, która zdefiniowała
            nowoczesny gaming.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className='flex flex-col sm:flex-row items-center justify-center gap-6 pt-4'
          >
            <Link
              href='/store'
              className='flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-neonCyan to-neonBlue text-black font-rajdhani text-lg font-bold tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 group'
            >
              <span>Wejdź do Sklepu</span>
              <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </Link>

            <Link
              href='/deals'
              className='flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 border border-white/10 hover:border-neonPink bg-white/5 hover:bg-neonPink/10 text-white font-rajdhani text-lg font-bold tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(255,105,180,0.3)] transition-all duration-300 group'
            >
              <Tag className='w-5 h-5 text-neonPink group-hover:rotate-12 transition-transform' />
              <span>Zobacz Promocje</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Deals Section */}
      <section className='relative z-10 py-24 bg-[#0a0a0a] border-t border-white/5 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='flex flex-col md:flex-row items-center justify-between mb-16 gap-6'>
            <div>
              <div className='flex items-center gap-2 text-neonPink text-glow-pink font-rajdhani text-base font-bold tracking-widest uppercase mb-2'>
                <Percent className='w-4 h-4' />
                <span>Gorące Oferty</span>
              </div>
              <h2 className='font-orbitron font-extrabold text-3xl sm:text-4xl tracking-wider'>
                NAJLEPSZE OKAZJE
              </h2>
            </div>
            <Link
              href='/deals'
              className='flex items-center gap-2 font-rajdhani text-lg font-bold tracking-wider text-neonPink hover:text-white transition-colors duration-300 group'
            >
              <span>Zobacz wszystkie zniżki</span>
              <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </Link>
          </div>

          {/* Deals Grid */}
          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='h-[450px] rounded-2xl bg-white/5 border border-white/10 animate-pulse'
                />
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {deals.map((product, idx) => {
                const priceNum = parseFloat(product.price)
                const discountPrice =
                  priceNum * (1 - product.discount_percent / 100)

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className='group relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-neonPink shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(255,105,180,0.2)] transition-all duration-300 flex flex-col h-full'
                  >
                    {/* Discount badge */}
                    <div className='absolute top-4 left-4 z-10 px-3 py-1 bg-neonPink text-black font-orbitron text-xs font-black rounded-lg shadow-[0_0_10px_#ff69b4] flex items-center gap-1 uppercase'>
                      <Percent className='w-3.5 h-3.5' />
                      <span>-{product.discount_percent}%</span>
                    </div>

                    {/* Image Area */}
                    <div className='relative aspect-[1/1] w-full overflow-hidden bg-black/40'>
                      <Image
                        src={
                          failedImages[product.id]
                            ? `https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80&text=${encodeURIComponent(product.name)}`
                            : product.image_url
                        }
                        alt={product.name}
                        fill
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        className='object-cover transform group-hover:scale-110 duration-500'
                        onError={() => {
                          setFailedImages((prev) => ({
                            ...prev,
                            [product.id]: true,
                          }))
                        }}
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100' />
                    </div>

                    {/* Content */}
                    <div className='p-6 flex flex-col flex-grow'>
                      <span className='text-xs font-rajdhani font-bold tracking-widest text-neonPink uppercase mb-2'>
                        {product.category_id === 1 && "Strzelanka"}
                        {product.category_id === 2 && "RPG"}
                        {product.category_id === 3 && "Wyścigi"}
                        {product.category_id === 4 && "Przygodowa"}
                        {product.category_id === 5 && "Akcji"}
                      </span>

                      <h3 className='font-orbitron font-bold text-xl tracking-wide group-hover:text-neonPink transition-colors mb-3 line-clamp-1'>
                        {product.name}
                      </h3>

                       <div className="relative group/desc mb-4 cursor-pointer">
                          <p className="font-rajdhani text-sm text-gray-400 font-semibold tracking-wider line-clamp-2">
                            {product.description}
                          </p>
                          {/* Tooltip z pełnym opisem */}
                          <div className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-64 opacity-0 group-hover/desc:opacity-100 transition-opacity duration-200">
                            <div className="rounded-xl bg-[#111] border border-neonCyan/20 shadow-[0_0_20px_rgba(0,255,255,0.1)] backdrop-blur-md p-3">
                              <p className="font-rajdhani text-sm text-gray-300 font-semibold tracking-wider leading-relaxed">
                                {product.description}
                              </p>
                            </div>
                            {/* Strzałka tooltipa */}
                            <div className="w-3 h-3 bg-[#111] border-r border-b border-neonCyan/20 rotate-45 ml-4 -mt-1.5" />
                          </div>
                        </div>

                      {/* Pricing */}
                      <div className='mt-auto flex items-end justify-between'>
                        <div className='flex flex-col'>
                          <span className='text-xs text-gray-500 line-through leading-none mb-1'>
                            {priceNum.toFixed(2)} PLN
                          </span>
                          <span className='font-orbitron font-extrabold text-2xl text-white text-glow-pink'>
                            {discountPrice.toFixed(2)}{" "}
                            <span className='text-sm font-bold'>PLN</span>
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(product)}
                          className='flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white/5 hover:bg-neonPink border border-white/10 hover:border-neonPink hover:text-black font-rajdhani text-sm font-bold tracking-widest uppercase rounded-xl transition-all duration-300 active:scale-95 shadow-[0_0_10px_rgba(255,105,180,0.05)] hover:shadow-[0_0_15px_rgba(255,105,180,0.4)]'
                        >
                          <ShoppingCart className='w-4 h-4' />
                          <span>Kup</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
