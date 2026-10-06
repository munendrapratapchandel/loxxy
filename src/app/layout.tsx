import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LOXXY | Built to Compete. Designed to Dominate.',
  description: 'Premier competitive Minecraft esports hub. High-tier PvP divisions, 3D character rigs, tournament championships, and official roster.',
  keywords: ['Minecraft', 'Esports', 'PvP', 'Loxxy', 'High Tier', 'Sword PvP', 'Crystal PvP', 'Mace PvP', 'Competitive Minecraft'],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark-950 text-slate-100 antialiased min-h-screen selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
