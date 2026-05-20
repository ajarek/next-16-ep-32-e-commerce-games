'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  Gamepad2, Sparkles, Trophy, Users, ArrowRight, 
  History, Cpu
} from 'lucide-react';

export default function AboutPage() {
  // Timeline events representing the gold era of Xbox 360
  const timelineEvents = [
    {
      year: '2005',
      title: 'Narodziny Legendy',
      desc: 'Premiera konsoli Xbox 360 na świecie. Wprowadzenie legendarnego, zakładkowego interfejsu "Blades Dashboard", który na zawsze zapisał się w pamięci graczy.',
      color: 'border-neonCyan hover:shadow-[0_0_15px_#00ffff]',
      textGlow: 'text-neonCyan text-glow-cyan'
    },
    {
      year: '2007',
      title: 'Złota Era Multiplayera',
      desc: 'Premiera Halo 3, Gears of War oraz Call of Duty 4: Modern Warfare. Xbox Live staje się absolutnym liderem rozgrywek wieloosobowych i redefiniuje wspólne granie.',
      color: 'border-neonPink hover:shadow-[0_0_15px_#ff69b4]',
      textGlow: 'text-neonPink text-glow-pink'
    },
    {
      year: '2010',
      title: 'Nowa Konstrukcja & Sensory',
      desc: 'Wejście na rynek odświeżonej wersji konsoli Xbox 360 S (Slim) z wbudowanym Wi-Fi oraz premiera rewolucyjnego sensora ruchu Kinect, który poruszył całe rodziny.',
      color: 'border-xboxGreen hover:shadow-[0_0_15px_#107c10]',
      textGlow: 'text-xboxGreen text-glow-green'
    },
    {
      year: 'Dziś',
      title: 'Nostalgia i Dziedzictwo',
      desc: 'Chociaż oficjalne serwery powoli przechodzą do historii, miłość do gier z tamtej generacji nie gaśnie. Nasz sklep pozwala Ci na nowo ożywić te wspaniałe wspomnienia.',
      color: 'border-neonCyan hover:shadow-[0_0_15px_#00ffff]',
      textGlow: 'text-neonCyan text-glow-cyan'
    }
  ];

  // Reasons why Xbox 360 was special
  const features = [
    {
      icon: <Cpu className="w-8 h-8 text-neonCyan" />,
      title: 'Interfejs Blades',
      desc: 'Najbardziej kultowy, szeleszczący dashboard w historii konsol. Prosty, futurystyczny i niesamowicie klimatyczny.'
    },
    {
      icon: <Trophy className="w-8 h-8 text-neonPink" />,
      title: 'Gamerscore i Osiągnięcia',
      desc: 'System, który zrewolucjonizował branżę. Dźwięk odblokowywanego osiągnięcia (Achievement Unlocked) do dziś wywołuje gęsią skórkę.'
    },
    {
      icon: <Users className="w-8 h-8 text-xboxGreen" />,
      title: 'Xbox Live & Party Chat',
      desc: 'Miejsce, gdzie narodziły się setki przyjaźni. Rozmowy grupowe w trakcie gry w Halo lub Gearsy zdefiniowały współczesną społeczność online.'
    },
    {
      icon: <Gamepad2 className="w-8 h-8 text-neonCyan" />,
      title: 'Najlepszy Kontroler',
      desc: 'Ergonomia padów do Xbox 360 stała się złotym standardem w branży, kopiowanym przez konkurencję przez kolejne lata.'
    }
  ];

  // Motion variants for clean stagger animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-36 left-10 w-[400px] h-[400px] rounded-full bg-neonCyan/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] rounded-full bg-neonPink/5 blur-[150px] pointer-events-none" />

      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto space-y-24">
          
          {/* Hero Section */}
          <section className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neonCyan/30 bg-neonCyan/5 shadow-[0_0_15px_rgba(0,255,255,0.1)] text-neonCyan font-rajdhani text-sm font-bold tracking-widest uppercase"
            >
              <History className="w-4 h-4" />
              <span>Ocalić od Zapomnienia</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-orbitron font-extrabold text-4xl sm:text-6xl tracking-widest leading-tight"
            >
              ZŁOTA ERA <br />
              <span className="text-gradient">GAMINGU Retro</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-rajdhani text-lg sm:text-2xl text-gray-300 max-w-3xl mx-auto font-semibold tracking-wider leading-relaxed"
            >
              Jesteśmy graczami z krwi i kości. Xbox 360 Classics powstał z czystej pasji do generacji, która ukształtowała współczesną kulturę gier wideo.
            </motion.p>
          </section>

          {/* Mission Section */}
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_10px_30px_rgba(0,0,0,0.6)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-neonCyan/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-neonPink/10 rounded-full blur-2xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-6">
                <h2 className="font-orbitron font-bold text-2xl sm:text-3xl tracking-wider text-neonCyan text-glow-cyan">
                  Nasza Misja
                </h2>
                <p className="font-rajdhani text-base sm:text-lg text-gray-300 font-semibold tracking-wider leading-relaxed">
                  Złota era Xbox 360 to nie tylko wspaniałe gry – to przede wszystkim niezapomniane emocje, wieczory spędzone z przyjaciółmi i powiew technologicznej rewolucji. Naszym celem jest zachowanie i udostępnianie najlepszych gier tej generacji w nowoczesnej, łatwo dostępnej cyfrowej formie na Twój profil gracza.
                </p>
                <p className="font-rajdhani text-base sm:text-lg text-gray-300 font-semibold tracking-wider leading-relaxed">
                  Dbamy o to, by każda gra w naszym katalogu była w pełni sprawna, oryginalna i gotowa do natychmiastowego odpalenia. Wracamy do czasów, gdy gry były kompletne w dniu premiery, a zabawa na kanapie była najważniejsza.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-48 h-48 rounded-full border-2 border-dashed border-neonPink/30 flex items-center justify-center p-4 relative animate-[spin_40s_linear_infinite]">
                  <div className="w-full h-full rounded-full border-2 border-neonPink/60 flex items-center justify-center animate-[spin_20s_linear_infinite_reverse]">
                    <Gamepad2 className="w-16 h-16 text-neonPink filter drop-shadow-[0_0_10px_rgba(255,105,180,0.6)]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Timeline Section */}
          <section className="space-y-12">
            <div className="text-center space-y-2">
              <span className="font-rajdhani text-sm font-bold tracking-widest text-neonPink uppercase">Podróż w czasie</span>
              <h2 className="font-orbitron font-bold text-3xl tracking-wider uppercase">HISTORIA XBOX 360</h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-neonPink to-neonOrange mx-auto mt-4 shadow-[0_0_8px_#ff69b4]" />
            </div>

            <div className="relative border-l-2 border-white/10 ml-4 md:ml-32 space-y-12 py-4">
              {timelineEvents.map((event, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative pl-8 md:pl-12 group"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-[#0a0a0a] border-4 border-white/20 group-hover:border-neonCyan transition-colors duration-300 shadow-[0_0_10px_rgba(0,0,0,0.8)]" />
                  
                  {/* Year Tag (Absolute on larger screen) */}
                  <div className="md:absolute md:-left-32 md:top-0 font-orbitron font-black text-2xl tracking-widest text-glow-cyan text-neonCyan mb-2 md:mb-0 w-24 text-left md:text-right">
                    {event.year}
                  </div>

                  {/* Event card */}
                  <div className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-neonCyan shadow-[0_10px_20px_rgba(0,0,0,0.3)] ${event.color}`}>
                    <h3 className={`font-orbitron font-bold text-lg tracking-wider mb-2 ${event.textGlow}`}>
                      {event.title}
                    </h3>
                    <p className="font-rajdhani text-sm sm:text-base text-gray-400 font-semibold tracking-wider leading-relaxed">
                      {event.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Special features grid */}
          <section className="space-y-12">
            <div className="text-center space-y-2">
              <span className="font-rajdhani text-sm font-bold tracking-widest text-neonCyan uppercase">Dlaczego ta konsola?</span>
              <h2 className="font-orbitron font-bold text-3xl tracking-wider uppercase">CO CZYNIŁO JĄ WYJĄTKOWĄ</h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-neonCyan to-neonBlue mx-auto mt-4 shadow-[0_0_8px_#00ffff]" />
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {features.map((feat, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="backdrop-blur-md bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-6 flex gap-4 transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
                >
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 shrink-0 self-start">
                    {feat.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-orbitron font-bold text-lg tracking-wider text-white">
                      {feat.title}
                    </h3>
                    <p className="font-rajdhani text-sm text-gray-400 font-semibold tracking-wider leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* Call to Action Footer Section */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center backdrop-blur-md bg-gradient-to-br from-white/5 to-white/10 border border-white/15 rounded-3xl p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.7)] border-neonCyan/30 relative overflow-hidden"
          >
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-neonCyan/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-neonPink/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-8">
              <Sparkles className="w-12 h-12 text-neonCyan mx-auto filter drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] animate-pulse" />
              
              <div className="space-y-4">
                <h2 className="font-orbitron font-extrabold text-2xl sm:text-4xl tracking-widest uppercase">
                  DOŁĄCZ DO <span className="text-gradient">GRY JUŻ TERAZ</span>
                </h2>
                <p className="font-rajdhani text-base sm:text-xl text-gray-300 font-semibold tracking-wider max-w-2xl mx-auto leading-relaxed">
                  Przejdź do naszego katalogu i wybierz swoje ulubione tytuły z dzieciństwa. Przypomnij sobie legendarną rozgrywkę w najlepszych cenach!
                </p>
              </div>

              <div>
                <Link
                  href="/store"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-neonCyan to-neonBlue text-black font-rajdhani text-lg font-bold tracking-widest rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 group"
                >
                  <span>✨ Odwiedź Sklep</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
