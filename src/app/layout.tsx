import type { Metadata } from "next";
import { Orbitron, Rajdhani, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rajdhani",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Xbox 360 Classics - Sklep z legendarnymi grami retro",
  description: "Odkryj na nowo złotą erę gamingu. Najlepsze, klasyczne gry na Xbox 360 w neonowym, ultra-stylowym sklepie internetowym.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${inter.variable} font-inter antialiased bg-[#0a0a0a] text-white`}
      >
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


