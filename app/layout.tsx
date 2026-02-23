import type { Metadata } from 'next'
import { Viga, DM_Sans } from 'next/font/google'
import './globals.css'

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
      <body className={`${viga.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}