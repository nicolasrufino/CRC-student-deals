import type { Metadata } from 'next'
import { Viga, DM_Sans } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/lib/context/ThemeContext'

const viga = Viga({
  subsets: ['latin'],
  variable: '--font-viga',
  weight: '400'
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  weight: ['300', '400', '500']
})

export const metadata: Metadata = {
  title: 'Yapa — Student Discounts in Chicago',
  description: 'Verified student discounts at restaurants and cafés near you.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${viga.variable} ${dmSans.variable} antialiased`}
        style={{ background: 'var(--bg)', color: 'var(--text-primary)' }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}