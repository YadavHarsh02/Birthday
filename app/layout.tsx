import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Outfit, Great_Vibes } from 'next/font/google'
import './globals.css'
import { ScrollToTop } from '@/components/ScrollToTop'

const playfair = Playfair_Display({ variable: '--font-serif', subsets: ['latin'], style: ['normal', 'italic'] })
const outfit = Outfit({ variable: '--font-sans', subsets: ['latin'] })
const greatVibes = Great_Vibes({ weight: '400', variable: '--font-cursive', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Happy Birthday',
  description: 'A celebratory interactive birthday experience with games and memories',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`scroll-smooth bg-background ${playfair.variable} ${outfit.variable} ${greatVibes.variable}`}>
      <body className="font-sans antialiased text-foreground">
        {children}
        <ScrollToTop />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
