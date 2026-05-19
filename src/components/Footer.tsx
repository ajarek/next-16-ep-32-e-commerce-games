'use client';

import React from 'react';
import Link from 'next/link';
import { Gamepad2, Heart, Shield, RotateCcw, Truck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 relative z-10">
      {/* Mini features banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/5 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 rounded-lg bg-neonCyan/5 border border-neonCyan/10">
              <Truck className="w-6 h-6 text-neonCyan" />
            </div>
            <div>
              <h4 className="font-rajdhani font-bold text-base tracking-wider text-white">SZYBKA WYSYŁKA</h4>
              <p className="text-xs text-gray-500">Natychmiastowa dostawa cyfrowa lub kurier w 24h</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 rounded-lg bg-neonPink/5 border border-neonPink/10">
              <Shield className="w-6 h-6 text-neonPink" />
            </div>
            <div>
              <h4 className="font-rajdhani font-bold text-base tracking-wider text-white">PEWNY ZAKUP</h4>
              <p className="text-xs text-gray-500">Każda gra przetestowana i w 100% sprawna</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 rounded-lg bg-xboxGreen/5 border border-xboxGreen/10">
              <RotateCcw className="w-6 h-6 text-xboxGreen" />
            </div>
            <div>
              <h4 className="font-rajdhani font-bold text-base tracking-wider text-white">30 DNI NA ZWROT</h4>
              <p className="text-xs text-gray-500">Kupuj bez obaw z gwarancją zadowolenia</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 rounded-lg bg-neonCyan/5 border border-neonCyan/10">
              <Gamepad2 className="w-6 h-6 text-neonCyan" />
            </div>
            <div>
              <h4 className="font-rajdhani font-bold text-base tracking-wider text-white">RETRO KLIMAT</h4>
              <p className="text-xs text-gray-500">Prawdziwe, oryginalne emocje z Xbox 360</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand block */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-xboxGreen shadow-[0_0_10px_#107c10] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-orbitron font-bold text-lg tracking-widest text-gradient">
                XBOX 360 <span className="text-white">CLASSICS</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Sklep stworzony przez pasjonatów dla pasjonatów. Ożywiamy magię siódmej generacji konsol. Powróć do epickich historii, kultowego interfejsu Blades i legendarnych potyczek wieloosobowych.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-orbitron text-sm font-bold tracking-widest text-white mb-4">NAWIGACJA</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-400 hover:text-neonCyan transition-colors">Główna</Link>
              </li>
              <li>
                <Link href="/store" className="text-sm text-gray-400 hover:text-neonCyan transition-colors">Sklep z Grami</Link>
              </li>
              <li>
                <Link href="/deals" className="text-sm text-gray-400 hover:text-neonCyan transition-colors">Promocje i Zniżki</Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-neonCyan transition-colors">Nasza Historia</Link>
              </li>
            </ul>
          </div>

          {/* Copyright/Social placeholder */}
          <div>
            <h4 className="font-orbitron text-sm font-bold tracking-widest text-white mb-4">KONTAKT</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Masz pytania dotyczące zamówienia? Pisz śmiało:<br />
              <span className="text-neonCyan font-semibold">wsparcie@xbox360classics.pl</span>
            </p>
            <p className="text-xs text-gray-600 mt-4 leading-normal">
              Xbox 360 jest zarejestrowanym znakiem towarowym firmy Microsoft Corporation. Niniejsza strona ma charakter wyłącznie demonstracyjny (fanowski).
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Xbox 360 Classics. Wszystkie prawa zastrzeżone.</p>
          <p className="flex items-center gap-1 mt-4 md:mt-0">
            Stworzone z <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> dla graczy przez Antigravity.
          </p>
        </div>
      </div>
    </footer>
  );
};
