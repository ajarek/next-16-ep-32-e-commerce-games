"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { insforge } from "@/lib/insforge"
import { Product, useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import {
  Clock,
  Percent,
  ShoppingCart,
  ArrowRight,
  Tag,
  Flame,
} from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function DealsPage() {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const router = useRouter()

  const [deals, setDeals] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({})

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  })

  // Fetch only deals on load
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const { data, error } = await insforge.database
          .from("products")
          .select("*")
          .eq("is_on_deal", true)

        if (!error && data) {
          setDeals(data as Product[])
        }
      } catch (err) {
        console.error("Failed to fetch deals:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDeals()
  }, [])

  // 24h Countdown timer to midnight tonight
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const midnight = new Date()
      midnight.setHours(23, 59, 59, 999)

      const difference = midnight.getTime() - now.getTime()

      if (difference <= 0) {
        return { hours: 23, minutes: 59, seconds: 59 }
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      return { hours, minutes, seconds }
    }

    // Set initial
    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent("/deals")}`)
      return
    }
    const finalPrice =
      parseFloat(product.price) * (1 - product.discount_percent / 100)
    const res = await addToCart(product.id, finalPrice)
    if (!res.success) {
      alert(res.error)
    }
  }

  const isUnderOneHour = timeLeft.hours === 0

  // Format single digit numbers to double digits
  const formatTime = (num: number) => num.toString().padStart(2, "0")

  return (
    <div className='min-h-screen flex flex-col bg-[#0a0a0a] text-white'>
      <Navbar />

      {/* Decorative Blur Gradients */}
      <div className='absolute top-24 right-1/4 w-[600px] h-[600px] rounded-full bg-neonPink/5 blur-[120px] pointer-events-none' />
      <div className='absolute bottom-24 left-1/4 w-[600px] h-[600px] rounded-full bg-neonOrange/5 blur-[120px] pointer-events-none' />

      <main className='flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 w-full'>
        {/* Page Header */}
        <div className='text-center mb-16 space-y-4'>
          <span className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neonPink/30 bg-neonPink/5 text-neonPink font-rajdhani text-sm font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(255,105,180,0.1)]'>
            <Flame className='w-4 h-4' />
            GORĄCY CYKL PROMOCJI
          </span>
          <h1 className='font-orbitron font-extrabold text-3xl sm:text-5xl tracking-widest text-glow-pink'>
            STREFA <span className='text-gradient-orange-pink'>DEALS</span>
          </h1>
          <p className='font-rajdhani text-gray-400 max-w-xl mx-auto font-semibold tracking-wider text-base sm:text-lg'>
            Kultowe tytuły w wyjątkowo obniżonych cenach. Oferty zmieniają się
            co 24 godziny! Złap je, zanim znikną.
          </p>
        </div>

        {/* Dynamic Countdown Timer Widget */}
        <div className='max-w-xl mx-auto mb-16'>
          <div
            className={`backdrop-blur-md bg-black/60 border rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-lg transition-all duration-500 ${
              isUnderOneHour
                ? "border-neonPink bg-neonPink/5 animate-flash-neon shadow-[0_0_25px_rgba(255,105,180,0.3)]"
                : "border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            }`}
          >
            <div className='flex items-center gap-2 text-gray-400 font-rajdhani text-sm md:text-base font-bold tracking-widest uppercase mb-4'>
              <Clock
                className={`w-5 h-5 ${isUnderOneHour ? "text-neonPink animate-spin" : "text-neonOrange"}`}
              />
              <span>OFERTA KOŃCZY SIĘ ZA:</span>
            </div>

            {/* Numbers block */}
            <div className='flex items-center gap-4 md:gap-6 font-orbitron text-3xl sm:text-5xl font-black tracking-widest select-none'>
              <div className='flex flex-col items-center'>
                <span
                  className={
                    isUnderOneHour
                      ? "text-neonPink text-glow-pink"
                      : "text-white"
                  }
                >
                  {formatTime(timeLeft.hours)}
                </span>
                <span className='font-rajdhani text-xs font-bold text-gray-500 tracking-wider mt-1'>
                  GODZIN
                </span>
              </div>
              <span className='text-gray-600 self-start mt-1'>:</span>
              <div className='flex flex-col items-center'>
                <span
                  className={
                    isUnderOneHour
                      ? "text-neonPink text-glow-pink"
                      : "text-white"
                  }
                >
                  {formatTime(timeLeft.minutes)}
                </span>
                <span className='font-rajdhani text-xs font-bold text-gray-500 tracking-wider mt-1'>
                  MINUT
                </span>
              </div>
              <span className='text-gray-600 self-start mt-1'>:</span>
              <div className='flex flex-col items-center'>
                <span
                  className={
                    isUnderOneHour
                      ? "text-neonPink text-glow-pink animate-pulse"
                      : "text-neonOrange text-glow-pink"
                  }
                >
                  {formatTime(timeLeft.seconds)}
                </span>
                <span className='font-rajdhani text-xs font-bold text-gray-500 tracking-wider mt-1'>
                  SEKUND
                </span>
              </div>
            </div>

            {/* Under 1h Flashing Alert text */}
            {isUnderOneHour && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className='mt-6 font-rajdhani text-sm font-bold text-neonPink tracking-widest uppercase'
              >
                🚨 KRYTYCZNY CZAS! ZARAZ KONIEC PROMOCJI!
              </motion.div>
            )}
          </div>
        </div>

        {/* Deals Grid */}
        {loading ? (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='h-[450px] rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col justify-between p-6 animate-pulse'
              >
                <div className='space-y-4'>
                  <div className='w-full aspect-video rounded-xl bg-white/5' />
                  <div className='h-6 bg-white/5 rounded w-3/4' />
                  <div className='h-4 bg-white/5 rounded w-full' />
                </div>
                <div className='flex justify-between items-center'>
                  <div className='h-8 bg-white/5 rounded w-1/3' />
                  <div className='h-10 bg-white/5 rounded w-1/4' />
                </div>
              </div>
            ))}
          </div>
        ) : deals.length === 0 ? (
          <div className='backdrop-blur-md bg-black/40 border border-white/10 rounded-2xl p-16 text-center shadow-lg space-y-6'>
            <div className='w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-500'>
              <Tag className='w-8 h-8' />
            </div>
            <h3 className='font-orbitron font-bold text-xl text-white tracking-widest uppercase'>
              Brak aktywnych promocji
            </h3>
            <p className='font-rajdhani text-gray-400 max-w-sm mx-auto font-semibold'>
              W tym momencie wszystkie gry są sprzedawane w regularnych cenach.
              Wróć tu wkrótce!
            </p>
            <Link
              href='/store'
              className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neonCyan to-neonBlue text-black font-rajdhani text-sm font-bold tracking-wider rounded-xl shadow-lg'
            >
              <span>Przejdź do Sklepu</span>
              <ArrowRight className='w-4 h-4' />
            </Link>
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
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className='group relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-neonPink shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(255,105,180,0.2)] transition-all duration-300 flex flex-col h-full'
                >
                  {/* Discount percentage badge */}
                  <div className='absolute top-4 left-4 z-10 px-3.5 py-1 bg-neonPink text-black font-orbitron text-xs font-black rounded-lg shadow-[0_0_10px_#ff69b4] flex items-center gap-1 uppercase'>
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
                      PROMO HIT
                    </span>

                    <h3 className='font-orbitron font-bold text-xl tracking-wide group-hover:text-neonPink transition-colors mb-2 line-clamp-1'>
                      {product.name}
                    </h3>

                    <p className='font-rajdhani text-sm text-gray-400 font-semibold tracking-wider line-clamp-2 mb-6'>
                      {product.description}
                    </p>

                    {/* Pricing details and action button */}
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
      </main>

      <Footer />
    </div>
  )
}
